import crypto from 'crypto'

const makeSalt = () => crypto.randomBytes(16).toString('hex')

export const makeSaltHash = (text, salt = makeSalt()) => {
	const hash = crypto
		.createHmac('sha256', salt)
		.update(text)
		.digest('hex')

	return `${salt}:${hash}`
}

export const verifySaltHash = (text, saltedHash) => {
	const [salt, hash] = saltedHash.split(':')
	
	return hash == makeSaltHash(text, salt)
}
