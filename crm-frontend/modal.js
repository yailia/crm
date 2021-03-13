/* eslint-disable no-unused-expressions */
import { createEl, createSelect } from './elems.js'
import { showBtnSpinner, hideBtnSpinner } from './spinner.js'
import { createTable } from './table.js'

function fetchErr () {
  const btn = document.querySelector('.modal__main-btn');
  const p = createEl('p', ['alert', 'fetch__alert']);
  p.textContent = 'Что-то пошло не так. Попробйте заново';
  btn.before(p);
}

function removeFetchErr () {
  const p = document.querySelector('.fetch__alert');
  if (p) p.remove();
}

export function formModalCreateOnClick (click, id) {
  const isNewBtn = click.target.classList.contains('main__submit-btn')
  const modalEl = document.createElement('div');
  const disEllement = document.querySelector('.main__submit-btn')
  const modalOverlayEl = document.createElement('div');
  modalEl.classList.add('modal');
  modalOverlayEl.classList.add('main__overlay')
  const removeModalOnClick = () => {
    modalEl.remove();
    modalOverlayEl.remove();
    disEllement.removeAttribute('disabled');
  }

  const closeBtnEl = document.createElement('button');
  const body = document.body;
  closeBtnEl.classList.add('modal__close-btn');
  modalEl.append(closeBtnEl)
  closeBtnEl.addEventListener('click', removeModalOnClick);
  body.prepend(modalEl);
  body.prepend(modalOverlayEl);
  createClientForm(modalEl, isNewBtn, id);
}

function addClietFormCreate () {
  const mainEl = document.querySelector('.main')
  const addClientBtnEl = document.createElement('button');
  addClientBtnEl.classList.add('main__submit-btn');
  addClientBtnEl.textContent = 'Добавить клиента';
  mainEl.append(addClientBtnEl);
  addClientBtnEl.addEventListener('click', e => {
    const id = 0;
    addClientBtnEl.setAttribute('disabled', 'disabled')
    formModalCreateOnClick(e, id)
  })
}

function deleteModal () {
  const addBtn = document.querySelector('.main__submit-btn');
  const modalEl = document.querySelector('.modal');
  const overlayEl = document.querySelector('.main__overlay');
  addBtn.removeAttribute('disabled')
  modalEl.remove();
  overlayEl.remove();
}

export function modalDelOnClick () {
  const disabledElements = document.querySelectorAll('button')
  for (const el of disabledElements) el.removeAttribute('disabled')
  deleteModal();
}

export function deleteClientByDel (id) {
  const modal = createEl('div', ['modal', 'modal--del']);
  const overlay = createEl('div', 'main__overlay');
  const spinBtnEl = createEl('span', ['main-btn__spinner', 'closed']);
  const closeBtnEl = createEl('button', 'modal__close-btn')
  closeBtnEl.addEventListener('click', modalDelOnClick);
  modal.append(closeBtnEl)
  const title = createEl('h2', 'title');
  title.textContent = 'Удалить клиента';
  const desc = createEl('p', 'description');
  desc.textContent = 'Вы действительно хотите удалить данного клиента?'
  const yesBtn = createEl('button', 'main-btn');
  yesBtn.textContent = 'Удалить';
  yesBtn.append(spinBtnEl)
  yesBtn.addEventListener('click', () => {
    showBtnSpinner();
    fetch('http://localhost:3000/api/clients/' + id, { method: 'DELETE' })
      .then(r => {
        deleteModal();
        createTable();
      }
      )
      .catch(() => {
        fetchErr();
      })
  })
  const noBtn = createEl('button', 'modal__outline-btn')
  noBtn.textContent = 'Отмена'
  noBtn.addEventListener('click', modalDelOnClick)

  modal.append(...[
    title,
    desc,
    yesBtn,
    noBtn
  ])
  document.body.prepend(...[modal, overlay])
}

