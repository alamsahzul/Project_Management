'use strict'

const express   = require('express');
const router    = express.Router();
const app       = express();

module.exports = function(db){
  //####  ROUTER HALAMAN UTAMA/LOGIN
  router.get('/', function(req, res, next) {
    console.log('halaman login');
    if(req.session.email){
      res.redirect('/projects');
    }else{
      res.render('index', {title: "PMS"});
    }
  }); //penutup ROUTER HALAMAN UTAMA/LOGIN

  //####  ROUTER PROSES LOGIN
  router.post('/', function(req, res, next) {
    let input_email     = req.body.email,
        input_password  = req.body.password;
    //console.log(email);
    db.query(`SELECT * FROM users WHERE password = $1 AND email = $2`, [input_password, input_email], (err, data) => {
      console.log('data.rows.length: ',data.rows.length);
      if (data.rows.length == 1){
        req.session.email = data.rows[0].email;
        let email = req.session.email;
        console.log('email',email);
        res.redirect('/projects');
      }
      else {
        console.log("tidak ditemukan");
        res.redirect('/');
      }
   }); //penutup client query
  }); //penutup rROUTER LOGIN

  //####  ROUTER LOGOUT
  router.get('/logout', (req, res, next) => {
    req.session.destroy(()=>{
      res.redirect('/')
    });
  }); //PENUTUP ROUTER LOGIN

  router.get('/register', (req, res,  next) => {
    console.log("halaman register");
    res.render('register')
  })

  router.post('/register', (req, res,  next) => {
    console.log("Halaman post register");
    let email     = req.body.email,
        password  = req.body.password,
        firstname = req.body.firstname,
        lastname  = req.body.lastname,
        type      = req.body.type
        console.log(email, password, firstname, lastname, type);
        db.query(`INSERT INTO users VALUES ($1, $2, $3, $4, $5)`, [email, password, firstname, lastname, type], (err, data) => {
          if (data){
            console.log("sukses");
            res.redirect('/');
          }else {
            res.send("Gagal Menyimpan User")
          }
        });
  });

  return router;
}
