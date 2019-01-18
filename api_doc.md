### 目录

* 系统用户(教职工)信息管理user

  * 系统用户登录login
  * 系统用户退出quit
  * 系统用户信息修改edit
  * 模糊查询系统用户信息query 按用户名 职工号综合
  * 批量录入系统用户信息add
  * 修改某系统用户权限editPermission
  * 修改某系统用户角色editRole
  * 删除某系统用户delete

* 学校院系信息管理department

  * 模糊查询院系信息query 按院系名
  * 修改院系信息edit
  * 添加院系add
  * 删除院系delete

* 学院专业信息管理major

  * 模糊查询专业信息query  按专业名
  * 修改专业信息edit
  * 添加专业edit
  * 删除专业delete

* 学生个人信息管理student

  * 模糊查询学生个人信息query 按学号 姓名综合
  * 修改学生信息edit
  * 添加学生add
  * 删除学生delete

* 学生奖罚信息管理case

  * 查询单个学生奖罚信息
  * 修改学生奖罚信息edit

  * 添加学生奖罚add
  * 删除学生奖罚delete

* 课程设置信息管理course

  * 模糊查询课程设置query 按课名
  * 修改课程设置信息edit

  - 添加课程设置add
  - 删除课程设置delete

* 课程开课信息管理section

  * 模糊查询课程开课query 按课名
  * 修改课程开课信息edit

  - 添加课程开课add
  - 删除课程开课delete

* 学生选课&考试信息管理take

  * 模糊查询学生选课&考试query 按学生学号 开课id
  * 修改学生选课&考试信息edit

  - 添加学生选课add
  - 删除学生选课delete





#### 接口模板样例

接口功能

> 用于为本接口文档各接口设置提供规范与模板，对于返回字段，以后只列举data部分

URL

> [/api/handler_name/func_name]()

支持格式

> JSON

HTTP请求方式

> GET

请求参数

> | 参数 | 必选 | 类型 | 说明                                    |
> | :--- | :--- | :--- | --------------------------------------- |
> | name | ture | str  | 请求的项目名                            |

返回字段

> | 返回字段 | 字段类型 | 说明                                                         |
> | :------- | :------- | :----------------------------------------------------------- |
> | errcode  | int      | 返回结果状态。0：成功；4001：数据库查询错误；4002：无数据；4003：数据已存在；4004：数据错误；4101：用户未登录；4102：用户登录失败；4103：参数错误；4104：用户不存在或未激活；4105：用户身份错误；4106：密码错误；4201：非法请求或请求次数受限；4202：IP受限；4301：第三方系统错误；4302：文件读写错误；4500：内部错误；4501：未知错误； |
> | errmsg   | str      | 返回结果说明。                                               |
> | data     | list     | 返回数据。可无此K-V                                          |

接口示例

> 地址：[/api/handler_name/func_name?name="可口可乐"&type=1]()
``` javascript
{
    "errcode": 0,
    "errmsg": "OK！",
    "data": [{
        		"key1":"value1",
        		"key2":"value2"
             },{
                "key1":"value1",
        		"key2":"value2"
            }]
}
```



### 系统用户(教职工)信息管理

#### 系统用户登录

接口功能

> 系统用户登录

URL

> [/api/user/login]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数     | 必选 | 类型 | 说明         |
> | :------- | :--- | :--- | ------------ |
> | id       | ture | str  | 系统用户账号 |
> | password | true | str  | 系统用户密码 |
> | remember | true | int  | 记住登录     |

接口示例

```javascript
{
    "errcode": 0,
    "errmsg": "登录成功"
}
```



#### 系统用户退出

接口功能

> 系统用户退出，转到login页面

URL

> [/api/user/logout]()

支持格式

> JSON

HTTP请求方式

> GET

接口示例

```javascript
{
    "errcode": 0,
    "errmsg": "退出成功"
}
```



#### 系统用户信息角色修改

接口功能

> 用于系统用户信息角色修改，API为管理员用户发起才行

URL

> [/api/user/editRole]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选 | 类型 | 说明         |
> | :--- | :--- | :--- | ------------ |
> | id   | true | str  | 根据id改信息 |
> | role | true | int  |              |





#### 模糊查询系统用户信息

接口功能

> 用于模糊查询系统用户信息

URL

> [/api/user/query]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数            | 必选  | 类型 | 说明         |
> | :-------------- | :---- | :--- | ------------ |
> | id              | false | str  | 查询的职工号 |
> | name            | false | str  | 查询的名字   |
> | department_name | false | str  | 学院名称     |
> | page            | true  | int  | 页数分页     |

