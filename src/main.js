import './style.css'
import * as yup from 'yup';
import i18next, { keyFromSelector } from "i18next";
import { proxy, subscribe, snapshot } from 'valtio/vanilla'
import { renderState } from './view.js'
import i18nextInstance from './i18next.js'
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
    error: null,
    successMsg: null,
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
const submit = document.querySelector('input[type="submit"]')
const form = document.querySelector('form')


form.addEventListener('submit', (e) => {
   state.data.error = null
  e.preventDefault();
  const formData = new FormData(e.target)
  const url = formData.get('url-input')
  validateUrl(url).then((url) => {
   
    state.data.feed.push({ url })
     
  }).catch((err) => {
   
    state.data.error = keyFromSelector(($) => $.errors[err])
  })
  

})

subscribe(state.data, () => {
  
    const watchedState = snapshot(state.data);

    console.log(watchedState)
    renderState(document.getElementById('app'), watchedState, inputUrl)
    console.log('feed', watchedState.feed)
    console.log('errors', watchedState.error)
  })

// renderState(document.getElementById('app'), state, inputUrl)
export {state}