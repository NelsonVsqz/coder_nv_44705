const User = require("../dao/models/user");

const userChange = async (req, res) => {

    const userCurrent = req.user
    const user = await User.findOne({ email: userCurrent.email }); 
    console.log(userCurrent)
    console.log(user)       
    // Verificar si el usuario ya ha cargado documentos específicos
    const hasIdentification = userHasDocument(user.documents, "Identificación");
    const hasAddressProof = userHasDocument(user.documents, "Comprobante de domicilio");
    const hasBankStatement = userHasDocument(user.documents, "Comprobante de estado de cuenta");    

    console.log("has")
    console.log(hasIdentification)       
    console.log(hasAddressProof)
    console.log(hasBankStatement)           
    if(user.role == "usuario" && hasIdentification && hasAddressProof && hasBankStatement ){
     user.role = "premium"
     console.log("user change save")
     console.log(user)            
     user.save()
     return res.status(200).json({message:"Success change to premium"});

    } else if(user.role == "usuario" && [!hasIdentification || !hasAddressProof || !hasBankStatement] ){
      return  res.status(400).json({message:"Load documentation"});
    }
    if(user.role == "premium"){
    user.role = "usuario"
    user.save()
    return res.status(200).json({message:"Success change to usuario"});

    } else{
  
    return res.status(200).json({message:"You are admin not change"});
    }
};
  
const userRenderUpload = async (req, res) => {
    const uid = req.params.uid || req.user._id ;
    const user = await User.findOne({ _id: uid });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Verifica si el usuario ya ha cargado documentos específicos
    const hasIdentification = userHasDocument(user.documents, "Identificación");
    const hasAddressProof = userHasDocument(user.documents, "Comprobante de domicilio");
    const hasBankStatement = userHasDocument(user.documents, "Comprobante de estado de cuenta");
    const hasDocuments = user.documents.length > 0
    res.render('uploadDocuments', {
        uid,
        hasDocuments,
        hasIdentification,
        hasAddressProof,
        hasBankStatement
    });
}


const uploadDocuments = async (req, res) => {
    const uid = req.params.uid;
    const user = await User.findOne({ _id: uid });
console.log("user uploadDocuments")
console.log(user)
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Verificar si el usuario ya ha cargado documentos específicos
    const hasIdentification = userHasDocument(user.documents, "Identificación");
    const hasAddressProof = userHasDocument(user.documents, "Comprobante de domicilio");
    const hasBankStatement = userHasDocument(user.documents, "Comprobante de estado de cuenta");
    console.log("req")
    console.log(req.files)
    console.log(Object.entries(req.files))        

    const filesArray = Object.entries(req.files) 
    // Verificar si los campos de carga están presentes en la solicitud y el usuario aún no ha cargado esos documentos
    if (filesArray && filesArray.length > 0) {
        if (!hasIdentification && filesArray.some(file => file[0] === "identification")) {
            console.log(filesArray.find(file => file[0] === "identification")[1][0])
            user.documents.push({
                name: "Identificación",
                reference: filesArray.find(file => file[0] === "identification")[1][0].path
            });
        }
        if (!hasAddressProof && filesArray.some(file => file[0] === "addressProof")) {
            user.documents.push({
                name: "Comprobante de domicilio",
                reference: filesArray.find(file => file[0] === "addressProof")[1][0].path
            });
        }
        if (!hasBankStatement && filesArray.some(file => file[0] === "bankStatement")) {
            user.documents.push({
                name: "Comprobante de estado de cuenta",
                reference: filesArray.find(file => file[0] === "bankStatement")[1][0].path
            });
        }

        // Guardar los documentos actualizados en el usuario
        user.save();
        console.log("user uploadDocuments save")
        console.log(user)
        res.status(200).json({ message: "Documentos cargados con éxito" });
    } else {
        res.status(400).json({ message: "No se proporcionaron documentos para cargar" });
    }
};

function userHasDocument(documents, name) {
    return documents.some(doc => doc.name === name);
}

module.exports = { userChange , userRenderUpload, uploadDocuments};