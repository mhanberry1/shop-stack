#!/bin/bash

while getopts ":a:v:" opt; do
	case $opt in
		a)
			AUTH_COOKIE=$OPTARG
			;;
		v)
			VERIFICATION_CODE=$OPTARG
			;;
	esac
done

case $1 in

	signup)
		curl -v \
			'localhost:8080/user/signup' \
			-H 'Content-Type: application/json' \
			-d '{
					"username": "username",
					"password": "password",
					"email": "mhanberry1@gmail.com"
				}'
		;;

	verify)
		curl -v \
			'localhost:8080/user/verify' \
			-H 'Content-Type: application/json' \
			-d '{
					"username": "username",
					"verificationCode": "'${VERIFICATION_CODE}'"
				}'
		;;

	login)
		curl -v \
			'localhost:8080/user/login' \
			-H 'Content-Type: application/json' \
			-d '{ "username": "username", "password": "password" }'
		;;

	logout)
		curl -v \
			'localhost:8080/user/logout'
		;;

	updateUser)
		curl -v \
			'localhost:8080/user' \
			-H 'Content-Type: application/json' \
			-H "Cookie: ${AUTH_COOKIE}" \
			-d '{
					"password": "password",
					"stripeArgs": {
						"email": "newemail@fakemail.nope"
					}
				}'
		;;

	getUserInfo)
		curl -v \
			'localhost:8080/user' \
			-H "Cookie: ${AUTH_COOKIE}"
		;;

	deleteUser)
		curl -v -X DELETE \
			'localhost:8080/user' \
			-H 'Content-Type: application/json' \
			-H "Cookie: ${AUTH_COOKIE}"
		;;
	
	createProducts)
		curl -v -X PUT \
			'localhost:8080/products' \
			-H 'Content-Type: application/json' \
			-H "Cookie: ${AUTH_COOKIE}" \
			-d '{
					"products": [{
						"quantity": 10,
						"stripeArgs": {
							"name": "name",
							"description": "description",
							"default_price_data": {
								"currency": "usd",
								"unit_amount": 1000
							}
						}
					}]
				}'
		;;

	updateProducts)
		curl -v \
			'localhost:8080/products' \
			-H 'Content-Type: application/json' \
			-H "Cookie: ${AUTH_COOKIE}" \
			-d '{
					"products": [{
						"quantity": 10,
						"price": 1.10,
						"stripeProductId": "prod_RlqCAm8SXdOlyV",
						"stripeArgs": {
							"name": "new name",
							"description": "new description"
						}
					}]
				}'
		;;

	listProducts)
		curl -v \
			'localhost:8080/products'
		;;

	getProduct)
		curl -v \
			"localhost:8080/products?stripeProductIds=[${STRIPE_PRODUCT_ID}]"
		;;

	deleteProducts)
		curl -v -X DELETE \
			'localhost:8080/products' \
			-H "Cookie: ${AUTH_COOKIE}" \
			-d '{
					"stripeProductIds": [
						"prod_Rl60skMxZaSD6j"
					]
				}'
		;;

	uploadFile)
		curl -v -X POST \
			'localhost:8080/upload' \
			-H "Cookie: ${AUTH_COOKIE}" \
			-F "file=@${HOME}/Pictures/base-six.png"
		;;

	getUploadedFile)
		curl -v \
			'localhost:8080/upload?file=301a2bb51083dde3e7a86517c19486bd2ad047669f563665fd9acb15e99400bb.md' > test.png
		;;
	
	*)
		echo -n "unknown operation"
		;;
esac

echo ""
