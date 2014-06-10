
module.exports = {
  
  // The key used to encode/decode the token
  jwtKey: process.env.JWT_KEY || 'xStmbyc066BOFn40gIr29y09Ud94z1P7',

  /* 
    The length of time a token is valid for. Any valid momentjs
    #add(String, Number) values are allowed here see
    http://momentjs.com/docs/#/manipulating/add/
  */
  jwtExpires: {
    unit: 'd',
    value: 14
  }
};