const API = {
    url: new URL("../data/menu.json", import.meta.url).href,
    fetchMenu: async () => {
        const result = await fetch(API.url);
        if (!result.ok) {
            throw new Error(`Unable to load the menu (${result.status}).`);
        }
        const data = await result.json();
        return data.categories.map(category => ({
            ...category,
            products: category.items.map(product => ({ ...product }))
        }));
    }
}

export default API;