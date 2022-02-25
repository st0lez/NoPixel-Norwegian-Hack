import { randomInt, sample } from './helpers.js'
import TRANSLATIONS from './language.js'

const selectedLang = TRANSLATIONS.SELECTED_LANGUAGE

if(!TRANSLATIONS.LANGUAGES.includes(selectedLang)) console.log(`LANGUAGE NOT SUPPORTED\nSELECTED: ${TRANSLATIONS.SELECTED_LANGUAGE}\nAVAILABLE: ${TRANSLATIONS.LANGUAGES}`)
const LANG = TRANSLATIONS[selectedLang]

const SHAPES = ["firkant", "trekant", "rektangel", "sirkel"]
const COLORABLE = ['bakgrunn', 'tekst', 'nummer', 'form']

const COLOR_CODES = ['svart', 'hvit','#1991F9','#8C0C00','#FFE335','#FF9900','#46A04F','#A43AB5']
const LANG_COLORS = LANG.COLORS.reduce((obj, key, i) => {obj[key] = COLOR_CODES[i]; return obj}, {})


const COLORS = {
    'svart' : 'svart',
    'hvit' : 'hvit', 
    'blå' : '#1991F9',
    'rød' : '#8C0C00',
    'gul' : '#FFE335',
    'oransje' : '#FF9900',
    'grønn' : '#46A04F',
    'lilla' : '#A43AB5',
}
const QUESTIONS = {
    'bakgrunnsfarge' : (d) => d.farger['bakgrunn'],
    'tekst bakgrunnsfarge' : (d) => d.farger['tekst'],
    'nummerfarge' : (d) => d.farger['nummer'],
    'formfarge' : (d) => d.farger['form'],
    'fargetekst' : (d) => d.tekst[0],
    'formtekst' : (d) => d.tekst[1],
    'form' : (d) => d.form
}


class PuzzleData {
    constructor(shape, number, text, colors) {
        this.shape = shape
        this.number = number
        this.text = text
        this.colors = colors
      }
  }


// generates a random puzzle
export function generateRandomPuzzle(){

    const form = sample(SHAPES)
    const nummer = randomInt(9) + 1

    const topptekst = sample(Object.keys(LANG_COLORS))
    const bunntekst = sample(SHAPES)

    const colors = COLORABLE.reduce((obj, color) => {obj[color] = sample(Object.keys(COLORS)); return obj}, {})

    // ensure shape and background don't blend
    while(colors['text'] == colors['background'])
        colors['text'] = sample(Object.keys(COLORS))

    // ensure nothing blends with shape
    while(['background', 'text', 'number'].map(i => colors[i]).includes(colors['shape']))
        colors['shape'] = sample(Object.keys(COLORS))
    
    return new PuzzleData(shape, number, [topText, bottomText], colors)
}


export function generateQuestionAndAnswer(nums, puzzles){

    const positionOne = randomInt(nums.length)
    let tempPosTwo
    do {tempPosTwo = randomInt(nums.length)} while(positionOne == tempPosTwo) 
    const positionTwo = tempPosTwo
    

    const firstQuestion = sample(Object.keys(QUESTIONS))
    let tempSecondQuestion
    do {tempSecondQuestion = sample(Object.keys(QUESTIONS))} while(tempSecondQuestion == firstQuestion) 
    const secondQuestion = tempSecondQuestion

    puzzles = puzzles.map(convertPuzzleDataLang)

    // this is confusing as hell, but works somehow
    const question =  `${firstQuestion} (${nums[positionOne]}) AND ${secondQuestion} (${nums[positionTwo]})`
    const answer = QUESTIONS[firstQuestion](puzzles[positionOne]) + ' ' + QUESTIONS[secondQuestion](puzzles[positionTwo])

    return [question, answer]
}


// LANGUAGE TRANSLATION FUNCTIONS 
// Should implement a more robust method for all text, but this is a start

// takes in a puzzleData class and converts language of colors
function convertPuzzleDataLang(puzzle){
    const result = puzzle
    puzzle.colors.background = convertColor(puzzle.colors.background)
    puzzle.colors.number = convertColor(puzzle.colors.number)
    puzzle.colors.shape = convertColor(puzzle.colors.shape)
    puzzle.colors.text = convertColor(puzzle.colors.text)
    puzzle.text = puzzle.text.map(i => isColor(i) ? convertColor(i) : i)
    return result
}

const isColor = (string) => TRANSLATIONS.EN.COLORS.includes(string)

function convertColor(originalColor){
    const englishColors = TRANSLATIONS.EN.COLORS
    const position = englishColors.indexOf(originalColor)
    return LANG.COLORS[position]
}
