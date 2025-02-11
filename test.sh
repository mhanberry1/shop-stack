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

	deleteUser)
		curl -v -X DELETE \
			localhost:8080/user \
			-H 'Content-Type: application/json' \
			-H 'Cookie: authToken=dXNlcm5hbWU=.xHQKkE1Kaoy1zo53aQqaa6L9qIjkK66nANb7caRoRLo=' \
		;;
	
	*)
		echo -n "unknown operation"
		;;
esac
