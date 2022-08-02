////**** PANIER****////

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

  AddEventRemoveQuantity();

  // createErrorMsgHTMLElement();

  AddEventChangeQuantity();

  // const item = document.getElementsByClassName("itemQuantity");
  // item.addEventListener("click", (event) => {
  //   if (checkQuantity()) {
  //     AddEventChangeQuantity(event, product);
  //   }
  // });

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
      // Au click, on modifie l'objet sur le LocalStorage et le DOM
      shoppingCartLocalStorage[index].quantity = quantityContainer[index].value;
      localStorage.setItem(
        "shoppingCart",
        JSON.stringify(shoppingCartLocalStorage)
      );
      location.reload();
    });
  });
}

// // On vérifie la quantité selectionnée
// const itemQuantity = document.getElementsByClassName("itemQuantity");

// // Fonction pour créer une div afin d'afficher un message d'erreur s'il y a une erreur de saisi
// function createErrorMsgHTMLElement() {
//   let errorQuantityElement = document.createElement("div");
//   errorQuantityElement.setAttribute("id", "error-quantity");
//   itemQuantity.after(errorQuantityElement);
//   document.getElementById("error-quantity").style.background = "#FF4500";
//   console.log();
// }

// // Fonction pour afficher les messages d'erreur
// function displayError(msg, id) {
//   let errorElement = document.getElementsById("error-quantity");
//   errorElement.innerText = msg;
// }

// // Fonction pour cacher les messages d'erreur
// function hideMsgError() {
//   let errorQuantityElement = document.getElementById("error-quantity");
//   errorQuantityElement.innerText = "";
// }

// // Fonction pour vérifier la quantité du produit
// function checkQuantity() {
//   // on part du principe que les champs de saisi sont corrects et que l'on cache les messages d'erreur. Sinon, on les affiche.
//   hideMsgError();
//   if (itemQuantity.value < 1 || itemQuantity.value > 101) {
//     displayError("Veuillez séléctionner une quantité entre 1 et 100");
//   } else if (itemQuantity.value > 1 || itemQuantity.value < 101) {
//     return true;
//   }
// }

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

////**** FORMULAIRE****////

// Variables du formulaire Contact
let color1 = "#7cdc16";
let color2 = "#f03c0c";
// Mise en place des RegEx les plus larges possibles pour éviter les erreurs de caratéres
let RegEx1 =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
let RegEx2 = /^[a-zA-Z\-1-9]+$/;

// Formulaire Contact
addEventListener("change", () => {
  //Vérification FirstName(prénom)
  function validFirstName() {
    let firstName = document.getElementById("firstName").value;
    let text = document.getElementById("firstNameErrorMsg");
    // Prise en compte les Regex
    let pattern = RegEx1;
    let number = RegEx2;

    if (firstName.match(pattern)) {
      text.innerHTML = "Prénom valide";
      text.style.color = color1;
      return firstName;
    } else if (firstName.match(number)) {
      text.innerHTML = "Les chiffres ne sont pas tolérés";
      text.style.color = color2;
    } else {
      text.innerHTML = "Merci de rentrer un prénom valide";
      text.style.color = color2;
    }
  }

  // Vérification LastName(Nom)
  function validLastName() {
    let lastName = document.getElementById("lastName").value;
    let text = document.getElementById("lastNameErrorMsg");
    let pattern = RegEx1;
    let number = RegEx2;

    if (lastName.match(pattern)) {
      text.innerHTML = "Nom valide";
      text.style.color = color1;
      return lastName;
    } else if (lastName.match(number)) {
      text.innerHTML = "Les chiffres ne sont pas tolérés";
      text.style.color = color2;
    } else {
      text.innerHTML = "Merci de rentrer un nom valide";
      text.style.color = color2;
    }
  }

  //Vérification address(adresse)
  function validAddress() {
    let address = document.getElementById("address").value;
    let text = document.getElementById("addressErrorMsg");
    let pattern = "([0-9a-zA-Z,. ]*) ?([0-9]{5}) ?([a-zA-Z]*)";

    if (address.match(pattern)) {
      text.innerHTML = "Adresse postale valide";
      text.style.color = color1;
      return address;
    } else {
      text.innerHTML =
        "Merci de rentrer une adresse valide (ex : 12 rue des baies 64500)";
      text.style.color = color2;
    }
  }
  // Vérification City(ville)
  function validCity() {
    let city = document.getElementById("city").value;
    let text = document.getElementById("cityErrorMsg");
    let pattern = /^[a-z ,.'-]+$/i;

    if (city.match(pattern)) {
      text.innerHTML = "Ville valide";
      text.style.color = color1;
      return city;
    } else {
      text.innerHTML = "Merci de rentrer une ville valide";
      text.style.color = color2;
    }
  }
  //Vérification Email(adresse mail)
  function validEmail() {
    let mail = document.getElementById("email").value;
    let text = document.getElementById("emailErrorMsg");
    let pattern = new RegExp(
      "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
      "g"
    );

    if (mail.match(pattern)) {
      text.innerHTML = "Adresse email valide";
      text.style.color = color1;
      return mail;
    } else {
      text.innerHTML = "Merci de rentrer une adresse valide";
      text.style.color = color2;
    }
  }

  // Appels pour alertes sur DOM
  validFirstName();
  validLastName();
  validAddress();
  validCity();
  validEmail();
});
