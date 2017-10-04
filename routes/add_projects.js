'use strict'
const express = require('express')
const router = express.Router();
const loginChecker = require('../helpers/loginChecker');

module.exports = function(db){

  router.get('/', /*loginChecker,*/ function(req, res, next) {
    console.log('ini router add Projects');
    db.query('SELECT firstname, lastname, user_id FROM users ', (err, data) => {
      console.log(data.rows);
      res.render('add_project', { title: 'Add Projects', page:'ADD PROJECTS', data: data.rows });
    });
  });

  router.post('/', loginChecker, function(req, res, next) {
    console.log('ini dari post ');
    let project_name  = req.body.project_name;
    let user_id       = req.body.user;
    console.log(`INSERT INTO projects values ('${project_name}')`);

    // db.query(`INSERT INTO projects VALUES ($1)`,[project_name], (err, data) => {
    //     if(err){ console.log("data tidak tersimpan"); }

      // if(user_id>1){
      //   for(panjang<panjan_user_id){
      //
      //   }
      // }

        // VALUES  id_member
        //         user_id
        //         role
        //         project_id

          // if(!user_id)
          //   console.log('member: ', user_id);
          // else {
          for (var i = 0; i < user_id.length; i++) {
            //db.query(`INSERT INTO members () values ${project_name}`, (err, data) => {
            //});
          }

          // }

    //     }
        // res.redirect('/')
    // });
  });

  return router;
}
