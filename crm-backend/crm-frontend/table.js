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
    data.then(d => tableBuild(d));
    return
  }
  clearNodeChilds(tBodyEl);
  clearTimeout(timerID)
  timerID = setTimeout(() => {
    data.then(d => {
      const findedClients = d.filter(i => {
      return i.contacts.some(j => j.value.toLowerCase().includes(value)) ||
        i.name.toLowerCase().includes(value) ||
        i.surname.toLowerCase().includes(value) ||
        i.lastName.toLowerCase().includes(value);
    });
    tableBuild(findedClients);
    return findedClients;
    }) 
  }, timer)
}

function tableBuild (data) {
  // console.log(data)
  clearNodeChilds(tBodyEl)

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
    });
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
  tableBuild(sortedData)
  return sortedData;
}

function rotateSortArrow (elem) {
  if (elem.tagName !== 'BUTTON') return;
  elem.classList.toggle('rotate')
  if (elem.classList.contains('table__arrow-btn--letters')) elem.classList.contains('rotate') ? sortLetters.textContent = 'Я-А' : sortLetters.textContent = 'А-Я';
  else sortLetters.textContent = 'А-Я';
  sortBtnsArr.forEach(i => {
    if (i !== elem) {
      i.classList.remove('rotate');
    }
  });
  return (elem.classList.contains('js-id'))
    ? 'id'
    : (elem.classList.contains('js-surname'))
        ? 'surname'
        : (elem.classList.contains('js-createdAt'))
            ? 'createdAt'
            : 'updatedAt'
}

function sort (e, data) {
  data.then(d => {
    console.log(d)
  const key = rotateSortArrow(e.target);
  sorting(d, key)
  })
}

let data;

export function createTable () {
  clearNodeChilds(tBodyEl)
  showSpinner();
  let data = fetch('http://localhost:3000/api/clients').then(r => r.json())
  // Стартовая сортировка по id
  data.then(d => {
    sorting(d, 'id');
    hideSpinner();
  });

    document.querySelector('.table__thead').addEventListener('click', (e) => sort(e, data));

  inputEl.oninput = () => {
    const searchValue = inputEl.value;
    data = searchOninput(searchValue.toLowerCase().trim(), data, searchTimer);
    console.log()
  };




  return data;

  
  
  
  
  
  
  // data.then((z) => console.log(z))
  // sorting(data.then(r => r = data), 'id')
  //       // 

  // console.log('Должен быть промис', data.then(a => console.log(a)))
  //     .catch(err => {
  //       hideSpinner()
  //       console.log(err)
  //     })
  // } else {
  //   hideSpinner();
  //   tableBuild(clients)
  // }
}
