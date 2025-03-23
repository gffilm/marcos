import { APIGatewayEvent } from 'aws-lambda'

export const corsify = (response: any): any => {
  return {
    ...response,
    headers: {
      ...response.headers,
      'Content-Type': response.headers && response.headers['Content-Type'] ? response.headers['Content-Type'] : 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    }
  }
}

export const setError = (error: string, statusCode: number = 500, errorDetail?: any): any => {
  if (errorDetail) {
    console.log(error, errorDetail)
  } else {
    console.log(error)
  }
  return corsify({
    statusCode,
    body: JSON.stringify({ error }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getPreflightResponse = (event: APIGatewayEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({ message: 'CORS preflight response' })
    }
  }
  return null
}