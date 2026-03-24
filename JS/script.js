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

    function criandoCards() {    
        const divCard = document.createElement('div');
        divSection.appendChild(divCard);
        divCard.classList.add('card');    

        const container_img = document.createElement('div');
        divCard.appendChild(container_img);
        container_img.classList.add('container-img');

        const img_cards = document.createElement('img');
        container_img.appendChild(img_cards);
        img_cards.classList.add('card-img');

        const text_name_cards = document.createElement('p');
        divCard.appendChild(text_name_cards);
        text_name_cards.classList.add('card-nome');

        const text_local_cards = document.createElement('p');
        divCard.appendChild(text_local_cards);
        text_local_cards.classList.add('card-local');

        const divStatus = document.createElement('div');
        divCard.appendChild(divStatus);
        divStatus.classList.add('campo-status');
        
        const simbolo_status = document.createElement('i');
        divStatus.appendChild(simbolo_status);
        simbolo_status.classList.add('fa-solid');
        simbolo_status.classList.add('fa-circle');
        
        const text_status_cards = document.createElement('p');
        divStatus.appendChild(text_status_cards);
        text_status_cards.classList.add('card-status');  
    
    }

    async function imprimirInfos(value) {
        divSection.innerHTML = '';//Limpando a sessão para criar outra
        gerarCards();
        
        let resultado = await chamarAPI(value);
        
        totalPaginas = resultado.info.pages;//Pega a informação de quantas paginas tem
        
        const todasImg = document.querySelectorAll('.card-img');
        todasImg.forEach((elem, i) => { 
            elem.src = resultado.results[i].image;
        });

        const todosNome = document.querySelectorAll('.card-nome');
        todosNome.forEach((elem, i) => {
            elem.innerHTML = resultado.results[i].name;        
        });

        const todosLocal = document.querySelectorAll('.card-local');
        todosLocal.forEach((elem, i) => {
            elem.innerHTML = resultado.results[i].origin.name;
        });

        const todosStatus = document.querySelectorAll('.card-status');
        todosStatus.forEach((elem, i) => {
            elem.innerHTML = resultado.results[i].status;

        });
        
        //Trocando a cor dos circulos de status
        let simbolo = document.querySelectorAll('.fa-circle');
        simbolo.forEach((sim, i) => {

        switch(resultado.results[i].status) {
            case "Alive":
                sim.style.color = "green";
            break;
            case "Dead":
                sim.style.color = "red";
            break;
        default:
            sim.style.color = "gray";
        }

        //Mostra a pagina atual e o total de paginas
        document.querySelector('.total-paginas').textContent = `Página ${contadorPagina} de ${totalPaginas}`;
        
    })
    }

    //Gerando os cards
    function gerarCards() {
        for (let i = 19; i >= 0; i--){
        criandoCards();
        }
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
    })
    
    btnAnterior.addEventListener('click', () => {
        if(contadorPagina > 1) {
            contadorPagina--;
            imprimirInfos(contadorPagina);
            
        }
    });

    //Basicamente executando o código todo
    imprimirInfos(contadorPagina);


});