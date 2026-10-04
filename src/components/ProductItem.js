import { addToCart } from "../services/Order.js";
import getProductImage from '../data/productImages.js';

export default class ProductItem extends HTMLElement {
    constructor() {
        super();  
    }   

    connectedCallback() {
        const template = document.getElementById("product-item-template");
        const content = template.content.cloneNode(true);

        this.appendChild(content);    

        const product = JSON.parse(this.dataset.product);
        this.draggable = true;
        this.addEventListener("dragstart", event => {
            this.setAttribute("dragging", "");
            event.dataTransfer.effectAllowed = "copy";
            event.dataTransfer.setData("application/x-archidemo-product", product.id);
            event.dataTransfer.setData("text/plain", product.name);
        });
        this.addEventListener("dragend", () => {
            this.removeAttribute("dragging");
        });
        this.querySelector("h4").textContent = product.name;
        this.querySelector(".description").textContent = product.description;
        this.querySelector("p.price").textContent = `$${product.price.toFixed(2)}`;
        const image = this.querySelector("img");
        image.src = product.image || getProductImage(product.id) || "";
        image.alt = product.name;
        this.querySelector(".product-link").addEventListener("click", event => {
            event.preventDefault();
            app.router.go(`/product-${product.id}`);
        })
        this.querySelector(".add-to-cart").addEventListener("click", async () => {
            await addToCart(product.id);
        });
      }
}

customElements.define("product-item", ProductItem);