import axios from 'axios';
import refs from './refs.js';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 1000;

const { form, input, button, buttonMore, gallery } = refs;
const baseUrl = 'https://pixabay.com/api/';
const apiKey = '?key=22659093-928fc585fa86297f1703a77f0';
const params = '&image_type=photo&orientation=horizontal&safesearch=true';

let page = 1;
let query = '';
let photos = [];
const per_page = '&per_page=40';

form.addEventListener('submit', evt => {
  evt.preventDefault();
  gallery.innerHTML = '';
  query = input.value;
  getImages();
  form.reset();
  buttonMore.classList.remove('hidden');
});

async function getImages() {
  let url = baseUrl + apiKey + `&q=${query}` + params + `&page=${page}` + per_page;
  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.hits.length !== 0) {
      photos = data.hits;
    }
    const fechedPhotos = photos
      .map(photo => {
        return `<div class="photo-card"><img src=${photo.webformatURL} alt=${photo.tags} loading="lazy" /><div class="info"><p class="info-item"><b>Likes</b><br />${photo.likes}</p><p class="info-item"><b>Views</b><br />${photo.views}</p><p class="info-item"><b>Comments</b><br />${photo.comments}</p><p class="info-item"><b>Downloads</b><br />${photo.downloads}</p></div></div>`;
      })
      .join('');
    gallery.insertAdjacentHTML('beforeend', fechedPhotos);
    buttonMore.addEventListener('click', onLoadMore);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

function onLoadMore() {
  page += 1;

  getImages();
}
