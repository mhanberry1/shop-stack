import { authenticate } from '#src/common/auth.js'
import { makeSaltHash } from '#src/common/hash.js'
import { updateUser as updateUserDb } from '#src/common/db.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY)

export const updateUser = async (req, res) => {
	const { username, stripeCustomerId } = authenticate()
	const { password, stripeArgs } = req.body

	await stripe.customers.update(stripeCustomerId, stripeArgs)
	await updateUserDb(username, makeSaltHash(password))
}
