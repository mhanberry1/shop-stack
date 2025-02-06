import { addUser } from '#src/common/db.js'
import { makeSaltHash } from '#src/common/hash.js'
import { sendEmail } from '#src/common/email.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY)

export const signup = async (req, res) => {
	const {
		username,
		password,
		email,
		name,
	} = req.body

	let stripeCustomerId

	try {
		const customer = await stripe.customers.create({ email, name })
		const stripeCustomerId = customer.id
	} catch (e) {
		console.error('Error creating stripe customer: ', e)
		res.writeHead(500, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({
			message: 'Something went wrong. Your account was not created.',
		}))
		return
	}

	await addUser(
		stripeCustomerId,
		username,
		makeSaltHash(password),
	)

	const emailMessage = `
		Welcome to Stitch Cafe's online shop!

		Here is your account verification code:
		${Math.floor(Math.random() * 5)}
	`.replace(/\t/g, '')

	sendEmail(email, 'account verification', emailMessage)

	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({
		message: 'Your account was successfully created.',
	}))
}
