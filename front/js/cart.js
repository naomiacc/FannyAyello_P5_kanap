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
  products = await getProduct();
  createHTMLBasket(products);

  AddEventChangeQuantity();
  AddEventRemoveQuantity();
}

// Création des éléments à afficher dans le panier
function createHTMLBasket(products) {
  const shoppingItem = document.getElementById(`cart__items`);

  //Intégration du  html dans la section "cart__items"
  let listItem = document.createElement(`cart__item`);
  console.log(listItem);

  // Article
  const cartArcticle = document.createElement("article");
  cartArcticle.className = "cart__item";
  cartArcticle.dataset.id = shoppingCartLocalStorage[i]._id;
  cartArcticle.dataset.color = shoppingCartLocalStorage[i - 1].option;
  cartSection.appendChild(cartArcticle);

  // Div image
  const cartDivImg = document.createElement("div");
  cartDivImg.className = "cart__item__img";
  cartArcticle.appendChild(cartDivImg);

  // Image
  const cartProductImg = document.createElement("img");
  cartProductImg.className = "cart__product__img";
  cartProductImg.src = shoppingCartLocalStorage[i - 1].image;
  cartDivImg.appendChild(cartProductImg);

  // Div
  const cartDivContent = document.createElement("div");
  cartDivContent.className = "cart__item__content";
  cartArcticle.appendChild(cartDivContent);

  // Div description
  const cartDivContentDescription = document.createElement("div");
  cartDivContentDescription.className = "cart__item__content__desciption";
  cartDivContent.appendChild(cartDivContentDescription);

  // h2
  const cartProductName = document.createElement("h2");
  cartProductName.className = "cart__product__name";
  cartProductName.innerText = products.name;
  cartDivContentDescription.appendChild(cartProductName);

  // paragraphe couleur
  const cartProductColor = document.createElement("p");
  cartProductColor.innerText = shoppingCartLocalStorage[i - 1].option;
  cartDivContentDescription.appendChild(cartProductColor);

  // paragraphe prix
  const cartProductPrice = document.createElement("p");
  cartProductPrice.className = "cart__product__price";
  cartProductPrice.innerText = products.price + "€";
  cartDivContentDescription.appendChild(cartProductPrice);

  // Div
  const cartDivContentSetting = document.createElement("div");
  cartDivContentSetting.className = "cart__item__content__settings";
  cartDivContent.appendChild(cartDivContentSetting);

  // Div quantité
  const cartContentQuantity = document.createElement("div");
  cartContentQuantity.className = "cart__item__content__settings__quantity";
  cartDivContentSetting.appendChild(cartContentQuantity);

  // paragraphe quantité
  const cartProductQuantity = document.createElement("p");
  cartProductQuantity.innerText = "Qté :";
  cartContentQuantity.appendChild(cartProductQuantity);

  // element input
  const cartInputQuantity = document.createElement("input");
  cartInputQuantity.type = "number";
  cartInputQuantity.className = "itemQuantity";
  cartInputQuantity.name = "itemQuantity";
  cartInputQuantity.min = "1";
  cartInputQuantity.max = "100";
  cartInputQuantity.value = shoppingCartLocalStorage[i - 1].quantity;
  cartContentQuantity.appendChild(cartInputQuantity);

  // Div supprimer
  const cartDivContentDelete = document.createElement("div");
  cartDivContentDelete.className = "cart__item__content__settings__delete";
  cartDivContentSetting.appendChild(cartDivContentDelete);

  // paragraphe supprimer
  const cartProductDelete = document.createElement("p");
  cartProductDelete.className = "deleteItem";
  cartProductDelete.innerText = "Supprimer";
  cartDivContentDelete.appendChild(cartProductDelete);
}

//   listItem.innerHTML = `
// <article class="cart__item" data-id=${shoppingCartLocalStorage[i]._id} data-color="${shoppingCartLocalStorage[i].option}">
//     <div class="cart__item__img">
//         <img src=${shoppingCartLocalStorage[i].image} alt=${shoppingCartLocalStorage[i].alt}>
//     </div>
//     <div class="cart__item__content">
//         <div class="cart__item__content__titlePrice">
//             <h2>${shoppingCartLocalStorage[i].name}</h2>
//             <p>${shoppingCartLocalStorage[i].price} €</p>
//         </div>
//         <div class="cart__item__content__settings">
//             <p>Couleur : ${shoppingCartLocalStorage[i].option}</p>
//                 <div class="cart__item__content__settings__quantity">
//                 <p>Qté :  </p>
//                 <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${shoppingCartLocalStorage[i].quantity}">
//                 </div>
//         </div>
//         <div class="cart__item__content__settings__delete">
//             <p class="deleteItem">Supprimer</p>
//         </div>
//     </div>
// </article>
//     `;
shoppingItem.appendChild(listItem);
console.log(listItem);

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
