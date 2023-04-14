"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blf = void 0;
const orig_1 = require("./orig");
const BLOWFISH_NUM_ROUNDS = 16;
class Blf {
    P = new Int32Array(orig_1.P_ORIG);
    S = new Int32Array(orig_1.S_ORIG);
    /**
     *
     * @param {Uint8Array} data - data to be converted to word
     * @param {number} offset - offset in data
     * @returns {[number, number]} - word and new offset
     */
    static streamToWord(data, offset) {
        let w = 0;
        let o = offset;
        for (let i = 0; i < 4; i++) {
            w = (w << 8) | (data[o] & 0xff);
            o = (o + 1) % data.length;
        }
        return [w, o];
    }
    constructor(data, key) {
        this.expandKey(data, key);
    }
    /**
     * Expands the key and data to be used for encryption
     *
     * @param {Uint8Array} data - data to be encrypted.
     * @param {Uint8Array} key - key to be used for encryption.
     * @returns {void}
     */
    expandKey(data, key) {
        let offset = 0;
        let lr = [0, 0];
        let plen = this.P.length;
        let slen = this.S.length;
        let word;
        for (let i = 0; i < plen; i++) {
            [word, offset] = Blf.streamToWord(key, offset);
            this.P[i] ^= word;
        }
        offset = 0;
        for (let i = 0; i < plen; i += 2) {
            [word, offset] = Blf.streamToWord(data, offset);
            lr[0] ^= word;
            [word, offset] = Blf.streamToWord(data, offset);
            lr[1] ^= word;
            lr = this.encipher(lr, 0);
            this.P[i] = lr[0];
            this.P[i + 1] = lr[1];
        }
        for (let i = 0; i < slen; i += 2) {
            [word, offset] = Blf.streamToWord(data, offset);
            lr[0] ^= word;
            [word, offset] = Blf.streamToWord(data, offset);
            lr[1] ^= word;
            lr = this.encipher(lr, 0);
            this.S[i] = lr[0];
            this.S[i + 1] = lr[1];
        }
    }
    /**
     * Encrypts the data with the Blowfish algorithm
     * @param {number[]} lr - data to be encrypted
     * @param {number} offset - offset in data
     * @returns {number[]} - encrypted data
     */
    encipher(lr, offset) {
        let n;
        let l = lr[offset];
        let r = lr[offset + 1];
        l ^= this.P[0];
        for (let i = 1; i < BLOWFISH_NUM_ROUNDS; i += 2) {
            n = this.S[l >>> 24];
            n += this.S[0x100 | ((l >> 16) & 0xff)];
            n ^= this.S[0x200 | ((l >> 8) & 0xff)];
            n += this.S[0x300 | (l & 0xff)];
            r ^= n ^ this.P[i];
            n = this.S[r >>> 24];
            n += this.S[0x100 | ((r >> 16) & 0xff)];
            n ^= this.S[0x200 | ((r >> 8) & 0xff)];
            n += this.S[0x300 | (r & 0xff)];
            l ^= n ^ this.P[i + 1];
        }
        lr[offset] = r ^ this.P[BLOWFISH_NUM_ROUNDS + 1];
        lr[offset + 1] = l;
        return lr;
    }
    /**
     * Encrypts the key with the Blowfish algorithm
     *
     * @param {Uint8Array} key - key to be used for encryption
     * @returns {void}
     */
    encypt(key) {
        let offset = 0;
        let lr = [0, 0];
        let plen = this.P.length;
        let slen = this.S.length;
        let word;
        for (let i = 0; i < plen; i++) {
            [word, offset] = Blf.streamToWord(key, offset);
            this.P[i] ^= word;
        }
        for (let i = 0; i < plen; i += 2) {
            lr = this.encipher(lr, 0);
            this.P[i] = lr[0];
            this.P[i + 1] = lr[1];
        }
        for (let i = 0; i < slen; i += 2) {
            lr = this.encipher(lr, 0);
            this.S[i] = lr[0];
            this.S[i + 1] = lr[1];
        }
    }
}
exports.Blf = Blf;
//# sourceMappingURL=blf.js.map