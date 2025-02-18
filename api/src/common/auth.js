import crypto from 'crypto'

export const makeToken = (stripeCustomerId, username, isAdmin) => {
	const expiration =
		Date.now() + 60 * 24 * 60 * 60 * 1000
	const payload = btoa(JSON.stringify({
		stripeCustomerId,
		username,
		isAdmin,
		expiration,
	}))
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
		) || []
	)['authToken']

	if (!token) {
		res.writeHead(400, {
			'Content-Type': 'application/json',
		})
		res.end(JSON.stringify({
			message: 'The auth token is missing.', 
		}))
		res.sent = true

		const error = new Error('The user could not be authenticated.')
		error.name = 'AuthenticationError'
		throw error
	}

	const [ payload, signature ] = token
		.split('.')
	const expectedSig = crypto
		.createHmac('sha256', process.env.SECRET)
		.update(payload)
		.digest('base64')
	const {
		username,
		isAdmin,
		expiration,
	} = JSON.parse(atob(payload))

	if (signature != expectedSig) {
		res.writeHead(400, {
			'Content-Type': 'application/json',
		})
		res.end(JSON.stringify({
			message: 'The auth token is invalid.', 
		}))
		res.sent = true

		const error = new Error('The user could not be authenticated.')
		error.name = 'AuthenticationError'
		throw error
	}

	if (Date.now() > new Date(expiration).getTime()) {
		res.writeHead(498, {
			'Content-Type': 'application/json',
		})
		res.end(JSON.stringify({
			message: 'The auth token has expired.',
		}))
		res.sent = true

		const error = new Error('The user could not be authenticated.')
		error.name = 'AuthenticationError'
		throw error
	}

	const newAuthCookie = [
		`authToken=${makeToken(stripeCustomerId, username, isAdmin)}`,
		'HttpOnly',
		'Secure',
		'SameSite=Strict',
	].join('; ')

	return { username, isAdmin, newAuthCookie }
}
