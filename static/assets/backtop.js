(function() {
  // 插件构造函数，接受可选配置项
  function ScrollToTop(options) {
    // 默认配置
    this.options = Object.assign({
      threshold: 100,         // 滚动超过多少像素显示按钮
      btnSize: "40px",        // 按钮宽高
      backgroundColor: "#333",// 按钮背景色
      color: "#fff",          // 按钮文字颜色
      right: "20px",          // 按钮距离右侧距离
      bottom: "20px",         // 按钮距离底部距离
      borderRadius: "50%",    // 圆形按钮
      fontSize: "20px",       // 按钮文字大小
      innerHTML: "↑"          // 按钮内容
    }, options || {});
    
    this.createButton();
    this.bindEvents();
  }
  
  // 创建按钮并插入到页面
  ScrollToTop.prototype.createButton = function() {
    this.btn = document.createElement("div");
    this.btn.id = "scrollToTopButton";
    this.btn.innerHTML = this.options.innerHTML;
    
    // 设置样式
    this.btn.style.position = "fixed";
    this.btn.style.bottom = this.options.bottom;
    this.btn.style.right = this.options.right;
    this.btn.style.width = this.options.btnSize;
    this.btn.style.height = this.options.btnSize;
    this.btn.style.backgroundColor = this.options.backgroundColor;
    this.btn.style.color = this.options.color;
    this.btn.style.fontSize = this.options.fontSize;
    this.btn.style.lineHeight = this.options.btnSize;
    this.btn.style.textAlign = "center";
    this.btn.style.borderRadius = this.options.borderRadius;
    this.btn.style.cursor = "pointer";
    this.btn.style.display = "none"; // 默认隐藏
    this.btn.style.zIndex = "9999";
    
    document.body.appendChild(this.btn);
  };
  
  // 绑定滚动和点击事件
  ScrollToTop.prototype.bindEvents = function() {
    var self = this;
    window.addEventListener("scroll", function() {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      // 当滚动超过设定阈值时显示按钮
      if (scrollTop > self.options.threshold) {
        self.btn.style.display = "block";
      } else {
        self.btn.style.display = "none";
      }
    });
    
    // 点击按钮平滑回到顶部
    this.btn.addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };
  
  // 暴露插件到全局，便于调用
  window.ScrollToTop = ScrollToTop;
})();
