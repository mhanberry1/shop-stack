import { authenticate } from '#src/common/auth.js'
import { makeSaltHash } from '#src/common/hash.js'
import {
	updateUser as updateUserDb,
	deleteUser as deleteUserDb,
} from '#src/common/db.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY)

export const getUserInfo = async (req, res) => {
	const { stripeCustomerId } = authenticate(req, res)

	const userInfo = await stripe.customers.retrieve(stripeCustomerId)

	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify(userInfo))
}

export const updateUser = async (req, res) => {
	const {
		stripeCustomerId,
		username,
	} = authenticate(req, res)
	const { password, stripeArgs } = req.body

	await stripe.customers.update(stripeCustomerId, stripeArgs)

	if (password) {
		await updateUserDb(username, makeSaltHash(password))
	}

	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({ message: 'User info has been updated.' }))
}

export const deleteUser = async (req, res) => {
	const { stripeCustomerId, username } = authenticate(req, res)

	await deleteUserDb(username)
	await stripe.customers.del(stripeCustomerId)

	res.writeHead(400, {
		'Content-Type': 'application/json',
	})
	res.end(JSON.stringify({
		message: 'The user has been deleted.',
	}))
	res.sent = true
}
