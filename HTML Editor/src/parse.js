import { TOKEN_TYPES } from "./tokenise.js";

const PARSING_ERRORS = {
  UNKNOWN_TOKEN_TYPE: 'Unknown token type',
  OPEN_CLOSE_NAME_MISMATCH: 'Closing tag does not match opening tag'
}

class HtmlNode {
  constructor({ type, text, tagName, attributes }) {
    this.type = type;
    this.tagName = tagName;
    this.text = text;
    this.attributes = attributes;
    this.children = [];
  }
}

const parseTokens = function (tokens) {
  const root = new HtmlNode({ tagName: 'root' });
  const stack = [root];
  let currentParent = root;

  if (!tokens) {
    return;
  }

  for (let i = 0; i < tokens.length; i++) {
    const { htmlTokenType: type, tagName, htmlTokenValue: text, ...attributes } = tokens[i];
    console
    switch (type) {
      case TOKEN_TYPES.START_TAG:
        const newNode = new HtmlNode({ type, tagName, attributes });
        currentParent.children.push(newNode);
        currentParent = newNode;
        stack.push(newNode);
        break;
      case TOKEN_TYPES.END_TAG:
        if (currentParent.tagName != tagName) {
          throw new Error(PARSING_ERRORS.OPEN_CLOSE_NAME_MISMATCH);
        }
        stack.pop();
        currentParent = stack[stack.length - 1];
        break;
      case TOKEN_TYPES.SELF_ENDING_TAG:
        const newSelfClosingNode = new HtmlNode({ type, tagName, attributes });
        currentParent.children.push(newSelfClosingNode)
        break;
      case TOKEN_TYPES.TEXT:
        const newTextNode = new HtmlNode({ type, text });
        currentParent.children.push(newTextNode);
        break;
      default:
        throw new Error(PARSING_ERRORS.UNKNOWN_TOKEN_TYPE);
    }
  }

  return root;
}

export default parseTokens;