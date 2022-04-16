const randomNo = (length) => {
	return Math.floor(Math.random() * length);
};

export const generatePassword = () => {
	var chars =
		"0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var lowercase = "abcdefghijklmnopqrstuvwxyz";
	var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var digits = "0123456789";
	var symbols = "!@#$%^&*()";
	var passwordLength = Math.floor(Math.random() * 8) + 12;
	//console.log(passwordLength);
	var password = "";
	var random = randomNo(lowercase.length);
	password += lowercase.substring(random, random + 1);
	//console.log(password);
	var random = randomNo(uppercase.length);
	password += uppercase.substring(random, random + 1);
	//console.log(password);
	var random = randomNo(digits.length);
	password += digits.substring(random, random + 1);
	//console.log(password);
	var random = randomNo(symbols.length);
	password += symbols.substring(random, random + 1);
	//console.log(password);
	for (var i = 0; i <= passwordLength - 4; i++) {
		var random = randomNo(chars.length);
		password += chars.substring(random, random + 1);
		//console.log(password);
	}
	password = shuffle(password);
	return password;
};

function shuffle(s) {
	var arr = s.split("");
	var n = arr.length;

	for (var i = 0; i < n - 1; ++i) {
		var j = randomNo(n);

		var temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}

	s = arr.join("");
	return s;
}
