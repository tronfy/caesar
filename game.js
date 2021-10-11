import { fetchPoem, fetchTextArea, randInt, toChar } from './functions.js'

const dom = {
	cipher: u('#cipher'),
	plain: u('#plain'),
	notes: u('#notes'),
	alphabet: u('#alphabet'),
	btn: {
		notes: u('#hide-notes'),
		poem: u('#new-poem'),
		hint: u('#get-hint'),
		solution: u('#view-solution'),
		tutorial: u('#tutorial'),
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
	dom.alphabet.replace(u('<form id="alphabet" autocomplete="off"></form>'))
	dom.alphabet = u('#alphabet')
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
			dom.plain.append('<span>' + game.alphabet[char] + '</span>')
		else dom.plain.append(char)
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

const resetColors = () => {
	dom.alphabet.removeClass('yellow')
	dom.plain.removeClass('yellow')
	dom.alphabet.removeClass('blue')
	dom.plain.removeClass('blue')
}

const triggerVictory = real => {
	if (game.over) return

	if (!real) {
		let i = 0
		dom.alphabet.children().nodes.forEach(n => {
			let cur = u(n).children().nodes[1]
			if (!cur.disabled) {
				cur.value = game.poem.solution[i]
				i++
			}
		})
	}

	let color = real ? 'blue' : 'yellow'
	dom.alphabet.addClass(color)
	dom.plain.addClass(color)

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

const checkVictory = () => {
	if (Object.values(game.alphabet).join('') == game.poem.solution)
		triggerVictory(true)
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

u(dom.btn.poem).on('click', () => newPoem())
u(dom.btn.solution).on('click', () => triggerVictory(false))

u(dom.btn.notes).on('click', () => dom.notes.toggleClass('hidden'))

const newPoem = () => {
	const lines = randInt(10, 15)
	setPlaceholders(lines)
	resetColors()
	fetchPoem(lines).then(poem => {
		game.alphabet = {}
		game.poem = poem
		game.over = false
		dom.cipher.text(poem.cipher)
		updatePlain()
		generateAlphabet()
	})
}
newPoem()
