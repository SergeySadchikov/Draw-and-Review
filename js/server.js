'use strict';

let serverData;

//**********WebSocket**********

function wsConnect() {
	WS = new WebSocket(`wss://neto-api.herokuapp.com/pic/${sessionStorage.id}`);
	WS.addEventListener('open', () => console.log('WS connection open'));
	WS.addEventListener('message', event => wsMessageHandler(JSON.parse(event.data)));
	WS.addEventListener('close', event => console.log('WS connection closed'));
	WS.addEventListener('error', error => {
		loaderError.classList.remove('hidden');
		loaderErrorMsg.textContent = `Ошибка соединения`;
	});
}

function wsMessageHandler(data) {
	switch(data.event) {
		case 'pic':
			console.log('PIC EVENT DONE');
			loadImage(data.pic.url)
				.then(() => img.alt = data.pic.title)
				.then(getBoxRectangle);
			break;
		case 'comment':
			console.log('COMMENT EVENT DONE');
			renderComment(data.comment);
			break;
		case 'mask':
			console.log('MASK EVENT DONE');
			createMask(data.url);
			break;
		case 'error':
			console.log('ERROR EVENT');
			errrorHandler(data.message);
			break;			
	}
}

//**********HTTP**********

// Отправка при публикации
function sendImg(file) {
	loaderError.classList.add('hidden');
	const regExp = /^image\/jpg|jpeg|png/;
	if (regExp.test(file.type)) {
		const formData = new FormData();
		formData.append('title', file.name);
		formData.append('image', file);
		const xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://neto-api.herokuapp.com/pic');
		xhr.addEventListener('loadstart', () => loader.classList.toggle('hidden'));
		xhr.addEventListener('loadend', () => loader.classList.toggle('hidden'));
		xhr.addEventListener('error', () => {
			loaderError.classList.add('show');
			loaderErrorMsg.textContent = 'Ошибка сети...попробуйте позже';					
		});
		xhr.addEventListener('load', () => {
			if (xhr.status !== 200) return;
			const data = JSON.parse(xhr.responseText);
			sessionStorage.setItem('id', data.id);
			sessionStorage.setItem('url', data.url);					
			menu.dataset.state = 'selected';
			modeShare.dataset.state = 'selected';
			sessionStorage.setItem('menuState', 'selected');
			sessionStorage.setItem('currentMenuItem', 'mode share');
			sessionStorage.setItem('menuItemState', 'selected');
			checkMenuPosition();
			removeAllComments();
			removeAllMasks();
			wsConnect();		
		});
		xhr.send(formData);
	} else {
		loaderError.classList.remove('hidden');
		loaderErrorMsg.textContent = 'Неверный формат файла. Пожалуйста, выберите изображение в формате .jpg или .png';	
	}
}

 //Отправка комента на сервер
function sendComment(id, comment, target, event) {
	console.log('sendComment');
	const xhr = new XMLHttpRequest();
	const body = 'message='+ encodeURIComponent(comment.message) + '&left=' + comment.left + '&top=' + comment.top;
	xhr.open('POST', `https://neto-api.herokuapp.com/pic/${id}/comments`, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.addEventListener('loadstart', () => target.querySelector('.loader').classList.toggle('hidden'));
	xhr.addEventListener('loadend', () => target.querySelector('.loader').classList.toggle('hidden'));
	xhr.addEventListener('load', () => {
		if (xhr.status !== 200) return;
		const data = JSON.parse(xhr.responseText);
		target.classList.remove('new');	
	});
	xhr.send(body);
}

//GET запрос по id
function getAppData(id) {	
	fetch(`https://neto-api.herokuapp.com/pic/${id}`)
		.then(response => response.json())
		.then(imgDataHandler)	
		.then(() => {console.log(`данные получены`)})
		.catch('Error');
}

//Обращаемся к серверу за данными при перезагрузке, и при после перехода по ссылке
document.addEventListener('DOMContentLoaded', () => {
	if (sessionStorage.id) {
		getAppData(sessionStorage.id);
	} else if (shareID) {
		getAppData(shareID);
		//после перехода по ссылке отправляемся состояние  рецензирования 
		menu.dataset.state = 'selected';
		modeShare.dataset.state = 'selected';		
		sessionStorage.setItem('menuState', 'selected');
		sessionStorage.setItem('currentMenuItem', 'mode share');
		sessionStorage.setItem('menuItemState', 'selected');
		shareID = false;
	}
});
//функция получения информации об изображении
function imgDataHandler(data) {
	loadImage(data.url)
		.then(() => {
			sessionStorage.setItem('id', data.id);
			shareID = false;
			img.alt = data.title;
			serverData =  data;
		})
		.then(getBoxRectangle)
		.then(selectPreviousMode)
		.then((event) => {
			if ('comments' in serverData) {
				renderAllComments(serverData.comments, event);
				minimizeForm();
			}	
		})
		.then(() => {
			if ('mask' in serverData) {
				createMask(serverData.mask);
			}		
		})
		.then(() => {
			if (WS) return;
			wsConnect();
		});
}
//Обработка ошибок сервера
function errrorHandler(message) {
	loaderError.classList.add('show');
	loaderErrorMsg.textContent = `Ошибка ${message}`;	
}
//Загрузка картинки
function loadImage(url) {
	return new Promise((resolve, reject) => {
		img.src = url;
		img.addEventListener('load', () => resolve(url));
		img.addEventListener('error', () => reject(url));
	});
}
//Загрузка маски
function loadMask(el, url) {
	return new Promise((resolve, reject) => {
		el.src = url;
		el.addEventListener('load', () => resolve(url));
		el.addEventListener('error', () => reject(url));
	});
}