## Qwik i18n not working

`getLocale` doesn't return a locale.

Test with:

`nvm use`

`pnpm install`

`pnpm start`

See an error in the terminal: `Reading 'locale' outside of context.`

`getLocale` in `src/i18n.ts` always returns empty, unless a default locale is
passed in, then it only returns the default.
