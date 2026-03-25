window.addEventListener('load', () => {

    //Para validar a quantidade de páginas que tem na API
    let totalPaginas;

    const divSection = document.querySelector('.section-cards');

    function chamarAPI(value) {
        const endpoint = `https://rickandmortyapi.com/api/character/?page=${value}`;
        const apiRequest = fetch(endpoint).then((res) => res.json().then((elem) => {
            console.log(endpoint);
            return elem;

        }));

        return apiRequest;
    }

    function trocarCorStatus(sim, resultadoAPIstatus) {
        switch(resultadoAPIstatus) {
            case "Alive":
                sim.style.color = 'green';
            break;
            case "Dead":
                sim.style.color = 'red';
            break;
            default:
                sim.style.color = 'gray';    
        }
    }

    function criarCards(resultadoAPI) {
        const divCard = document.createElement('div');
        divCard.classList.add('card')
        divSection.appendChild(divCard);

        divCard.innerHTML = `
            <div class="container-img">
                <img class="card-img" src="${resultadoAPI.image}" alt="Imagem do Personagem">
            </div>                   
            <p class="card-nome">${resultadoAPI.name}</p>
            <p class="card-local">${resultadoAPI.origin.name}</p>
            <div class="campo-status">
                <i class="fa-solid fa-circle"></i>
                <p class="card-status">${resultadoAPI.status}</p>
            </div>        
        `
        //Mudando a cor do circulo de status
        const simbolo = divCard.querySelector('.fa-circle');//Vai pegar pela classe na divCard
        trocarCorStatus(simbolo, resultadoAPI.status);
    }

    async function imprimirInfos(contadorPag) {
        divSection.innerHTML = ''; //Limpando a sessão para criar outra;

        const resultado = await chamarAPI(contadorPag);
        resultado.results.forEach(res => criarCards(res));
        
        totalPaginas = resultado.info.pages; //Pega a informação de quantas paginas tem na API
        document.querySelector('.total-paginas').textContent = `Página ${contadorPagina} de ${totalPaginas}`; //Mostra em que pagina está e a quantidade de páginas.
    }


    //Avançar ou Retroceder as paginas
    let contadorPagina = 1; 

    const btnAnterior = document.querySelector('.anterior');
    const btnProximo = document.querySelector('.prox');

    btnProximo.addEventListener('click', () => {
        if (contadorPagina < totalPaginas) {
            contadorPagina++;
            imprimirInfos(contadorPagina);
        }
        voltarParaCima();
    })
    
    btnAnterior.addEventListener('click', () => {
        if(contadorPagina > 1) {
            contadorPagina--;
            imprimirInfos(contadorPagina);
        }
        voltarParaCima();
    });

    function voltarParaCima() {
        window.scrollTo( {
            top: 0,
            behavior: 'smooth'
        })
    }

    //Basicamente executando o código todo
    imprimirInfos(contadorPagina);

});