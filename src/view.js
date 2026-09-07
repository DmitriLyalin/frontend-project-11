import i18nextInstance from './i18next.js'
import i18next from "i18next";

const renderState = (container, state, inputUrl) => {
  inputUrl.classList.remove('border-red-500')
  
  const messageElement = document.createElement('div')
  const { feed, error } = state

  if (error !== null) {

    inputUrl.classList.add('border-red-500')
    messageElement.textContent = i18nextInstance.t(error) 
    container.appendChild(messageElement)
  }

  else {
    container.innerHTML = ''
    inputUrl.focus()
    inputUrl.value = ''
    messageElement.textContent = i18nextInstance.t (($) => $.valid)
    const feedList = document.createElement('ul')
    feed.forEach((item) => {
      const listItem = document.createElement('li')
      listItem.textContent = item.url
      feedList.appendChild(listItem)
      container.appendChild(messageElement)
    })
    container.appendChild(feedList)
  }

}
export { renderState }