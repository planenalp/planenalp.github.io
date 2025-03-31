<!-- ##{"timestamp":1743314651}## -->

# 导航页
这个博客模板的原作者弄了个导航页 https://meekdai.com/ 挺好玩，之前折腾 NAS 也搞过 Heimdall 的，现在也搞个玩玩
因为没什么项目暂时也就只能做个 LOGO 放中间了，404也直接用这个微调了一下，挺方便
之后再研究研究怎么丰富下内容

# 方法1（挺好）
输入 klein.blue 直接是导航页，仓库 KB/Klein.Blue
international.klein.blue - 博客主页（绑定博客域名，相当于 blog.***.com）仓库 IKB/International.Klein.Blue
这样必须两个GitHub pages 来处理
可以将来适配到其它的导航页
这个最好，修改导航页可以随时看到变化不用每次都 Actions 弄一下，而且独立出来好处理，想改版也容易不用怕会影响博客主题
只要能接受两个仓库就没问题

# 方法2（不好）
输入 klein.blue 跳转导航页 klein.blue/hand.html
klein.blue 博客主页（绑定博客域名）
这样可以仅用一个GitHub pages
可以将来 hand.html 适配成其它的导航页，就是没那么顺眼，也局限了永远只能绑定在 klein.blue/后面
因为 GitHub Pages 不支持绑定多个次级域名没办法

# 方法3（综合1+2）
输入 klein.blue 跳转导航页 international.klein.blue/hand.html
international.klein.blue - 博客主页（绑定博客域名，相当于 blog.klein.blue）仓库 IKB/International.Klein.Blue
这样可以仅用一个GitHub pages
可以将来 hand.html 适配成其它的导航页，也可以随时改成方法1
不想弄两个仓库就这个办法
