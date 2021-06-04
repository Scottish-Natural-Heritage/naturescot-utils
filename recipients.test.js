const test = require('ava');

// Import the library like a 'consumer' would.
const recipients = require('.').recipients;

/**
 * This file is a translation of the `test_recipient_validation.py`
 * python file from the [GOV.UK notifications-utils repo](https://github.com/alphagov/notifications-utils)
 * to javascript. It was translated when their main branch was at their
 * [acbe764fb7f12c7a8b0696156283fbcb5073fcd7 commit](https://github.com/alphagov/notifications-utils/tree/acbe764fb7f12c7a8b0696156283fbcb5073fcd7).
 * The comments below that refer to files and line numbers are relative
 * to that commit.
 *
 * The only differences between this file and theirs are the translation
 * from python to javascript and some tidying to match our linter rules.
 */

// Originally found in `tests/test_recipient_validation.py#L104-L122`
// and `tests/test_recipient_validation.py#L323-L328`, at the above
// repo.
test('validateEmailAddress accepts valid', (t) => {
  const validEmailAddresses = [
    'email@domain.com',
    'email@domain.COM',
    'firstname.lastname@domain.com',
    "firstname.o'lastname@domain.com",
    'email@subdomain.domain.com',
    'firstname+lastname@domain.com',
    '1234567890@domain.com',
    'email@domain-one.com',
    '_______@domain.com',
    'email@domain.name',
    'email@domain.superlongtld',
    'email@domain.co.jp',
    'firstname-lastname@domain.com',
    'info@german-financial-services.vermögensberatung',
    'info@german-financial-services.reallylongarbitrarytldthatiswaytoohugejustincase',
    'japanese-info@例え.テスト',
    'email@double--hyphen.com'
  ];

  for (const emailAddress of validEmailAddresses) {
    t.is(recipients.validateEmailAddress(emailAddress), emailAddress);
  }
});

// Originally found in `tests/test_recipient_validation.py#L331-L338`,
// at the above repo.
test('validateEmailAddress strips whitespace', (t) => {
  const emailAddresses = [
    ' email@domain.com ',
    '\temail@domain.com',
    '\temail@domain.com\n',
    '\u200Bemail@domain.com\u200B'
  ];

  for (const emailAddress of emailAddresses) {
    t.is(recipients.validateEmailAddress(emailAddress), 'email@domain.com');
  }
});

// Originally found in `tests/test_recipient_validation.py#L123-L154`
// and `tests/test_recipient_validation.py#L331-L338`, at the above
// repo.
test('validateEmailAddress throws for invalid', (t) => {
  const invalidEmailAddresses = [
    'email@123.123.123.123',
    'email@[123.123.123.123]',
    'plainaddress',
    '@no-local-part.com',
    'Outlook Contact <outlook-contact@domain.com>',
    'no-at.domain.com',
    'no-tld@domain',
    ';beginning-semicolon@domain.co.uk',
    'middle-semicolon@domain.co;uk',
    'trailing-semicolon@domain.com;',
    '"email+leading-quotes@domain.com',
    'email+middle"-quotes@domain.com',
    '"quoted-local-part"@domain.com',
    '"quoted@domain.com"',
    'lots-of-dots@domain..gov..uk',
    'two-dots..in-local@domain.com',
    'multiple@domains@domain.com',
    'spaces in local@domain.com',
    'spaces-in-domain@dom ain.com',
    'underscores-in-domain@dom_ain.com',
    'pipe-in-domain@example.com|gov.uk',
    'comma,in-local@gov.uk',
    'comma-in-domain@domain,gov.uk',
    'pound-sign-in-local£@domain.com',
    'local-with-’-apostrophe@domain.com',
    'local-with-”-quotes@domain.com',
    'domain-starts-with-a-dot@.domain.com',
    'brackets(in)local@domain.com',
    `email-too-long-${'a'.repeat(320)}@example.com`
    // 'incorrect-punycode@xn---something.com' // https://centralnic-reseller.github.io/centralnic-reseller/docs/hexonet/idna-uts46/#known-issues
  ];

  for (const emailAddress of invalidEmailAddresses) {
    const error = t.throws(() => {
      recipients.validateEmailAddress(emailAddress);
    });

    t.is(error.message, 'Not a valid email address');
  }
});
