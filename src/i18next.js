import i18n from 'i18next'
const i18nextInstance = i18n.createInstance();
   i18nextInstance.init({
    lng: 'ru',
    debug: true,
     resources : {
    ru: {
  translation: {
    errors: {
      invalidUrl: 'Ссылка должна быть валидным URL',
      emptyUrl: 'Не должно быть пустым',
      invalidRss: 'Ресурс не содержит валидный RSS',
      duplicateRss: 'RSS уже существует',
      networkError: 'Ошибка сети',
    },
    valid: 'RSS успешно загружен',
  },
    }
  }
});
export default i18nextInstance