import chalk from "chalk";
import sha256 from "crypto-js/sha256.js";
import crypto from "crypto";
import axios from "axios";
import fs from "fs";
import * as readline from "readline";
import { stdin as input, stdout as output } from "node:process";

import { encrypt } from "../utils/AESEncrypt.js";
import { checkPasswordStrength } from "../utils/checkPasswordStrength.js";
import { generatePassword } from "../utils/generatePassword.js";

export const signUp = async ({ email, username, genpass }) => {
	const rl = readline.createInterface({ input, output });

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
						console.log("Successfully created account");
					})
					.catch((err) => {
						console.log("Username/Email already exists");
						process.exit();
					});
				const KEY = crypto.randomBytes(32).toString("hex");
				if (genpass) {
					var password = generatePassword();
					console.log("The generated password is ", password);
					password = sha256(password).toString();
					var encrypted = encrypt(KEY, password);
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
				} else {
					rl.question("Enter a master password: ", (master) => {
						if (checkPasswordStrength(master)) {
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
							console.log(
								chalk.green.bold("Successfully created your account")
							);
							console.log(chalk.green.bold("Please login to continue"));
						}
						rl.close();
					});
				}
			}
		}
	);
};
