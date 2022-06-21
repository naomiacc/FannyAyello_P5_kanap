const elementItems = document.getElementById("items");

// Récupération des produits de l'API
function getProducts() {
  fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => console.log(data));
}

// Création des éléments produits dans le DOM

for (let i = 0; i < data.length; i++) {
  let productLink = document.createElement("a");
  document.querySelector(".items").appendChild(productLink);

  // attribut href
  productLink.href = `product.html?id=${data[i]._id}`;

  // élément "article"
  let productArticle = document.createElement("article");
  productLink.appendChild(productArticle);

  // images
  let productImg = document.createElement("img");
  productArticle.appendChild(productImg);
  productImg.src = data[i].imageUrl;
  productImg.alt = data[i].altTxt;

  // titre "h3"
  let productName = document.createElement("h3");
  productArticle.appendChild(productName);
  productName.classList.add("productName");
  productName.innerHTML = data[i].name;

  // description "p"
  let productDescription = document.createElement("p");
  productArticle.appendChild(productDescription);
  productDescription.classList.add("productName");
  productDescription.innerHTML = data[i].description;
}
