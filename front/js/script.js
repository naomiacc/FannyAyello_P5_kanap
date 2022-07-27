// On pointe sur l'élément items du document
const elementItems = document.getElementById("items");

// Fonction pour récupérer les produits de l'API
function getProducts() {
  return fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log(e);
    });
}

// Initialisation des fonctions. Passage de paramètre product entre init et createHTML

init();
async function init() {
  products = await getProducts();
  products.forEach((product) => {
    createHTML(product);
  });
}

// Fonction pour créer les éléments HTML avec ses produits

function createHTML(product) {
  console.log(product);

  //attribut href
  let productLink = document.createElement("a");
  document.querySelector(".items").appendChild(productLink);
  productLink.href = "./product.html?id=" + product._id;

  // élément "article"
  let productArticle = document.createElement("article");
  productLink.appendChild(productArticle);

  // images
  let productImg = document.createElement("img");
  productArticle.appendChild(productImg);
  productImg.src = product.imageUrl;
  productImg.alt = product.altTxt;

  // titre "h3"
  let productName = document.createElement("h3");
  productArticle.appendChild(productName);
  productName.classList.add("productName");
  productName.innerHTML = product.name;

  // description "p"
  let productDescription = document.createElement("p");
  productArticle.appendChild(productDescription);
  productDescription.classList.add("productDescription");
  productDescription.innerHTML = product.description;
}
