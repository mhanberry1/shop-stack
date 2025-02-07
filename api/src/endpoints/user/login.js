import { getUser } from '#src/common/db.js'
import { verifySaltHash } from '#src/common/hash.js'
import { makeToken } from '#src/common/auth.js'

export const login = async (req, res) => {
	const { username, password } = req.body

	let user

	try {
		user = await getUser(username)
	} catch (e) {
		res.writeHead(400, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({
			message: 'There is no user with that username.',
		}))
		res.sent = true
		return
	}

	if (!verifySaltHash(password, user.password)) {
		res.writeHead(400, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({
			message: 'Incorrect password.',
		}))
		res.sent = true
		return
	}

	if (false && !user.isVerified) {
		res.writeHead(401, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({
			message: 'This account has not been verified.',
		}))
		res.sent = true
		return
	}

	res.writeHead(200, {
		'Content-Type': 'application/json',
		'Set-Cookie': `authToken=${makeToken(username)}`,
	})
	res.end(JSON.stringify({
		message: 'The user has been logged in.',
	}))
	res.sent = true
}
