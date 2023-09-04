module.exports = class userDTO {
  constructor(user) {
    
    this.full_name = [user.first_name,user.last_name].join(" ") ,
    this.email = user.email,
    this.age = user.age,
    this.cart = user.cart,
    this.role = user.role
  }

}