返回字段(data中)

> | 返回字段        | 字段类型 | 说明                                 |
> | :-------------- | :------- | :----------------------------------- |
> | id              | str      |                                      |
> | name            | str      |                                      |
> | email           | str      |                                      |
> | mobile          | str      |                                      |
> | department_id   | int      |                                      |
> | department_name | str      |                                      |
> | permission      | int      | 用户权限(二进制)                     |
> | role            | int      | 用户角色，0-管理员，1-教务员，2-教师 |

接口示例

```javascript
{
    "errcode": 0,
    "errmsg": "查询成功！",
    "data": [{
        		"id":"",
        		"name":"",
        		...
             },...]
}
```



#### 系统用户信息修改

接口功能

> 用于系统用户信息修改，全传过来，包括密码

URL

> [/api/user/edit]()

支持格

> JSON

HTTP请求方式

> POST

请求参数

> | 参数          | 必选 | 类型 | 说明         |
> | :------------ | :--- | :--- | ------------ |
> | id            | true | str  | 根据id改信息 |
> | name          | true | str  |              |
> | email         | true | str  |              |
> | mobile        | true | str  |              |
> | department_id | true | int  |              |





#### 批量录入系统用户信息

接口功能

> 用于批量录入系统用户信息

URL

> [/api/user/add]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数             **数组形式**

> | 参数          | 必选  | 类型 | 说明 |
> | :------------ | :---- | :--- | ---- |
> | id            | true  | str  |      |
> | password      | true  | str  |      |
> | name          | true  | str  |      |
> | department_id | false | int  |      |
> | email         | false | str  |      |
> | mobile        | false | str  |      |

接口示例

```javascript
{
    "errcode": 0,
    "errmsg": "录入成功！"
}
```



#### 删除系统用户

接口功能

> 用于删除单个系统用户

URL

> [/api/user/delete]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数             **数组形式**

> | 参数 | 必选 | 类型 | 说明 |
> | :--- | :--- | :--- | ---- |
> | id   | true | str  |      |



### 学校院系信息管理

#### 模糊查询院系信息

接口功能

> 用于按院系名模糊查询院系信息，id和学院名综合查询

URL

> [/api/department/query]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选   | 类型 | 说明               |
> | :--- | :----- | :--- | ------------------ |
> | id   | 可为"" | int  | 请求的学院id关键词 |
> | name | 可为"" | str  | 请求的学院名关键词 |
> | page | true   | int  | 页数分页           |

返回字段(data数组中)

> | 返回字段 | 字段类型 | 说明     |
> | :------- | :------- | :------- |
> | id       | int      |          |
> | name     | str      |          |
> | dean     | str      | 院长姓名 |
> | address  | str      | 学院地址 |



#### 修改院系信息

接口功能

> 用于修改单个院系信息

URL

> [/api/department/edit]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数    | 必选 | 类型 | 说明 |
> | :------ | :--- | :--- | ---- |
> | id      | ture | int  |      |
> | name    | ture | str  |      |
> | dean    | ture | str  |      |
> | address | ture | str  |      |



#### 添加院系

接口功能

> 用于添加院系

URL

> [/api/handler_name/func_name]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数    | 必选 | 类型 | 说明 |
> | :------ | :--- | :--- | ---- |
> | name    | ture | str  |      |
> | dean    | ture | str  |      |
> | address | ture | str  |      |



#### 删除院系

接口功能

> 用于删除单个院系

URL

> [/api/department/delete]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选 | 类型 | 说明 |
> | :--- | :--- | :--- | ---- |
> | id   | true | int  |      |



### 学院专业信息管理

#### 模糊查询专业信息

接口功能

> 用于专业名模糊查询专业信息，id和专业名综合查询

URL

> [/api/major/query]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选   | 类型 | 说明               |
> | :--- | :----- | :--- | ------------------ |
> | id   | 可为"" | int  | 请求的专业id关键词 |
> | name | 可为"" | str  | 请求的专业名关键词 |
> | page | true   | int  | 页数分页           |

返回字段(data数组中)

> | 返回字段      | 字段类型 | 说明       |
> | :------------ | :------- | :--------- |
> | id            | int      |            |
> | name          | str      |            |
> | degree        | str      | 学位门类   |
> | study_time    | int      | 修业年限   |
> | department_id | int      | 所属学院id |



#### 修改专业信息

接口功能

> 用于改专业信息

URL

