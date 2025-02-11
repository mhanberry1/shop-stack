import mysql from 'mysql2/promise'

const connect = () => mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: 'shop_stack',
})

// User operations

export const addUser = async (stripeCustomerId, username, password) => {
	const connection = await connect()

	await connection.query(
		`
			INSERT INTO users (stripeCustomerId, username, password, isAdmin)
				SELECT ?, ?, ?, (SELECT COUNT(*) FROM users) = 0;
		`,
		[stripeCustomerId, username, password],
	)
	await connection.end()
}

export const verifyUser = async (username, verificationCode) => {
	const connection = await connect()

	await connection.query(
		`
			UPDATE users SET isVerified = true
				WHERE username = ? AND verificationCode = ?;
		`,
		[username, verificationCode]
	)
	await connection.end()

	if (result.affectedRows == 0) {
		const error = new Error('the user could not be verified')
		error.name = 'VerificationFailed'
		throw error
	}
}

export const getUser = async username => {
	const connection = await connect()

	const results = await connection.query(
		'SELECT * FROM users WHERE username = ?',
		[username],
	)
	await connection.end()

	if (results.length == 0) {
		const error = new Error('the user could not be found')
		error.name = 'UserNotFound'
		throw error
	}

	return results[0][0]
}

export const deleteUser = async username => {
	const connection = await connect()

	await connection.query(
		'DELETE FROM users WHERE username = ?',
		[username],
	)

	await connection.end()
}

// Product operations
