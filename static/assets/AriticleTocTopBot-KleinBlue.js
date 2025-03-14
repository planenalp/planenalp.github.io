function loadResource(type, attributes) {
   if (type === 'style') {
       const style = document.createElement('style');
       style.textContent = attributes.css;
       document.head.appendChild(style);
   }
}

function createButton(className, iconPath, clickHandler, position) {
   const btn = document.createElement('button');
   btn.className = className;
   btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="${iconPath}"/></svg>`;
   btn.style.bottom = position + 'px';
   btn.addEventListener('click', clickHandler);
   return btn;
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
      
       link.className = 'toc-link';
       link.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 1) * 10}px`;
       link.addEventListener('click', function(e) {
           e.preventDefault();
           document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
       });
       tocElement.appendChild(link);
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
   // 初始化TOC
   createTOC();

   // 加载统一样式
   const css = `
       :root {
           --toc-bg: rgba(255, 255, 255, 0.8);
           --toc-border: #e1e4e8;
           --toc-text: #24292e;
           --toc-hover: rgba(0, 0, 0, 0.05);
           --icon-bg: rgba(255, 255, 255, 0.8);
           --icon-color: #333;
           --icon-active-bg: #fff;
           --icon-active-color: #333;
       }

       @media (prefers-color-scheme: dark) {
           :root {
               --toc-bg: #21262dcc;
               --toc-border: rgba(240, 246, 252, 0.1);
               --toc-text: #c9d1d9;
               --toc-hover: #002fa7cc;
               --icon-bg: #21262db3;
               --icon-color: rgba(240, 246, 252, 0.1);
               --icon-active-bg: #002fa7b3;
               --icon-active-color: #8b949eb3;
           }
       }

       /* TOC样式保持不变... */

       /* 统一按钮样式 */
       .toc-icon, .back-to-top, .back-to-bot {
           position: fixed;
           right: 20px;
           cursor: pointer;
           background-color: var(--icon-bg);
           color: var(--icon-color);
           border: 2px solid var(--icon-color);
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
       .back-to-top { bottom: 190px; }
       .back-to-bot { bottom: 70px; }
       .toc-icon { bottom: 130px; }

       .back-to-top, .back-to-bot {
           opacity: 0;
           visibility: hidden;
           z-index: 1000;
       }
       .back-to-top.show, .back-to-bot.show {
           opacity: 1;
           visibility: visible;
       }
       .toc-icon:hover, .back-to-top:hover, .back-to-bot:hover {
           transform: scale(1.1);
           color: var(--icon-active-color);
           background-color: var(--icon-active-bg);
           border-color: var(--icon-active-color);
       }
       .toc-icon:active, .back-to-top:active, .back-to-bot:active {
           transform: scale(0.9);
       }
       .toc-icon svg, .back-to-top svg, .back-to-bot svg {
           width: 24px;
           height: 24px;
           fill: none;
           stroke: currentColor;
           stroke-width: 2;
           stroke-linecap: round;
           stroke-linejoin: round;
       }
   `;
   loadResource('style', {css: css});

   // 创建控制按钮
   const buttons = [
       createButton('back-to-top', 'M12 19V5M5 12l7-7 7 7', 
           () => window.scrollTo({ top: 0, behavior: 'smooth' }), 190),
       createButton('back-to-bot', 'M12 5v14M5 12l7 7 7-7', 
           () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }), 70),
       createButton('toc-icon', 'M3 12h18M3 6h18M3 18h18', toggleTOC, 130)
   ];
   buttons.forEach(btn => document.body.appendChild(btn));

   // 滚动事件处理
   function updateButtons() {
       const scrollTop = window.pageYOffset;
       const windowHeight = window.innerHeight;
       const documentHeight = document.documentElement.scrollHeight;

       document.querySelector('.back-to-top').classList.toggle('show', scrollTop > 100);
       document.querySelector('.back-to-bot').classList.toggle('show', 
           scrollTop + windowHeight < documentHeight - 100);
   }

   window.addEventListener('scroll', updateButtons);
   window.addEventListener('resize', updateButtons);
   updateButtons();

   // TOC点击关闭处理
   document.addEventListener('click', (e) => {
       const tocElement = document.querySelector('.toc');
       if (tocElement?.classList.contains('show') && 
           !tocElement.contains(e.target) && 
           !e.target.classList.contains('toc-icon')) {
           toggleTOC();
       }
   });
});
