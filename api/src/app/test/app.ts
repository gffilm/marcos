import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { corsify, setError } from '../../lib/helpers/lambda'
import dotenv from 'dotenv'
dotenv.config()

export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    return corsify({
      statusCode: 200,
      body: JSON.stringify({ result: true, version: '1.0.5' }),
    })
  } catch (error) {
    console.error('Error handling completion request:', error)
    return corsify({
      statusCode: 500,
      body: JSON.stringify({ error: 'Completion failed' }),
    })
  }
}
