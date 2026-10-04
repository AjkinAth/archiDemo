import Store from './services/Store.js';
import { loadData } from "./services/Order.js";
import router from './services/Router.js';
import { addToCart } from './services/Order.js';
import './components/MenuPage.js';
import './components/ProductItem.js';
import './components/DetailsPage.js';
import './components/OrderPage.js';
import './components/CartItem.js';

window.addEventListener("DOMContentLoaded", () => {
  window.app = {};
  app.store = Store;
  app.router = router;
  router.init();
  loadData();

  const orderLink = document.querySelector(".order-link");
  const dropZone = document.querySelector(".site-header");
  const productType = "application/x-archidemo-product";
  dropZone.addEventListener("dragover", event => {
    if (!event.dataTransfer.types.includes(productType)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  });
  dropZone.addEventListener("dragenter", event => {
    if (event.dataTransfer.types.includes(productType)) {
      orderLink.classList.add("cart-drop-target");
    }
  });
  dropZone.addEventListener("dragleave", event => {
    if (!dropZone.contains(event.relatedTarget)) {
      orderLink.classList.remove("cart-drop-target");
    }
  });
  dropZone.addEventListener("drop", async event => {
    const productId = event.dataTransfer.getData(productType);
    if (!productId) return;

    event.preventDefault();
    orderLink.classList.remove("cart-drop-target");
    try {
      await addToCart(productId);
    } catch (error) {
      console.error("Unable to add the dropped product to the cart.", error);
    }
  });
});

window.addEventListener("appcartchange", () => {
    const badge = document.getElementById("badge");
    const orderLink = document.querySelector(".order-link");
    if (!badge || !orderLink || !app.store) return;
    const qty = app.store.cart.reduce((acc, item) => acc + item.quantity, 0);
    badge.textContent = qty;
    badge.hidden = qty === 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    orderLink.classList.remove("cart-flash");
    badge.classList.remove("cart-badge-flash");
    void orderLink.offsetWidth;
    orderLink.classList.add("cart-flash");
    badge.classList.add("cart-badge-flash");
});