var express = require('express');
var router = express.Router();

var database = require('../database');
const { response } = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', session : req.session });
});


router.post('/login', function(request, response, next){

  var user_landlord_user_id = request.body.user_landlord_user_id;

  var user_password = request.body.user_password;

  if(user_landlord_user_id && user_password)
  {
      query = `
      SELECT * FROM landlord_user 
      WHERE landlord_user_id = "${user_landlord_user_id}"
      `;

      database.query(query, function(error, data){

          if(data.length > 0)
          {
              for(var count = 0; count < data.length; count++)
              {
                  if(data[count].user_password == password)
                  {
                      request.session.user_id = data[count].user_id;

                      response.redirect("/");
                  }
                  else
                  {
                      response.send('Incorrect Password');
                  }
              }
          }
          else
          {
              response.send('Incorrect User ID');
          }
          response.end();
      });
  }
  else
  {
      response.send('Please Enter UserID and Password Details');
      response.end();
  }

});


router.get('/logout', function(request, response, next){

  request.session.destroy();

  response.redirect("/");
});

module.exports = router;