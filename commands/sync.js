import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import fs from "fs";
import sha256 from "crypto-js/sha256.js";
import axios from "axios";

export const sync = async ({ pass }) => {
	const userInfo = conf.get("localUser-info");
	console.log(userInfo);
	console.log(sha256(pass).toString());
	if (sha256(pass).toString() === userInfo.password) {
		console.log("In");
		fs.readFile("key.txt", "utf-8", async (err, keyData) => {
			if (err) throw err;
			fs.readFile("passwords.txt", "utf8", async (err, passwordData) => {
				if (err) {
					console.log("File read failed:", err);
					return;
				}
				await axios
					.post("http://localhost:3000/sync", {
						username: userInfo.username,
						key: keyData,
						password: passwordData,
					})
					.then(() => console.log("Success"))
					.catch((err) => console.log(err));
			});
		});
		console.log(chalk.green.bold("Done"));
	}
};
