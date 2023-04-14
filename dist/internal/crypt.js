"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._crypt = void 0;
const blf_1 = require("./blf");
const orig_1 = require("./orig");
/**
 *
 * @param {Uint8Array} b - password buffer
 * @param {Uint8Array} salt - salt buffer
 * @param {number} rounds - number of rounds to perform (4-31)
 * @returns {Uint8Array} - encrypted password buffer
 */
function _crypt(b, salt, rounds) {
    const cdata = orig_1.C_ORIG.slice();
    const clen = cdata.length;
    // Validate rounds
    if (rounds < 4 || rounds > 31)
        throw new Error("Invalid rounds (4-31)");
    if (salt.length !== 16)
        throw new Error("Invalid salt. Salt must be 16 bytes.");
    const cost = (1 << rounds) >>> 0;
    const blf = new blf_1.Blf(salt, b);
    for (let i = 0; i < cost; i++) {
        blf.encypt(b);
        blf.encypt(salt);
    }
    for (let i = 0; i < 64; i++) {
        for (let j = 0; j < clen >> 1; j++)
            blf.encipher(cdata, j << 1);
    }
    const ret = new Uint8Array(clen * 4);
    for (let i = 0; i < clen; i++) {
        ret[i * 4] = (cdata[i] >> 24) & 0xff;
        ret[i * 4 + 1] = (cdata[i] >> 16) & 0xff;
        ret[i * 4 + 2] = (cdata[i] >> 8) & 0xff;
        ret[i * 4 + 3] = cdata[i] & 0xff;
    }
    return ret;
}
exports._crypt = _crypt;
//# sourceMappingURL=crypt.js.map