> [/api/major/edit]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数          | 必选 | 类型 | 说明                   |
> | :------------ | :--- | :--- | ---------------------- |
> | id            | true | int  | 以此为依据更改其他属性 |
> | name          | true | str  |                        |
> | degree        | true | str  |                        |
> | study_time    | true | int  |                        |
> | department_id | true | int  |                        |



#### 添加专业

接口功能

> 用于添加专业

URL

> [/api/major/add]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数          | 必选 | 类型 | 说明 |
> | :------------ | :--- | :--- | ---- |
> | name          | true | str  |      |
> | degree        | true | str  |      |
> | study_time    | true | int  |      |
> | department_id | true | int  |      |



#### 删除专业

接口功能

> 用于删除单个专业

URL

> [/api/major/delete]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选 | 类型 | 说明 |
> | :--- | :--- | :--- | ---- |
> | id   | true | int  |      |



### 学生个人信息管理

#### 模糊查询学生个人信息

接口功能

> 用于模糊查询学生个人信息，学号和姓名综合查询

URL

> [/api/student/query]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选   | 类型 | 说明             |
> | :--- | :----- | :--- | ---------------- |
> | id   | 可为"" | str  | 请求的学号关键词 |
> | name | 可为"" | str  | 请求的姓名关键词 |
> | page | true   | int  | 页数分页         |

返回字段(data数组中)

> | 返回字段        | 字段类型 | 说明                     |
> | :-------------- | :------- | :----------------------- |
> | id              | str      |                          |
> | name            | str      |                          |
> | birthday        | str      |                          |
> | sex             | int      | 学生性别，0-女性，1-男性 |
> | mobile          | str      |                          |
> | native_place    | str      | 学生籍贯                 |
> | enrollment_year | int      | 入学年份                 |
> | id_card         | str      |                          |
> | major_id        | int      |                          |



#### 修改学生个人信息

接口功能

> 用于修改学生个人信息

URL

> [/api/student/edit]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数            | 必选 | 类型 | 说明                     |
> | :-------------- | ---- | :--- | :----------------------- |
> | id              | true | str  |                          |
> | name            | true | str  |                          |
> | birthday        | true | str  |                          |
> | sex             | true | int  | 学生性别，0-女性，1-男性 |
> | mobile          | true | str  |                          |
> | native_place    | true | str  | 学生籍贯                 |
> | enrollment_year | true | int  | 入学年份                 |
> | id_card         | true | str  |                          |
> | major_id        | true | int  |                          |



#### 添加学生

接口功能

> 用于添加学生

URL

> [/api/student/add]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数            | 必选 | 类型 | 说明                     |
> | :-------------- | ---- | :--- | :----------------------- |
> | id              | true | str  |                          |
> | name            | true | str  |                          |
> | birthday        | true | str  |                          |
> | sex             | true | int  | 学生性别，0-女性，1-男性 |
> | mobile          | true | str  |                          |
> | native_place    | true | str  | 学生籍贯                 |
> | enrollment_year | true | int  | 入学年份                 |
> | id_card         | true | str  |                          |
> | major_id        | true | int  |                          |



#### 删除专业

接口功能

> 用于删除单个专业

URL

> [/api/student/delete]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选 | 类型 | 说明 |
> | :--- | :--- | :--- | ---- |
> | id   | true | str  |      |



### 学生奖罚信息管理

#### 查询学生个人奖罚信息

接口功能

> 用于查询单个学生所有奖罚信息

URL

> [/api/case/query]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数       | 必选 | 类型 | 说明           |
> | :--------- | :--- | :--- | -------------- |
> | student_id | true | str  | 请求的学生学号 |

返回字段(data数组中)

> | 返回字段     | 字段类型 | 说明                                                      |
> | :----------- | :------- | :-------------------------------------------------------- |
> | id           | int      |                                                           |
> | student_name | str      | 学生姓名                                                  |
> | type         | int      | 奖惩类型，0-奖励，1-惩罚                                  |
> | level        | int      | 奖惩级别，0-院级，1-校级，2-市级，3-省级，4国级，5-世界级 |
> | date         | str      |                                                           |
> | description  | str      |                                                           |



#### 修改学生奖罚信息

接口功能

> 用于单个修改学生奖罚信息

URL

