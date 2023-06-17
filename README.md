# Wand selection Discord bot

Discord bot to help with wand selection for servers based on a certain magic franchise.

## How to use

1. Copy `.env.example` to `.env` and set up token and client id.
2. Copy `messages.example.json` to `messages.json` and optionally set up your own labels
3. Install dependencies using `pnpm` with `pnpm i`
4. Build with `pnpm run build`
5. Deploy commands to Discord using `node dist/deploy-commands.js`
6. Run server using either `pnpm run start` or `node dist/index.js`

