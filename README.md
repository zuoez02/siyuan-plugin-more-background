# 题头图Plus

题头图增强插件，支持多个源的题头图。支持从剪贴板直接导入题头图

> 预览图中为搭配Asri主题的顶栏融合效果

## 使用方法

1. 安装插件
2. 无题头图文档点击题头的"添加题头图“
3. 点击题头图按钮组中的题头图Plus按钮，从按钮中选择一个数据源，或从剪贴板粘贴

## 内置数据源

- ACG
- Bing今日壁纸
- Unsplash
- Picsum

## 自定义数据源

找到工作空间/data/storage/petal/siyuan-plugin-more-background/settings文件，使用记事本打开，按照JSON格式，添加label和url即可。

注意URL必须是能够直接返回图片的形式，最好是302重定向方式获取的。