#! /usr/bin/env node
import { Command } from "commander";

const program = new Command();

import { signUp } from "./commands/signUp.js";
import { login } from "./commands/login.js";
import { getCredential } from "./commands/getCredential.js";
import { createCredential } from "./commands/createCredential.js";
import { updateCredential } from "./commands/updateCredential.js";
import { deleteCredential } from "./commands/deleteCredential.js";
import { logout } from "./commands/logout.js";
import { sync } from "./commands/sync.js";
import { syncLocal } from "./commands/syncLocal.js";
import { listCredentials } from "./commands/listCredentials.js";

program
	.name("password manager")
	.description("A simple password manager")
	.version("1.0.0");

program
	.command("sign-up")
	.description("register user")
	.option("-u, --username <username>", "Enter username")
	.option("-e, --email <email>", "Enter email")
	.option("-p, --password <password>", "Enter master password")
	.action(signUp);

program
	.command("login")
	.description("login")
	.option("-u, --username <username>", "Enter username")
	.option("-p, --password <password>", "Enter master password")
	.action(login);

program
	.command("list-cred")
	.description("list all credentials for a particular account")
	.option("-u, --username <username>", "Enter username")
	.option("-p, --password <password>", "Enter master password")
	.action(listCredentials);

program
	.command("get-cred")
	.description("get credentials for a particular account")
	.option("-k, --key <key>", "The account for which credentials are needed")
	.action(getCredential);

program
	.command("create-cred")
	.description("create new credentials")
	.option(
		"-k, --key <key>",
		"The account for which credentials are being created"
	)
	.option("-p, --password <password>", "Enter password associated with account")
	.option("-u, --username <username>", "Enter username associated with account")
	.action(createCredential);

program
	.command("update-cred")
	.description("update user password associated with an account")
	.option(
		"-k, --key <key>",
		"The account for which credentials are being updated"
	)
	.option("-p, --password <password>", "Enter updated password")
	.option(
		"-u, --username <username>",
		"Enter username associated with the account"
	)
	.action(updateCredential);

program
	.command("delete-cred")
	.description("delete credentials associated with an account")
	.option(
		"-k, --key <key>",
		"The account for which credentials are being deleted"
	)
	.option(
		"-u, --username <username>",
		"Enter username associated with the account"
	)
	.action(deleteCredential);

program.command("logout").description("logout").action(logout);

program
	.command("sync")
	.description("sync local keys & passwords with online server")
	.option("-p, --password <password>", "Enter master password")
	.action(sync);

program
	.command("sync-local")
	.description("get key & password data from online server & store locally")
	.option("-e, --email <email>", "Enter email")
	.option("-u, --username <username>", "Enter username")
	.action(syncLocal);

program.parse();
