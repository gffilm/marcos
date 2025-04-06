
export const highlight = (text: string): string => {
  if (!text) return ''

  // Match anything inside parentheses that looks like a Libyan term replacement
  // Example: "كلمة (word – context)"
  const regex = /(\b[\p{L}\p{N}]+)\s\(([^–]+)\s–\s([^)]+)\)/gu

  return text.replace(regex, (_, term, eng, context) => {
    return `<span class="highlight">${term}</span> <span class="subinfo">(${eng} – ${context})</span>`
  })
}
