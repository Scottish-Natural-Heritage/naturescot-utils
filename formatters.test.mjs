import test from 'ava';

// Import the library like a 'consumer' would.
import * as Formatters from './formatters.mjs';

/**
 * This file is a translation of the `test_formatters.py` python file from
 * the [GOV.UK notifications-utils repo](https://github.com/alphagov/notifications-utils)
 * to javascript. It was translated when their main branch was at their
 * [acbe764fb7f12c7a8b0696156283fbcb5073fcd7 commit](https://github.com/alphagov/notifications-utils/tree/acbe764fb7f12c7a8b0696156283fbcb5073fcd7).
 * The comments below that refer to files and line numbers are relative
 * to that commit.
 *
 * The only differences between this file and theirs are the translation
 * from python to javascript and some tidying to match our linter rules.
 */

// Originally found in `tests/test_formatters.py#L1078-L1084`, at the
// above repo.
test('stripAndRemoveObscureWhitespace', (t) => {
  const values = [
    'notifications-email',
    '  \tnotifications-email \u000C ',
    '\rn\u200Coti\u200Dfi\u200Bcati\u2060ons-\u180Eemai\uFEFFl\uFEFF'
  ];
  for (const value of values) {
    t.is(Formatters.stripAndRemoveObscureWhitespace(value), 'notifications-email');
  }
});

// Originally found in `tests/test_formatters.py#L1087-L1089`, at the
// above repo.
test('stripAndRemoveObscureWhitespace only removes normal whitespace from ends', (t) => {
  const sentence = '   words \n over multiple lines with \ttabs\t   ';
  t.is(Formatters.stripAndRemoveObscureWhitespace(sentence), 'words \n over multiple lines with \ttabs');
});
