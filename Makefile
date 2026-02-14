lint-frontend:
	npm run lint --prefix frontend

install:
	npm ci
	npm ci --prefix frontend

start-frontend:
	npm run dev --prefix frontend

start-backend:
	npx start-server -s ./frontend/dist

deploy:
	git push heroku main

start:
	make start-backend

develop:
	make start-backend & make start-frontend

build:
	rm -rf frontend/dist
	npm run build
