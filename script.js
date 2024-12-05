const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

let messages = [];
let fetchedData = [];
let fetchedCountries = [];


document.querySelector('.submit-btn').addEventListener('click', (e)=>{
    e.preventDefault();
    displayContactMessage();
    document.querySelector('#name').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#message').value = '';
});

document.querySelector('.search').addEventListener('click', async ()=> {
    await fetchData();
    displayData(fetchedData);
})

document.querySelector('.clear').addEventListener('click', ()=> {
    clearResults();
})

const clock = setInterval(getTime, 1000);

document.querySelector('.book-now').addEventListener('click', ()=>{
    sections.forEach(section=>{
        if(!section.id === 'contact') {
            section.classList.remove('active-section');
        } else if(section.id === 'home') {
            section.classList.remove('active-section');
        } else if(section.id === 'contact') {
            section.classList.add('active-section');
        }
    })
})

navLinks.forEach(link => {
    link.addEventListener('click', (e)=>{
        if(!link.classList.contains('active')) {
            navLinks.forEach(link=>{
                link.classList.remove('active');
            })
            e.currentTarget.classList.add('active');
            changeSection(sections, e.currentTarget.id);
        }
    })
})

function getTime() {
    const time = new Date();
    time.toLocaleTimeString();
    document.querySelector('.clock').innerHTML = time;
}

function changeSection(arr, linkId) {
    arr.forEach(item=>{
        if(item.classList.contains('active-section')){
            item.classList.remove('active-section');
        }
        
        if(item.id === linkId) {
            item.classList.add('active-section');
        }
    })
}

function displayContactMessage() {
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const message = document.querySelector('#message').value;

    if(name && email && message) {
        messages.push({name, email, message})
        alert('Thank you for contacting us. Our representative will reach you soon.');
    }
}



async function fetchData() {
    const cityname = document.querySelector('.search-bar').value.toLowerCase();
    fetchedData = [];

    try {
        const response = await fetch('./travel_recommendation_api.json');
        const data = await response.json();
        const {countries, beaches, temples} = data;
        countries.forEach(country=>{
            country.cities.forEach(item=>{
                if(item.name.toLowerCase().includes(cityname) || cityname.toLowerCase() === 'country'){
                    fetchedData.push({
                        id: 'country',
                        name: item.name,
                        img: item.imageUrl,
                        desc: item.description
                    })
                }
            })
        })
        beaches.forEach(beach=>{
            if(beach.name.toLowerCase().includes(cityname) || cityname.toLowerCase() === 'beach'){
                fetchedData.push({
                    id: 'beach',
                    name: beach.name,
                    img: beach.imageUrl,
                    desc: beach.description
                })
            }
        })
        temples.forEach(temple=>{
            if(temple.name.toLowerCase().includes(cityname) || cityname.toLowerCase() === 'temple'){
                fetchedData.push({
                    id: 'temple',
                    name: temple.name,
                    img: temple.imageUrl,
                    desc: temple.description
                })
            }
        })
    } catch(error) {
        console.log('Something went wrong.' + error);
    }
}

function displayData(array) {
    const existingContainer = document.getElementById('searchedDataContainer');
    if(existingContainer) {
        existingContainer.remove();
    }

    if(array.length === 0) {
        alert('No results found.');
        return;
    }

    const locDisplayArea = document.createElement('div');
    locDisplayArea.setAttribute('id', 'searchedDataContainer');

    array.forEach(item => {
        locDisplayArea.innerHTML += `
        <div id="searchedDataCard">
            <img src="${item.img}" alt="">
            <h3 class="cityName">${item.name}</h3>
            <p class="description">${item.desc}</p>
            <button class="visitBtn">Visit</button>
        </div>
        `;
    })

    document.body.appendChild(locDisplayArea);
}

function clearResults() {
    fetchedData = [];
    document.querySelector('.search-bar').value = '';
    document.getElementById('searchedDataContainer').remove();
}