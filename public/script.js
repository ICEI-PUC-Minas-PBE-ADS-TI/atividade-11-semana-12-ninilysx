const API_KEY = "4027b3c4a717e3a77eb4144bdc415bd0"

const container = document.getElementById('movie-list');

// pega a api

async function fetchMovies(query = "") {
    let url = '';

    if (query.trim() !== "") {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`;
    } else {
        url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=pt-BR&page=1`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return [];
        }
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.error('Erro ao buscar filmes: ', error);
        return [];
    }
}

// função de mensagem

function showMessage(text) {

    const message = document.getElementById('message')
    message.textContent = text;

}

// função de renderizar cards

function renderCards(moviesList = []) {

    showMessage("");
    container.innerHTML = '';

    moviesList.forEach(filme => {
        const img = `https://image.tmdb.org/t/p/w500${filme.poster_path}` || "Poster indisponível"
        const lancamentoAno = filme.release_date
            ? filme.release_date.split('-')[0]
            : "N/E";
        const sinopseOg = filme.overview || 'Sinopse indisponível.';
        const limite = 200;

        const sinopse = sinopseOg.length > limite
            ? sinopseOg.substring(0, limite) + "..."
            : sinopseOg;

        const notaFormatada = filme.vote_average
        ? filme.vote_average.toFixed(1).replace('.',',')
        : "N/E"

        const card = document.createElement('div');
        card.classList.add('card');

        const poster = document.createElement('img');
        poster.src = img;
        poster.alt = filme.title;
        card.appendChild(poster);

        const tituloContainer = document.createElement('div');
        tituloContainer.classList.add('title-card');

        const titulo = document.createElement('h3');
        titulo.id = 'titulo';
        titulo.textContent = filme.title;

        const lancamento = document.createElement('p');
        lancamento.id = 'lancamento';
        lancamento.textContent = `(${lancamentoAno})`;

        tituloContainer.appendChild(titulo);
        tituloContainer.appendChild(lancamento);
        card.appendChild(tituloContainer);

        const sinopseContainer = document.createElement('div');
        sinopseContainer.classList.add('sinopse');

        const sinopseDesc = document.createElement('p');
        sinopseDesc.textContent = sinopse;

        sinopseContainer.appendChild(sinopseDesc);
        card.appendChild(sinopseContainer);

        const nota = document.createElement('p');
        nota.id = 'nota';
        nota.innerHTML = `<strong>Nota:</strong> ${notaFormatada}`; 
        card.appendChild(nota);

        container.appendChild(card);
    });
}

// função de busca

async function busca() {
    const searchInput = document.getElementById('pesquisa-input');
    const query = searchInput.value;

    showMessage("Buscando filmes...")

    const filmes = await fetchMovies(query);

    if (filmes.length === 0) {
        container.innerHTML = '';
        showMessage("Nenhum filme encontrado para a sua busca.");
        return;
    }

    renderCards(filmes);
}

// coloca evento nos itens de pesquisa

function searchEvents() {
    const searchButton = document.getElementById('pesquisa-botao'); 
    const searchInput = document.getElementById('pesquisa-input');

    if (searchButton) {
        searchButton.addEventListener('click', busca);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                busca();
            }
        });
    }
}

// inicia e coloca tudo na pagina

async function init() {
    searchEvents();
    showMessage("Carregando filmes...")
    const filmes = await fetchMovies();

    if (filmes.length === 0){
        showMessage('Erro ao carregar os filmes.');
        return;
    }

    renderCards(filmes);
}

init();