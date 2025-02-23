import { authenticate } from '#src/common/auth.js'
import {
	addProduct,
	updateProduct,
	getAllProducts,
	getProduct,
	deleteProduct,
} from '#src/common/db.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY)

export const createProducts = async (req, res) => {
	const { username, isAdmin } = authenticate(req, res)
	const { products } = req.body

	if ( !isAdmin ) {
		res.writeHead(401, {
			'Content-Type': 'application/json',
		})
		res.end(JSON.stringify({
			message: 'The user is not authorized to create products.', 
		}))
		res.sent = true
		return;
	}

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
	const { username, isAdmin } = authenticate(req, res)
	const { products } = req.body

	if ( !isAdmin ) {
		res.writeHead(401, {
			'Content-Type': 'application/json',
		})
		res.end(JSON.stringify({
			message: 'The user is not authorized to update products.', 
		}))
		res.sent = true
		return;
	}

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
	let dbProducts

	if (req.queryParams.get('stripeProductIds')) {
		const stripeProductIds =
			JSON.parse(req.queryParams.get('stripeProductIds') || '[]')
		dbProducts = stripeProductIds.map(id => getProduct(id))
	} else {
		dbProducts = await getAllProducts()
	}

	const stripeProducts = (await stripe.products.list({
		ids: dbProducts.map(p => p.stripeProductId),
		expand: ['data.default_price', 'data.tax_code'],
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
	const { username, isAdmin } = authenticate(req, res)
	const { stripeProductIds } = req.body

	if ( !isAdmin ) {
		res.writeHead(401, {
			'Content-Type': 'application/json',
		})
		res.end(JSON.stringify({
			message: 'The user is not authorized to delete products.', 
		}))
		res.sent = true
		return;
	}

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
