install:
	npm ci

develop:
	mpm run dev

lint:
	npx eslint

buid:
	NODE_ENV=production npm run build

test:
	echo no tests
