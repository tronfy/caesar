import { fetchPoem } from './functions.js'

const dom = {
	cipher: u('#cipher'),
	plain: u('#plain'),
}

const game = {
	poem: null,
	alphabet: {},
}

for (let i = 0; i < 26; i++) {
	game.alphabet[String.fromCharCode(i + 65)] = ''
}

const updatePlain = () => {
	dom.plain.text('')
	for (let i = 0; i < game.poem.cipher.length; i++) {
		let char = game.poem.cipher.charAt(i)
		if ('A' <= char && char <= 'Z' && game.alphabet[char])
			dom.plain.append('<span>' + game.alphabet[char] + '</span>')
		else dom.plain.append(char)
	}
}

const newPoem = () => {
	fetchPoem().then(poem => {
		game.poem = poem
		dom.cipher.text(poem.cipher)
		updatePlain()
	})
}
newPoem()

u('.letter').on('keyup', e => {
	let key = e.key.toUpperCase()
	if ('A' <= key && key <= 'Z' && key.length == 1) {
		e.target.value = key
		game.alphabet[e.target.id] = key
		updatePlain()
	} else if (e.target.value === '') {
		game.alphabet[e.target.id] = ''
		updatePlain()
	}
})
