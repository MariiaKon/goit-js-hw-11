import '../css/styles.css';
import Notiflix from 'notiflix';
import imageTpl from '../templates/imageTpl.hbs';
import simpleLightbox from 'simplelightbox';
import '../../node_modules/simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '25393494-37d8dd7e72c61fe26f3c6ef73';
const gallery = document.querySelector('.gallery');
const searchBox = document.querySelector('#search-form');
let imgToFind = '';
let openModal = null;

gallery.addEventListener('click', openModal);
searchBox.addEventListener('submit', e => {
  e.preventDefault();

  imgToFind = searchBox.elements.searchQuery.value;
  fetchImages(imgToFind)
    .then(imgArr => {
      if (imgArr.totalHits === 0) {
        throw new Error();
      }
      notify(imgArr.totalHits);
      createGallery(imgArr.hits);
    })
    .catch(error);
});

async function fetchImages(keyWord) {
  const searchFilter = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page';
  let page = 1;
  const response = await fetch(`${BASE_URL}?key=${KEY}&q=${keyWord}&${searchFilter}${page}`);
  const imgArray = await response.json();
  return imgArray;
}

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
  gallery.innerHTML = markup;
}

function clearGallery() {
  gallery.innerHTML = '';
}

openModal = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
