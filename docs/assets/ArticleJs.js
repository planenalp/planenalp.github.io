function loadResource(t, o) {
    if ("style" === t) {
        const t = document.createElement("style");
        t.textContent = o.css;
        document.head.appendChild(t);
    }
}

let tocTitle;

function ToTop() {
    window.scrollTo({ top: 0 });
    tocTitle.scrollTop = 0;
}

function ToBottom() {
    window.scrollTo({ top: document.body.scrollHeight });
}

function createTOC() {
    const t = document.createElement("div");
    t.className = "toc";
    
    const o = document.createElement("div");
    o.className = "toc-btn";
    t.appendChild(o);
    
    (tocTitle = document.createElement("div")).className = "toc-title";
    t.appendChild(tocTitle);
    document.body.appendChild(t);
    
    o.innerHTML = `
        <div onclick="ToTop();">
            <a title="跳转顶部">
                <svg class="octicon" width="16" height="16">
                    <path id="ToTopBtn" fill-rule="evenodd" d="..."></path>
                </svg>
            </a>
        </div>
        <div onclick="ToBottom();">
            <a title="跳转底部">
                <svg class="octicon" width="16" height="16">
                    <path id="ToBottom" fill-rule="evenodd" d="..."></path>
                </svg>
            </a>
        </div>
    `;

    document.querySelectorAll(".markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6").forEach(t => {
        t.id || (t.id = t.textContent.trim().replace(/\s+/g, "-").toLowerCase());
        
        const o = document.createElement("a");
        o.href = `#${t.id}`;
        o.textContent = t.textContent;
        o.className = `toc-link toc-${t.tagName.toLowerCase()}`;

        if ("H1" !== t.tagName) {
            const e = parseInt(t.tagName.charAt(1));
            o.style.marginLeft = `${10 * (e - 1)}px`;
        }

        o.addEventListener("click", function (o) {
            o.preventDefault();
            document.getElementById(t.id).scrollIntoView();
        });
        
        tocTitle.appendChild(o);
    });
}

function toggleTOC() {
    const t = document.querySelector(".toc"),
          o = document.querySelector(".ArticleTOC");
    
    if (t && o) {
        t.classList.toggle("show");
        o.classList.toggle("active");
        o.style.boxShadow = o.classList.contains("active") 
            ? "6px 6px 14px 0 var(--header-btn-shadowColor) inset, -7px -7px 12px 0 var(--header-btn-shadowColor2) inset"
            : "";
    }
}

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
    
    // 样式和后续初始化代码...
    // (此处省略部分重复的样式和事件绑定代码)
});
