const KEY = process.env.KEY;
const express = require('express');
const { getMostLikedMaps, addMap, deleteMap } = require('./api/mapsApi');
const router = express.Router();


module.exports = (db) => {

  //'Create' map page
  router.get('/create', (req, res) => {
    const user = req.session.userId;
    res.render('createMapForm', { user, KEY });
  })
  //Login 
  router.get('/login/:user', (req, res) => {
    req.session.userId = req.params.user;
    res.redirect('/');
  })
  //Create map
  router.post('/create', (req, res) => {
    const user = req.session.userId;
    const mapTitle = req.body.mapTitle;
    addMap(db, user, mapTitle)
      .then(data => {
        if (req.session.userId) {
          const maps = data.rows;
          return res.redirect('/maps/myMaps');
        }
      });
  });
  //Delete map
  router.post('/myMaps/delete', (req, res) => {
    const user = req.session.userId;
    const mapId = req.body.mapId;
    deleteMap(db, user, mapId)
      .then(() => {
        res.redirect('/maps/myMaps');
      });
  });
  //Logout
  router.post('/logout', (req, res) => {
    req.session = null;
    getMostLikedMaps(db)
      .then(result => {
        const user = false;
        let maps = result.rows;
        res.render('index', { maps, user, KEY });
      });
  });
  //Login when logged out; no information required
  router.post('/login', (req, res) => {
    res.redirect('/');
  });
  return router;
};