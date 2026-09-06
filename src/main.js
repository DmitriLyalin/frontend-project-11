import './style.css'
import * as yup from 'yup';
import { proxy, subscribe, snapshot } from 'valtio/vanilla'
import { renderState } from './view.js'

const schema = yup.string()
  .trim()
  .required('emptyUrl')
  .url('invalidUrl')
  .test('noDuplicate', 'duplicate found', (value) => {
    const watchedState = snapshot(state.data)
    console.log('watchedState', watchedState)
    const { feed } = watchedState
    return !feed.some((item) => item.url === value)
  })
  // .test('exists', 'urlNotFound', async (value) => {
  //   if (!value) return false
  //   return fetch(value, { method: 'HEAD' })
  //     .then((response) => response.ok)
  //     .catch(() => false)
  // })
 

const state = proxy({
  ui : {
    status: 'filling',
  },
  data : {
    errors: [],
    feed: [],
  }
})
const validateUrl = (url) => {
  return schema
    .validate(url)
    .then(() => url)
    .catch((err) => {
      return Promise.reject(err.message)
    })
}
const inputUrl = document.getElementById('url-input')
const submit = document.querySelector('button[type="submit"]')
const form = document.querySelector('form')
console.log(submit)

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target)
  const url = formData.get('url-input')
  validateUrl(url).then((url) => {
    state.data.feed.push({ url })
  }).catch((err) => {
    state.data.errors=[err]
  })
})



subscribe(state.data, () => {
  
    const watchedState = snapshot(state.data);

    console.log(watchedState)
    renderState(document.getElementById('app'), watchedState, inputUrl)
    console.log('feed', watchedState.feed)
    console.log('errors', watchedState.errors)
  })
