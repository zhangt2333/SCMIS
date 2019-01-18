-- DROP DATABASE `scmis`;

CREATE DATABASE `scmis` DEFAULT CHARACTER SET utf8; -- 创建学生(student)选课(course)管理(manage)信息(info)系统(system)

USE scmis;

CREATE TABLE ms_department_info(
    di_id int unsigned NOT NULL AUTO_INCREMENT COMMENT '学院ID',
    di_name varchar(32) NOT NULL COMMENT '学院名称',
    di_dean varchar(32) NOT NULL COMMENT '院长姓名',
    di_address varchar(128) COMMENT '学院地址', 
    PRIMARY KEY (di_id),
    KEY `di_name` (di_name)
) ENGINE=InnoDB  AUTO_INCREMENT=10000  DEFAULT CHARSET=utf8 COMMENT '学院信息表';

CREATE TABLE ms_major_info(
    mi_id int unsigned NOT NULL AUTO_INCREMENT COMMENT '专业ID',
    mi_name varchar(32) NOT NULL COMMENT '专业名称',
    mi_degree varchar(32) NOT NULL COMMENT '学位门类',
    mi_study_time tinyint unsigned NOT NULL COMMENT '修业年限，单位年',
    mi_department_id int unsigned NOT NULL COMMENT '所属学院ID',
    PRIMARY KEY (mi_id),
    KEY `mi_name` (mi_name),
    CONSTRAINT FOREIGN KEY (`mi_department_id`) REFERENCES `ms_department_info` (`di_id`)
) ENGINE=InnoDB  AUTO_INCREMENT=10000  DEFAULT CHARSET=utf8 COMMENT '专业信息表';

