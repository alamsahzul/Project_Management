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
        res.render('addProject', { title: 'Add Project', page:'Add Project', data: item });
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
              return res.send(err);
            }
            //console.log("berhasil menyimpan ke table member");
            res.redirect('/projects');
          }) //query members
        } //for
      }); //query project
  }); //router post add

  router.get('/detail/:project_id',  /*loginChecker, */  function(req, res, next){
    console.log('ini adalah halaman detail project');
    let project_id = req.params.project_id;
    let url = req.url;

    db.query(`SELECT * FROM projects AS pr JOIN members AS mem
              ON pr.project_id = mem.project_id JOIN users
              ON mem.user_id = users.user_id
              WHERE pr.project_id = '1507608167548'`, (err, data_project) => {

      let panjang = data_project.rows.length;

      if(req.url == `/detail/${project_id}?page=activity`){
        console.log('ini adalah halaman activity');
        res.render('activityProject', { title: 'Activity Project', page:'Activity Project', data: data_project.rows, panjang:panjang });
      }else if(req.url == `/detail/${project_id}?page=members`){
        console.log('ini adalah halaman members');
        console.log(data_project.rows[0].role);       
        // db.query(`SELECT * FROM projects AS pr JOIN members AS mem
        //           ON pr.project_id = mem.project_id JOIN users
        //           ON mem.user_id = users.user_id
        //           WHERE pr.project_id = '1507608167548'`, (err, data_project) => {
            res.render('membersProject', { title: 'Members of Project', page:'Members Project', data: data_project.rows, panjang:panjang });
                  // })
      }else if(req.url == `/detail/${project_id}?page=issues`){
        console.log('ini adalah halaman issues');
        res.render('issuesProject', { title: 'Issues of Project', page:'Issues Project', data: data_project.rows, panjang:panjang });

      }else{
        console.log('ini adalah halaman members');
        res.render('detailProject', { title: 'Detail Project', page:'Detail Project', data: data_project.rows, panjang:panjang });
      }
    });
  });


  router.get('/edit/:project_id',  /*loginChecker, */  function(req, res, next){
    console.log('ini adalah halaman edit project');
    let project_id = req.params.project_id;
    console.log(project_id);
    db.query(`SELECT * FROM projects WHERE project_id = ${project_id}`, (err, data) => {
      let projects_item = data;
      //console.log(projects_item);
        //res.render('editProject', { title: 'Edit Project', page:'Edit Project', data: item });
    });
  });

  router.post('/edit/:project_id',  /*loginChecker, */  function(req, res, next){
    console.log('ini adalah halaman edit project');
    // let project_id = req.params.project_id;
    // console.log(project_id);

    // db.query(`UPDATE projects WHERE project_id = ${project_id}`, (err, dataUser) => {
    //   let item = dataUser.rows;
    //   console.log(item);
    //     res.render('editProject', { title: 'Edit Project', page:'Edit Project', data: item });
    // });
  });

  router.get('/delete/:project_id',  /*loginChecker, */  function(req, res, next){
    console.log('ini adalah halaman delete project');
    let project_id = +(req.params.project_id);
    db.query(`DELETE FROM members WHERE project_id = '${project_id}'`, (err, dataUser, next) => {
      if(err) console.log(err, 'gagal dihapus');
      console.log('berhasil dihapus dari tabel members');
      db.query(`DELETE FROM projects WHERE project_id = '${project_id}'`, (err, dataUser, next) => {
        res.redirect('/projects');
      });// delete members
    }); //delete projects
  }); //router delete

  return router;
}// exports
