# 基于[e 小天](https://www.wxext.cn/)的微信拓展

- 系统要求

  - [mongodb](https://www.mongodb.com/)
  - [.Net Framework 4.6](https://dotnet.microsoft.com/en-us/download/dotnet-framework) 或以上
  - [Nodejs v18.16.1](https://nodejs.org/) 或以上
  - Windows 7 或以上
  - [e 小天](https://www.wxext.cn/)

- Nodejs 脚本运行环境要求：
  在脚本存放目录添加.env 文件，并写入如下字段

```bash
    ADMIN_WXID = "wxid_imkyadfccft45" //管理员微信id
    DB_URL = "mongodb://192.168.1.11:27017/wxExtDev" //mongodb 地址
    HISTORY_PACKAGE_PRICE = "0.1" //历史图包价格
    PERMENENT_MEMBER_PRICE = "0.5" //永久会员价格
    ARTIFICIAL_START = "09:00:00" //人工服务开始时间
    ARTIFICIAL_END = "17:30:00" //人工服务结束时间
    ARCHIEVE_PATH = "E:\\\\Archieve\\\\" //压缩文档路径
    DAILY_PRICE = 0.99 //每日图包价格
    IMG_PATH = "E:\\workspace\\AI\\成稿\\" // 图片路径
```
