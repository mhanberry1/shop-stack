import http from 'http'
import { getRouteHandler } from '#src/routes.js'

const handleCORS = res => {
	res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN)
	res.setHeader('Access-Control-Allow-Credentials', 'true')
}

const server = http.createServer(async (req, res) => {
	const routeHandler = getRouteHandler(req, res)
	let body = ''

	req.on('data', chunk => {
		body += chunk.toString()
	})

	req.on('end', async () => {
		handleCORS(res)

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
