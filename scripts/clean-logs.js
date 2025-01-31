const fs = require("fs");
const path = require("path");

// Function to get all files recursively
const getAllFiles = (dirPath, arrayOfFiles = []) => {
	const files = fs.readdirSync(dirPath);

	for (const file of files) {
		const filePath = path.join(dirPath, file);
		if (fs.statSync(filePath).isDirectory()) {
			getAllFiles(filePath, arrayOfFiles);
		} else if (file.match(/\.(js|ts|tsx)$/)) {
			arrayOfFiles.push(filePath);
		}
	}

	return arrayOfFiles;
};

// Regular expressions for different types of console statements
const consolePatterns = [
	/console\.log\([^)]*\);?/g,
	/console\.debug\([^)]*\);?/g,
	/console\.info\([^)]*\);?/g,
];

// Process a single file
const cleanFile = (filePath) => {
	try {
		let content = fs.readFileSync(filePath, "utf8");
		let hasChanges = false;

		// Remove console statements
		for (const pattern of consolePatterns) {
			if (content.match(pattern)) {
				hasChanges = true;
				content = content.replace(pattern, "");
			}
		}

		// If changes were made, clean up empty lines and write back
		if (hasChanges) {
			content = content
				.replace(/^\s*[\r\n]/gm, "") // Remove empty lines
				.replace(/\n\s*\n\s*\n/g, "\n\n"); // Reduce multiple empty lines to one

			fs.writeFileSync(filePath, content);
			console.log(`Cleaned logs from ${filePath}`);
			return true;
		}
		return false;
	} catch (error) {
		console.error(`Error processing ${filePath}:`, error);
		return false;
	}
};

// Main execution
const appDir = path.join(process.cwd(), "app");
const files = getAllFiles(appDir);
let changedFiles = false;

for (const file of files) {
	if (cleanFile(file)) {
		changedFiles = true;
	}
}

if (changedFiles) {
	console.log("Logs cleaned successfully!");
	process.exit(0);
} else {
	console.log("No logs found to clean.");
	process.exit(0);
}
