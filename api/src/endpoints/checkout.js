import {
	getProduct,
	updateProduct,
} from '#src/common/db.js'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY)

export const checkout = async (req, res) => {
	const { stripeArgs } = req.body

	const checkoutUrl =
		(await stripe.checkout.sessions.create(stripeArgs)).url

	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({ checkoutUrl }))
	res.sent = true
}

export const finishCheckout = async (req, res) => {
	const stripeSignature = req.headers['stripe-signature']
	const webhookEvent = await stripe.webhooks.constructEvent(
		req.body,
		stripeSignature,
		process.env.SECRET,
	)

	if (event.type != 'checkout.session.completed') {
		res.writeHead(400, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({
			message: 'Invalid event type.',
		}))
		res.sent = true
		return
	}

	// Send the response now to avoid a session timeout
	res.end(200)
	res.sent = true

	const lineItems = event.data.object.line_items.data

	lineItems.forEach(async item => {
		const stripeProductId = item.id
		const purchaseQuantity = item.quantity
		const { quantity } = await getProduct()

		updateProduct(
			stripeProductId,
			Math.max(0, quantity - purchaseQuantity),
		)
	})
}
