import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

export interface DictionaryTerm {
  libTerm: string
  engTerm: string
  context: string
  gender?: string
  style?: string
  region?: string
}

export const dictionaryTerms: DictionaryTerm[] = []

const s3 = new S3Client({ region: 'us-east-1' }) // Update region as needed

export const loadDictionaryFromS3 = async (
  bucket: string,
  key: string
): Promise<void> => {
  if (dictionaryTerms.length > 0) return

  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  const response = await s3.send(command)

  const stream = response.Body as Readable
  const jsonString = await streamToString(stream)

  try {
    const data = JSON.parse(jsonString)
    if (Array.isArray(data)) {
      for (const item of data) {
        const libTerm = item.libTerm?.trim()
        const engTerm = item.engTerm?.trim()
        const context = item.context?.trim()
        if (libTerm && engTerm) {
          dictionaryTerms.push({
            libTerm,
            engTerm,
            context,
            gender: item.gender,
            style: item.style,
            region: item.region
          })
        }
      }
    } else {
      console.error('Expected an array of dictionary terms in the JSON file')
    }
  } catch (err) {
    console.error('Failed to parse JSON from S3:', err)
    throw err
  }
}

const streamToString = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: any[] = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    stream.on('error', reject)
  })
