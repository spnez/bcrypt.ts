"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.b64 = exports.Base64 = void 0;
/**
 * Base64 default code characters
 *
 * @const
 * @type {string}
 * @private
 */
const BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
/**
 * Base64 encoding/decoding
 * @class
 */
class Base64 {
    /**
     * Base64 code characters
     * @type {string}
     * @private
     */
    code;
    /**
     * Encode bytes to Base64 string
     *
     * @param {string} code - Base64 code characters
     */
    constructor(code = BASE64_CODE) {
        if (code && code.length !== 64)
            throw new Error(`Invalid Base64 code: ${code}`);
        this.code = code;
    }
    encode(stringOrBytes, options) {
        const b = typeof stringOrBytes === "string"
            ? new TextEncoder().encode(stringOrBytes)
            : stringOrBytes;
        const isBytes = options?.isBytes ?? false;
        const maxOutputLength = options?.maxOutputLength ?? b.length;
        const rs = [];
        let off = 0;
        let c1, c2;
        if (maxOutputLength <= 0 || maxOutputLength > b.length)
            throw new Error("Invalid maxOutputLength");
        while (off < maxOutputLength) {
            c1 = b[off++] & 0xff;
            rs.push(this.code[(c1 >> 2) & 0x3f]);
            c1 = (c1 & 0x03) << 4;
            if (off >= maxOutputLength) {
                rs.push(this.code[c1 & 0x3f]);
                break;
            }
            c2 = b[off++] & 0xff;
            c1 |= (c2 >> 4) & 0x0f;
            rs.push(this.code[c1 & 0x3f]);
            c1 = (c2 & 0x0f) << 2;
            if (off >= maxOutputLength) {
                rs.push(this.code[c1 & 0x3f]);
                break;
            }
            c2 = b[off++] & 0xff;
            c1 |= (c2 >> 6) & 0x03;
            rs.push(this.code[c1 & 0x3f]);
            rs.push(this.code[c2 & 0x3f]);
        }
        return isBytes ? new TextEncoder().encode(rs.join("")) : rs.join("");
    }
    decode(stringOrBytes, options) {
        const s = typeof stringOrBytes === "string"
            ? stringOrBytes
            : new TextDecoder().decode(stringOrBytes);
        const isBytes = options?.isBytes ?? false;
        const maxOutputLength = options?.maxOutputLength ?? s.length;
        const rs = [];
        let offset = 0;
        let c1, c2, c3;
        let o;
        let olen = 0;
        if (maxOutputLength <= 0)
            throw new Error("Invalid maxOutputLength");
        while (offset < s.length - 1 && olen < maxOutputLength) {
            c1 = this.code.indexOf(s.charAt(offset++));
            c2 = this.code.indexOf(s.charAt(offset++));
            if (c1 == -1 || c2 == -1)
                break;
            o = ((c1 << 2) >>> 0) | ((c2 & 0x30) >> 4);
            rs.push(String.fromCharCode(o));
            if (++olen >= maxOutputLength || offset >= s.length)
                break;
            c3 = this.code.indexOf(s.charAt(offset++));
            if (c3 == -1)
                break;
            o = (((c2 & 0x0f) << 4) >>> 0) | ((c3 & 0x3c) >> 2);
            rs.push(String.fromCharCode(o));
            if (++olen >= maxOutputLength || offset >= s.length)
                break;
            o = (((c3 & 0x03) << 6) >>> 0) | this.code.indexOf(s.charAt(offset++));
            rs.push(String.fromCharCode(o));
            ++olen;
        }
        if (isBytes)
            return new Uint8Array(rs.map((c) => c.charCodeAt(0)));
        return rs.join("");
    }
}
exports.Base64 = Base64;
exports.b64 = new Base64();
//# sourceMappingURL=base64.js.map