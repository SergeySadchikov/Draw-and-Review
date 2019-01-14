'use strict';

//********РЕЦЕНЗИРОВАНИЕ********

//Выбраный пункт меню
let selected;

//функция очистки дата-атрибутов
function clearStateMenu() {
	menuItems.forEach(menuItem => {
		if (!menuItem.hasAttribute('data-state')) return;
		menuItem.setAttribute('data-state', "");	
	});
}
//выбор меню
menuItems.forEach(menuItem => menuItem.addEventListener('click', selectMenuItem));

function selectMenuItem(event) {	
	if (event.currentTarget.classList.contains('burger')) {
		//Нажатие на бургер-меню
		menu.dataset.state = 'default';
		sessionStorage.setItem('menuState', 'default');
		sessionStorage.removeItem('currentMenuItem');
		clearStateMenu();
		checkMenuPosition();
	} else if (event.currentTarget.hasAttribute('data-state')) {
		//Состояние selected
		menu.dataset.state = 'selected';
		clearStateMenu();
		checkMenuPosition();

		event.currentTarget.setAttribute('data-state', 'selected');
		//Запуск draw
		event.currentTarget.classList.contains('draw') ? drawInitialization() : removeCanvas();
		//Состояние положение меню
		selected = event.currentTarget.className;
		sessionStorage.setItem('menuItemState', 'selected');
		sessionStorage.setItem('currentMenuItem', selected);
		sessionStorage.setItem('menuState', 'selected');	
	}
}
//рестарт меню при перезагрузке
document.addEventListener('DOMContentLoaded', restartMenu);

function restartMenu() {
	clearStateMenu();
	if (sessionStorage.menuState === 'default') {
		menu.dataset.state = sessionStorage.menuState;
	} else if (sessionStorage.menuState && sessionStorage.menuItemState && sessionStorage.currentMenuItem) {
		menu.dataset.state = sessionStorage.menuState;
		const currentMenuItem = menu.getElementsByClassName(sessionStorage.currentMenuItem)[0];
		currentMenuItem.setAttribute('data-state', sessionStorage.menuItemState);
	} 
}
//функция запуска предыдущего режима
function selectPreviousMode() {
	console.log('selectPreviousMode');
	if (!sessionStorage.currentMenuItem) return;
	const currentMenuItem = menu.getElementsByClassName(sessionStorage.currentMenuItem)[0];
	let e = new Event("click");
	currentMenuItem.dispatchEvent(e);	
}
//проверка выхода меню за границу window
function checkMenuPosition() {
	getMenuWidth()
		.then(menuWidth => {
			const menuRight = menu.offsetLeft + menuWidth;
			const documentRight = document.body.offsetLeft + document.body.offsetWidth;
			if (menuRight < documentRight) return;
			menu.style.left = 'auto';
			menu.style.right = '1px';	
		})
		.then(() => sessionStorage.setItem('menuLeft', `${menu.offsetLeft}px`));
}
function getMenuWidth() {
	return new Promise(resolve => {
	 setTimeout(() => {
	 	const menuWidth = menu.offsetWidth;
	 	resolve(menuWidth);
	 }, 1);	
	})
}

//Плавающее меню
let movedMenu = false;
let shiftX = 0;
let shiftY = 0;
document.addEventListener('mousedown', event => {
	if (!event.target.classList.contains('drag')) return;
	movedMenu = menu;
	const bounds = event.target.getBoundingClientRect();
	shiftX = event.pageX - bounds.left - window.pageXOffset;
	shiftY = event.pageY - bounds.top - window.pageYOffset;
});

document.addEventListener('mousemove', event => {
	event.preventDefault();
	if (!movedMenu) return;
	let x = event.pageX - shiftX;
	let y = event.pageY - shiftY;
	const minX = document.body.offsetLeft;
	const minY = document.body.offsetTop;
	const maxX = document.body.offsetLeft + document.body.offsetWidth - movedMenu.offsetWidth;
	const maxY = document.body.offsetTop + document.body.offsetHeight - movedMenu.offsetHeight;
	x = Math.min(x, maxX);
	y = Math.min(y, maxY);
	x = Math.max(x, minX);
	y = Math.max(y, minY);
	movedMenu.style.left = `${x}px`;
	movedMenu.style.top = `${y}px`;
	movedMenu.style.right = `auto`;
	movedMenu.style.bottom = `auto`;
	movedMenu.classList.add('moving');
});

document.addEventListener('mouseup', event => {
	if (!movedMenu) return;
	movedMenu.classList.remove('moving');
	sessionStorage.setItem('menuLeft', movedMenu.style.left);
	sessionStorage.setItem('menuTop', movedMenu.style.top);
	movedMenu = false;

});

function setMenuPosition() {
	if (!sessionStorage.menuLeft && !sessionStorage.menuTop) return;
	menu.classList.add('moving');
	menu.style.left = sessionStorage.menuLeft;
	menu.style.top = sessionStorage.menuTop;
	menu.classList.remove('moving');	
}
document.addEventListener('DOMContentLoaded', setMenuPosition);

//resize
window.addEventListener('resize', () => {
	if (parseInt(menu.style.left) + menu.offsetWidth > document.body.offsetWidth) {
		menu.style.left = '0px';
	}	
	if (parseInt(menu.style.top) + menu.offsetHeight > document.body.offsetHeight) {
		menu.style.top = '0px';
	}
	sessionStorage.setItem('menuLeft', menu.style.left);
	sessionStorage.setItem('menuTop', menu.style.top);
});