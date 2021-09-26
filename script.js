import { fetchPoem, fetchTextArea, randInt } from './functions.js'

const dom = {
	cipher: u('#cipher'),
	plain: u('#plain'),
	notes: u('#notes'),
	alphabet: u('#alphabet'),
}

const game = {
	poem: null,
	alphabet: {},
}

const resetTextArea = () => {
	fetchTextArea().then(txt => dom.notes.text(txt))
}
resetTextArea()

const generateAlphabet = () => {
	for (let i = 0; i < 26; i++) {
		const char = String.fromCharCode(i + 65)
		if (!game.poem.cipher.includes(char)) {
			let newAlphabet = [...game.poem.alphabet]
			newAlphabet[i] = '_'
			game.poem.alphabet = newAlphabet.join('')
		}
		game.alphabet[char] = ''
		dom.alphabet.append(`<div>
  <label for="${char}">${char}</label>
  <input type="text" id="${char}" name="${char}" maxlength="1" value="" class="letter" ${
			game.poem.cipher.includes(char) ? '' : 'disabled'
		}></div>`)
	}
	setupLetterEvent()
}

const updatePlain = () => {
	dom.plain.text('')
	for (let i = 0; i < game.poem.cipher.length; i++) {
		let char = game.poem.cipher.charAt(i)
		if ('A' <= char && char <= 'Z' && game.alphabet[char])
			dom.plain.append('<span>' + game.alphabet[char] + '</span>')
		else dom.plain.append(char)
	}
	checkDuplicates()
}

const newPoem = () => {
	const lines = randInt(10, 15)
	const def =
		'fetching poem...' +
		Array(lines + 1)
			.fill(' ')
			.join('\n')
	dom.plain.text(def)
	dom.cipher.text(def)
	fetchPoem(lines).then(poem => {
		game.poem = poem
		dom.cipher.text(poem.cipher)
		updatePlain()
		generateAlphabet()
	})
}
newPoem()

const checkDuplicates = () => {
	const counts = {}
	for (let i of Object.values(game.alphabet))
		if (i !== '') counts[i] = counts[i] ? counts[i] + 1 : 1

	u('.letter').nodes.forEach(l => {
		if (counts[l.value] > 1) u(l).addClass('duplicate')
		else if (u(l).hasClass('duplicate')) u(l).removeClass('duplicate')
	})
}

const setupLetterEvent = () => {
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
}
