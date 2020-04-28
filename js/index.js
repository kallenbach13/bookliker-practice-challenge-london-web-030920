// api
const apiHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

const get = (url) => {
    return fetch(url).then(resp => resp.json())
}

const patch = (url, id, bodyObj) => {
    return fetch(url + id, {
    method: "PATCH",
    headers: apiHeaders,
    body: JSON.stringify(bodyObj)
  }).then(resp => resp.json())
}

const API = {get, patch}

//constants

const baseUrl = "http://localhost:3000/"
const booksUrl = "http://localhost:3000/books/"
const usersUrl = "http://localhost:3000/users/"

const listElement = document.querySelector("#list")
const showPanel = document.querySelector("#show-panel")
const currentUser = {"id":1, "username":"pouros"}


//functions

const getAllBooks = () => {
    API.get(booksUrl).then(books => books.forEach(book => makeBookList
      (book)))
}

const makeBookList = (book) => {
    const li = document.createElement("li")
    li.innerText = book.title
    li.addEventListener('click', () => makeBookShow(book))

    listElement.append(li)
}

const makeBookShow = (book) => {
    while (showPanel.firstChild) showPanel.removeChild(showPanel.firstChild)

    const h2 = document.createElement("h2")
    h2.innerText = book.title

    const p = document.createElement("p")
    p.innerText = book.description

    const img = document.createElement("img")
    img.src = book.img_url

    const button = document.createElement("button")
    button.innerText = "Like Book <3"

    const usersUl = document.createElement("ul")
    usersUl.id = "users-list"

    button.addEventListener('click', () => handleButtonClick(book, usersUl))

    book.users.forEach(bookUser => {
        const li = document.createElement("li")
        li.innerText = bookUser.username
        li.id = `user-id-${bookUser.id}`
        usersUl.append(li)
    })

    showPanel.append(h2, img, p, button, usersUl)
}

const handleButtonClick = (book, ul) => {
    if (!hasUserReadBook(book)) {
        book.users.push(currentUser)
        API.patch(booksUrl, book.id, book).then(makeLi(ul))

    } else {

        book.users = book.users.filter(bookUsr => bookUsr.id != currentUser.id)
        API.patch(booksUrl, book.id, book).then(removeLi)
    }
}

const hasUserReadBook = (book) => {
    return book.users.find(bookUser => bookUser.id === currentUser.id)
}

const makeLi = (ul) => {
    const li = document.createElement("li")
    li.innerText = currentUser.username
    li.id = `user-id-${currentUser.id}`
    ul.append(li)
}

const removeLi = () => {
    const foundLi = document.querySelector(`user-id-${currentUser.id}`)
    foundLi.remove()
    
}

//call the master function
getAllBooks()