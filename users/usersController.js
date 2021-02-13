const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');
//session no index. É global para a aplicação e com o explress-session é salva por padrão na memoria ram do servidor


//pagina de login
router.get("/login", (req, res) =>{

	res.render("admin/users/login");
});


//Autenticação de usuario
router.post("/authenticate", (req, res) =>{

	var login = req.body.login;
	var password = req.body.password;


	User.findOne({ where: {login: login}}).then(user =>{

		if(user != undefined){//se existir um usuario

			console.log("Login:   " +user.login + " Nome: " +user.name);
			//validar senha
			var correct = bcrypt.compareSync(password, user.password); //user.password

			if (correct) {
				req.session.user = {
					id: user.id,
					name: user.name,
					login: user.login
				}
				//res.json(req.session.user);
				res.redirect("/admin/users")
			}else{
				res.redirect("/login");
			}
		}else{
			res.redirect("/login");
		}
	});
});


//logout
router.get("/logout", (req, res) => {

	req.session.user = undefined;

	res.redirect("/");
});



//Lista de usuarios
router.get("/admin/users", adminAuth, (rec,res) =>{

	User.findAll().then(users =>{
		
			res.render("users",{users});
		

	});	

});


//cadastrar novo usuario
router.get("/admin/users/new", adminAuth, (rec,res) =>{

	res.render("new");

});


//salva o novo usuario no banco de dados
router.post("/users/create", adminAuth,(rec,res) =>{

	var name = rec.body.name;
	var login = rec.body.login;
	var password = rec.body.password;


	var salt = bcrypt.genSaltSync(10); //"sal" para incrementar o hash de senha com bcryptjs
	var hash = bcrypt.hashSync(password, salt);//gerando o hash da senha


	User.findOne({
		where: {
			login: login
		}
	}).then(user =>{

		if (user) {

			res.send("Usuario já existe no banco de dados!")

		}else{

			User.create({
				name: name,
				login: login,
				password: hash

			}).then(() => {
				res.redirect('/admin/users')
			}).catch((err) => {
				res.redirect('/admin/users')

			});

		}


	});

	

});



//Deletar usuario
router.post("/users/delete", adminAuth, (req, res) => {
	 var id = req.body.id;//input escondido

	 if(id != undefined){
	 	if(!isNaN(id)){

	 		User.destroy({
	 			where: {
	 				id: id
	 			}
	 		}).then(() => res.redirect("/admin/users"));
	 		
	 	}else{//se não for um numero
	 		res.redirect("/admin/users")	

	 	}

	 }else{//null
	 	res.redirect("/admin/users")
	 }

});


//Editar usuario
router.get("/admin/users/edit/:id", adminAuth, (req, res) =>{

	var id = req.params.id;


	if(isNaN(id)){
		res.redirect("/admin/users");
	}


	User.findOne({where: {id: id}}).then(user =>{

		res.render("edit", {user: user});

	});	

});

//Salva alterações no banco
router.post("/users/update", adminAuth, (req, res) =>{

	var id = req.body.id;
	var name = req.body.name;
	var login = req.body.login;
	var password = req.body.password;


	var salt = bcrypt.genSaltSync(10); //"sal" para incrementar o hash de senha com bcryptjs
	var hash = bcrypt.hashSync(password, salt);//gerando o hash da senha

	User.update({name: name, login: login, password: hash},{
		where: {id: id}
	}).then(()=>{
		res.redirect("/admin/users");
	})

});


module.exports = router;