import styles from './menu.css?inline';
import productStyles from './product-item.css?inline';
import { html, render } from 'lit-html';

export default class MenuPage extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        const template = document.getElementById("menu-page-template");
        this.root.appendChild(template.content.cloneNode(true));
        const style = document.createElement("style");
        style.textContent = `${styles}\n${productStyles}`;
        this.root.appendChild(style);
        this.onMenuChange = () => this.render();
    }
    connectedCallback() {
        window.addEventListener("appmenuchange", this.onMenuChange);
        this.render();
    }

    disconnectedCallback() {
        window.removeEventListener("appmenuchange", this.onMenuChange);
    }

    render() {
        const menu = this.root.querySelector("#menu");
        render(app.store.menu
            ? html`${app.store.menu.map(category => html`
                <li>
                    <h3>${category.name}</h3>
                    <ul class="category">
                        ${category.products.map(product => html`
                            <product-item data-product=${JSON.stringify(product)}></product-item>
                        `)}
                    </ul>
                </li>
            `)}`
            : html`<li>Loading...</li>`, menu);
    }
}
customElements.define("menu-page", MenuPage);