import { loadTranslations } from "@angular/localize";
import "@angular/localize/init";
import {
  $,
  getLocale,
  useEnvData,
  useOnDocument,
  withLocale,
} from "@builder.io/qwik";
import type { RenderOptions } from "@builder.io/qwik/server";
import EN from "./locale/message.en.json";
import FR from "./locale/message.fr.json";

const TRANSLATION_FILES = [EN, FR];

/// Declare location where extra types will be stored.
const $localizeFn = $localize as any as {
  TRANSLATIONS: Record<string, any>;
  TRANSLATION_BY_LOCALE: Map<string, Record<string, any>>;
};

/**
 * This solution uses the `@angular/localize` package for translations, however out of the box
 * `$localize` works with a single translation only. This code adds support for multiple locales
 * concurrently. It does this by intercepting the `TRANSLATIONS` property read and returning
 * appropriate translation based on the current locale which is stored in the `useEnvDate('locale')`
 */
if (!$localizeFn.TRANSLATION_BY_LOCALE) {
  $localizeFn.TRANSLATION_BY_LOCALE = new Map([["", {}]]);
  Object.defineProperty($localize, "TRANSLATIONS", {
    get: function () {
      const locale = getLocale();
      let translations = $localizeFn.TRANSLATION_BY_LOCALE.get(locale);
      if (!translations) {
        $localizeFn.TRANSLATION_BY_LOCALE.set(locale, (translations = {}));
      }
      return translations;
    },
  });
}

/**
 * Function used to load all translations variants.
 */
export function initTranslations() {
  console.log("Loading translations");
  TRANSLATION_FILES.forEach(({ translations, locale }) => {
    withLocale(locale, () => loadTranslations(translations));
  });
}

/**
 * Function used to examine the request and determine the locale to use.
 *
 * This function is meant to be used with `RenderOptions.locale` property
 *
 * @returns The locale to use which will be stored in the `useEnvData('locale')`.
 */
export function extractLang(
  acceptLanguage: string | undefined | null,
  url: string
): string {
  let locale =
    (url && new URL(url).searchParams.get("locale")) ||
    acceptLanguage?.split(",")[0];
  if (locale) {
    // If we have a locale, make sure it's in the list of supported locales.
    if (!$localizeFn.TRANSLATION_BY_LOCALE.has(locale)) {
      // If not, try to remove sub-locale. (e.g. `en-US` -> `en`)
      locale = locale.split("-")[0];
      if (!$localizeFn.TRANSLATION_BY_LOCALE.has(locale)) {
        locale = ""; // If not, give up and don't translate.
      }
    }
  }
  return locale || "";
}

/**
 * Function used to determine the base URL to use for loading the chunks in the browser.
 *
 * The function returns `/build` in dev mode or `/build/<locale>` in prod mode.
 *
 * This function is meant to be used with `RenderOptions.base` property
 *
 * @returns The base URL to use for loading the chunks in the browser.
 */
export function extractBase({ envData }: RenderOptions): string {
  const { qwikcity } = envData as {
    qwikcity: { mode: string };
  };
  if (qwikcity.mode === "dev") {
    return "/build";
  } else {
    return "/build/" + envData!.locale;
  }
}

export function useI18n() {
  const shouldLoad = useEnvData<{ mode: string }>("qwikcity")!.mode == "dev";
  if (shouldLoad) {
    useOnDocument("qinit", $(initTranslations));
  }
}

initTranslations();
