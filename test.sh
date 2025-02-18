#!/bin/bash

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
			localhost:8080/user/verify \
			-H 'Content-Type: application/json' \
			-d '{ "username": "username", "verificationCode": "36849" }'
		;;

	login)
		curl -v \
			'localhost:8080/user/login' \
			-H 'Content-Type: application/json' \
			-d '{ "username": "username", "password": "password" }'
		;;

	logout)
		curl -v \
			'localhost:8080/user/logout' \
			-H 'Content-Type: application/json' \
		;;

	updateUser)
		curl -v \
			'localhost:8080/user' \
			-H 'Content-Type: application/json' \
			-H 'Cookie: authToken=eyJzdHJpcGVDdXN0b21lcklkIjoiY3VzX1JraUJWb21Kb2N3NkZPIiwidXNlcm5hbWUiOiJ1c2VybmFtZSIsImlzQWRtaW4iOjEsImV4cGlyYXRpb24iOjE3NDUwMzg3OTU0Njd9.8/dn3LSorm2mwISp7E7OIfcZlzInu+/D7lGoi1+8jUY=; HttpOnly; Secure; SameSite=Strict' \
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
			-H 'Content-Type: application/json' \
			-H 'Cookie: authToken=eyJzdHJpcGVDdXN0b21lcklkIjoiY3VzX1JraUJWb21Kb2N3NkZPIiwidXNlcm5hbWUiOiJ1c2VybmFtZSIsImlzQWRtaW4iOjEsImV4cGlyYXRpb24iOjE3NDUwMzg3OTU0Njd9.8/dn3LSorm2mwISp7E7OIfcZlzInu+/D7lGoi1+8jUY=; HttpOnly; Secure; SameSite=Strict'
		;;

	deleteUser)
		curl -v -X DELETE \
			localhost:8080/user \
			-H 'Content-Type: application/json' \
			-H 'Cookie: authToken=eyJzdHJpcGVDdXN0b21lcklkIjoiY3VzX1JraUJWb21Kb2N3NkZPIiwidXNlcm5hbWUiOiJ1c2VybmFtZSIsImlzQWRtaW4iOjEsImV4cGlyYXRpb24iOjE3NDUwMzg3OTU0Njd9.8/dn3LSorm2mwISp7E7OIfcZlzInu+/D7lGoi1+8jUY=; HttpOnly; Secure; SameSite=Strict'
		;;
	
	createProducts)
		curl -v -X PUT \
			'localhost:8080/products' \
			-H 'Content-Type: application/json' \
			-H 'Cookie: authToken=eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaXNBZG1pbiI6MSwiZXhwaXJhdGlvbiI6MTc0NDY5Nzg5MTA1N30=.8rB0iMZPm3YOJhz65SvN2FN9bHOvK3aoD0YiFYUNkLE=' \
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
			-H 'Cookie: authToken=eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaXNBZG1pbiI6MSwiZXhwaXJhdGlvbiI6MTc0NDY5Nzg5MTA1N30=.8rB0iMZPm3YOJhz65SvN2FN9bHOvK3aoD0YiFYUNkLE=' \
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
			'localhost:8080/products' \
			-H 'Content-Type: application/json'
		;;

	deleteProducts)
		curl -v -X DELETE \
			'localhost:8080/products' \
			-H 'Content-Type: application/json' \
			-H 'Cookie: authToken=eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaXNBZG1pbiI6MSwiZXhwaXJhdGlvbiI6MTc0NDY5Nzg5MTA1N30=.8rB0iMZPm3YOJhz65SvN2FN9bHOvK3aoD0YiFYUNkLE=' \
			-d '{
					"stripeProductIds": [
						"prod_Rl60skMxZaSD6j"
					]
				}'
		;;
	
	*)
		echo -n "unknown operation"
		;;
esac

echo ""
