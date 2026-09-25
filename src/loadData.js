//Загрузка данных с сервера
import axios from 'axios'
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
export default loadData