> [/api/case/edit]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数        | 必选 | 类型 | 说明                                                      |
> | :---------- | ---- | :--- | :-------------------------------------------------------- |
> | id          | true | int  | 奖罚信息id                                                |
> | type        | true | int  | 奖惩类型，0-奖励，1-惩罚                                  |
> | level       | true | int  | 奖惩级别，0-院级，1-校级，2-市级，3-省级，4国级，5-世界级 |
> | date        | true | str  |                                                           |
> | description | true | str  |                                                           |



#### 添加学生奖罚信息

接口功能

> 用于单个添加学生奖罚信息

URL

> [/api/case/add]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数        | 必选 | 类型 | 说明                                                      |
> | :---------- | ---- | :--- | :-------------------------------------------------------- |
> | type        | true | int  | 奖惩类型，0-奖励，1-惩罚                                  |
> | level       | true | int  | 奖惩级别，0-院级，1-校级，2-市级，3-省级，4国级，5-世界级 |
> | date        | true | str  |                                                           |
> | description | true | str  |                                                           |



#### 删除学生奖罚信息

接口功能

> 用于删除学生奖罚信息

URL

> [/api/case/delete]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选 | 类型 | 说明 |
> | :--- | :--- | :--- | ---- |
> | id   | true | int  |      |



### 课程设置信息管理

#### 模糊查询课程设置信息

接口功能

> 用于模糊课程设置信息

URL

> [/api/course/query]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选   | 类型 | 说明                   |
> | :--- | :----- | :--- | ---------------------- |
> | id   | 可为"" | int  | 请求的课程设置id关键词 |
> | name | 可为"" | str  | 请求的课程名关键词     |
> | page | true   | int  | 页数分页               |

返回字段(data数组中)

> | 返回字段      | 字段类型 | 说明                                                         |
> | :------------ | :------- | :----------------------------------------------------------- |
> | id            | int      |                                                              |
> | name          | str      |                                                              |
> | property      | int      | 课程属性，1-必修，2-限选，3-任选，4-通识                     |
> | type          | int      | 课程类别，1-学科基础课，2-专业必修课，3-通识必修课，4-通识核心课，5-通识选修课 |
> | period        | int      | 课程学时，单位小时                                           |
> | credit        | int      | 课程学分，单位分                                             |
> | exam_type     | int      | 考试类型，0-考试，1-考察                                     |
> | department_id | int      | 开课学院ID                                                   |
> | description   | str      | 课程说明                                                     |



#### 修改课程设置信息

接口功能

> 用于单个修改课程设置信息

URL

> [/api/course/edit]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数          | 必选 | 字段类型 | 说明                                                         |
> | :------------ | ---- | :------- | :----------------------------------------------------------- |
> | id            | true | int      |                                                              |
> | name          | true | str      |                                                              |
> | property      | true | int      | 课程属性，1-必修，2-限选，3-任选，4-通识                     |
> | type          | true | int      | 课程类别，1-学科基础课，2-专业必修课，3-通识必修课，4-通识核心课，5-通识选修课 |
> | period        | true | int      | 课程学时，单位小时                                           |
> | credit        | true | int      | 课程学分，单位分                                             |
> | exam_type     | true | int      | 考试类型，0-考试，1-考察                                     |
> | department_id | true | int      | 开课学院ID                                                   |
> | description   | true | str      | 课程说明                                                     |



#### 添加课程设置

接口功能

> 用于单个添加课程设置

URL

> [/api/course/add]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数          | 必选 | 字段类型 | 说明                                                         |
> | :------------ | ---- | :------- | :----------------------------------------------------------- |
> | id            | true | int      |                                                              |
> | name          | true | str      |                                                              |
> | property      | true | int      | 课程属性，1-必修，2-限选，3-任选，4-通识                     |
> | type          | true | int      | 课程类别，1-学科基础课，2-专业必修课，3-通识必修课，4-通识核心课，5-通识选修课 |
> | period        | true | int      | 课程学时，单位小时                                           |
> | credit        | true | int      | 课程学分，单位分                                             |
> | exam_type     | true | int      | 考试类型，0-考试，1-考察                                     |
> | department_id | true | int      | 开课学院ID                                                   |
> | description   | true | str      | 课程说明                                                     |



#### 删除课程设置信息

接口功能

> 用于删除课程设置信息

URL

> [/api/course/delete]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选 | 类型 | 说明 |
> | :--- | :--- | :--- | ---- |
> | id   | true | int  |      |



### 课程开课信息管理

#### 模糊查询课程开课信息

接口功能

> 用于模糊查询课程开课信息

URL

