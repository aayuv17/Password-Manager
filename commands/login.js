import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import sha256 from "crypto-js/sha256.js";
import * as readline from "readline";
import { stdin as input, stdout as output } from "node:process";

export const login = async ({ username }) => {
	const rl = readline.createInterface({ input, output });
	rl.question("Enter master password: ", (master) => {
		const userInfo = {
			username: username,
			password: sha256(master).toString(),
		};
		conf.set("localUser-info", userInfo);
		console.log(chalk.green.bold("Login successful"));
		rl.close();
	});
};
