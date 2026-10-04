import americano from '../assets/products/americano.svg';
import bananaBread from '../assets/products/banana-bread.svg';
import blueberryMuffin from '../assets/products/blueberry-muffin.svg';
import butterCroissant from '../assets/products/butter-croissant.svg';
import cappuccino from '../assets/products/cappuccino.svg';
import chaiLatte from '../assets/products/chai-latte.svg';
import chocolateChipCookie from '../assets/products/chocolate-chip-cookie.svg';
import coldBrew from '../assets/products/cold-brew.svg';
import dripCoffee from '../assets/products/drip-coffee.svg';
import espresso from '../assets/products/espresso.svg';
import herbalTea from '../assets/products/herbal-tea.svg';
import matchaLatte from '../assets/products/matcha-latte.svg';
import mocha from '../assets/products/mocha.svg';
import vanillaLatte from '../assets/products/vanilla-latte.svg';

const productImages = {
    americano,
    'banana-bread': bananaBread,
    'blueberry-muffin': blueberryMuffin,
    'butter-croissant': butterCroissant,
    cappuccino,
    'chai-latte': chaiLatte,
    'chocolate-chip-cookie': chocolateChipCookie,
    'cold-brew': coldBrew,
    'drip-coffee': dripCoffee,
    espresso,
    'herbal-tea': herbalTea,
    'matcha-latte': matchaLatte,
    mocha,
    'vanilla-latte': vanillaLatte
};

export default function getProductImage(id) {
    return productImages[id] ?? null;
}
