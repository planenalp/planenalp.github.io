// 添加触摸事件支持允许移动端实现图标按压特效
document.addEventListener('touchstart', function() {}, { passive: true });
document.addEventListener('touchend', function() {}, { passive: true });

////////// 动态加载 CSS 样式 start //////////
function loadResource(type, attributes) {
    if (type === 'style') {
        const style = document.createElement('style');
        style.textContent = attributes.css;
        document.head.appendChild(style);
    }
}
////////// 动态加载 CSS 样式 end //////////

////////// 创建目录 start //////////
function createTOC() {
    const tocElement = document.createElement('div');
    tocElement.className = 'toc';
    document.body.appendChild(tocElement);

    const markdownBody = document.querySelector('.markdown-body');
    if (!markdownBody) return [];

    const headings = markdownBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) return [];

    const tocItems = [];
    headings.forEach(heading => {
        if (!heading.id) {
            heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
        }
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.className = 'toc-link';
        link.classList.add('toc-' + heading.tagName.toLowerCase());
        if (heading.tagName !== 'H1') {
            const level = parseInt(heading.tagName.charAt(1));
            link.style.marginLeft = `${(level - 1) * 10}px`;
        }
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.getElementById(heading.id);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
        tocElement.appendChild(link);
        tocItems.push({ link, heading });
    });
    return tocItems;
}
////////// 创建目录 end //////////

