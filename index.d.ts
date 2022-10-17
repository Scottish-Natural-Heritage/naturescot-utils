export = utils;

declare const utils: {
  formatters: {
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
    stripAndRemoveObscureWhitespace(value: string): string;
  };
  postalAddress: {
    /**
     * Validates a postcode against the regex set in GOV.UK Notify.
     *
     * Originally found in `notifications_utils/postal_address.py#L154-L160`, at
     * the above repo.
     *
     * @param {string} postcode The candidate postcode to be validated.
     * @returns {boolean} `true` if the postcode is valid, otherwise `false`.
     */
    isaRealUkPostcode(value: string): boolean;

    /**
     * Formats the postcode to standard postcode format without whitespace removed.
     *
     * Originally found in `notifications_utils/postal_address.py#L163-L173`, at
     * the above repo.
     *
     * @param {string} postcode The candidate postcode to be validated.
     * @returns {string} A version of the postcode formatted.
     */
    formatPostcodeForPrinting(value: string): string;
  };
  recipients: {
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
    validateAndFormatEmailAddress(value: string): string;

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
    validateEmailAddress(value: string): string;

    /**
     * Validates that a phone number matches the rules required to be
     * accepted by GOV.UK Notify (modified slightly to allow for land-line numbers).
     *
     * Originally found in ``notifications_utils/recipients.py#L459-L475`, at
     * the above repo.
     *
     * @param {string} phoneNumber A candidate phone number.
     * @returns {string} The phone number, if valid.
     * @throws {Error} An error message, if the phone number is not valid.
     */
    validatePhoneNumber(value: string): string;
  };
  crypto: {
    /**
     * Encrypts plaintext with the specified password.
     *
     * @param {string} plaintext The plain text to encrypt.
     * @param {string} password The password to use in encrypting the plaintext.
     * @returns {string} The encrypted text.
     */
    encrypt(plaintext: string, password: string): string;

    /**
     * Decrypts encrypted text with the specified password.
     *
     * @param {string} ciphertext The encrypted text to decrypt.
     * @param {string} password The password to use in decrypting the ciphertext.
     * @returns {string} The decrypted text.
     */
    decrypt(ciphertext: string, password: string): string;
  };
};
