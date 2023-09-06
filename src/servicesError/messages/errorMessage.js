const generateUserErrorInfo = (user) => {
    
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
    Lista de propiedades requeridas:
        * fist_name: type String, recibido: ${user.first_name}
        * last_name: type String, recibido: ${user.last_name}
        * age: type number, recibido: ${user.age}
        * email: type String, recibido: ${user.email}
`;
};


const generateProductErrorInfo = (product) => {
    
     return `Una o más propiedades fueron enviadas incompletas o no son válidas.
     Lista de propiedades requeridas:
     * product_title: type String, recibido: ${product.title}
     * product_description: type String, recibido: ${product.description}
     * product_stock: type Number, recibido: ${product.stock}
     * product_code: type Number, recibido: ${product.code}
     * product_category: type String, recibido: ${product.category} 
     * product_thumbnail: type String, recibido: ${product.thumbnail} 
     * price: type Number, recibido: ${product.price}
 `;
 };

 const findProductErrorInfo = (product) => {
    
    return `No se encontro el id del producto en la base.
    id:
    * cart: : ${product.cart}
    * product_id: : ${product.pid}    
`;
}; 

const findCartErrorInfo = (cart) => {
    
    return `No se encontro el id del carrito.
    Cart:
    * cart_id recibido: ${cart.cartId}

`;
};

module.exports = { generateUserErrorInfo, generateProductErrorInfo,findProductErrorInfo,findCartErrorInfo }