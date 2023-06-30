export const Method = {
  /**
   * 按需获取图片 建议使用该接口获取图片,本地不存在图片时会从服务器下载
   * @param sid
   * @returns
   */
  getimgbyid: (sid: number) => {
    return {
      method: "getimgbyid",
      sid,
      pid: "0",
    };
  },

  /**
   * 通过代理启动微信
   * @param pid -1 为始终启动一个新的
   * @param path 指定安装路径,可省略
   * @param wxid 指定使用该wxid的配置快速进入微信(不存在则空配置)
   * @param proxy 格式为  address:port/username:password
   * @returns
   */
  run: (pid = -1, path: string, wxid: string, proxy: string) => {
    return {
      method: "run",
      pid,
      path,
      wxid,
      proxy,
    };
  },

  /**
   * 获取配置列表
   * @returns
   */
  getWxConfigList: () => {
    return { method: "wxconfig_list" };
  },

  /**
   * 删除配置
   * @param wxid 配置列表中的wxid
   * @returns
   */
  delWxConfig: (wxid: string) => {
    return { method: "wxconfig_del", wxid };
  },

  /**
   * 获取群成员,返回群信息和成员信息对象,重新按显示排序,群主和管理员排最前,utype标识群主和管理员
   * @param wxGroupId
   * @returns
   */
  getGroupUserV2: (wxGroupId: string) => {
    return { method: "getGroupUser_v2", wxid: wxGroupId };
  },

  /**
   * 转发消息,图片视频等需要先下载才能转发,收到消息时延时转发
   * 如果转发失败,请检查是否开启自动下载
   * @param id "本地id或服务端id"
   * @returns
   */
  forwardMsg: (id: string) => {
    return { method: "forwardMsg", id: id };
  },

  /**
   * 设置所有时段自动下载
   * @returns
   */
  downrannge: () => {
    return { method: "downrange", flag: "0", data: "00:00-00:00" };
  },

  /**
   * 获取消息
   * 可选参数: sid:返回等于该id的消息(sid为消息通知中的19位id)
   * id:返回大于该id的消息
   * flag:返回小于上述id的消息
   * type:返回指定类型的消息
   * msg:返回包含相关内容的消息(搜xml加前缀x:)
   * fromid:返回指定对象消息 memid:返回指定群成员消息
   * @returns
   */
  getMsg: () => {
    return { method: "getMsg", type: 1 };
  },

  /**
   * 网络获取群成员邀请信息
   * @param wxGroupId
   * @returns
   */
  getChatRoomMemberDetail: (wxGroupId: string) => {
    return { method: "getchatroommemberdetail", wxGroupId };
  },

  /**
   * 网络获取群成员详细信息
   * @param wxid
   * @param wxGroupId
   * @returns
   */
  netUpdateUser: (wxid: string, wxGroupId: string) => {
    return {
      method: "netUpdateUser",
      wxid,
      wxGroupId,
    };
  },

  /**
   * 查找微信号
   * @param wxid
   * @returns
   */
  netSearchUser: (wxid: string) => {
    return { method: "netSearchUser", wxid };
  },

  /**
   * 同意好友
   * @param encryptusername
   * @param ticket
   * @param scene 收到消息中的scene字段内容
   * @returns
   */
  agreeUser: (encryptusername: string, ticket: string, scene: string) => {
    return { method: "agreeUser", encryptusername, ticket, scene };
  },

  /**
   * 刷新朋友圈
   * @returns
   */
  mmsnstimeline: () => {
    return { method: "mmsnstimeline" };
  },

  /**
   * 退回转账
   * @param wxid
   * @param transferid
   * @returns
   */
  refuseCash: (wxid: string, transferid: string) => {
    return {
      method: "agreeCash",
      wxid,
      transferid: `op=refuse&trans_id=${transferid}`,
      pid: 0,
    };
  },

  /**
   * 查询转账状态
   * @param wxid
   * @param transferid
   * @returns
   */
  checkCashStatus: (wxid: string, transferid: string) => {
    return {
      method: "agreeCash",
      wxid,
      transferid: `trans_id=${transferid}`,
      pid: 0,
    };
  },

  /**
   * 接受转账
   * @param wxid 发起转账方id
   * @param transferid
   * @returns
   */
  agreeCash: (wxid: string, transferid: string) => {
    return {
      method: "agreeCash",
      wxid,
      transferid,
      pid: 0,
    };
  },

  /**
   * 软件配置
   * 该方法返回所有配置项,部分配置可传入修改,重启软件生效
   * @param log 默认`0` 1开启日志
   * @param allownet 默认`1` 1开启外网,已新增key和ip白名单验证,可安全使用
   * @returns
   */
  setConfig: (log = 0, allownet = 1) => {
    return { method: "setConfig", log, allownet };
  },

  /**
   * 应用配置
   * @param log 默认`0` 1开启日志
   * @param name 插件名称
   * @returns
   */
  setExt: (log = 0, name: string) => {
    return {
      method: "setExt",
      log, //1开启日志
      name, //插件名称
    };
  },

  /**
   * 抖动微信 将微信抖动置顶
   * @returns
   */
  show: () => {
    return { method: "show", pid: 0 };
  },

  /**
   * 点击登录 点击微信启动时的登录页面
   * @returns
   */
  clickLogin: () => {
    return { method: "clickLogin", pid: 0 };
  },

  /**
   * 跳转二维码
   * @returns
   */
  gotoQr: () => {
    return { method: "gotoQr", pid: 0 };
  },

  /**
   * 退出登录
   * @returns
   */
  logOut: () => {
    return { method: "loginOut", pid: 0 };
  },

  /**
   * 结束进程
   * @returns
   */
  kill: () => {
    return { method: "kill", pid: 0 };
  },

  /**
   * 连接列表
   * @returns
   */
  list: () => {
    return { method: "list", pid: 0 };
  },

  /**
   * 插件列表
   */
  extList: () => {
    return { method: "ext", action: "list", pid: 0 };
  },

  /**
   * 获取登录信息
   * @returns
   */
  getInfo: () => {
    return { method: "getInfo", pid: 0 };
  },

  /**
   * 获取通讯录 包括好友、群聊、公众号
   */
  getuser: () => {
    return { method: "getUser", pid: 0 };
  },

  /**
   * 获取群列表 包括好友、群聊、公众号
   */
  getGroup: () => {
    return { method: "getGroup", pid: 0 };
  },

  /**
   * 获取群成员 群内昵称，排序为入群时间
   * @param groupid
   * @returns 返回成员信息数组
   */
  getGroupUser: (groupid: string) => {
    return { method: "getGroupUser", wxid: groupid, pid: 0 };
  },

  /**
   * 设置群公告 会自动添加@所有人
   * @param groupid
   * @param msg
   * @returns
   */
  setRoomAnnouncement: (groupid: string, msg: string) => {
    return {
      method: "setRoomAnnouncement",
      wxid: groupid,
      msg,
      pid: 0,
    };
  },

  /**
   * 设置备注
   * @param wxid
   * @param remark
   * @returns
   */
  setRemark: (wxid: string, remark: string) => {
    return {
      method: "setRemark",
      wxid,
      msg: remark,
      pid: 0,
    };
  },

  /**
   * 群踢人
   * @param groupid
   * @param userid
   * @returns
   */
  delRoomMember: (groupid: string, userid: string) => {
    return {
      method: "delRoomMember",
      wxid: groupid,
      msg: userid,
      pid: 0,
    };
  },

  addGroupMember: (groupid: string, userid: string) => {
    return {
      method: "addGroupMember",
      wxid: groupid,
      msg: userid,
      pid: 0,
    };
  },

  /**
   * 设置群名称
   * @param groupid
   * @param roomName
   * @returns
   */
  setRoomName: (groupid: string, roomName: string) => {
    return {
      method: "setRoomName",
      wxid: groupid,
      msg: roomName,
      pid: 0,
    };
  },

  /**
   * 退出群聊
   * @param groupid
   * @returns
   */
  quitChatRoom: (groupid: string) => {
    return {
      method: "quitChatRoom",
      wxid: groupid,
      pid: 0,
    };
  },

  /**
   * 群邀请发送
   * @param groupid
   * @param userid
   * @returns
   */
  sendGroupInvite: (groupid: string, userid: string) => {
    return {
      method: "sendGroupInvite",
      wxid: groupid,
      msg: userid,
    };
  },

  /**
   * 获取用户头像
   * @param userid
   * @returns
   */
  getUserImg: (userid: string) => {
    return { method: "getUserImg", wxid: userid, pid: 0 };
  },

  /**
   * 查昵称信息
   * @param userid
   * @returns
   */
  getUserInfo: (userid: string) => {
    return { method: "getUserInfo", wxid: userid, pid: 0 };
  },

  /**
   * 获取数据库列表
   * @returns
   */
  getDbName: () => {
    return { method: "getDbName", pid: 0 };
  },

  /**
   * 执行数据库语句
   * @param dbName
   * @param sql SQL语句
   * @returns
   */
  runSql: (dbName: string, sql: string) => {
    return { method: "runSql", db: dbName, sql, pid: 0 };
  },

  /**
   * 发送文本消息
   * 需要艾特人时，传入atid
   * 多人艾特用|分割，同时msg要对应多个艾特文本
   * 艾特消息 `{ "method": "sendText", "wxid": "23942162341@chatroom", "msg": "`@昵称1` `@昵称2` 艾特消息", "atid": "wxid_xxx1|wxid_xxx2", "pid": 0 }`
   * @param wxid
   * @param msg
   * @param atid
   * @returns
   */
  sendText: (wxid: string, msg: string, atid = [""]) => {
    return {
      method: "sendText",
      wxid,
      msg: `${msg}\n\n--此消息为自动回复，查看帮助请发送【帮助】，需要人工服务请发送【人工】，人工服务时间为9:00-17:30`,
      atid: atid.join("|"),
      pid: 0,
    };
  },

  /**
   * 转发图片
   * @param wxid
   * @param imgPath 图片本地路径, 自动下载的路径通过xmlinfo推送来获取
   * @returns
   */
  sendImage: (wxid: string, imgPath: string) => {
    return {
      method: "sendImage",
      wxid,
      img: imgPath,
      imgType: "file",
      pid: 0,
    };
  },

  /**
   * 发送动态表情
   * @param wxid
   * @param path 本地路径
   * @returns
   */
  sendEmoji: (wxid: string, path: string) => {
    return {
      method: "sendEmoji",
      wxid,
      path, //本地路径
      pid: 0,
    };
  },

  /**
   * 转发动态表情
   * @param wxid
   * @param xml type=47收到的msg中的xml 参考接收到的xml
   * @returns
   */
  sendEmojiForward: (wxid: string, xml: string) => {
    return {
      method: "sendEmojiForward",
      wxid,
      xml,
      pid: 0,
    };
  },

  /**
   * 转发文章链接小程序
   * @param wxid
   * @param xml type=49收到的msg中的xml,参考接收到的xml
   * @returns
   */
  sendAppmsgForward: (wxid: string, xml: string) => {
    return {
      method: "sendEmojiForward",
      wxid,
      xml,
      pid: 0,
    };
  },

  /**
   * 发送语音通话 紧急事件可以通过发送语音通话实现
   * @param wxid
   * @returns
   */
  callVoipAudio: (wxid: string) => {
    return { method: "callVoipAudio", wxid };
  },

  /**
   * 清除全部聊天记录
   * @returns
   */
  clearMsgList: () => {
    return {
      method: "ClearMsgList",
      pid: -1, //全部
    };
  },

  /**
   * 获取文件数据
   * @param filePath
   * @returns
   */
  getFile: (filePath: string) => {
    return { method: "getfile", filePath };
  },

  /**
   * 保存数据(可选type:base64,hex,url,默认为保存文本)
   * @param path
   * @param data
   * @returns
   */
  saveFile: (path: string, data: string) => {
    return {
      method: "savefile",
      path,
      data,
    };
  },

  /**
   * 保存图片
   * @param url
   * @returns
   */
  saveimg: (url: string) => {
    return {
      method: "saveimg",
      type: "url",
      data: url,
    };
  },

  /**
   * 网络获取详细信息,昵称 头像
   * @param wxid
   * @returns
   */
  netGetUser: (wxid: string[]) => {
    return {
      method: "netGetUser",
      wxid: wxid.join("|"),
      pid: 0,
    };
  },

  tips: (title: string, text: string) => {
    return {
      method: "tips",
      title,
      text,
    };
  },

  /**
   * 发送文件
   * @param wxid 
   * @param file 文件绝对路径
   * @returns 
   */
  sendFile: (wxid: string, file: string) => {
    return {
      method: "sendFile",
      wxid,
      file,
      fileType: "file",
    };
  },
};
