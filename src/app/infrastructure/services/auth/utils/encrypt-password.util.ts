import { createCipheriv, createDecipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

export async function encrypt(password: string, plainText: string) {
  const salt = randomBytes(16);
  const key = (await promisify(scrypt)(plainText, salt, 32)) as Buffer;
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-ctr", key, iv);
  const encryptedBuffer = Buffer.concat([
    cipher.update(password, "utf8"),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    salt: salt.toString("hex"),
    content: encryptedBuffer.toString("hex"),
  };
}

export async function decryptText(
  encryptedData: { iv: string; salt: string; content: string },
  password: string,
) {
  const iv = Buffer.from(encryptedData.iv, "hex");
  const salt = Buffer.from(encryptedData.salt, "hex");

  const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;

  const decipher = createDecipheriv("aes-256-ctr", key, iv);

  const decryptedBuffer = Buffer.concat([
    decipher.update(Buffer.from(encryptedData.content, "hex")),
    decipher.final(),
  ]);

  return decryptedBuffer.toString("utf8");
}