////////// 目录按钮切换功能 start //////////
function toggleTOC() {
    const tocElement = document.querySelector('.toc');
    const tocIcon = document.querySelector('.toc-icon');
    if (!tocElement || tocElement.children.length === 0) return;
    if (tocElement) {
        tocElement.classList.toggle('show');
        tocIcon.classList.toggle('active');
        tocIcon.innerHTML = tocElement.classList.contains('show') ?
            '<svg viewBox="0 0 24 24"><path d="M4 4l16 16M4 20L20 4"/></svg>' :
            '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    }
}
////////// 目录按钮切换功能 end //////////

document.addEventListener("DOMContentLoaded", function() {
    // 加载 CSS 样式，定义 combinedCss，确保在任何使用之前初始化，确保样式在 DOM 元素添加前应用，防止PC端初始化加载页面菜单一闪而过
    const combinedCss = `
        /* light 主题颜色 */
        :root {
            --color-toc-a-text: #24292f;
            --color-toc-bg: #ffffffcc;
            --color-toc-box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            --color-toc-hover-bg: #e9e9e9;
            --color-toc-h1: #656d76;
            --color-toc-icon-color: #656d76b3;
            --color-toc-icon-hover: #656d76;
            --color-toc-highlightText: #24292f;
        }
        /* dark 主题颜色 */
        [data-color-mode=light][data-light-theme=dark],
        [data-color-mode=light][data-light-theme=dark]::selection,
        [data-color-mode=dark][data-dark-theme=dark],
        [data-color-mode=dark][data-dark-theme=dark]::selection {
            --color-toc-a-text: #c9d1d9;
            --color-toc-bg: #0d1117cc;
            --color-toc-box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            --color-toc-hover-bg: #1e242a;
            --color-toc-h1: #7d8590;
            --color-toc-icon-color: #7d8590b3;
            --color-toc-icon-hover: #7d8590;
            --color-toc-highlightText: #c9d1d9;
        }
        .toc {
            position: fixed;
            bottom: 100px;
            right: 60px;
            z-index: 1000;
            width: 250px;
            max-height: 70vh;
            padding: 10px;
            overflow-y: auto;
            background-color: var(--color-toc-bg);
            box-shadow: var(--color-toc-box-shadow);
            transform: translateY(20px) scale(0.9);
            opacity: 0;
            transition: opacity 0.1s ease, transform 0.1s ease, visibility 0.1s;
            visibility: hidden;
        }
        .toc.show {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        .toc a {
            display: block;
            padding: 5px;
            color: var(--color-toc-a-text);
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            font-size: 14px;
            line-height: 1.5;
            text-decoration: none;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            outline: none !important;
        }
        @media (any-hover: hover) {
            .toc a:hover {
                background-color: var(--color-toc-hover-bg);
                color: var(--color-toc-highlightText);
                transition: 0.1s ease;
            }
        }
        .toc a:active {
            background-color: var(--color-toc-hover-bg);
            color: var(--color-toc-highlightText);
            transform: scale(0.98);
            transition: 0.1s ease;
        }
        .toc-link.toc-active {
            background-color: var(--color-toc-hover-bg);
            color: var(--color-toc-highlightText);
            transition: 0.1s ease;
        }
        .toc-icon {
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 1000;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 50%;
            background-color: transparent;
            color: var(--color-toc-icon-color);
            transition: transform 0.1s ease, opacity 0.1s ease;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            outline: none !important;
        }
        @media (any-hover: hover) {
            .toc-icon:hover {
                background-color: var(--color-toc-hover-bg);
                color: var(--color-toc-icon-hover);
                box-shadow: var(--color-toc-box-shadow);
                transition: 0.1s ease;
            }
        }
        .toc-icon:active {
            background-color: var(--color-toc-hover-bg);
            color: var(--color-toc-icon-hover);
            box-shadow: var(--color-toc-box-shadow);
            transform: scale(0.9);
            transition: 0.1s ease;
        }
        .toc-icon.active {
            background-color: var(--color-toc-hover-bg);
            color: var(--color-toc-icon-hover);
            box-shadow: var(--color-toc-box-shadow);
            transform: rotate(90deg);
            transition: 0.1s ease;
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
        .toc-h1 {
            position: relative;
            padding-left: 10px;
        }
        .toc-h1::after {
            position: absolute;
            top: 50%;
            left: 0;
            width: 3px;
            height: 60%;
            background-color: var(--color-toc-h1);
            transform: translateY(-50%);
            content: '';
            transition: 0.1s ease;
        }
        .back-to-top, .back-to-bot {
            position: fixed;
            right: 20px;
            z-index: 1000;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: 0;
            border: none;
            border-radius: 50%;
            background-color: transparent;
            color: var(--color-toc-icon-color);
            opacity: 0;
            transition: transform 0.1s ease, opacity 0.1s ease;
            font-size: 24px;
            visibility: hidden;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            outline: none !important;
        }
        .back-to-top {
            bottom: 140px;
        }
        .back-to-bot {
            bottom: 20px;
        }
        .back-to-top.show, .back-to-bot.show {
            opacity: 1;
            visibility: visible;
        }
        @media (any-hover: hover) {
            .back-to-top:hover, .back-to-bot:hover {
                background-color: var(--color-toc-hover-bg);
                color: var(--color-toc-icon-hover);
                box-shadow: var(--color-toc-box-shadow);
                transition: 0.1s ease;
            }
        }
        .back-to-top:active, .back-to-bot:active {
            background-color: var(--color-toc-hover-bg);
            color: var(--color-toc-icon-hover);
            box-shadow: var(--color-toc-box-shadow);
            transform: scale(0.9);
            transition: 0.1s ease;
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
    `;
    
    // 加载 CSS 样式
    loadResource('style', { css: combinedCss });

    // 创建目录
    const tocItems = createTOC();

    //////// 检查标题是否可见 start //////////
    function isHeadingVisible(heading) {
        let current = heading;
        while (current) {
            if (current.tagName === 'DETAILS' && !current.hasAttribute('open')) {
                return false;
            }
            current = current.parentElement;
        }
        return true;
    }
    //////// 检查标题是否可见 end //////////

    //////// 更新 TOC 可见性 start //////////
    function updateTOCVisibility() {
        tocItems.forEach(item => {
            const isVisible = isHeadingVisible(item.heading);
            item.link.style.display = isVisible ? 'block' : 'none';
        });
    }
    //////// 更新 TOC 可见性 end //////////

    // 初始更新 TOC 可见性
    updateTOCVisibility();

    // 为所有 <details> 添加 toggle 事件监听
    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(details => {
        details.addEventListener('toggle', updateTOCVisibility);
    });

    //////// 创建滚动页面高亮菜单 start //////////
    function highlightTOC() {
        const tocLinks = document.querySelectorAll('.toc-link');
        const fromTop = window.scrollY + 10;
        let currentHeading = null;
        tocLinks.forEach(link => {
            const href = link.getAttribute('href');
            const sectionId = href.substring(1);
            const section = document.getElementById(sectionId);
            if (section && section.offsetParent !== null && section.offsetTop <= fromTop) {
                currentHeading = link;
            }
        });
        tocLinks.forEach(link => {
            link.classList.remove('toc-active');
        });
        if (currentHeading) {
            currentHeading.classList.add('toc-active');
            currentHeading.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
    }
    document.addEventListener('scroll', highlightTOC);
    //////// 创建滚动页面高亮菜单 end //////////

    //////// 创建目录按钮 TOC 切换图标 start //////////
    const tocIcon = document.createElement('div');
    tocIcon.className = 'toc-icon';
    tocIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    tocIcon.onclick = (e) => {
        e.stopPropagation();
        toggleTOC();
    };
    document.body.appendChild(tocIcon);
    //////// 创建目录按钮 TOC 切换图标 end //////////

    //////// 点击页面其他区域时隐藏目录 start //////////
    document.addEventListener('click', (e) => {
        const tocElement = document.querySelector('.toc');
        if (tocElement && tocElement.classList.contains('show') && !tocElement.contains(e.target) && !e.target.classList.contains('toc-icon')) {
            toggleTOC();
        }
    });
    //////// 点击页面其他区域时隐藏目录 end //////////

    //////// 创建返回顶部和返回底部按钮 start //////////
    const btnTop = document.createElement('button');
    btnTop.className = 'back-to-top';
    btnTop.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 14l8-8 8 8"/></svg>';
    document.body.appendChild(btnTop);

    const btnBot = document.createElement('button');
    btnBot.className = 'back-to-bot';
    btnBot.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 10l8 8 8-8"/></svg>';
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
        const dynamicThreshold = Math.min(500, windowHeight * 0.5);
        scrollTop > dynamicThreshold ? btnTop.classList.add('show') : btnTop.classList.remove('show');
        const remainingSpace = document.documentElement.scrollHeight - (scrollTop + windowHeight);
        remainingSpace > dynamicThreshold ? btnBot.classList.add('show') : btnBot.classList.remove('show');
    }
    window.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
    //////// 创建返回顶部和返回底部按钮 end //////////

});
