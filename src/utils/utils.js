const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

 const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
 
 const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

 const storage = multer.diskStorage({
     destination: (req, file, cb) => {
        console.log(file)        

         let folder = 'documents';
         let raiz = 'uploads'; 

         if (file.fieldname === 'identification') {
          folder = 'documents';
         } //else
          if (file.fieldname === 'bankStatement') {
          folder = 'documents';
         } //else 
         if (file.fieldname === 'addressProof') {
          folder = 'documents';
         } //else 
         if (file.fieldname === 'profilePicture') {
             folder = 'profiles';
             raiz = 'public';
         } //else
         if (file.fieldname === 'productImage') {
             folder = 'products';
         }
 
         const uploadPath = path.join(__dirname, `../${raiz}/${folder}`);
         cb(null, uploadPath);
     },
     filename: (req, file, cb) => {
         cb(null, file.originalname);
     },
 });
 
 const upload = multer({ storage: storage });
 
 
 module.exports = {
    createHash: createHash,
    isValidPassword: isValidPassword,
    upload: upload
  };