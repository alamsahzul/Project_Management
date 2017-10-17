'use strict'

const express       = require('express');
const router        = express.Router();
const loginChecker  = require('../helpers/loginChecker');


module.exports = function(db){

  router.get('/',  loginChecker, function(req, res, next) {
    console.log('halaman projects');
    // console.log('ini req.session.email', req.session.email);
    let user_id = req.session.user_id;

    let bagianWhere     = [];
    let where_status    = false;
    let check_id        = req.query.check_id;
    let project_id      = req.query.project_id;
    let check_name      = req.query.check_name;
    let project_name    = req.query.project_name;
    let check_members   = req.query.check_members;
    let project_members = req.query.project_members;
    let halaman         = Number(req.query.page) || 1;
    let url             = (req.url == "/") ? "/?page=1" : req.url;
    console.log(url);

    if (url.indexOf('&cari=') != -1){
      halaman = 1;
    }
    url = url.replace('&cari=','')
    if(check_id && project_id ){
      bagianWhere.push( `projects.project_id='${project_id}'` );
      where_status = true;
    }
    if(check_name && project_name){
      bagianWhere.push( `projects.project_name='${project_name}'` );
      where_status = true;
    }
    if(check_members && project_members){
      bagianWhere.push( `members.user_id='${project_members}'` );
      where_status = true;
    }

    let sql = 'SELECT COUNT(DISTINCT M.project_id) FROM members AS M JOIN projects AS P ON P.project_id=M.project_id';
    if(where_status){
      sql += ' WHERE ' + bagianWhere.join(' AND ');
    }
    console.log('TES 1: ',sql, 'RESULT: OK');
    db.query(sql, (err, count) => {
      if(err){
        res.send('error');
      }else {
        let totalRecord   = count.rows[0].count;
        let limit         = 5;
        let offset        = (halaman-1)*limit;
        let jumlahHalaman = (totalRecord == 0) ? 1 : Math.ceil(totalRecord/limit);

        // filer yang akan ditampilkan
        let show                      = [];
        let showStatusProjectId       = true;
        let showStatusProjectName     = true;
        let showStatusProjectMembers  = true;

        //jika option id dipilih
        let showProjectId   = req.query.check_show_project_id;
        if(!showProjectId){
          showProjectId        = 'members.project_id';
          showStatusProjectId  = false;
        }else {
          showStatusProjectId  = true;
        }
        show.push(showProjectId)

        //jika option project name dipilih
        let showProjectName = req.query.check_show_project_name;
        if(showProjectName){
          show.push(showProjectName)
          showStatusProjectName = true;
        }else{
          showStatusProjectName = false;
        }

        //jika option members project dipilih
        let showProjectMembers = req.query.check_show_project_members;
        if(showStatusProjectMembers){
          show.push(showStatusProjectMembers)
          showStatusProjectMembers = true;
        }else{
          showStatusProjectMembers = false;
        }

        console.log("TES 2 showStatusProjectName:",showStatusProjectName);
        console.log('TES 3 showStatusProjectId:',showStatusProjectId);
        show                = show.toString() || '*'
        // console.log('TES 4 show:',show);
        console.log('TES 5 user_id:',user_id);

        let sql = 'SELECT DISTINCT users.firstname, users.lastname FROM members JOIN users ON members.user_id = users.user_id';
        db.query(sql, (err, dataMember) => {
          let memberUser = dataMember.rows;
          let sql = `SELECT view from users WHERE user_id = '${user_id}'`;
          db.query(sql, (err, dataView) => {
            let view = dataView.rows[0].view;
            console.log('TES 6 view:', view);
            // query untuk menampilkan hasil pencarian
            sql = `SELECT ${view} FROM members JOIN projects ON members.project_id = projects.project_id`;
            if(where_status){
              sql += ' WHERE ' + bagianWhere.join(' AND ');
            }

            sql+= ` LIMIT ${limit} OFFSET ${offset}`
            console.log('TES 7 SQL project:', sql);
            db.query(sql, (err, dataProject) => {
              // let project = dataProject.rows;
              console.log('count',count.rows);
              console.log('dataMember.rows',dataMember.rows);
              console.log('dataView.rows',dataView.rows);
              console.log('project',dataProject.rows[0].project_name);
              console.log(count.rows[0].count);
              res.render('projects/projects', {title: 'Projects', page:'PROJECTS', panjang:count.rows[0].count, dataMembers:dataMember.rows, dataProject:dataProject.rows, halaman:halaman, jumlahHalaman: jumlahHalaman, query: req.query, url:url })
            }); //query data project
          }); //query data view
        }); //query data member

      }
    })
  });


  router.get('/addProject',  /*loginChecker, */  function(req, res, next){
    console.log('ini adalah add halaman project');
    let email = req.session.email;
    console.log(req.session.email);
    db.query(`SELECT * FROM users`, (err, dataUser) => {
      let item = dataUser.rows;
      console.log(item);
        res.render('projects/addProject', { title: 'Add Project', page:'Add Project', data: item });
    });
  });

  router.post('/addProject', /*loginChecker, */  function(req, res, next){
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
            res.redirect('/projects/projects');
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
    db.query(`SELECT * FROM projects WHERE project_id ='${project_id}'`, (err, data) => {
      // let projects_item = data;
      // console.log(projects_item);
        res.render('project/editProject', { title: 'Edit Project', page:'Edit Project', data: data });
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
