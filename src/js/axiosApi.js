import axios from 'axios';
import refs from './refs.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { infiniteScroll } from './infiniteScroll.js';

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
let galleryForSimpleLightBox;

form.addEventListener('submit', evt => {
  evt.preventDefault();
  gallery.innerHTML = '';
  // query = input.value;
  query = evt.target.elements.searchQuery.value;
  resetPage();
  getImages();

  form.reset();
});

function setPage() {
  return (page += 1);
}

function resetPage() {
  return (page = 1);
}

async function getImages() {
  let url =
    baseUrl +
    apiKey +
    `&q=${query}` +
    `&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;
  try {
    const response = await axios.get(url);

    const data = response.data;

    if (data.totalHits === 0) {
      throw new Error();
    }

    if (data.hits.length === 0) {
      buttonMore.classList.add('hidden');
      Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    } else {
      const cardsList = data.hits;
      photosList = [...photosList, ...cardsList];
      const fechedPhotos = cardsList
        .map(photo => {
          // Создание списка фото для модалки без использования библиотеки
          // return `<div class="photo-card"><img class="gallery-img" src=${photo.webformatURL} alt=${photo.tags} data-url=${photo.largeImageURL} loading="lazy" /><div class="info"><p class="info-item"><b>Likes</b><br />${photo.likes}</p><p class="info-item"><b>Views</b><br />${photo.views}</p><p class="info-item"><b>Comments</b><br />${photo.comments}</p><p class="info-item"><b>Downloads</b><br />${photo.downloads}</p></div></div>`;

          return `<a href=${photo.largeImageURL}><div class="photo-card"><img class="gallery-img" src=${photo.webformatURL} alt=${photo.tags} /><div class="info"><p class="info-item"><b>Likes</b><br />${photo.likes}</p><p class="info-item"><b>Views</b><br />${photo.views}</p><p class="info-item"><b>Comments</b><br />${photo.comments}</p><p class="info-item"><b>Downloads</b><br />${photo.downloads}</p></div></div></a>`;
        })
        .join('');

      if (page === 1) {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }

      // Для варианта бесконечного скролла закомментировать вниз
      buttonMore.classList.remove('hidden');
      buttonMore.addEventListener('click', onLoadMore);
      // Для варианта бесконечного скролла закомментировать вверх

      gallery.insertAdjacentHTML('beforeend', fechedPhotos);

      // Для варианта бесконечного скролла раскомментировать вниз
      // infiniteScroll();
      // Для варианта бесконечного скролла раскомментировать вверх

      galleryForSimpleLightBox = new SimpleLightbox('.gallery a');

      gallery.addEventListener('click', onModalopen);

      window.scrollBy({
        top: 0,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

export function onLoadMore(evt) {
  setPage();

  getImages();
}

// Вариант модалки без использования библиотеки
// function onModalopen(evt) {
//   evt.preventDefault();

//   if (!evt.target.classList.contains('gallery-img')) {
//     return;
//   }

//   modal.classList.add('is-open');

//   imageInModal.src = evt.target.dataset.url;
//   imageInModal.alt = evt.target.alt;

//   closeBtn.addEventListener('click', onModalClose);
//   modalOverlay.addEventListener('click', onModalClose);
//   arrowLeft.addEventListener('click', onChangePhoto);
//   arrowRight.addEventListener('click', onChangePhoto);
// }

// Использование для модалки библиотеки simplelightbox

function onModalopen(evt) {
  galleryForSimpleLightBox.on('shown.simplelightbox', function () {});
}

// При использовании библиотеки simplelightbox код ниже не нужен
// function onModalClose() {
//   modal.classList.remove('is-open');
//   imageInModal.src = '';
//   imageInModal.alt = '';
// }

// function onChangePhoto(evt) {
//   const imageGallery = gallery.querySelectorAll('img');

//   let idx = 0;

//   imageGallery.forEach((photo, index) => {
//     if (photo.dataset.url === imageInModal.src) {
//       idx = index;
//     }
//   });

//   if (evt.target.classList.contains('modal__arrow__left')) {
//     if (idx === 0 || idx === imageGallery.length - 1) {
//       return;
//     }
//     imageInModal.src = photosList[idx - 1].largeImageURL;
//     console.log(imageInModal.src);
//   } else {
//     imageInModal.src = photosList[idx + 1].largeImageURL;
//   }
// }
// При использовании библиотеки simplelightbox код выше не нужен
