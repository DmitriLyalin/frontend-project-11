import './style.css'
import * as yup from 'yup';
import parseRss from './parse';
import { keyFromSelector } from "i18next";
import { proxy, subscribe, snapshot } from 'valtio/vanilla'
import { renderPosts, renderFeed, renderMessage, renderModal } from './view.js'
import axios from 'axios'
// схема валидации URL
const schema = yup.string()
  .trim()
  .required('emptyUrl')
  .url('invalidUrl')
  .test('noDuplicate', 'duplicateRss', (value) => {
    const watchedState = snapshot(state.data)
    const { feed } = watchedState
    return !feed.some((item) => item.url === value)
  })
// создание timerID
let timerID = null
// генерация уникального ID
const createIdGenerator = (start = 1) => {
  let count = start;
  return () => count++;
};
// обработчик клика на Посты для выявления активного поста
const postContainer = document.getElementById('posts')
postContainer.addEventListener('click', (e) => {
  state.ui.activePost = null
  const pickedElement = e.target.closest('li')
  const link = pickedElement.querySelector('a').href
  const currentPost = state.data.posts.find((post) => post.postUrl === link)
  currentPost.isSeen = true
  state.ui.activePost = currentPost

})
//создание каунтера для постов и фидов
const feedCounter = createIdGenerator()
const postCounter = createIdGenerator()

//Загрузка данных с сервера

const loadData = (url) => {
  return axios.get('https://allorigins.hexlet.app/get', {
    params: { disableCache: true, url }
  }).then((response) => {
    return response.data.contents
  })
    .catch((err) => {
      err.message = 'networkError'
      return Promise.reject(err)
    })
}

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
// функция валидации URL
const validateUrl = (url) => {
  return schema
    .validate(url)
    .then(() => url)
    .catch((err) => {
      return Promise.reject(err)
    })
}

// функция обновления состояния приложения
const updateUi = (data, url) => {
  const newFeed = { id: feedCounter(), title: data.channelTitle, description: data.channelDescription, url: url }
  state.data.feed.push(newFeed)
  data.links.forEach((link) => state.data.posts.push({ id: postCounter(), isSeen: false, title: link.postTitle, postUrl: link.postLink, postDescription: link.postDescription, feedId: newFeed.id }))
  state.ui.formError.error = null
}
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
      state.ui.formError.error = keyFromSelector(($) => $.errors[err.message])
    })

})
//рендер модального окна с подробностями о посте
subscribe(state.ui, () => {
  const watchedState = snapshot(state);
  renderModal(document.querySelector('section'), watchedState)
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
        result.forEach((link) => state.data.posts.push({ id: postCounter(), isSeen: false, title: link.postTitle, postUrl: link.postLink,  postDescription: link.postDescription, feedId: existingFeed.id }))
      })
    })
    // отображение пойманной ошибки
    .catch((err) => {

      state.ui.formError.error = keyFromSelector(($) => $.errors[err.message])
    })

  timerID = setTimeout(checkForNewPosts, 5000)
}

export { state }



