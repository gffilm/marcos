import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { corsify, setError } from '../../lib/helpers/lambda'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import { loadDictionaryFromS3, dictionaryTerms } from './libyanDictionary'
import { highlightTerms } from './preprocessing'

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

let isDictionaryLoaded = false

export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    if (!isDictionaryLoaded) {
      await loadDictionaryFromS3('dialects', 'libyan_dictionary.csv')
      isDictionaryLoaded = true
    }

    if (!event.body) {
      return setError('No body provided')
    }

    const { srcText, srcLangId, tgtLangId } = JSON.parse(event.body)

    if (!srcText || !srcLangId || !tgtLangId) {
      return setError('Missing required translation fields')
    }

    const { preprocessed, matchFound } =
      srcLangId === 'Libyan Arabic' ? highlightTerms(srcText) : { preprocessed: srcText, matchFound: false }


    const messages = [
      { role: 'system', content: 'You are a helpful translation assistant.' },
      {
        role: 'user',
        content: `Please translate the following text from ${srcLangId} to ${tgtLangId}:\n\n"${preprocessed}"`
      }
    ]

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.3,
      max_tokens: 500
    })

    const translatedText = chatResponse.choices[0]?.message?.content || 'No translation returned.'

    return corsify({
      statusCode: 200,
      body: JSON.stringify({ translatedText, preprocessed, matchFound })
    })
  } catch (error) {
    console.error('Translation error:', error)
    return corsify({
      statusCode: 500,
      body: JSON.stringify({ error: 'Translation failed' })
    })
  }
}
