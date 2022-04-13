import Conf from "conf";
const conf = new Conf();

import chalk from "chalk";
import sha256 from "crypto-js/sha256.js";
import crypto from "crypto";
import axios from "axios";
import fs from "fs";

export const signUp = async ({ email, password, username }) => {
	//console.log(username);
	//console.log(email);
	//console.log(password);
	//console.log("This is the hashed password", sha256(password).toString());

	await axios
		.post("http://server-password-manager.herokuapp.com/", {
			email: email,
			username: username,
		})
		.then(() => {
			console.log("Success");
		})
		.catch((err) => console.log(err));
	const KEY = crypto.randomBytes(32).toString("hex");
	//console.log(KEY.toString());

	const algorithm = "aes-256-cbc";
	const IV_LENGTH = 16;

	const encrypt = (text) => {
		const iv = crypto.randomBytes(IV_LENGTH);
		const cipher = crypto.createCipheriv(
			algorithm,
			Buffer.from(sha256(password).toString(), "hex"),
			iv
		);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
	};

	var encrypted = encrypt(KEY);
	//console.log(encrypted);
	fs.writeFile("key.txt", encrypted, function (err, file) {
		if (err) throw err;
		console.log(chalk.yellow.bold("Saved key"));
	});
	fs.open("passwords.txt", "w", function (err, file) {
		if (err) throw err;
		console.log(chalk.yellow.bold("Created passwords.txt"));
	});
	fs.close(0);
	console.log(chalk.green.bold("Successfully created your account"));
	console.log(chalk.green.bold("Please login to continue"));
};
