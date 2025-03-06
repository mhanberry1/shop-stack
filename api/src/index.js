import { promises as fs } from 'fs'
import http from 'http'
import https from 'https'
import { getRouteHandler } from '#src/routes.js'

const certDir = `/certs/live/${process.env.BACKEND_DOMAIN}`

const handleCORS = res => {
	if (res.sent) return

	res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN)
	res.setHeader('Access-Control-Allow-Credentials', 'true')
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS',
	)
}

const initServer = async (req, res) => {
	handleCORS(res)

	if (req.method == 'OPTIONS') {
		res.writeHead(200)
		res.end()
		res.sent = true
		return
	}

	const routeHandler = getRouteHandler(req, res)
	let body = Buffer.alloc(0)

	req.queryParams = new URLSearchParams(req.url.split('?')[1])

	req.on('data', chunk => {
		body = Buffer.concat([body, chunk])
	})

	req.on('end', async () => {
		try {
			req.body = req.url == '/upload'
				? body
				: JSON.parse(body.toString() || '{}')
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
}

const getCerts = async () => ({
    key: await fs.readFile(`${certDir}/privkey.pem`),
    cert: await fs.readFile(`${certDir}/fullchain.pem`),
})

let server

if (process.env.API_COMMAND == 'dev') {
    server = http.createServer(initServer)
} else {
    server = https.createServer(await getCerts(), initServer)

    // Reload the certs every 5 mins in case they were refreshed
    setInterval(async () =>
		server.setSecureContext(await getCerts()),
        5 * 60 * 1000,
    )
}


server.listen(8080, '0.0.0.0', () => {
	console.log('Server running')
})
