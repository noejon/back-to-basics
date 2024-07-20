import parseTokens from "./parse.js";
import tokenise from "./tokenise.js";

describe('Given I call parseTokens', () => {
  test('then it throws an error if a weird token type is passed', () => {
    const badTokens = [{
      htmlTokenType: 'badType',
      tagName: 'bad'
    }];

    expect(() => {
      parseTokens(badTokens)
    }).toThrowError('Unknown token type');
  });

  test('then it throws an error when open and close tags mismatch', () => {
    const mismatchTokens = [{
      htmlTokenType: 'start-tag',
      tagName: 'zizou'
    },
    {
      htmlTokenType: 'end-tag',
      tagName: 'zidane'
    },];

    expect(() => {
      parseTokens(mismatchTokens)
    }).toThrowError('Closing tag does not match opening tag')
  })

  test('then the representation of the DOM should match the passed tokenised HTML', () => {
    const parsedHtml = parseTokens(tokenise('<div test="attribute">text <img src=""/> after image</div>'));

    const expectedDiv = parsedHtml.children[0];

    expect(expectedDiv.tagName).toBe('div');
    expect(expectedDiv.type).toBe('start-tag');
    expect(expectedDiv.attributes).toStrictEqual({ test: 'attribute' });

    const [text, img, afterImage] = expectedDiv.children;

    expect(text.type).toBe('text');
    expect(text.text).toBe('text ');

    expect(afterImage.type).toBe('text');
    expect(afterImage.text).toBe(' after image');

    expect(img.type).toBe('self-ending-tag');
    expect(img.tagName).toBe('img');
    expect(img.attributes).toStrictEqual({ src: '' });
  })
})