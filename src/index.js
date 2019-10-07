const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
const API2 = 'https://us-central1-escuelajs-api.cloudfunctions.net/characters';

var urlNext = '';
const myStorage = window.localStorage;


const getData = api => { 
  if(!api) {
    return 'lastPage'
  }
  let rr = fetch(api)
    .then(response => response.json())
    .then(response => {
      const characters = response.results;
      const info = response.info;

      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');

      const nextPage = info.next;

      myStorage.setItem('next_fetch', nextPage)

      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
       return nextPage;

    })
    .catch(error => error );

      return rr;
}


const loadData = async () => {
  const check = myStorage.getItem('next_fetch')
  console.log('chequeando',check)    

  urlNext = (check)?check:API; //forma abreviada de hacer lo que esta abajo comentado
  // if(check) {
  //   urlNext = check;  // let no const porque se va a estar modiifcado
  // } else {
  //   urlNext = API2;
  // }
  
  const result = await getData(urlNext);
    if(result == 'lastPage') {
      alert('Ya no hay personajes...')
    } // = asignacion == comparacion
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);

window.onbeforeunload = function() {
  myStorage.removeItem('next_fetch');
}