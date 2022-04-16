import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";
import crypto from "crypto";

export const updateCredential = async ({ key, password, username }) => {
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
			if (jsonString) {
				jsonString = decrypt(jsonString, decrypted);
				jsonString = JSON.parse(jsonString);
				for (var i = 0; i < jsonString["accounts"][key].length; i++) {
					if (jsonString["accounts"][key][i].username === username) {
						jsonString["accounts"][key][i].password = password;
						break;
					}
				}
				console.log(jsonString);
				jsonString = JSON.stringify(jsonString);
				console.log(jsonString);
				console.log(
					chalk.green.bold(
						`Successfully updated credentials for ${key} & ${username}`
					)
				);
			} else {
				console.log(
					chalk.red.bold(
						"No such credential exists. Please check the username & account entered."
					)
				);
			}

			var encrypted = encrypt(jsonString, decrypted);
			fs.writeFile("passwords.txt", encrypted, (err) => {
				if (err) throw err;
			});
		});
	});
};
