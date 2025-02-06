import mysql from 'mysql2/promise'

const connect = () => mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
})

// User operations

export const addUser = async (id, username, password) => {
	const connection = connect()

	await connection.query(
		`
			START TRANSACTION;
			SET @isFirstUser = (SELECT COUNT(*) = 0 FROM users);
			INSERT INTO users (id user, password, isAdmin)
				VALUES (?, ?, ?, @isFirstUser);
			COMMIT;
		`,
		[username, password],
	)
	await connection.end()
}

export const verifyUser = async (username, verificationCode) => {
	const connection = connect()

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
	const connection = connect()

	await connection.query(
		'SELECT * FROM users WHERE username = ?',
		[username],
	)
	await connection.end()

	if (results.length == 0) {
		const error = new Error('the user could not be found')
		error.name = 'UserNotFound'
		throw error
	}

	return results[0]
}

export const deleteUser = async username => {
	const connection = connect()

	await connection.query(
		'DELETE FROM users WHERE username = ?',
		[username],
	)
	await connection.end()
}

// Product operations
