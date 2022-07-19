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

  //ajout des messages d'erreur si mauvaise saisie de quantité et/ou de couleur
  createErrorMsgHTMLElement();

  // ajout de l'événement sur le bouton "ajouter au panier" en prenant en compte la vérification de la quantité et de la couleur du produit
  const button = document.getElementById("addToCart");
  button.addEventListener("click", (event) => {
    if (checkNumber() && checkColor()) {
      addToCart(event, product);
    }
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

//Création du ShoppingItem avec ses éléments
class ShoppingItem {
  constructor(id, option, quantity) {
    this.id = id;
    this.option = option;
    this.quantity = quantity;
  }
}

// Vérification de la quantité et de la couleur selectionnée, pour éviter l'ajout d'un produit sans couleur et/ou sans quantité dans le panier

const quantity = document.getElementById("quantity");
const option = document.getElementById("colors");

// On crée une div pour afficher, s'il y a une erreur de saisi, un texte en dessous de l'input#quantity et du selec#colors

function createErrorMsgHTMLElement() {
  let errorElement = document.createElement("div");
  errorElement.setAttribute("id", "error-msg");
  quantity.after(errorElement);
  document.getElementById("error-msg").style.background = "#FF4500";

  let errorColorElement = document.createElement("div");
  errorColorElement.setAttribute("id", "error-color");
  option.after(errorColorElement);
  document.getElementById("error-color").style.background = "#FF4500";
}

// on vérifie la couleur
function checkColor() {
  // on suppose que tout est bon, donc on cache les erreurs au début
  hideColorError();
  if (option.value == "") {
    displayColorError("Veuillez choisir une couleur");
  } else if (option.value.length > 1) {
    return true;
  }
}

// on vérifie la quantité
function checkNumber() {
  // on suppose que tout est bon, donc on cache les erreurs au début
  hideError();
  if (quantity.value > 101) {
    displayError("Veuillez séléctionner une quantité entre 1 et 100");
  } else if (quantity.value < 1) {
    displayError("Veuillez séléctionner une quantité entre 1 et 100");
  } else if (quantity.value > 0 && quantity.value < 101) {
    return true;
  }
}

// Fonctions paramètres pour mettre en exécution les messages d'erreur
function displayError(msg) {
  let errorElement = document.getElementById("error-msg");
  errorElement.innerText = msg;
}
function displayColorError(msg) {
  let errorColorElement = document.getElementById("error-color");
  errorColorElement.innerText = msg;
}
function hideError() {
  let errorElement = document.getElementById("error-msg");
  errorElement.innerText = "";
}
function hideColorError() {
  let errorColorElement = document.getElementById("error-color");
  errorColorElement.innerText = "";
}

// Fonction ajout au panier, on envoie les caractéristiques du produit
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

//Message d'alerte confirmant l'ajout du produit dans le panier
const popupConfirmation = () => {
  window.alert(`Le produit a été ajouté au panier`);
};

//Création du localStorage
function saveDataLS(shoppingItem) {
  let shoppingCartLocalStorage = JSON.parse(
    localStorage.getItem("shoppingCart")
  );
  console.log(shoppingCartLocalStorage);

  // Si produit déjà enregistré dans le panier
  if (shoppingCartLocalStorage) {
    console.log("je suis déjà dans le panier");
    let result = productChecked(shoppingCartLocalStorage, shoppingItem);
    localStorage.setItem("shoppingCart", JSON.stringify(result));
    console.log("result", result);
    popupConfirmation();
  }

  // Si le produit n'a pas encore été enregistré dans le panier
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
  // On recherche et vérifie si les deux variables ont le même id et la même option
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
