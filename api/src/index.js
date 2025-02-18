import http from 'http'
import { parse } from 'url'
import { signup } from '#src/endpoints/user/signup.js'
import { verify } from '#src/endpoints/user/verify.js'
import { login } from '#src/endpoints/user/login.js'
import { logout } from '#src/endpoints/user/logout.js'
import { updateUser } from '#src/endpoints/user/update.js'
import { deleteUser } from '#src/endpoints/user/delete.js'
import {
	createProducts,
	updateProducts,
	listProducts,
	deleteProducts,
} from '#src/endpoints/products.js'
import { checkout } from '#src/endpoints/checkout.js'

const routes = {
	'POST /user/signup': signup,
	'POST /user/verify': verify,
	'POST /user/login': login,
	'POST /user/logout': logout,
	'POST /user/update': updateUser,
	'DELETE /user': deleteUser,
	'PUT /products': createProducts,
	'POST /products': updateProducts,
	'GET /products': listProducts,
	'DELETE /products': deleteProducts,
	'POST /checkout': checkout,
}

const server = http.createServer(async (req, res) => {
	req.url = new URL(`http://${req.headers.host}${req.url}`)

	const { method, url } = req
	const routeKey = `${method} ${url.pathname}`
	const routeHandler = routes[routeKey]

	if (!routeHandler) {
		res.writeHead(404, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ message: 'Not Found' }))
		return
	}

	let body = ''

	req.on('data', chunk => {
		body += chunk.toString()
	})

	req.on('end', async () => {
		try {
			req.body = JSON.parse(body || '{}')
		} catch (e) {
			res.writeHead(400, { 'Content-Type': 'application/json'})
			res.end(JSON.stringify({ message: 'request JSON body malformed.' }))
			return
		}

		try {
			await routeHandler(req, res)
		} catch (e) {
			console.error(e)

			if (res.sent) return

			res.writeHead(500, { 'Content-Type': 'application/json'})
			res.end(JSON.stringify({ message: 'Internal Server Error.' }))
		}
	})
})

server.listen(8080, '0.0.0.0', () => {
	console.log('Server running')
})
