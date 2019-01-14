'use strict';

//********ПУБЛИКАЦИЯ********

newBtn.addEventListener('click', function(event) {
	event.preventDefault();
	fileInput.click();
	fileInput.addEventListener('change', onSelectFiles)
});


function onSelectFiles(event) {
	const file = event.target.files[0];
	sendImg(file);	
}

//Drag and Drop
document.body.addEventListener('dragover', event => event.preventDefault());
document.body.addEventListener('drop', onFilesDrop);

function onFilesDrop(event) {
	event.preventDefault();
	if (!img.getAttribute('src')) {
		const file = event.dataTransfer.files[0];
		sendImg(file);
	} else {
		loaderError.classList.remove('hidden');
		loaderErrorMsg.textContent = 'Чтобы загрузить новое изображение, пожалуйста воспользуйтесь пунктом "Загрузить новое" в меню';	
	}
}

