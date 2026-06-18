/**
 * Retrieves the language attribute.
 *
 * @returns {Promise<string>} The language attribute, defaulting to 'en_US' if not found.
 */
export default async function wpGetLanguageAttributes(): Promise<string> {
    const wplang = await getOption('WPLANG');
    return wplang || 'en_US';
}
