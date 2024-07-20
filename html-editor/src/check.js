import { TOKEN_TYPES } from "./tokenise.js";

const CHECK_ERRORS = {
  TAG_NAME_NOT_MATCHING: 'Tag name does not match passed node',
}

const A11Y_ERRORS = {
  IMG_MISSING_ALT: 'Image is missing alt description'
}

const HTML_TAGS = {
  IMG: 'img'
};

const ATTRIBUTES = {
  ALT: 'alt'
}

const checkers = {
  img: function (node) {
    if (node.tagName !== HTML_TAGS.IMG) {
      throw new Error(CHECK_ERRORS.TAG_NAME_NOT_MATCHING)
    }
    const a11yErrors = [];
    if (!node.attributes || !node.attributes.hasOwnProperty(ATTRIBUTES.ALT) || node.attributes[ATTRIBUTES.ALT] === '') {
      a11yErrors.push(A11Y_ERRORS.IMG_MISSING_ALT)
    }
    return a11yErrors;
  }
}

const checkHtml = function (node) {
  if (node.type === TOKEN_TYPES.TEXT) {
    return [];
  }
  const checker = checkers[node.tagName];
  let a11yErrors = [];
  if (checker) {
    a11yErrors = [...checker(node)]
  }

  for (let i = 0; i < node.children.length; i++) {
    a11yErrors = [...a11yErrors, ...checkHtml(node.children[i])];
  }

  return a11yErrors;
}

export default checkHtml;