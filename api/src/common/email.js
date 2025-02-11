import nodemailer from 'nodemailer'

const server = process.env.EMAIL_SERVICE
	? {
		service: process.env.EMAIL_SERVICE,
	}
	: {
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT || 587,
		secure: true,
	}

const transporter = nodemailer.createTransport({
	...server,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD,
	},
})

export const sendEmail = async (to, subject, text) =>
	await transporter.sendMail({
		to,
		subject,
		text,
	})
