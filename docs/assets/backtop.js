(function() {
  // 创建样式
  const style = document.createElement('style');
  style.textContent = `
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
      display: none;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      z-index: 10000;
      transition: transform 0.1s ease, opacity 0.1s ease;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      outline: none;
      padding: 0;
      margin: 0;
    }
    .back-to-top {
      bottom: 120px;
    }
    .back-to-bot {
      bottom: 20px;
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
  `;
  document.head.appendChild(style);

  // 创建向上按钮
  const btnTop = document.createElement('button');
  btnTop.className = 'back-to-top';
  btnTop.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(btnTop);

  // 创建向下按钮
  const btnBot = document.createElement('button');
  btnBot.className = 'back-to-bot';
  btnBot.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>';
  document.body.appendChild(btnBot);

  // 点击事件处理
  btnTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  btnBot.addEventListener('click', () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  });

  // 滚动事件处理
  function toggleButtonsVisibility() {
    const show = window.pageYOffset > 100;
    btnTop.style.display = show ? 'flex' : 'none';
    btnBot.style.display = show ? 'flex' : 'none';
  }

  window.addEventListener('scroll', toggleButtonsVisibility);
  window.addEventListener('resize', toggleButtonsVisibility);

  // 初始检查
  toggleButtonsVisibility();
})();
