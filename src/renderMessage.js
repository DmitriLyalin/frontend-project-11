import i18nextInstance from './i18next.js'
const renderMessage = (messageContainer, state) => {
  // удаление предыдущего сообщения и окрашивание инпута в красный цвет при ошибке
  const inputElement = messageContainer.querySelector('input')
  inputElement.classList.remove('ring-2', 'ring-red-500')
  const messageElement = document.createElement('div')
  messageElement.classList.add('text-sm', 'mt-2')
  messageElement.setAttribute('id', 'message')
  // отображение сообщения об ошибке или успешном действии
  const { error,status } = state
if (status === 'error') {
  messageElement.textContent = i18nextInstance.t(error)
  messageElement.classList.add('text-red-500')
    inputElement.classList.add('ring-2', 'ring-red-500')
} else if (status === 'success') {
  messageElement.textContent = i18nextInstance.t(($) => $.valid)
   inputElement.value = ''
    inputElement.focus()
    messageElement.classList.add('text-green-500')
}
 else if (status === 'sending') {
  messageElement.textContent = i18nextInstance.t(($) => $.sending)
}
 
  // удаление предыдущего сообщения и добавление нового
  messageContainer.querySelector('#message')?.remove()
  messageContainer.append(messageElement)
}
export default renderMessage