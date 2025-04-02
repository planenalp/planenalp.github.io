<!-- ##{"timestamp":1743315103}## -->

# 总结
1. 99.9% 情况下，只需用 [1. GitHub Pages upload](#1.-github-pages-upload) 模板的 MarkDown 的标准语法 `![Image](URL)`
2. 要改尺寸或用 base64，用 [2. Gmeek + Fancybox 引用代码](#2.-gmeek-+-fancybox-引用代码)（没必要）
3. 要改居中，只能用 [4. HTML 标签 - 三行 div](#4.-html-标签---三行-div)（没必要）
4. 仅用 base64，也可用 [5. GJken 代码](#5.-gjken-代码)（没必要）

- 因为 GitHub Issues 有最大字符限制，页内添加一张几十K图片已经是极限，而且两种 base64 实现方式都没法使用 MarkDown 的引用语法，所以研究 base64 没意义

------------------------------------------------------------------------------------
# 小细节
- 要是图片排版乱七八糟可以在每串图片代码前一行加个 `#` 强行分段
- 没必要太纠结居中和尺寸，小图才用得上居中，但不居中也没什么，而大图本来就居中
- img src 内直接加 `align="center"` 或 `align=center` 企图实现居中在 GitHub Issues 或 Gmeek 都无效
- 可用 p 或类似字符如 abc 代替 div
- 尺寸定义可以是 `width = "300" height = "300"` 或 `width = "300"` 或 `width = "50%"` 任意一个
- HTML 标签 + base64 无效

------------------------------------------------------------------------------------
# 1. GitHub Pages upload
优点：支持 Issues 预览，支持 Fancybox，推荐日常使用
缺点：不支持 base64 编码

| 自定义 | GitHub Issues | Gmeek |
| :------: | :--------------: | :-------: |
| Fancybox | ❌             | ✅        |
| base64 | ❌                 | ❌       |
| 显示    | ✅                  | ✅       |
| 位置    | ❌                  | ❌       |
| 尺寸    | ❌                  | ❌       |

```
![Image](URL)
```

![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309)

------------------------------------------------------------------------------------
# 2. Gmeek + Fancybox 引用代码
优点：目前自定义尺寸唯一方法，不用改代码直接支持含 base64 编码内的所有图片，推荐偶然用 base64 时使用
缺点：可能不支持懒加载插件（不能添加懒加载代码 `ImgLazyLoad-circle` 否则会失效），没法使用常规 MarkDown 引用语法，不过本来就最多只能添加一两张，所以没所谓懒加载，格式要额外记

| 自定义 | GitHub Issues | Gmeek |
| :------: | :--------------: | :-------: |
| Fancybox | ❌             | ✅        |
| base64 | ❌                 | ✅       |
| 显示    | ❌                  | ✅       |
| 位置    | ❌                  | ❌       |
| 尺寸    | ❌                  | ✅       |

```
`Gmeek-html<img data-fancybox="gallery" img src="URL" width = "300" height = "300" alt="name">`
```

`Gmeek-html<img data-fancybox="gallery" img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" width="50%" alt="logoTest">`

------------------------------------------------------------------------------------
# 3. HTML 标签 - 单行
优点：GitHub Issues 内比较完整支持
缺点：约等于 `[description](url)`，格式麻烦，意义不大

| 自定义 | GitHub Issues | Gmeek |
| :------: | :--------------: | :-------: |
| Fancybox | ❌             | ✅        |
| base64 | ❌                 | ❌       |
| 显示     | ✅                 | ✅       |
| 位置     | ❌                 | ❌       |
| 尺寸     | ✅                 | ❌       |

```
<img src="URL" width = "300" height = "300" alt="name" >
```

<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" width = "300" height = "300" alt="logoTest" >

------------------------------------------------------------------------------------
# 4. HTML 标签 - 三行 div
优点：目前居中唯一方法，几乎全功能
缺点：格式用着比较麻烦，可惜 Gmeek 内不支持尺寸

| 自定义 | GitHub Issues | Gmeek |
| :------: | :--------------: | :-------: |
| Fancybox | ❌             | ✅        |
| base64 | ❌                 | ❌       |
| 显示     | ✅                 | ✅       |
| 位置     | ✅                 | ✅       |
| 尺寸     | ✅                 | ❌       |

```
<div align="center">    
<img src="URL" width = "300" height = "300" alt="name" >
</div>
```

<div align="center">    
<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" width = "300" height = "300" alt="logoTest" >
</div>

------------------------------------------------------------------------------------
# 5. GJKen 代码
来源：[Gmeek - 记录使用过程](https://gjken.github.io/post/1.html)
原为改源码方式修改 Gmeek 仓库的 Gmeek.py 文件，通过下面这段代码激活
```
`Gmeek-imgbox="URL"`
```
现改为 js 格式并添加进外部加载的 fancyboxload.js 插件，并调整为通过更易记的和 GitHub Issues 相同的代码格式来激活
```
`![Image](URL)`
```
PS: 使用时 `Image` 不能改其它字符，前后的 ` 符号需保留，否则无效

现改成方便加载的 `插件.js` 解锁功能
优点：语法简单，兼容性好，支持含 base64 编码内的所有图片，可在需要 base64 时使用，但没太大意义
缺点：不支持 Issues 预览，要额外添加代码进插件，没法使用常规 MarkDown 引用语法，不过本来就最多只能添加一两张，所以没所谓懒加载，格式要额外记

| 自定义 | GitHub Issues | Gmeek |
| :------: | :--------------: | :-------: |
| Fancybox | ❌             | ✅        |
| base64 | ❌                 | ✅       |
| 显示    | ❌                  | ✅       |
| 位置    | ❌                  | ❌       |
| 尺寸    | ❌                  | ❌       |

```
`![Image](URL)`
```

`![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309)`

------------------------------------------------------------------------------------
# 6. Gmeek 自带格式（复杂情况使用）
优点：支持部分 HTML 语法 + base64，可变身为 [2. Gmeek + Fancybox 引用代码](#2.-gmeek-+-fancybox-引用代码)
缺点：不支持 Issues 预览，不支持 Fancybox，格式不好记

| 自定义 | GitHub Issues | Gmeek |
| :------: | :--------------: | :-------: |
| Fancybox | ❌             | ❌        |
| base64 | ❌                 | ✅       |
| 显示    | ❌                  | ✅       |
| 位置    | ❌                  | ❌       |
| 尺寸    | ❌                  | ✅       |

```
`Gmeek-html<img src="URL" alt="name" width="50%">`
```

`Gmeek-html<img src="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309" width="50%">`

------------------------------------------------------------------------------------
<details><summary>废案</summary> 

## 废案1. Gmeek-html - 三行 div
没用，相当于 Gmeek-html 成为乱码 +  单行 HTML 标签，测试过放到 Gmeek-html 里面外面都一样
```
<div align="center">   
`Gmeek-html<img src="URL" alt="" width = "300" height = "300" alt="name" >`
</div>
```

## 废案2. GitHub Issues + div
完全无效，都不显示图片
```
<div align="center">    
![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309)
</div>
```

## 废案3. GitHub Issues Original with =size
完全无效，都不显示图片
`![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309 =300x300)`

## 废案4. GitHub Issues Original with #pic_center
完全无效，都不显示图片
`![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309#pic_center)`

## 废案5. GitHub Issues Original with CSS
图片能显示但 CSS 后缀无效
![Image](https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309){:height="50%" width="50%"}

## 废案6.# div + GJKen
完全无效
```
<div  align="center">    
`Image="https://github.com/user-attachments/assets/918d11b9-5864-429e-b7fe-1dffcb08a309"`
</div>
```
## 废案7. MarkDown 直接使用 base64（没法使用）
优点：可使用引用语法，将来用其它类型博客可参考使用
缺点：GitHub Issues 不支持
PS: Image 可以改为任意名称，顺便使用了引用方式作为示例
```
![Image](URL)
```
![Image][logoTest]

[logoTest]: data:image/png;base64,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

</details>


