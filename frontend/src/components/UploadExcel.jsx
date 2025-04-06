import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Typography, Button } from '@mui/material'
import * as XLSX from 'xlsx'

export default function UploadExcel() {
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet)
      const BASE_URL = import.meta.env.VITE_LAMBDA_ENDPOINT ?? ''

      const translatedRows = await Promise.all(json.map(async row => {
        const res = await fetch(`${BASE_URL}/completion`, {
          method: 'POST',
          body: JSON.stringify({
            srcText: row.srcText,
            srcLangId: row.srcLangId,
            tgtLangId: row.tgtLangId
          })
        })
        const data = await res.json()
        return { ...row, translatedText: data.translatedText }
      }))

      const newSheet = XLSX.utils.json_to_sheet(translatedRows)
      const newWb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(newWb, newSheet, 'Translated')
      XLSX.writeFile(newWb, 'translated_output.xlsx')
    }
    reader.readAsArrayBuffer(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
  }
 })

  return (
    <Box {...getRootProps()} sx={{ p: 3, border: '2px dashed grey', textAlign: 'center' }}>
      <input {...getInputProps()} />
      <Typography>Drag & drop an Excel file here or click to select</Typography>
    </Box>
  )
}