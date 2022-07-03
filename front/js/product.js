// On pointe sur l'élément item du document
const elementItems = document.querySelector("item");

// Récupération de l'ID du produit dans l'API
function getProductById() {
  let params = new URL(document.location).searchParams;
  let id = params.get("id");
  return fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log(e);
    });
}

console.log(location);

// Passage de paramètre product entre init et builProduct

init();
async function init() {
  product = await getProductById();
  builProduct(product);
}

// Création des éléments du produit dans le DOM

function builProduct(product) {
  console.log(product);

  //image
  let itemImg = document.querySelector(".item__img");
  let productImg = document.createElement("img");
  itemImg.appendChild(productImg);
  productImg.src = product.imageUrl;
  productImg.alt = product.altText;

  //nom
  let productTitle = document.getElementById("title");
  productTitle.innerHTML = product.name;

  //prix
  let productPrice = document.getElementById("price");
  productPrice.innerHTML = product.price;

  //description
  let productDescription = document.getElementById("description");
  productDescription.innerHTML = product.description;

  //choix des couleurs
  const productColorsChoice = document.getElementById("colors");
  for (let i = 0; i < product.colors.length; i++) {
    const colorChoice = document.createElement("option");
    colorChoice.value = product.colors[i];
    colorChoice.innerHTML = product.colors[i];
    productColorsChoice.appendChild(colorChoice);
  }
}

// Ajout du produit dans le panier
class ShoppingItem {
  constructor(id, option, quantity) {
    this.id = id;
    this.option = option;
    this.quantity = quantity;
  }
}
const quantity = document.getElementById("quantity");
const option = document.getElementById("colors");

// création d'un événement sur le boutton "ajouter au panier"
const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", (event) => {
  event.preventDefault();
  let shoppingItem = {
    quantity: quantity.value,
    option: option.value,
    _id: id,
    name: title.textContent,
    price: price.textContent,
    image: imageUrl,
    alt: altTxt,
  };

  localstorage(shoppingItem);
  console.log(shoppingItem);
});

// Création du localStorage
function localstorage(shoppingItem) {
  let shoppingCartLocalStorage = JSON.parse(
    localStorage.getItem("shoppingCart")
  );
  console.log(shoppingCartLocalStorage);
}
