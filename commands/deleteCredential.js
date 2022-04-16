import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";

import { encrypt } from "../utils/AESEncrypt.js";
import { decrypt } from "../utils/AESDecrypt.js";

export const deleteCredential = async ({ key, username }) => {
	const userInfo = conf.get("localUser-info");
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
