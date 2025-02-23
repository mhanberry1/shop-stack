import mysql from 'mysql2/promise'

const connect = () => mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: 'shop_stack',
})

// User operations

export const addUser = async (
	stripeCustomerId,
	username,
	password,
	verificationCode,
) => {
	const connection = await connect()

	await connection.query(
		`
			INSERT INTO users
			(stripeCustomerId, username, password, verificationCode, isAdmin)
			SELECT ?, ?, ?, ?, (SELECT COUNT(*) FROM users) = 0
		`,
		[stripeCustomerId, username, password, verificationCode],
	)
	await connection.end()
}

export const verifyUser = async (username, verificationCode) => {
	const connection = await connect()

	const result = await connection.query(
		`
			UPDATE users SET isVerified = true
			WHERE username = ? AND verificationCode = ?
		`,
		[username, verificationCode]
	)
	await connection.end()

	if (result[0].affectedRows == 0) {
		const error = new Error('The user could not be verified.')
		error.name = 'VerificationFailed'
		throw error
	}
}

export const getUser = async username => {
	const connection = await connect()

	const results = await connection.query(
		`
			SELECT * FROM users
			WHERE username = ?
		`,
		[username],
	)
	await connection.end()

	return results[0][0]
}

export const updateUser = async (username, password) => {
	const connection = await connect()

	await connection.query(
		`
			UPDATE users
			SET password = ?
			WHERE username = ?
		`,
		[password, username]
	)
	await connection.end()
}

export const deleteUser = async username => {
	const connection = await connect()

	await connection.query(
		`
			DELETE FROM users
			WHERE username = ?
		`,
		[username],
	)

	await connection.end()
}

// Product operations

export const addProduct = async (stripeProductId, quantity) => {
	const connection = await connect()

	await connection.query(
		`
			INSERT INTO products (stripeProductId, quantity)
			VALUES (?, ?);
		`,
		[stripeProductId, quantity]
	)
	await connection.end()
}

export const updateProduct = async (stripeProductId, quantity) => {
	const connection = await connect()

	await connection.query(
		`
			UPDATE products
			SET quantity = ?
			WHERE stripeProductId = ?
		`,
		[quantity, stripeProductId]
	)
	await connection.end()
}

export const getProduct = async stripeProductId => {
	const connection = await connect()

	const results =
		await connection.query(
			`
				SELECT * from products
				WHERE stripeProductId = ?
			`,
			[stripeProductId]
		)

	await connection.end()

	return results[0]
}

export const getAllProducts = async () => {
	const connection = await connect()

	const results = await connection.query(
		'SELECT * from products'
	)

	await connection.end()

	return results[0]
}

export const deleteProduct = async stripeProductId => {
	const connection = await connect()

	await connection.query(
		`
			DELETE FROM products
			WHERE stripeProductId = ?
		`,
		[stripeProductId]
	)
	await connection.end()
}
