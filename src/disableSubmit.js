//отключение кнопки отправки формы
const disableSubmit = (form, formStatus) => {
  console.log(formStatus)
  const submitBtn = form.querySelector('input[type="submit"]')
  switch (formStatus.status) {
    case 'sending' :
    submitBtn.disabled = true
    submitBtn.classList.add('bg-gray-500', 'hover:bg-gray-500')
    break;
    case 'error' : 
    case 'success':
     submitBtn.disabled = false
     submitBtn.classList.remove('bg-gray-500', 'hover:bg-gray-500')
     break;
  }
}
export default disableSubmit