> [/api/section/query]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选   | 类型 | 说明                   |
> | :--- | :----- | :--- | ---------------------- |
> | id   | 可为"" | int  | 请求的课程开课id关键词 |
> | name | 可为"" | str  | 请求的课程名关键词     |
> | page | true   | int  | 页数分页               |

返回字段(data数组中)

> | 返回字段     | 字段类型 | 说明         |
> | :----------- | :------- | :----------- |
> | id           | int      | 开课id       |
> | course_id    | int      | 课程id       |
> | course_name  | str      | 课程名称     |
> | semester     | int      | 开设学期     |
> | year         | int      | 开课年份     |
> | capacity     | int      | 课容量       |
> | teacher_id   | str      | 教师id       |
> | teacher_name | str      | 教师姓名     |
> | btime        | str      | 开课开始日期 |
> | etime        | str      | 开课结束日期 |



#### 修改课程开课信息

接口功能

> 用于单体修改修改课程开课信息

URL

> [/api/section/edit]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数       | 必选 | 类型 | 说明         |
> | :--------- | ---- | :--- | :----------- |
> | id         | true | int  | 开课id       |
> | course_id  | true | int  | 课程id       |
> | semester   | true | int  | 开设学期     |
> | year       | true | int  | 开课年份     |
> | capacity   | true | int  | 课容量       |
> | teacher_id | true | str  | 教师id       |
> | btime      | true | str  | 开课开始日期 |
> | etime      | true | str  | 开课结束日期 |



#### 添加课程开课

接口功能

> 用于单体添加课程开课

URL

> [/api/section/add]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数       | 必选 | 类型 | 说明         |
> | :--------- | ---- | :--- | :----------- |
> | course_id  | true | int  | 课程id       |
> | semester   | true | int  | 开设学期     |
> | year       | true | int  | 开课年份     |
> | capacity   | true | int  | 课容量       |
> | teacher_id | true | str  | 教师id       |
> | btime      | true | str  | 开课开始日期 |
> | etime      | true | str  | 开课结束日期 |



#### 删除课程开课

接口功能

> 用于单体删除课程开课

URL

> [/api/section/delete]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选 | 类型 | 说明   |
> | :--- | ---- | :--- | :----- |
> | id   | true | int  | 开课id |



### 学生选课信息管理

#### 模糊查询学生选课信息

接口功能

> 用于查询学生选课信息  综合查询

URL

> [/api/take/query]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数       | 必选   | 类型 | 说明                       |
> | :--------- | :----- | :--- | -------------------------- |
> | id         | 可为"" | int  | 请求的选课id关键词         |
> | student_id | 可为"" | str  | 请求的**学生学号**关键词   |
> | section_id | 可为"" | int  | 请求的**课程开课id**关键词 |
> | page       | true   | int  | 页数分页                   |

返回字段(data数组中)

> | 返回字段     | 字段类型 | 说明     |
> | :----------- | :------- | :------- |
> | id           | int      | 选课id   |
> | student_id   | str      | 学生学号 |
> | student_name | str      | 学生姓名 |
> | section_id   | int      | 开课id   |
> | course_name  | str      | 课程名称 |
> | usual_grade  | int      | 平时成绩 |
> | mid_grade    | int      | 期中成绩 |
> | final_grade  | int      | 期末成绩 |
> | grade        | int      | 最终成绩 |
> | GPA          | str      | 绩点     |



#### 修改学生选课信息

接口功能

> 用于单体修改学生选课信息

URL

> [/api/take/edit]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数        | 必选 | 字段类型 | 说明     |
> | :---------- | ---- | :------- | :------- |
> | id          | true | int      | 选课id   |
> | student_id  | true | str      | 学生学号 |
> | section_id  | true | int      | 开课id   |
> | usual_grade | true | int      | 平时成绩 |
> | mid_grade   | true | int      | 期中成绩 |
> | final_grade | true | int      | 期末成绩 |
> | grade       | true | int      | 最终成绩 |
> | GPA         | true | str      | 绩点     |



#### 添加学生选课

接口功能

> 用于单体添加学生选课

URL

> [/api/take/add]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数       | 必选 | 字段类型 | 说明     |
> | :--------- | ---- | :------- | :------- |
> | student_id | true | str      | 学生学号 |
> | section_id | true | int      | 开课id   |



#### 删除学生选课

接口功能

> 用于单体删除学生选课

URL

> [/api/take/delete]()

支持格式

> JSON

HTTP请求方式

> POST

请求参数

> | 参数 | 必选 | 类型 | 说明   |
> | :--- | ---- | :--- | :----- |
> | id   | true | int  | 选课id |

