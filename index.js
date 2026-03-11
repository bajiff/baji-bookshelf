let books = [];

const themeButton = document.getElementById("theme-button")
const themeIcon = document.getElementById("theme-icon");
const htmlElement = document.documentElement;

const formInputSection = document.getElementById("form-input-section");
const formSearchSection = document.getElementById("form-search-section");

const inputTitle = document.getElementById("title");
const inputSubTitle = document.getElementById("sub-title");
const inputAuthor = document.getElementById("author");
const inputPublisher = document.getElementById("publisher");
const inputIsbn = document.getElementById("isbn");
const inputPublicationYear = document.getElementById("publication-year");
const inputPlaceOfPublication = document.getElementById("place-of-publication");
const inputEditor = document.getElementById("editor");
const inputIlustrator = document.getElementById("ilustrator");
const inputIsRead = document.getElementById("isRead");
const submitButton = document.getElementsByClassName("submit-button");

const formSearchSeaction = document.getElementById("form-search-section");
const inputSearchTitle = document.getElementById("search-title");
const readList = document.getElementById("read-list");
const unreadList = document.getElementById("unread-list");

const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? "dark" : "light");

const toggleTheme = (theme) => {
  htmlElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme",theme);

  if(theme === "dark") {
    themeIcon.classList.replace("fa-moon", "fa-sun");
  } else {
    themeIcon.classList.replace("fa-sun", "fa-moon");
  };
};

toggleTheme(currentTheme);

themeButton.addEventListener("click", () => {
  const isDark = htmlElement.getAttribute("data-theme") === "dark";

  toggleTheme(isDark ? "light" : "dark");
});



const renderBooks = (data = books) => {
  readList.innerHTML = "";
  unreadList.innerHTML = "";

  data.forEach((book) => {
    const newElement = document.createElement("div");
    newElement.classList.add("card-book");
    newElement.innerHTML = `ID: ${book.id}<br>Title: ${book.title}<br>Sub Title: ${book.subTitle}<br>Author: ${book.author}<br>Publisher: ${book.publisher}<br>ISBN: ${book.isbn}<br>Publication Year: ${book.publicationYear}<br>Place of Publication: ${book.placeOfPublication}<br>Editor: ${book.editor}<br>Ilustrator: ${book.ilustrator}<br>Status: ${book.isRead ? "Read" : "Unread"}`
    
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button")
    deleteButton.innerText = "Delete";

    const toggleButton = document.createElement("button");
    toggleButton.classList.add("toggle-button")
    toggleButton.innerText = "Toggle";
    const lineBreakElement = document.createElement("br");
    
    deleteButton.addEventListener("click",() => {
      const confirmBookDelete = confirm(`Yakin mau menghapus ${book.title}`)
      if (confirmBookDelete) {
        deleteProduct(book.id);
      } else {
        return false;
      }
    });

    toggleButton.addEventListener("click", () => {
      toggleStatus(book.id);
    });
    
    newElement.append(lineBreakElement,deleteButton,toggleButton);

    if (book.isRead === true) {
      readList.append(newElement);
    } else {
      unreadList.append(newElement);
    };
  });
  
};


const saveData = () => {
  localStorage.setItem("LOGISTIC_DATA", JSON.stringify(books));
};

const loadDataFromStorage = () => {
  const dataStorage = localStorage.getItem("LOGISTIC_DATA");
  if (dataStorage !== null) {
    const parseDataStorage = JSON.parse(dataStorage);
    // ! Isi dari parseDataStorage itu array dan method dibawah ini sedang membongkar dengan cara spread ...parseDataStorage lalu di push dengan cara books.push();
    books.push(...parseDataStorage);
    
    // * Setelah di push lalu dilanjutkan dengan merender ulang
    renderBooks();
  };
  
};

const deleteProduct = (id) => {
  books = books.filter(book => book.id !== id);
  saveData();
  renderBooks();
};

const toggleStatus = (id) => {
  const productID = books.find(book => book.id === id);
  productID.isRead = (!productID.isRead);
  saveData();
  renderBooks();
};

const duplicateCheck = (isbn) => {
  const filteredDuplicate = books.filter(book => {
    if (book.isbn === isbn) {
      alert(`Sorry nomor ISBN ${book.isbn} sudah tersedia mohon input nomor yang lain`);
      return false;
    } else {
      return true;
    };
  });
  return filteredDuplicate;
};

formInputSection.addEventListener("submit", (e) => {
  e.preventDefault();
  const generateUID = Date.now();
  const titleValue = inputTitle.value;
  const subTitleValue = (!inputSubTitle.value ? "Empty" : inputSubTitle.value);
  const authorValue = inputAuthor.value;
  const publisherValue = inputPublisher.value;
  const isbnValue =  inputIsbn.value;
  const publicationYearValue = parseInt(inputPublicationYear.value);
  const placeOfPublicationValue = inputPlaceOfPublication.value;
  const editorValue = (!inputEditor.value ? "Empty" : inputEditor.value);
  const ilustratorValue = (!inputIlustrator.value ? "Empty" : inputIlustrator.value);
  const isReadValue = inputIsRead.checked;
  
  const newBook = {
    id: generateUID,
    title: titleValue,
    subTitle: subTitleValue,
    author: authorValue,
    publisher: publisherValue,
    isbn: isbnValue,
    publicationYear: publicationYearValue,
    placeOfPublication: placeOfPublicationValue,
    editor: editorValue,
    ilustrator: ilustratorValue,
    isRead: isReadValue
  };
  
  const isFixed = confirm(`Apakah ${newBook.title} sudah sesuai?`);
  if (isFixed) {
    books.push(newBook);
    console.log(books);
    
    renderBooks();
    
    saveData();

    formInputSection.reset();
  } else {
    return false;
  };

});

formSearchSeaction.addEventListener("submit", (e) => {
  e.preventDefault();

  const keyword = inputSearchTitle.value.toLowerCase();

  const filteredBook = books.filter(book => book.title.toLowerCase().includes(keyword));
  
  renderBooks(filteredBook);
  saveData();

})


loadDataFromStorage();
