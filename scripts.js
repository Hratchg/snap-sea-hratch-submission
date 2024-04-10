// Attempt to load books from localStorage or set default if not available
let books = JSON.parse(localStorage.getItem('books')) || [
    { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", year: 1937, rating: 4.8 },
    { title: "City of Bones", author: "Cassandra Clare", genre: "Fantasy", year: 2007, rating: 4.1 },
    { title: "City of Ashes", author: "Cassandra Clare", genre: "Fantasy", year: 2008, rating: 4.2 },
    { title: "1984", author: "George Orwell", genre: "Dystopian", year: 1949, rating: 4.7 },
    { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", year: 1960, rating: 4.3 }
];

function updateLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}

document.addEventListener('DOMContentLoaded', () => {
    displayBooks();
    populateGenres();
    populateRemovalDropdown();
    document.getElementById('new-book-form').addEventListener('submit', addBook);
    document.getElementById('genre-filter').addEventListener('change', filterBooks);
    document.getElementById('sort-rating').addEventListener('click', sortByRating);
    document.getElementById('remove-book-btn').addEventListener('click', removeBook);
});

function displayBooks(filteredBooks = books) {
    const container = document.getElementById('book-container');
    container.innerHTML = '';
    filteredBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-content">
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Genre: ${book.genre}</p>
                <p>Year: ${book.year}</p>
                <p>Rating: ${book.rating}</p>
            </div>
        `;
        container.appendChild(bookCard);
    });
}

function addBook(event) {
    event.preventDefault();
    const newBook = {
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        genre: document.getElementById('genre').value.trim(),
        year: parseInt(document.getElementById('year').value, 10),
        rating: parseFloat(document.getElementById('rating').value)
    };
    books.push(newBook);
    updateLocalStorage();
    displayBooks();
    populateGenres();
    populateRemovalDropdown();
    event.target.reset();
}

function removeBook() {
    const removalSelect = document.getElementById('remove-book-select');
    const bookIndex = parseInt(removalSelect.value, 10);
    if (!isNaN(bookIndex) && bookIndex >= 0 && bookIndex < books.length) {
        books.splice(bookIndex, 1);
        updateLocalStorage();
        displayBooks();
        populateGenres();
        populateRemovalDropdown();
    }
}

function populateGenres() {
    const genreSet = new Set(['all']);
    books.forEach(book => genreSet.add(book.genre));
    const genreFilter = document.getElementById('genre-filter');
    genreFilter.innerHTML = '<option value="all">All Genres</option>';
    genreSet.forEach(genre => {
        if (genre !== 'all') {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        }
    });
}

function populateRemovalDropdown() {
    const removalSelect = document.getElementById('remove-book-select');
    removalSelect.innerHTML = '';
    books.forEach((book, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${book.title} by ${book.author}`;
        removalSelect.appendChild(option);
    });
}

function sortByRating() {
    const selectedGenre = document.getElementById('genre-filter').value;
    // Filter books based on the selected genre before sorting
    const booksToSort = selectedGenre === 'all' ? books : books.filter(book => book.genre === selectedGenre);

    const sortedBooks = booksToSort.sort((a, b) => b.rating - a.rating);
    displayBooks(sortedBooks);
}


function filterBooks() {
    const selectedGenre = document.getElementById('genre-filter').value;
    const filteredBooks = selectedGenre === 'all' ? books : books.filter(book => book.genre === selectedGenre);
    displayBooks(filteredBooks);
}
