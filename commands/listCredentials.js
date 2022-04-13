import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";
import crypto from "crypto";
import sha256 from "crypto-js/sha256.js";

export const listCredentials = async ({ password, username }) => {
	const userInfo = conf.get("localUser-info");
	//console.log(userInfo);
	if (
		username === userInfo.username &&
		sha256(password).toString() === userInfo.password
	) {
		const algorithm = "aes-256-cbc";
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
			//console.log("This is the decrypted key", decrypted);
			fs.readFile("passwords.txt", "utf8", (err, jsonString) => {
				if (err) {
					console.log("File read failed:", err);
					return;
				}
				//console.log("File data:", jsonString);
				var val = decrypt(jsonString, decrypted);
				//console.log(val);
				val = JSON.parse(val);
				//console.log(val);
				//console.log(key);
				if (val["accounts"])
					console.log(chalk.green.bold(JSON.stringify(val["accounts"])));
				else
					console.log(
						chalk.red.bold(
							"No such value found. Please check account name & try again"
						)
					);
			});
		});
	}
};
