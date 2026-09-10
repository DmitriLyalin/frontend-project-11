import i18nextInstance from './i18next.js'


const renderState = (formContainer, feedContainer,postsContainer, state, inputUrl) => {

  inputUrl.classList.remove('border-red-500')

  const messageElement = document.createElement('div')
  messageElement.classList.add('text-sm', 'mt-2')
  messageElement.setAttribute('id', 'message')
  const { feed, error, posts } = state
  messageElement.textContent = error 
    ? i18nextInstance.t(error)
    : i18nextInstance.t(($) => $.valid);
  if (error) {
    inputUrl.classList.add('border-red-500')
    messageElement.classList.add('text-red-500')
  }

  else  {
    document.querySelector('#posts').classList.add('border', 'border-gray-300', 'p-4', 'mb-4')
     messageElement.classList.add('text-green-500')
    feedContainer.innerHTML = ''
    // const postsContainer = document.createElement('div')
    inputUrl.focus()
    inputUrl.value = ''
    const feedList = document.createElement('ul')
    feed.forEach((item) => {
      const listItem = document.createElement('li')
      listItem.classList.add('border', 'border-gray-300', 'p-4', 'mb-4')
      const feedTitle = document.createElement('h3')
      feedTitle.textContent = item.title
      const feedDescription = document.createElement('p')
      feedDescription.textContent = item.description
      listItem.append(feedTitle, feedDescription)
      feedList.appendChild(listItem)

      const postList = document.createElement('ul')
      posts.forEach((post) => {
        const postItem = document.createElement('li')
        postItem.classList.add('flex', 'justify-between', 'border-b-1')
        const postLink = document.createElement('a')
        const viewButton = document.createElement('button')

        viewButton.textContent = i18nextInstance.t(($) => $.view)
        postLink.setAttribute('href', `${post.title}`)
        postLink.textContent = post.title
        postItem.append(postLink, viewButton)
        
        postList.appendChild(postItem)
        
      })
      postsContainer.appendChild(postList)
    })

    feedContainer.append(feedList)
  }
  formContainer.querySelector('#message')?.remove()
  formContainer.append(messageElement)
}
export { renderState }