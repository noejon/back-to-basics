const GRAMMAR = {
  OPEN_TAG: '<',
  SLASH: '/',
  ALPHABET_CHARACTER_REGEX: /[a-zA-Z]/,
  WHITESPACE_REGEX: /\s/,
  CLOSE_TAG: '>',
  EQUAL: '=',
  SINGLE_QUOTE: "'",
  DOUBLE_QUOTE: '"',
}

export const TOKEN_TYPES = {
  TEXT: 'text',
  START_TAG: 'start-tag',
  END_TAG: 'end-tag',
  SELF_ENDING_TAG: 'self-ending-tag',
  VOID_ELEMENT_TAG: 'void-element-tag'
}

const BOOLEAN_ATTRIBUTE = 'parser-boolean-attribute';

const ERRORS = {
  TAG_OPEN_STATE: 'Unexpected character in tag open state',
  END_TAG_OPEN_STATE: 'Unexpected character in end tag open state',
  ATTRIBUTE_IN_END_TAG: 'Unexpected attribute in end tag',
  SELF_ENDING_TAG_STATE: 'Unexpected character in self ending tag state',
  TOO_MANY_ENDING_SLASHES: 'Too many ending slashes',
  MISSING_ATTRIBUTE_NAME: 'Missing attribute name before = sign',
  MISSING_ATTRIBUTE_VALUE_OPEN: 'Attribute value has no open single or double quote',
  UNEXPECTED_CHARACTER_IN_CLOSE_TAG: 'The close tag function expects ">" only. No other character allowed'
}

// https://developer.mozilla.org/en-US/docs/Glossary/Void_element
const VOID_ELEMENT_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

function tokenise(html) {
  const tokens = [];
  let currentState = outsideTagState;
  let currentToken = null;
  let currentAttribute = null;

  function addToken(token) {
    tokens.push(token);
  }

  // When this state is entered no tag is started
  function outsideTagState(character) {
    if (character === GRAMMAR.OPEN_TAG) {
      if (currentToken) {
        addToken(currentToken);
        currentToken = null;
      }
      return tagOpenState;
    }
    if (currentToken) {
      currentToken.htmlTokenValue += character;
    } else {
      currentToken = { htmlTokenType: TOKEN_TYPES.TEXT, htmlTokenValue: character }
    }
    return outsideTagState;
  }

  function tagOpenState(character) {
    if (character === GRAMMAR.SLASH) {
      return endTagOpenSpate;
    }
    if (GRAMMAR.ALPHABET_CHARACTER_REGEX.test(character)) {
      currentToken = { htmlTokenType: TOKEN_TYPES.START_TAG, tagName: '' };
      return tagNameState(character);
    }
    throw new Error(ERRORS.TAG_OPEN_STATE)
  }

  function endTagOpenSpate(character) {
    if (GRAMMAR.ALPHABET_CHARACTER_REGEX.test(character)) {
      currentToken = { htmlTokenType: TOKEN_TYPES.END_TAG, tagName: '' };
      return tagNameState(character);
    }
    throw new Error(ERRORS.END_TAG_OPEN_STATE)
  }

  function tagNameState(character) {
    if (GRAMMAR.WHITESPACE_REGEX.test(character)) {
      return whitespaceState;
    }
    if (character === GRAMMAR.CLOSE_TAG) {
      return closeTagState(character);
    }
    if (character === GRAMMAR.SLASH) {
      return selfClosingTagState(character);
    }
    currentToken.tagName += character.toLowerCase();
    return tagNameState;
  }

  function whitespaceState(character) {
    console.log(currentToken, 'in whitespace')
    if (GRAMMAR.WHITESPACE_REGEX.test(character)) {
      return whitespaceState;
    }
    if (character === GRAMMAR.SLASH) {
      return selfClosingTagState(character);
    }
    if (character === GRAMMAR.CLOSE_TAG) {
      return closeTagState(character);
    }
    currentAttribute = { name: '', value: '' };
    return attributeNameState(character);
  }

  function attributeNameState(character) {
    if (currentToken.htmlTokenType === TOKEN_TYPES.END_TAG) {
      throw new Error(ERRORS.ATTRIBUTE_IN_END_TAG);
    }
    if (character === GRAMMAR.WHITESPACE_REGEX) {
      currentToken[currentAttribute.name] = BOOLEAN_ATTRIBUTE;
      currentAttribute = null;
      return whitespaceState;
    }
    if (character === GRAMMAR.SLASH) {
      currentToken[currentAttribute.name] = BOOLEAN_ATTRIBUTE;
      currentAttribute = null;
      return selfClosingTagState;
    }
    if (character === GRAMMAR.CLOSE_TAG) {
      currentToken[currentAttribute.name] = BOOLEAN_ATTRIBUTE;
      currentAttribute = null;
      return closeTagState(character);
    }
    if (character === GRAMMAR.EQUAL) {
      if (currentAttribute && currentAttribute.name === '') {
        throw new Error(ERRORS.MISSING_ATTRIBUTE_NAME);
      }
      return attributeValueOpenState;
    }
    currentAttribute.name += character;
    return attributeNameState;
  }

  function attributeValueOpenState(character) {
    if (character === GRAMMAR.SINGLE_QUOTE) {
      return singleQuoteAttributeValueState;
    }
    if (character === GRAMMAR.DOUBLE_QUOTE) {
      return doubleQuoteAttributeValueState;
    }
    throw new Error(ERRORS.MISSING_ATTRIBUTE_VALUE_OPEN)
  }

  function singleQuoteAttributeValueState(character) {
    if (character === GRAMMAR.SINGLE_QUOTE) {
      currentToken[currentAttribute.name] = currentAttribute.value;
      return whitespaceState;
    }
    currentAttribute.value += character;
    return singleQuoteAttributeValueState;
  }

  function doubleQuoteAttributeValueState(character) {
    if (character === GRAMMAR.DOUBLE_QUOTE) {
      currentToken[currentAttribute.name] = currentAttribute.value
      return whitespaceState;
    }
    currentAttribute.value += character;
    return doubleQuoteAttributeValueState;
  }

  function selfClosingTagState(character) {
    if (character === GRAMMAR.SLASH) {
      if (currentToken && currentToken.htmlTokenType === TOKEN_TYPES.END_TAG) {
        throw new Error(ERRORS.TOO_MANY_ENDING_SLASHES);
      }
      currentToken.htmlTokenType = TOKEN_TYPES.SELF_ENDING_TAG;
      return closeTagState;
    }
    throw new Error(ERRORS.SELF_ENDING_TAG_STATE);
  }

  function closeTagState(character) {
    if (character !== GRAMMAR.CLOSE_TAG) {
      throw new Error(ERRORS.UNEXPECTED_CHARACTER_IN_CLOSE_TAG);
    }
    console.log(currentToken)
    VOID_ELEMENT_TAGS.has(currentToken.tagName) && console.log(VOID_ELEMENT_TAGS.has(currentToken.tagName), currentToken.htmlTokenType)
    if (VOID_ELEMENT_TAGS.has(currentToken.tagName) && currentToken.htmlTokenType !== TOKEN_TYPES.SELF_ENDING_TAG) {
      currentToken.htmlTokenType = TOKEN_TYPES.VOID_ELEMENT_TAG;
    }
    addToken(currentToken);
    currentToken = null;
    return outsideTagState;
  }

  for (let i = 0; i < html.length; i++) {
    currentState = currentState(html[i]);
  }

  if (currentToken) {
    addToken(currentToken);
  }

  return tokens;
}

export default tokenise;