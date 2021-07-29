import axios from 'axios';
import refs from './refs.js';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 1000;

const {
  form,
  input,
  buttonMore,
  gallery,
  modal,
  imageInModal,
  closeBtn,
  arrowLeft,
  arrowRight,
  modalOverlay,
} = refs;

const baseUrl = 'https://pixabay.com/api/';
const apiKey = '?key=22659093-928fc585fa86297f1703a77f0';
let page = 1;
const per_page = 40;
let query = '';
let photosList = [];
let totalHits = 0;

const params = `&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

form.addEventListener('submit', evt => {
  evt.preventDefault();
  gallery.innerHTML = '';
  // query = input.value;
  query = evt.target.elements.searchQuery.value;
  getImages();
});

async function getImages() {
  let url = baseUrl + apiKey + `&q=${query}` + params;
  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.hits.length === 0) {
      // totalHits = data.totalHits;
      // console.log(totalHits);

      throw new Error();
    }

    // console.log(data.hits);

    photosList = data.hits;
    const fechedPhotos = photosList
      .map(photo => {
        return `<div class="photo-card"><img src=${photo.webformatURL} alt=${photo.tags} data-url=${photo.largeImageURL} loading="lazy" /><div class="info"><p class="info-item"><b>Likes</b><br />${photo.likes}</p><p class="info-item"><b>Views</b><br />${photo.views}</p><p class="info-item"><b>Comments</b><br />${photo.comments}</p><p class="info-item"><b>Downloads</b><br />${photo.downloads}</p></div></div>`;
      })
      .join('');

    buttonMore.classList.remove('hidden');
    gallery.insertAdjacentHTML('beforeend', fechedPhotos);
    buttonMore.addEventListener('click', onLoadMore);
    gallery.addEventListener('click', onModalopen);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  form.reset();
}

function onLoadMore() {
  page += 1;

  getImages();
}

function onModalopen(evt) {
  evt.preventDefault();

  modal.classList.add('is-open');

  imageInModal.src = evt.target.dataset.url;
  imageInModal.alt = evt.target.alt;

  closeBtn.addEventListener('click', onModalClose);
  modalOverlay.addEventListener('click', onModalClose);
  arrowLeft.addEventListener('click', onChangePhoto);
  arrowRight.addEventListener('click', onChangePhoto);
}

function onModalClose() {
  modal.classList.remove('is-open');
  imageInModal.src = '';
  imageInModal.alt = '';
}

function onChangePhoto(evt) {
  const imageGallery = gallery.querySelectorAll('img');

  // console.log(imageGallery[4].dataset.url);

  // console.log(imageInModal.src);
  let idx = 0;

  console.log(photosList);

  imageGallery.forEach((photo, index) => {
    if (photo.dataset.url === imageInModal.src) {
      idx = index;
    }
  });

  console.log(idx);

  console.log(evt.target.classList);

  if (evt.target.classList.contains('modal__arrow__left')) {
    console.log('двигаемся влево');
    imageInModal.src = photosList[idx - 1].largeImageURL;
    // imageInModal.alt = evt.target.alt;
  } else {
    console.log('двигаемся вправо');
    imageInModal.src = photosList[idx + 1].largeImageURL;
  }

  // console.log(evt.target.src);
  // console.log(evt.target.dataset.url);

  // for (let i = 0; i < photos.length; i += 1) {

  //   if(photos[i].dataset.url === evt.target.)

  // }

  // console.log(evt.target.classList);
  // if (evt.target.classList.contains('modal__arrow__right')) {
  //   console.log('Меняем фото вправо');
  //   return;
  // } else {
  //   console.log('меняем фото влево');
  //   return;
  // }
}
