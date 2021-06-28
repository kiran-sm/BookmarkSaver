// const modal = document.getElementById('modal');
const modal = document.querySelector('.modal-container');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookMarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// show modal, focous on input

function showModal () {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

function closeModal () {
    modal.classList.remove('show-modal');
}

// modal event listeners

modalShow.addEventListener('click', showModal);
// modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));

modalClose.addEventListener('click',closeModal);
window.addEventListener('click',(e) => (e.target === modal ? closeModal():false))

// validate form

function validate (nameValue, urlValue) {
    var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
var regex = new RegExp(expression);
        if(!nameValue || !urlValue) {
            alert('Please Submit value for both the fields')
        }
    
    if (!urlValue.match(regex)) {
        alert('Please enter a valid url')
        return false;
    }
    closeModal();

    return true;
}

// build bookmark DOM
function buildBookmark () {
    // remove book mark element
    bookmarksContainer.textContent = '';
    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;
        // console.log(name, url);

        // item
        const item = document.createElement('div');
        item.classList.add('item');
        // close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onClick',`deleteBookmark('${url}')`);

        // fav icon / link container

        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        // fv con
        const favicon= document.createElement('img');

        // link

        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target','_blank');
        link.textContent = name;

        // append to bookmark container
        linkInfo.append(favicon,link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item)

    });
}


// fetch bookmark

function fetchBookmarks () {
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    else {
        bookmarks = [
            {
                name:'google',
                url:'https://google.com',
            },
        ];
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }
    buildBookmark();
}
// delete bookmark
function deleteBookmark(url) {
    // console.log('delete url', url);
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    // update bookmarks array in local storage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();

    
}



// handle data rom form

function storeBookmark(e) {
    e.preventDefault();
    // console.log(e);
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
     urlValue = `https://${urlValue}`; 

    // console.log(nameValue,urlValue);
    // validate(nameValue, urlValue);
    }

    if(!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name : nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    // console.log(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    bookMarkForm.reset();
    websiteNameEl.focus();
}

// event listener
bookMarkForm.addEventListener('submit', storeBookmark)

window.addEventListener('keydown',(e) => ( e.key === 'Escape' ? closeModal():false));

// page on load
fetchBookmarks();