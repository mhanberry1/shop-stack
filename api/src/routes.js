import { signup } from '#src/endpoints/user/signup.js'
import { verify } from '#src/endpoints/user/verify.js'
import { login } from '#src/endpoints/user/login.js'
import { logout } from '#src/endpoints/user/logout.js'
import {
	getUserInfo,
	updateUser,
	deleteUser
} from '#src/endpoints/user/index.js'
import {
	createProducts,
	updateProducts,
	listProducts,
	deleteProducts,
} from '#src/endpoints/products.js'
import { checkout } from '#src/endpoints/checkout.js'
import { upload } from '#src/endpoints/upload.js'

const routes = {
	'POST /user': updateUser,
	'GET /user': getUserInfo,
	'DELETE /user': deleteUser,
	'POST /user/signup': signup,
	'POST /user/verify': verify,
	'POST /user/login': login,
	'GET /user/logout': logout,
	'PUT /products': createProducts,
	'POST /products': updateProducts,
	'GET /products': listProducts,
	'DELETE /products': deleteProducts,
	'POST /checkout': checkout,
	'POST /upload': upload,
}

export const getRouteHandler = (req, res) => {
	const url = new URL(`http://${req.headers.host}${req.url}`)
	const { method } = req
	const routeKey = `${method} ${url.pathname}`
	const routeHandler = routes[routeKey]

	if (!routeHandler) {
		res.writeHead(404, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ message: 'Not Found' }))
		res.sent = true
		return
	}

	return routeHandler
}
