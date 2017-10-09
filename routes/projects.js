'use strict'

const express       = require('express');
const router        = express.Router();
const loginChecker  = require('../helpers/loginChecker');


module.exports = function(db){

  router.get('/', /*loginChecker, */ function(req, res, next) {
    console.log('halaman projects');
    db.query('SELECT * FROM projects', (err, data) => {
      if(err){
        res.send('error');
      }else {
        let panjang = data.rows.length;
        console.log('panjang', panjang);
        res.render('projects', { title: 'Projects', page:'PROJECTS', data: data.rows, panjang: panjang });
      }
    })
  });


  router.get('/add',  /*loginChecker, */  function(req, res, next){
    console.log('ini adalah halaman project');
    //let email = req.session.email;
    // db.query(`SELECT * FROM users WHERE email = $1`, [email], (err, dataUser) =>{
    //   let item = dataUser.rows[0];
    //   console.log(item);
    //   let user_id = dataUser.rows[0].user_id;
    //   console.log('user id : ',user_id);
      // db.query(`SELECT role FROM members WHERE user_id = $1`, [user_id], (err, data_member) =>{
      //   console.log('sukses');
      //   console.log(user_id);
        // let position = data_member.rows[0].role;
       res.render('addProject', { title: 'Add Project', page:'Add Project'});
       //res.redirect('/');
      // });
    // });
  });

  router.post('/add', /*loginChecker, */  function(req, res, next){
    console.log('ini adalah halaman post projects');
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
