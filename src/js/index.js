import '../css/styles.css';
import Notiflix from 'notiflix';
import imageTpl from '../templates/imageTpl.hbs';
import async from 'hbs/lib/async';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '25393494-37d8dd7e72c61fe26f3c6ef73';

const gallery = document.querySelector('.gallery');
const searchBox = document.querySelector('#search-form');
let imgToFind = '';

searchBox.addEventListener('submit', e => {
  e.preventDefault();
  imgToFind = searchBox.elements.searchQuery.value;
  fetchImages(imgToFind)
    .then(response => {
      return response.json();
    })
    .then(imgArr => {
      createImages(imgArr.hits);
    });
});

function error() {
  const errorMsg = 'Sorry, there are no images matching your search query. Please try again.';
  Notiflix.Notify.failure(errorMsg);
  clearGallery();
}

function createImages(info) {
  const markup = imageTpl(info);
  gallery.innerHTML = markup;
}

function clearGallery() {
  gallery.innerHTML = '';
}
async function fetchImages(keyWord) {
  const searchFilter = 'image_type=photo&orientation=horizontal&safesearch=true';
  return await fetch(`${BASE_URL}?key=${KEY}&q=${keyWord}&${searchFilter}`);
}
