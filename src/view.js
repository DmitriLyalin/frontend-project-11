


const renderState = (container, state, inputUrl) => {
  inputUrl.classList.remove('border-red-500')
  
  const messageElement = document.createElement('div')
  const { feed, error,successMsg } = state

  if (error !== null) {

    inputUrl.classList.add('border-red-500')
    messageElement.textContent = error
    container.appendChild(messageElement)
  }

  else {
    container.innerHTML = ''
    inputUrl.focus()
    inputUrl.value = ''
    messageElement.textContent = successMsg
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