import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import csv from 'csv-parser'
import { Readable } from 'stream'

export interface DictionaryTerm {
  libTerm: string
  engTerm: string
  context: string
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

  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', (row: any) => {
        const libTerm = row['Libyan Dialect']?.trim()
        const engTerm = row['English']?.trim()
        const context = row['Context']?.trim()
        if (libTerm && engTerm) {
          dictionaryTerms.push({ libTerm, engTerm, context })
        }
      })
      .on('end', resolve)
      .on('error', reject)
  })
}
