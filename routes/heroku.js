const router = require('express').Router();


const Heroku = require('heroku-client')
const heroku = new Heroku({ token: 'a53d4fa8-2d50-4897-aa8d-dc3dde79b52d' })

const auth = require('../middleware/auth');

//Build Heroku Request
//router.route('/build').get((req, res) => {
  router.get('/build',auth,function(req,res) {
    heroku.request({
        method: 'POST',
        path: '/app-setups',
        body: {
            "source_blob": {"url":"https://api.github.com/repos/BdGress/VirtualHackathon/tarball/master"}
        },
        parseJSON: true
      }).then(HerokuResponse => res.json(HerokuResponse))
  });

//Heroku Build Update
  //router.route('/isbuilding/:id').get((req, res) => {
    router.get('/isbuilding/:id',auth,function(req,res) {
    heroku.get('/app-setups/'+req.params.id)
    .then(HerokuResponse => res.json(HerokuResponse))
  });

  module.exports = router;
