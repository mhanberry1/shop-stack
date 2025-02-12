import {
	addProduct,
	updateProduct,
	getAllProducts,
	deleteProduct,
} from '#src/common/db.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY)

export const createProducts = async (req, res) => {
	const { products } = req.body

	for (const product of products) {
		const {
			stripeArgs,
			quantity,
		} = product

		const stripeProductId =
			(await stripe.products.create(stripeArgs)).id

		await addProduct(stripeProductId, quantity)
	}

	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({
		message: 'The products were successfully added.',
	}))
	res.sent = true
}

export const updateProducts = async (req, res) => {
	const { products } = req.body

	for (const product of products) {
		const {
			stripeArgs,
			stripeProductId,
			quantity,
			price,
		} = product

		let newPriceId

		if (price != undefined) {
			newPriceId = (await stripe.prices.create({
				currency: 'usd',
				unit_amount: Math.floor(price * 100),
				product: stripeProductId,
			})).id
		}

		await stripe.products.update(
			stripeProductId,
			{
				...stripeArgs,
				default_price: newPriceId,
			}
		)

		if (quantity == undefined) return

		await updateProduct(stripeProductId, quantity)
	}

	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({
		message: 'The products were successfully updated.',
	}))
	res.sent = true
}

export const listProducts = async (req, res) => {
	const dbProducts = await getAllProducts()

	const stripeProducts = (await stripe.products.list({
		ids: dbProducts.map(p => p.stripeProductId),
	})).data

	const products = dbProducts.map(dbProd => ({
		...stripeProducts.find(
			sProd => sProd.id == dbProd.stripeProductId
		),
		...dbProd,
	}))

	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({ products }))
	res.sent = true
}

export const deleteProducts = async (req, res) => {
	const { stripeProductIds } = req.body

	for (const stripeProductId of stripeProductIds) {
		await stripe.products.update(
			stripeProductId,
			{ active: false },
		)

		await deleteProduct(stripeProductId)
	}

	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({
		message: 'The products were successfully deleted.',
	}))
	res.sent = true
}
