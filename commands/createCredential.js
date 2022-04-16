import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";
import { generatePassword } from "../utils/generatePassword.js";
import * as readline from "readline";
import { stdin as input, stdout as output } from "node:process";

import { encrypt } from "../utils/AESEncrypt.js";
import { decrypt } from "../utils/AESDecrypt.js";

export const createCredential = async ({ key, genpass, username }) => {
	const userInfo = conf.get("localUser-info");
	const rl = readline.createInterface({ input, output });

	var password;
	if (genpass) {
		password = generatePassword();
		console.log("The generated password is ", password);
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
					if (jsonString["accounts"][key]) {
						jsonString["accounts"][key].push({
							username: username,
							password: password,
						});
					} else {
						jsonString["accounts"][key] = [
							{
								username: username,
								password: password,
							},
						];
					}
					jsonString = JSON.stringify(jsonString);
				} else {
					jsonString = { accounts: {} };
					jsonString["accounts"][key] = [
						{
							username: username,
							password: password,
						},
					];
					jsonString = JSON.stringify(jsonString);
				}
				var encrypted = encrypt(jsonString, decrypted);
				fs.writeFile("passwords.txt", encrypted, (err) => {
					if (err) throw err;
				});
			});
		});
		console.log(chalk.green.bold("Created credential"));
		rl.close();
	} else {
		rl.question("Enter password: ", (val) => {
			password = val;
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
						if (jsonString["accounts"][key]) {
							jsonString["accounts"][key].push({
								username: username,
								password: password,
							});
						} else {
							jsonString["accounts"][key] = [
								{
									username: username,
									password: password,
								},
							];
						}
						jsonString = JSON.stringify(jsonString);
					} else {
						jsonString = { accounts: {} };
						jsonString["accounts"][key] = [
							{
								username: username,
								password: password,
							},
						];
						jsonString = JSON.stringify(jsonString);
					}
					var encrypted = encrypt(jsonString, decrypted);
					fs.writeFile("passwords.txt", encrypted, (err) => {
						if (err) throw err;
					});
				});
			});
			console.log(chalk.green.bold("Created credential"));
			rl.close();
		});
	}
};
