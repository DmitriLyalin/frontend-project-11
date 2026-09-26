import i18nextInstance from './i18next.js'
// импортируем svg иконку закрытия модального окна
import closeIconRaw from './assets/closeBtn.svg?raw'

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
  dialogDescription.textContent = activePost.postDescription
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
export default renderModal