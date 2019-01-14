'use strict';

//********КОМЕНТИРОВАНИЕ********

//Переключатель видимости
let commentsOn = true;

const menuSwitches =  document.querySelectorAll('.menu__toggle');
menuSwitches.forEach(input => input.addEventListener('change', menuSwitchesHandler));

function menuSwitchesHandler(event) {
	if (event.currentTarget.checked && event.currentTarget.value === 'off') {
		commentsOn = false;			
	} else {
		commentsOn = true;	
	}
	commentsToggle();
}
function commentsToggle() {
	const commentForms = document.querySelectorAll('.comments__form');
	if (!commentsOn) {
		commentForms.forEach(form => form.classList.add('hidden'));
	} else {
		commentForms.forEach(form => form.classList.remove('hidden'));
	}
}
//удаляем пустые формы
function removeEmptyForm() {
	const emptyForm = document.querySelector('.comments__form.new');
	if (!emptyForm) return;
	app.removeChild(emptyForm);
}
//скрываем окна
function minimizeForm() {
	const inputs = document.querySelectorAll('.comments__marker-checkbox');
	if (!inputs) return;
	inputs.forEach(input => input.checked = false);	
}
//закрытие форм
function closeForm(event) {
	if (!event.target.classList.contains('comments__close')) return;
	if (event.currentTarget.classList.contains('new')) {
		app.removeChild(event.currentTarget);	
	} else {
		event.currentTarget.querySelector('.comments__marker-checkbox').checked = false;
	} 
}
//удаление всех комент-форм
function removeAllComments() {
	const comments = document.querySelectorAll('.comments__form');
	comments.forEach(form => app.removeChild(form));
}

//Создание коментариев
document.body.addEventListener('click', (e) => {
	if (e.target.classList.contains('mask') || e.target.classList.contains('current-image')) {
		createNewComment(e);
	}
});
//Функция создания формы для коментариев (по событию клик или после получения даннных с сервера)
function createNewCommentsForm(event, own = true, comment = {}) {
	let newForm;
	if (own) {
		newForm = browserJSEngine(formTemplate(event));
		newForm.querySelector('input').setAttribute('disabled', 'disabled');
	} else {
		newForm = browserJSEngine(formTemplate(event, comment));
		addMsg(newForm, comment);
		newForm.classList.remove('new');
		if(!commentsOn) {
			newForm.classList.add('hidden');
		}			
	}
	app.appendChild(newForm);
	newForm.addEventListener('submit', createMessage);
	newForm.addEventListener('click', closeForm);
}
//Функция добавления сообщения в форму
function addMsg(form, comment) {
	const commentMsg = browserJSEngine(commentTemplate(comment));
	form.querySelector('.comments__body').insertBefore(commentMsg, form.querySelector('.comment__loader'));
	form.querySelector('.comments__body').scrollTop = form.querySelector('.comments__body').scrollHeight;	
}

//Создаём новый комент по клику
function createNewComment(event) {
	if (!commentsOn) return; 	
		removeEmptyForm();
		minimizeForm();
		createNewCommentsForm(event, true);
		
}
//создание сообщения 
function createMessage(event) {
	event.preventDefault();
	const message = event.currentTarget.querySelector('.comments__input');
	const commentLeft = (parseInt(event.currentTarget.style.left) - boundingX);
	const commentTop = (parseInt(event.currentTarget.style.top) - boundingY);
	if (!message.value) return;
	event.currentTarget.classList.remove('new');
	event.currentTarget.querySelector('input').disabled = false;
	const commentObj = {message: message.value, top: commentTop, left: commentLeft};
	sendComment(sessionStorage.id, commentObj, event.currentTarget);
	message.value = '';
}

