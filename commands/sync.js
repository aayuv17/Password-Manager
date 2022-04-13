import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";
import sha256 from "crypto-js/sha256.js";
import axios from "axios";
import * as readline from "readline";
import { stdin as input, stdout as output } from "node:process";

export const sync = async ({ password }) => {
	const userInfo = conf.get("localUser-info");
	console.log(userInfo);
	//console.log(sha256(pass).toString());
	const rl = readline.createInterface({ input, output });
	rl.question(
		"Executing this command will overwrite any existing password/key data on the server. Do you wish to continue?[y/n] ",
		(answer) => {
			if (answer === "y" || answer === "Y") {
				if (sha256(password).toString() === userInfo.password) {
					fs.readFile("key.txt", "utf-8", async (err, keyData) => {
						if (err) throw err;
						fs.readFile("passwords.txt", "utf8", async (err, passwordData) => {
							if (err) {
								console.log("File read failed:", err);
								return;
							}
							await axios
								.post("http://server-password-manager.herokuapp.com/sync", {
									username: userInfo.username,
									key: keyData,
									password: passwordData,
								})
								.then(() => console.log("Success"))
								.catch((err) => console.log(err));
						});
					});
					console.log(chalk.green.bold("Synced local data with server"));
				}
			}
			rl.close();
			process.exit();
		}
	);
};
