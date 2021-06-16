const formatters = require('./formatters.js');

/**
 * This file is a translation of the `postal_address.py` python file from
 * the [GOV.UK notifications-utils repo](https://github.com/alphagov/notifications-utils)
 * to javascript. It was translated when their main branch was at their
 * [acbe764fb7f12c7a8b0696156283fbcb5073fcd7 commit](https://github.com/alphagov/notifications-utils/tree/acbe764fb7f12c7a8b0696156283fbcb5073fcd7).
 * The comments below that refer to files and line numbers are relative
 * to that commit.
 *
 * The only differences between this file and theirs are the translation
 * from python to javascript and some tidying to match our linter rules.
 */


/**
 * Formats the postcode for regex checking by removing whitespace, obscure whitespace and
 * converting it to uppercase.
 *
 * Originally found in `notifications_utils/postal_address.py#L150-L151`, at
 * the above repo.
 *
 * @param {string} postcode The postcode entered by the candidate
 * @returns {string} normalisePostcode The postcode after being reformated with whitespace removed
 */
const normalisePostcode = (postcode) => {
  return formatters.removeWhitespace(postcode).toUpperCase();
};

/**
 * Validates a postcode against the regex set in GOV.UK Notify.
 *
 * Originally found in `notifications_utils/postal_address.py#L154-L160`, at
 * the above repo.
 *
 * @param {string} postcode The postcode entered by the candidate
 * @returns {boolean} pattern.test A boolean confirmation of a pattern being present
 */
const isaRealUkPostcode = (postcode) => {
  const standard = '(^[A-Z]{1,2}[0-9][0-9A-Z]?[0-9][A-BD-HJLNP-UW-Z]{2}$)';
  const bfpo = '(^BFPO?(C\\/O)?[0-9]{1,4}$)';
  const girobank = '(^GIR0AA$)';
  const pattern = new RegExp(`${standard}|${bfpo}|${girobank}`);

  return pattern.test(normalisePostcode(postcode));
};

/**
 * Formats the postcode to standard postcode format without whitespace removed.
 *
 * Originally found in `notifications_utils/postal_address.py#L163-L173`, at
 * the above repo.
 *
 * @param {string} postcode The postcode entered by the candidate.
 * @returns {string} normalised a version of the postcode reformated.
 */
const formatPostcodeForPrinting = (postcode) => {
  const normalised = normalisePostcode(postcode);
  if (normalised.includes('BFPOC/O')) {
    return normalised.slice(0, 4) + ' C/O ' + normalised.slice(7, normalised.length);
  }

  if (normalised.includes('BFPO')) {
    return normalised.slice(0, 4) + ' ' + normalised.slice(4, normalised.length);
  }

  return normalised.slice(0, -3) + ' ' + normalised.slice(-3, normalised.length);
};

module.exports = {normalisePostcode, isaRealUkPostcode, formatPostcodeForPrinting};
