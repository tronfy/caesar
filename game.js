import { fetchPoem, fetchTextArea, randInt, toChar } from './functions.js'

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
		const char = toChar(i)
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
			dom.plain.append(game.alphabet[char])
		else dom.plain.append('<span>' + char + '</span>')
	}
	checkDuplicates()
}

const setPlaceholders = lines => {
	const def =
		'fetching poem...' +
		Array(lines + 1)
			.fill(' ')
			.join('\n')
	dom.plain.text(def)
	dom.cipher.text(def)
}

const checkVictory = () => {
	if (Object.values(game.alphabet).join('') == game.poem.solution) {
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
		for (const l of dom.alphabet.nodes[0].elements) l.readOnly = true

		game.over = true
	}
}

const checkDuplicates = () => {
	const counts = {}
	for (let l of Object.values(game.alphabet))
		if (l !== '') counts[l] = counts[l] ? counts[l] + 1 : 1

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
	u('.letter').on('keyup', e => updateInputs(e.key.toUpperCase(), e.target))
}

const setupMobileLetterEvent = () => {
	u('.letter').on('change', e =>
		updateInputs(e.target.value.toUpperCase(), e.target)
	)
}

u(dom.btn.notes).on('click', () => dom.notes.toggleClass('hidden'))

const newPoem = () => {
	const lines = randInt(10, 15)
	setPlaceholders(lines)
	fetchPoem(lines).then(poem => {
		game.poem = poem
		dom.cipher.text(poem.cipher)
		updatePlain()
		generateAlphabet()
	})
}
newPoem()
