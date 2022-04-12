#! /usr/bin/env node
import { Command } from "commander";

const program = new Command();
//const { program } = require("commander");

{
	/*import list from "./commands/list.js";
import { add } from "./commands/add.js";
import { markDone } from "./commands/markDone.js";

program
	.name("string-util")
	.description("CLI to some JavaScript string utilities")
	.version("0.8.0");

program.command("list").description("List all the TODO tasks").action(list);
program.command("add <task>").description("Add a new TODO task").action(add);
program
	.command("mark-done")
	.description("Mark commands done")
	.option(
		"-t, --tasks <tasks...>",
		"The tasks to mark done. If not specified, all tasks will be marked done."
	)
	.action(markDone);
    program.parse();*/
}

import { signUp } from "./commands/signUp.js";
import { login } from "./commands/login.js";
import { getCredential } from "./commands/getCredential.js";
import { createCredential } from "./commands/createCredential.js";
import { updateCredential } from "./commands/updateCredential.js";
import { deleteCredential } from "./commands/deleteCredential.js";
import { logout } from "./commands/logout.js";
import { sync } from "./commands/sync.js";
import { syncLocal } from "./commands/syncLocal.js";

program
	.name("password manager")
	.description("A simple password manager")
	.version("1.0.0");

program
	.command("sign-up")
	.description("register user")
	.option("-u, --username <username>", "The username")
	.option("-e, --email <email>", "The email to register")
	.option("-pass, --password <password>", "The password")
	.action(signUp);
program
	.command("login")
	.description("login")
	.option("-u, --username <username>", "The username")
	.option("-pass, --password <password>", "The password")
	.action(login);
program
	.command("get-pass")
	.description("login")
	.option("-k, --key <key>", "The account name for which password is needed")
	.action(getCredential);
program
	.command("new-pass")
	.description("login")
	.option("-k, --key <key>", "The account name for which password is needed")
	.option("-p, --pass <pass>", "The password")
	.option("-u, --user <user>", "The password")
	.action(createCredential);
program
	.command("update-pass")
	.description("login")
	.option("-k, --key <key>", "The account name for which password is needed")
	.option("-p, --pass <pass>", "The password")
	.option("-u, --user <user>", "The password")
	.action(updateCredential);
program
	.command("delete-pass")
	.description("login")
	.option("-k, --key <key>", "The account name for which password is needed")
	.action(deleteCredential);
program.command("logout").description("login").action(logout);
program
	.command("sync")
	.description("login")
	.option("-p, --pass <pass>", "The account name for which password is needed")
	.action(sync);
program
	.command("sync-local")
	.description("login")
	.option("-e, --email <email>", "The password")
	.option("-u, --username <username>", "The password")
	.action(syncLocal);

{
	/*program
	.version("0.1.0")
	.argument("<username>", "user to login")
	.argument("[password]", "password for user, if required", "no password given")
	.action((username, password) => {
		console.log("username:", username);
		console.log("password:", password);
	});*/
}
program.parse();
