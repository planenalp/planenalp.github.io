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
       /* 新增 active 状态样式 */
       .toc-link.active {
           background-color: var(--toc-hover) !important;
           padding-left: 5px !important;
           border-radius: 6px;
       }

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
       /* 其余原有样式保持不变... */
   `;
   loadResource('style', {css: css});

   // 新增滚动高亮逻辑
   let lastScroll = 0;
   function updateActiveLink() {
       const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
       let closest = { distance: Infinity, element: null };

       headings.forEach(heading => {
           const rect = heading.getBoundingClientRect();
           const distance = Math.abs(rect.top - 100); // 100px 触发阈值

           if (distance < closest.distance && rect.top <= window.innerHeight/2) {
               closest = { distance, element: heading };
           }
       });

       document.querySelectorAll('.toc-link').forEach(link => {
           link.classList.remove('active');
           if (closest.element && link.hash === `#${closest.element.id}`) {
               link.classList.add('active');
           }
       });
   }

   // 优化滚动监听性能
   let ticking = false;
   window.addEventListener('scroll', () => {
       if (!ticking) {
           window.requestAnimationFrame(() => {
               updateActiveLink();
               ticking = false;
           });
           ticking = true;
       }
   });

   // 初始化高亮状态
   updateActiveLink();

   // 原有图标和点击逻辑保持不变...
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
