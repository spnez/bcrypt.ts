export declare class Blf {
    private readonly P;
    private readonly S;
    /**
     *
     * @param {Uint8Array} data - data to be converted to word
     * @param {number} offset - offset in data
     * @returns {[number, number]} - word and new offset
     */
    private static streamToWord;
    constructor(data: Uint8Array, key: Uint8Array);
    /**
     * Expands the key and data to be used for encryption
     *
     * @param {Uint8Array} data - data to be encrypted.
     * @param {Uint8Array} key - key to be used for encryption.
     * @returns {void}
     */
    private expandKey;
    /**
     * Encrypts the data with the Blowfish algorithm
     * @param {number[]} lr - data to be encrypted
     * @param {number} offset - offset in data
     * @returns {number[]} - encrypted data
     */
    encipher(lr: number[], offset: number): number[];
    /**
     * Encrypts the key with the Blowfish algorithm
     *
     * @param {Uint8Array} key - key to be used for encryption
     * @returns {void}
     */
    encypt(key: Uint8Array): void;
}
//# sourceMappingURL=blf.d.ts.map