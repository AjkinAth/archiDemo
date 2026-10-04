import orderStyles from './order.css?inline';
import { html, render } from 'lit-html';

export default class OrderPage extends HTMLElement {
   #user = {
    name: "",
    phone: "",
    email: ""
  }
  constructor() {
      super();
  
      this.root = this.attachShadow({ mode: "open" });    
      const style = document.createElement("style");
      style.textContent = orderStyles;
      this.root.appendChild(style);
      const section = document.createElement("section");
      this.root.appendChild(section);
      this.onCartChange = () => this.render();
  }   

  connectedCallback() {
    window.addEventListener("appcartchange", this.onCartChange);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener("appcartchange", this.onCartChange);
  }
   
  render() {
    const cart = app.store.cart;
    const section = this.root.querySelector("section");
    if (cart.length === 0) {
      render(html`<p class="empty">Your order is empty</p>`, section);
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    render(html`
      <h2>Your Order</h2>
      <ul>
        ${cart.map(item => html`
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
                app.store.cart = app.store.cart.filter(
                  cartItem => cartItem.product.id !== item.product.id
                );
              }}
            >Remove</a>
          </li>
        `)}
        <li class="total-row">
          <p>Total</p>
          <p class="price-total">$${total.toFixed(2)}</p>
        </li>
      </ul>
      <form
        class="order-form"
        @submit=${event => {
          event.preventDefault();
          const { name, email } = this.#user;
          alert(`Thanks for your order ${name}. ${email ? "We will be sending you the receipt over email." : "Ask at the counter for a receipt."}`);
          app.store.cart = [];
          this.#user.name = "";
          this.#user.email = "";
          this.#user.phone = "";
        }}
      >
        <div class="form-heading">
          <p class="eyebrow">ALMOST THERE</p>
          <h3>Where should we send your receipt?</h3>
          <p class="form-description">
            Add your contact details so we can have your order ready for you.
          </p>
        </div>
        <div class="form-fields">
          <div class="form-group">
            <label for="customer-name">Name</label>
            <input
              id="customer-name"
              name="name"
              type="text"
              autocomplete="name"
              required
              .value=${this.#user.name}
              @input=${event => { this.#user.name = event.currentTarget.value; }}
            />
          </div>
          <div class="form-group">
            <label for="customer-phone">Phone</label>
            <input
              id="customer-phone"
              name="phone"
              type="tel"
              autocomplete="tel"
              required
              .value=${this.#user.phone}
              @input=${event => { this.#user.phone = event.currentTarget.value; }}
            />
          </div>
          <div class="form-group email-field">
            <label for="customer-email">Email <span>(optional)</span></label>
            <input
              id="customer-email"
              name="email"
              type="email"
              autocomplete="email"
              .value=${this.#user.email}
              @input=${event => { this.#user.email = event.currentTarget.value; }}
            />
          </div>
        </div>
        <button class="submit-order" type="submit">
          Place your order <span aria-hidden="true">→</span>
        </button>
      </form>
    `, section);
  }
}

customElements.define("order-page", OrderPage);