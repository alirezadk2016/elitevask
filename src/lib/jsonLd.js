/* Serialize a value for embedding inside <script type="application/ld+json">.
 *
 * Plain JSON.stringify is NOT safe here. JSON has no idea it is sitting inside
 * an HTML <script> element, so a string value containing "</script>" ends the
 * element early and everything after it is parsed as markup. Our FAQ JSON-LD
 * is built from manager-entered text stored in KV (content:faq), which means a
 * single pasted answer could have injected live script into every visitor's
 * page — and the CSP allows 'unsafe-inline', so it would have run.
 *
 * Escaping "<" as the JSON escape < is enough: the parser reads it back
 * as a normal "<", the HTML tokenizer never sees one, and the JSON stays
 * valid. U+2028/U+2029 are escaped too — legal in JSON, fatal in JS source.
 */
export function jsonLdString(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
