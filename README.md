
# FRONT
cd frontend
npm install
npm run start


# BACKEND
npm install
npm run dev:api
set AWS_PROFILE=account1
aws sso login  --profile account1 
sam local start-api --env-vars env.json

# DEPLOYMENT:

# FRONTEND:
AUTOMATIC FROM GITHUB

# BACKEND:

set AWS_PROFILE=account1
aws sso login  --profile account1 

npm run build:api
sam build
sam deploy --guided --profile account1