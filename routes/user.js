'use strict'

const express = require('express');
const router = express.Router();
const loginChecker = require('../helpers/loginChecker');

module.exports = function(db){

  router.get('/',/* loginChecker, */function(req, res, next) {
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

    db.qery(`INSERT INTO users values $1, $2, $3, $4, $5, $6`, [], (err, data) => {
      res.redirect('')
    });

  });
  return router;
}
