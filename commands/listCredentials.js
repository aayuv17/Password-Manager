import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";
import sha256 from "crypto-js/sha256.js";
import * as readline from "readline";
import { stdin as input, stdout as output } from "node:process";

import { decrypt } from "../utils/AESDecrypt.js";

export const listCredentials = async ({ username }) => {
	const rl = readline.createInterface({ input, output });
	const userInfo = conf.get("localUser-info");

	rl.question("Enter master password: ", (master) => {
		if (
			username === userInfo.username &&
			sha256(master).toString() === userInfo.password
		) {
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
					if (val["accounts"])
						console.log(
							chalk.green.bold(JSON.stringify(val["accounts"], null, 2))
						);
					else
						console.log(
							chalk.red.bold(
								"No such value found. Please check account name & try again"
							)
						);
				});
			});
		}
		rl.close();
	});
};