function createExistingContactsSection (array) {
  function addRusProp (obj) {
    if (obj.type === 'phone') {
      obj.rus = 'Телефон';
    }
    if (obj.type === 'vk') {
      obj.rus = 'Vk';
    }
    if (obj.type === 'other') {
      obj.rus = 'Доп. телефон';
    }
    if (obj.type === 'facebook') {
      obj.rus = 'Facebook';
    }
    return obj
  };

  const newArr = array.map(i => addRusProp(i))
  if (newArr) {
    const contactForm = document.querySelector('.contacts-form');
    for (const select of newArr) {
      const contactsWrpEl = createEl('div', 'contacts-form__input-wrp');
      const selectEl = createEl('select', 'contacts-form__select');
      const optionEl = createEl('option', 'option');
      optionEl.setAttribute('value', select.type);
      optionEl.textContent = select.rus;
      selectEl.append(optionEl)
      const inputEl = createEl('input', 'contacts-form__input');
      inputEl.setAttribute('required', 'required')
      inputEl.value = select.value;
      inputEl.setAttribute('placeholder', 'Введите данные контакта');
      const removeBtn = createEl('button', 'contacts-form__delete-btn');
      removeBtn.addEventListener('click', () => contactsWrpEl.remove())
      contactsWrpEl.append(
        ...[
          selectEl,
          inputEl,
          removeBtn
        ]
      );

      contactForm.append(contactsWrpEl)
    }
  }
}

