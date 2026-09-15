import './style.css'
import * as yup from 'yup';
import i18next, { keyFromSelector } from "i18next";
import { proxy, subscribe, snapshot } from 'valtio/vanilla'
import { renderState } from './view.js'
import i18nextInstance from './i18next.js'
import axios from 'axios'
// import { uniqueId } from 'es-toolkit/compat'
const schema = yup.string()
  .trim()
  .required('emptyUrl')
  .url('invalidUrl')
  .test('noDuplicate', 'duplicateRss', (value) => {
    const watchedState = snapshot(state.data)
    const { feed } = watchedState
    console.log(`value ${value}`)
    return !feed.some((item) => item.url === value)
  })
//   .test('exists', 'invalidRss', async (value) => {
//     if (!value) return false
//     return axios.get('https://allorigins.hexlet.app/get', {
//   params: { disableCache: true, url: value }
// })
//       .then((response) => {
//         console.log(response.data.status)
//         return response.data.status.http_code === 200})
//       .catch(() => false)
//   })


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
const state = proxy({
  ui: {
    status: 'filling',
  },
  data: {
    errors: [],
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
const inputUrl = document.getElementById('url-input')
const submit = document.querySelector('input[type="submit"]')
const form = document.querySelector('form')

const parseRss = (rss) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rss, "application/xml");
  console.log(doc)
  if (doc.querySelector('parsererror')) {
    throw new Error('invalidRss')
  }
  else {

    const channelTitle = doc.querySelector('channel > title').textContent
    const channelDescription = doc.querySelector('channel > description').textContent
    const posts = doc.querySelectorAll('item')
    const links = [...posts].map((post) => post.querySelector('link').textContent)

    return { channelTitle, channelDescription, links }
  }

}
const createIdGenerator = (start = 1) => {
  let count = start;
  return () => count++;
};

const updateUi = (data, url) => {
  const feedId = feedCounter()
  const postId = postCounter()
  state.data.feed.push({ id: feedId, title: data.channelTitle, description: data.channelDescription, url: url })
  data.links.forEach((link) => state.data.posts.push({ id: postId, title: link, feedId: feedId }))
  state.data.error = null
}
const feedCounter = createIdGenerator()
const postCounter = createIdGenerator()
form.addEventListener('submit', (e) => {

  e.preventDefault();
  const formData = new FormData(e.target)
  const url = formData.get('url-input')
  validateUrl(url)
    .then(url => loadData(url))
    .then((rss) => parseRss(rss))
    .then((data) => updateUi(data, url))
    .then(() => setTimeout(checkForNewPosts()), 5000)
    .catch((err) => {

      state.data.error = keyFromSelector(($) => $.errors[err.message])
    })


})

subscribe(state.data, () => {

  const watchedState = snapshot(state.data);

  console.log(watchedState)
  renderState(document.getElementById('form-container'), document.getElementById('feed'), document.getElementById('posts'), watchedState, inputUrl)
  // console.log('feed', watchedState.feed)
  // console.log('posts', watchedState.posts)
  // console.log('errors', watchedState.error)
})
const checkForNewPosts = () => {
  const watchedState = snapshot(state.data)
  console.log('checkForNewPosts', watchedState)
  const promises = watchedState.feed.map((item) => {
    return loadData(item.url).then((data) => ({ url: item.url, data }))
  })

  console.log('promises', promises)
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
      console.log('parsed', parsed)
      parsed.forEach((data) => {
        // const watchedState = snapshot(state.data)
        console.log('watchedState', watchedState)
        const existingFeed = watchedState.feed.find((item) => item.url === data.url)
        const newPosts = watchedState.posts.filter((item) => item.feedId === existingFeed.id)
        const newPostsTitles = new Set(newPosts.map(item => item.title));
        const result = data.data.links.filter(link => !newPostsTitles.has(link))
        console.log(result)
        console.log(existingFeed)
         result.forEach((link) => state.data.posts.push({ id: 5, title: link, feedId: existingFeed.id }))
         setTimeout(checkForNewPosts, 5000)
      })
    })
    .catch((err) => {

      state.data.error = keyFromSelector(($) => $.errors[err.message])
    })

 
}

export { state }



