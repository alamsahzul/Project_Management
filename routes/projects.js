'use strict'

const express       = require('express');
const router        = express.Router();
const loginChecker  = require('../helpers/loginChecker');


module.exports = function(db){

  router.get('/',  /*loginChecker, */  function(req, res, next) {
    console.log('halaman projects');
    console.log(req.session.email);
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
    console.log('ini adalah add halaman project');
    let email = req.session.email;
    console.log(req.session.email);
    db.query(`SELECT * FROM users`, (err, dataUser) =>{
      let item = dataUser.rows;
      console.log(item);
      //db.query(`SELECT role FROM members WHERE user_id = $1`, [user_id], (err, data_member) =>{
        // console.log(user_id);
        res.render('addProject', { title: 'Add Project', page:'Add Project', data: item });
      //});
    });
  });

  router.post('/add', /*loginChecker, */  function(req, res, next){
    console.log('ini adalah halaman post projects');
      let project_name = req.body.project_name;
      let x = req.body.user_id;
      let panjang = x.length;
      // console.log(panjang);
      // db.query(`INSERT INTO users VALUES ($1, $2, $3, $4, $5)`, [email, password, firstname, lastname, type], (err, data) => {
      //   if (data){
      //     console.log("sukses");
      //     res.redirect('/');
      //   }else {
      //     res.send("Gagal Menyimpan User")
      //   }
      // });
      db.query(`INSERT INTO projects VALUES ($1)`, [ project_name ], (err, data) => {
        if(err){
          console.log(err);
        }
        for(panjang; panjang>0; panjang--){
          let id_user = `${x[panjang-1]}`;
          console.log(id_user);
        }
        res.redirect('/projects');
      });
  });

  return router;
}
