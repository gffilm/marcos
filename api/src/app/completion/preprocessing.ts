import { dictionaryTerms, DictionaryTerm } from './libyanDictionary'

export const findDictionaryMatches = (
  text: string
): { preprocessed: string; matchFound: boolean; matches: DictionaryTerm[] } => {
  console.log('📥 Starting Libyan term search, Source text:', text)
  let modifiedText = text
  const matches: DictionaryTerm[] = []

  for (const term of dictionaryTerms) {
    const pattern = new RegExp(`(?<!\\p{L})(${escapeRegExp(term.libTerm)})(?!\\p{L})`, 'gu')
    if (pattern.test(modifiedText)) {
      matches.push(term)
      modifiedText = modifiedText.replace(pattern, (match) => `${match} (${term.engTerm})`)
    }
  }

  console.log('📝 Matches found:', matches.length)
  return { preprocessed: modifiedText, matchFound: matches.length > 0, matches }
}

const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

