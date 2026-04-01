window.addEventListener('load', () => {

    //Para validar a quantidade de páginas que tem na API
    let totalPaginas;
    const body = document.querySelector('body');

    const divSection = document.querySelector('.section-cards');
    const modal = document.querySelector('.modal');
    const input_pesquisa = document.querySelector('.input-pesquisa');
    const btn_pesquisar = document.querySelector('.btn-pesquisa');

    async function chamarAPI(value, nome) {
        try {
            let endpoint = `https://rickandmortyapi.com/api/character/?page=${value}`;
            if(nome) { 
                endpoint += `&name=${nome}`;//se o parametro nome não for '', ele vai adicionar &name=nome no final do endpoint, assim como fala na documentação
            }

            const res = await fetch(endpoint);

            //No caso de ter algum erro, ele vai lançar um novo erro e ir direto para o catch
            if (!res.ok) { 
                throw new Error("Personagem não localizado.")
            }

            const data = await res.json();
            return data;

        } catch (erro) {
            divSection.innerHTML = `<p>Nenhum personagem encontrado.</p>`
            return null;
        }
        
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
        //console.log(resultadoAPI.image);
        
        divCard.innerHTML = `
            <div class="container-img">
                <img class="card-img" src="${resultadoAPI.image}" alt="Imagem do Personagem">
            </div>                   
            <p name="${resultadoAPI.id}" class="card-nome">${resultadoAPI.name}</p>
            <p class="card-local">${resultadoAPI.origin.name}</p>
            <div class="campo-status">
                <i class="fa-solid fa-circle"></i>
                <p class="card-status">${resultadoAPI.status}</p>
            </div>        
        `
        //Mudando a cor do circulo de status
        const simbolo = divCard.querySelector('.fa-circle');//Vai pegar pela classe na divCard
        trocarCorStatus(simbolo, resultadoAPI.status);
        
        //clique na DIVCARD que abre a aba de conteudo
        divCard.addEventListener('click', () => {
            imprimirTelaPersonagem(resultadoAPI);
            abrirFechar();
        })

    }

    async function imprimirInfos(contadorPag, nome = '') {//defini o parametro nome como '' para o caso o parametro não ser colocado na função
        divSection.innerHTML = ''; //Limpando a sessão para criar outra;

        const resultado = await chamarAPI(contadorPag, nome);
        if (!resultado) return;

        resultado.results.forEach(res => {
            criarCards(res);
            
        });
        
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

    btn_pesquisar.addEventListener('click', (e) => {
        e.preventDefault();
        contadorPagina = 1;
        imprimirInfos(contadorPagina, input_pesquisa.value.trim());//Coloca um nome para fazer a pesquisa do personagem
    })

    
    //pesquisando com o ENTER
    input_pesquisa.addEventListener('keyup', (e) => {
        e.preventDefault();
        if(e.key === 'Enter') {
            contadorPagina = 1;
            imprimirInfos(contadorPagina, input_pesquisa.value.trim());//Coloca um nome para fazer a pesquisa do personagem
        }

    })

    // ---------------------------- Sessão para as infos do modal ----------------------------- //
    const info_conteudo = document.querySelector('.infos-personagem');
    
    function abrirFechar() {
        info_conteudo.classList.add('show');
        ativarOverlayEstilos();
    }


    //A função que vai fazer um request para a API e trazer as informações dos episódios
    async function procurandoNomeEpisodios(resultado) {
        const ids = resultado.map(id => {
            return id.split('/').pop();
        })
        const urlEp = `https://rickandmortyapi.com/api/episode/${ids.join(',')}`;
        const reqEp = await fetch(urlEp);
        const dataEp = await reqEp.json();
        //Verificando se a resposta é um array, se for vai passar pelo map e se não for, vai retornar apenas o nome do ep
        const dataEp_nome = Array.isArray(dataEp) ? dataEp.map(ep => `<p>- ${ep.name}</p>`).join('') : `<p>- ${dataEp.name}</p>`;
        
        return dataEp_nome;        
    }

    //Trazando as infos da API para a div de conteudo
    async function imprimirTelaPersonagem(resultado) {
        modal.innerHTML = '';
        const infos_principais = document.createElement('div');
        infos_principais.classList.add('infos-conteudo');
        modal.appendChild(infos_principais);

        const nomeEpisodios = await procurandoNomeEpisodios(resultado.episode);
    
        infos_principais.innerHTML = `
        <button class="btn-fechar-infos">X</button>
        <div class="infos-principal">
                <img src="${resultado.image}" alt="Imagem do personagem">
                <h1>${resultado.name}</h1>
                <div class="infos_de_status">    
                    <i class="fa-solid fa-circle"></i>
                    <p>${resultado.status}</p>
                    <p>${resultado.species}</p>
                    <p>${resultado.gender}</p>       
                </div>
            </div>

            <div class="origem">
                <label for="origin">Nascimento:</label>
                <p id="origin">${resultado.origin.name}</p>

                <label for="locaction">Localização</label>
                <p id="locaction">${resultado.location.name}</p>

                <label for="created">Episódios Totais</label>
                <p id="created">${resultado.episode.length}</p>

                <label for="todos-eps">Episódios</label>
                <div id="todos-eps">
                    ${nomeEpisodios}
                
                </div>
                
            </div>
        </div>`     

        const simbolo = infos_principais.querySelector('.fa-circle');
        trocarCorStatus(simbolo, resultado.status);

        infos_principais.querySelector('.btn-fechar-infos').addEventListener('click', () => {
            info_conteudo.classList.remove('show');
            desativarOverlayEstilos()
        });
        
    }

    function ativarOverlayEstilos() {
        body.style.background = 'rgba(0,0,0, 0.9)';
        document.querySelector('.campo-pesquisa').style.opacity = '10%';
        document.querySelector('hr').style.opacity = '10%';
        document.querySelectorAll('.card').forEach(e => e.style.opacity = '10%');
        document.querySelectorAll('img').forEach(e => e.style.opacity = '10%');
        document.querySelector('.btn-tras-frente').style.opacity = '10%';
        document.querySelector('footer').style.opacity = '10%';
        document.querySelector('.total-paginas').style.opacity = '10%';
    }

    function desativarOverlayEstilos() {
        body.style.background = 'linear-gradient(#001f65, #6895fd)';
        document.querySelector('.campo-pesquisa').style.opacity = '100%';
        document.querySelector('hr').style.opacity = '100%';
        document.querySelectorAll('.card').forEach(e => e.style.opacity = '100%');
        document.querySelectorAll('img').forEach(e => e.style.opacity = '100%');
        document.querySelector('.btn-tras-frente').style.opacity = '100%';
        document.querySelector('footer').style.opacity = '100%';       
        document.querySelector('.total-paginas').style.opacity = '100%'; 
    }

    window.addEventListener('click', (e) => {
        
        if(e.target === body) {
            info_conteudo.classList.remove('show');
            desativarOverlayEstilos();
        }       
    })
});