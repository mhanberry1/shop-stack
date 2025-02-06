import { authenticate } from '#src/common/auth.js'
import { deleteUser as deleteUserFromDb } from '#src/common/db.js'

export const deleteUser = async (req, res) => {
	const username = authenticate(req, res)

	await deleteUserFromDb(username)
}
