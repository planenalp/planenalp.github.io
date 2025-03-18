// 记得修改 const fancyboxLink 字段中 fancybox.css 对应的链接位置

//允许移动端实现图标按压特效
document.addEventListener('touchstart', function() {}, false);

// 引入额外的资源（如样式）的辅助函数
function loadResource(type, attributes) {
    if (type === 'style') {
        const style = document.createElement('style');
        style.textContent = attributes.css;
        document.head.appendChild(style);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    /**
     * 将原来的正则替换逻辑转为 DOM 操作：
     * 1. 查找 <p><a target="_blank" rel=...><img src="URL" ...></a></p>，
     *    检查 a.href 与 img.src 是否一致，然后用新的结构替换整个 <p>。
     * 2. 查找不在 <p> 中的 <a target="_blank" rel=...><img src="URL" ...></a>，同理替换。
     * 
     * 此处我们将真实图片地址写入 data-src 属性，同时不直接给 img 元素设置 src，
     * 以便于懒加载和让 Fancybox 通过 data-src 获取真实地址。
     */
    function replaceImageLinks() {
        // 处理 <p><a> 包裹的情况
        document.querySelectorAll('p > a[target="_blank"][rel] > img').forEach(function(img) {
            const a = img.parentElement;
            const p = a.parentElement;
            if (a.href && a.href === img.src) {
                const replacementHTML = `<div class="ImgLazyLoad-circle"></div>
<img data-fancybox="gallery" data-src="${a.href}" alt="">`;
                p.outerHTML = replacementHTML;
            }
        });
        // 处理不在 <p> 中的情况
        document.querySelectorAll('a[target="_blank"][rel] > img').forEach(function(img) {
            const a = img.parentElement;
            if (
                a.parentElement &&
                a.parentElement.tagName.toLowerCase() !== 'p' &&
                a.href &&
                a.href === img.src
            ) {
                const replacementHTML = `<div class="ImgLazyLoad-circle"></div>
<img data-fancybox="gallery" data-src="${a.href}" alt="">`;
                a.outerHTML = replacementHTML;
            }
        });
    }
    replaceImageLinks();

    ////////////////// 懒加载图片 start ////////////////
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const imgContainer = img.previousElementSibling;
                    const handleError = (isError = false) => {
                        if (imgContainer && imgContainer.classList.contains('ImgLazyLoad-circle')) {
                            imgContainer.style.display = 'none';
                        }
                        if (isError) {
                            const errorContainer = document.createElement('div');
                            errorContainer.classList.add('Imgerror-container');
                            errorContainer.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" style="height:60px;" class="Imgerror" viewBox="0 0 1024 1024">
    <path fill="#ff5b5b" d="M320 896h-77.833L515.92 622.253a21.333 21.333 0 0 0 3.16-26.133l-89.427-149.053 165.427-330.86A21.333 21.333 0 0 0 576 85.333H96a53.393 53.393 0 0 0-53.333 53.334v746.666A53.393 53.393 0 0 0 96 938.667h224A21.333 21.333 0 0 0 320 896zM96 128h445.48L386.253 438.46a21.333 21.333 0 0 0 .787 20.513L474 603.86l-69.333 69.333-89.62-89.653a53.333 53.333 0 0 0-75.427 0L85.333 737.827v-599.16A10.667 10.667 0 0 1 96 128zM85.333 885.333v-87.166l184.46-184.454a10.667 10.667 0 0 1 15.08 0l89.627 89.62L181.833 896H96a10.667 10.667 0 0 1-10.667-10.667zm192-458.666C336.147 426.667 384 378.813 384 320s-47.853-106.667-106.667-106.667S170.667 261.187 170.667 320s47.853 106.667 106.666 106.667zm0-170.667a64 64 0 1 1-64 64 64.073 64.073 0 0 1 64-64zM928 128H661.333a21.333 21.333 0 0 0-19.08 11.793l-.046.087c-.04.087-.087.173-.127.253L535.587 353.127a21.333 21.333 0 1 0 38.16 19.08l100.773-201.54H928a10.667 10.667 0 0 1 10.667 10.666V652.5L783.713 497.54a53.333 53.333 0 0 0-75.426 0L571.08 634.747a21.333 21.333 0 0 0-3.153 26.153l24.666 41.08-203.646 244.36a21.333 21.333 0 0 0 16.386 34.993H928A53.393 53.393 0 0 0 981.333 928V181.333A53.393 53.393 0 0 0 928 128zm0 810.667H450.88L635.053 717.66a21.333 21.333 0 0 0 1.907-24.667l-23.933-39.886L738.46 527.68a10.667 10.667 0 0 1 15.08 0l185.127 185.153V928A10.667 10.667 0 0 1 928 938.667z"/>
</svg>
<p class="Imgerror-message">图片错误</p>`;
                            img.parentNode.insertBefore(errorContainer, img.nextSibling);
                            img.style.display = 'none';
                        } else {
                            img.classList.remove('ImgLazyLoad-circle');
                            img.classList.add('ImgLoaded');
                        }
                    };

                    // 当图片进入可视区域时，从 data-src 中获取真实图片地址并赋值给 src
                    img.src = img.getAttribute('data-src');
                    observer.unobserve(img);

                    img.onload = () => handleError(false);
                    img.onerror = () => handleError(true);
                }
            });
        },
        {
            rootMargin: '0px 0px 500px 0px'
        }
    );

    // 观察所有带有 data-src 属性的图片
    document.querySelectorAll('[data-src]').forEach(img => observer.observe(img));
    ////////////////// 懒加载图片 end ////////////////

    ////////////////// Fancybox 绑定及配置 start ////////////////
    // 添加 Fancybox CSS
    const fancyboxLink = Object.assign(document.createElement('link'), {
        rel: 'stylesheet',
        href: 'https://planenalp.github.io/assets/fancybox.css' // 根据实际需要修改此链接
    });
    document.head.appendChild(fancyboxLink);

    // 绑定 Fancybox，并指定选项 srcAttr 为 "data-src"
    // 这样 Fancybox 在切换幻灯片时会优先使用 data-src 中的真实图片地址
    Fancybox.bind('[data-fancybox="gallery"]', {
        srcAttr: 'data-src'
    });
    ////////////////// Fancybox 绑定及配置 end ////////////////

    // 以下是 TOC、返回顶部/底部按钮等其他代码（可按需保留）：

    // 初始化目录（TOC）
    function createTOC() {
        const contentContainer = document.querySelector('.markdown-body');
        if (!contentContainer) return;

        const tocElement = document.createElement('div');
        tocElement.className = 'toc';
        contentContainer.appendChild(tocElement);

        const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            if (!heading.id) {
                heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
            }
            const link = document.createElement('a');
            link.href = '#' + heading.id;
            link.textContent = heading.textContent;
            link.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 1) * 10}px`;
            link.addEventListener('click', e => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
            });
            tocElement.appendChild(link);
        });
    }
    createTOC();

    // TOC、返回顶部和返回底部按钮的样式及交互（代码略，可参考原有逻辑）
    const combinedCss = `
    /* 默认亮主题配色 */
    :root {
        --toc-bg: rgba(255, 255, 255, 0.8);
        --toc-border: #E1E4E8;
        --toc-a-text: #1F2328;
        --toc-a-hover: #002FA7CC;
        --toc-icon-bgColor: #FFFFFFB3;
        --toc-icon-color: #656D76B3;
        --toc-icon-hover-bgColor: #002FA7B3;
        --toc-icon-hover-color: #FFFFFFB3;
    }
    /* 暗主题配色 */
    [data-color-mode=light][data-light-theme=dark],
    [data-color-mode=light][data-light-theme=dark]::selection,
    [data-color-mode=dark][data-dark-theme=dark],
    [data-color-mode=dark][data-dark-theme=dark]::selection {
        --toc-bg: #21262DCC;
        --toc-border: rgba(240, 246, 252, 0.1);
        --toc-a-text: #C9D1D9;
        --toc-a-hover: #002FA7CC;
        --toc-icon-bgColor: #21262DB3;
        --toc-icon-color: rgba(240, 246, 252, 0.1);
        --toc-icon-hover-bgColor: #002FA7B3;
        --toc-icon-hover-color: #8B949EB3;
    }
    
    .toc {
        position: fixed;
        bottom: 150px;
        right: 60px;
        z-index: 1000;
        width: 250px;
        max-height: 70vh;
        padding: 10px;
        overflow-y: auto;
        border: 1px solid var(--toc-border);
        border-radius: 6px;
        background-color: var(--toc-bg);
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transform: translateY(20px) scale(0.9);
        opacity: 0;
        visibility: hidden;
        transition: all 0.1s ease;
    }
    .toc.show {
        transform: translateY(0) scale(1);
        opacity: 1;
        visibility: visible;
    }
    .toc a {
        display: block;
        padding: 5px 0;
        border-radius: 6px;
        border-bottom: 1px solid var(--toc-border);
        color: var(--toc-a-text);
        transition: all 0.1s ease;
        font-size: 14px;
        line-height: 1.5;
        text-decoration: none;
    }
    .toc a:last-child {
        border-bottom: none;
    }
    .toc a:hover {
        padding-left: 5px;
        border-radius: 6px;
        background-color: var(--toc-a-hover);
    }
    .toc-icon {
        position: fixed;
        bottom: 130px;
        right: 20px;
        z-index: 1001;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--toc-icon-color);
        border-radius: 50%;
        background-color: var(--toc-icon-bgColor);
        color: var(--toc-icon-color);
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        transition: all 0.1s ease;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        outline: none;
    }
    .toc-icon:hover {
        border-color: var(--toc-icon-hover-color);
        background-color: var(--toc-icon-hover-bgColor);
        color: var(--toc-icon-hover-color);
        transform: scale(1.1);
    }
    .toc-icon:active {
        transform: scale(0.9);
    }
    .toc-icon.active {
        border-color: var(--toc-icon-hover-color);
        background-color: var(--toc-icon-hover-bgColor);
        color: var(--toc-icon-hover-color);
        transform: rotate(90deg);
    }
    .toc-icon svg {
        width: 24px;
        height: 24px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    .back-to-top, .back-to-bot {
        position: fixed;
        right: 20px;
        z-index: 10000;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        border: 1px solid var(--toc-icon-color);
        border-radius: 50%;
        background-color: var(--toc-icon-bgColor);
        color: var(--toc-icon-color);
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        opacity: 0;
        visibility: hidden;
        transition: all 0.1s ease;
        font-size: 24px;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        outline: none;
    }
    .back-to-top {
        bottom: 190px;
    }
    .back-to-bot {
        bottom: 70px;
    }
    .back-to-top.show, .back-to-bot.show {
        opacity: 1;
        visibility: visible;
    }
    .back-to-top:hover, .back-to-bot:hover {
        border-color: var(--toc-icon-hover-color);
        background-color: var(--toc-icon-hover-bgColor);
        color: var(--toc-icon-hover-color);
        transform: scale(1.1);
    }
    .back-to-top:active, .back-to-bot:active {
        transform: scale(0.9);
    }
    .back-to-top svg, .back-to-bot svg {
        width: 24px;
        height: 24px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    @media (max-width: 768px) {
        .toc {
            width: 200px;
        }
    }
    `;
    loadResource('style', { css: combinedCss });

    // 创建 TOC 切换图标
    const tocIcon = document.createElement('div');
    tocIcon.className = 'toc-icon';
    tocIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    tocIcon.addEventListener('click', e => {
        e.stopPropagation();
        const tocElement = document.querySelector('.toc');
        tocElement.classList.toggle('show');
        tocIcon.classList.toggle('active');
        tocIcon.innerHTML = tocElement.classList.contains('show')
            ? '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'
            : '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    });
    document.body.appendChild(tocIcon);

    // 点击页面其他区域时隐藏目录
    document.addEventListener('click', e => {
        const tocElement = document.querySelector('.toc');
        if (
            tocElement &&
            tocElement.classList.contains('show') &&
            !tocElement.contains(e.target) &&
            !e.target.closest('.toc-icon')
        ) {
            tocElement.classList.remove('show');
            tocIcon.classList.remove('active');
            tocIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
        }
    });

    // 创建返回顶部和返回底部按钮
    const btnTop = document.createElement('button');
    btnTop.className = 'back-to-top';
    btnTop.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btnTop);

    const btnBot = document.createElement('button');
    btnBot.className = 'back-to-bot';
    btnBot.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>';
    document.body.appendChild(btnBot);

    btnTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    btnBot.addEventListener('click', () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    });

    function updateButtons() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        scrollTop > 100
            ? btnTop.classList.add('show')
            : btnTop.classList.remove('show');
        scrollTop + windowHeight < documentHeight - 100
            ? btnBot.classList.add('show')
            : btnBot.classList.remove('show');
    }
    window.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
});
