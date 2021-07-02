const axios = require("axios").default;
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());


async function traduccion(texto,idioma){

    let  options = {
        method: 'GET',
        url: 'https://google-translate20.p.rapidapi.com/translate',
        params: {
          text: `${texto}`,
          tl:`${idioma}`,
          sl: 'es'
        },
        headers: {
          'x-rapidapi-key': 'caadc0caf8mshe746cc1626c8364p1bf652jsnfe8adf3373ff',
          'x-rapidapi-host': 'google-translate20.p.rapidapi.com'
        }
    };  
    const {data} = await axios.request(options);
    return data.data.translation;  
   
};

async function postReq(info,response){

    let traducciones = []
    let idiomas = info.idiomaDestino;
    
    for(let i=0;i< idiomas.length;i++){
        //console.log(idiomas[i])
        const trad = await traduccion(info.texto,idiomas[i]);
        traducciones.push({
                "idioma": idiomas[i],
                "traduccion": trad == undefined?"Idioma no válido":trad
                }
        )     
    } 
    
    return response.json(traducciones);
};

app.post("/translate",  (request,response)=>{

    /*
    BODY  DE LA PETICION
    {
    "texto" : "Hola mundo",
    "idiomaOrigen" : "es",
    "idiomaDestino" : ["en","fr","nn"]
    }
    */
    const info = request.body;
    postReq(info,response);
   
    }
);


async function idiomasDisponibles(){

    let options = {
        method: 'GET',
        url: 'https://google-translate20.p.rapidapi.com/languages',
        headers: {
          'x-rapidapi-key': 'caadc0caf8mshe746cc1626c8364p1bf652jsnfe8adf3373ff',
          'x-rapidapi-host': 'google-translate20.p.rapidapi.com'
        }
      };
      
    const {data} = await axios.request(options);
    return data.data;

}

async function getReq(idioma,response){

    const listaIdiomas = await idiomasDisponibles();
    console.log(listaIdiomas)

    let diccionario = {}
    diccionario[idioma] = listaIdiomas[idioma] == undefined? "Idioma no soportado para traducción":listaIdiomas[idioma]
    return response.json(diccionario)
}

app.get("/language", (request,response)=>{
    /*
    se recibe un id y retorna el nombre del idioma
    BODY DE LA PETICION
    {
    "idioma" : "es"

    }
    */
    const info = request.body;
    getReq(info.idioma,response);
    //response.json({"respuesta":"Holaa"})
    }

);
   

const puerto = 8000;
app.listen(puerto, ()=> console.log(`Server started and running on port ${puerto}...` ));

/*
async function postReq(info,response){

    const listaIdiomas = await idiomasDisponibles();

    let traducciones = []
    let idiomas = info.idiomaDestino;//['en','fr','it','pt']
    
    for(let i=0;i< idiomas.length;i++){
        //console.log(idiomas[i])
        const trad = await traduccion(info.texto,idiomas[i]);
        traducciones.push({
                "idioma": idiomas[i],
                "traduccion": trad == undefined?"Idioma no válido":trad
                }
        )     
    } 
    return response.json(traducciones);
};
*/