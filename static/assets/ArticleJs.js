
document.addEventListener("DOMContentLoaded", () => {
    const t = new IntersectionObserver(o => {
        o.forEach(o => {
            if (o.isIntersecting) {
                const e = o.target,
                      a = e.previousElementSibling;

                const i = (t = !1) => {
                    if (a && a.classList.contains("ImgLazyLoad-circle")) {
                        a.style.display = "none";
                    }
                    
                    if (t) {
                        const t = document.createElement("div");
                        t.classList.add("Imgerror-container");
                        t.innerHTML = `...`;
                        e.parentNode.insertBefore(t, e.nextSibling);
                        e.style.display = "none";
                    } else {
                        e.classList.remove("ImgLazyLoad-circle");
                        e.classList.add("ImgLoaded");
                    }
                };

                e.src = e.getAttribute("img-src");
                t.unobserve(e);
                e.onload = () => i(!1);
                e.onerror = () => i(!0);
            }
        });
    }, { rootMargin: "0px 0px 500px 0px" });

    document.querySelectorAll("[img-src]").forEach(o => t.observe(o));
});
