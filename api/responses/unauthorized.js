
module.exports = function forbidden (viewOrRedirect) {

  var req = this.req;
  var res = this.res;

  res.status(401);

  this.req._sails.log.verbose('Sent 401 ("Unauthorized") response');

  res.send();  
};
