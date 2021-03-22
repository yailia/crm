import { createTable } from './table.js'
import { addClietFormCreate } from './modal.js'

function startApp () {
  document.addEventListener('DOMContentLoaded', () => {
    addClietFormCreate();
    const data = createTable();
    data.then(d => console.log(d))

// let a = fetch('http://localhost:3000/api/clients').then(r=> a = r.json())
// console.log(a)











  })
}
startApp();
