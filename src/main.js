import './style.css'
import * as yup from 'yup';
import i18next, { keyFromSelector } from "i18next";
import { proxy, subscribe, snapshot } from 'valtio/vanilla'
import { renderState } from './view.js'
import i18nextInstance from './i18next.js'
import axios from 'axios'
import { uniqueId } from 'es-toolkit/compat'
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
      const id = uniqueId()
      const posts = doc.querySelectorAll('item')
      const links = [...posts].map((post) => post.querySelector('link').textContent)
      
      return {id,channelTitle, channelDescription, links}
  }

}
const createIdGenerator = (start = 1) => {
  let count = start;
  return () => count++;
};
const counter =createIdGenerator()
console.log(counter)
console.log(counter)
form.addEventListener('submit', (e) => {
  state.data.error = null
  e.preventDefault(); 
  const formData = new FormData(e.target)
  const url = formData.get('url-input')
  validateUrl(url)
    .then(url => loadData(url))
    .then((rss) => parseRss(rss))
    .then((data) => {
      state.data.feed.push({id: data.id, title:data.channelTitle, description:data.channelDescription, url: url})
      data.links.forEach((link) => state.data.posts.push({title: link, id:counter(), feedId: data.id}))
      console.log(state.data)
    })
    .catch((err) => {

      state.data.error = keyFromSelector(($) => $.errors[err.message])
    })


})

subscribe(state.data, () => {

  const watchedState = snapshot(state.data);

  console.log(watchedState)
  renderState(document.getElementById('app'), watchedState, inputUrl)
  console.log('feed', watchedState.feed)
  console.log('posts', watchedState.posts)
  console.log('errors', watchedState.error)
})

// renderState(document.getElementById('app'), state, inputUrl)
export { state }