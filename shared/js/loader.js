for (const file in modInfo.modFiles) {
	let script = document.createElement("script");
	script.setAttribute("src", "js/" + modInfo.modFiles[file]);
	document.head.appendChild(script);
};
