const fs = require('fs');
let randomcolor = require('randomcolor');
const State = require('./State.js');
const { CanvasRenderService } = require('chartjs-node-canvas');
class Game{
    constructor(){
        this.estados = []
        this.numeroFederacao = 3;
    }


    gerarNumeroAleatorio = (min,max) =>{
        return Math.floor(Math.random() * (max - min) + min);
    }



    generateChloropleth =  async () =>{
        try{
            let canvasRenderService = new CanvasRenderService(400,400); 
            let configuration = {

            }

            const imageBuffer = await canvasRenderService.renderToBuffer(configuration);
            let data = Date.now();
            fs.writeFileSync('../'+String(data)+".png",imageBuffer);
        }catch(e){
            console.log(e);
        }
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
        let estados = JSON.parse(fs.readFileSync('../db/novodb2.json'));
        let listaCores = this.gerarCores();
        for(let i=0;i<this.numeroFederacao;i++){
            this.estados.push(new State(listaCores[i],estados[i].fronteira,estados[i].nome,estados[i].sigla,[]));
        }
    }

    checkWinner = () => {
        for(let estado of this.estados){
            if(estado.conqueredStates.length == 2){
                return this.estados.indexOf(estado);
            }
        }
        return -1;
    }



    realizarTurno = () => {
        let estado = null ;
        while(true){
            let estadoJogador = this.gerarNumeroAleatorio(0,this.numeroFederacao);
            let fronteiras =  this.estados[estadoJogador].neighbors.filter((item)=>{
                    return (this.estados[item].dono!=this.estados[estadoJogador]) || (this.estados[item] != this.estados[estadoJogador].dono)
                });
            console.log(fronteiras);
            let conquistouTodasAsFronteiras = fronteiras.length == 0    
            if(!conquistouTodasAsFronteiras){
                estado = this.estados[estadoJogador];
                break;
            }
        }
        let fronteirasNaoConquistadas = estado.neighbors.filter(item=>{
            return (this.estados[item].dono != estado) && (estado.dono != this.estados[item]);
       });
        let fronteiraEscolhida = this.gerarNumeroAleatorio(0,fronteirasNaoConquistadas.length);
        let conseguiuAnexar = this.gerarNumeroAleatorio(0,10);
        //console.log(fronteirasNaoConquistadas);
        //console.log(fronteiraEscolhida);
        //console.log(fronteirasNaoConquistadas[fronteiraEscolhida]);
        fronteiraEscolhida = this.estados[fronteirasNaoConquistadas[fronteiraEscolhida]];
        //console.log("Fronteira Escolhida:"+fronteiraEscolhida);
        /*if(conseguiuAnexar %2 != 0){
            console.log(estado.name+" falhou ao tentar atacar "+fronteiraEscolhida.name);
            return;
        }*/
        if(estado.dono != null){
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
            while(true){
                let winner = this.checkWinner();
                if( winner > -1){
                    //ENVIA PRO TWITTER
                    console.log(this.estados[winner].name+" Conquistou o Brasil");
                    break;
                }
                console.log("Realizando turno");
                this.realizarTurno();
               // await new Promise(r=>setTimeout(r,1000));
            }
        }catch(e){
            console.log(e);
        }
    }

}

let game = new Game();
game.tick();