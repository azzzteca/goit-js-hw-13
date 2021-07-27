import axios from 'axios';
import refs from './refs.js';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 1000;

const { input, button, buttonMore, gallery } = refs;
const baseUrl = 'https://pixabay.com/api/';
const apiKey = '?key=22659093-928fc585fa86297f1703a77f0';
const params = '&image_type=photo&orientation=horizontal&safesearch=true';

// const myUrl = baseUrl + apiKey + `&q=${evt}` + params;

input.addEventListener('input', debounce(getImages, DEBOUNCE_DELAY));

function getImages(evt) {
  console.log(evt.target.value);
  axios
    .get(baseUrl + apiKey + `&q=${evt.target.value}` + params)
    .then(response => {
      return response.data;
    })
    .then(data => {
      if (data.hits.length !== 0) {
        return data.hits;
      }
    })
    .then(photos => {
      const fechedPhotos = photos
        .map(photo => {
          console.log(photo);
          return `<div class="photo-card"><div class="photo-thumb"><img src=${photo.webformatURL} alt=${photo.webformatURL} loading="lazy" /></div><div class="info"><p class="info-item"><b>Likes</b><br />${photo.likes}</p><p class="info-item"><b>Views</b><br />${photo.views}</p><p class="info-item"><b>Comments</b><br />${photo.comments}</p><p class="info-item"><b>Downloads</b><br />${photo.downloads}</p></div></div>`;
        })
        .join('');
      gallery.innerHTML = fechedPhotos;
    })
    .catch(() => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    });
}
