import API from './API.js';

export async function loadData() {
    const data = await API.fetchMenu();
    app.store.menu = data;
}

export async function getProductById(id) {
    if (app.store.menu==null) {
        await loadData();
    }
    for (let c of app.store.menu ?? []) {
        for (let p of c.products) {
            if (p.id==id) {
                return p;
            }
        }
    }
    return null;
}


export function placeOrder() {
    alert("Your order will be ready under the number " + 
    parseInt(Math.random()*100));
    app.store.menu = [];
}

export async function addToCart(id) {
    const product = await getProductById(id);
    if (!product) {
        throw new Error(`Product "${id}" was not found.`);
    }
    const results = app.store.cart.filter(prodInCart => prodInCart.product.id==id);
    if (results.length == 1) {
        app.store.cart = app.store.cart.map(p =>  p.product.id==id ? {...p, quantity: p.quantity+1} : p)
    } else {
        app.store.cart = [...app.store.cart, {product, quantity: 1}];
    }
}

export function removeFromCart(id) {
    app.store.cart = app.store.cart.filter(prodInCart => prodInCart.product.id!=id);
}