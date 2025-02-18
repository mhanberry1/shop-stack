import { authenticate } from '#src/common/auth.js'
import { deleteUser as deleteUserFromDb } from '#src/common/db.js'

export const deleteUser = async (req, res) => {
	const { username } = authenticate(req, res)

	await deleteUserFromDb(username)

	res.writeHead(400, {
		'Content-Type': 'application/json',
	})
	res.end(JSON.stringify({
		message: 'The user has been deleted.',
	}))
	res.sent = true
}
