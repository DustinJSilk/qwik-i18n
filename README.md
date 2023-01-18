## Qwik i18n not working

`getLocale` doesn't return a locale.

Test with:

`pnpm install`

`pnpm start`

See an error in the terminal.

When following the guidelines of https://github.com/mhevery/qwik-i18n, we setup
a method $localize that calls `getLocale`. `getLocale` doesnt return a locale
which is causing translations to not work.

In `src/routes/index.ts` there are 2 calls to geLocale to see them fail.
