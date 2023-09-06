module.exports = class CustomError {
    static createError({ name = "Error", cause, message, code = 1000 }) {
        
        const error = new Error(message, { cause })
        error.name = name;
        error.code = code;
        throw error
    };
}