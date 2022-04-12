import chalk from "chalk";
import fs from "fs";
import axios from "axios";

export const syncLocal = async ({ email, username }) => {
	await axios
		.post("http://localhost:3000/syncLocal", {
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
	console.log(chalk.green.bold("Done"));
};
