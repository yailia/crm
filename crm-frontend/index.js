import { createTable } from './table.js'
import { addClietFormCreate } from './modal.js'

function startApp () {
  document.addEventListener('DOMContentLoaded', () => {
    addClietFormCreate();
    createTable();
  })
}
startApp();
