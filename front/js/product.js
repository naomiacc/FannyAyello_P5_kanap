// On pointe sur l'élément item du document
const elementItems = document.querySelector("item");

// Fonction pour récupérer l'ID du produit dans l'API
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

// Initialisation des fonctions
init();
async function init() {
  product = await getProductById();
  builProduct(product);

  //ajout des messages d'erreur si mauvaise saisie de quantité et/ou de couleur
  createErrorMsgHTMLElement();

  // ajout de l'événement sur le bouton "ajouter au panier" en prenant en compte la vérification de la quantité et de la couleur du produit
  const button = document.getElementById("addToCart");
  button.addEventListener("click", (event) => {
    if (checkColorAndQuantity()) {
      addToCart(event, product);
    }
  });
}

// Fonction pour créer les élements HTML et ses produits

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

//Création du ShoppingItem avec ses éléments
class ShoppingItem {
  constructor(id, option, quantity) {
    this.id = id;
    this.option = option;
    this.quantity = quantity;
  }
}

// On vérifie la quantité et la couleur selectionnée, pour éviter l'ajout d'un produit sans couleur et/ou sans quantité dans le panier
const option = document.getElementById("colors");
const quantity = document.getElementById("quantity");

// Fonction pour créer une div afin d'afficher un message d'erreur s'il y a une erreur de saisi
function createErrorMsgHTMLElement() {
  // pour la couleur
  let errorColorElement = document.createElement("div");
  errorColorElement.setAttribute("id", "error-color");
  option.after(errorColorElement);
  document.getElementById("error-color").style.background = "#FF4500";

  // pour la quantité
  let errorQuantityElement = document.createElement("div");
  errorQuantityElement.setAttribute("id", "error-quantity");
  quantity.after(errorQuantityElement);
  document.getElementById("error-quantity").style.background = "#FF4500";
}

// Fonction pour afficher les messages d'erreur
function displayError(msg, id) {
  let errorElement = document.getElementById(id);
  errorElement.innerText = msg;
}

// Fonction pour cacher les messages d'erreur
function hideMsgError() {
  let errorColorElement = document.getElementById("error-color");
  errorColorElement.innerText = "";
  let errorQuantityElement = document.getElementById("error-quantity");
  errorQuantityElement.innerText = "";
}

// Fonction pour vérifier simultanément la couleur et la quantité
function checkColorAndQuantity() {
  // on part du principe que les champs de saisi sont corrects et que l'on cache les messages d'erreur. Sinon, on les affiche.
  hideMsgError();
  if (
    (option.value == "" && quantity.value > 100) ||
    (option.value == "" && quantity.value < 1)
  ) {
    displayError("Veuillez choisir une couleur", "error-color");
    displayError(
      "Veuillez séléctionner une quantité entre 1 et 100",
      "error-quantity"
    );
  } else if (
    (option.value.length > 1 && quantity.value > 100) ||
    (option.value.length > 1 && quantity.value < 1)
  ) {
    displayError(
      "Veuillez séléctionner une quantité entre 1 et 100",
      "error-quantity"
    );
  } else if (
    (option.value == "" && quantity.value > 0) ||
    (option.value == "" && quantity.value < 101)
  ) {
    displayError("Veuillez choisir une couleur", "error-color");
  } else if (
    option.value.length > 1 &&
    quantity.value > 0 &&
    quantity.value < 101
  ) {
    return true;
  }
}

// Fonction pour ajouter un/des produit(s) au panier
function addToCart(event, product) {
  event.preventDefault();
  // on récupère les caractéristiques du produit dans la variable
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

//Message d'alerte confirmant l'ajout du produit dans le panier
const popupConfirmation = () => {
  window.alert(`Le produit a été ajouté au panier`);
};

// Fonction pour créer le localStorage avec ses produits
function saveDataLS(shoppingItem) {
  let shoppingCartLocalStorage = JSON.parse(
    localStorage.getItem("shoppingCart")
  );
  console.log(shoppingCartLocalStorage);

  // Si le produit est déjà enregistré dans le panier, alors on fait appel à la fonction productChecked (ligne 203)
  // cette dernière vérifiera s'il s'agit du même ID et de la même couleur (option)
  if (shoppingCartLocalStorage) {
    console.log("je suis déjà dans le panier");
    let result = productChecked(shoppingCartLocalStorage, shoppingItem);
    localStorage.setItem("shoppingCart", JSON.stringify(result));
    console.log("result", result);
    popupConfirmation();
  }

  // Si le produit n'a pas encore été enregistré dans le panier, alors on pousse le nouveau produit dans le LS
  else if (shoppingCartLocalStorage == null || shoppingCartLocalStorage == []) {
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

// Fonction pour éviter les doublons dans la panier : on appelle les variables à comparer
function productChecked(shoppingCartLocalStorage, shoppingItem) {
  // on recherche et vérifie si les deux variables ont le même id et la même option
  const object = shoppingCartLocalStorage.find(
    (element) =>
      element._id === shoppingItem._id && element.option === shoppingItem.option
  );
  console.log("objet", object);

  // s'il s'agit du même "object" alors on rectifie la quantité
  if (object) {
    const n = parseInt(object.quantity);
    const m = parseInt(shoppingItem.quantity);
    object.quantity = n + m;

    // sinon, on pousse le nouvel élément dans le LocalStorage
  } else {
    shoppingCartLocalStorage.push(shoppingItem);
  }
  return shoppingCartLocalStorage;
}
