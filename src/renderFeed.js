import i18nextInstance from './i18next.js'
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
export default renderFeed