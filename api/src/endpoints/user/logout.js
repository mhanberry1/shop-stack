export const logout = async(req, res) => {
	res.writeHead(200, {
		'Content-Type': 'application/json',
		'Set-Cookie': `authToken=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
	})
	res.end(JSON.stringify({
		message: 'The user has been logged out.',
	}))
}
