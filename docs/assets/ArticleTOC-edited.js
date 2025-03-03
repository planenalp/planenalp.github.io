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
    // 移除 .show 的默认添加
    // tocElement.classList.add('show');  // 删除这一行
        
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

    
    tocElement.insertAdjacentHTML('beforeend', '<a class="toc-end" onclick="window.scrollTo({top:0,behavior: \'smooth\'});">返回顶部</a>');
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

    tocLinks.forEach(link => {
        link.classList.remove('active-toc');
    });

    if (currentHeading) {
        currentHeading.classList.add('active-toc');

        // 确保当前高亮的目录项在可视区域的中间
        currentHeading.scrollIntoView({
            block: 'center',   // 确保当前高亮项滚动到视图中间位置
            inline: 'nearest'  // 可选，保持水平滚动条不动
        });
    }
}

function toggleTOC() {
    const tocElement = document.querySelector('.toc');
    const tocIcon = document.querySelector('.toc-icon');
    if (tocElement) {
        tocElement.classList.toggle('show');
        tocIcon.classList.toggle('active');
        tocIcon.textContent = tocElement.classList.contains('show') ? '✖' : '☰';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    createTOC();
   const css = `
       :root {
           --toc-bg: rgba(255, 255, 255, 0.8);
           --toc-border: #e1e4e8;
           --toc-text: #24292e;
           --toc-hover: rgba(0, 0, 0, 0.05);
           --toc-icon-bg: rgba(255, 255, 255, 0.8);
           --toc-icon-color: #333;
           --toc-icon-active-bg: #fff;
           --toc-icon-active-color: #333;
       }

       @media (prefers-color-scheme: dark) {
           :root {
               --toc-bg: rgba(45, 51, 59, 0.8);
               --toc-border: #444c56;
               --toc-text: #adbac7;
               --toc-hover: rgba(255, 255, 255, 0.05);
               --toc-icon-bg: rgba(45, 51, 59, 0.8);
               --toc-icon-color: #adbac7;
               --toc-icon-active-bg: #2d333b;
               --toc-icon-active-color: #adbac7;
           }
       }

       .toc {
           position: fixed;
           bottom: 80px;
           right: 20px;
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
           transform: translateY(20px);
           transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
           backdrop-filter: blur(5px);
       }
       .toc.show {
           opacity: 1;
           visibility: visible;
           transform: translateY(0);
       }
       .toc a {
           display: block;
           color: var(--toc-text);
           text-decoration: none;
           padding: 5px 0;
           font-size: 14px;
           line-height: 1.5;
           border-bottom: 1px solid var(--toc-border);
           transition: background-color 0.2s ease, padding-left 0.2s ease;
       }
       .toc a:last-child {
           border-bottom: none;
       }
       .toc a:hover {
           background-color: var(--toc-hover);
           padding-left: 5px;
       }
       .toc-icon {
           position: fixed;
           bottom: 20px;
           right: 15px;
           cursor: pointer;
           background-color: var(--toc-icon-bg);
           color: var(--toc-icon-color);
           border-radius: 50%;
           width: 50px;
           height: 50px;
           display: flex;
           align-items: center;
           justify-content: center;
           box-shadow: 0 2px 10px rgba(0,0,0,0.1);
           z-index: 1001;
           transition: all 0.3s ease;
           user-select: none;
           -webkit-tap-highlight-color: transparent;
           outline: none;
       }
       .toc-icon:hover {
           transform: scale(1.1);
           background-color: var(--toc-icon-active-bg);
       }
       .toc-icon:active {
           transform: scale(0.9);
       }
       .toc-icon.active {
           background-color: var(--toc-icon-active-bg);
           color: var(--toc-icon-active-color);
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

       @media (max-width: 768px) {
           .toc {
               width: 200px;
               bottom: 70px;
               right: 10px;
           }
           .toc-icon {
               width: 40px;
               height: 40px;
               bottom: 15px;
               right: 15px;
           }
           .toc-icon svg {
               width: 20px;
               height: 20px;
           }
       }
   `;
    loadResource('style', {css: css});

    const tocIcon = document.createElement('div');
    tocIcon.className = 'toc-icon';
    // 移除默认的 active 类
    // tocIcon.classList.add('active');  // 删除这一行
    tocIcon.textContent = '☰';  // 设置默认图标为汉堡菜单
    tocIcon.onclick = (e) => {
        e.stopPropagation();
        toggleTOC();
    };
    document.body.appendChild(tocIcon);

    window.onscroll = function() {
        const backToTopButton = document.querySelector('.toc-end');
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style="visibility: visible;background-color: white;"
        } else {
            backToTopButton.style="visibility: hidden;background-color: white;"
        }
    };

    document.addEventListener('scroll', highlightTOC);
    
    document.addEventListener('click', (e) => {
        const tocElement = document.querySelector('.toc');
        if (tocElement && tocElement.classList.contains('show') && !tocElement.contains(e.target) && e.target.classList.contains('toc-icon')) {
            toggleTOC();
            
        }
    });
});
