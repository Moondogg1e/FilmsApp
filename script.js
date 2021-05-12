const doc = document;

const apiKey = "db75852a"
const baseUrl = "https://www.omdbapi.com/?apikey=" + apiKey + "&";


const filmsContainer = doc.querySelector('.films_container');

const searchButton = doc.getElementById('get_films_btn');
const moreFilmsButton = doc.getElementById('more_films_btn');

const modalWindow = doc.getElementById('modal_window');
const closeModalWindow = doc.getElementById('close_modal_window');

const modalTitle = doc.getElementById('modal_title');
const modalImg = doc.getElementById('modal_img');
const modalReleased = doc.getElementById('modal_released');
const modalGenre = doc.getElementById('modal_genre');
const modalCountry = doc.getElementById('modal_country');
const modalDirector = doc.getElementById('modal_director');
const modalWriter = doc.getElementById('modal_writer');
const modalActors = doc.getElementById('modal_actors');
const modalAwards = doc.getElementById('modal_awards');


let titleErrorText = doc.querySelector("#title_error_text");
let filmsJSON;
let page = 1;


let searchTitle = doc.getElementById('search_title');
let filmType = doc.getElementById('type');


let scrollUp = document.getElementById("scroll_to_top");


let t;
function up() {
	let top = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
	if(top > 0) {
		window.scrollBy(0,-150);
		t = setTimeout('up()',20);
	} else clearTimeout(t);
	return false;
}

scrollUp.addEventListener('click', up);

window.addEventListener('scroll', ()=>{
    scrollUp.hidden = calculateScroll();
});

function calculateScroll(){
    return (pageYOffset < document.documentElement.clientHeight);
}

// Loader
const loaded = doc.querySelector('#loader');

function displayLoading(){
    loader.classList.add('display');
}

function hideLoading() {
    loader.classList.remove("display");
}


// Checking Errors
function checkErrors(response){

    titleErrorText.classList.add('display');

    {
    // if(searchTitle.value == ""){
    //     titleErrorText.innerHTML = "Title should not be empty!";
    //     return true;
    // } 
    // else if(response["Error"] != undefined && response["Error"] == "Too many results."){
    //     titleErrorText.innerHTML = "The title should be more specific!";
    //     return true;
    // } else if(response["Error"] != undefined &&  response["Error"] == "Movie not found!"){
    //     titleErrorText.innerHTML = "Movie not found!";
    //     return true;
    // }
    }

    if(response["Error"] != undefined){
        if(response["Error"] == "Too many results."){
            titleErrorText.innerHTML = "The title should be more specific!";
            return true;
        }else if(response["Error"] == "Movie not found!"){
            titleErrorText.innerHTML = "Movie not found!";
            return true;
        }
    }   

    titleErrorText.classList.remove('display');
    return false;
}

searchButton.addEventListener('click', async (e)=>{
    e.preventDefault();
    if(searchTitle.value == ""){
        titleErrorText.classList.add('display');
        titleErrorText.innerHTML = "Title should not be empty!";
    }else{
        moreFilmsButton.classList.remove('display');
        // let filmTitle = searchTitle.value.replace(/ +/g, ' ').trim(); /// deleting Spaces
        console.log(filmTitle);
        let type = filmType.options[filmType.selectedIndex].value;
        filmsJSON = await search(baseUrl + `s=${searchTitle.value.replace(/ +/g, ' ').trim()}&type=${type}`);
        console.log(filmsJSON);
        clearFilmsContainer();
        if(!checkErrors(filmsJSON)){
            // clearFilmsContainer();
            addFilms(filmsJSON);
            moreFilmsButton.classList.add('display');
        } 
    }
       
});

moreFilmsButton.addEventListener('click', async ()=>{
    // let filmTitle = searchTitle.value.replace(/ +/g, ' ').trim(); ///deleting Spaces
    let type = filmType.options[filmType.selectedIndex].value;
    filmsJSON = await search(baseUrl + `s=${searchTitle.value.replace(/ +/g, ' ').trim()}&type=${type}&page=${++page}`);
    console.log(filmTitle);
    if(!checkErrors(filmsJSON)){
        addFilms(filmsJSON);
    }    
})

function clearFilmsContainer(){
    filmsContainer.innerHTML = "";
}


function search(url){
    displayLoading();
    
    return fetch(url).then((response)=>{
        // console.log(response)        
        return response.json();
    }).then(data => {
        hideLoading();
        return data;
    });
}

function addFilms(json){
    for (const key in json.Search) {
        addFilm(json.Search[key]);
    }
}

function addFilm(obj){
    let div = doc.createElement('div');
    div.classList.add('film_card');

    let img = doc.createElement('img');
    img.classList.add('film_card_img')
    // if(obj.Poster == "N/A"){
    //     img.src = "images/image_not_found.png";
    // }else{}
    img.src = obj.Poster;
    img.alt = 'image_not_found'

    let h1 = doc.createElement('h1');
    h1.classList.add('film_card_title')
    h1.textContent = obj.Title;

    let detailsBtn = doc.createElement('button')
    detailsBtn.classList.add('details_btn', 'white_btn');
    detailsBtn.textContent = 'Details';
    detailsBtn.addEventListener('click', ()=>{fillModal(obj.imdbID)}); 

    div.append(img, h1, detailsBtn);
    filmsContainer.append(div);
}

// Open modal window func

function getFilm(url){
    return fetch(url).then((response)=>{
        // console.log(response)        
        return response.json();
    }).then(data => {
        return data;
    });
}

async function fillModal(id) {
    modalWindow.classList.add('display');
    doc.body.classList.add('modal_open');
    scrollUp.hidden = true;
    // let film = filmsJSON.Search.find(item => item.imdbID === id);
    console.log(id);
    let film = await getFilm(baseUrl +`i=${id}`);

    console.log(film);

    modalImg.src = film.Poster;
    modalImg.alt = 'image_not_found';    

    modalTitle.innerHTML = `Title: <span>${film.Title}</span>`;
    modalReleased.innerHTML = `Released: <span>${film.Released}</span>`;
    modalGenre.innerHTML = `Genre: <span>${film.Genre}</span>`;
    modalCountry.innerHTML = `Country: <span>${film.Country}</span>`;
    modalDirector.innerHTML = `Director: <span>${film.Director}</span>`;
    modalWriter.innerHTML = `Writer: <span> ${film.Writer}</span>`;
    modalActors.innerHTML = `Actors: <span> ${film.Actors}</span>`;
    modalAwards.innerHTML = `Awards: <span> ${film.Awards}</span>`;
}


closeModalWindow.addEventListener('click', ()=>{
    modalWindow.classList.remove('display');
    doc.body.classList.remove('modal_open');
    scrollUp.hidden = calculateScroll();
});

window.onclick = function(event) {
    if(event.target == modalWindow){
        modalWindow.classList.remove('display');
        doc.body.classList.remove('modal_open');
        scrollUp.hidden = calculateScroll();
    }
}


