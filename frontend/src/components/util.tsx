
export interface DictionaryTerm {
  libTerm: string
  engTerm: string
  context: string
  gender?: string
  style?: string
  region?: string
}

export const highlight = (text: string): string => {
  if (!text) return ''

  // Match anything inside parentheses that looks like a Libyan term replacement
  // Example: "كلمة (word – context)"
  const regex = /(\b[\p{L}\p{N}]+)\s\(([^–]+)\s–\s([^)]+)\)/gu

  return text.replace(regex, (_, term, eng, context) => {
    return `<span class="highlight">${term}</span> <span class="subinfo">(${eng} – ${context})</span>`
  })
}

export const formatMatches = (matches: DictionaryTerm[]): string => {
  if (!matches || matches.length === 0) {
    return 'No Libyan terms found.'
  }

  const grouped = matches.reduce<Record<string, { engTerm: string; context: string }[]>>((acc, { libTerm, engTerm, context }) => {
    if (!acc[libTerm]) {
      acc[libTerm] = []
    }
    // avoid duplicate entries under the same libTerm
    if (!acc[libTerm].some(entry => entry.engTerm === engTerm && entry.context === context)) {
      acc[libTerm].push({ engTerm, context })
    }
    return acc
  }, {})

  const lines: string[] = ['Libyan term match found:']

  for (const [libTerm, entries] of Object.entries(grouped)) {
    lines.push(`- ${libTerm}:`)
    for (const { engTerm, context } of entries) {
      lines.push(`  • ${engTerm} – ${context}`)
    }
  }

  return lines.join('\n')
}
