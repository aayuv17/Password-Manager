import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";

import { encrypt } from "../utils/AESEncrypt.js";
import { decrypt } from "../utils/AESDecrypt.js";

export const updateCredential = async ({ key, password, username }) => {
	const userInfo = conf.get("localUser-info");

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
				jsonString = JSON.stringify(jsonString);
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
