## What?

A quickly-hacked-together Node tool to extract a
conversation from a ChatGPT JSON export.

## How?

- (Installed Node + NPM.)
- Clone this repo.
- Run `npm install`.
- Run it:
  `node index.js {path-to-conversations.json} {partial-name-of-conversation-to-extract}`.
- If all's gone well, you should have a `.txt` file with
  extracted conversation.
- If your name's not KDP, that's a shame, but you might wish
  to `export USER_NAME={your-name}` (or however you set
  environment variables in your shell).
