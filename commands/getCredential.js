import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";
import crypto from "crypto";

export const getCredential = async ({ key }) => {
	const userInfo = conf.get("localUser-info");
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
		fs.readFile("passwords.txt", "utf8", (err, jsonString) => {
			if (err) {
				console.log("File read failed:", err);
				return;
			}
			var val = decrypt(jsonString, decrypted);
			val = JSON.parse(val);
			if (val["accounts"][key])
				console.log(chalk.green.bold(JSON.stringify(val["accounts"][key])));
			else
				console.log(
					chalk.red.bold(
						"No such value found. Please check account name & try again"
					)
				);
		});
	});
};
