//记得修改 const fancyboxLink 字段的 fancybox.css 对应的链接位置

// 引入额外的资源（如样式）辅助函数
function loadResource(type, attributes) {
    if (type === 'style') {
        const style = document.createElement('style');
        style.textContent = attributes.css;
        document.head.appendChild(style);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    /**
     * 将原来代码的正则替换逻辑转成客户端 DOM 操作：
     * 1. 查找 <p><a target="_blank" rel=...><img src="URL" ...></a></p>，检查 a.href 与 img.src 是否一致，
     *    然后用新的结构替换整个 <p>。
     * 2. 查找不在 <p> 中的 <a target="_blank" rel=...><img src="URL" ...></a>，同理替换。
     */
    function replaceImageLinks() {
        // 处理 <p><a> 包裹的情况
        document.querySelectorAll('p > a[target="_blank"][rel] > img').forEach(function(img) {
            const a = img.parentElement;
            const p = a.parentElement;
            if (a.href && a.href === img.src) {
                const replacementHTML = `<div class="ImgLazyLoad-circle"></div>
<img data-fancybox="gallery" img-src="${a.href}">`;
                p.outerHTML = replacementHTML;
            }
        });
        // 处理不在 <p> 中的情况
        document.querySelectorAll('a[target="_blank"][rel] > img').forEach(function(img) {
            const a = img.parentElement;
            if (a.parentElement && a.parentElement.tagName.toLowerCase() !== 'p' && a.href && a.href === img.src) {
                const replacementHTML = `<div class="ImgLazyLoad-circle"></div>
<img data-fancybox="gallery" img-src="${a.href}">`;
                a.outerHTML = replacementHTML;
            }
        });
    }
    replaceImageLinks();

    ////////////////// 懒加载图片 start ////////////////
    const ob = new IntersectionObserver((entries) => {
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

                // 图片进入可视区域时加载真实图片地址
                img.src = img.getAttribute('img-src');
                ob.unobserve(img);

                img.onload = () => handleError(false);
                img.onerror = () => handleError(true);
            }
        });
    }, {
        rootMargin: '0px 0px 500px 0px',
    });
    document.querySelectorAll('[img-src]').forEach(img => ob.observe(img));
    ////////////////// 懒加载图片 end ////////////////

    ////////////////// 解决 lazyload 与 fancybox 冲突（仅预加载相邻图片） start ////////////////
    // 点击页面时基于 DOM 顺序预加载当前图片左右相邻的图片
    function preloadAdjacentImagesByDOM(target) {
        const gallery = Array.from(document.querySelectorAll('[data-fancybox="gallery"]'));
        const index = gallery.indexOf(target);
        if (index > 0) {
            const prevImg = gallery[index - 1];
            if (!prevImg.getAttribute('src') || prevImg.getAttribute('src') === '') {
                prevImg.src = prevImg.getAttribute('img-src');
            }
        }
        if (index < gallery.length - 1) {
            const nextImg = gallery[index + 1];
            if (!nextImg.getAttribute('src') || nextImg.getAttribute('src') === '') {
                nextImg.src = nextImg.getAttribute('img-src');
            }
        }
    }
    document.addEventListener('click', function(event) {
        const target = event.target.closest('[data-fancybox="gallery"]');
        if (target) {
            preloadAdjacentImagesByDOM(target);
        }
    }, true);

    // 利用 Fancybox 的 afterShow 事件，在幻灯片切换后预加载当前幻灯片左右相邻的图片
    Fancybox.bind('[data-fancybox="gallery"]', {
        on: {
            "afterShow": (fancybox, slide) => {
                const carousel = fancybox.Carousel;
                const slides = carousel.slides;
                const currentIndex = slide.index; // 当前幻灯片索引
                // 预加载上一张
                if (currentIndex > 0) {
                    const prevSlide = slides[currentIndex - 1];
                    if (prevSlide && prevSlide.$content) {
                        const prevImg = prevSlide.$content.querySelector('img');
                        if (prevImg && (!prevImg.getAttribute('src') || prevImg.getAttribute('src') === '')) {
                            prevImg.src = prevImg.getAttribute('img-src');
                        }
                    }
                }
                // 预加载下一张
                if (currentIndex < slides.length - 1) {
                    const nextSlide = slides[currentIndex + 1];
                    if (nextSlide && nextSlide.$content) {
                        const nextImg = nextSlide.$content.querySelector('img');
                        if (nextImg && (!nextImg.getAttribute('src') || nextImg.getAttribute('src') === '')) {
                            nextImg.src = nextImg.getAttribute('img-src');
                        }
                    }
                }
            }
        }
    });
    ////////////////// 解决 lazyload 与 fancybox 冲突 end ////////////////

    ////////////////// 引入 Fancybox 的 CSS 及绑定 start ////////////////
    const fancyboxLink = Object.assign(document.createElement('link'), {
        rel: 'stylesheet',
        href: 'https://planenalp.github.io/assets/fancybox.css' // 根据实际需要修改此链接
    });
    document.head.appendChild(fancyboxLink);
    ////////////////// 引入 Fancybox 的 CSS 及绑定 end ////////////////

    // 初始化目录（TOC）相关代码
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
            // 根据标题级别增加内边距
            link.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 1) * 10}px`;
            link.addEventListener('click', e => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
            });
            tocElement.appendChild(link);
        });
    }
    
    function toggleTOC() {
        const tocElement = document.querySelector('.toc');
        const tocIcon = document.querySelector('.toc-icon');
        if (tocElement && tocIcon) {
            tocElement.classList.toggle('show');
            tocIcon.classList.toggle('active');
            tocIcon.innerHTML = tocElement.classList.contains('show')
                ? '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'
                : '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
        }
    }
    
    createTOC();
    
    const combinedCss = `
        :root {
            --toc-bg: rgba(255, 255, 255, 0.8);
            --toc-border: #e1e4e8;
            --toc-text: #1F2328;
            --toc-hover: #81D8D0CC;
            --toc-icon-bg: #FFFFFFB3;
            --toc-icon-color: #656d76b3;
            --toc-icon-active-bg: #81D8D0B3;
            --toc-icon-active-color: #FFFFFFB3;
        }
        @media (prefers-color-scheme: dark) {
            :root {
                --toc-bg: #21262dcc;
                --toc-border: rgba(240, 246, 252, 0.1);
                --toc-text: #c9d1d9;
                --toc-hover: #002fa7cc;
                --toc-icon-bg: #21262db3;
                --toc-icon-color: rgba(240, 246, 252, 0.1);
                --toc-icon-active-bg: #002fa7b3;
                --toc-icon-active-color: #8b949eb3;
            }
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
            color: var(--toc-text);
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
            background-color: var(--toc-hover);
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
            border: 2px solid var(--toc-icon-color);
            border-radius: 50%;
            background-color: var(--toc-icon-bg);
            color: var(--toc-icon-color);
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            transition: all 0.1s ease;
            cursor: pointer;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            outline: none;
        }
        .toc-icon:hover {
            border-color: var(--toc-icon-active-color);
            background-color: var(--toc-icon-active-bg);
            color: var(--toc-icon-active-color);
            transform: scale(1.1);
        }
        .toc-icon:active {
            transform: scale(0.9);
        }
        .toc-icon.active {
            border-color: var(--toc-icon-active-color);
            background-color: var(--toc-icon-active-bg);
            color: var(--toc-icon-active-color);
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
            border: 2px solid var(--toc-icon-color);
            border-radius: 50%;
            background-color: var(--toc-icon-bg);
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
        .back-to-top { bottom: 190px; }
        .back-to-bot { bottom: 70px; }
        .back-to-top.show, .back-to-bot.show {
            opacity: 1;
            visibility: visible;
        }
        .back-to-top:hover, .back-to-bot:hover {
            border-color: var(--toc-icon-active-color);
            background-color: var(--toc-icon-active-bg);
            color: var(--toc-icon-active-color);
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
        toggleTOC();
    });
    document.body.appendChild(tocIcon);
    
    // 点击页面其他位置时隐藏目录
    document.addEventListener('click', e => {
        const tocElement = document.querySelector('.toc');
        if (tocElement && tocElement.classList.contains('show') && !tocElement.contains(e.target) && !e.target.closest('.toc-icon')) {
            toggleTOC();
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
        scrollTop > 100 ? btnTop.classList.add('show') : btnTop.classList.remove('show');
        (scrollTop + windowHeight < documentHeight - 100) ? btnBot.classList.add('show') : btnBot.classList.remove('show');
    }
    window.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
});
