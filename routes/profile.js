'use strict'

const express       = require('express');
const router        = express.Router();
const loginChecker  = require('../helpers/loginChecker');

module.exports = function(db){

  router.get('/', function(req, res, next){
    console.log('ini adalah halaman profile');
    let email = req.session.email;
    console.log(email);
    db.query(`SELECT email, position, type FROM users WHERE email = $1`, [email], (err, dataUser) => {
      if(err){
        res.redirect('/projects')
      }
    //   let item  = dataUser.rows[0];
      //console.log(item);
      // let user_id = dataUser.rows[0].user_id;
      // console.log('user id : ',user_id);
      // db.query(`SELECT role FROM members WHERE user_id = $1`, [user_id], (err, data_member) =>{
      //   console.log('sukses');
      //   console.log(user_id);
        // let position = data_member.rows[0].role;
      console.log('halaman update profile');
      console.log(dataUser.rows[0]);
      res.render('users/profile', { title: 'profile', page:'PROFILE', dataUser:dataUser.rows[0] });
      // });
    });
  });

  router.post('/', /*loginChecker,*/ function(req, res, next){
    console.log('ini adalah halaman post profile');
    let email    = req.session.email;
    let password = req.body.password;
    let position = req.body.position;
    let type     = req.body.type;

    db.query('UPDATE users SET password=$1, position=$2, type=$3 WHERE email=$4', [password, position, type, email], (err, data) => {
      console.log('berhasil',data);
      res.redirect('/');
    });
  });


  return router;
}
