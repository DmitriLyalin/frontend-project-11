//Загрузка данных с сервера
import axios from 'axios'
const loadData = (url) => {
  return axios.get('https://allorigins.hexlet.app/get', {
    params: { disableCache: true, url }
  }).then((response) => {
    return response.data.contents
  })
    .catch((err) => {
      return Promise.reject(new Error('networkError'))
    })
}
export default loadData