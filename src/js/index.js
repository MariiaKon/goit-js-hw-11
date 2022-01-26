import '../css/styles.css';
import Notiflix from 'notiflix';
import imageTpl from '../templates/imageTpl.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages, resetPage, page } from './fetch.js';

const gallery = document.querySelector('.gallery');
const searchBox = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more-btn');
let imgToFind = '';
let totalPages = 0;
let totalImagesPerReq = 0;
let images = [];
export const imageLimitPerLoad = 40;

searchBox.addEventListener('submit', e => {
  loadMoreBtn.classList.add('is-hidden');
  e.preventDefault();

  if (images.length > 0 && imgToFind !== searchBox.elements.searchQuery.value) {
    clearGallery();
    resetPage();
  }

  imgToFind = searchBox.elements.searchQuery.value;

  fetchImages(imgToFind)
    .then(imgArr => {
      totalImagesPerReq = imgArr.totalHits;
      totalPages = totalImagesPerReq / imageLimitPerLoad;
      if (totalImagesPerReq === 0) {
        throw new Error();
      } else if (totalPages <= 1) {
        notifySuccsess(totalImagesPerReq);
        createGallery(imgArr.hits);
      } else {
        notifySuccsess(totalImagesPerReq);
        createGallery(imgArr.hits);
        loadMoreBtn.classList.remove('is-hidden');
      }
      images = document.querySelectorAll('a');
      return imgToFind, images, totalPages;
    })
    .catch(error);
});

gallery.addEventListener('click', e => {
  e.preventDefault();

  const lightbox = new SimpleLightbox('.gallery a');

  lightbox.on('show.simplelightbox', e => {
    lightbox.refresh();
  });
});

loadMoreBtn.addEventListener('click', () => {
  fetchImages(imgToFind)
    .then(imgArr => {
      createGallery(imgArr.hits);

      if (Math.ceil(page) > Math.ceil(totalPages)) {
        loadMoreBtn.classList.add('is-hidden');
        notifyRunOutOfPictures();
      }
    })
    .catch(error);
});

function notifySuccsess(qty) {
  const successMsg = `Hooray! We found ${qty} Images`;
  Notiflix.Notify.success(successMsg);
}

function notifyRunOutOfPictures() {
  const infoMsg = "We're sorry, but you've reached the end of search results.";
  Notiflix.Notify.info(infoMsg);
}

function error() {
  const errorMsg = 'Sorry, there are no images matching your search query. Please try again.';
  Notiflix.Notify.failure(errorMsg);
  clearGallery();
}

function createGallery(info) {
  const markup = imageTpl(info);
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
}
