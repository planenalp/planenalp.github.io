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
      
       link.className = 'toc-link';
       link.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 1) * 10}px`;
       link.addEventListener('click', function(e) {
           e.preventDefault();
           const targetElement = document.getElementById(heading.id);
           if (targetElement) {
               targetElement.scrollIntoView({ behavior: 'smooth' });
           }
           toggleTOC(); // 点击后关闭目录
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
           transition: all 0.1s ease;
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
           transition: all 0.1s ease;
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
           bottom: 130px;
           right: 20px;
           cursor: pointer;
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
            border-color: var(--toc-icon-active-color); /* 激活按钮边框颜色改为白色 */
            transform: rotate(90deg);
       }
       /* 弹出菜单文字参数 */
       .active-toc {
           /* font-weight: bold;  移除加粗 */
           border-radius: 6px;
           background-color: var(--toc-hover);  /* 根据你的设计，可以定制高亮颜色 */
           padding-left: 5px;  /* 可选：增加左边距以突出当前项目 */
       }
       .toc-icon svg {
           width: 24px;
           height: 24px;
           fill: none; /* 设置 svg 内部不填充颜色（透明） */
           stroke: currentColor; /* 想要即时切换只能用 currentColor 将描边颜色设置为当前文字颜色（继承父元素的颜色）*/
           stroke-width: 2; /* 设置描边（线条）的宽度为 2 像素 */
           stroke-linecap: round; /* 设置描边端点为圆形，使线条末端圆润 */
           stroke-linejoin: round;  /* 设置线条转角为圆形，使角部更平滑 */
       }

       @media (max-width: 768px) {
           .toc {
               width: 200px;
           }
       }
   `;
   loadResource('style', {css: css});

   const tocIcon = document.createElement('div');
   tocIcon.className = 'toc-icon';
   tocIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
   tocIcon.onclick = (e) => {
       e.stopPropagation();
       toggleTOC();
   };
   document.body.appendChild(tocIcon);

   document.addEventListener('click', (e) => {
       const tocElement = document.querySelector('.toc');
       if (tocElement && tocElement.classList.contains('show') && !tocElement.contains(e.target) && !e.target.classList.contains('toc-icon')) {
           toggleTOC();
       }
   });
});
