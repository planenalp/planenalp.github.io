<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>TOC 自动高亮示例</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* 此处的样式仅用于示例页面内容 */
    body {
      font-family: sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
    }
    .markdown-body h1, .markdown-body h2, .markdown-body h3,
    .markdown-body h4, .markdown-body h5, .markdown-body h6 {
      margin-top: 50px;
    }
  </style>
</head>
<body>
  <!-- 模拟内容区域 -->
  <div class="markdown-body">
    <h1>标题1</h1>
    <p>内容...</p>
    <h2>标题2</h2>
    <p>内容...</p>
    <h3>标题3</h3>
    <p>内容...</p>
    <h2>另一个标题2</h2>
    <p>内容...</p>
    <h3>另一个标题3</h3>
    <p>内容...</p>
    <h4>标题4</h4>
    <p>内容...</p>
    <p>（为了便于测试滚动效果，请适当增加内容高度）</p>
  </div>

  <script>
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
       if (!contentContainer) {
         console.error('找不到 .markdown-body 内容容器！');
         return;
       }
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

    // 根据页面滚动更新目录中 active 状态
    function updateActiveTOC() {
       const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6');
       let activeId = "";
       // offset 值可以根据实际情况调整，比如考虑固定导航条高度
       const offset = 120;
       headings.forEach(heading => {
           const rect = heading.getBoundingClientRect();
           if (rect.top - offset < 0) {
               activeId = heading.id;
           }
       });
       const links = document.querySelectorAll('.toc a');
       links.forEach(link => {
           if (link.getAttribute('href') === '#' + activeId) {
               link.classList.add('active');
           } else {
               link.classList.remove('active');
           }
       });
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
           /* 鼠标悬停与 active 状态效果一致 */
           .toc a:hover,
           .toc a.active {
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
                border-color: var(--toc-icon-active-color);
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

       // 滚动时更新目录 active 状态
       window.addEventListener('scroll', updateActiveTOC);
       // 页面加载时也更新一次
       updateActiveTOC();
    });
  </script>
</body>
</html>