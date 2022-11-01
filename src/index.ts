// import colors from '@colors/colors/safe';
import { NonEmptyArray, throwError } from '@lawlzer/helpers';

const colours = <const>['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey', 'bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite', 'reset', 'bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough', 'rainbow', 'zebra', 'america', 'trap', 'random', 'zalgo'];
export type Colour = typeof colours[number];

export interface Theme {
	[key: string]: NonEmptyArray<Colour> | Colour; // An array of Colours with at least 1 Colour, or a single Colour
}

let allowedThemes: string[] = [];
let themes: Theme = {};

/**
 *
 * Takes a set of "themes", and "allowedThemes", which will be used in the "log" function.
 *
 *  init({ silly: 'rainbow', silly2: ['rainbow'], }, ['silly', 'silly2']);
 *
 */
export function init(inputThemes: Theme, inputAllowedThemes: string[]): void {
	for (const [key, colour] of Object.entries(inputThemes)) {
		const colours = Array.isArray(colour) ? colour : [colour];
		const allColours = colours.every(isColour);
		if (!allColours) throwError('Invalid colour in theme');
	}
	themes = inputThemes;

	allowedThemes = inputAllowedThemes;
}

function isColour(str: string): str is Colour {
	return colours.includes(str as Colour);
}

/**
 * Will take a "messageLevel" (setup from init), and a "message", and log it to the console depending on the "messageLevel" vs "allowedThemes" set on init.
 */
export function log(messageLevel: string, message: string) {
	if (Object.keys(themes).length === 0) throwError('Theme not initialised');
	const themeColours = themes[messageLevel];
	if (!themeColours) throwError('Invalid message level');

	if (!allowedThemes.includes(messageLevel)) return; // We don't want to log this message level

	const colours = Array.isArray(themeColours) ? themeColours : [themeColours];

	// TODO: Does not handle all colours, only does the 0th one.
	console.info(`${messageLevel[colours[0] as any]}  -  ${message}`);
}

init(
	{
		silly: 'rainbow',
		silly2: ['rainbow', 'bold'],
	},
	['silly', 'silly2']
);

log('silly2', 'Hello world!');
