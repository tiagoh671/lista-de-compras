let lista = []

function renderList(itemList) {
  const container = createContainer(itemList.id)
  const itemName = createItemName(itemList.name)
  const divBt = divBtn()
  const editbt = editBtn(itemList)
  const delBtn = deleteBtn(itemList.id)

  divBt.append(editbt, delBtn)
  container.append(itemName, divBt)
  document.querySelector('#lista').append(container)
}

function alertaPositivo(){
  clearAlert()
  const span = document.createElement('p')
  span.classList.add('estiloPositivo')
  span.textContent = 'Item Adicionado Na Lista'

  document.querySelector('.alerta').append(span)
}

function alertaItemRemovido(){
  clearAlert()
  const span = document.createElement('p')
  span.classList.add('itemRemovido')
  span.textContent = 'Item Removido da Lista'

  document.querySelector('.alerta').append(span)
}

function alertaNegativo(){
  clearAlert()
  const span = document.createElement('p')
  span.classList.add('estiloNegativo')
  span.textContent = 'Por Favor, Insira um Valor Válido...'

  document.querySelector('.alerta').append(span)
}

function alertaEdição(){
  clearAlert()
  const span = document.createElement('p')
  span.classList.add('estiloEditado')
  span.textContent = 'Item Editado com Sucesso'

  document.querySelector('.alerta').append(span)
}

function clearAlert(){
  const span = document.querySelector('.alerta')
  while (span.firstChild) {
    span.removeChild(span.firstChild);
  }
}

function createContainer(id) {
  const container = document.createElement('div')
  container.classList.add('item')
  container.id = (`item-${id}`)

  return container
}

function createItemName(name) {
  const p = document.createElement('p')
  p.textContent = name

  return p
}

function divBtn() {
  const Div = document.createElement('div')
  return Div
}

function editBtn(item){
  const editBt = document.createElement('button')
  editBt.classList.add('edit-btn')
  editBt.textContent = 'Editar'
  editBt.addEventListener('click', () =>{
    document.querySelector('#id').value = item.id
    document.querySelector('#name').value = item.name
  })
  return editBt
}

function deleteBtn(id){
  const delBtn = document.createElement('button')
  delBtn.classList.add('delete-btn')
  delBtn.textContent = 'Apagar'
  delBtn.addEventListener('click', async () =>{
    await fetch(`http://localhost:3000/list/${id}`,{ method: 'DELETE' })
    document.querySelector(`#item-${id}`).remove()
    const indexToRemove = lista.findIndex((t) => t.id === id)
    lista.splice(indexToRemove, 1)
    alertaItemRemovido()
    setTimeout(clearAlert, 1000 *2)
  })
  return delBtn
}

async function saveItemList(ev){
  ev.preventDefault()

  const id = document.querySelector('#id').value
  const name = document.querySelector('#name').value
   
  if(name == ''){
    alertaNegativo()
    setTimeout(clearAlert, 1000 *2)
  } else {

    if (id) {
      const response = await fetch(`http://localhost:3000/list/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const list = await response.json()
      const indexToRemove = lista.findIndex((t) => t.id === id)
      lista.splice(indexToRemove, 1, list)
      document.querySelector(`#item-${id}`).remove()
      renderList(list)
      alertaEdição()
      setTimeout(clearAlert, 1000 * 2)

    } else{

    const response = await fetch('http://localhost:3000/list', {
    method:'POST',
    body:JSON.stringify({ name }), 
    headers:{
      'Content-Type': 'application/json'
    }
  })

    const addItem = await response.json()
    lista.push(addItem)
    renderList(addItem)
    alertaPositivo()
    setTimeout(clearAlert, 1000 *2)
  }

  ev.target.reset()
}
}

async function lists(){
  return await fetch("http://localhost:3000/list").then(res => res.json())
}

async function setup(){
  const results = await lists()
  lista.push(...results)
  lista.forEach(renderList)

}

document.addEventListener('DOMContentLoaded', setup)
document.querySelector('form').addEventListener('submit', saveItemList)