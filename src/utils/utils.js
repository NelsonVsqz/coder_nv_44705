const bcrypt = require('bcrypt');

 const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
 const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

 module.exports = {
    createHash: createHash,
    isValidPassword: isValidPassword
  };