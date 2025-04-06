import { dictionaryTerms, DictionaryTerm } from './libyanDictionary'

export const highlightTerms = (text: string): { preprocessed: string; matchFound: boolean } => {
  console.log('📥 Starting Libyan term, Source text:', text)

  let modifiedText = text
  let matched = false

  for (const { libTerm, engTerm, context } of dictionaryTerms) {
    const pattern = new RegExp(`${escapeRegExp(libTerm)}`, 'gi')
    if (pattern.test(modifiedText)) {
      // console.log(`✅ Match found for term: "${libTerm}" → (${engTerm} – ${context})`)
      const highlight = `${libTerm} (${engTerm} – ${context})`
      modifiedText = modifiedText.replace(pattern, highlight)
      matched = true
    } else {
      // console.log(`⛔ No match for term: "${libTerm}"`)
    }
  }

  console.log('📝 Preprocessed text:', modifiedText)
  return { preprocessed: modifiedText, matchFound: matched }
}

const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

