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

// United Kingdom country prefix.
const ukPrefix = '44';

// Disable as linter wants new line between each element in the COUNTRY_PREFIXES array and this looks silly.
/* eslint-disable prettier/prettier */

// Originally found in and extracted from `notifications_utils/international_billing_rates.yml#line 44 - line 2891` at the above repo.
const COUNTRY_PREFIXES = [
  '1876', '1869', '1868', '1784', '1767', '1758', '1721',
  '1684', '1664', '1649', '1473', '1441', '1345', '1284',
  '1268', '1264', '1246', '1242',
  '998', '996', '995', '994', '993', '992', '977', '976',
  '975', '974', '973', '972', '971', '970', '968', '967',
  '966', '965', '964', '963', '962', '961', '960', '886',
  '880', '856', '855', '853', '852', '692', '691', '689',
  '687', '685', '682', '680', '679', '678', '677', '676',
  '675', '674', '673', '672', '670', '599', '598', '597',
  '596', '595', '594', '593', '592', '591', '590', '509',
  '508', '507', '506', '505', '504', '503', '502', '501',
  '500', '423', '421', '420', '389', '387', '386', '385',
  '382', '381', '380', '378', '377', '376', '375', '374',
  '373', '372', '371', '370', '359', '358', '357', '356',
  '355', '354', '353', '352', '351', '350', '299', '298',
  '297', '269', '268', '267', '266', '265', '264', '263',
  '262', '261', '260', '258', '257', '256', '255', '254',
  '253', '252', '251', '250', '249', '248', '246', '245',
  '244', '243', '242', '241', '240', '239', '238', '237',
  '236', '235', '234', '233', '232', '231', '230', '229',
  '228', '227', '226', '225', '224', '223', '222', '221',
  '220', '218', '216', '213', '212', '211',
  '98', '95', '94', '93', '92', '91', '90', '86', '84', '82',
  '81', '66', '65', '64', '63', '62', '61', '60', '58', '57',
  '56', '55', '54', '53', '52', '51', '49', '48', '47', '46',
  '45', '44', '43', '41', '40', '39', '36', '34', '33', '32',
  '31', '30', '27', '20',
  '7', '1'
];

/* eslint-enable prettier/prettier */

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
  return formatters.stripAndRemoveObscureWhitespace(emailAddress.toLowerCase());
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

/**
 * Validates an international prefix against an array of international prefixes.
 *
 * Originally found in `notifications_utils/recipients.py#L427-L432`, at
 * the above repo. Modified slightly to return true if valid prefix, else false.
 *
 * @param {string} phoneNumber The phone number whose prefix is to be validated.
 * @returns {boolean} Returns true if prefix is valid, else false.
 */
const validateInternationalPrefix = (phoneNumber) => {
  for (const prefix of COUNTRY_PREFIXES) {
    if (phoneNumber.startsWith(prefix)) {
      return true;
    }
  }

  return false;
};

/**
 * Normalises a phone number by removing all whitespace, brackets, and `-` and `+` characters, then checks
 * we have an actual number before removing any leading zero.
 *
 * Originally found in `notifications_utils/recipients.py#L364-L374`, at
 * the above repo.
 *
 * @param {string} phoneNumber The phone number to normalise.
 * @returns {string} Returns the normalised phone number.
 */
const normalisePhoneNumber = (phoneNumber) => {
  const charactersToRemove = formatters.allWhitespace;
  charactersToRemove.push('(', ')', '-', '+');

  for (const char of charactersToRemove) {
    phoneNumber = phoneNumber.replaceAll(char, '');
  }

  if (Number.isNaN(Number(phoneNumber))) {
    throw new TypeError('Must not contain letters or symbols');
  }

  return lTrim(phoneNumber, '0');
};

/**
 * Checks a phone number is a UK number or not, checking the number starts with 0 and not 00,
 * then normalising the number and checking if it has a UK country prefix or starts with 7.
 *
 * Originally found in `notifications_utils/recipients.py#L377-L392`, at
 * the above repo.
 *
 * @param {string} phoneNumber The phone number to check.
 * @returns {boolean} Returns true if number is a UK number, else false.
 */
const isUkPhoneNumber = (phoneNumber) => {
  if (phoneNumber.startsWith('0') && !phoneNumber.startsWith('00')) {
    return true;
  }

  phoneNumber = normalisePhoneNumber(phoneNumber);

  if (phoneNumber.startsWith(ukPrefix) || (phoneNumber.startsWith('7') && phoneNumber.length < 11)) {
    return true;
  }

  return false;
};

/**
 * Validates that a phone number is a genuine UK phone number.
 *
 * Originally found in `notifications_utils/recipients.py#L443-L456`, at
 * the above repo. Modified slightly to allow for longer or shorter land line
 * numbers, original only considered mobile numbers.
 *
 * @param {string} phoneNumber The phone number to validate.
 * @returns {string} Returns the phone number if it passes validation, else throws an error.
 */
const validateUkPhoneNumber = (phoneNumber) => {
  let number = normalisePhoneNumber(phoneNumber);
  number = lTrim(number, ukPrefix);
  number = lTrim(number, '0');

  if (number.length < 8) {
    throw new Error('Not enough digits');
  }

  if (number.length > 10) {
    throw new Error('Too many digits');
  }

  return phoneNumber;
};

/**
 * Validates a phone number, first checking if its a UK number or not, then checking its length and
 * if it has a valid country prefix.
 *
 * Originally found in `notifications_utils/recipients.py#L459-L475`, at
 * the above repo.
 *
 * @param {string} phoneNumber The phone number to validate.
 * @returns {string} Returns the phone number if it passes validation, else throws an error.
 */
const validatePhoneNumber = (phoneNumber) => {
  if (isUkPhoneNumber(phoneNumber)) {
    return validateUkPhoneNumber(phoneNumber);
  }

  const number = normalisePhoneNumber(phoneNumber);

  if (number.length < 8) {
    throw new Error('Not enough digits');
  }

  if (number.length > 15) {
    throw new Error('Too many digits');
  }

  if (!validateInternationalPrefix(number)) {
    throw new Error('Not a valid country prefix');
  }

  return phoneNumber;
};

/**
 * Trims the given characters from the start of a given string.
 *
 * @param {string} string The string to trim.
 * @param {string} chars The characters to be trimmed from the string.
 * @returns {string} Returns the trimmed string.
 */
const lTrim = (string, chars) => {
  let index = 0;

  while (chars.includes(string[index])) {
    index += 1;
  }

  return string.slice(index);
};

module.exports = {validateEmailAddress, validateAndFormatEmailAddress, validatePhoneNumber};
