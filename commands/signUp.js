import chalk from "chalk";
import sha256 from "crypto-js/sha256.js";
import crypto from "crypto";
import axios from "axios";
import fs from "fs";
import * as readline from "readline";
import { stdin as input, stdout as output } from "node:process";

export const signUp = async ({ email, username }) => {
	const rl = readline.createInterface({ input, output });
	const algorithm = "aes-256-cbc";
	const IV_LENGTH = 16;

	const encrypt = (text, key) => {
		const iv = crypto.randomBytes(IV_LENGTH);
		const cipher = crypto.createCipheriv(
			algorithm,
			Buffer.from(key, "hex"),
			iv
		);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
	};
	rl.question(
		"Use this email & username to create account? [y/n]: ",
		async (answer) => {
			if (answer === "y" || answer === "Y") {
				await axios
					.post("http://server-password-manager.herokuapp.com/", {
						email: email,
						username: username,
					})
					.then(() => {
						console.log("Success");
					})
					.catch((err) => {
						console.log("Username/Email already exists");
						process.exit();
					});
				const KEY = crypto.randomBytes(32).toString("hex");
				rl.question("Enter a master password: ", (master) => {
					master = sha256(master).toString();
					var encrypted = encrypt(KEY, master);
					fs.writeFile("key.txt", encrypted, function (err, file) {
						if (err) throw err;
						console.log(chalk.yellow.bold("Encrypted & saved key"));
					});
					fs.open("passwords.txt", "w", function (err, file) {
						if (err) throw err;
						console.log(chalk.yellow.bold("Created passwords.txt"));
					});
					fs.close(0);
					console.log(chalk.green.bold("Successfully created your account"));
					console.log(chalk.green.bold("Please login to continue"));
					rl.close();
				});
			}
		}
	);
};
