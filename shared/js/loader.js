function loadModFile(index) {
	let script = document.createElement("script");
	script.src = "js/" + modInfo.modFiles[index];
	if (index + 1 < modInfo.modFiles.length) script.onload = () => {
		loadModFile(index + 1);
	};
	document.head.appendChild(script);
};

loadModFile(0);
