import { dictionaryTerms, DictionaryTerm } from './libyanDictionary'

export const findDictionaryMatches = (
  text: string
): { preprocessed: string; matchFound: boolean; matches: DictionaryTerm[] } => {
  console.log('📥 Starting Libyan term search, Source text:', text)

  const matches: DictionaryTerm[] = []

  for (const term of dictionaryTerms) {
    const pattern = new RegExp(`(?<!\\p{L})${escapeRegExp(term.libTerm)}(?!\\p{L})`, 'gu')
    if (pattern.test(text)) {
      matches.push(term)
    }
  }


  console.log('📝 Matches found:', matches.length)
  return { preprocessed: text, matchFound: matches.length > 0, matches }
}

const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

