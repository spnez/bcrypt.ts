type EDCodedOptions = {
    maxOutputLength?: number;
    isBytes?: boolean;
};
/**
 * Base64 encoding/decoding
 * @class
 */
export declare class Base64 {
    /**
     * Base64 code characters
     * @type {string}
     * @private
     */
    private readonly code;
    /**
     * Encode bytes to Base64 string
     *
     * @param {string} code - Base64 code characters
     */
    constructor(code?: string);
    /**
     * Encode string or bytes to Base64 string or bytes.
     * @param {string | Uint8Array} stringOrBytes - String or bytes to encode to Base64 string.
     * @param {EDCodedOptions | undefined} options - Options.
     * @returns {string | Uint8Array} Base64 string or bytes.
     * @throws {Error} If maxOutputLength is invalid.
     */
    encode(stringOrBytes: string | Uint8Array, options: EDCodedOptions & {
        isBytes: true;
    }): Uint8Array;
    encode(stringOrBytes: string | Uint8Array, options: EDCodedOptions & {
        isBytes: false;
    }): string;
    encode(stringOrBytes: string | Uint8Array, options?: EDCodedOptions): string;
    /**
     * Decode Base64 string or bytes to string or bytes.
     * @param {string | Uint8Array} stringOrBytes - Base64 string or bytes to decode to string or bytes.
     * @returns {string | Uint8Array} String or bytes.
     * @throws {Error} If the input is not a valid Base64 string.
     */
    decode(stringOrBytes: string | Uint8Array, options: EDCodedOptions & {
        isBytes: true;
    }): Uint8Array;
    decode(stringOrBytes: string | Uint8Array, options: EDCodedOptions & {
        isBytes: false;
    }): string;
    decode(stringOrBytes: string | Uint8Array, options?: EDCodedOptions): string;
}
export declare const b64: Base64;
export {};
//# sourceMappingURL=base64.d.ts.map