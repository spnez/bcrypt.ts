import { randomBytes } from "crypto";
import { b64 } from "./internal/base64";
import { _crypt } from "./internal/crypt";

const GENSALT_DEFAULT_VERSION = "2b";
const BCRYPT_SALT_LEN = 16;
const bcryptRegex =
  /^\$(2[abxy]?)\$(\d\d)\$([.\/0-9A-Za-z]{22,23})([.\/0-9A-Za-z]+)?$/;

function stringToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

/**
 * Generates random bytes.
 *
 * @param {number} n - number of bytes to generate
 * @returns {Uint8Array} - random bytes
 */
function random(n: number): Uint8Array {
  return new Uint8Array(randomBytes(n));
}

/**
 * Hashes a string using bcrypt with the given salt.
 *
 * @param {string} s - string to hash
 * @param {string} salt - salt to use for hashing
 * @returns {string} - hashed string
 */
function _hash(s: string, salt: string): string {
  const matches = bcryptRegex.exec(salt);
  if (!matches)
    throw new Error("Invalid salt must be in the form of: $2a$10$...");

  const version = matches[1];
  const rounds = parseInt(matches[2], 10);
  const realSalt = matches[3];

  let sBytes = stringToBytes(s);
  if (sBytes[sBytes.length - 1] !== 0) sBytes = new Uint8Array([...sBytes, 0]);
  const saltBytes = b64.decode(realSalt, { isBytes: true });
  const bytes = _crypt(sBytes, saltBytes, rounds);
  const ret: string[] = [];
  ret.push("$");
  ret.push(version);
  ret.push("$");
  ret.push(rounds.toString(10).padStart(2, "0"));
  ret.push("$");
  ret.push(b64.encode(saltBytes));
  ret.push(b64.encode(bytes, { maxOutputLength: bytes.length - 1 }));

  return ret.join("");
}

/**
 * Generates a salt for bcrypt. The salt is in the form of: $2a$10$...
 *
 * @param {number} rounds - number of rounds to perform (4-31)
 * @returns {string} - generated salt
 */
export function generateSalt(rounds: number = 10): string {
  if (rounds < 4 || rounds > 31) throw new Error("Invalid rounds (4-31)");
  const salt: string[] = [];
  salt.push("$");
  salt.push(GENSALT_DEFAULT_VERSION);
  salt.push("$");
  salt.push(rounds.toString(10).padStart(2, "0"));
  salt.push("$");
  salt.push(b64.encode(random(BCRYPT_SALT_LEN)));
  return salt.join("");
}

export function hash(s: string, saltOrRounds: string | number): string {
  return _hash(
    s,
    typeof saltOrRounds === "string" ? saltOrRounds : generateSalt(saltOrRounds)
  );
}

export function compare(key: string, encypted: string): boolean {
  if (encypted.length !== 60) return false;
  return hash(key, encypted.substring(0, encypted.length - 31)) === encypted;
}