CREATE TABLE ms_student_info(
    si_id char(12) NOT NULL COMMENT '学生学号',
    si_name varchar(32) NOT NULL COMMENT '学生姓名',
    si_birthday date NOT NULL COMMENT '学生生日',
    si_sex tinyint NOT NULL COMMENT '学生性别，0-女性，1-男性',
    si_mobile char(11) NOT NULL COMMENT '手机号',
    si_native_place varchar(32) DEFAULT '' COMMENT '学生籍贯',
    si_enrollment_year smallint unsigned NOT NULL COMMENT '入学年份',
    si_id_card varchar(20) NULL COMMENT '身份证号',
    si_major_id int unsigned NOT NULL COMMENT '专业ID',
    PRIMARY KEY (si_id),
    UNIQUE(si_mobile),
    CONSTRAINT FOREIGN KEY (`si_major_id`) REFERENCES `ms_major_info` (`mi_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='学生信息表';

CREATE TABLE ms_user_info(
    ui_id char(12) NOT NULL COMMENT '用户ID',
    ui_passwd varchar(64) NOT NULL COMMENT '用户密码',
    ui_name varchar(32) NOT NULL COMMENT '用户姓名',
    ui_email varchar(64) COMMENT '用户邮箱',
    ui_mobile char(11) COMMENT '手机号',
    ui_department_id int unsigned COMMENT '所属学院ID',
    ui_permission int unsigned NOT NULL DEFAULT '0'  COMMENT '用户权限(二进制)',
    ui_role tinyint unsigned NOT NULL DEFAULT '2' COMMENT '用户角色，0-管理员，1-教务员，2-教师',
    PRIMARY KEY (ui_id),
    CONSTRAINT FOREIGN KEY (`ui_department_id`) REFERENCES `ms_department_info` (`di_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统用户信息表(教职工信息表)';

CREATE TABLE ms_student_case(
    sc_id bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '事迹ID',
    sc_student_id char(12) NOT NULL COMMENT '学生学号',
    sc_type tinyint NOT NULL COMMENT '奖惩类型，0-奖励，1-惩罚',
    sc_level tinyint NOT NULL COMMENT '奖惩级别，0-院级，1-校级，2-市级，3-省级，4国级，5-世界级',
    sc_date date NOT NULL COMMENT '奖惩日期',
    sc_description text NOT NULL COMMENT '奖惩说明',
    PRIMARY KEY (sc_id), 
    KEY `sc_student_id` (sc_student_id),
    CONSTRAINT FOREIGN KEY (`sc_student_id`) REFERENCES `ms_student_info` (`si_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8 COMMENT '学生奖惩事迹表';
    
CREATE TABLE ms_course_info(
    ci_id int unsigned NOT NULL AUTO_INCREMENT COMMENT '课程ID',
    ci_name varchar(64) NOT NULL COMMENT '课程名',
    ci_property tinyint unsigned NOT NULL DEFAULT '3' COMMENT '课程属性，1-必修，2-限选，3-任选，4-通识',
    ci_type tinyint NOT NULL COMMENT '课程类别，1-学科基础课，2-专业必修课，3-通识必修课，4-通识核心课，5-通识选修课',
    ci_period smallint unsigned NOT NULL COMMENT '课程学时，单位小时',
    ci_credit tinyint unsigned NOT NULL DEFAULT '0' COMMENT '课程学分，单位分',
    ci_exam_type tinyint unsigned NOT NULL DEFAULT '0' COMMENT '考试类型，0-考试，1-考察',
    ci_department_id int unsigned NOT NULL COMMENT '开课学院ID',
    ci_description text COMMENT '课程说明',
    PRIMARY KEY (ci_id),
    KEY `ci_name` (ci_name),
    CONSTRAINT FOREIGN KEY (`ci_department_id`) REFERENCES `ms_department_info` (`di_id`)
) ENGINE=InnoDB  AUTO_INCREMENT=10000  DEFAULT CHARSET=utf8 COMMENT '课程设置表';

CREATE TABLE ms_course_section(
    cs_id bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '开课ID',
    cs_course_id int unsigned NOT NULL COMMENT '课程ID',
    cs_semester tinyint unsigned NOT NULL COMMENT '开课学期',
    cs_year smallint unsigned NOT NULL COMMENT '开课年份',
    cs_capacity smallint unsigned NOT NULL COMMENT '课容量',
    cs_teacher_id char(12) NOT NULL COMMENT '教师ID',
    cs_btime date NOT NULL COMMENT '开课开始日期',
    cs_etime date NOT NULL COMMENT '开课结束日期',
    PRIMARY KEY (cs_id),
    CONSTRAINT FOREIGN KEY (`cs_course_id`) REFERENCES `ms_course_info` (`ci_id`),
    CONSTRAINT FOREIGN KEY (`cs_teacher_id`) REFERENCES `ms_user_info` (`ui_id`)
) ENGINE=InnoDB  AUTO_INCREMENT=10000  DEFAULT CHARSET=utf8 COMMENT '课程开课表';

CREATE TABLE ms_course_take(
    ct_id bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '选课ID',
    ct_student_id char(12) NOT NULL COMMENT '学生学号',
    ct_section_id bigint unsigned NOT NULL COMMENT '开课ID',
    ct_usual_grade tinyint unsigned NOT NULL DEFAULT '0' COMMENT '平时成绩',
    ct_mid_grade tinyint unsigned NOT NULL DEFAULT '0' COMMENT '期中成绩',
    ct_final_grade tinyint unsigned NOT NULL DEFAULT '0' COMMENT '期末成绩',
    ct_grade tinyint unsigned NOT NULL DEFAULT '0' COMMENT '最终成绩',
    ct_GPA char(3) NOT NULL DEFAULT '0.0' COMMENT '五分制绩点',
    PRIMARY KEY(ct_id),
    CONSTRAINT FOREIGN KEY (`ct_student_id`) REFERENCES `ms_student_info` (`si_id`),
    CONSTRAINT FOREIGN KEY (`ct_section_id`) REFERENCES `ms_course_section` (`cs_id`)
) ENGINE=InnoDB  AUTO_INCREMENT=10000  DEFAULT CHARSET=utf8 COMMENT '学生选课及成绩表';

ALTER TABLE `ms_user_info`
ADD INDEX idx_name(`ui_name`);

ALTER TABLE `ms_student_info`
ADD INDEX idx_name(`si_name`);
