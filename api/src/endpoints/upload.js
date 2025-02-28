import { promises as fs } from 'fs'
import { makeHash } from '#src/common/hash.js'

export const upload = async (req, res) => {
	const boundary = req.headers['content-type'].split('boundary=')[1]
	const parts = req.body.split(`--${boundary}`).slice(1, -1)
	const uploadedFiles = []

	for (let part of parts) {
		const lines = part.split('\r\n').slice(1, -1)
		const separationIdx = lines.indexOf('')
		const headers = lines.slice(0, separationIdx).join('; ')

		if (!headers.includes('filename=')) continue

		const data = lines[separationIdx + 1]
		const extension = headers
			.split('filename=')[1]
			.split(';')[0]
			.split('.')[1]
			.replace(new RegExp('"', 'g'), '')
			.trim()
			|| ''
		const filename = `${makeHash(data)}.${extension}`
		const path = `/uploads/${filename}`

		await fs.writeFile(path, data)

		uploadedFiles.push(path)
	}
	
	if (uploadedFiles.length == 0) {
		res.writeHead(400, { 'content-type': 'application/json' })
		res.end(JSON.stringify({ message: 'Invalid file data supplied.' }))
		res.sent = true
		return
	}


	res.end(JSON.stringify({ uploadedFiles }))
}
