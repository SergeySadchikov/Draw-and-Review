'use strict';

let canvas;
let color = '#6cbe47';
let ctx;
let points = [];
let drawingStatus = false;
let currentBinaryData = [];

//подготовка к рисованию
function drawInitialization() {
	if (canvas) return;
	canvas = document.createElement('canvas');
	app.appendChild(canvas);
	canvas.width = img.width;
	canvas.height = img.height;
	ctx = canvas.getContext('2d');
	canvas.addEventListener("mousedown", (event) => {
		drawingStatus = true;
	});
	canvas.addEventListener('mousemove', drawing);
	canvas.addEventListener('mouseup', endDraw);
	canvas.addEventListener('mouseleave', endDraw);
	setInterval(() => {
		if (currentBinaryData.length > 0) {
			sendMask(currentBinaryData[0]);
			currentBinaryData.shift();	
		} 			
	}, 2000);
}
//убираем канвас
function removeCanvas() {
	if (!canvas) return;
	app.removeChild(canvas);
	canvas = false;		
}
//Выбор цвета
drawTools.addEventListener('change', setColor);

function setColor(event) {
	if (!event.target.tagName === 'input') return;
	color = event.target.dataset.color;
}

//кривая между двумя точками
function curveBetween(point1, point2) {
	const cp = point1.map((coord, idx) => (coord + point2[idx]) / 2);
	ctx.lineWidth = 4;
	ctx.strokeStyle = color;
	ctx.quadraticCurveTo(...point1, ...cp);
}

function draw(points) {
	ctx.beginPath();
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.moveTo(...points[0]);
	for (let i = 0; i < points.length - 1; i++) {
		curveBetween(points[i], points[i + 1]);
	}
	ctx.stroke();
}

function drawing(event) {
	if (!drawingStatus) return;
	points.push([event.offsetX, event.offsetY]);
	draw(points);	
}
function endDraw() {
	createOwnMask(); 
	drawingStatus = false;
	points = [];	
}

//функция очистки холста
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
//созданием своей маски
function createOwnMask() {
	if (!drawingStatus) return;
	const mask = document.createElement('img');
	mask.width = canvas.width;
	mask.height = canvas.height;
	mask.classList.add('mask');
	mask.classList.add('own');
	canvas.toBlob(function(blob) {
		currentBinaryData.push(blob);
		mask.src = URL.createObjectURL(blob);
		mask.addEventListener('load', () => URL.revokeObjectURL(mask.src));
	});
	app.insertBefore(mask, app.querySelector('.comments__form'));
	clear();
	console.log('own mask done');			
}
//функция очистки своих масок
function clearOwnMask() {
	const ownMasks = app.querySelectorAll('.own');
  	ownMasks.forEach(item => app.removeChild(item));
}
//Отправлем маску на сервер
function sendMask(blob) {
	if (!WS) return;
	WS.send(blob);
	console.log('send mask done');	
}
//получаем маску с сервера
function createMask(url) {
	const mask = document.createElement('img');
	loadMask(mask, url)
		.then(() => {
			mask.classList.add('mask');
			app.insertBefore(mask, app.querySelector('.comments__form'));
		})
		.catch(error => console.log(error));	
}
//удаление всех масок
function removeAllMasks() {
	const masks =  app.querySelectorAll('.mask');
	masks.forEach(mask => app.removeChild(mask));	
}