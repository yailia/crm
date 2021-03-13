import { createEl, clearNodeChilds } from './elems.js'
import { hideSpinner, showSpinner } from './spinner.js'
import { deleteClientByDel, formModalCreateOnClick } from './modal.js'

const tBodyEl = document.querySelector('.table__tbody');
const idSortBtnEl = document.querySelector('.table__arrow-btn--id')
const nameSortBtnEl = document.querySelector('.table__arrow-btn--letters');
const createAtSortBtnEl = document.querySelector('.table__arrow-btn--create');
const changeAtSortBtnEl = document.querySelector('.table__arrow-btn--change');
const sortLetters = document.querySelector('.table__sort-letters');
const inputEl = document.querySelector('.header__input');
const sortBtnsArr = [
  idSortBtnEl,
  nameSortBtnEl,
  createAtSortBtnEl,
  changeAtSortBtnEl
]

let timerID = 0;
const searchTimer = 500;

function searchOninput (value, data, timer) {
  if (!value) {
    clearNodeChilds(tBodyEl);
    createTable();
    return
  }
  clearNodeChilds(tBodyEl);
  clearTimeout(timerID)
  timerID = setTimeout(() => {
    const findedClients = data.filter(i => {
      return i.contacts.some(j => j.value.toLowerCase().includes(value)) ||
        i.name.toLowerCase().includes(value) ||
        i.surname.toLowerCase().includes(value) ||
        i.lastName.toLowerCase().includes(value)
    });
    createTable(findedClients);
    sort(findedClients);
  }, timer)
}


function tableBuild (data) {
  console.log(data)

  const isPrefix = (value) => {
    if (value === 'phone' || value === 'other') return true;
    return false
  }

  for (const item of data) {
    const createdFullDate = new Date(item.createdAt)
    const createdTime = createdFullDate.toLocaleTimeString().slice(0, 5);
    const createdDate = `${createdFullDate.getDate()}.${'0' + (createdFullDate.getMonth() + 1)}.${createdFullDate.getFullYear()}`;
    const updatedFullDate = new Date(item.updatedAt)
    const updatedDate = `${updatedFullDate.getDate()}.${'0' + (updatedFullDate.getMonth() + 1)}.${updatedFullDate.getFullYear()}`;
    const updatedTime = updatedFullDate.toLocaleTimeString().slice(0, 5);
    const trEl = createEl('tr', 'table__tr');
    const tdId = createEl('td', ['table__td', 'table__td--id']);
    tdId.textContent = item.id;
    const tdName = createEl('td', 'table__td');
    tdName.textContent = `${item.surname} ${item.name} ${item.lastName}`
    const tdTime = createEl('td', ['table__td', 'table__td--time']);
    tdTime.textContent = createdDate;
    const timeSpan = createEl('span', 'table__time-span');
    timeSpan.textContent = createdTime
    tdTime.append(timeSpan);
    const tdTimeCh = createEl('td', ['table__td', 'table__td--time']);
    tdTimeCh.textContent = updatedDate
    const timeSpanCh = createEl('span', 'table__time-span');
    timeSpanCh.textContent = updatedTime
    tdTimeCh.append(timeSpanCh);
    const tdContacts = createEl('td', 'table__td');
    const contactsArr = item.contacts;
    contactsArr.forEach(i => {
      const tooltip = createEl('span', 'table__tooltip-wrp')
      const button = createEl('button', ['table__contact-badge', 'table__contact-badge--' + i.type])
      const text = createEl('div', 'table__tooltip')
      const link = createEl('a', 'table__tooltip-link');
      link.setAttribute('href', isPrefix(i.type) ? 'tel:+' + i.value : i.value);
      link.textContent = i.value;
      tooltip.append(button);
      text.append(link);
      tooltip.append(text);
      tdContacts.append(tooltip);
    })
    const id = item.id;
    const tdChange = createEl('td', ['table__td', 'table__td--action']);
    const changeBtn = createEl('button', ['table__action-btn', 'table__action-btn--change']);
    changeBtn.textContent = 'Изменить'
    tdChange.append(changeBtn)
    tdChange.addEventListener('click', e => {
      formModalCreateOnClick(e, id)
    });
    const tdDel = createEl('td', ['table__td', 'table__td--action']);
    const delBtn = createEl('button', ['table__action-btn', 'table__action-btn--remove']);
    delBtn.textContent = 'Удалить'
    tdDel.append(delBtn)
    tdDel.addEventListener('click', () => deleteClientByDel(id));

    trEl.append(...[
      tdId,
      tdName,
      tdTime,
      tdTimeCh,
      tdContacts,
      tdChange,
      tdDel
    ])
    tBodyEl.append(trEl)
  };
}

let click = 1
function sorting (data, key) {
  click++
  const sortedData = click % 2 === 0
    ? [...data].sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0
      })
    : [...data].sort((a, b) => {
        if (a[key] > b[key]) return -1;
        if (a[key] < b[key]) return 1;
        return 0
      });
  createTable(sortedData)
}

function rotateSortArrow (btn, key, data) {
  btn.classList.toggle('rotate')
  if (key === 'surname') btn.classList.contains('rotate') ? sortLetters.textContent = 'Я-А' : sortLetters.textContent = 'А-Я';
  else sortLetters.textContent = 'А-Я';
  sortBtnsArr.forEach(i => {
    if (i !== btn) {
      i.classList.remove('rotate');
    }
  });
  sorting(data, key);
  btn.removeEventListener('click', () => rotateSortArrow(idSortBtnEl, 'id', data))
}

export function sort (data) {
  idSortBtnEl.addEventListener('click', () => rotateSortArrow(idSortBtnEl, 'id', data))
  nameSortBtnEl.addEventListener('click', () => rotateSortArrow(nameSortBtnEl, 'surname', data))
  createAtSortBtnEl.addEventListener('click', () => rotateSortArrow(createAtSortBtnEl, 'createdAt', data))
  changeAtSortBtnEl.addEventListener('click', () => rotateSortArrow(changeAtSortBtnEl, 'updatedAt', data))
}

// export function removeSort (data) {
//   console.log(1)
//   idSortBtnEl.removeEventListener('click', () => rotateSortArrow(idSortBtnEl, 'id', data))
//   nameSortBtnEl.removeEventListener('click', () => rotateSortArrow(nameSortBtnEl, 'surname', data))
//   createAtSortBtnEl.removeEventListener('click', () => rotateSortArrow(createAtSortBtnEl, 'createdAt', data))
//   changeAtSortBtnEl.removeEventListener('click', () => rotateSortArrow(changeAtSortBtnEl, 'updatedAt', data))
// }

export function createTable (clients) {
  clearNodeChilds(tBodyEl)
  showSpinner();
  if (!clients) {
    fetch('http://localhost:3000/api/clients')
      .then(r => r.json())
      .then(data => {
        hideSpinner()
        tableBuild(data)
        // removeSort(data)
        sort(data);
        sorting(data, 'id');
        inputEl.oninput = () => {
          const searchValue = inputEl.value;
          searchOninput(searchValue.toLowerCase().trim(), data, searchTimer)
        };
      })
      .catch(err => {
        hideSpinner()
        console.log(err)
      })
  } else {
    hideSpinner();
    tableBuild(clients)
  }
}
