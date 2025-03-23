import React from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  CssBaseline,
  Container,
  Paper,
  Card,
  CardContent,
  Divider,
  useTheme
} from '@mui/material'
import GTranslateIcon from '@mui/icons-material/GTranslate'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import TranslateForm from './components/TranslateForm'
import UploadExcel from './components/UploadExcel'
import TranslateIcon from '@mui/icons-material/Translate'

export default function App() {
  const theme = useTheme()

  return (
    <>
      <CssBaseline />
      {/* Navbar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <GTranslateIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Translator Tool
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
            {/* Left Side Graphic / Branding */}
            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              px={2}
            >
              <TranslateIcon
                sx={{
                  fontSize: 100,
                  color: 'primary.main',
                  mb: 2
                }}
              />
              <Typography variant="h5" gutterBottom>
                Language Conversion Tool
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Translate text instantly or upload Excel files for batch translations.
              </Typography>
            </Box>

            {/* Right Side Forms */}
            <Box flex={2}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <GTranslateIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Text Translation
                  </Typography>
                  <TranslateForm />
                </CardContent>
              </Card>

              <Divider sx={{ my: 4 }} />

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <CloudUploadIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Upload Excel for Batch Translation
                  </Typography>
                  <UploadExcel />
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  )
}
