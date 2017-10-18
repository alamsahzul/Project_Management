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
    db.query(`SELECT DISTINCT project_id FROM members`,(err, data) => {
              let akhir = []
              console.log(akhir.length);
              console.log(data.rows.length );

                for(let j=0; j<data.rows.length; j++){
                  console.log(data.rows[j]);
                  akhir.push(data.rows[j])
                  let sql = `SELECT firstname, lastname FROM users JOIN members ON users.user_id = members.user_id WHERE project_id = '${data.rows[j].project_id}'`;
                  console.log(sql);
                  db.query(sql, (err, users) => {
                    // console.log('members project_id ', data.rows[j].project_id+" adalah "+ users.rows);
                    console.log(users.rows[1].firstname);
                  });
                }
        let tes1 = akhir;
        res.send(tes1);
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
