class State{
    constructor(color,neighbors,name,sigla,conqueredStates){
        this.color = color;
        this.neighbors = neighbors;
        this.name = name;
        this.sigla = sigla;
        this.conqueredStates = conqueredStates
        this.dono = null;
    }

    changeColor = (color) =>{
        this.color = color;
    }

   /* addNeighbors = (neighbors) => {
        this.neighbors =  this.neighbors.concat(neighbors).filter((item)=>{
            let neighbors = this.neighbors;
            return (!neighbors.includes(item)) && item != this.name;
        })
    }

    removeNeighbors = (neighbors) => {
        this.neighbors = this.neighbors.filter((item)=>{
                return !neighbors.includes(item);
        })
    }*/


    addConqueredState = (conqueredState) => {
        // console.log("Capturador : " + this.name);
        // console.log("Capturado: " + conqueredState.name);
        conqueredState.changeColor(this.color);
        if(conqueredState.dono){
            conqueredState.dono.removeConqueredState(conqueredState);
        }
        else{
            conqueredState.conqueredStates.forEach(item => {
                // console.log(this.game.estados.length);
                // console.log("id do estado: "+item.name);
                this.addConqueredState(item);
            });
        }
        /*this.addNeighbors(conqueredState.neighbors);*/
        this.conqueredStates.push(conqueredState);
        conqueredState.dono = this;
    }

    removeConqueredState = (conqueredState) =>{
        this.conqueredStates = this.conqueredStates.filter((item)=>{
            return conqueredState != item;
        });
        //this.removeNeighbors(conqueredState.neighbors)

    }

}

module.exports = State;