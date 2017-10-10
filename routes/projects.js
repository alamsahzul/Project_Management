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
    db.query(`SELECT * FROM users`, (err, dataUser) => {
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
      let project_id = Date.now();

      db.query(`INSERT INTO projects VALUES ($1, $2)`, [ project_name, project_id ], (err, data, next) => {
        if(err){
          console.log(err);
        }
        console.log("berhasil menyimpan ke table projects");
        let values = [];
        for(panjang; panjang>0; panjang--){
          let id_user   = `${x[panjang-1]}`;
          let role      = "default";
          let member_id = "default";
          db.query(`INSERT INTO members VALUES (${role}, ${project_id}, ${member_id}, ${id_user})`, (err, data, next) => {
            if(err){
              //console.log("Gagal Menyimpan");
            }
            //console.log("berhasil menyimpan ke table member");
            res.redirect('/projects');
          }) //query members
        } //for
      }); //query project
  }); //router post add

  router.get('/edit/:project_id',  /*loginChecker, */  function(req, res, next){
    console.log('ini adalah halaman edit project');
    let project_id = req.params.project_id;
    console.log(project_id);
    db.query(`SELECT * FROM projects WHERE project_id = ${project_id}`, (err, data) => {
      let projects_item = data;
      console.log(projects_item);
        //res.render('editProject', { title: 'Edit Project', page:'Edit Project', data: item });
    });
  });

  router.post('/edit/:project_id',  /*loginChecker, */  function(req, res, next){
    console.log('ini adalah halaman edit project');
    // let project_id = req.params.project_id;
    // console.log(project_id);

    // db.query(`SELECT * FROM projects WHERE project_id = ${project_id}`, (err, dataUser) => {
    //   let item = dataUser.rows;
    //   console.log(item);
    //     res.render('editProject', { title: 'Edit Project', page:'Edit Project', data: item });
    // });
  });

  router.get('/delete/:project_id',  /*loginChecker, */  function(req, res, next){
    console.log('ini adalah halaman delete project');
    let project_id = +(req.params.project_id);
    console.log(typeof(project_id));

    db.query(`DELETE FROM members WHERE project_id = '${project_id}'`, (err, dataUser, next) => {
      if(err) console.log(err, 'gagal dihapus');
      console.log('berhasil dihapus dari tabel members');
      db.query(`DELETE FROM projects WHERE project_id = '${project_id}'`, (err, dataUser, next) => {
        res.redirect('/projects');
      });// delete members
    }); //delete projects
  }); //router delete

  return router;
}
