import AWS from 'aws-sdk'
import csv from 'csv-parser'
import { Readable } from 'stream'

export interface DictionaryTerm {
  libTerm: string
  engTerm: string
  context: string
}

export const dictionaryTerms: DictionaryTerm[] = []

const s3 = new AWS.S3()

export const loadDictionaryFromS3 = async (
  bucket: string,
  key: string
): Promise<void> => {
  if (dictionaryTerms.length > 0) return 

  const data = await s3.getObject({ Bucket: bucket, Key: key }).promise()

  const rows: Buffer[] = []
  const stream = Readable.from(data.Body as Buffer)
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
