const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const connection  = require("./database/connection");
const session = require("express-session");


const usersController = require("./users/usersController");//app.use para funcionar o router


const User = require("./users/User");



//connection 
connection
	.authenticate()
	.then(() => {
		console.log('Conexão feita com o banco de dados.')
	})
	.catch((err) => {
		console.log(err)
	})	


app.set('view engine', 'ejs');
app.use(express.static("public"));

//session
app.use(session({
	secret: "az319kjudd894kid", cookie: {maxAge: 99999999999999999999}
}))

//body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//rotas

//pagina de login
app.get('/login', (req, res) => {
	
	res.render('login');
	
});



app.use('/',usersController);



//Iniciando o servidor
app.listen(8080,(err) =>{
	if(err){
		console.log(err)
	}else{
		console.log("Servidor iniciado com sucesso.")
	}
});
