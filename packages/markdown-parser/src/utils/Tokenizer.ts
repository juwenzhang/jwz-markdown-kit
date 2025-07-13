import { Token, ParserState } from '../types/TokenType'

export const isAtEnd = (state: ParserState): boolean => {
  return state.position >= state.input.length
}

export const getCurrentChar = (state: ParserState): string | undefined => {
  return state.input[state.position]
}

export const advance = (state: ParserState, count: number = 1): ParserState => {
  return {
    ...state,
    position: state.position + count,
  }
}

export const consumeUntil = (
  state: ParserState,
  stopChar: string
): [string, ParserState] => {
  let result = ''
  let newState = state
  while (
    !isAtEnd(newState) &&
    !newState.input.slice(newState.position).startsWith(stopChar)
  ) {
    result += getCurrentChar(newState)
    newState = advance(newState)
  }
  return [result, newState]
}

export const consumeWhile = (
  state: ParserState,
  condition: (char: string) => boolean
): [string, ParserState] => {
  let result = ''
  let newState = state
  while (!isAtEnd(newState) && condition(getCurrentChar(newState)!)) {
    result += getCurrentChar(newState)
    newState = advance(newState)
  }
  return [result, newState]
}

export const parseHeading = (state: ParserState): [Token, ParserState] => {
  let level = 0
  let newState = state
  while (getCurrentChar(newState) === '#' && level < 6) {
    newState = advance(newState)
    level++
  }
  newState = advance(newState)
  const [value, stateAfterValue] = consumeUntil(newState, '\n')
  newState = advance(stateAfterValue)
  return [{ type: 'heading', value, level }, newState]
}

export const parseCodeBlock = (state: ParserState): [Token, ParserState] => {
  let newState = advance(state, 3)

  const [lang, stateAfterLang] = consumeUntil(newState, '\n')
  newState = advance(stateAfterLang)

  const [value, stateAfterValue] = consumeUntil(newState, '```')
  newState = advance(stateAfterValue, 3)
  newState = advance(newState)
  return [{ type: 'codeBlock', value, lang }, newState]
}

export const parseList = (state: ParserState): [Token, ParserState] => {
  const ordered = /^\d+\.\s/.test(state.input.slice(state.position))
  let newState = state
  const items: Token[] = []

  while (!isAtEnd(newState)) {
    if (getCurrentChar(newState) === '\n') {
      newState = advance(newState)
    }
    if (
      isAtEnd(newState) ||
      (getCurrentChar(newState) === '\n' &&
        !/^(\d+\.\s|[*-]\s)/.test(newState.input.slice(newState.position + 1)))
    ) {
      break
    }

    const [, stateAfterIndent] = consumeWhile(
      newState,
      (char) => char === ' ' || char === '\t'
    )
    newState = stateAfterIndent

    const bulletPattern = ordered ? /^\d+\.\s/ : /^[*-]\s/
    const bulletMatch = newState.input
      .slice(newState.position)
      .match(bulletPattern)

    if (!bulletMatch) break
    newState = advance(newState, bulletMatch[0].length)

    const [value, stateAfterValue] = consumeUntil(newState, '\n')
    newState = advance(stateAfterValue)
    items.push({ type: 'listItem', value })
  }
  return [{ type: 'list', ordered, children: items }, newState]
}

export const parseParagraph = (state: ParserState): [Token, ParserState] => {
  const [value, stateAfterValue] = consumeUntil(state, '\n')
  const newState = advance(stateAfterValue)
  return [{ type: 'paragraph', value }, newState]
}

export const parseInlineElements = (text: string): Token[] => {
  return [{ type: 'text', value: text }]
}

export const tokenize = (input: string): Token[] => {
  const tokens: Token[] = []
  let state: ParserState = { input, position: 0 }

  while (!isAtEnd(state)) {
    const char = getCurrentChar(state)

    if (!char) break

    if (char === '#' && state.input[state.position + 1] === ' ') {
      const [token, newState] = parseHeading(state)
      tokens.push(token)
      state = newState
      continue
    }

    if (
      char === '`' &&
      state.input.slice(state.position, state.position + 3) === '```'
    ) {
      const [token, newState] = parseCodeBlock(state)
      tokens.push(token)
      state = newState
      continue
    }

    if (/^(\d+\.\s|[*-]\s)/.test(state.input.slice(state.position))) {
      const [token, newState] = parseList(state)
      tokens.push(token)
      state = newState
      continue
    }
    const [token, newState] = parseParagraph(state)
    tokens.push(token)
    state = newState
  }

  return tokens
}
