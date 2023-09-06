const EErrors = require('../error-enum');

const errorHandler = (error, req, res, next) => {
    console.error("Error detectado entrando al Error Handler");
    console.error(error);
    
    switch (error.code) {
        case EErrors.NOTFOUND_CART:
        case EErrors.NOTFOUND_PRODUCT:        
        case EErrors.MISSING_FIELDS:
        case EErrors.USER_ALREADY_EXISTS:
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'Error', error: error.message })
            break;
        default:
            res.status(500).send({ status: "error", error: "Unhandled error!" });
    }
};

module.exports = errorHandler