function saveImageWithRibbon() {
	const imageContainer = document.getElementById("imageContainer");
	const image = imageContainer.children[0];
	const a = document.createElement("a");
	a.href = image.src;
	a.download = "profile-picture.png";
	a.click();
}

function addRibbon() {
	const file = getSelectedFile();
	const reader = new FileReader();
	reader.onload = () => {
		const profilePicture = new Image();
		profilePicture.src = reader.result;
		profilePicture.height = 1080;
		profilePicture.width = 1080;
		profilePicture.onload = () => {
			const ribbon = new Image();
			ribbon.src = getRibbonPath();
			ribbon.onload = () => {
				const kumta = new Image();
				kumta.src = getKumtaPath();
				kumta.onload = () => {
					const canvas = document.createElement("canvas");
					canvas.width = profilePicture.width;
					canvas.height = profilePicture.height;
					drawOnCanvas({ canvas, profilePicture, ribbon, kumta });
					const imageContainer = document.getElementById("imageContainer");
					imageContainer.innerHTML = "";
					const finalImage = new Image();
					finalImage.src = canvas.toDataURL();
					finalImage.width = 500;
					finalImage.height = 500;
					imageContainer.appendChild(finalImage);
				};
			};
		};
	};
	reader.readAsDataURL(file);
}

function getRibbonPath() {
	const genderElement = document.querySelector('input[name="gender"]:checked');
	const gender = genderElement.value;
	switch (gender) {
		case "male":
			return "./public/miluimnik.png";
		case "female":
			return "./public/miluimnikit.png";
		default:
			return;
	}
}

function getKumtaPath() {
	const kumtaElement = document.getElementById("kumta");
	const kumta = kumtaElement.options[kumtaElement.selectedIndex].value;
	return `./public/Kumtot/${kumta}.png`;
}

function getSelectedFile() {
	const imageInput = document.getElementById("imageInput");
	const file = imageInput.files[0];
	if (!file) alert("Please select an image");
	return file;
}

function drawOnCanvas({ canvas, profilePicture, ribbon, kumta }) {
	const ctx = canvas.getContext("2d");
	ctx.drawImage(profilePicture, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(ribbon, 0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.translate(690 + kumta.width / 2, 790 + kumta.height / 2);
	ctx.scale(-1, 1);
	ctx.rotate((120 * Math.PI) / 180);
	ctx.drawImage(
		kumta,
		-kumta.width / 2,
		-kumta.height / 2,
		kumta.width,
		kumta.height
	);
	ctx.restore();
}

const getKumtotData = async () => {
	const response = await fetch("./public/Kumtot/kumtot.json");
	const data = await response.json();
	return data.kumtot;
};

const renderKumtotOptions = (kumtot) => {
	const kumtaElement = document.getElementById("kumta");
	// kumtaElement.innerHTML = "";
	kumtot.forEach((kumta) => {
		const option = document.createElement("option");
		option.value = kumta;
		option.innerText = kumta;
		kumtaElement.appendChild(option);
	});
};

window.onload = () => {
	getKumtotData().then(renderKumtotOptions);
	setupInputEventListeners();
};

function setupInputEventListeners() {
	const genderInputs = document.querySelectorAll('input[name="gender"]');
	const kumtaSelect = document.getElementById("kumta");
	const fileInput = document.getElementById("imageInput");
	function updateFileInputStatus() {
		const genderSelected = Array.from(genderInputs).some(
			(input) => input.checked
		);
		const kumtaSelected = kumtaSelect.value !== "Select Kumta";
		fileInput.disabled = !(genderSelected && kumtaSelected);
	}
	genderInputs.forEach((input) => {
		input.addEventListener("change", updateFileInputStatus);
	});
	kumtaSelect.addEventListener("change", updateFileInputStatus);
	updateFileInputStatus();
}
