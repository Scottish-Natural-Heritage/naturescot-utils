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
  };
};
