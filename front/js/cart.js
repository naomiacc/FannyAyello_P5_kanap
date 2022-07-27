// Déclaration de variable objet ajouté
let shoppingCartLocalStorage = JSON.parse(localStorage.getItem("shoppingCart"));
console.log(shoppingCartLocalStorage);

// Fonction pour récupérer les produits du LocalStorage
async function getProduct() {
  // on créé un tableau pour constituer le panier complet
  let panierComplet = [];

  // la boucle attend que le fetch soit fini pour chaque tour de boucle
  for (i = 0; i < shoppingCartLocalStorage.length; i++) {
    await fetch(
      "http://localhost:3000/api/products/" + shoppingCartLocalStorage[i]._id
    )
      .then(function (res) {
        return res.json();
      })
      .then((products) => {
        //console.log(i);
        //console.log(products);
        // console.log(shoppingCartLocalStorage[i]); //

        // on créé un objet comporant les propriétés et les valeurs nécessaires pour consituer le panier
        const obj = {
          _id: products._id,
          name: products.name,
          price: products.price,
          color: shoppingCartLocalStorage[i].option,
          quantity: shoppingCartLocalStorage[i].quantity,
          alt: products.altTxt,
          img: shoppingCartLocalStorage[i].image,
        };
        // on pousse l'objet dans le tableau créé
        panierComplet.push(obj);
        // console.log(panierComplet); //
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return panierComplet;
}

// Initialisation des fonctions
init();
async function init() {
  let panierComplet = await getProduct();
  createHTMLBasket(panierComplet);

  AddEventChangeQuantity();
  AddEventRemoveQuantity();

  calculTotalQuantity();
  calculTotalPrice();
}

// Fonction pour créer le HTML du panier dans lequel sont insérés les propriétés du tableau "Panier Complet"
function createHTMLBasket(panierComplet) {
  const shoppingItem = document.getElementById(`cart__items`);

  console.log("complet", panierComplet);

  panierComplet.map((product) => {
    shoppingItem.innerHTML += `
    <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
        <div class="cart__item__img">
            <img src="${product.img}" alt="${product.alt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
                <h2>${product.name}</h2>
                <p>${product.price}€</p>
            </div>
            <div class="cart__item__content__settings">
                <p>Couleur : ${product.color}</p>
                    <div class="cart__item__content__settings__quantity">
                    <p>Qté :  </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
            </div>
        </div>
    </article>
    `;
  });
}

// Fonction pour supprimer un produit dans le panier
function AddEventRemoveQuantity() {
  let deleteItemContainer = [...document.getElementsByClassName("deleteItem")];

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

// Fonction pour modifier la quantité d'un produit dans le panier
function AddEventChangeQuantity() {
  let quantityContainer = [...document.getElementsByClassName("itemQuantity")];

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

// Fonction pour calculer le nombre de produit total dans le panier
function calculTotalQuantity() {
  let number = 0;
  for (let j = 0; j < shoppingCartLocalStorage.length; j++) {
    let quantityLoop = parseInt(shoppingCartLocalStorage[j].quantity);
    number += quantityLoop;
  }
  let totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerText = number;
}

// Fonction pour calculer le prix total du panier
async function calculTotalPrice() {
  const shoppingItem = await getProduct();
  let totalPrice = 0;
  for (let product of shoppingItem) {
    const shoppingItem = getProduct();
    totalPrice += product.quantity * product.price;
  }
  let totalPriceCart = document.getElementById("totalPrice");
  totalPriceCart.innerText = totalPrice;
}
