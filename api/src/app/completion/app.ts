import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { corsify, setError } from '../../lib/helpers/lambda'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import { loadDictionaryFromS3 } from './libyanDictionary'
import { findDictionaryMatches } from './preprocessing'

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

let isDictionaryLoaded = false

export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    if (!isDictionaryLoaded) {
      await loadDictionaryFromS3('dialects', 'dictionary.jsonl')
      isDictionaryLoaded = true
    }

    if (!event.body) {
      return setError('No body provided')
    }

    const { srcText, srcLangId, tgtLangId } = JSON.parse(event.body)

    if (!srcText || !srcLangId || !tgtLangId) {
      return setError('Missing required translation fields')
    }

    const { preprocessed, matchFound, matches } =
      srcLangId === 'Libyan Arabic'
        ? findDictionaryMatches(srcText)
        : { preprocessed: srcText, matchFound: false, matches: [] }


    const messages = [
      { role: 'system', content: 'You are a helpful translation assistant.' },
      {
        role: 'user',
        content: `Please translate the following text from ${srcLangId} to ${tgtLangId}:\n\n"${preprocessed}", no commentary, just the translation`
      }
    ]

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages,
      temperature: 0.9,
      max_tokens: 1000
    })

    const translatedText = chatResponse.choices[0]?.message?.content || 'No translation returned.'

    return corsify({
      statusCode: 200,
      body: JSON.stringify({ translatedText, preprocessed, matchFound, matches })
    })
  } catch (error) {
    console.error('Translation error:', error)
    return corsify({
      statusCode: 500,
      body: JSON.stringify({ error: 'Translation failed' })
    })
  }
}
