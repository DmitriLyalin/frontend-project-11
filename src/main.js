import './style.css'
import * as yup from 'yup';
import { keyFromSelector } from "i18next";
import { proxy, subscribe, snapshot } from 'valtio/vanilla'
import { renderPosts, renderFeed, renderMessage, renderModal } from './view.js'
import axios from 'axios'
// validation schema
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

//Загрузка данных с целевого url

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

//состояние объекта
const state = proxy({
  ui: {
    activePost:null,
  },
  data: {
    error: null,
    successMsg: null,
    feed: [],
    posts: [],
  }
})
const validateUrl = (url) => {
  return schema
    .validate(url)
    .then(() => url)
    .catch((err) => {
      return Promise.reject(err)
    })
}
const form = document.querySelector('form')

const parseRss = (rss) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rss, "application/xml");
  if (doc.querySelector('parsererror')) {
    throw new Error('invalidRss')
  }
  else {
    const channelTitle = doc.querySelector('channel > title').textContent
    const channelDescription = doc.querySelector('channel > description').textContent
    const posts = doc.querySelectorAll('item')
    const links = [...posts].map((post) => {
      const postTitle = post.querySelector('title').textContent
      const postLink = post.querySelector('link').textContent
      const postDescription = post.querySelector('description').textContent
      return {postTitle, postLink, postDescription}
    })

    return { channelTitle, channelDescription, links }
  }

}


const updateUi = (data, url) => {

  state.data.feed.push({ id: feedCounter(), title: data.channelTitle, description: data.channelDescription, url: url })
  data.links.forEach((link) => state.data.posts.push({ id: postCounter(), isSeen: false, title: link.postTitle, postUrl: link.postLink, postDescription: link.postDescription, feedId: state.data.feed[state.data.feed.length - 1].id }))
  state.data.error = null
}

form.addEventListener('submit', (e) => {

  e.preventDefault();
  const formData = new FormData(e.target)
  const url = formData.get('url-input')
  validateUrl(url)
    .then(url => loadData(url))
    .then((rss) => parseRss(rss))
    .then((data) => updateUi(data, url))
    .then(() => {
      if (timerID === null) {
        return checkForNewPosts()
      }
      else {
        return
      }
    })
    .catch((err) => {

      state.data.error = keyFromSelector(($) => $.errors[err.message])
    })


})
subscribe(state.ui, () => {
renderModal(document.querySelector('section'), state)
})
subscribe(state.data.posts, () => {
  const watchedState = snapshot(state.data);
  renderPosts(postContainer, watchedState)
})
subscribe(state.data.feed, () => {
  const watchedState = snapshot(state.data);
  renderFeed(document.getElementById('feed'), watchedState)
})
subscribe(state.data, () => {
  const watchedState = snapshot(state.data);
  renderMessage(document.getElementById('form-container'), watchedState)
})
const checkForNewPosts = () => {

  const watchedState = snapshot(state.data)
  const promises = watchedState.feed.map((item) => {
    return loadData(item.url).then((data) => ({ url: item.url, data }))
  })

  const promise = Promise.allSettled(promises)

  promise.then((filtered) => {
    const fulfilled = filtered.filter((item) => item.status === 'fulfilled').map((item) => ({ url: item.value.url, data: item.value.data }))
    const rejected = filtered.filter((item) => item.status === 'rejected')
    rejected.forEach((item) => {
      state.data.error = keyFromSelector(($) => $.errors[item.reason.message])
    })
    return fulfilled
  })
    .then((fulfilled) => {
      return fulfilled.map((rss) => {
        return { url: rss.url, data: parseRss(rss.data) }
      })
    })
    .then((parsed) => {
      parsed.forEach((data) => {
        const existingFeed = watchedState.feed.find((item) => item.url === data.url)
        const newPosts = watchedState.posts.filter((item) => item.feedId === existingFeed.id)
        const newPostsTitles = new Set(newPosts.map(item => item.title));
        const result = data.data.links.filter(link => !newPostsTitles.has(link.postTitle))
        result.forEach((link) => state.data.posts.push({ id: postCounter(), isSeen: false, title: link.postTitle, postUrl: link.postLink, feedId: state.data.feed[state.data.feed.length - 1].id }))

      })
    })
    .catch((err) => {

      state.data.error = keyFromSelector(($) => $.errors[err.message])
    })

  timerID = setTimeout(checkForNewPosts, 5000)
}

export { state }



