/**
 * Strip a string to a maximum length, adding an ellipsis (...) if necessary.
 * @param content
 * @param max
 */
export function strip(content: string, max = 200): string {
	let result = "";

	// join one word at a time, until the max length is reached
	for (const word of content.split(/\s+/)) {
		if (result.length + word.length > max) {
			result += "...";
			break;
		}
		result += word + " ";
	}

	return result.trim();
}
