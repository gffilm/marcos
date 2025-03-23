import axios from 'axios'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const completion = async (messages: any[], functions: any[], functionCallName: string): Promise<any> => {
  let response = {}
  try {
    response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages,
        functions,
        function_call: { name: functionCallName },
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    // Extract the structured output
    const translatedText = response.data.choices[0].message.content

    return {
      result: response.data,
      messages,
      functions
    }
  } catch (error) {
    console.error('Error during completion:', error.message, response.data)
    return {
      text: 'I\'m sorry, can you repeat that?',
      tokens: {
        promptTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      }
    }
  }
}