async function createClientForm (modalEl, isNew, id) {
  function createLabel (labelName) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    label.classList.add('modal__label');
    input.classList.add('modal__input');
    const placeholderName = isNew ? labelName : '';
    input.setAttribute('placeholder', placeholderName);
    label.textContent = !isNew ? labelName : '';
    if (labelName !== 'Отчество') {
      input.setAttribute('required', 'required');
      input.onblur = function () {
        const inputAlert = createEl('p', 'alert');
        if (label.querySelector('p')) {
          label.querySelector('p').remove();
          input.classList.remove('alert');
        }
        if (input.value.trim().length === 0) {
          console.log(input.value.trim().length);
          input.classList.add('alert');
          input.value = '';

          inputAlert.textContent = 'Заполните обязательное поле';
          input.before(inputAlert);
        }
      };
    }
    label.append(input);
    return label;
  }
  function createAddContactFormOnClick (e) {
    if (document.querySelector('.alert')) document.querySelector('.alert').remove();
    e.preventDefault();
    const optionsArr = [
      {
        rus: 'Телефон',
        eng: 'phone'
      },
      {
        rus: 'Доп. телефон',
        eng: 'other'
      },
      {
        rus: 'Vk',
        eng: 'vk'
      },
      {
        rus: 'Facebook',
        eng: 'facebook'
      }
    ];
    const contactsWrpEl = createEl('div', 'contacts-form__input-wrp');
    const selectEl = createSelect('contacts-form__select', optionsArr);
    const inputEl = createEl('input', 'contacts-form__input');
    inputEl.setAttribute('required', 'required')
    inputEl.setAttribute('placeholder', 'Введите данные контакта');
    const removeBtn = createEl('button', 'contacts-form__delete-btn');
    removeBtn.addEventListener('click', () => {
      contactsWrpEl.remove();
      moreContactsBtnEl.removeAttribute('disabled');
      moreContactsBtnEl.classList.remove('disabled');
    });

    contactsWrpEl.append(
      ...[
        selectEl,
        inputEl,
        removeBtn
      ]
    );
    contactsFormEl.childNodes.length >= 1 ? moreContactsBtnEl.before(contactsWrpEl) : contactsFormEl.prepend(contactsWrpEl);
    if (contactsFormEl.childNodes.length > 10) {
      moreContactsBtnEl.setAttribute('disabled', 'disabled');
      moreContactsBtnEl.classList.add('disabled');
      const overContactAllert = createEl('p', 'alert');
      overContactAllert.textContent = 'Может быть только 10 контактов. Удалите лишний';
      moreContactsBtnEl.before(overContactAllert);
    }
    console.log(contactsFormEl.childNodes.length);
    selectEl.focus();
  }

  const backendClientChangesByMethod = () => {
    removeFetchErr();
    showBtnSpinner();
    const client = clientProps()
    fetch(host, {
      method: method,
      headers: { 'Content-Type': 'aplication/json' },
      body: JSON.stringify({
        name: client.name,
        surname: client.surname,
        lastName: client.patronymic,
        contacts: client.contacts
      })
    })
      .catch(() => {
        hideBtnSpinner();
        fetchErr();
      })
      .then(r => {
        r.json()
      })
      .then(d => {
        const data = d;
        hideBtnSpinner();
        deleteModal();
        createTable(data);
      })
  }

  const clientProps = () => {
    const arr = [];
    const client = {
      contacts: [
      ]
    }

    const firstToUpperCase = (str) => {
      const lowStr = str.toLowerCase()
      return lowStr[0].toUpperCase() + lowStr.slice(1)
    }

    client.surname = firstToUpperCase(surnameLabelEl.querySelector('.modal__input').value.toLowerCase());
    client.name = firstToUpperCase(nameLabelEl.querySelector('input').value.toLowerCase());
    client.patronymic = patronymicLabelEl.querySelector('.modal__input').value ? firstToUpperCase(patronymicLabelEl.querySelector('.modal__input').value.toLowerCase()) : '';

    const allSelects = contactsFormEl.querySelectorAll('select');
    const allInputs = contactsFormEl.querySelectorAll('input');
    for (const s of allSelects) arr.push(s.value)
    for (const i of allInputs) arr.push(i.value)
    for (let i = 0; arr.length / 2 > i; i++) {
      const n = arr.length / 2;
      const inp = arr[i];
      const val = arr[i + n];
      const obj = {
        type: inp,
        value: val
      }
      client.contacts.push(obj)
    };
    return client
  }

  const host = isNew ? 'http://localhost:3000/api/clients' : 'http://localhost:3000/api/clients/' + id;
  const method = isNew ? 'POST' : 'PATCH';
  const titleEl = createEl('h2', 'modal__title');
  titleEl.textContent = 'Новый клиент'
  const formEl = createEl('form', 'modal__form');
  const modalMainWrpEl = createEl('div', 'modal__main-wrp');
  const surnameLabelEl = createLabel('Фамилия*', isNew);
  const nameLabelEl = createLabel('Имя*', isNew);
  const patronymicLabelEl = createLabel('Отчество', isNew);
  const contactsFormEl = createEl('div', ['modal__more-contact-wrp', 'contacts-form']);
  const moreContactsBtnEl = createEl('button', 'modal__more-contact')
  formEl.setAttribute('method', 'POST');
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    backendClientChangesByMethod();
  })
  moreContactsBtnEl.textContent = 'Добавить контакт';
  moreContactsBtnEl.addEventListener('click', createAddContactFormOnClick);
  const mainBtnEl = createEl('button', ['modal__main-btn', 'main-btn']);
  mainBtnEl.textContent = 'Сохранить'
  const spinBtnEl = createEl('span', ['main-btn__spinner', 'closed']);
  const escBtn = createEl('button', 'modal__outline-btn');
  escBtn.textContent = 'Отмена';
  escBtn.addEventListener('click', modalDelOnClick);
  formEl.append(modalMainWrpEl);
  modalMainWrpEl.append(...[
    surnameLabelEl,
    nameLabelEl,
    patronymicLabelEl
  ]
  );
  contactsFormEl.append(moreContactsBtnEl);
  mainBtnEl.append(spinBtnEl);

  modalEl.append(
    ...[
      titleEl,
      formEl,
      escBtn
    ]
  )

  formEl.append(contactsFormEl)
  formEl.append(mainBtnEl)

  if (!isNew) {
    const responce = await fetch('http://localhost:3000/api/clients/' + id, { method: 'GET' });
    const data = await responce.json();
    titleEl.textContent = 'Изменить данные'
    const idEl = createEl('span', 'modal__id');
    idEl.textContent = data.id;
    titleEl.append(idEl);
    const surnameInput = surnameLabelEl.querySelector('input');
    const nameInput = nameLabelEl.querySelector('input');
    const patronymicInput = patronymicLabelEl.querySelector('input');
    surnameInput.value = data.surname;
    nameInput.value = data.name;
    patronymicInput.value = data.lastName;
    data.contacts.length > 0 ? createExistingContactsSection(data.contacts) : null;
    escBtn.before(mainBtnEl)
    mainBtnEl.addEventListener('click', () => {
      showBtnSpinner();
      backendClientChangesByMethod();
    });
  }
}

export { addClietFormCreate }
