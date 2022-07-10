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

  // Ajout de l'événement sur le bouton "ajouter au panier"
  const button = document.getElementById("addToCart");
  button.addEventListener("click", (event) => {
    addToCart(event, product);
  });
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

//Création du ShoppingItem
class ShoppingItem {
  constructor(id, option, quantity) {
    this.id = id;
    this.option = option;
    this.quantity = quantity;
  }
}
const quantity = document.getElementById("quantity");
const option = document.getElementById("colors");

// Fonction ajout au panier
function addToCart(event, product) {
  event.preventDefault();
  let shoppingItem = {
    quantity: quantity.value,
    option: option.value,
    _id: product._id,
    name: product.name,
    image: product.imageUrl,
    alt: product.altTxt,
  };
  saveDataLS(shoppingItem);
  console.log(shoppingItem);
}

//Message d'alerte pour valider l'ajout du produit au panier
const popupConfirmation = () => {
  if (window.confirm(`Le produit a été ajouté au panier`)) {
    window.location.href = "cart.html";
  } else {
    window.location.href = "index.html";
  }
};

//Création du localStorage
function saveDataLS(shoppingItem) {
  let shoppingCartLocalStorage = JSON.parse(
    localStorage.getItem("shoppingCart")
  );
  console.log(shoppingCartLocalStorage);

  // Si produit déjà enregistré
  if (shoppingCartLocalStorage) {
    let result = productChecked(shoppingCartLocalStorage, shoppingItem);
    localStorage.setItem("shoppingCart", JSON.stringify(result));
    console.log(result);
    popupConfirmation();

    // Si aucun produit
  } else if (
    shoppingCartLocalStorage == null ||
    shoppingCartLocalStorage == []
  ) {
    console.log(shoppingItem);
    console.log(shoppingCartLocalStorage);

    shoppingCartLocalStorage = [];
    shoppingCartLocalStorage.push(shoppingItem);
    localStorage.setItem(
      "shoppingCart",
      JSON.stringify(shoppingCartLocalStorage)
    );
    console.log(shoppingCartLocalStorage);
    popupConfirmation();
  }
}
// Fonction pour éviter les doublons dans la panier
function productChecked(shoppingCartLocalStorage, shoppingItem) {
  const object = shoppingCartLocalStorage.find(
    (element) =>
      element.id === shoppingItem.id && element.option === shoppingItem.option
  );
  if (object) {
    const n = parseInt(object.quantity);
    const m = parseInt(shoppingItem.quantity);
    object.quantity = n + m;
  } else {
    shoppingCartLocalStorage.push(object);
  }
  return shoppingCartLocalStorage;
}
