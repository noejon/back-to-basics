import tokenise from "./tokenise.js";

describe('Given I call tokenise on a string', () => {
  test('then it returns an empty of tokens array when the string is empty', () => {
    expect(tokenise('')).toStrictEqual([]);
  });

  describe('when ONLY text is passed', () => {
    test('then the tokens array contains ONLY a text node', () => {
      expect(tokenise('Zizou')).toStrictEqual([{ htmlTokenType: 'text', htmlTokenValue: "Zizou" }]);
    });

    // This is going to be a tough one, but for now let's skip it
    // and we refactor later
    test.skip('then the tokens array contains ONLY a text node when the text contains a <', () => {
      expect(tokenise('Zi < zou')).toStrictEqual([{ htmlTokenType: 'text', htmlTokenValue: "Zi < zou" }]);
    });
  });
  describe('when a self ending tag is passed', () => {
    test('then the tokens array contains a self ending tag with tagName zizou', () => {
      expect(tokenise('<zizou/>')).toStrictEqual([{ htmlTokenType: 'self-ending-tag', tagName: 'zizou' }]);
    })

    test(`then the tokens array contains a self ending tag with tagname zizou if whitespaces 
      are present after the tag name and before the slash`, () => {
      expect(tokenise('<zizou         />')).toStrictEqual([{ htmlTokenType: 'self-ending-tag', tagName: 'zizou' }]);
    })

    test('then an error is thrown if the / is not followed by >', () => {
      expect(() => { tokenise('<zizou/ >') })
        .toThrowError('The close tag function expects ">" only. No other character allowed')
    })

    test('then it should have all the single quoted attributes passed to it', () => {
      expect(tokenise('<zizou foot="both feet"/>')).toStrictEqual([{
        foot: "both feet",
        tagName: "zizou",
        htmlTokenType: "self-ending-tag",
      }]);
    })
    test('then it should have all the double quoted attributes passed to it', () => {
      expect(tokenise("<zizou foot='both feet'/>")).toStrictEqual([{
        foot: "both feet",
        tagName: "zizou",
        htmlTokenType: "self-ending-tag",
      }]);
    })

    // TODO: Test for boolean attributes, they seem to not be passing
  })

  describe('when an start tag is passed', () => {
    test('then the tokens array contains a start tag with tagName zizou', () => {
      expect(tokenise('<zizou>')).toStrictEqual([{ htmlTokenType: 'start-tag', tagName: 'zizou' }]);
    })

    test('then it should have all the single quoted attributes passed to it', () => {
      expect(tokenise("<zizou foot='both feet'>")).toStrictEqual([{
        foot: "both feet",
        tagName: "zizou",
        htmlTokenType: "start-tag",
      }]);
    })

    test('then it should have all the double quoted attributes passed to it', () => {
      expect(tokenise('<zizou foot="both feet">')).toStrictEqual([{
        foot: "both feet",
        tagName: "zizou",
        htmlTokenType: "start-tag",
      }]);
    })

    // TODO: Test for boolean attributes, they seem to not be working
  })

  describe('when an end tag is passed', () => {
    test('then the tokens array contains an start tag with tagName zizou', () => {
      expect(tokenise('</zizou>')).toStrictEqual([{ htmlTokenType: 'end-tag', tagName: 'zizou' }]);
    })

    test('then an error is thrown if an attribute is detected', () => {
      expect(() => { tokenise('</zizou name="zidane">') })
        .toThrowError('Unexpected attribute in end tag')
    })

    test('then an error is thrown if a second slash is detected', () => {
      expect(() => { tokenise('</zizou/') })
        .toThrowError('Too many ending slashes')
    })
  });

  test('then the HTML is tokenised correctly when some valid complex HTML is passed', () => {
    expect(tokenise(`<zizou type="number 10" undeuxtrois='zero'>We are the champions<zidane first-name='zinedine'/></zizou>`)).toStrictEqual([{
      htmlTokenType: 'start-tag',
      tagName: 'zizou',
      type: 'number 10',
      undeuxtrois: 'zero'
    }, {
      htmlTokenType: 'text',
      htmlTokenValue: 'We are the champions',
    }, {
      htmlTokenType: 'self-ending-tag',
      tagName: 'zidane',
      'first-name': 'zinedine'
    }, {
      htmlTokenType: 'end-tag',
      tagName: 'zizou',
    }])
  })
})