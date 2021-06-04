const uts46 = require('idna-uts46-hx');

const formatters = require('./formatters.js');

/**
 * This file is a translation of the `recipients.py` python file from
 * the [GOV.UK notifications-utils repo](https://github.com/alphagov/notifications-utils)
 * to javascript. It was translated when their main branch was at their
 * [acbe764fb7f12c7a8b0696156283fbcb5073fcd7 commit](https://github.com/alphagov/notifications-utils/tree/acbe764fb7f12c7a8b0696156283fbcb5073fcd7).
 * The comments below that refer to files and line numbers are relative
 * to that commit.
 *
 * The only differences between this file and theirs are the translation
 * from python to javascript and some tidying to match our linter rules.
 */

// Originally found in `notifications_utils/__init__.py#L11`, at the above repo.
const hostnamePart = /^(xn|[a-z\d]+)(-?-[a-z\d]+)*$/i;

// Originally found in `notifications_utils/__init__.py#L12`, at the above repo.
const tldPart = /^([a-z]{2,63}|xn--([a-z\d]+-)*[a-z\d]+)$/i;

// Originally found in `notifications_utils/__init__.py#L13`, at the above repo.
const validLocalChars = "a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\-";

// Originally found in `notifications_utils/__init__.py#L14
const emailRegexPattern = new RegExp(`^[${validLocalChars}]+@([^.@][^@\\s]+)$`);

/**
 * Validates that an email address matches the rules required to be
 * accepted by GOV.UK Notify.
 *
 * Originally found in `notifications_utils/recipients.py#L494-L534`, at
 * the above repo.
 *
 * @param {string} emailAddress A candidate email address.
 * @returns {string} The email address, if valid.
 * @throws {Error} An error message, if the email address is not valid.
 */
const validateEmailAddress = (emailAddress) => {
  // Almost exactly the same as by
  // https://github.com/wtforms/wtforms/blob/master/wtforms/validators.py
  // with minor tweaks for SES compatibility - to avoid complications we
  // are a lot stricter with the local part than necessary - we don't
  // allow any double quotes or semicolons to prevent SES Technical
  // Failures.
  const trimmedEmailAddress = formatters.stripAndRemoveObscureWhitespace(emailAddress);
  const match = trimmedEmailAddress.match(emailRegexPattern);

  // Not an email.
  if (match === undefined || match === null || match.length === 0) {
    throw new Error('Not a valid email address');
  }

  if (trimmedEmailAddress.length > 320) {
    throw new Error('Not a valid email address');
  }

  // Don't allow consecutive periods in either part.
  if (trimmedEmailAddress.includes('..')) {
    throw new Error('Not a valid email address');
  }

  const unformattedHostname = match[1];
  let hostname;

  // IDNA = "Internationalized domain name" - this encode/decode cycle
  // converts unicode into its accurate ascii representation as the web
  // uses. '例え.テスト'.encode('idna') == b'xn--r8jz45g.xn--zckzah'.
  try {
    hostname = uts46.toAscii(unformattedHostname);
  } catch {
    throw new Error('Not a valid email address');
  }

  const parts = hostname.split('.');

  if (hostname.length > 253 || parts.length < 2) {
    throw new Error('Not a valid email address');
  }

  for (const part of parts) {
    const partMatch = part.match(hostnamePart);
    if (!part || part.length > 63 || partMatch === undefined || partMatch === null || partMatch.length === 0) {
      throw new Error('Not a valid email address');
    }
  }

  // If the part after the last '.' is not a valid TLD then bail out.
  const tldPartMatch = parts[parts.length - 1].match(tldPart);
  if (tldPartMatch === undefined || tldPartMatch === null || tldPartMatch.length === 0) {
    throw new Error('Not a valid email address');
  }

  return trimmedEmailAddress;
};

/**
 * Formats an email address by converting it to lower case, removing
 * obscure whitespace and stripping regular leading and trailing
 * whitespace.
 *
 * Originally found in `notifications_utils/recipients.py#L537-L538`, at
 * the above repo.
 *
 * @param {string} emailAddress A candidate email address.
 * @returns {string} A formatted copy of the email address.
 */
const formatEmailAddress = (emailAddress) => {
  return formatters.stripAndRemoveObscureWhitespace(emailAddress.toLower());
};

/**
 * Validates and formats an email address in to the pattern required by
 * GOV.UK Notify.
 *
 * Originally found in `notifications_utils/recipients.py#L541-L542`, at
 * the above repo.
 *
 * @param {string} emailAddress A candidate email address.
 * @returns {string} A formatted copy of the email address, if valid.
 * @throws {Error} An error message, if the email address is not valid.
 */
const validateAndFormatEmailAddress = (emailAddress) => {
  return formatEmailAddress(validateEmailAddress(emailAddress));
};

module.exports = {validateEmailAddress, validateAndFormatEmailAddress};
