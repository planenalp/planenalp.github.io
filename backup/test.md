<!-- ##{"timestamp":1681790400}## -->

## 视频教程
[Bilibili](https://www.bilibili.com/video/BV1Pv4y1E7yZ)
[YouTube](https://www.youtube.com/watch?v=FTrhBlOOH3E)

## 0. BB
作为一个合格的大冤种，之前搞了块三星的 PM9A1 本来是打算给 NAS 当缓存的，但是因为实在太贵买不起第二块，所以就临时当固态U盘凑合用着
后来的事情大家都知道了，那就是臭名昭著 0E 门，还好不是买的 980 PRO 不然亏得更多，也还好没买第二块。。
据说升级固件可以改善，是不是真的有用谁也说不准，反正求个心里安慰吧
因为一直放在硬盘盒里折腾不是很方便
今天终于买了张 NVME 转 PCIe 的卡想着赶紧升级下
顺便记录下过程，供有需要的人参考

本教程以我持有的 PM9A1 为例，其余型号大同小异

## 1. 检查型号
根据 CrystalDiskInfo 判断固件版本是否需要升级并上网搜索找对应的最新版本固件
可以再 Windows 自带应用商店搜索 CrystalDiskInfo 直接下载
或者到官网下载
https://crystalmark.info/en/download/#CrystalDiskInfo

升级的逻辑是按照原有固件型号来找升级版
现在固件是是01结尾就升级01的，02结尾就升级02的，以此类推
我这里看到是型号 00B07，固件为 GXB7402Q， GXB开头，02结尾

目前 PM9A1 能找到的最新版 00A00/00B00 对应固件是 7801Q，00B07 对应固件是 7702Q
GXA 对应 1TB 或更小容量的型号
GXB 对应 2TB 的型号

所以我需要找对应 00B07 的最新版 7702Q，并且是 GXB 开头的固件来使用

上面提到的固件都已打包好放到网盘，有需要的自行下载
链接: https://pan.baidu.com/s/1S12921Ybu1D6YAu2XTI5dw?pwd=0e0e 提取码: 0e0e

## 2. 解压重命名
解压对应固件目录放去一个方便的位置比如
D:\00B07

重命名目录内的文件 txt 改为 bin，否则会报错找不到固件文件（提供的压缩包内已改好，之后若有新固件自己看情况改）
GXA7702Q_Noformat.txt 改为 GXA7702Q_Noformat.bin
或
GXB7702Q_Noformat.txt 改为 GXB7702Q_Noformat.bin（根据上一步判断是 GXB 开头的这个）

## 3. 查硬盘编号
管理员方式搜索打开“Windows PowerShell”
//输入命令进入目录
cd D:\00B07

//列出硬盘，并找到对应硬盘的数字序号，比如我这里在X9SRA用NVME转PCI-E卡是3
输入
list
要是红色报错，就输入
.\list
根据 Model 内的 SAMSUNG MZVL22T0HBLB-00B07 型号和原固件类型 GXB7402Q来判断，通常是顶置在第一行

记下数字序号后不要关窗口，等下还要继续用

## 4. 改固件参数
修改固件对应硬盘编号
右键 - 编辑，修改对应文件的数字 flash-2TB.cmd 或 flash-256G-512G-1T.cmd，按需选择，我这里是2T的所以是 flash-2TB.cmd
将下面这行的 * 号改为前面确认的序号 3
SSDManager.exe -d * -NF -p GXB7702Q_Noformat.bin -a 3 -s 1
改为
SSDManager.exe -d 3 -NF -p GXB7702Q_Noformat.bin -a 3 -s 1

## 5. 开刷
回到 Windows PowerShell
按 Enter 继续
输入硬盘对应的容量文件，我是 2T 的所以是
flash-2TB.cmd
要是红色报错，就按提示改为输入
.\flash-2TB.cmd
输入
yes
回车
完成

## 6. 检查
重新开 CrystalDiskInfo 或用 Windows PowerShell 的.\list 看固件名是否更新成功