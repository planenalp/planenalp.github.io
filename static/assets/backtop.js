function loadResource(type, attributes) {
    if (type === 'style') {
        const style = document.createElement('style');
        style.textContent = attributes.css;
        document.head.appendChild(style);
    }
}

function createTOC() {
    const tocElement = document.createElement('div');
    tocElement.className = 'toc';
    
    const contentContainer = document.querySelector('.markdown-body');
    contentContainer.appendChild(tocElement);

    const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        if (!heading.id) {
            heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
        }
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.setAttribute('data-id', heading.id);
        link.className = 'toc-link';
        link.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 1) * 10}px`;
        tocElement.appendChild(link);
    });

    contentContainer.prepend(tocElement);
}

function highlightTOC() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const fromTop = window.scrollY + 10;

    let currentHeading = null;

    tocLinks.forEach(link => {
        const section = document.getElementById(link.getAttribute('data-id'));
        if (section && section.offsetTop <= fromTop) {
            currentHeading = link;
        }
    });

    tocLinks.forEach(link => link.classList.remove('active-toc'));
    currentHeading?.classList.add('active-toc');

    currentHeading?.scrollIntoView({
        block: 'center',
        inline: 'nearest'
    });
}

function toggleTOC() {
    const tocElement = document.querySelector('.toc');
    const tocIcon = document.querySelector('.toc-icon');
    if (tocElement) {
        tocElement.classList.toggle('show');
        tocIcon.classList.toggle('active');
        tocIcon.innerHTML = tocElement.classList.contains('show') 
            ? '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'
            : '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    createTOC();
    const css = `
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
            bottom: 140px;
            right: 60px;
            width: 250px;
            max-height: 70vh;
            background-color: var(--toc-bg);
            border: 1px solid var(--toc-border);
            border-radius: 6px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow-y: auto;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px) scale(0.9);
            transition: opacity 0.1s ease, transform 0.1s ease, visibility 0.1s;
        }
        .toc.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }
        .toc a {
            display: block;
            border-radius: 6px;
            color: var(--toc-text);
            text-decoration: none;
            padding: 5px 0;
            font-size: 14px;
            line-height: 1.5;
            border-bottom: 1px solid var(--toc-border);
            transition: background-color 0.1s ease, padding-left 0.1s ease;
        }
        .toc a:last-child {
            border-bottom: none;
        }
        .toc a:hover {
            background-color: var(--toc-hover);
            padding-left: 5px;
            border-radius: 6px;
        }
        .toc-icon {
            position: fixed;
            bottom: 120px;
            right: 20px;
            cursor: pointer;
            font-size: 24px;
            background-color: var(--toc-icon-bg);
            color: var(--toc-icon-color);
            border: 2px solid var(--toc-icon-color);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            z-index: 1001;
            transition: all 0.1s ease;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            outline: none;
        }
        .toc-icon:hover {
            transform: scale(1.1);
            color: var(--toc-icon-active-color);
            background-color: var(--toc-icon-active-bg);
            border-color: var(--toc-icon-active-color);
        }
        .toc-icon:active {
            transform: scale(0.9);
        }
        .toc-icon.active {
            color: var(--toc-icon-active-color);
            background-color: var(--toc-icon-active-bg);
            border-color: var(--toc-icon-active-color);
            transform: rotate(90deg);
        }

        .active-toc {
            border-radius: 6px;
            background-color: var(--toc-hover);
            padding-left: 5px;
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
            cursor: pointer;
            font-size: 24px;
            background-color: #21262db3;
            color: rgba(240, 246, 252, 0.1);
            border: 2px solid rgba(240, 246, 252, 0.1);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            z-index: 10000;
            transition: 
                opacity 0.1s ease,
                visibility 0.1s ease,
                transform 0.1s ease;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            outline: none;
            padding: 0;
            margin: 0;
            opacity: 0;
            visibility: hidden;
        }
        .back-to-top {
            bottom: 180px;
        }
        .back-to-bot {
            bottom: 60px;
        }
        .back-to-top.show, .back-to-bot.show {
            opacity: 1;
            visibility: visible;
        }
        .back-to-top:hover, .back-to-bot:hover {
            transform: scale(1.1);
            color: #8b949eb3;
            background-color: #002fa7b3;
            border-color: #8b949eb3;
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

       @media (max-width: 1249px) {
           .toc {
               width: 200px;
           }
       }
    `;
    loadResource('style', {css: css});

    // 创建目录按钮
    const tocIcon = document.createElement('div');
    tocIcon.className = 'toc-icon';
    tocIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    tocIcon.onclick = (e) => {
        e.stopPropagation();
        toggleTOC();
    };
    document.body.appendChild(tocIcon);

    // 创建滚动按钮
    const btnTop = document.createElement('button');
    btnTop.className = 'back-to-top';
    btnTop.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btnTop);

    const btnBot = document.createElement('button');
    btnBot.className = 'back-to-bot';
    btnBot.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>';
    document.body.appendChild(btnBot);

    // 按钮点击事件
    btnTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    btnBot.addEventListener('click', () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }));

    // 滚动逻辑
    const updateButtons = () => {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        btnTop.classList.toggle('show', scrollTop > 100);
        btnBot.classList.toggle('show', !(scrollTop + windowHeight >= documentHeight - 100));
    };

    window.addEventListener('scroll', () => {
        highlightTOC();
        updateButtons();
    });
    window.addEventListener('resize', updateButtons);
    updateButtons();

    // 点击外部关闭目录
    document.addEventListener('click', (e) => {
        const tocElement = document.querySelector('.toc');
        if (tocElement?.classList.contains('show') && !tocElement.contains(e.target) && !e.target.classList.contains('toc-icon')) {
            toggleTOC();
        }
    });
});
