import simpleLightbox from 'simplelightbox';
import '../../node_modules/simplelightbox/dist/simple-lightbox.min.css';

export let openModal;

openModal = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
