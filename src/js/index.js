import '../css/styles.css';
import Notiflix from 'notiflix';
import imageTpl from '../templates/imageTpl.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages, resetPage } from './fetch.js';

const gallery = document.querySelector('.gallery');
const searchBox = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more-btn');
let imgToFind = '';
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
      if (totalImagesPerReq === 0) {
        throw new Error();
      } else if (totalImagesPerReq <= imageLimitPerLoad) {
        notify(totalImagesPerReq);
        createGallery(imgArr.hits);
      } else {
        notify(totalImagesPerReq);
        createGallery(imgArr.hits);
        loadMoreBtn.classList.remove('is-hidden');
      }
      images = document.querySelectorAll('a');
      return imgToFind, images;
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
    })
    .catch(error);
});

function notify(qty) {
  const successMsg = `Hooray! We found ${qty} Images`;
  Notiflix.Notify.success(successMsg);
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
