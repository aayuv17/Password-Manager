import crypto from "crypto";

const algorithm = "aes-256-cbc";
const IV_LENGTH = 16;
export const encrypt = (text, keyUsed) => {
	const iv = crypto.randomBytes(IV_LENGTH);
	const cipher = crypto.createCipheriv(
		algorithm,
		Buffer.from(keyUsed, "hex"),
		iv
	);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};
