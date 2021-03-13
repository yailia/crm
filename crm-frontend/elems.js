
export function createEl (el, nameOfCl) {
  const element = document.createElement(el);
  if (typeof (nameOfCl) !== 'object') element.classList.add(nameOfCl);
  else {
    for (const classEl of nameOfCl) {
      element.classList.add(classEl);
    }
  }
  return element;
}

export function createSelect (className, valueNamesArr, id) {
  const select = createEl('select', className);
  for (const valName of valueNamesArr) {
    const option = createEl('option', valName.eng);
    option.setAttribute('value', valName.eng);
    option.textContent = valName.rus;
    select.append(option)
  }
  return select
}

export function clearNodeChilds (el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}
