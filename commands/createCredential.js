import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";
import crypto from "crypto";

export const createCredential = async ({ key, pass, user }) => {
	const userInfo = conf.get("localUser-info");
	console.log(userInfo);
	const algorithm = "aes-256-cbc";
	// generate key with crypto.randomBytes(256/8).toString('hex')
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
		console.log("This is the decrypted key", decrypted);

		fs.readFile("passwords.txt", "utf8", (err, jsonString) => {
			console.log("This is jsonString", jsonString);
			if (err) {
				console.log("File read failed:", err);
				return;
			}
			if (jsonString) {
				jsonString = decrypt(jsonString, decrypted);
				jsonString = JSON.parse(jsonString);
				console.log("File data:", jsonString);
				jsonString["accounts"][key] = {
					username: user,
					password: pass,
				};
				console.log(jsonString);
				jsonString = JSON.stringify(jsonString);
				console.log(jsonString);
			} else {
				jsonString = { accounts: {} };
				jsonString["accounts"][key] = {
					username: user,
					password: pass,
				};
				console.log(jsonString);
				jsonString = JSON.stringify(jsonString);
				console.log(jsonString);
			}

			var encrypted = encrypt(jsonString, decrypted);
			console.log(encrypted);
			fs.writeFile("passwords.txt", encrypted, (err) => {
				if (err) throw err;
				else console.log("Successful");
			});
		});
	});
	console.log(chalk.green.bold("Done"));
};
