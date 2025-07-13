export type TokenTypes =
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'listItem'
  | 'codeBlock'
  | 'link'
  | 'image'
  | 'text'
  | 'emphasis'
  | 'strong'
  | 'inlineCode'
  | 'html'
  | 'thematicBreak'
  | 'document'

export interface Token {
  type: TokenTypes
  value?: string
  level?: number
  ordered?: boolean
  children?: Token[]
  href?: string
  alt?: string
  lang?: string
  title?: string
}

export interface ParserState {
  input: string
  position: number
}
