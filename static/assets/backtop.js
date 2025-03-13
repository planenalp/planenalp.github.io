function loadResource(type, { css }) {
  if (type === 'style') {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
}

function createTOC() {
  const tocElement = document.createElement('div');
  tocElement.className = 'toc';
  
  const container = document.querySelector('.markdown-body');
  if (container) {
    container.appendChild(tocElement);
    
    // 兼容旧版浏览器写法
    var headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    Array.prototype.forEach.call(headings, function(heading) {
      if (!heading.id) {
        heading.id = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      }
      
      var link = document.createElement('a');
      link.href = '#' + heading.id;
      link.className = 'toc-link';
      link.textContent = heading.textContent;
      link.style.paddingLeft = (parseInt(heading.tagName.charAt(1)) * 10 - 10 + 'px';
      
      // 兼容 dataset 写法
      link.setAttribute('data-id', heading.id);
      
      tocElement.appendChild(link);
    });
  }
  return tocElement;
}

function highlightTOC() {
  var links = document.querySelectorAll('.toc-link');
  var currentLink = null;
  
  // 传统循环写法保证兼容性
  for (var i = links.length - 1; i >= 0; i--) {
    var section = document.getElementById(links[i].getAttribute('data-id'));
    if (section && section.offsetTop <= window.scrollY + 50) {
      currentLink = links[i];
      break;
    }
  }
  
  Array.prototype.forEach.call(links, function(link) {
    link.classList.toggle('active', link === currentLink);
  });
  
  if (currentLink) {
    currentLink.scrollIntoView({ block: 'nearest', behavior: 'auto' }); // 禁用平滑滚动以兼容旧浏览器
  }
}

document.addEventListener("DOMContentLoaded", function() {
  // 加载样式 (保留 0.1s 过渡)
  loadResource('style', {
    css: `
    :root {
      --bg-dark: #21262dcc;
      --border-dark: rgba(240, 246, 252, 0.1);
      --text-dark: #c9d1d9;
      --accent-dark: #002fa7cc;
    }
    
    .toc {
      position: fixed;
      bottom: 140px;
      right: 60px;
      width: 250px;
      max-height: 70vh;
      background: var(--bg-dark);
      border: 1px solid var(--border-dark);
      border-radius: 6px;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow-y: auto;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.1s ease; /* 恢复为 0.1s */
    }
    
    .toc.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .toc-link {
      display: block;
      padding: 8px 0;
      color: var(--text-dark);
      text-decoration: none;
      border-bottom: 1px solid var(--border-dark);
      transition: all 0.1s ease; /* 统一调整为 0.1s */
    }
    
    .toc-link:hover,
    .toc-link.active {
      background: var(--accent-dark);
      padding-left: 12px !important;
    }
    
    .floating-btn {
      position: fixed;
      right: 20px;
      width: 40px;
      height: 40px;
      background: var(--bg-dark);
      border: 2px solid var(--border-dark);
      border-radius: 50%;
      display: flex;         /* 兼容性更好的写法 */
      justify-content: center; 
      align-items: center;
      cursor: pointer;
      transition: all 0.1s ease; /* 恢复为 0.1s */
      opacity: 0;
      visibility: hidden;
    }
    
    .floating-btn.show {
      opacity: 1;
      visibility: visible;
    }
    
    .floating-btn:hover {
      transform: scale(1.1);
      border-color: var(--text-dark);
    }
    
    .floating-btn svg {
      width: 24px;
      height: 24px;
      stroke: currentColor;
      stroke-width: 2;
    }
    
    @media (max-width: 768px) {
      .toc {
        right: 20px;
        width: 200px;
      }
    }`
  });

  // 渐进式按钮创建
  function createButton(className, icon, clickHandler, bottom) {
    var btn = document.createElement('button');
    btn.className = className;
    btn.innerHTML = icon;
    btn.style.bottom = bottom + 'px';
    
    // 兼容性事件绑定
    if (btn.addEventListener) {
      btn.addEventListener('click', clickHandler);
    } else {
      btn.attachEvent('onclick', clickHandler);
    }
    return btn;
  }

  // 创建按钮
  var buttons = [
    createButton('floating-btn', '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>', function() {
      document.querySelector('.toc').classList.toggle('show');
    }, 120),
    
    createButton('floating-btn', '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>', function() {
      window.scrollTo({ top: 0, behavior: 'auto' }); // 禁用平滑滚动
    }, 180),
    
    createButton('floating-btn', '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>', function() {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'auto' }); // 禁用平滑滚动
    }, 60)
  ];

  buttons.forEach(function(btn) {
    document.body.appendChild(btn);
  });

  // 初始化TOC
  createTOC();

  // 兼容性事件处理
  var updateUI = function() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var windowHeight = window.innerHeight;
    var docHeight = document.documentElement.scrollHeight;
    
    highlightTOC();
    
    // 更新按钮状态
    buttons[1].classList.toggle('show', scrollY > 100);
    buttons[2].classList.toggle('show', scrollY + windowHeight < docHeight - 100);
  };

  // 事件监听兼容性处理
  if (window.addEventListener) {
    window.addEventListener('scroll', updateUI);
    window.addEventListener('resize', updateUI);
    document.addEventListener('click', function(e) {
      var toc = document.querySelector('.toc');
      if (toc && !toc.contains(e.target) && !e.target.closest('.floating-btn')) {
        toc.classList.remove('show');
      }
    });
  } else {
    window.attachEvent('onscroll', updateUI);
    window.attachEvent('onresize', updateUI);
    document.attachEvent('onclick', function(e) {
      var toc = document.querySelector('.toc');
      if (toc && !toc.contains(e.target) && !e.target.closest('.floating-btn')) {
        toc.classList.remove('show');
      }
    });
  }

  // 初始化状态
  updateUI();
});
