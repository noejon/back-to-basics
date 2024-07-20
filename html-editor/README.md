# HTML Code Editor

This is a simple project to write an HTML code editor.
The layout will be quite simple. The meaty part of this project will be handling the HTML. The plan is to parse it and perform some checks on it.

## Layout

The layout is quite simple, it's just two divs, one to write the code and the other to render the code.
The first div is contenteditable to allow it to be editor like.

## Parsing HTML

The parsing part of the HTML is what interests me the most in this mini-project. I don't want to use any external library to parse the HTML code.
The first step is to tokenise the HTML.

### Tokenising HTML

To tokenise the HTML, we first need to define what the tokens look like, what is the html grammar. We'll define a state machine to perform the tokenisation

#### Grammar

| Token Type | Example |
| - | - |
| Tag Open | `<div>` |
| Tag Close | `</div>` |
| Attribute Name | `id, class, data-xyz` |
| Attribute Value | `myId, my-class` |
| Text | `This is a text` |
| Self-closing Tag | `<input/>` |

#### State Machine

Now that the grammar is defined let's look at the state machine.

![state machine for HTML](/HTML%20Editor/assets/OhTomate.png)
