import crypto from "crypto";

// Recommend configuring a dedicated secret or leveraging a high-entropy string
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY ||
  crypto.randomBytes(32).toString("hex").substring(0, 32);
const IV_LENGTH = 16; // AES block size
const SCRYPT_SALT_LENGTH = 16;
const SCRYPT_KEY_LENGTH = 64;

/**
 * Hashes a plaintext password securely using scrypt.
 * @param password
 * @returns The derived hash formatted as salt:hash
 */
export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SCRYPT_SALT_LENGTH).toString("hex");
    crypto.scrypt(password, salt, SCRYPT_KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
};

/**
 * Compares a password against a stored hashed password.
 * @param password The plaintext password to attempt
 * @param storedHash The stored salt:hash
 * @returns True if it matches
 */
export const comparePassword = (
  password: string,
  storedHash: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return resolve(false);

    crypto.scrypt(password, salt, SCRYPT_KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err);
      // Use timingSafeEqual to prevent timing attacks
      const isMatch = crypto.timingSafeEqual(
        Buffer.from(key, "hex"),
        derivedKey,
      );
      resolve(isMatch);
    });
  });
};

/**
 * Encrypts generic text using AES-256-CBC.
 * @param text
 * @returns Encrypted string format: iv:encryptedContent
 */
export const encryptText = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

/**
 * Decrypts text previously encrypted by encryptText.
 * @param text iv:encryptedContent
 * @returns Decrypted text
 */
export const decryptText = (text: string): string => {
  const textParts = text.split(":");
  const ivPart = textParts.shift();
  if (!ivPart) throw new Error("Invalid text to decrypt");

  const iv = Buffer.from(ivPart, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
