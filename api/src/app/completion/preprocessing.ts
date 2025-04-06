import { dictionaryTerms, DictionaryTerm } from './libyanDictionary'

export const highlightTerms = (text: string): { preprocessed: string; matchFound: boolean } => {
  let modifiedText = text
  let matched = false

  for (const { libTerm, engTerm, context } of dictionaryTerms) {
    const pattern = new RegExp(`\\b${escapeRegExp(libTerm)}\\b`, 'gi')
    if (pattern.test(modifiedText)) {
      const highlight = `${libTerm} (${engTerm} – ${context})`
      modifiedText = modifiedText.replace(pattern, highlight)
      matched = true
    }
  }

  return { preprocessed: modifiedText, matchFound: matched }
}

const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
