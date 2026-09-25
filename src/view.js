import i18nextInstance from './i18next.js'
// импортируем svg иконку закрытия модального окна
import closeIconRaw from './assets/closeBtn.svg?raw'
//функция рендера постов
const renderPosts = (postsContainer, state) => {
  postsContainer.innerHTML = ''
  postsContainer.classList.add('border', 'border-gray-300', 'mb-4')
  // создание заголовка и списка постов
  const postContainerTitle = document.createElement('h2')
  postContainerTitle.textContent = i18nextInstance.t(($) => $.ui.postsSection)
  postContainerTitle.classList.add('text-black', 'text-2xl', 'max-md:text-xl', 'font-bold', 'mb-2', 'px-2')
  const postList = document.createElement('ul')
  // рендеринг постов
  state.posts.forEach((post) => {
    const postItem = document.createElement('li')
    postItem.classList.add('flex', 'justify-between', 'border-b-1', 'border-gray-300', 'items-center')
    const postLink = document.createElement('a')
    postLink.setAttribute('href', `${post.postUrl}`)
    // добавление атрибута data-seen и класса для поста
    postLink.dataset.seen = 'false'
    postLink.classList.add('font-bold', 'text-cyan-500', 'px-4')
    // проверка, был ли пост просмотрен
    if (post.isSeen) {
      postLink.dataset.seen = 'true'
      postLink.classList.add('text-gray-300')
      postLink.classList.remove('font-bold')
    }
    postLink.textContent = post.title
    // создание кнопки просмотра поста
    const viewButton = document.createElement('button')
    viewButton.classList.add('border', 'border-cyan-500', 'my-2', 'mx-4', 'px-2', 'py-1', 'rounded', 'text-cyan-500', 'cursor-pointer')
    viewButton.textContent = i18nextInstance.t(($) => $.ui.buttons.view)

    postItem.append(postLink, viewButton)

    postList.appendChild(postItem)

  })
  postsContainer.append(postContainerTitle, postList)
}
// функция рендера фидов
const renderFeed = (feedContainer, state) => {
  feedContainer.innerHTML = ''
  feedContainer.classList.add('border', 'border-gray-300', 'mb-4')
  const feedContainerTitle = document.createElement('h2')
  feedContainerTitle.textContent = i18nextInstance.t(($) => $.ui.feedSection)
  feedContainerTitle.classList.add('text-black', 'text-2xl', 'max-md:text-xl', 'font-bold', 'mb-2', 'px-2')
  const feedList = document.createElement('ul')
  // рендеринг фидов
  state.feed.forEach((item) => {
    const listItem = document.createElement('li')
    listItem.classList.add('border-b-1', 'border-gray-300', 'text-sm', 'mb-2', 'py-2')
    const feedTitle = document.createElement('h3')
    feedTitle.classList.add('text-black', 'font-bold', 'mb-1', 'px-2')
    feedTitle.textContent = item.title
    const feedDescription = document.createElement('p')
    feedDescription.classList.add('px-2')
    feedDescription.textContent = item.description
    listItem.append(feedTitle, feedDescription)
    feedList.appendChild(listItem)
  })

  feedContainer.append(feedContainerTitle, feedList)
}
// функция рендера сообщений об ошибках и успешных действиях
const renderMessage = (messageContainer, state) => {
  // удаление предыдущего сообщения и окрашивание инпута в красный цвет при ошибке
  const inputElement = messageContainer.querySelector('input')
  inputElement.classList.remove('ring-2', 'ring-red-500')
  const messageElement = document.createElement('div')
  messageElement.classList.add('text-sm', 'mt-2')
  messageElement.setAttribute('id', 'message')
  // отображение сообщения об ошибке или успешном действии
  const { error,status } = state
  messageElement.textContent = status === 'error'
    ? i18nextInstance.t(error.message)
    : i18nextInstance.t(($) => $.valid);
  if (status === 'error') {
    messageElement.classList.add('text-red-500')
    inputElement.classList.add('ring-2', 'ring-red-500')
  }

  else {
    inputElement.value = ''
    inputElement.focus()
    messageElement.classList.add('text-green-500')
  }
  // удаление предыдущего сообщения и добавление нового
  messageContainer.querySelector('#message')?.remove()
  messageContainer.append(messageElement)
}

// функция рендера модального окна
const renderModal = (container, activePost) => {
  // удаление предыдущего модального окна
  if (!activePost) return
  else { 
    container.querySelector('dialog')?.remove()
  const dialogWindow = document.createElement('dialog')
 dialogWindow.classList.add('fixed', 'inset-0', 'm-auto', 'gap-2', 'border', 'py-4', 'border-black-500', 'rounded-lg')


  const dialogContent = document.createElement('div')
  const dialogHeader = document.createElement('div')
  dialogHeader.classList.add('flex', 'justify-between', 'content-start', 'mb-2', 'pb-2', 'px-4')
  const dialogTitle = document.createElement('h3')
  dialogTitle.textContent = activePost.title
  dialogTitle.classList.add('font-bold', 'text-lg', 'mb-2')
  const xButton = document.createElement('button')
 
  xButton.classList.add('text-gray-500', 'cursor-pointer', 'font-semibold', 'text-lg', 'mb-2')
  // добавление svg иконки закрытия модального окна
  xButton.innerHTML = closeIconRaw
  xButton.dataset.role ='close-btn'
  
  dialogHeader.append(dialogTitle, xButton)
  // создание описания поста
  const dialogDescription = document.createElement('p')
  dialogDescription.textContent = i18nextInstance.t(($) => $.modalWindow.goal)
  dialogDescription.dataset.test = 'modal-body'
  dialogDescription.classList.add('border-y', 'border-gray-700', 'py-4', 'px-4', 'mb-2')

  // создание контейнера для кнопок
  const buttonsContainer = document.createElement('div')
  buttonsContainer.classList.add('flex', 'justify-end', 'gap-2', 'px-4')
  // создание кнопок просмотра и закрытия модального окна
  const modalViewButton = document.createElement('button')
  modalViewButton.classList.add('border', 'border-cyan-500', 'px-2', 'py-2', 'bg-blue-600', 'text-white', 'rounded', 'cursor-pointer')
  modalViewButton.textContent = i18nextInstance.t(($) => $.ui.buttons.readMore)
  // создание кнопки закрытия модального окна
  const closeModalButton = document.createElement('button')
  closeModalButton.dataset.role ='close-btn'
  closeModalButton.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'rounded', 'bg-gray-500', 'text-white', 'cursor-pointer')
  closeModalButton.textContent = i18nextInstance.t(($) => $.ui.buttons.close)
  buttonsContainer.append(modalViewButton, closeModalButton)
  dialogContent.append(dialogHeader, dialogDescription, buttonsContainer)
  dialogWindow.append(dialogContent)
  container.append(dialogWindow)
  dialogWindow.showModal()
  }
}

export { renderMessage, renderPosts, renderFeed, renderModal }