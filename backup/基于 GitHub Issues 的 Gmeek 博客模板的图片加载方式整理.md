

# p test
<cc align="center">    
<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" width = "300" height = "300" alt="logoTest" />
</cc>


# div + gjken
完全无效
```
<div  align="center">    
`Image="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309"`
</div>
```

# 小细节
- 要是图片排版乱七八糟可以在每串图片代码前一行加个 `#` 强行分段
- 可以直接只用 width = "300"，不需 height = "300"，会自动等比缩放，就像只用 width = "50%" 一样
- HTML 标签 + base64 无效
- 可用 p 代替 div

# 1. HTML 标签 - 单行
相当于 `[](url)`，意义不大，可能默认兼容fancybox？
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

# 废案

## 1. Gmeek-html - 三行 div
没意义，相当于 `HTML 标签 - 单行` + 前 `Gmeek-html 后 ` 的乱码，测试过放到 Gmeek-html 里面外面都一样
```
<div  align="center">   
`Gmeek-html<img src="URL" alt="" width = "300" height = "300" alt="name" >`
</div>
```
或
```
`Gmeek-html<div  align="center"> 
<img src="URL" alt="" width="50%" align=center alt="name" >
</div>`
```


## 2. GitHub Issues + div
完全无效，都不显示图片
```
<div  align="center">    
![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309)
</div>
```

## 3. GitHub Issues Original with =size
完全无效，都不显示图片
`![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309 =300x300)`

## 4. GitHub Issues Original with #pic_center
完全无效，都不显示图片
`![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309#pic_center)`

## 5. GitHub Issues Original with CSS
图片能显示但 CSS 后缀无效
![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309){:height="50%" width="50%"}







