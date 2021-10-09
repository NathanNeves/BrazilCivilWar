const fs  = require('fs');
const mapa = [
    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Espírito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rio Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins",
    "Distrito Federal"
]
/*async function main(){
    try{
        const fronteira = fs.readFileSync('./db/fronteiras.json');
        let db = require('./db/db');
        fronteiraObj = JSON.parse(fronteira);
        let arrObj2 = [];
        console.log(db);
        for(let i=0;i<27;i++){
            auxObj = {...db[i]};
            console.log(auxObj);
            auxObj.fronteira = fronteiraObj[i].Fronteiras.split(',').map(item=>{
                console.log(item.trim())
                console.log(mapa.indexOf(item.trim()))
                return mapa.indexOf(item.trim());
            });
            arrObj2.push(auxObj);
        }
        fs.writeFileSync("./db/novodb.json",JSON.stringify(arrObj2));
    }catch(e){
        console.log(e);
    }
}*/


main();