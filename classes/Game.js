const fs = require('fs');
let randomcolor = require('randomcolor');
const State = require('./State.js');
let osmsm = require('osm-static-maps');

class Game{
    constructor(){
        this.estados = []
        this.numeroFederacao = 27;
    }


    gerarNumeroAleatorio = (min,max) =>{
        return Math.floor(Math.random() * (max - min) + min);
    }



    generateMap =  async () =>{
        let json = fs.readFileSync('../db/brazil-states.json');
        let geojson = JSON.parse(json);
        let features = [];
        console.log(geojson);
        for(let estado of this.estados){
            for(let geo of geojson.features){
                if(geo.properties.sigla == estado.sigla){
                    console.log(estado.color);
                    geo.pathOptions = {
                        color:estado.color,
                        fill:true
                    }
                    features.push(geo);
                }
            }
            
        }
        geojson.features = features
        console.log(geojson.features);
        osmsm({geojson: geojson}).then(function(imageBinaryBuffer) {
            fs.writeFileSync("../image.png",imageBinaryBuffer);
            return;
        })
    }

    gerarCores = () =>{
        let  listaCores = [];
        for(let i=0;i<28;i++){
           let cor  = randomcolor();
           if(listaCores.indexOf(cor) > -1){
                i--
                continue;
           }
           if(listaCores.length == this.numeroFederacao){
               break;
           }
           listaCores.push(cor);
        }
        return listaCores;
    }

    startGame = () => {
        let estados = JSON.parse(fs.readFileSync('../db/novodb.json'));
        let listaCores = this.gerarCores();
        for(let i=0;i<this.numeroFederacao;i++){
            this.estados.push(new State(listaCores[i],estados[i].fronteira,estados[i].nome,estados[i].sigla,[]));
        }
    }

    checkWinner = () => {
        for(let estado of this.estados){
            if(estado.conqueredStates.length == this.numeroFederacao - 1){
                return this.estados.indexOf(estado);
            }
        }
        return -1;
    }
    escolheJogador = () => {
        let estado = null ;
        while(true){
            let estadoJogador = this.gerarNumeroAleatorio(0,this.numeroFederacao);
            let fronteiras =  this.estados[estadoJogador].neighbors.filter((item)=>{
                    let fronteiraDoEscolhido = this.estados[item];
                    let escolhido = this.estados[estadoJogador];
                    return (fronteiraDoEscolhido.dono!=escolhido) && (fronteiraDoEscolhido != escolhido.dono)
                });
            console.log(fronteiras);
            let conquistouTodasAsFronteiras = fronteiras.length == 0    
            if(!conquistouTodasAsFronteiras){
                estado = this.estados[estadoJogador];
                break;
            }
        }
        return estado;
    }

    realizarTurno = () => {
        let estado = this.escolheJogador();
        
        let fronteirasNaoConquistadas = estado.neighbors.filter(item=>{
            return (this.estados[item].dono != estado) && (estado.dono != this.estados[item]);
       });
        let fronteiraEscolhida = this.gerarNumeroAleatorio(0,fronteirasNaoConquistadas.length);
        //console.log(fronteirasNaoConquistadas);
        //console.log(fronteiraEscolhida);
        //console.log(fronteirasNaoConquistadas[fronteiraEscolhida]);
        fronteiraEscolhida = this.estados[fronteirasNaoConquistadas[fronteiraEscolhida]];
        //console.log("Fronteira Escolhida:"+fronteiraEscolhida);
        /*if(conseguiuAnexar %2 != 0){
            console.log(estado.name+" falhou ao tentar atacar "+fronteiraEscolhida.name);
            return;
        }*/
        let conseguiuAnexar = this.gerarNumeroAleatorio(0,10);
        if(estado.dono != null){
            console.log("puppetered : " + estado.name + " por : " + estado.dono.name);
            estado.dono.addConqueredState(fronteiraEscolhida); 
            console.log(estado.dono.name+ " conquistou o estado "+fronteiraEscolhida.name );
            return;
        }

        estado.addConqueredState(fronteiraEscolhida);
        console.log(estado.name+ " conquistou o estado "+ fronteiraEscolhida.name);
    }

    tick = async() =>{
        try{
            this.startGame();
            let contadorDeTurnos = 0;
            while(true){
                let winner = this.checkWinner();
                if( winner > -1){
                    //ENVIA PRO TWITTER
                    console.log(this.estados[winner].name+" Conquistou o Brasil");
                    console.log("Jogo durou "+contadorDeTurnos+" turnos");
                    break;
                }
                console.log("Realizando turno");
                this.realizarTurno();
                contadorDeTurnos++;
            //    await new Promise(r=>setTimeout(r,1000));
            }
        }catch(e){
            console.log(e);
        }
    }

}

let game = new Game();
game.tick();