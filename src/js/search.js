import debounce from 'lodash.debounce';
import config from '../config.json';
import { renderMarkup } from './main_content_render';
import { sendServerRequest } from './server_request';
import { renderListMarkup } from './country_list_render';
import { renderPagination } from './pagination_render';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const searchFieldEl = document.querySelector('#search');
const searchByCountryEl = document.querySelector('#country-search-input');
const containerEl = document.querySelector(".card")
const clearFilterBtn = document.querySelector('.header__logo');
const DEBOUNCE_DELAY = 300;

// ФУНКЦИЯ ПОИСКА ПО ЗАПРОСУ
export let country;
export let userQuery;
export const search = async function () {
  // БЕРЁМ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
  userQuery = searchFieldEl.value || '';
  // ОТПРАВЛЯЕМ ЗАПРОС НА СЕРВЕР (ДАННЫЕ ПОЛЬЗОВАТЕЛЯ В ПАРАМЕТРЕ)
  // sendServerRequest(userQuery, country);
  try {
    const reply = await sendServerRequest(userQuery, country);
    renderMarkup(reply);
    renderPagination(reply);
  } catch (error) {
    console.log(error);
    Notify.failure('Bad request');
  }
  //   ВЫЗЫВАЕМ ФУНКЦИЮ ОТРИСОВКИ РАЗМЕТКИ

  // return reply;
};

searchFieldEl.addEventListener('input', debounce(search, DEBOUNCE_DELAY));
// searchByCountryEl.addEventListener('click', debounce(showCountries, DEBOUNCE_DELAY));
renderListMarkup(config);

searchByCountryEl.addEventListener('change', e => {
  country = document.querySelector(`#country-search option[value="${e.target.value}"]`).textContent;
  search();
});

searchByCountryEl.addEventListener('click', e => {
  searchByCountryEl.value = '';
});


search();

async function clearFilter() {
  const serverResponse = await sendServerRequest()
  searchFieldEl.value = "";
  searchByCountryEl.value = "";
  containerEl.innerHTML = '';
  renderMarkup(serverResponse)
  renderPagination(serverResponse)
}
clearFilterBtn.addEventListener('click', clearFilter)