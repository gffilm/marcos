import React, { useState } from 'react'
import { TextField, Button, Grid, CircularProgress } from '@mui/material'
import axios from 'axios'
import LanguageSelect from './LanguageSelect'
import { highlight } from './util'

export default function TranslateForm() {
  const [srcText, setSrcText] = useState('Hello')
  const [srcLangId, setSrcLangId] = useState('English')
  const [tgtLangId, setTgtLangId] = useState('Spanish')
  const [translated, setTranslated] = useState('')
  const [preprocessed, setPreprocessed] = useState('')
  const [matchFound, setMatchFound] = useState(false)

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
      const { translatedText, preprocessed, matchFound } = res.data
      setTranslated(translatedText)
      setPreprocessed(preprocessed)
      setMatchFound(matchFound)

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

      {matchFound && (
        <Grid item xs={12}>
          <div style={{ background: '#fff9c4', padding: 12, borderRadius: 6 }}>
            <strong>Libyan term match found:</strong>
            <div
              dangerouslySetInnerHTML={{
                __html: highlight(preprocessed).replace(/\n/g, '<br />')
              }}
            />
          </div>
        </Grid>
      )}

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