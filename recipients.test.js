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

test('validatePhoneNumber correctly validates valid phone numbers', (t) => {
  const validUkPhoneNumbers = [
    '7123456789',
    '07123456789',
    '07123 456789',
    '07123-456-789',
    '00447123456789',
    '00 44 7123456789',
    '+447123456789',
    '+44 7123 456 789',
    '+44 (0)7123 456 789',
    '\u200B\t\t+44 (0)7123 \uFEFF 456 789 \r\n'
  ];

  const validInternationalPhoneNumbers = [
    '71234567890',
    '1-202-555-0104',
    '+12025550104',
    '0012025550104',
    '+0012025550104',
    '23051234567',
    '+682 12345',
    '+3312345678',
    '003312345678',
    '1-2345-12345-12345'
  ];

  const validPhoneNumbers = validUkPhoneNumbers.concat(validInternationalPhoneNumbers);

  for (const phoneNumber of validPhoneNumbers) {
    t.is(recipients.validatePhoneNumber(phoneNumber), phoneNumber);
  }
});

test('validatePhoneNumber correctly validates invalid phone numbers', (t) => {
  const invalidUkPhoneNumbersTooBig = [
    '07123456789101',
    '00447123456789101',
    '00447123456789101',
    '+44 (0)7123 456 789 101',
    '01234-567-890-123'
  ];

  const invalidUkPhoneNumbersTooSmall = ['07123456', '00447123456', '00447123456', '+44 (0)7123 456'];

  const invalidUkPhoneNumbersBadCharacters = [
    '07890x32109',
    '07123 456789...',
    '07123 ☟☜⬇⬆☞☝',
    '07123☟☜⬇⬆☞☝',
    '07";DROP TABLE;"',
    '+44 07ab cde fgh',
    'ALPHANUM3R1C'
  ];

  for (const phoneNumber of invalidUkPhoneNumbersTooBig) {
    const error = t.throws(() => {
      recipients.validatePhoneNumber(phoneNumber);
    });

    t.is(error.message, 'Too many digits');
  }

  for (const phoneNumber of invalidUkPhoneNumbersTooSmall) {
    const error = t.throws(() => {
      recipients.validatePhoneNumber(phoneNumber);
    });

    t.is(error.message, 'Not enough digits');
  }

  for (const phoneNumber of invalidUkPhoneNumbersBadCharacters) {
    const error = t.throws(() => {
      recipients.validatePhoneNumber(phoneNumber);
    });

    t.is(error.message, 'Must not contain letters or symbols');
  }
});
