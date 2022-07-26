// Déclaration de variable objet ajouté
let shoppingCartLocalStorage = JSON.parse(localStorage.getItem("shoppingCart"));
console.log(shoppingCartLocalStorage);

// Création tableau panier complet
let panierComplet = [];

// Récupération des produits dans le LocalStorage
function getProduct() {
  for (i = 0; i < shoppingCartLocalStorage.length; i++) {
    fetch(
      "http://localhost:3000/api/products/" + shoppingCartLocalStorage[i]._id
    )
      .then(function (res) {
        return res.json();
      })
      .then((products) => {
        console.log(i);
        const obj = {
          _id: products._id,
          name: products.name,
          price: products.price,
          color: shoppingCartLocalStorage[i - 1].option,
          quantity: shoppingCartLocalStorage[i - 1].quantity,
          alt: products.altTxt,
          img: shoppingCartLocalStorage[i - 1].image,
        };
        panierComplet.push(obj);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

// Initialisation des fonctions
init();
async function init() {
  await getProduct();
  createHTMLBasket();

  AddEventChangeQuantity();
  AddEventRemoveQuantity();
}

// Création des éléments à afficher dans le panier
function createHTMLBasket(products) {
  const shoppingItem = document.getElementById(`cart__items`);

  panierComplet.map((product) => {
    console.log(product);

    listItem.innerHTML = `
<article class="cart__item" data-id=${shoppingCartLocalStorage[i]._id} data-color="${shoppingCartLocalStorage[i].option}">
    <div class="cart__item__img">
        <img src=${shoppingCartLocalStorage[i].image} alt=${shoppingCartLocalStorage[i].alt}>
    </div>
    <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
            <h2>${shoppingCartLocalStorage[i].name}</h2>
            <p>${shoppingCartLocalStorage[i].price} €</p>
        </div>
        <div class="cart__item__content__settings">
            <p>Couleur : ${shoppingCartLocalStorage[i].option}</p>
                <div class="cart__item__content__settings__quantity">
                <p>Qté :  </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${shoppingCartLocalStorage[i].quantity}">
                </div>
        </div>
        <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
        </div>
    </div>
</article>
    `;
  });
  shoppingItem.appendChild(listItem);
  console.log(listItem);
}

// Stockage des éléments dans des tableaux
let deleteItemContainer = [...document.getElementsByClassName("deleteItem")];
let quantityContainer = [...document.getElementsByClassName("itemQuantity")];

// Suppression d'un produit
function AddEventRemoveQuantity() {
  deleteItemContainer.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Dans le DOM
      let pickArticle = deleteItemContainer[index].closest(".cart__item");
      pickArticle.remove();
      // Dans le local storage
      shoppingCartLocalStorage.splice(index, 1);
      localStorage.setItem(
        "shoppingCart",
        JSON.stringify(shoppingCartLocalStorage)
      );
      location.reload();
    });
  });
}

// Modification de la quantité
function AddEventChangeQuantity() {
  quantityContainer.forEach((shoppingItem, index) => {
    shoppingItem.addEventListener("change", () => {
      // Au click, modifie l'objet sur le LocalStorage et le dom
      shoppingCartLocalStorage[index].quantity = quantityContainer[index].value;
      localStorage.setItem(
        "shoppingCart",
        JSON.stringify(shoppingCartLocalStorage)
      );
      location.reload();
    });
  });
}

// Totalisation des quantités et de la somme finale des articles
let sumShoppingItem = 0;
let sumPrice = 0;
let totalQuantity = document.getElementById("totalQuantity");
let totalPrice = document.getElementById("totalPrice");

if (shoppingCartLocalStorage !== null) {
  for (let j = 0; j < shoppingCartLocalStorage.length; j++) {
    let quantityLoop = parseInt(shoppingCartLocalStorage[j].quantity);
    let priceLoop = parseInt(shoppingCartLocalStorage[j].price);
    sumShoppingItem += quantityLoop;
    sumPrice += priceLoop * quantityLoop;
  }
}

if (totalQuantity && totalPrice) {
  totalQuantity.innerHTML = sumShoppingItem;
  totalPrice.innerHTML = sumPrice;
}
