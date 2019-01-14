﻿Приложение Draw and Review
===
В данном приложении реализована клиентская часть.  Приложение написано полностью на JavaScript.

## Сервис предоставляет пользователям следующие возможности:
- загружать изображения;
- добавлять комментарии к конкретной части изображения;
- рисовать поверх изображения.

А также сервис наделен элементами совместной работы:
- загруженное изображение имеет уникальную ссылку, которой можно поделиться;
- все пользователи, просматривающие изображение, уведомляются о новых комментариях к нему;
- все пользователи, просматривающие изображение в режиме рисования, видят, что рисуют другие пользователи.

## Интерфейс

Приложение имет два состояния:

1. Публикация (_состояние по умолчанию_):

2. Рецензирование:


Приложение имеет четыре компонента:
- _Холст_, основная рабочая область, в которой располагаются рецензируемое изображение и плавающее меню;
- _Плавающее меню_, позволяющее переключаться между режимами и инструментами;
- _Маска со штрихами пользователей_, созданными в режиме **Рисование**;
- _Комментарии пользователей_, оставленные в режиме **Комментирование**.

### Публикация

Этот режим открывается по умолчанию при открытии интерфейса: 


В нём доступна всего одна функция: выбор изображения и его публикация на сервере. Изображение можно выбрать двумя способами:

1. Кликнуть на поле «Загрузить новое», после чего откроется стандартный диалог выбора файла. Выбор ограничен только JPG и PNG изображениями.
2. Перетащить файл изображения и бросить на холст. 

В обоих случаях, сразу после успешного выбора изображения, оно публикуется на сервере. 

В случае успеха интерфейс переходит в состояние **Рецензирование**, режим «Поделиться».

#### Ошибки при публикации

Если на холст брошена не картинка, либо картинка в другом формате (не JPG и PNG), появляется сообщение об ошибке:

### Рецензирование

В состояние **Рецензирование** интерфейс переходит после успешной загрузки изображения:

В это состояние возможно попасть двумя способами:
1. После успешной публикации изображения открывается режим «Поделиться» (_описано в состоянии «Публикация»_).
2. При переходе по ссылке скопированной из режима «Поделиться» открывается режимы «Комментирование»

В данном состоянии **Рецензирования** доступно три режима: комментирование, рисование, поделиться.

#### Режим «Комментирование»

Режим открывается при переходе по ссылке полученной в режиме «Поделиться». А так же при клике на пункт «Комментарии» в меню. В этом режиме можно добавлять новые комментарии.

Доступен переключатель, позволяющий показать или скрывать маркеры комментариев.
Если в меню выбрать «Скрыть комментарии», то маркеров комментариев не видно:

При клике в любую точку на холсте, открывается форма добавления нового комментария. Она не должна скрываться при клике на маркер.


#### Режим «Рисование»

Здесь доступна возможность выбора цвета пера из пяти доступных: 
- красный (`#ea5d56`), 
- жёлтый (`#f3d135`), 
- зелёный (`#6cbe47`), 
- синий (`#53a7f5`) 
- и фиолетовый (`#b36ade`).

#### Режим «Поделиться»

Открывается сразу после публикации. Тут доступна ссылка, перейдя по которой приложение откроется и сразу перейдет в состояние «Рецензироние» именно с этим изображением.

#### Переключение между режимами

Для переключения между режимами пользователю доступно плавающее меню. Меню можно переместить в любую часть холста, если зажать кнопку мыши на «корешке».


## Взаимодействие с сервером по HTTP

Для взаимодействии с серверной частью приложения вам доступно REST API.


## Взаимодействие с сервером через веб-сокет

Для обновления интерфейса в «реальном» времени дополнительно реализовано веб-сокет соединение.