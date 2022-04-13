import chalk from "chalk";
import fs from "fs";
import axios from "axios";
import * as readline from "readline";
import { stdin as input, stdout as output } from "node:process";

export const syncLocal = async ({ email, username }) => {
	const rl = readline.createInterface({ input, output });
	rl.question(
		"Executing this command will overwrite any existing password/key data on this local device. Do you wish to continue?[y/n] ",
		async (answer) => {
			if (answer === "y" || answer === "Y") {
				await axios
					.post("http://server-password-manager.herokuapp.com/syncLocal", {
						username: username,
						email: email,
					})
					.then((response) => {
						fs.writeFile("key.txt", response.data.key, function (err, file) {
							if (err) throw err;
							console.log("Saved Key");
						});
						fs.writeFile(
							"passwords.txt",
							response.data.passwords,
							function (err, file) {
								if (err) throw err;
								console.log("Saved passwords");
							}
						);
					})
					.catch((err) => console.log(err));
				console.log(chalk.green.bold("Sync successful"));
			}
			rl.close();
		}
	);
};
