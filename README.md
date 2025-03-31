
# FRONT
cd frontend
npm install
npm run start


# BACKEND
npm install
npm run build:api
sam local start-api --env-vars env.json

# DEPLOYMENT:

# FRONTEND:
AUTOMATIC FROM GITHUB

# BACKEND:
sam build
sam deploy --guided --profile account1
