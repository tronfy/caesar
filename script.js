import { fetchPoem, fetchTextArea, randInt } from './functions.js'

const dom = {
	cipher: u('#cipher'),
	plain: u('#plain'),
	notes: u('#notes'),
	alphabet: u('#alphabet'),
	btn: {
		notes: u('#hide-notes'),
	},
}

const game = {
	poem: null,
	alphabet: {},
	over: false,
}

const mobile =
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	)

const resetTextArea = () => {
	fetchTextArea().then(txt => dom.notes.text(txt))
}
resetTextArea()

const generateAlphabet = () => {
	for (let i = 0; i < 26; i++) {
		const char = String.fromCharCode(i + 65)
		game.alphabet[char] = ''
		dom.alphabet.append(`<div>
  <label for="${char}">${char}</label>
  <input type="text" id="${char}" name="${char}" maxlength="1" value="" class="letter" ${
			game.poem.cipher.includes(char) ? '' : 'disabled'
		}></div>`)
	}
	setupLetterEvent()

	if (mobile) setupMobileLetterEvent()
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

const checkVictory = () => {
	if (Object.values(game.alphabet).join('') == game.poem.decipher) {
		dom.alphabet.addClass('blue')
		dom.plain.addClass('blue')
		dom.plain.text(game.poem.lines)
		dom.plain.append(
			'<span>' +
				'\n\n' +
				game.poem.title +
				'\nby ' +
				game.poem.author +
				'</span>'
		)
		for (const l of dom.alphabet.nodes[0].elements) {
			l.readOnly = true
		}
		game.over = true
	}
}

const checkDuplicates = () => {
	const counts = {}
	for (let i of Object.values(game.alphabet))
		if (i !== '') counts[i] = counts[i] ? counts[i] + 1 : 1

	u('.letter').nodes.forEach(l => {
		if (counts[l.value] > 1) u(l).addClass('duplicate')
		else if (u(l).hasClass('duplicate')) u(l).removeClass('duplicate')
	})
}

const updateInputs = (key, target) => {
	if (game.over) return

	let old = [...Object.values(game.alphabet)]

	if ('A' <= key && key <= 'Z' && key.length == 1) {
		target.value = key
		game.alphabet[target.id] = key
	} else if (target.value === '') {
		game.alphabet[target.id] = ''
	}

	if (Object.values(game.alphabet).join('') != old.join('')) {
		updatePlain()
		checkVictory()
	}
}

const setupLetterEvent = () => {
	u('.letter').on('keyup', e => {
		let key = e.key.toUpperCase()
		updateInputs(key, e.target)
	})
}

const setupMobileLetterEvent = () => {
	u('.letter').on('change', e => {
		let key = e.target.value.toUpperCase()
		updateInputs(key, e.target)
	})
}

u(dom.btn.notes).on('click', () => {
	if (dom.notes.hasClass('hidden')) {
		dom.notes.removeClass('hidden')
		dom.btn.notes.text('hide notes')
	} else {
		dom.notes.addClass('hidden')
		dom.btn.notes.text('show notes')
	}
})
