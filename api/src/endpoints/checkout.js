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
