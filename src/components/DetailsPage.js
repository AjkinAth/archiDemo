import { addToCart, getProductById } from '../services/Order.js';
import styles from './details.css?inline';
import getProductImage from '../data/productImages.js';
import { html, render } from 'lit-html';

export default class DetailsPage extends HTMLElement {

    constructor() {
        super();
    
        this.root = this.attachShadow({ mode: "open" });
    
        const template = document.getElementById("details-page-template");
        const content = template.content.cloneNode(true);
        this.root.appendChild(content);    
        const style = document.createElement("style");
        style.textContent = styles;
        this.root.appendChild(style);
    }   

    async renderData() {
        if (this.dataset.productId) {
            this.product = await getProductById(this.dataset.productId);
            if (!this.product) {
                render(html`
                    <p class="eyebrow">SORRY ABOUT THAT</p>
                    <h2>We couldn't find that item.</h2>
                    <a class="back-to-menu navlink" href="/">← Back to the menu</a>
                `, this.root.querySelector(".details-copy"));
                return;
            }
            this.root.querySelector("h2").textContent = this.product.name;
            this.root.querySelector("img").src = this.product.image || getProductImage(this.product.id) || "";
            this.root.querySelector("img").alt = this.product.name;
            this.root.querySelector(".description").textContent = this.product.description;
            this.root.querySelector(".price").textContent = `$${this.product.price.toFixed(2)}`;
            this.root.querySelector("button").addEventListener("click", ()=> {
                addToCart(this.product.id);
                app.router.go('/order');
            })
        } else {
            alert("Invalid Product ID");
        }
    }

    connectedCallback() {
        this.renderData();
    }

}

customElements.define("details-page", DetailsPage);