/**
 * Generates a salt for bcrypt. The salt is in the form of: $2a$10$...
 *
 * @param {number} rounds - number of rounds to perform (4-31)
 * @returns {string} - generated salt
 */
export declare function generateSalt(rounds?: number): string;
export declare function hash(s: string, saltOrRounds: string | number): string;
export declare function compare(key: string, encypted: string): boolean;
//# sourceMappingURL=bcrypt.d.ts.map