## 《玩转社团项目服务端接口》
**使用node + Express 构建**
**以下API 均支持 POST/GET 请求。  支持json/jsonp服务**
**在下面我只写出API的请求参数和格式。 响应就不再下面写了**
**响应只有两种**
**成功:** {success : true, result : 数据}   (数据自己分析吧 很好懂的~~)
**失败:** {success: false, reason : 请求失败原因}

###一.社团端
1.社团注册 ： IP/groups/register

| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|groupName|String|社团名称|是|
|groupProfile|String|社团介绍|是|
|groupLoginName|String|社团登陆账号|是|
|groupLoginPassword|String|社团登陆密码|是|
|headNumber|String|社团负责人学号|是|
|headPassWord|String|社团负责人密码|是|
|headPhone|String|负责人手机号|是|
|verCode|String|验证码|是|

2.注册验证码 ： IP/groups/verificationCode
 不需要参数，直接放在 图片的src中
 
 3.社团登录  :  IP/groups/login
 
| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|groupLoginName |String|社团登录账号是|
|groupLoginPassword|String|社团登录密码|是|

 4.社团注销登录  :  IP/groups/cancelLogin
 不需要参数
 
 5.社团获取社团信息 ： IP/groups/getInfo
 ------(需要社团session)
 
| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|group_id| String|社团Id|是|

 6.学生获取社团信息  :  IP/groups/stuGetGroupinfo
  ------(不需要session)
  
| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|group_id| String|社团Id|是|
|username| String|学生学号|否|
解释: 如果有 username这个可选参数， 返回的结果里就会显示这个学生是否已经关注该社团

7.社团发布动态  :   IP/actions/pushDynamic
 ------(需要社团session)
  
| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|group_id| String| 当前社团Id| 是|
|title| String| 状态标题| 是|
|content| String| 状态主体内容| 是|

8.获取社团发布的历史动态 ：  IP/groups/getDynamics
 ------(需要社团session)

| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|group_id| String|社团Id|是|

9.社团回复学生的评论 ：  IP/actions/groupReplyComment
 ------(需要社团session)

  
| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|group_id| String| 当前社团Id| 是|
|dynamic_id| String| 当前状态Id| 是|
|reply_who| String| 回复的学生的学号| 是|
|content| String| 回复的内容| 是|



----------


###二.学生端
1.学生登录 ： IP/students/login

| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|username|String|学号|是|
|password|String|学号|否|

2.学生注销登录 :  IP/students/cancelLogin
不需要参数

3.获取学生个人信息 ： IP/students/getInfo
 ------(需要该学生session)
 
| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|username|String|学号|是|

4.获取学生点赞的社团状态 :  IP/students/getGoods
 ------(需要该学生session)

| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|username|String|学号|是|

5.获取学生评论的社团状态 :  IP/students/getSays
 ------(需要该学生session)
| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|username|String|学号|是|
6.获取学生关注的社团信息 : IP/students/getWatchs
 ------(需要该学生session)
 
| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|username|String|学号|是|

7.学生关注社团 : IP/actions/follow
 ------(需要该学生session)

| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|username|String|学号|是|
|group_id|String|要关注的社团的Id|是|

8.学生取消关注社团 : IP/actions/unfollow
 ------(需要该学生session)
 
| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|username|String|学号|是|
|group_id|String|要取消关注的社团的Id|是|

 9.学生评论社团发布的状态：IP/actions/studentPushComment 
  ------(需要该学生session)

| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|usernumber|String|学号|是|
|dynamic_id|String|要评论的状态Id|是|
|content| String| 评论内容主体 | 是|

10.学生点赞 ： IP/actions/clickGood
 ------(需要该学生session)
 
| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|usernumber|String|学号|是|
|dynamic_id|String|要点赞的状态Id|是|

11.学生取消点赞  ： IP/actions/unClickGood
 ------(需要该学生session)

| 参数 | 类型 | 含义|是否必须|
| --------|--------| -----|-----|
|usernumber|String|学号|是|
|dynamic_id|String|要取消点赞的状态Id|是|

12.得到所有的社团全部状态 ： IP/actions/getAllDynamics
 ------(不需要session)
不需要参数