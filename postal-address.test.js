const test = require('ava');

// Import the library like a 'consumer' would.
const postalAddress = require('.').postalAddress;

/**
 * This file is a translation of the `test_postal_address.py` python file from
 * the [GOV.UK notifications-utils repo](https://github.com/alphagov/notifications-utils)
 * to javascript. It was translated when their main branch was at their
 * [acbe764fb7f12c7a8b0696156283fbcb5073fcd7 commit](https://github.com/alphagov/notifications-utils/tree/acbe764fb7f12c7a8b0696156283fbcb5073fcd7).
 * The comments below that refer to files and line numbers are relative
 * to that commit.
 *
 * The only differences between this file and theirs are the translation
 * from python to javascript and some tidying to match our linter rules.
 */

test('test postcodes are normalised', (t) => {
  const postcodes = ['SW1 3EF', 'SW13EF', 'sw13ef', 'Sw13ef', 'sw1 3ef', ' SW1    3EF  '];

  for (const postcode of postcodes) {
    t.is(postalAddress.normalisePostcode(postcode), 'SW13EF');
  }
});

test('test valid postcodes are valid', (t) => {
  const postcodes = [
    // Real standard UK postcodes.
    'SW1 3EF',
    'SW13EF',
    'SE1 63EF',
    'N5 1AA',
    'SO14 6WB',
    'so14 6wb',
    'so14\u00A06wb',
    // Valid British Forces postcodes.
    'BFPO1234',
    'BFPO C/O 1234',
    'BFPO 1234',
    'BFPO1',
    // Giro Bank valid postcode.
    'GIR0AA'
  ];
  for (const postcode of postcodes) {
    t.is(postalAddress.isaRealUkPostcode(postcode), true);
  }
});

test('test invalid postcodes are invalid', (t) => {
  const postcodes = [
    // Invalid / incomplete postcodes.
    'N5',
    'SO144 6WB',
    'SO14 6WBA',
    '',
    'Bad postcode',
    // Invalid British Forces postcodes.
    'BFPO',
    'BFPO12345',
    // Giro Bank invalid postcode.
    'GIR0AB'
  ];
  for (const postcode of postcodes) {
    t.is(postalAddress.isaRealUkPostcode(postcode), false);
  }
});

test('test postcodes are formatted', (t) => {
  const postcodeSets = [
    ['SW13EF', 'SW1 3EF'],
    ['SW1 3EF', 'SW1 3EF'],
    ['N5 3EF', 'N5 3EF'],
    ['N5     3EF', 'N5 3EF'],
    ['N53EF   ', 'N5 3EF'],
    ['n53Ef', 'N5 3EF'],
    ['n5 \u00A0 \t 3Ef', 'N5 3EF'],
    ['SO146WB', 'SO14 6WB'],
    ['BFPO2', 'BFPO 2'],
    ['BFPO232', 'BFPO 232'],
    ['BFPO 2432', 'BFPO 2432'],
    ['BFPO C/O 2', 'BFPO C/O 2'],
    ['BFPO c/o 232', 'BFPO C/O 232'],
    ['GIR0AA', 'GIR 0AA']
  ];
  for (const postcodeSet of postcodeSets) {
    t.is(postalAddress.formatPostcodeForPrinting(postcodeSet[0]), postcodeSet[1]);
  }
});
