import i18nextInstance from './i18next.js'

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
export default renderPosts