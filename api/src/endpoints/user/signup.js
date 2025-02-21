import { getUser, addUser } from '#src/common/db.js'
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

	const user = await getUser(username)

	if (user) {
		res.writeHead(400, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({
			message: 'That username is already taken.',
		}))
		res.sent = true
		return
	}

	const stripeCustomerId =
		(await stripe.customers.create({ email, name })).id

	const verificationCode = Math.floor(Math.random() * Math.pow(10, 5))

	await addUser(
		stripeCustomerId,
		username,
		makeSaltHash(password),
		verificationCode,
	)

	const emailMessage = `
		Hi ${username},

		Welcome to Stitch Cafe's online shop!

		Here is your account verification code:
		${verificationCode}
	`.replace(/\t/g, '')

	await sendEmail(email, 'account verification', emailMessage)

	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({
		message: 'Your account was successfully created.',
	}))
	res.sent = true
}
