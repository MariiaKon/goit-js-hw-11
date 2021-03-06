import { imageLimitPerLoad } from './index.js';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '25393494-37d8dd7e72c61fe26f3c6ef73';
export let page = 1;

export async function fetchImages(keyWord) {
  const searchFilter = `image_type=photo&orientation=horizontal&safesearch=true&per_page=${imageLimitPerLoad}&page=`;
  const response = await fetch(`${BASE_URL}?key=${KEY}&q=${keyWord}&${searchFilter}${page}`);
  const imgArray = await response.json();
  page += 1;

  return imgArray;
}

export function resetPage() {
  if (page > 1) {
    page = 1;
  }
}
