// функция парсинга RSS
const parseRss = (rss) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rss, "application/xml");
  if (doc.querySelector('parsererror')) {
    throw new Error('invalidRss')
  }

  else {
    // получение данных из RSS
    const channelTitle = doc.querySelector('channel > title').textContent
    const channelDescription = doc.querySelector('channel > description').textContent
    const posts = doc.querySelectorAll('item')
    const links = [...posts].map((post) => {
      // получение данных из каждого поста
      const postTitle = post.querySelector('title').textContent
      const postLink = post.querySelector('link').textContent
      const postDescription = post.querySelector('description').textContent
      return { postTitle, postLink, postDescription }
    })

    return { channelTitle, channelDescription, links }
  }

}
export default parseRss