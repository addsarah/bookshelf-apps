document.addEventListener('DOMContentLoaded', function () {
  const inputBookForm = document.getElementById('inputBook');
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');
  const searchBookForm = document.getElementById('searchBook');
  const searchBookTitle = document.getElementById('searchBookTitle');

  // Memuat buku dari localStorage
  loadBooksFromStorage();

  inputBookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBooks();
  });

  function makeBook(id, title, author, year, isComplete) {
    const book = document.createElement('article');
    book.classList.add('book_item');
    book.setAttribute('data-id', id);

    const bookTitle = document.createElement('h3');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = `Penulis: ${author}`;

    const bookYear = document.createElement('p');
    bookYear.innerText = `Tahun: ${year}`;

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    const actionButton1 = document.createElement('button');
    const actionButton2 = document.createElement('button');

    if (isComplete) {
      actionButton1.classList.add('green');
      actionButton1.innerText = 'Belum selesai di Baca';
      actionButton1.addEventListener('click', function () {
        toggleReadStatus(id, false);
      });
      actionButton2.classList.add('red');
      actionButton2.innerText = 'Hapus buku';
      actionButton2.addEventListener('click', function () {
        removeBook(id);
      });
    } else {
      actionButton1.classList.add('green');
      actionButton1.innerText = 'Selesai dibaca';
      actionButton1.addEventListener('click', function () {
        toggleReadStatus(id, true);
      });
      actionButton2.classList.add('red');
      actionButton2.innerText = 'Hapus buku';
      actionButton2.addEventListener('click', function () {
        removeBook(id);
      });
    }

    actionContainer.appendChild(actionButton1);
    actionContainer.appendChild(actionButton2);

    book.appendChild(bookTitle);
    book.appendChild(bookAuthor);
    book.appendChild(bookYear);
    book.appendChild(actionContainer);

    return book;
  }

  function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    const id = +new Date();

    const book = makeBook(id, title, author, year, isComplete);

    const bookObject = {
      id,
      title,
      author,
      year,
      isComplete
    };

    const books = getBooksFromStorage();
    books.push(bookObject);
    saveBooksToStorage(books);

    if (isComplete) {
      completeBookshelfList.appendChild(book);
    } else {
      incompleteBookshelfList.appendChild(book);
    }
    
    // Reset form after adding book
    inputBookForm.reset();
  }

  function toggleReadStatus(bookId, isComplete) {
    const books = getBooksFromStorage();
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex === -1) return;

    books[bookIndex].isComplete = isComplete;
    saveBooksToStorage(books);

    loadBooksFromStorage();
  }

  function removeBook(bookId) {
    let books = getBooksFromStorage();
    books = books.filter(book => book.id !== bookId);
    saveBooksToStorage(books);

    loadBooksFromStorage();
  }

  
  function searchBooks() {
    const searchTerm = searchBookTitle.value.toLowerCase();
    const books = getBooksFromStorage();
    const searchResults = books.filter(book => book.title.toLowerCase().includes(searchTerm));

    displaySearchResults(searchResults);
  }

  function displaySearchResults(results) {
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    if (results.length > 0) {
      results.forEach(book => {
        const bookElement = makeBook(book.id, book.title, book.author, book.year, book.isComplete);
        if (book.isComplete) {
          completeBookshelfList.appendChild(bookElement);
        } else {
          incompleteBookshelfList.appendChild(bookElement);
        }
      });
    } else {
      incompleteBookshelfList.innerHTML = '<p>Judul yang Anda cari tidak ada di rak buku.</p>';
      completeBookshelfList.innerHTML = '';
    }
  }

  function getBooksFromStorage() {
    return JSON.parse(localStorage.getItem('books')) || [];
  }

  function saveBooksToStorage(books) {
    localStorage.setItem('books', JSON.stringify(books));
  }

  function loadBooksFromStorage() {
    const books = getBooksFromStorage();
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    books.forEach(book => {
      const bookElement = makeBook(book.id, book.title, book.author, book.year, book.isComplete);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookElement);
      } else {
        incompleteBookshelfList.appendChild(bookElement);
      }
    });
  }
});
