import http from 'http'
import { getRouteHandler } from '#src/routes.js'

const handleCORS = res => {
	if (res.sent) return

	res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN)
	res.setHeader('Access-Control-Allow-Credentials', 'true')
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS',
	)
}

const server = http.createServer(async (req, res) => {
	handleCORS(res)

	if (req.method == 'OPTIONS') {
		res.writeHead(200)
		res.end()
		res.sent = true
		return
	}

	const routeHandler = getRouteHandler(req, res)
	let body = ''

	req.queryParams = new URLSearchParams(req.url.split('?')[1])

	req.on('data', chunk => {
		body += chunk
	})

	req.on('end', async () => {

		try {
			req.body = req.url == '/upload'
				? body
				: JSON.parse(body || '{}')
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
