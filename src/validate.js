import { snapshot } from 'valtio/vanilla'
import * as yup from 'yup';
import {state} from './main.js'
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
// функция валидации URL
const validateUrl = (url) => {
  return schema
    .validate(url)
    .then(() => url)
    .catch((err) => {
      return Promise.reject(err)
    })
}

export default validateUrl