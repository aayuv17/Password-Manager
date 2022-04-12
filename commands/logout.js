import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";

export const logout = async () => {
	const userInfo = {};
	conf.set("localUser-info", userInfo);
	console.log(chalk.green.bold("Done"));
};
