/**
 * Base64 default code characters
 *
 * @const
 * @type {string}
 * @private
 */
const BASE64_CODE: string =
  "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

type EDCodedOptions = {
  maxOutputLength?: number;
  isBytes?: boolean;
};
/**
 * Base64 encoding/decoding
 * @class
 */
export class Base64 {
  /**
   * Base64 code characters
   * @type {string}
   * @private
   */
  private readonly code: string;

  /**
   * Encode bytes to Base64 string
   *
   * @param {string} code - Base64 code characters
   */
  constructor(code: string = BASE64_CODE) {
    if (code && code.length !== 64)
      throw new Error(`Invalid Base64 code: ${code}`);
    this.code = code;
  }

  /**
   * Encode string or bytes to Base64 string or bytes.
   * @param {string | Uint8Array} stringOrBytes - String or bytes to encode to Base64 string.
   * @param {EDCodedOptions | undefined} options - Options.
   * @returns {string | Uint8Array} Base64 string or bytes.
   * @throws {Error} If maxOutputLength is invalid.
   */
  encode(
    stringOrBytes: string | Uint8Array,
    options: EDCodedOptions & { isBytes: true }
  ): Uint8Array;
  encode(
    stringOrBytes: string | Uint8Array,
    options: EDCodedOptions & { isBytes: false }
  ): string;
  encode(stringOrBytes: string | Uint8Array, options?: EDCodedOptions): string;
  encode(
    stringOrBytes: string | Uint8Array,
    options?: EDCodedOptions
  ): string | Uint8Array {
    const b =
      typeof stringOrBytes === "string"
        ? new TextEncoder().encode(stringOrBytes)
        : stringOrBytes;
    const isBytes = options?.isBytes ?? false;
    const maxOutputLength = options?.maxOutputLength ?? b.length;

    const rs: string[] = [];
    let off = 0;
    let c1: number, c2: number;
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

  /**
   * Decode Base64 string or bytes to string or bytes.
   * @param {string | Uint8Array} stringOrBytes - Base64 string or bytes to decode to string or bytes.
   * @returns {string | Uint8Array} String or bytes.
   * @throws {Error} If the input is not a valid Base64 string.
   */
  decode(
    stringOrBytes: string | Uint8Array,
    options: EDCodedOptions & { isBytes: true }
  ): Uint8Array;
  decode(
    stringOrBytes: string | Uint8Array,
    options: EDCodedOptions & { isBytes: false }
  ): string;
  decode(stringOrBytes: string | Uint8Array, options?: EDCodedOptions): string;
  decode(
    stringOrBytes: string | Uint8Array,
    options?: EDCodedOptions
  ): string | Uint8Array {
    const s =
      typeof stringOrBytes === "string"
        ? stringOrBytes
        : new TextDecoder().decode(stringOrBytes);
    const isBytes = options?.isBytes ?? false;
    const maxOutputLength = options?.maxOutputLength ?? s.length;

    const rs: string[] = [];
    let offset = 0;
    let c1: number, c2: number, c3: number;
    let o: number;
    let olen = 0;
    if (maxOutputLength <= 0) throw new Error("Invalid maxOutputLength");

    while (offset < s.length - 1 && olen < maxOutputLength) {
      c1 = this.code.indexOf(s.charAt(offset++));
      c2 = this.code.indexOf(s.charAt(offset++));
      if (c1 == -1 || c2 == -1) break;
      o = ((c1 << 2) >>> 0) | ((c2 & 0x30) >> 4);
      rs.push(String.fromCharCode(o));
      if (++olen >= maxOutputLength || offset >= s.length) break;
      c3 = this.code.indexOf(s.charAt(offset++));
      if (c3 == -1) break;
      o = (((c2 & 0x0f) << 4) >>> 0) | ((c3 & 0x3c) >> 2);
      rs.push(String.fromCharCode(o));
      if (++olen >= maxOutputLength || offset >= s.length) break;
      o = (((c3 & 0x03) << 6) >>> 0) | this.code.indexOf(s.charAt(offset++));
      rs.push(String.fromCharCode(o));
      ++olen;
    }
    if (isBytes) return new Uint8Array(rs.map((c) => c.charCodeAt(0)));
    return rs.join("");
  }
}

export const b64 = new Base64();
