
function hideSpinner () {
  const tableModalEl = document.querySelector('.js_table-modal');
  const tableModalSpiner = document.querySelector('.js_table-spiner');
  const modalElemArr = [tableModalEl, tableModalSpiner];
  modalElemArr.forEach(i => i.classList.add('closed'));
};

function showSpinner () {
  const tableModalEl = document.querySelector('.js_table-modal');
  const tableModalSpiner = document.querySelector('.js_table-spiner');
  const modalElemArr = [tableModalEl, tableModalSpiner];
  modalElemArr.forEach(i => i.classList.remove('closed'));
};

function showBtnSpinner () {
  const btnSpinner = document.querySelector('.main-btn__spinner')
  btnSpinner.classList.remove('closed')
};
function hideBtnSpinner () {
  const btnSpinner = document.querySelector('.main-btn__spinner')
  btnSpinner.classList.add('closed')
};

export { hideSpinner, showSpinner, showBtnSpinner, hideBtnSpinner };