//Получаем с сервера все коментарии
function renderAllComments(comments, event) {
	for (const comment in comments) {
		const left = comments[comment].left + boundingX;
		const top = comments[comment].top + boundingY;
		const currentForm = document.querySelector(`.comments__form[data-coord="${left} : ${top}"]`);	
		if (currentForm) {
			addMsg(currentForm, comments[comment]);	
		} else {
			createNewCommentsForm(event, false, comments[comment]);
		} 
	}
}
//Получаем с сервера новый коментарий(сообщение)
function renderComment(comment) {
	const left = comment.left + boundingX;
	const top = comment.top + boundingY;
	const currentForm = document.querySelector(`.comments__form[data-coord="${left} : ${top}"]`); 	
	if (currentForm) {
		addMsg(currentForm, comment);
	} else {
		createNewCommentsForm(event, false, comment);
	}	
}
//Парсим timestamp
function parseTime(timestamp) {
	const date = new Date(timestamp);
	const options = {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	};
	const formatDate = new Intl.DateTimeFormat("ru-RU", options).format;
	return formatDate(date);
}

function formTemplate(event, comment = {}) {
	const left = comment.left + boundingX;
	const top = comment.top + boundingY;
	return {
		tag: 'form',
		className: ['comments__form', 'new'],
		attr: {style: `left: ${event && event.pageX || left}px; top: ${event && event.pageY || top}px`, 'data-coord': `${event && event.pageX || left} : ${event && event.pageY  || top}`},
		content: [{
			tag: 'span',
			className: 'comments__marker'
		},
		{
			tag: 'input',
			className: 'comments__marker-checkbox',
			attr: {type: 'checkbox', checked: ''}
		},
		{
			tag: 'div',
			className: 'comments__body',
			//attr: {style: 'display: block'},
			content: [{
				tag: 'div',
				className: 'comment__loader',
				content: [	
					{
						tag: 'div',
						className: ['loader', 'hidden'],
						//attr: {style: 'display: none'},
						content: [{tag: 'span'}, {tag: 'span'}, {tag: 'span'}, {tag: 'span'}, {tag: 'span'}]
					}]
				},		
				{
					tag: 'textarea',
					className: 'comments__input',
					attr: {type: 'text', placeholder: 'Напишите ответ...'}
				},
				{
					tag: 'input',
					className: 'comments__close',
					attr: {type: 'button', value: 'Закрыть'}
				},
				{
					tag: 'input',
					className: 'comments__submit',
					attr: {type: 'submit', value: 'Отправить'}	
				}]
		}]
	}		
}
function commentTemplate(comment) {
	return {
		tag: 'div',
		className: 'comment',
		content: [
		{
			tag: 'p',
			className: 'comment__time',
			content: `${parseTime(comment.timestamp)}`
		},
		{
			tag: 'p',
			className: 'comment__message',
			content: `${comment.message}`
		}]
	}
}

function browserJSEngine(block) {
        if (block === undefined || block === null || block === false) {
            return document.createTextNode('');
        }
        if (typeof block === 'string' || typeof block === 'number' || block === true) {
            //const text = document.createTextNode(block);
            const span = document.createElement('span');
            span.innerText = block;
            return span;
        }
        if (Array.isArray(block)) {
            return block.reduce((f, el) => {
                f.appendChild(browserJSEngine(el));
 
                return f;
            }, document.createDocumentFragment())
        }
        const element = document.createElement(block.tag);
 
        element.classList.add(...[].concat(block.className || []));
 
        if (block.attr) {
            Object.keys(block.attr).forEach(key => {
                element.setAttribute(key, block.attr[key]);
            });
        }
 
        element.appendChild(browserJSEngine(block.content));
 
        return element;
    }

//Поведение коментов при resize
window.addEventListener('resize', changeCommentsPosition);

function changeCommentsPosition() {
	const forms = document.querySelectorAll('.comments__form');
	const prevBoundingX = boundingX;
	const prevBoundingY = boundingY;
	forms.forEach(form => {
		const formX = parseInt(form.style.left) - prevBoundingX;
		const formY = parseInt(form.style.top) - prevBoundingY;
		getBoxRectangle();
		form.style.left = `${formX + boundingX}px`;
		form.style.top = `${formY + boundingY}px`;	
	});	
}


