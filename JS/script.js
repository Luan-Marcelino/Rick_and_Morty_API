window.addEventListener('load', () => {

    //Para validar a quantidade de páginas que tem na API
    let totalPaginas;

    const divSection = document.querySelector('.section-cards');
    const input_pesquisa = document.querySelector('.input-pesquisa');
    
    function chamarAPI(value, nome) {
        let endpoint = `https://rickandmortyapi.com/api/character/?page=${value}`;

        if(nome) { 
            endpoint += `&name=${nome}`;//se o parametro nome não for '', ele vai adicionar &name=nome no final do endpoint, assim como fala na documentação
        }
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

    async function imprimirInfos(contadorPag, nome = '') {//defini o parametro nome como '' para o caso o parametro não ser colocado na função
        divSection.innerHTML = ''; //Limpando a sessão para criar outra;

        const resultado = await chamarAPI(contadorPag, nome);
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
            imprimirInfos(contadorPagina, input_pesquisa.value.trim());
        }
        voltarParaCima();
    })
    
    btnAnterior.addEventListener('click', () => {
        if(contadorPagina > 1) {
            contadorPagina--;
            imprimirInfos(contadorPagina, input_pesquisa.value.trim());
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

    //pesquisando com o ENTER
    input_pesquisa.addEventListener('keyup', (e) => {
        e.preventDefault();
        if(e.key === 'Enter') {
            imprimirInfos(contadorPagina, input_pesquisa.value.trim());//Coloca um nome para fazer a pesquisa do personagem
        }

    })
});