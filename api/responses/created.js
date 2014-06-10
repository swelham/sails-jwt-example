
module.exports = function (data) {
  var req = this.req;
  var res = this.res;

  res.status(201);

  this.req._sails.log.verbose('Sent 201 ("Created") response');
  
  if (data) {
    this.req._sails.log.verbose(data);
  }

  if (req.options.jsonp && !req.isSocket) {
    return res.jsonp(data);
  }
  
  return res.json(data);
};