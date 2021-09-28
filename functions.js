const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const fetchPoem = async lines => {
	const response = await fetch(
		'https://poetrydb.org/random,linecount/1;' + lines
	)

	const poem = (await response.json())[0]

	poem.lines = poem.lines.join('\n')
	poem.plain = normalize(poem.lines)
	poem.alphabet = randAlphabet()
	poem.cipher = encrypt(poem.plain, poem.alphabet)
	poem.solution = solve(poem.alphabet, poem.cipher)

	return poem
}

export const fetchTextArea = async () => {
	const response = await fetch('/textarea.txt')
	return await response.text()
}

export const randInt = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randAlphabet = () => {
	let a = ALPHABET.split('')
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
	return a.join('')
}

const normalize = text => {
	return text
		.toUpperCase()
		.match(/([A-Z]+| |'|"|,|\.|:|!|\?|-|\n)/g)
		.join('')
		.trim()
}

const encrypt = (plain, alphabet) => {
	let cipher = ''
	for (let char of plain) {
		if ('A' <= char && char <= 'Z')
			cipher += alphabet[ALPHABET.indexOf(char)]
		else cipher += char
	}
	return cipher
}

const solve = (alphabet, cipher) => {
	let solution = Array(26)
	for (let i = 0; i < alphabet.length; i++) {
		let char = alphabet[i]
		if (cipher.includes(char)) solution[toCode(char)] = toChar(i)
		else solution[toCode(char)] = '_'
	}
	return solution.join('').replace(/_/g, '')
}

export const toCode = char => char.charCodeAt(0) - 65
export const toChar = charCode => String.fromCharCode(charCode + 65)
