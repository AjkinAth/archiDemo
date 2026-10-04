import { removeFromCart } from "../services/Order.js";
import { html, render } from "lit-html";

export default class CartItem extends HTMLElement {
    constructor() {
        super();    
    }   

    connectedCallback() {
        const item = JSON.parse(this.dataset.item);
        render(html`
          <li class="cart-row">
            <span class="qty">${item.quantity}x</span>
            <span class="name">${item.product.name}</span>
            <span class="price">$${item.product.price.toFixed(2)}</span>
            <a
              class="delete-button"
              href="#"
              aria-label="Remove ${item.product.name}"
              @click=${event => {
            event.preventDefault();
            removeFromCart(item.product.id);
              }}
            >Remove</a>
          </li>
        `, this);
    }
}

customElements.define("cart-item", CartItem);