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
	const cookie = req.headers['Cookie']
	const token = Object.fromEntries(
		cookie.split(';').spit('=').trim()
	)['authToken']
	const [ payload, signature ] = token
		.split('.')
		.map(a => atob(a))
	const expectedSig = crypto
		.createHmac('sha256', process.env.SECRET)
		.update(payload)
		.digest('ascii')

	if (signature == expectedSig) return

	res.writeHead(400, {
		'Content-Type': 'application/json',
	})
	res.end(JSON.stringify({
		message: 'The user could not be authenticated.',
	}))

	const error = new Error('The user could not be authenticated.')
	error.name = 'AuthenticationError'
	
	throw error
}
