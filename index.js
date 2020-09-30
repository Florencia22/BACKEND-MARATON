/*
    Backend E-commerce

    Nota del cliente: 
    "Necesito un servicio RESTFul que me permita registrar un listado de productos comprados, precio, identificador de cliente y metodo de pago"

    Modelo de datos : 
    {
        "id": string,
        "clientId": string,
        "products": Array[], (Se guarda el identificador de producto, string)
        "amount": number,
        "paymentMethod": "Credit Card" | "Cash" | "Bitcoin"
    }

    Ejemplo:
    {
        "id": "adkjfh",
        "clientId": "1000",
        "products": ["100","300","400","500","600","700","800"],
        "amount": 10000,
        "paymentMethod": "Credit Card"
    }
*/

/*

MARATON BACKEND

1) Completar el servicio API REST, está incompleto.
2) Crear pruebas utilizando POSTMAN para todas las rutas (GET/POST/PUT/DELETE).
3) Validar en la carga/modificación (POST/PUT) que recibimos todos los datos necesarios. Sino, informar error de request.
4) Agregar al modelo de datos el atributo: createdAt (Date). Se debe cargar la fecha actual.  
5) BONUS: Crear un front-end simple que permita hacer una carga de datos desde un formulario. Respetando el modelo de datos.
6)  Elegí algún ejercicio de la maratón, e intenta encontrar una nueva forma de resolución, que sea distinta a la primera. 
7) Si fueses mentor/a, y tuvieses que pensar un ejercicio para la maratón, ¿Cuál sería? Te proponemos inventar un ejercicio nuevo que implique poner en práctica los conocimientos vistos hasta acá sobre Backend. 
Para finalizar:
A cada estudiante le tocará corregir el código de algún compañero/a. Tendrán que darle una devolución por escrito, marcando los aciertos y desaciertos, y las cosas que se pueden mejorar. Tengan en cuenta, a la hora de escribir, que el mensaje sea lo más organizado posible, para que el texto tenga claridad a la hora de leerse. Además, entendiendo que tendrán que juzgar el trabajo de un compañero/a, trabajen desde la empatía, para lograr una evaluación constructiva.
*/


const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const uniqid = require("uniqid");

const app = express();
const PORT = 3001;

//////////////////// Aplico Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));


///////////////////// Init Array de Compras. (Simulo una Base de datos)
const compras = [
  {
    id: "0Fg",
    clientId:"5000",
    products: ["100","300","400","500","600","700","800"],
    amount: 10000,
    paymentMethod:"Credit Card",
    

},

{
  id: "1Hg",
  clientId: "5001",
  products: ["150","320","450","560","610","730","840"],
  amount: 20500,
  paymentMethod: "Cash",
},
{
  id: "2Rs",
  clientId: "5002",
  products: ["250","350","480","510","625","760","881"],
  amount: 21600,
  paymentMethod: "Bitcoins",


}





];




//////////////////// Defino Rutas, me baso en el modelo REST


app.get("/compras", function (req, res) {
  res.status(200).send({ "compras":compras });
});

app.get("/compras/:id", function (req, res) {
  const id = req.params.id;
  console.log("id: ",id);

  let compraEncontrada =  undefined;

  compras.forEach(function(compra){
    if(compra.id == id){
      let compraEncontrada = compra;
      return res.status(200).json(
        {compra:compraEncontrada});

   
     }
  });
  
  res.status(404).send({"message":"Compra Not Found - 404"});
});

app.post("/compras", function (req, res)
{
  let nuevaCompra = req.body;

  const DATOS_OK = validarExistenciaDatos(nuevaCompra); // Retorna true o false.

  if ( DATOS_OK )
  {
    // Se termina de conformar el objeto compra.
    nuevaCompra = agregarIDYFecha(nuevaCompra);

    // Se agrega
    compras.push(nuevaCompra);

    // Aviso por consola.
    console.log("//---------------------------------------------------------------\n ");
    console.log(`   >> Compra ${nuevaCompra.id}: Agregada a lista de compras.\n.`);
    console.log("//---------------------------------------------------------------\n ");

    res.status(201).send({mensaje: `Compra ${nuevaCompra.id}: Agregada a lista de compras.`});
  }
  else
  {
    // Aviso por consola.
    console.log("//---------------------------------------------------------------\n ");
    console.log(`   >> No se han recibido elementos crear la compra.\n.`);
    console.log("//---------------------------------------------------------------\n ");
    
    res.status(404).send({error: `No se han recibido elementos crear la compra.`});
  }
});

app.put("/compras/:id", function (req, res)
{
  // Guardo en constantes:
  //   - El ID a reemplazar.
  const ID_REPLACE = req.params.id;
  //   - El nuevo elemento a ubicar en la poscición que posiblemente se encuentre ID_REPLACE.
  
  let nuevaCompra = req.body;

  // Busco ID_REPLACE en el arreglo.
  const INDICE_ID_REPLACE = compras.findIndex(function(compra) { return compra.id == ID_REPLACE });
  // El método findIndex() devuelve el índice del primer elemento de un array que cumpla con la 
  // función de prueba proporcionada. En caso contrario devuelve -1
  // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/findIndex

  if ( INDICE_ID_REPLACE > -1 )
  {
    const DATOS_OK = validarExistenciaDatos(nuevaCompra); // Retorna true o false.

    if ( DATOS_OK )
    {
      // Agrego ID original de la compra al objeto que se recibío.
      nuevaCompra = mantenerIdOriginal(nuevaCompra, ID_REPLACE);

      // Reemplazo.
      compras.splice(INDICE_ID_REPLACE, 1, nuevaCompra);
      // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/splice

      // Aviso por consola.
      console.log("//---------------------------------------------------------------\n ");
      console.log(`   >> Compra ${nuevaCompra.id}: Actualizada en lista de compras.\n.`);
      console.log("//---------------------------------------------------------------\n ");

      res.status(201).send({mensaje: `Compra ${nuevaCompra.id}: Actualizada en lista de compras.`});
    }
    else
    {
      // Aviso por consola.
      console.log("//---------------------------------------------------------------\n ");
      console.log(`   >> No se han recibido elementos actualizar la compra.\n.`);
      console.log("//---------------------------------------------------------------\n ");
      
      res.status(404).send({error: `No se han recibido elementos actualizar la compra.`});
    }
  }
  else
  {
    // Aviso por consola.
    console.log("//---------------------------------------------------------------\n ");
    console.log(`   >> No se ha encontrado el ID de la compra a actualizar.\n.`);
    console.log("//---------------------------------------------------------------\n ");
    
    res.status(404).send({error: `No se ha encontrado el ID de la compra a actualizar.`});
  }
});





app.delete("/compras/:id", function (req, res) {
  const ID = req.params.id;
  let index = null;
  compras.forEach(function(Compra, i){
      if(compra.id == ID) { 
          index = i;
      }
  })

  if(index!== null){
      compras.splice(index,1);
      res.status(200).send({message:"Compra was deleted"});
  }else{
      res.status(404).send({message:"Compra was not founded"});
  }


});







//////////////////// Ahora que tengo todo definido y creado, levanto el servicio escuchando peticiones en el puerto


function getNextID(){
    
  return  (compras.reduce((a, b) => { return a.id > b.id? a: b })).id + 1;
}
app.listen(PORT, function () {
  console.log(`Maraton Guayerd running on PORT: ${PORT}. Visit http://localhost:${PORT}/ to see.`);
})
