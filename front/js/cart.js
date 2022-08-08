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

  createErrorMsgHTMLElement();

  AddEventChangeQuantity();

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
      if (checkQuantity()) {
        shoppingCartLocalStorage[index].quantity =
          quantityContainer[index].value;
        localStorage.setItem(
          "shoppingCart",
          JSON.stringify(shoppingCartLocalStorage)
        );
        location.reload();
      }
    });
  });
}

// On vérifie la quantité selectionnée
const itemQuantity = document.getElementsByClassName("itemQuantity");

// Fonction pour créer une div afin d'afficher un message d'erreur s'il y a une erreur de saisi
function createErrorMsgHTMLElement() {
  let errorQuantityElement = document.createElement("div");
  errorQuantityElement.setAttribute("id", "error-quantity");
  itemQuantity.after(errorQuantityElement);
  document.getElementById("error-quantity").style.background = "#FF4500";
  console.log();
}

// Fonction pour afficher les messages d'erreur
function displayError(msg, id) {
  let errorElement = document.getElementsById("error-quantity");
  errorElement.innerText = msg;
}

// Fonction pour cacher les messages d'erreur
function hideMsgError() {
  let errorQuantityElement = document.getElementById("error-quantity");
  errorQuantityElement.innerText = "";
}

// Fonction pour vérifier la quantité du produit
function checkQuantity() {
  // on part du principe que les champs de saisi sont corrects et que l'on cache les messages d'erreur. Sinon, on les affiche.
  hideMsgError();
  if (itemQuantity.value < 1 || itemQuantity.value > 100) {
    displayError("Veuillez séléctionner une quantité entre 1 et 100");
  } else if (itemQuantity.value > 0 || itemQuantity.value < 101) {
    return true;
  }
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

////**** FORMULAIRE****////

// Variables couleurs
let color1 = "#7cdc16";
let color2 = "#f03c0c";

// Variables RegEx pour éviter les erreurs de caratéres
let RegEx1 = /^(?=.{2,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/;
let RegEx2 = /^[a-zA-Z\-1-9]+$/;

let checkFormulaire = {
  firstName: false,
  lastName: false,
  address: false,
  city: false,
  email: false,
};

// Formulaire Contact
addEventListener("change", () => {
  console.log(checkFormulaire);
  //Fonction pour vérifier le prénom
  function validFirstName() {
    let firstName = document.getElementById("firstName").value;
    let text = document.getElementById("firstNameErrorMsg");
    // Prise en compte des Regex
    let pattern = RegEx1;
    let number = RegEx2;

    if (firstName.match(pattern)) {
      text.innerHTML = "Prénom valide";
      text.style.color = color1;
      checkFormulaire.firstName = true;
      return firstName;
    } else if (firstName.match(number)) {
      text.innerHTML = "Les chiffres ne sont pas tolérés";
      text.style.color = color2;
      checkFormulaire.firstName = false;
    } else {
      text.innerHTML = "Merci de rentrer un prénom valide";
      text.style.color = color2;
      checkFormulaire.firstName = false;
    }
  }

  // Fonction pour vérifier le nom
  function validLastName() {
    let lastName = document.getElementById("lastName").value;
    let text = document.getElementById("lastNameErrorMsg");
    let pattern = RegEx1;
    let number = RegEx2;

    if (lastName.match(pattern)) {
      text.innerHTML = "Nom valide";
      text.style.color = color1;
      checkFormulaire.lastName = true;
      return lastName;
    } else if (lastName.match(number)) {
      text.innerHTML = "Les chiffres ne sont pas tolérés";
      text.style.color = color2;
      checkFormulaire.lastName = false;
    } else {
      text.innerHTML = "Merci de rentrer un nom valide";
      text.style.color = color2;
      checkFormulaire.lastName = false;
    }
  }

  // Fonction pour vérifier l'adresse postale
  function validAddress() {
    let address = document.getElementById("address").value;
    let text = document.getElementById("addressErrorMsg");
    let pattern = "([0-9a-zA-Z,. ]*) ?([0-9]{5}) ?([a-zA-Z]*)";

    if (address.match(pattern)) {
      text.innerHTML = "Adresse postale valide";
      text.style.color = color1;
      checkFormulaire.address = true;
      return address;
    } else {
      text.innerHTML =
        "Merci de rentrer une adresse valide (ex : 12 rue des baies 64500)";
      text.style.color = color2;
      checkFormulaire.address = false;
    }
  }
  // Fonction pour vérifier la ville
  function validCity() {
    let city = document.getElementById("city").value;
    let text = document.getElementById("cityErrorMsg");
    let pattern = /^[a-z ,.'-]+$/i;

    if (city.match(pattern)) {
      text.innerHTML = "Ville valide";
      text.style.color = color1;
      checkFormulaire.city = true;
      return city;
    } else {
      text.innerHTML = "Merci de rentrer une ville valide";
      text.style.color = color2;
      checkFormulaire.city = false;
    }
  }
  //Fonction pour vérifier l'Email
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
      checkFormulaire.email = true;
      return mail;
    } else {
      text.innerHTML = "Merci de rentrer une adresse valide";
      text.style.color = color2;
      checkFormulaire.email = false;
    }
  }

  // On appelle les fonctions pour qu'elles puissent s'afficher sur le DOM
  validFirstName();
  validLastName();
  validAddress();
  validCity();
  validEmail();
});

// Fonction pour envoyer le formulaire au LocalStorage et faire apparaitre la page de confirmation
function sendOrder() {
  // on créé l'objet contact
  let contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value,
  };

  // on crée le tableau consituté des ID des produits à partir du LS
  let products = [];
  for (let i = 0; i < shoppingCartLocalStorage.length; i++) {
    products.push(shoppingCartLocalStorage[i].__id);
  }

  // on créé une constante pour lier l'API avec la commande
  const toSend = {
    contact,
    products,
  };

  //on met en place le lien avec API de la commande
  const promiseOne = fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(toSend),
    headers: {
      "Content-type": "application/json",
    },
  });

  // Pour voir le résultat du serveur dans la console
  promiseOne.then(async (response) => {
    try {
      const content = await response.json();

      if (response.ok && shoppingCartLocalStorage) {
        // Redirection vers la page confirmation
        window.location = `../html/confirmation.html?id=${content.orderId}`;
      } else {
        console.log(`Réponse du serveur : `, response.status);
      }
    } catch (error) {
      console.log("Erreur qui vient du catch : ", error);
    }
  });
}

// On ajoute un événement au click pour vérifier que le formulaire est correctement rempli avant de l'envoyer au LS
let sendContact = document.getElementById("order");

sendContact.addEventListener("click", (e) => {
  e.preventDefault();

  // On suppose que tout le formulaire est valide
  let formOK = true;

  // On vérifie que toutes les entrées input sont true dans checkFormulaire
  // Si une entrée est false, on passe formOK à false
  for (let input in checkFormulaire) {
    if (checkFormulaire[input] === false) {
      formOK = false;
    }
  }
  console.log(formOK);
  // si formOK est true, on peut valider la commande, sinon on ne fait rien
  if (formOK === true) {
    sendOrder();
  }
});

// On rajoute la quantité totale à côté du panier pour contrôle
let cart = () => {
  let panier = document
    .getElementsByTagName("nav")[0]
    .getElementsByTagName("li")[1];

  letshoppingCartLocalStorage = JSON.parse(localStorage.getItem("products"));

  let sum = 0;
  for (let q in shoppingCartLocalStorage) {
    let loop = parseInt(shoppingCartLocalStorage[q].quantity);
    sum += loop;
  }

  panier.innerHTML = `Panier <span id="test" style='color:purple'>${"("}${sum}${")"}</span>`;
};
cart();
