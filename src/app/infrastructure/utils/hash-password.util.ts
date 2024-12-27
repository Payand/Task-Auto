import { createCipheriv, createDecipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

// Encrypt a string
export async function hashPassword(password: string, plainText: string) {
  // 1. Generate salt for scrypt (store in DB alongside the ciphertext)
  const salt = randomBytes(16);

  // 2. Derive a 32-byte key using scrypt
  const key = (await promisify(scrypt)(plainText, salt, 32)) as Buffer;

  // 3. Generate a random IV (initialization vector). Also store this with ciphertext.
  const iv = randomBytes(16);

  // 4. Create the cipher
  const cipher = createCipheriv("aes-256-ctr", key, iv);

  // 5. Encrypt the plain text
  const encryptedBuffer = Buffer.concat([
    cipher.update(password, "utf8"),
    cipher.final(),
  ]);

  // 6. Return an object that includes everything needed to decrypt later
  return {
    // Convert IV, salt, and encrypted data to hex (or base64) for easier storage
    iv: iv.toString("hex"),
    salt: salt.toString("hex"),
    content: encryptedBuffer.toString("hex"),
  };
}

export async function decryptText(
  encryptedData: { iv: string; salt: string; content: string },
  password: string,
) {
  // 1. Recreate IV and salt as Buffers
  const iv = Buffer.from(encryptedData.iv, "hex");
  const salt = Buffer.from(encryptedData.salt, "hex");

  // 2. Re-derive the key from the (same) password and salt
  const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;

  // 3. Create a decipher
  const decipher = createDecipheriv("aes-256-ctr", key, iv);

  // 4. Decrypt the content
  const decryptedBuffer = Buffer.concat([
    decipher.update(Buffer.from(encryptedData.content, "hex")),
    decipher.final(),
  ]);

  // 5. Convert the decrypted Buffer back to a string
  return decryptedBuffer.toString("utf8");
}
