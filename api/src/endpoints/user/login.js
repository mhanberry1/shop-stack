import { getUser } from '#src/common/db.js'
import { verifySaltHash } from '#src/common/hash.js'
import { makeToken } from '#src/common/auth.js'

export const login = async (req, res) => {
	const { username, password } = req.body

	try {
		const user = await getUser(username)
	} catch (e) {
		res.writeHead(400, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({
			message: 'There is no user with that username.',
		}))
		return
	}

	if (!verifySaltHash(password, user.password)) {
		res.writeHead(400, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({
			message: 'Incorrect password.',
		}))
		return
	}

	res.writeHead(200, {
		'Content-Type': 'application/json',
		'Set-Cookie': `authToken=${makeToken(username)}`,
	})
}
