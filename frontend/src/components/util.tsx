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

  // Match patterns like: "كلمة (word – context)"
  const regex = /(\b[\p{L}\p{N}]+)\s\(([^–]+)\s–\s([^)]+)\)/gu

  return text.replace(regex, (_, term, eng, context) => {
    return `<span class="highlight">${term}</span> <span class="subinfo">(${eng} – ${context})</span>`
  })
}

export const formatMatches = (matches: DictionaryTerm[]): string => {
  if (!matches || matches.length === 0) {
    return '<p>No Libyan terms found.</p>'
  }

  let html = '<b>Libyan term match found:</b><ul>'

  for (const { libTerm, engTerm, context, gender, style, region } of matches) {
    html += `<li>${libTerm}<ul>`
    html += `<li>${engTerm} – ${context}</li>`
    html += `<li><small><b>Gender:</b> ${gender || 'N/A'} | <b>Style:</b> ${style || 'N/A'} | <b>Region:</b> ${region || 'N/A'}</small></li>`
    html += '</ul></li>'
  }

  html += '</ul>'
  return html
}
