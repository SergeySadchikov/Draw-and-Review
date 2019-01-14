'use strict';

const app = document.querySelector('.app');
const fileInput = document.querySelector('.fileInput');
const menu = document.querySelector('.menu');
const newBtn = menu.querySelector('.new');
const menuItems = menu.querySelectorAll('.menu__item');
const shareTools = menu.querySelector('.share-tools');
const modeShare = menu.querySelector('.mode.share');
const drawTools = menu.querySelector('.draw-tools');
const loader = document.querySelector('.image-loader');
const loaderError = document.querySelector('.error');
const loaderErrorMsg = loaderError.querySelector('.error__message');

const img = document.querySelector('.current-image');

let WS = false;

//Позиционирование img относительно окна
let boundingX;
let boundingY;

function getBoxRectangle() {
	const boxRectangle = img.getBoundingClientRect();
	boundingX = Math.ceil(boxRectangle.left);
	boundingY = Math.ceil(boxRectangle.top);
}

