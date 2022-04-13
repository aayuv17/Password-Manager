import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import sha256 from "crypto-js/sha256.js";

export const login = async ({ password, username }) => {
	const userInfo = {
		username: username,
		password: sha256(password).toString(),
	};
	conf.set("localUser-info", userInfo);
	console.log(chalk.green.bold("Login successful"));
};
