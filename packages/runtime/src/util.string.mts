import { parseRawText } from '../../parser/src/index.mjs'
import type { Part } from '../../parser/src/types.mjs'
import type { Args, Arguments, BaseFormatters, Cache, Locale, LocalizedString } from './core.mjs'
import { translate } from './core.mjs'

export type TranslateByString = (text: string, ...args: Arguments) => LocalizedString

export const getPartsFromString = (cache: Cache, text: string): Part[] =>
	(cache as Record<string, Part[]>)[text] || ((cache as Record<string, Part[]>)[text] = parseRawText(text))

const translateString = <F extends BaseFormatters>(
	cache: Cache,
	pluralRules: Intl.PluralRules,
	formatters: F,
	text: string,
	...args: Arguments
) => translate(getPartsFromString(cache, text), pluralRules, formatters, args)

export const i18nString = <L extends Locale, F extends BaseFormatters>(
	locale: L,
	formatters: F = {} as F,
): TranslateByString => translateString.bind(null, {}, new Intl.PluralRules(locale), formatters)

export const typesafeI18nString = <L extends Locale, F extends BaseFormatters>(
	locale: L,
	formatters: F = {} as F,
): (<Translation extends string>(text: Translation, ...args: Args<Translation, keyof F>) => LocalizedString) =>
	translateString.bind(null, {}, new Intl.PluralRules(locale), formatters)
