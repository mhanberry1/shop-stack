import { authenticate } from '#src/common/auth.js'
import { splitBuffer, findBytes } from '#src/common/buffer.js'
import { makeHash } from '#src/common/hash.js'
import { promises as fs } from 'fs'
import { extname } from 'path'

const mimeTypes = {
	'html': 'text/html',
	'js': 'application/javascript',
	'css': 'text/css',
	'json': 'application/json',
	'png': 'image/png',
	'jpg': 'image/jpeg',
	'gif': 'image/gif',
	'pdf': 'application/pdf',
	'txt': 'text/plain',
	'xml': 'application/xml',
	'zip': 'application/zip',
	'mp3': 'audio/mpeg',
	'mp4': 'video/mp4',
	'svg': 'image/svg+xml',
};

export const uploadFile = async (req, res) => {
	const { isAdmin } = authenticate(req, res)

	if ( !isAdmin ) {
		res.writeHead(401, {
			'Content-Type': 'application/json',
		})
		res.end(JSON.stringify({
			message: 'The user is not authorized to upload files.',
		}))
		res.sent = true
		return;
	}

	const boundary = req.headers['content-type'].split('boundary=')[1]
	const parts = splitBuffer(req.body, Buffer.from(`--${boundary}`))
	const uploadedFiles = []

	for (let part of parts) {
		const filenameMatch = part.toString().match(/filename="(.+?)"/);

		if (!filenameMatch) continue;

		const filename = filenameMatch[1];
		const data = splitBuffer(part, Buffer.from('\r\n\r\n'))[1].slice(0, -2)
		const newFilename = `${makeHash(data)}${extname(filename)}`
		const path = `/uploads/${newFilename}`

		await fs.writeFile(path, data)

		uploadedFiles.push(`${process.env.BACKEND_ORIGIN}/upload?file=${newFilename}`)
	}
	
	if (uploadedFiles.length == 0) {
		res.writeHead(400, { 'content-type': 'application/json' })
		res.end(JSON.stringify({ message: 'Invalid file data supplied.' }))
		res.sent = true
		return
	}


	res.end(JSON.stringify({ uploadedFiles }))
}

export const getUploadedFile = async (req, res) => {
	const filename = req.queryParams.get('file')
	const extension = filename.split('.')[1]
	const data = await fs.readFile(`/uploads/${filename}`)
	const contentType = mimeTypes[extension] || 'application/octet-stream'

	res.writeHead(200, { 'Content-Type': contentType })
	res.end(data)
}
