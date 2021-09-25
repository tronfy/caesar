const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const fetchPoem = async () => {
	const lines = randInt(10, 15)
	const response = await fetch(
		'https://poetrydb.org/random,linecount/1;' + lines
	)

	const poem = (await response.json())[0]

	poem.lines = poem.lines.join('\n')
	poem.plain = poem.lines
		.toUpperCase()
		.match(/([A-Z]+| |,|\.|:|!|\?|-|\n)/g)
		.join('')

	poem.alphabet = randAlphabet()
	poem.cipher = ''
	for (let i = 0; i < poem.plain.length; i++) {
		let char = poem.plain.charAt(i)
		if ('A' <= char && char <= 'Z')
			poem.cipher += poem.alphabet[alphabet.indexOf(char)]
		else poem.cipher += char
	}

	return poem
}

export const randInt = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randAlphabet = () => {
	let a = alphabet.split('')
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
	return a.join('')
}
