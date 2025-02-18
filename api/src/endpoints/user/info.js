import { authenticate } from '#src/common/auth.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY)

export const getUserInfo = async (req, res) => {
	const { stripeCustomerId, newAuthCookie } = authenticate()

	const userInfo = stripe.customers.retrieve(stripeCustomerId)

	res.writeHead(200, {
		'Content-Type': 'application/json',
		'Set-Cookie': newAuthCookie,
	})
	res.send(JSON.stringify({

	}))
}
