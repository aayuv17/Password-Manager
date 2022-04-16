import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";

import { decrypt } from "../utils/AESDecrypt.js";

export const getCredential = async ({ key }) => {
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
			if (val["accounts"][key])
				console.log(
					chalk.green.bold(JSON.stringify(val["accounts"][key], null, 2))
				);
			else
				console.log(
					chalk.red.bold(
						"No such value found. Please check account name & try again"
					)
				);
		});
	});
};
