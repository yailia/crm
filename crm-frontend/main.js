(() => {

  // (() => {
  //   const tbodyEl = document.querySelector('.table__tbody');
  //   const tableModalEl = document.querySelector('.js_table-modal');
  //   const tableModalSpiner = document.querySelector('.js_table-spiner');
  //   const modalElemArr = [tableModalEl, tableModalSpiner];    
  //   document.addEventListener('DOMContentLoaded', ()=> {
  //   tbodyEl.children.length ? modalElemArr.forEach(i => i.classList.add('closed')) : modalElemArr.forEach(i => i.classList.remove('closed'));
  //   });

  // })()

  const createEl = (el, nameOfCl) => {
    const element = document.createElement(el);
    if (typeof (nameOfCl) !== 'object')
      element.classList.add(nameOfCl);
    else
      for (classEl of nameOfCl)
        element.classList.add(classEl);
    return element;
  }

  function createClientForm (modalEl, isNew) {
    const createLabel = (labelName) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      label.classList.add('modal__label');
      input.classList.add('modal__input');
      const placeholderName = isNew ? labelName : '';
      input.setAttribute('placeholder', placeholderName)
      label.textContent = !isNew ? labelName : '';
      label.append(input);
      return label
    }
    const createSelect = (className, valueNamesArr) => {
      const select = createEl('select', className);
      for (valName of valueNamesArr) {
        const option = createEl('option', 'option');
        option.setAttribute('value', valName);
        option.textContent = valName;
        select.append(option)
      }
      return select
    }
    const addMoreContactsSection = (e) => {
      e.preventDefault();
      const optionsArr = [
        'Телефон',
        'Доп. телефон',
        'Vk',
        'Facebook'
      ]
      const contactsWrpEl = createEl('div', 'contacts-form__input-wrp');
      const selectEl = createSelect ('contacts-form__select', optionsArr);
      const inputEl = createEl('input', 'contacts-form__input');
      inputEl.setAttribute('placeholder', 'Введите данные контакта');
      const removeBtn = createEl('button', 'contacts-form__delete-btn');
      removeBtn.addEventListener('click', () => contactsWrpEl.remove() )
      
      contactsWrpEl.append(
        ...[
          selectEl,
          inputEl,
          removeBtn
        ]
      )
      contactsFormEl.prepend(contactsWrpEl)


    }
    const titleEl = createEl('h2', 'modal__title');
    titleEl.textContent = isNew ? 'Новый клиент' : 'Изменить данные';
    const idEl = createEl('span', 'modal__id');
    const formEl = createEl('form', 'modal__form');
    formEl.setAttribute('method', 'POST');
    formEl.addEventListener('submit', createNewClientOnSubmit)
    const modalMainWrpEl = createEl('div', 'modal__main-wrp');
    const surnameLabelEl = createLabel ('Фамилия*', isNew);
    const nameLabelEl = createLabel ('Имя*', isNew);
    const patronymicLabelEl = createLabel ('Отчество', isNew);
    const contactsFormEl = createEl('div', ['modal__more-contact-wrp', 'contacts-form']);
    const moreContactsBtnEl = createEl('button', 'modal__more-contact')
    moreContactsBtnEl.textContent = 'Добавить контакт';
    moreContactsBtnEl.addEventListener('click', addMoreContactsSection);
    const mainBtnEl = createEl('button', ['modal__main-btn', 'main-btn']);
    mainBtnEl.textContent = 'Сохранить'
    const spinBtnEl = createEl('span', ['main-btn__spinner', 'closed']);
    const escBtn = createEl('button', 'modal__outline-btn')
    escBtn.textContent = 'Отмена'

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
      ]
    )

    formEl.append(...[
      contactsFormEl,
      mainBtnEl,
      escBtn
    ])

      
      async function createNewClientOnSubmit (e) {
        e.preventDefault();
        const arr = [];
        const client = {
          contacts: {
          }
        }
        client.surname = surnameLabelEl.querySelector('.modal__input').value;
        client.name = nameLabelEl.querySelector('input').value;
        client.patronymic = patronymicLabelEl.querySelector('input').value;
        const allSelects = contactsFormEl.querySelectorAll('select');
        const allInputs = contactsFormEl.querySelectorAll('input');
        for (s of allSelects) arr.push(s.value)
        for (i of allInputs) arr.push(i.value)
        for (let i = 0; arr.length/2 > i ; i++) {
          const n = arr.length/2;
          const inp = arr[i];
          const val = arr[i + n];
          client.contacts[inp] = val
        };
    
        const responce = await fetch ('http://localhost:3000/api/clients', {
          method: 'POST',
          headers: {'Content-Type': 'aplication/json'},
          body: JSON.stringify({
            name: client.name,
            surname: client.surname,
            lastName: client.patronymic,
            contacts: [client.contacts],
          }) 
        })
      }

  }


  function formModalCreateOnClick (click) {
      const isNewBtn = click.target.classList.contains('main__submit-btn')
      const modalEl = document.createElement('div');
      const disEllement = document.querySelector('.main__submit-btn')
      const modalOverlayEl = document.createElement('div');
      modalEl.classList.add('modal');
      modalOverlayEl.classList.add('main__overlay')
      const removeModalOnClick = () => {
            modalEl.remove();
            modalOverlayEl.remove();
            disEllement.removeAttribute('disabled')
      }

      const closeBtnEl = document.createElement('button');
      closeBtnEl.classList.add('modal__close-btn');
      modalEl.append(closeBtnEl)
      closeBtnEl.addEventListener('click', removeModalOnClick);
      document.body.prepend(modalEl), 
      document.body.prepend(modalOverlayEl);
      createClientForm(modalEl, isNewBtn);
  }

  function addClietFormCreate () {

    const mainEl = document.querySelector('.main')
    const addClientBtnEl = document.createElement('button');
    addClientBtnEl.classList.add('main__submit-btn');
    addClientBtnEl.textContent = 'Добавить клиента';
    mainEl.append(addClientBtnEl);
    addClientBtnEl.addEventListener('click', e => {
      addClientBtnEl.setAttribute('disabled', 'disabled')
      formModalCreateOnClick(e)
    })
  }


 async function createTable () {
   const responce = await fetch('http://localhost:3000/api/clients');
   const data = await responce.json();
   console.log (data)
   const tBodyEl = document.querySelector('tbody');
    for (item of data) {
      const trEl = createEl('tr', 'table__tr');
      // tBodyEl.append(trEl)
      const tdId = createEl('td',['table__td', 'table__td--id']);
      tdId.textContent = item.id;
      const tdName = createEl('td', 'table__td');
      tdName.textContent = item.name
      const tdTime = createEl('td',['table__td', 'table__td--time']);
      tdTime.textContent = item.date
      const timeSpan = createEl('span', 'table__time-span');
      timeSpan.textContent = item.time
      tdTime.append(timeSpan);
      const tdTimeCh = createEl('td',['table__td', 'table__td--time']);
      tdTimeCh.textContent = item.date
      const timeSpanCh = createEl('span', 'table__time-span');
      tdTimeCh.textContent = item.time
      tdTimeCh.append(timeSpanCh);
      const tdContacts = createEl('td', 'table__td');
      const contactsArr =  item.contacts;
      contactsArr.forEach(i => {
          const span = createEl('span', ['table__contact-badge'])
          tdContacts.append(span);
        })
        const tdChange = createEl('td',['table__td', 'table__td--action']);
        const changeBtn = createEl('button',['table__action-btn', 'table__action-btn--change']);
        changeBtn.textContent = 'Изменить'
        tdChange.append(changeBtn)
        const tdDel = createEl('td',['table__td', 'table__td--action']);
        const delBtn = createEl('button',['table__action-btn', 'table__action-btn--remove']);
        delBtn.textContent = 'Удалить'
        tdDel.append(delBtn)


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
    }
  }
  addClietFormCreate();
  createTable();


})()