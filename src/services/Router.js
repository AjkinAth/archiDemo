let transitionId = 0;
let activeAnimation = null;
let currentRoute = location.pathname;

const routes = [
    {
        match: route => route === "/" ? {} : null,
        createPage: () => document.createElement("menu-page")
    },
    {
        match: route => route === "/order" ? {} : null,
        createPage: () => document.createElement("order-page")
    },
    {
        match: route => {
            const productMatch = route.match(/^\/product-(.+)$/);
            return productMatch ? { productId: productMatch[1] } : null;
        },
        createPage: ({ productId }) => {
            const page = document.createElement("details-page");
            page.dataset.productId = productId;
            return page;
        }
    }
];

const Router = {
    init: () => {
        document.addEventListener("click", event => {
            const link = event.composedPath().find(
                element => element instanceof HTMLAnchorElement && element.matches("a.navlink")
            );
            if (!link) return;

            event.preventDefault();
            Router.go(link.getAttribute("href"));
        });
        Router.go(location.pathname);
        window.addEventListener("popstate", event => {
            Router.go(event.state?.route ?? location.pathname, false);
        });
    },
    go: async (route, addToHistory = true) => {
        const matchedRoute = routes
            .map(routeDefinition => ({
                routeDefinition,
                params: routeDefinition.match(route)
            }))
            .find(match => match.params !== null);
        if (!matchedRoute) return;

        if (addToHistory) {
            history.pushState({ route }, "", route);
        }
        const pageElement = matchedRoute.routeDefinition.createPage(matchedRoute.params);
        const main = document.querySelector("main");
        const currentTransitionId = ++transitionId;
        const previousRoute = currentRoute;
        const routeChangeDetail = { from: previousRoute, to: route };
        main.dispatchEvent(new CustomEvent("routechange", {
            bubbles: true,
            detail: routeChangeDetail
        }));
        activeAnimation?.cancel();
        activeAnimation = null;
        const animationsEnabled =
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
            typeof Element.prototype.animate === "function";

        if (main.firstElementChild && animationsEnabled) {
            const exitAnimation = main.firstElementChild.animate(
                [
                    { opacity: 1, transform: "translateY(0)" },
                    { opacity: 0, transform: "translateY(-8px)" }
                ],
                { duration: 140, easing: "ease-in", fill: "both" }
            );
            activeAnimation = exitAnimation;
            await Promise.race([
                exitAnimation.finished.catch(() => {}),
                new Promise(resolve => setTimeout(resolve, 180))
            ]);
            if (currentTransitionId !== transitionId) return;
            exitAnimation.cancel();
            activeAnimation = null;
        }

        if (currentTransitionId !== transitionId) return;
        main.replaceChildren(pageElement);
        currentRoute = route;
        window.scrollTo(0, 0);
        main.dispatchEvent(new CustomEvent("routechanged", {
            bubbles: true,
            detail: { ...routeChangeDetail, page: pageElement }
        }));

        if (animationsEnabled) {
            const enterAnimation = pageElement.animate(
                [
                    { opacity: 0, transform: "translateY(12px)" },
                    { opacity: 1, transform: "translateY(0)" }
                ],
                { duration: 220, easing: "ease-out" }
            );
            activeAnimation = enterAnimation;
            enterAnimation.finished
                .then(() => {
                    if (currentTransitionId === transitionId) {
                        activeAnimation = null;
                    }
                })
                .catch(() => {});
        }
    }
};

export default Router;