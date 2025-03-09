import {
	getProduct,
	updateProduct,
} from '#src/common/db.js'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY)
const freeShippingThreshold = 4500
const baseShippingPrice = 600

export const checkout = async (req, res) => {
	const { stripeArgs } = req.body
	const lineItems = stripeArgs.line_items.map(
		item => ({
			...item,
			price: stripe.prices.retrieve(item.price),
		})
	)
	const totalAmount = await lineItems.reduce(
		async (acc, { quantity, price }) => {
			return await acc + quantity * (await price).unit_amount
		}, 0
	)
	const pickup = stripeArgs.metadata.pickup
	const freeShipping = pickup || totalAmount >= freeShippingThreshold
	const checkoutUrl =
		(await stripe.checkout.sessions.create({
			...stripeArgs,
			shipping_options: !freeShipping ? [{
				shipping_rate_data: {
					display_name: 'Standard ground shipping',
					type: 'fixed_amount',
					fixed_amount: {
						currency: 'USD',
						amount: baseShippingPrice,
					},
				}
			}] : undefined,
		})).url

	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({ checkoutUrl }))
	res.sent = true
}

export const finishCheckout = async (req, res) => {
	const stripeSignature = req.headers['stripe-signature']
	const webhookEvent = await stripe.webhooks.constructEvent(
		req.rawBody,
		stripeSignature,
		process.env.STRIPE_WEBHOOK_SECRET,
	)

	if (req.body.type != 'checkout.session.completed') {
		res.writeHead(400, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({
			message: 'Invalid event type.',
		}))
		res.sent = true
		return
	}

	// Send the response now to avoid a session timeout
	res.end()
	res.sent = true

	const sessionId = req.body.data.object.id
	const lineItems = (await
		stripe.checkout.sessions.listLineItems(sessionId)
	).data

	lineItems.forEach(async item => {
		const stripeProductId = item.price.product
		const purchaseQuantity = item.quantity
		const { quantity } = await getProduct(stripeProductId)

		updateProduct(
			stripeProductId,
			Math.max(0, quantity - purchaseQuantity),
		)
	})
}
