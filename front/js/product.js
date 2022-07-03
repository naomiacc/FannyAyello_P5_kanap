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
