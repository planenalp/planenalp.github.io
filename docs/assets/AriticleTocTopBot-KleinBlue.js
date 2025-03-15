document.addEventListener("DOMContentLoaded", function() {
  // 目录生成
  function createTOC() {
    const contentContainer = document.querySelector('.markdown-body');
    if (!contentContainer) return;

    const tocElement = document.createElement('div');
    tocElement.className = 'toc';
    contentContainer.appendChild(tocElement);

    contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      if (!heading.id) {
        heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
      }
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.style.paddingLeft = `${(heading.tagName[1] - 1) * 10}px`;
      link.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
      });
      tocElement.appendChild(link);
    });
  }

  // 目录显隐切换
  function toggleTOC() {
    document.querySelector('.toc')?.classList.toggle('show');
    document.querySelector('.toc-icon')?.classList.toggle('active');
  }

  // 样式
  const style = document.createElement('style');
  style.textContent = `
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
      opacity: 0;
      visibility: hidden;
      transform: scale(0.9);
      transition: all 0.2s ease;
    }
    .toc.show {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }
    .toc a {
      display: block;
      padding: 5px;
      color: var(--toc-text);
      border-bottom: 1px solid var(--toc-border);
      font-size: 14px;
      text-decoration: none;
      transition: background 0.2s ease;
    }
    .toc a:last-child { border-bottom: none; }
    .toc a:hover { background: var(--toc-hover); padding-left: 8px; }

    .toc-icon, .back-to-top, .back-to-bot {
      position: fixed;
      right: 20px;
      z-index: 1001;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--toc-icon-color);
      border-radius: 50%;
      background: var(--toc-icon-bg);
      color: var(--toc-icon-color);
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .toc-icon { bottom: 130px; }
    .back-to-top { bottom: 190px; }
    .back-to-bot { bottom: 70px; }
    .toc-icon:hover, .back-to-top:hover, .back-to-bot:hover {
      transform: scale(1.1);
      background: var(--toc-icon-active-bg);
      border-color: var(--toc-icon-active-color);
      color: var(--toc-icon-active-color);
    }
    .toc-icon.active { transform: rotate(90deg); }
    .back-to-top.show, .back-to-bot.show { opacity: 1; visibility: visible; }
    @media (max-width: 768px) { .toc { width: 200px; } }
  `;
  document.head.appendChild(style);

  // 目录图标
  const tocIcon = document.createElement('div');
  tocIcon.className = 'toc-icon';
  tocIcon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
  tocIcon.addEventListener('click', e => {
    e.stopPropagation();
    toggleTOC();
  });

  // 返回顶部/底部按钮
  const btnTop = document.createElement('button');
  btnTop.className = 'back-to-top';
  btnTop.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
  btnTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const btnBot = document.createElement('button');
  btnBot.className = 'back-to-bot';
  btnBot.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`;
  btnBot.addEventListener('click', () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }));

  document.body.append(tocIcon, btnTop, btnBot);

  // 滚动事件优化
  let scrollTimeout;
  function updateButtons() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollTop = window.scrollY;
      btnTop.classList.toggle('show', scrollTop > 100);
      btnBot.classList.toggle('show', scrollTop + window.innerHeight < document.documentElement.scrollHeight - 100);
    }, 100);
  }
  window.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();

  createTOC();
});
