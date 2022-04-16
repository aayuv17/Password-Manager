export const checkPasswordStrength = (password) => {
	if (password.length < 12) {
		console.log(
			"Strong passwords should ideally be between 12 & 20 characters in length"
		);
		return 0;
	}
	var upper = 0;
	var lower = 0;
	var digit = 0;
	var symbol = 0;
	for (var i = 0; i < password.length; i++) {
		var char = password[i];
		if (!isNaN(char * 1)) {
			digit += 1;
		} else if (char === char.toUpperCase()) {
			upper += 1;
		} else if (char === char.toLowerCase()) {
			lower += 1;
		} else if (char != " " && char != "\t") {
			symbol += 1;
		}
	}
	if (digit === 0 || upper === 0 || lower === 0 || symbol === 0) {
		console.log(
			"Please pick a strong password. A strong password consists of a combination of uppercase & lowercase alphabets, digits & special symbols"
		);
		return 0;
	}
	return 1;
};
