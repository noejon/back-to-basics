import checkHtml from "./src/check.js";
import parseTokens from "./src/parse.js";
import tokenise from "./src/tokenise.js";

function setAndCheckHtml() {
  const htmlRenderer = document.querySelector('.html-renderer');
  const htmlEditor = document.querySelector('.html-editor');
  const inputText = htmlEditor.textContent;

  try {
    const htmlTokens = tokenise(inputText);
    const dom = parseTokens(htmlTokens);
    const a11yErrors = checkHtml(dom);
    const errorParagraph = document.querySelector('.a11y-error');
    if (a11yErrors.length > 0) {
      errorParagraph.textContent = a11yErrors.toString();
    } else {
      errorParagraph.textContent = "";
    }
  } catch (error) {
    console.error(error);
  }
  htmlRenderer.innerHTML = inputText;
}

document.addEventListener('DOMContentLoaded', function () {
  const htmlEditor = document.querySelector('.html-editor');
  htmlEditor.textContent = '<div><img src="https://www.giantbomb.com/a/uploads/scale_small/7/73970/3378516-4152695206-zined.jpg"/></div>'
  setAndCheckHtml();
  htmlEditor.addEventListener("input", function (_) {
    setAndCheckHtml()
  })
});