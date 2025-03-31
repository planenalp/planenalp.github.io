# 小细节
- 要是图片排版乱七八糟可以在每串图片代码前一行加个 `#` 强行分段
- 尽量用 width = "300" height = "300" 而不是百分比 width = "50%"
- 可以直接只用 width = "300"，不需 height = "300"，会自动等比缩放，就像只用 width = "50%" 一样

# 1. HTML 标签 - 单行
```
<img src="URL" width = "300" height = "300" align=center alt="name" />
```
或
```
<img src="URL" width = "50%" align=center alt="name" />
```

| 自定义 | GitHub Issues | Gmeek |
| :------: | :--------------: | :-------: |
| 显示     | ✅                 | ✅      |
| 位置     | ❌                 | ❌      |
| 尺寸     | ✅                 | ❌      |

<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" width = "300" height = "300" align=center alt="logoTest" />


# 2. HTML 标签 - 三行 div
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

| 自定义 | GitHub Issues | Gmeek |
| :------: | :--------------: | :-------: |
| 显示     | ✅                 | ✅      |
| 位置     | ✅                 | ✅      |
| 尺寸     | ✅                 | ❌      |

<div  align="center">    
<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" width = "300" height = "300" alt="logoTest" />
</div>


# 3. Gmeek-html - 单行
```
`Gmeek-html<img src="URL" alt="" width = "300" height = "300" align=center alt="name" >`
```
或
```
`Gmeek-html<img src="URL" alt="" width="50%" align=center alt="name" >`
```

| 自定义 | GitHub Issues | Gmeek |
| :------: | :--------------: | :-------: |
| 显示     | ❌                 | ✅      |
| 位置     | ❌                 | ❌      |
| 尺寸     | ❌                 | ✅      |

`Gmeek-html<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" alt="" width="50%" align=center alt="logoTest" />`


# 4. Gmeek-html - 三行 div
```
<div  align="center">   
`Gmeek-html<img src="URL" alt="" width = "300" height = "300" alt="name" >`
</div>
```
或
```
<div  align="center">   
`Gmeek-html<img src="URL" alt="" width="50%" align=center alt="name" >`
</div>
```
能显示图片，能居中

# 1
<div  align="center">   
`Gmeek-html<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" alt="" width="50%" alt="logoTest" />`
</div>

# 2
`Gmeek-html
<div  align="center">
<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" alt="" width="50%" alt="logoTest" />
</div>
`

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







