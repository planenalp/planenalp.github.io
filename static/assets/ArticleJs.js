function loadResource(type, resource) {
    if ("style" === type) {
        const styleElement = document.createElement("style");
        styleElement.textContent = resource.css;
        document.head.appendChild(styleElement);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.head.appendChild(Object.assign(document.createElement("link"), {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css"
    }));

    Fancybox.bind('[data-fancybox="gallery"]', {});
});
