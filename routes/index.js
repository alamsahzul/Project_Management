'use strict'

const express   = require('express');
const router    = express.Router();
const app       = express();

module.exports = function(db){
  //####  ROUTER HALAMAN UTAMA/LOGIN
  router.get('/', function(req, res, next) {
    console.log('halaman login');
    if(req.session.email){
      res.redirect('/project');
    }else{
      res.render('index', {title: "PM"});
    }
  }); //penutup ROUTER HALAMAN UTAMA/LOGIN

  //####  ROUTER PROSES LOGIN
  router.post('/', function(req, res, next) {
    let email = req.body.email,
    password  = req.body.password;
    console.log(email);
    db.query(`SELECT * FROM users WHERE password = $1 AND email = $2`, [password, email], (err, data) => {
      console.log(data.rows.length);
      if (data.rows.length == 1){
        req.session.email = data.rows[0].email;
        let email = req.session.email;
        console.log(email);
        res.redirect('/projects');
      }
      else {
        console.log("tidak ditemukan");
        res.redirect('/');
      }
   }); //penutup client query
  }); //penutup rROUTER LOGIN

  //####  ROUTER LOGOUT
  router.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
      res.redirect('/')
    });
  }); //PENUTUP ROUTER LOGIN
  return router;
}
