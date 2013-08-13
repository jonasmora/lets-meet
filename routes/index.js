
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.maps = function (req, res) {
  var name = req.params.name;
  res.render('partials/maps/' + name);
};