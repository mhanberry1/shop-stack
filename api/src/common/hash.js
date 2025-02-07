import crypto from 'crypto'

const makeSalt = () => crypto.randomBytes(16).toString('hex')

export const makeSaltHash = (text, salt = makeSalt()) => {
	const hash = crypto
		.createHmac('sha256', salt)
		.update(text)
		.digest('hex')

	return `${salt}:${hash}`
}

export const verifySaltHash = (text, saltHash) => {
	const salt = saltHash.split(':')[0]

	return saltHash == makeSaltHash(text, salt)
}
