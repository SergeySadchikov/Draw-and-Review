'use strict';

//********ПОДЕЛИТЬСЯ********

const shareBtn = shareTools.querySelector('.menu_copy');
const shareUrl = shareTools.querySelector('.menu__url');
let shareID = false;

//Генерируем ссылку
function getShareURL() {
	shareUrl.value = `${location.href}?id=${sessionStorage.id}`;
}
img.addEventListener('load', getShareURL);

//Обрабочик кнопки копировать
function copyURL() {
	shareUrl.select();
	document.execCommand('copy');
}
shareBtn.addEventListener('click', copyURL);

//получаем id
function getParam() {
	let params = window
    .location
    .search
    .replace('?','')
    .split('&')
    .reduce(
        function(p,e){
            var a = e.split('=');
            p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            return p;
        },
        {}
    );
    if ('id' in params) {
    	shareID = params['id'];
    }   
}
document.addEventListener('DOMContentLoaded', () => {
	getParam();
});

function startSharing() {
    getParam();
    getShareURL();
}