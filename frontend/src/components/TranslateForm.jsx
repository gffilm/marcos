import React, { useState } from 'react'
import { TextField, Button, Grid, CircularProgress } from '@mui/material'
import axios from 'axios'
import LanguageSelect from './LanguageSelect'

export default function TranslateForm() {
  const [srcText, setSrcText] = useState('Hello')
  const [srcLangId, setSrcLangId] = useState('English')
  const [tgtLangId, setTgtLangId] = useState('Spanish')
  const [translated, setTranslated] = useState('')
  const [loading, setLoading] = useState(false)
  const BASE_URL = import.meta.env.VITE_LAMBDA_ENDPOINT ?? ''

  const handleTranslate = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/completion`, {
        srcText,
        srcLangId,
        tgtLangId
      })
      setTranslated(JSON.parse(res.data.translatedText))
    } catch (err) {
      console.error('Translation failed:', err)
      setTranslated('Translation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Source Text"
          value={srcText}
          onChange={(e) => setSrcText(e.target.value)}
          multiline
          minRows={3}
          disabled={loading}
        />
      </Grid>

      <Grid item xs={6}>
        <LanguageSelect
          label="Source Language"
          value={srcLangId}
          onChange={(e) => setSrcLangId(e.target.value)}
          disabled={loading}
        />
      </Grid>

      <Grid item xs={6}>
        <LanguageSelect
          label="Target Language"
          value={tgtLangId}
          onChange={(e) => setTgtLangId(e.target.value)}
          disabled={loading}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleTranslate}
          disabled={loading}
          fullWidth
          sx={{ height: 48 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Translate'}
        </Button>
      </Grid>

      {(translated || loading) && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Translated Text"
            value={translated}
            multiline
            minRows={3}
            InputProps={{
              readOnly: true,
            }}
            disabled={loading}
          />
        </Grid>
      )}
    </Grid>
  )
}