"use client";

// International mode of the Phone input (`international` or `countries`).
// Loaded on demand by phone-input.tsx (React.lazy), so libphonenumber-js
// (min metadata) is only downloaded by pages that use it; Nigeria-only
// phone inputs never load this file.
import { Combobox as Base } from "@base-ui/react/combobox";
import { ChevronDown, Search } from "lucide-react";
import { AsYouType, getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/min";
import { useId, useMemo, useRef, useState } from "react";
import { cx } from "@/lib/cruise-utils";
import { CruiseFormField, cruiseFieldProps, cruiseOwnField, useCruiseField } from "./form-field";
import { cruiseFormatNgPhone, cruiseNgNational, cruiseToE164, CRUISE_NG_INVALID, type CruisePhoneInputProps } from "./phone-input";

export type CruisePhoneCountry = { code: string; dial: string; name: string };

/** Short names for messages ("Enter a valid UK phone number."). */
const SHORT: Record<string, string> = { GB: "UK", US: "US", AE: "UAE" };

const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

let allCountries: CruisePhoneCountry[] | null = null;
/** Every country libphonenumber-js knows, with English names, A to Z. */
function countryList(): CruisePhoneCountry[] {
  if (allCountries) return allCountries;
  const names = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;
  allCountries = getCountries()
    .map((code) => {
      let name: string = code;
      try {
        name = names?.of(code) ?? code;
      } catch {
        // an unknown region code: keep the code
      }
      return { code, dial: getCountryCallingCode(code), name };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
  return allCountries;
}

const upper = (codes?: string[]) => codes?.map((c) => c.toUpperCase());

/** A country by name, ISO code or dial code ("nig", "ng", "+234", "234"). */
function matches(country: CruisePhoneCountry, query: string) {
  const q = fold(query.trim());
  if (!q) return true;
  const digits = q.replace(/^\+/, "");
  return (
    fold(country.name).includes(q) ||
    country.code.toLowerCase() === q ||
    (/^\d+$/.test(digits) && country.dial.startsWith(digits))
  );
}

function formatFor(raw: string, country: string): string {
  if (country === "NG") return cruiseFormatNgPhone(raw);
  return new AsYouType(country as CountryCode).input(raw.replace(/[^\d+]/g, ""));
}

/** The E.164 number for what's typed in this country, or null if it isn't valid. */
function toE164(text: string, country: string): string | null {
  if (country === "NG") return cruiseToE164(text);
  const parsed = parsePhoneNumberFromString(text, country as CountryCode);
  if (!parsed?.isValid()) return null;
  return parsed.country === country || parsed.countryCallingCode === getCountryCallingCode(country as CountryCode) ? parsed.number : null;
}

export default function CruisePhoneInternational({
  label,
  hint,
  error,
  required,
  defaultValue = "",
  value,
  onValueChange,
  onValidate,
  defaultCountry = "NG",
  countries,
  preferredCountries = ["NG", "GH", "KE", "ZA", "GB", "US", "CA"],
  onCountryChange,
  name,
  id,
  disabled,
  className,
  onBlur,
  ...props
}: Omit<CruisePhoneInputProps, "international">) {
  const outer = useCruiseField();
  const autoId = useId();
  const ref = useRef<HTMLInputElement>(null);

  // The countries people can pick (an allow-list, or all), the suggested
  // ones first.
  const allowedList = useMemo(() => {
    const all = countryList();
    const allow = upper(countries);
    return allow ? all.filter((c) => allow.includes(c.code)) : all;
  }, [countries]);
  const allowed = (code: string | undefined): code is string => Boolean(code && allowedList.some((c) => c.code === code));
  /** A full +number shown the national way for its country ("07911 123456"). */
  const nationalText = (compact: string, country: string) => {
    if (country === "NG") return cruiseFormatNgPhone(compact);
    const parsed = parsePhoneNumberFromString(compact);
    if (!parsed) return formatFor(compact, country);
    // Re-read the national digits as this country's number, so the national
    // prefix and grouping are this country's ("07911 123456").
    return parsePhoneNumberFromString(parsed.nationalNumber, country as CountryCode)?.formatNational() ?? formatFor(parsed.nationalNumber, country);
  };
  const byCode = (code: string) => allowedList.find((c) => c.code === code) ?? countryList().find((c) => c.code === code);
  const firstCountry = allowed(defaultCountry.toUpperCase()) ? defaultCountry.toUpperCase() : (allowedList[0]?.code ?? "NG");
  const preferred = upper(preferredCountries) ?? [];

  /**
   * The country of a full +number. Several countries can share a dial code
   * (+44: UK, Guernsey, Jersey, Isle of Man; +1: US, Canada, …), and the
   * small metadata can't always tell them apart, so among the allowed
   * countries with that code and a valid number: the detected one if it's a
   * preferred country (area codes tell US from Canada), then the current
   * country, then the first preferred one (+44 7911… is the UK, not
   * Guernsey), then the detected one, then any. Returns the detected country
   * (allowed or not) when no allowed country fits, so the caller can say
   * it isn't supported.
   */
  function countryOf(compact: string, current: string): { country?: string; ok: boolean } {
    const parsed = parsePhoneNumberFromString(compact);
    const typer = new AsYouType();
    typer.input(compact);
    const detected = parsed?.country ?? typer.getCountry();
    const dial = parsed?.countryCallingCode ?? typer.getCallingCode();
    if (!dial) return { country: detected, ok: false };
    const sameCode = allowedList.filter((c) => c.dial === dial);
    const national = parsed?.nationalNumber ?? "";
    const valid = sameCode.filter((c) => (c.code === "NG" ? cruiseToE164(compact) : parsed?.isValid() && toE164(national, c.code)));
    const pool = valid.length ? valid : sameCode;
    const has = (code?: string) => Boolean(code && pool.some((c) => c.code === code));
    const pick =
      (detected && has(detected) && preferred.includes(detected) && detected) ||
      (has(current) && current) ||
      preferred.find((code) => has(code)) ||
      (has(detected) && detected) ||
      pool[0]?.code;
    return pick ? { country: pick, ok: true } : { country: detected, ok: false };
  }

  /** A value from outside (E.164 or national) -> the country and the text to show. */
  function fromValue(raw: string, fallback: string): { country: string; text: string } {
    if (!raw) return { country: fallback, text: "" };
    if (!raw.trim().startsWith("+")) return { country: fallback, text: formatFor(raw, fallback) };
    const compact = raw.replace(/[^\d+]/g, "");
    const found = countryOf(compact, fallback);
    const country = found.ok && found.country ? found.country : fallback;
    return { country, text: nationalText(compact, country) };
  }

  const [initial] = useState(() => fromValue(value ?? defaultValue, firstCountry));
  const [country, setCountryState] = useState(initial.country);
  const [text, setText] = useState(initial.text);
  const [touched, setTouched] = useState(false);
  const [unsupported, setUnsupported] = useState<string>();
  // Controlled: as in the Nigeria-only input, a different value from the
  // parent (a reset, a loaded record) replaces what's shown.
  const [synced, setSynced] = useState(value);
  if (value !== undefined && value !== synced) {
    setSynced(value);
    const next = fromValue(value ?? "", country);
    setText(next.text);
    if (next.country !== country) setCountryState(next.country);
    setUnsupported(undefined);
  }

  function setCountry(next: string) {
    if (next === country) return;
    setCountryState(next);
    onCountryChange?.(next);
  }

  const current = byCode(country) ?? { code: country, dial: "", name: country };
  const e164 = toE164(text, country);
  const hasDigits = (country === "NG" ? cruiseNgNational(text) : text.replace(/\D/g, "")) !== "";
  const invalidNumber =
    unsupported ??
    (hasDigits && !e164
      ? country === "NG"
        ? CRUISE_NG_INVALID
        : `Enter a valid ${SHORT[country] ?? current.name} phone number.`
      : undefined);
  const message = error ?? (touched || unsupported ? invalidNumber : undefined);
  const own = !outer && label ? cruiseOwnField(id ?? autoId, { hint, error: message, required }) : null;
  const field = outer ?? own;

  function report(nextText: string, nextCountry: string) {
    const next = toE164(nextText, nextCountry);
    setSynced(next);
    onValueChange?.(next);
  }

  function update(raw: string, caret: number) {
    // Digits and "+" count as typed characters (a lone "+" must keep the caret after it).
    const significant = (t: string) => t.replace(/[^\d+]/g, "").length;
    const before = significant(raw.slice(0, caret));
    let nextCountry = country;
    let next: string;
    let problem: string | undefined;
    if (raw.trimStart().startsWith("+")) {
      // A full international number (typed or pasted): find its country.
      const compact = raw.replace(/[^\d+]/g, "");
      const intl = new AsYouType().input(compact);
      const found = countryOf(compact, country);
      if (found.ok && found.country) {
        nextCountry = found.country;
        next = nationalText(compact, found.country);
      } else if (found.country) {
        next = intl;
        problem = `Numbers from ${byCode(found.country)?.name ?? found.country} aren't supported here.`;
      } else {
        next = intl;
      }
    } else {
      next = formatFor(raw, country);
    }
    setUnsupported(problem);
    setText(next);
    setCountry(nextCountry);
    report(next, nextCountry);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el || document.activeElement !== el) return;
      // When the text was rewritten (a country found, a +234 turned into 0), aim for the end.
      const target = significant(raw) !== significant(next) ? -1 : before;
      let pos = 0;
      if (target < 0) pos = next.length;
      else for (let seen = 0; pos < next.length && seen < target; pos++) if (/[\d+]/.test(next[pos])) seen++;
      el.setSelectionRange(pos, pos);
    });
  }

  function pickCountry(next: string) {
    const reformatted = text.trim().startsWith("+") ? text : formatFor(text, next);
    setUnsupported(undefined);
    setText(reformatted);
    setCountry(next);
    report(reformatted, next);
    // Back to the number once a country is chosen.
    requestAnimationFrame(() => ref.current?.focus());
  }

  const control = (
    // One labelled group: the country button and the number.
    <div
      role="group"
      aria-labelledby={field?.labelId}
      className={cx("input-group", !field && className)}
      data-invalid={field?.invalid || message ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
    >
      <CountryPicker
        countries={allowedList}
        preferred={upper(preferredCountries) ?? []}
        current={current}
        disabled={disabled}
        onPick={pickCountry}
      />
      <input
        ref={ref}
        {...props}
        {...cruiseFieldProps(field, { id, invalid: Boolean(message), required })}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        disabled={disabled}
        value={text}
        placeholder={props.placeholder ?? (country === "NG" ? "0801 234 5678" : undefined)}
        onChange={(event) => update(event.target.value, event.target.selectionStart ?? event.target.value.length)}
        onBlur={(event) => {
          setTouched(true);
          onValidate?.(invalidNumber);
          onBlur?.(event);
        }}
        onInvalid={() => setTouched(true)}
        className="input-bare"
      />
      {name && <input type="hidden" name={name} value={e164 ?? ""} />}
    </div>
  );

  if (own) {
    return (
      <CruiseFormField label={label} hint={hint} error={message} required={required} id={own.id} className={className}>
        {control}
      </CruiseFormField>
    );
  }
  return control;
}

type Group = { label: string; items: CruisePhoneCountry[] };

/** The country button ("NG +234") and its searchable list (Base UI
 * Combobox, like CruiseCombobox: listbox / option roles, arrow keys, typing
 * filters by name, ISO code or dial code). Text only, no flag emoji. */
function CountryPicker({
  countries,
  preferred,
  current,
  disabled,
  onPick,
}: {
  countries: CruisePhoneCountry[];
  preferred: string[];
  current: CruisePhoneCountry;
  disabled?: boolean;
  onPick: (code: string) => void;
}) {
  const groups: Group[] = useMemo(() => {
    const top = preferred.map((code) => countries.find((c) => c.code === code)).filter((c): c is CruisePhoneCountry => Boolean(c));
    if (!top.length || top.length === countries.length) return [{ label: "Countries", items: countries }];
    return [
      { label: "Suggested", items: top },
      { label: "All countries", items: countries.filter((c) => !top.includes(c)) },
    ];
  }, [countries, preferred]);
  const [query, setQuery] = useState("");

  const option = (c: CruisePhoneCountry) => (
    <Base.Item key={c.code} value={c} className={(state) => cx("menu-item", state.highlighted && "on-primary")}>
      <span className="min-w-0 flex-1">{c.name}</span>
      <span className="menu-hint tabular-nums">+{c.dial}</span>
    </Base.Item>
  );

  return (
    <Base.Root
      items={groups}
      value={current}
      onValueChange={(next) => next && onPick((next as CruisePhoneCountry).code)}
      itemToStringLabel={(c: CruisePhoneCountry) => `${c.name} (+${c.dial})`}
      itemToStringValue={(c: CruisePhoneCountry) => c.code}
      isItemEqualToValue={(a: CruisePhoneCountry, b: CruisePhoneCountry) => a.code === b.code}
      filter={matches}
      inputValue={query}
      onInputValueChange={setQuery}
      onOpenChange={(open) => !open && setQuery("")}
      autoHighlight
      disabled={disabled}
    >
      <Base.Trigger
        className="input-prefix gap-1 px-2.5 whitespace-nowrap focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-ink disabled:cursor-not-allowed"
        aria-label={`Country: ${current.name}, +${current.dial}`}
      >
        <span aria-hidden="true">{current.code}</span>
        <span aria-hidden="true" className="tabular-nums">
          +{current.dial}
        </span>
        <ChevronDown aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={3} />
      </Base.Trigger>
      <Base.Portal>
        <Base.Positioner sideOffset={8} align="start" collisionPadding={16} className="z-70">
          <Base.Popup className="menu combobox-popup w-[min(20rem,calc(100vw-2rem))]">
            <div className="p-2">
              <div className="combobox-field">
                <Search aria-hidden="true" className="combobox-search" />
                <Base.Input className="combobox-input" aria-label="Search countries" placeholder="Country, code or +dial" />
              </div>
            </div>
            <Base.Empty className="combobox-status">{query.trim() ? `No country matches "${query.trim()}"` : null}</Base.Empty>
            <Base.List className="max-h-72 overflow-y-auto">
              {(group: Group) => (
                <Base.Group key={group.label} items={group.items}>
                  <Base.GroupLabel className="menu-group-label">{group.label}</Base.GroupLabel>
                  <Base.Collection>{option}</Base.Collection>
                </Base.Group>
              )}
            </Base.List>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}
