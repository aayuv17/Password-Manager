import crypto from "crypto";

const algorithm = "aes-256-cbc";
export const decrypt = (text, keyUsed) => {
	const [iv, encryptedText] = text
		.split(":")
		.map((part) => Buffer.from(part, "hex"));
	const decipher = crypto.createDecipheriv(
		algorithm,
		Buffer.from(keyUsed, "hex"),
		iv
	);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
};
