console.log("Consola del cliente conectado");
var socket = io();
socket.on("new-product", (product) => {
  console.log("New product:", product);

  const productTemplate = ` <div> <h2>${product.title}</h2>
      <p>${product.description}</p> <span>$${product.price}</span> <img
      src="${product.thumbnail}" alt="${product.title}"> </div> `;
  const productList = document.getElementById("real-time-products");
  productList.insertAdjacentHTML("beforeend", productTemplate);
});

const form = document.querySelector("#new-product-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const newProduct = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: formData.get("price"),
    category: formData.get("category"),
    stock: formData.get("stock"),
    thumbnail: [formData.get("thumbnail")],
  };
  socket.emit("new-product", newProduct);
  event.target.reset();
});

