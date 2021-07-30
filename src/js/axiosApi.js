import axios from 'axios';
import refs from './refs.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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
let shownHits = 0;

// const params = `&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

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
          // return `<div class="photo-card"><img src=${photo.webformatURL} alt=${photo.tags} data-url=${photo.largeImageURL} loading="lazy" /><div class="info"><p class="info-item"><b>Likes</b><br />${photo.likes}</p><p class="info-item"><b>Views</b><br />${photo.views}</p><p class="info-item"><b>Comments</b><br />${photo.comments}</p><p class="info-item"><b>Downloads</b><br />${photo.downloads}</p></div></div>`;

          return `<a href=${photo.largeImageURL}><div class="photo-card"><img class="gallety-img" src=${photo.webformatURL} alt=${photo.tags} loading="lazy" /><div class="info"><p class="info-item"><b>Likes</b><br />${photo.likes}</p><p class="info-item"><b>Views</b><br />${photo.views}</p><p class="info-item"><b>Comments</b><br />${photo.comments}</p><p class="info-item"><b>Downloads</b><br />${photo.downloads}</p></div></div></a>`;
        })
        .join('');

      if (page === 1) {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }

      buttonMore.classList.remove('hidden');
      gallery.insertAdjacentHTML('beforeend', fechedPhotos);

      buttonMore.addEventListener('click', onLoadMore);

      // Вариант бесконечного скрола
      // window.addEventListener('scroll', () => {
      //   const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

      //   if (scrollTop + clientHeight > scrollHeight - 20) {
      //     onLoadMore();
      //   }
      // });

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

function onLoadMore(evt) {
  setPage();

  getImages();
}

function onModalopen(evt) {
  evt.preventDefault();

  if (!evt.target.classList.contains('gallety-img')) {
    return;
  }

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

  let idx = 0;

  imageGallery.forEach((photo, index) => {
    if (photo.dataset.url === imageInModal.src) {
      idx = index;
    }
  });

  if (evt.target.classList.contains('modal__arrow__left')) {
    if (idx === 0 || idx === imageGallery.length - 1) {
      return;
    }
    imageInModal.src = photosList[idx - 1].largeImageURL;
    console.log(imageInModal.src);
  } else {
    imageInModal.src = photosList[idx + 1].largeImageURL;
  }
}
