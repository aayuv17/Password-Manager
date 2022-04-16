import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";
import crypto from "crypto";

export const deleteCredential = async ({ key, username }) => {
	const userInfo = conf.get("localUser-info");
	const algorithm = "aes-256-cbc";
	const IV_LENGTH = 16;
	const encrypt = (text, keyUsed) => {
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
	const decrypt = (text, keyUsed) => {
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

	fs.readFile("key.txt", "utf-8", (err, data) => {
		if (err) throw err;
		var decrypted = decrypt(data.toString(), userInfo.password);
		fs.readFile("passwords.txt", "utf8", (err, jsonString) => {
			if (err) {
				console.log("File read failed:", err);
				return;
			}
			var val = decrypt(jsonString, decrypted);
			val = JSON.parse(val);
			var flag = 0;
			for (var i = 0; i < val["accounts"][key].length; i++) {
				if (val["accounts"][key][i].username === username) {
					delete val["accounts"][key][i];
					console.log(chalk.green.bold("Deleted credential"));
					flag = 1;
					break;
				}
			}
			if (flag === 0) {
				console.log(
					"No such credential exists. Please check the username & account entered"
				);
			}
			val = JSON.stringify(val);
			var encrypted = encrypt(val, decrypted);
			fs.writeFile("passwords.txt", encrypted, (err) => {
				if (err) throw err;
			});
		});
	});
};
