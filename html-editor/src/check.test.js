import checkHtml from "./check.js"
import parseTokens from "./parse.js"
import tokenise from "./tokenise.js"

describe('given I call checkHtml', () => {
  test('then return no error when an img/ has a populated alt', () => {
    const html = `<div><img src="" alt="A piece of art by Noj"/></div>`
    const root = parseTokens(tokenise(html));
    const a11yErrors = checkHtml(root);
    expect(a11yErrors).toStrictEqual([]);
  })
  test('then return no error when an img has a populated alt', () => {
    const html = `<div><img src="" alt="A piece of art by Noj"></div>`
    const root = parseTokens(tokenise(html));
    const a11yErrors = checkHtml(root);
    expect(a11yErrors).toStrictEqual([]);
  })

  test('then return an error when an img has alt but it is empty', () => {
    const html = `<div><img src="" alt=""/></div>`
    const root = parseTokens(tokenise(html));
    const a11yErrors = checkHtml(root);
    expect(a11yErrors).toStrictEqual(['Image is missing alt description']);
  });

  test('then return an error when no alt attribute is present', () => {
    const html = `<div><img src="" alt=""/></div>`
    const root = parseTokens(tokenise(html));
    const a11yErrors = checkHtml(root);
    expect(a11yErrors).toStrictEqual(['Image is missing alt description']);
  });
})