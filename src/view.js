


const renderState = (container, state, inputUrl) => {
  const { feed, errors } = state
  container.innerHTML = ''
  if (errors.length >0) {
    inputUrl.classList.add('border-red-500')
    const errorElement = document.createElement('div')
    errorElement.textContent = errors.join(', ')
    container.appendChild(errorElement)
  }
  if (feed.length > 0) {
    inputUrl.focus()
    const feedList = document.createElement('ul')
    feed.forEach((item) => {
      const listItem = document.createElement('li')
      listItem.textContent = item.url
      feedList.appendChild(listItem)
    })
    container.appendChild(feedList)
  }

}
export {renderState}