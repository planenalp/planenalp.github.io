<button id="scrollTopBtn" title="返回顶部">↑</button>

<style>
#scrollTopBtn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

#scrollTopBtn.visible {
  opacity: 1;
  visibility: visible;
}
</style>

<script>
const scrollBtn = document.getElementById('scrollTopBtn');

// 滚动显示/隐藏按钮
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 0);
});

// 点击返回顶部
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>
