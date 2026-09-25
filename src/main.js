import './style.css'

import parseRss from './parse';
import loadData from './loadData';
import validateUrl from './validate';
import createIdGenerator from './idGenerator.js'
import updateUi from './updateUi'
import { keyFromSelector } from "i18next";
import { proxy, subscribe, snapshot } from 'valtio/vanilla'
import { subscribeKey } from 'valtio/vanilla/utils'
import { renderPosts, renderFeed, renderMessage, renderModal } from './view.js'


// создание timerID
let timerID = null
//создание каунтера для постов 
const postCounter = createIdGenerator()

// обработчик клика на Посты для выявления активного поста
const postContainer = document.getElementById('posts')
postContainer.addEventListener('click', (e) => {
  if (e.target.tagName == 'BUTTON') {
    console.log( state.ui.activePost)
    const pickedElement = e.target.closest('li')
    const link = pickedElement.querySelector('a').href
    const currentPost = state.data.posts.find((post) => post.postUrl === link)
    currentPost.isSeen = true
    state.ui.activePost = currentPost
    console.log( state.ui.activePost)
  }
})

//создание состояния приложения
const state = proxy({
  ui: {
    formError: {
      status: 'initial',
      error: null
    },
    activePost: null,
  },
  data: {
    successMsg: null,
    feed: [],
    posts: [],
  }
})

// обработчик события отправки формы
const form = document.querySelector('form')
form.addEventListener('submit', (e) => {
  //предотвращение поведения по умолчанию
  e.preventDefault();
  const formData = new FormData(e.target)
  const url = formData.get('url-input')
  validateUrl(url)
    .then(url => loadData(url))
    .then((rss) => parseRss(rss))
    .then((data) => updateUi(data, url))
    .then(() => {
      state.ui.formError.status = 'success'
      state.ui.formError.error = null

      //проверка таймера функции по поиску новых постов
      if (timerID === null) {
        return checkForNewPosts()
      }
      else {
        return
      }
    })
    .catch((err) => {
      state.ui.formError.status = 'error'
      const errorMessage = keyFromSelector(($) => $.errors[err.message])
 state.ui.formError.error = new Error(errorMessage)  
    })

})
//рендер модального окна с подробностями о посте
subscribeKey(state.ui, 'activePost', (value) => {
  renderModal(document.querySelector('section'), value)
  const dialogWindow= document.querySelector('dialog')
  dialogWindow.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-role="close-btn"]');
  if (!btn) return; 
    dialogWindow.close()
    state.ui.activePost = null
});
  

})

//рендер постов
subscribe(state.data.posts, () => {
  const watchedState = snapshot(state.data);
  renderPosts(postContainer, watchedState)
})
//рендер фидов
subscribe(state.data.feed, () => {
  const watchedState = snapshot(state.data);
  renderFeed(document.getElementById('feed'), watchedState)
})
//рендер сообщения об ошибке
subscribe(state.ui.formError, () => {
  const watchedState = snapshot(state.ui.formError);
  renderMessage(document.getElementById('form-container'), watchedState)
})
//функция отслеживания новых постов в фидах
const checkForNewPosts = () => {

  const watchedState = snapshot(state.data)
  const promises = watchedState.feed.map((item) => {
    return loadData(item.url).then((data) => ({ url: item.url, data }))
  })
  //возврат промиса и фильтрация постов
  const promise = Promise.allSettled(promises)
  promise.then((filtered) => {
    const fulfilled = filtered.filter((item) => item.status === 'fulfilled').map((item) => ({ url: item.value.url, data: item.value.data }))
    const rejected = filtered.filter((item) => item.status === 'rejected')
    //вывод сообщения об ошибке
    rejected.forEach((item) => {
      state.ui.formError.error = keyFromSelector(($) => $.errors[item.reason.message])
    })
    return fulfilled
  })
    // передача успешных постов в парсинг и проброс url
    .then((fulfilled) => {
      return fulfilled.map((rss) => {
        return { url: rss.url, data: parseRss(rss.data) }
      })
    })
    // проверка текущего фида на наличие новых постов
    .then((parsed) => {
      parsed.forEach((data) => {
        const existingFeed = watchedState.feed.find((item) => item.url === data.url)
        const newPosts = watchedState.posts.filter((item) => item.feedId === existingFeed.id)
        const newPostsTitles = new Set(newPosts.map(item => item.title));
        const result = data.data.links.filter(link => !newPostsTitles.has(link.postTitle))
        result.forEach((link) => state.data.posts.push({ id: postCounter(), isSeen: false, title: link.postTitle, postUrl: link.postLink, postDescription: link.postDescription, feedId: existingFeed.id }))
      })
    })
    // отображение пойманной ошибки
    .catch((err) => {

      state.ui.formError.error = keyFromSelector(($) => $.errors[err.message])
    })

  timerID = setTimeout(checkForNewPosts, 5000)
}

export { state }



