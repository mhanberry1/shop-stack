import { verifyUser } from '#src/common/db.js'

export const verify = async (req, res) => {
	const { username, verificationCode } = req.body

	try {
		await verifyUser(username, verificationCode)
	} catch (e) {
		res.writeHead(400, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({
			message: 'The user could not be verified.',
		}))
		res.sent = true
		return
	}

	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({
		message: 'The user has been verified.',
	}))
	res.sent = true
}
