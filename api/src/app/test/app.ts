import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { corsify, setError } from '../../lib/helpers/lambda'
import dotenv from 'dotenv'
dotenv.config()

export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log('process.env', process.env)
  try {
    if (!event.body) {
      return setError('No body provided')
    }
    return corsify({
      statusCode: 200,
      body: JSON.stringify({ result: true }),
    })
  } catch (error) {
    console.error('Error handling completion request:', error)
    return corsify({
      statusCode: 500,
      body: JSON.stringify({ error: 'Completion failed' }),
    })
  }
}
