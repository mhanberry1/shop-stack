import http from 'http'
import { parse } from 'url'
import { signup } from '#src/endpoints/user/signup.js'
import { verify } from '#src/endpoints/user/verify.js'
import { login } from '#src/endpoints/user/login.js'
import { logout } from '#src/endpoints/user/logout.js'
import { deleteUser } from '#src/endpoints/user/delete.js'
import { updateProducts, listProducts } from '#src/endpoints/products.js'
import { checkout } from '#src/endpoints/checkout.js'

const routes = {
	'POST /user/signup': signup,
	'POST /user/verify': verify,
	'POST /user/login': login,
	'POST /user/logout': logout,
	'DELETE /user': deleteUser,
	'POST /products': updateProducts,
	'GET /products': listProducts,
	'POST /checkout': checkout,
}

const server = http.createServer(async (req, res) => {
	const { method, url } = req
	const routeKey = `${method} ${url}`
	const routeHandler = routes[routeKey]

	if (!routeHandler) {
		res.writeHead(404, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ message: 'Not Found' }))
		return;
	}

	let body = ''

	req.on('data', chunk => {
		body += chunk.toString()
	})

	req.on('end', async () => {
		req.body = JSON.parse(body)
		await routeHandler(req, res)
	})
})

server.listen(8080, '127.0.0.1', () => {
	console.log('Server running')
})
