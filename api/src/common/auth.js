import crypto from 'crypto'

export const makeToken = username => {
	const payload = btoa(username)
	const signature = crypto
		.createHmac('sha256', process.env.SECRET)
		.update(payload)
		.digest('base64')

	return `${payload}.${signature}`
}

export const authenticate = (req, res) => {
	const cookie = req.headers['cookie']
	const token = Object.fromEntries(
		cookie?.split(';').map(
			e => e.trim().split(/=(.*)/s).slice(0,2)
		)
	)['authToken']
	const [ payload, signature ] = token
		.split('.')
	const expectedSig = crypto
		.createHmac('sha256', process.env.SECRET)
		.update(payload)
		.digest('base64')
	const username = atob(payload)

	if (signature == expectedSig) return username

	res.writeHead(400, {
		'Content-Type': 'application/json',
	})
	res.end(JSON.stringify({
		message: 'The user could not be authenticated.',
	}))
	res.sent = true

	const error = new Error('The user could not be authenticated.')
	error.name = 'AuthenticationError'
	
	throw error
}
