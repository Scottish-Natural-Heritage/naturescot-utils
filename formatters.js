/**
 * This file is a translation of the `formatters.py` python file from
 * the [GOV.UK notifications-utils repo](https://github.com/alphagov/notifications-utils)
 * to javascript. It was translated when their main branch was at their
 * [acbe764fb7f12c7a8b0696156283fbcb5073fcd7 commit](https://github.com/alphagov/notifications-utils/tree/acbe764fb7f12c7a8b0696156283fbcb5073fcd7).
 * The comments below that refer to files and line numbers are relative
 * to that commit.
 *
 * The only differences between this file and theirs are the translation
 * from python to javascript and some tidying to match our linter rules.
 */

// Originally found in `notifications_utils/formatters.py#L19-L27`, at
// the above repo.
const obscureWhitespace = [
  '\u180E', // Mongolian vowel separator
  '\u200B', // Zero width space
  '\u200C', // Zero width non-joiner
  '\u200D', // Zero width joiner
  '\u2060', // Word joiner
  '\u00A0', // Non breaking space
  '\uFEFF' // Zero width non-breaking space
];

/**
 * Formats a string by removing obscure whitespace and stripping regular
 * leading and trailing whitespace.
 *
 * Originally found in `notifications_utils/formatters.py#L330-L334`, at
 * the above repo.
 *
 * @param {string} value A candidate string.
 * @returns {string} A formatted copy of the string.
 */
const stripAndRemoveObscureWhitespace = (value) => {
  let modifiedValue = value;
  for (const char of obscureWhitespace) {
    while (modifiedValue.includes(char)) {
      modifiedValue = modifiedValue.replace(char, '');
    }
  }

  modifiedValue = modifiedValue.trim();
  return modifiedValue;
};

const whitespace = [
  '\u0020', // Space
  '\u0009', // Tab
  '\u000A', // Linefeed
  '\u000D', // Return
  '\u000C', // Formfeed
  '\u000B' // Vertical tab
];

/**
 *
 * @param {string} value
 * @returns {string}
 */
const removeWhitespace = (value) => {
  let modifiedValue = value;
  for (const char of [...whitespace, ...obscureWhitespace]) {
    while (modifiedValue.includes(char)) {
      modifiedValue = modifiedValue.replace(char, '');
    }
  }

  modifiedValue = modifiedValue.trim();
  return modifiedValue;
};

module.exports = {stripAndRemoveObscureWhitespace, removeWhitespace};
