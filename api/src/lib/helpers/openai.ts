import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import dotenv from 'dotenv'
import OpenAI from 'openai'
import type { Message } from './interfaces'

dotenv.config()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_ADMIN_KEY = process.env.OPENAI_ADMIN_KEY

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const transcribeAudio = async (filePath: string): Promise<any> => {
  return await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-1',
  })
}

export const textToSpeech = async (text: string, voice: string): Promise<Buffer> => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        input: text,
        voice
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    )
    return response.data
  } catch (error) {
    console.error('Error during tts:', error)
    throw error
  }
}


const openAiCompletion = async ( messages: Message[], assistantId: string, functions: any[], functionCallName: string): Promise<any> => {
  let response = {}
  try {
    if (!assistantId) {
      throw new Error('Assistant has not been initialized. Please create an assistant first.')
    }

    response = await axios.post(
      `https://api.openai.com/v1/assistants/${assistantId}/chat/completions`,
      {
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
    const structuredOutput = response.data.choices[0].message.function_call.arguments

    // Extract token usage
    const usage = response.data.usage
    const promptTokens = usage?.prompt_tokens || 0
    const outputTokens = usage?.completion_tokens || 0
    const totalTokens = usage?.total_tokens || 0

    console.log(`Prompt Tokens: ${promptTokens}, Output Tokens: ${outputTokens}, Total Tokens: ${totalTokens}`)

    return {
      result: JSON.parse(structuredOutput),
      tokens: {
        promptTokens,
        outputTokens,
        totalTokens,
      },
    }
  } catch (error) {
    console.error('Error during completion:', error.message, response.data)
    return {
      text: 'I\'m sorry, can you repeat that?',
      tokenUsage: null,
    }
  }
}

export const createFile = async (name, content: any) => {
  let fileContent = null
  if (content instanceof Buffer) {
    fileContent = JSON.stringify(content.toString('utf-8', 0))
  } else {
    fileContent = JSON.stringify(content)
  }

  const tempFilePath = `/tmp/${name}.json`
  fs.writeFileSync(tempFilePath, fileContent, 'utf8')
  try {
    const fileStream = fs.createReadStream(tempFilePath)
    const response = await openai.files.create({
      purpose: 'assistants',
      file: fileStream,
    })
    return response.id
  } catch (error) {
    console.error('Error uploading file:', error.message)
  }
}

export const deleteFile = async (id: string): Promise<boolean> => {
  try {
    return await openai.files.del(id)
  } catch (deleteError) {
    console.error(`Error deleting file from OpenAI: ${deleteError.message}`)
  }
  return false
}

export const deleteVectorStore = async (vectorId): Promise<boolean> => {
  try {
    const response = await axios.delete(
      `https://api.openai.com/v1/vector_stores/${vectorId}`,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    return response.data ? true : false
  } catch (error) {
    console.error("Error deleting vector store:", error.message)
  }
}


export const deleteThreadMessage = async (threadId: string, messageId: string): Promise<boolean> => {
  try {
    const result = await openai.beta.threads.messages.del(threadId, messageId)
    if (result.deleted) {
      return true
    }
  } catch (deleteError) {
    console.error(`Error deleting thread message from OpenAI: ${deleteError.message}`)
  }
  return false
}

export const createThread = async (): Promise<string> => {
  try {
    const thread = await openai.beta.threads.create()
    return thread?.id
  } catch (e) {
    console.error(`Error creating thread: ${e.message}`)
  }
  return null
}

export const deleteThread = async (id: string): Promise<boolean> => {
  try {
    return await openai.beta.threads.del(id)
  } catch (deleteError) {
    console.error(`Error deleting thread from OpenAI: ${deleteError.message}`)
  }
  return false
}

export const createAssistant = async (
  name: string,
  instructions: string,
  vectorStoreId: string
): Promise<any> => {
  try {
    const assistant = await openai.beta.assistants.create({
      name,
      instructions,
      tools: [
        {
          type: 'file_search'
        }
      ],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStoreId]
        }
      },
      model: 'gpt-4-turbo',
    })
    console.log(`Assistant created successfully: ID -> ${assistant.id}`)
    return assistant
  } catch (error) {
    console.error('Error creating assistant:', error.response ? error.response.data : error)
  }
}


export const deleteAssistant = async (id: string): Promise<any> => {
  try {
    return await openai.beta.assistants.del(id)
  } catch (e: any) {
    console.error('Failed to delete assistant', e.message)
    return false
  }
}

export const createVectorStore = async (name): Promise<string> => {
  try {
    const vectorStore = await openai.beta.vectorStores.create({
      name
    })
    return vectorStore?.id
  } catch (error) {
    console.error('Error creating vector store:', error.message)
  }
}

export const addFilesToVectorStore = async (vectorStoreId, fileIds): Promise<string> => {
  try {
    const vectorStore = await openai.beta.vectorStores.fileBatches.create(
      vectorStoreId, { file_ids: fileIds }
    )
    return vectorStore?.id
  } catch (error) {
    console.error('Error adding file vector store:', error.message)
  }
}


export const updateAssistant = async (id: string, name: string, instructions: string, vectorStoreId: string): Promise<any> => {
  const assistant = await openai.beta.assistants.update(id, {
    name,
    instructions,
    tools: [
      {
        type: 'file_search'
      }
    ],
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStoreId]
      }
    },
    model: 'gpt-4o-mini',
  })

  return assistant
}

export const getAssistantById = async (id: string): Promise<any> => {
   return await openai.beta.assistants.retrieve(id)
}

