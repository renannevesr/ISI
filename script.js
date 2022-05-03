const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getData = () => {
    fetch('http://127.0.0.1:3333/products', {
            method: "GET",
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        .then(response => response.json())
        .then(json => json.forEach(createRow))
        .catch(err => console.log(err));
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_produto')) || []
const setLocalStorage = (dbproduto) => localStorage.setItem("db_produto", JSON.stringify(dbproduto))

const deleteproduto = (index) => {
    console.log(index);
    const dbproduto = readproduto()
    dbproduto.splice(index, 1)
    setLocalStorage(dbproduto)
}

const updateproduto = (index, produto) => {
    const dbproduto = readproduto()
    dbproduto[index] = produto
    setLocalStorage(dbproduto)
}

const readproduto = () => getLocalStorage()

const createproduto = (produto) => {

    fetch('http://127.0.0.1:3333/products', {
            method: "POST",
            body: JSON.stringify(produto),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));

    const dbproduto = getLocalStorage()
    dbproduto.push(produto)
    setLocalStorage(dbproduto)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveproduto = () => {
    if (isValidFields()) {
        const produto = {
            nome: document.getElementById('nome').value,
            email_fornecedor: document.getElementById('email').value,
            codigo: document.getElementById('id').value,
            nome_fornecedor: document.getElementById('fornecedor').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createproduto(produto)
            updateTable()
            closeModal()
            document.location.reload(true)
        } else {
            updateproduto(index, produto)
            updateTable()
            closeModal()
            document.location.reload(true)
        }
    }
}

const createRow = (produto, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${produto.id}</td>
        <td>${produto.codigo}</td>
        <td>${produto.nome}</td>
        <td>${produto.nome_fornecedor}</td>
        <td>${produto.email_fornecedor}</td>
        <td class="table-buttons">
            <button type="button"  id="edit-${index}"><i class="fas fa-pen" id="edit-${index}"></i></button>
            <button type="button"  id="delete-${index}" ><i class="fas fa-trash" id="delete-${index}"></i></button>
        </td>
    `
    document.querySelector('#tableProduct>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableProduct>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbproduto = getData()
        // const dbproduto = readproduto()
    clearTable()
        // dbproduto.forEach(createRow)
}

const fillFields = (produto) => {
    document.getElementById('nome').value = produto.nome
    document.getElementById('email').value = produto.email_fornecedor
    document.getElementById('id').value = produto.codigo
    document.getElementById('fornecedor').value = produto.nome_fornecedor
    document.getElementById('nome').dataset.index = produto.index
}

const editproduto = (index) => {
    const produto = readproduto()[index]
    produto.index = index
    fillFields(produto)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editproduto(index)
        } else {
            const produto = readproduto()[index]
            const response = confirm(`Deseja realmente excluir o produtoe ${produto.nome}`)
            if (response) {
                deleteproduto(index)
                updateTable()
            }
        }
    }
}

updateTable()

document.getElementById('cadastrarProduto').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('salvar').addEventListener('click', saveproduto)

document.querySelector('#tableProduct>tbody').addEventListener('click', editDelete)

document.getElementById('cancelar').addEventListener('click', closeModal)