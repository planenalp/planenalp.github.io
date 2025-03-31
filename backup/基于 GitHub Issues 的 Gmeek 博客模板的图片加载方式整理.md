# 1. HTML 标签
```
<img src="URL" width = "300" height = "300" align=center alt="name" />
```
图片能显示但自定义无效
<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" width = "300" height = "300" align=center alt="logoTest" />

# 2. HTML 标签 + div + w h
```
<div  align="center">    
<img src="URL" width = "300" height = "300" alt="name" />
</div>
```
或
```
<div  align="center">    
<img src="URL" width = "50%" alt="name" />
</div>
```
支持自定义位置，GitHub Issues 支持自定义尺寸，Gmeek 不支持自定义尺寸
<div  align="center">    
<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" width = "300" height = "300" alt="logoTest" />
</div>


# 3. Gmeek-html
```
`Gmeek-html<img src="URL" alt="" width="50%" align=center alt="name" >`
```
唯一全功能，除了不能在 GitHub Issues 显示
`Gmeek-html<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" alt="" width="50%" align=center />`

# 4 Gmeek-html
唯一全功能，除了不能在 GitHub Issues 显示
`Gmeek-html<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" alt="" width="300" height="300" align=center />`


# 5. GitHub Issues Original with div center
完全无效
<div  align="center">    
![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309)
</div>

# 7. GitHub Issues Original with =size
完全无效
![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309 =300x300)

# 8. GitHub Issues Original with CSS
图片能显示但 CSS 后缀无效
![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309){:height="50%" width="50%"}







