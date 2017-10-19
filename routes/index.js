'use strict'

const express   = require('express');
const router    = express.Router();
const app       = express();

module.exports = function(db){
  //####  ROUTER HALAMAN UTAMA/LOGIN
  router.get('/', function(req, res, next) {
    console.log('halaman login');
    if(req.session.useri_id){
      res.redirect('/projects');
    }else{
      // res.render('index', {title: "PMS"});
    db.query(`SELECT DISTINCT members.project_id, projects.project_name  FROM members JOIN projects ON members.project_id = projects.project_id`,(err, data) => {
              let project_idList   = []
              let tampung          = [];
              let project_id       = '';
              let project_name     = '';
              let firstname        = [];

                for(let j=0; j<data.rows.length; j++){
                  project_idList.push(data.rows[j].project_id)
                  project_id    = data.rows[j].project_id;
                  project_name  = data.rows[j].project_name;
                  tampung.push({
                      project_id : `${project_id}`,
                      project_name: `${project_name}`,
                      members: `${firstname}`
                  })

                  let sql = `SELECT firstname, lastname FROM users JOIN members ON users.user_id = members.user_id WHERE project_id = '${data.rows[j].project_id}'`;
                  db.query(sql, (err, users) => {
                      for(var i=0; users.rows.length>i; i++){
                        firstname.push(users.rows[i].firstname);
                      }
                      for(var a=0; tampung.length>a; a++){
                        if(tampung[a].project_id == data.rows[j].project_id){
                            tampung[a].members = `${firstname}`
                        }else {
                          tampung.push({
                              project_id : `${project_id}`,
                              project_name: `${project_name}`,
                              members: `${firstname}`
                          })
                        }
                        break; 
                        console.log(tampung);
                      }

                  });

                }

                res.send(tampung);
    })
  }
}); //penutup ROUTER HALAMAN UTAMA/LOGIN

  //####  ROUTER PROSES LOGIN
  router.post('/', function(req, res, next) {
    console.log('Halaman post login');
    let input_email     = req.body.email,
        input_password  = req.body.password;
    console.log(input_email);
    db.query(`SELECT user_id, role FROM users WHERE password = $1 AND email = $2`, [input_password, input_email], (err, data) => {
      console.log('data.rows.length: ',data.rows.length);
      if (data.rows.length == 1){
        req.session.user_id = data.rows[0].user_id;
        req.session.role    = data.rows[0].role;
        console.log(req.session.role);
        res.redirect('/projects');
      }
      else {
        console.log("tidak ditemukan");
        res.redirect('/');
      }
   }); //penutup client query
  }); //penutup ROUTER LOGIN

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
