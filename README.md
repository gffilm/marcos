
# FRONT
cd frontend
npm install
npm run start


# BACKEND
npm install
npm run build:api
sam local start-api --env-vars env.json