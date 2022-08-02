// On bascule vers la page de confirmation
if (document.URL.includes("confirmation.html")) {
  // Confirmation du numéro de commande
  const orderId = new URL(window.location.href).searchParams.get("id");
  let showCommand = () => {
    const idSelector = document.getElementById("orderId");

    idSelector.innerHTML = orderId;
  };
  showCommand();
  localStorage.clear();
}
