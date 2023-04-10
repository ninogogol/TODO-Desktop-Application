// Import required modules
const fs = require('fs')
const path = require('path')

// Get DOM elements
const todoList = document.getElementById('todoList')
const todoInput = document.getElementById('todoInput')
const addButton = document.getElementById('addButton')

// Set up Electron IPC renderer
const ipcRenderer = require('electron').ipcRenderer
let userDataPath = ''

// Listen for userDataPath from the main process
ipcRenderer.on('userDataPath', (event, path) => {
    userDataPath = path;
    loadTodos() // Load todos when userDataPath is received
})

// Set the path for the todos data file
const dataFilePath = path.join(userDataPath, 'todos.json')


// Load todos from data file
function loadTodos() {
    if (fs.existsSync(dataFilePath)) {
        const todoData = JSON.parse(fs.readFileSync(dataFilePath))
        todoData.forEach((todo) => {
            addTodoToList(todo)
        })
    }
}


// Save todos to data file
function saveTodos() {
    const todos = []
    todoList.childNodes.forEach((todoElement) => {
        todos.push({
            text: todoElement.querySelector('.todo-text').innerText,
            completed: todoElement.querySelector('.todo-checkbox').checked,
        })
    })

    fs.writeFileSync(dataFilePath, JSON.stringify(todos))
}


// Add a todo item to the list
function addTodoToList(todo) {

    const li = document.createElement('li')

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.className = 'todo-checkbox'
    checkbox.checked = todo.completed

    const span = document.createElement('span')
    span.className = 'todo-text'
    span.innerText = todo.text

    if(todo.completed) {
        span.classList.add('checked')
    }

    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'Delete'

    deleteButton.addEventListener('click', () => {
        todoList.removeChild(li)
        saveTodos()
    })
    checkbox.addEventListener('change', () => {
        if(checkbox.checked) {
            span.classList.add('checked')
        } else {
            span.classList.remove('checked')
        }
        saveTodos()
    })
    li.appendChild(checkbox)
    li.appendChild(span)
    li.appendChild(deleteButton)
    todoList.appendChild(li)
}

addButton.addEventListener('click', () => {
    if (todoInput.value.trim() !== '') {
        addTodoToList({ text: todoInput.value, completed: false })
        todoInput.value = ''
        saveTodos()
    }
})

todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addButton.click()
    }
})
