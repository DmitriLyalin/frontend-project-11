import createIdGenerator from './idGenerator'
import { state } from './main'
//создание каунтера для  фидов
const feedCounter = createIdGenerator()
//создание каунтера для постов 
const postCounter = createIdGenerator()
// функция обновления состояния приложения
const updateUi = (data, url) => {
  const newFeed = { id: feedCounter(), title: data.channelTitle, description: data.channelDescription, url: url }
  state.data.feed.push(newFeed)
  data.links.forEach((link) => state.data.posts.push({ id: postCounter(), isSeen: false, title: link.postTitle, postUrl: link.postLink, postDescription: link.postDescription, feedId: newFeed.id }))
  state.ui.formError.error = null
}
export default updateUi