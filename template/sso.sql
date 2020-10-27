/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50643
 Source Host           : localhost
 Source Database       : sso

 Target Server Type    : MySQL
 Target Server Version : 50643
 File Encoding         : utf-8

 Date: 07/21/2020 19:57:19 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `sso_blogs`
-- ----------------------------
DROP TABLE IF EXISTS `sso_blogs`;
CREATE TABLE `sso_blogs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `public` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `sso_calendar_list`
-- ----------------------------
DROP TABLE IF EXISTS `sso_calendar_list`;
CREATE TABLE `sso_calendar_list` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `c_type_id` tinyint(4) NOT NULL,
  `c_desc` varchar(100) DEFAULT NULL,
  `c_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_calendar_list`
-- ----------------------------
BEGIN;
INSERT INTO `sso_calendar_list` VALUES ('1', '1', 'A', '2020-07-10 09:30:47'), ('2', '2', 'B', '2020-07-19 09:31:01'), ('3', '3', 'C', '2020-07-29 09:31:06'), ('4', '2', 'D', '2020-07-19 11:39:00'), ('5', '3', 'rtetert', '2020-07-03 00:00:00'), ('6', '4', 'sdfa', '2020-07-02 00:00:00'), ('7', '1', 'tyrtyrt', '2020-07-04 00:00:00'), ('8', '2', 'sdfsdf', '2020-06-29 00:00:00'), ('9', '2', 'sdfsdf', '2020-06-29 00:00:00'), ('10', '4', 'bitores', '2020-07-26 00:00:00'), ('11', '5', 'sdfs', '2020-07-08 00:00:00'), ('12', '6', 'werwerwe', '2020-07-09 05:06:06'), ('13', '7', 'dsfdsdf', '2020-07-10 05:05:05'), ('14', '3', '刂', '2020-07-22 00:00:00'), ('15', '8', 'yutyu', '2020-07-23 00:00:00'), ('16', '8', '123dsz', '2020-07-23 00:00:00'), ('17', '2', 'ewrew', '2020-07-23 00:00:00'), ('18', '1', 'eqq', '2020-07-23 00:00:00'), ('19', '4', 'weqqq', '2020-07-23 00:00:00');
COMMIT;

-- ----------------------------
--  Table structure for `sso_calendar_type`
-- ----------------------------
DROP TABLE IF EXISTS `sso_calendar_type`;
CREATE TABLE `sso_calendar_type` (
  `id` int(11) NOT NULL,
  `c_desc` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_calendar_type`
-- ----------------------------
BEGIN;
INSERT INTO `sso_calendar_type` VALUES ('1', 'success'), ('2', 'processing'), ('3', 'error'), ('4', 'warning'), ('5', '#f50'), ('6', '#2db7f5'), ('7', '#87d068'), ('8', '#108ee9');
COMMIT;

-- ----------------------------
--  Table structure for `sso_fe_bugs`
-- ----------------------------
DROP TABLE IF EXISTS `sso_fe_bugs`;
CREATE TABLE `sso_fe_bugs` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `sso_fe_performance`
-- ----------------------------
DROP TABLE IF EXISTS `sso_fe_performance`;
CREATE TABLE `sso_fe_performance` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `sso_fe_products`
-- ----------------------------
DROP TABLE IF EXISTS `sso_fe_products`;
CREATE TABLE `sso_fe_products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `sign` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `sso_feps_build`
-- ----------------------------
DROP TABLE IF EXISTS `sso_feps_build`;
CREATE TABLE `sso_feps_build` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `build_man` varchar(50) NOT NULL,
  `build_at` datetime NOT NULL,
  `tag` varchar(20) DEFAULT NULL,
  `is_current` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_feps_build`
-- ----------------------------
BEGIN;
INSERT INTO `sso_feps_build` VALUES ('1', '1', 'hzj', '2020-07-05 19:06:08', '1.0.0', '0'), ('2', '1', 'hzj', '2020-07-05 12:11:28', '1.0.1', '0'), ('3', '2', 'hzj', '2020-07-05 12:11:08', '1.0.0', '1'), ('4', '3', 'hzj', '2020-07-05 12:12:10', '1.0.2', '0'), ('5', '3', 'hzj', '2020-07-05 11:47:11', '1.0.3', '0'), ('6', '3', 'hzj', '2020-07-05 12:12:10', '1.0.4', '1'), ('7', '4', 'hzj', '2020-07-05 14:30:43', '1.0.4', '0'), ('8', '4', 'hzj', '2020-07-05 12:13:00', '1.0.5', '0'), ('9', '4', 'hzj', '2020-07-05 12:13:31', '1.0.6', '0'), ('10', '4', 'hzj', '2020-07-05 14:30:43', '1.0.7', '1'), ('11', '4', 'hzj', '2020-07-05 14:32:50', '1.0.8', '0'), ('12', '1', 'hzj', '2020-07-05 16:13:07', '1.0.2', '0'), ('13', '1', 'hzj', '2020-07-05 19:53:38', '1.0.3', '0'), ('14', '1', 'hzj', '2020-07-05 19:06:21', '1.0.4', '1'), ('15', '1', 'hzj', '2020-07-05 19:06:21', '1.0.5', '0'), ('16', '5', 'root', '2020-07-06 22:39:45', 'master', '1'), ('17', '6', 'hzj@mochongsoft.com', '2020-07-08 13:54:22', '1.0.6', '1'), ('18', '6', 'hzj@mochongsoft.com', '2020-07-08 14:19:47', '1.0.5', '0'), ('19', '7', 'zxj', '2020-07-08 20:55:47', '0.0.6', '1'), ('20', '8', 'hzj@mochongsoft.com', '2020-07-12 15:15:16', '1.0.80', '0'), ('21', '8', 'hzj@mochongsoft.com', '2020-07-12 15:17:09', '1.0.73', '0'), ('22', '8', 'hzj@mochongsoft.com', '2020-07-12 15:17:32', '1.0.70', '0'), ('23', '8', 'hzj@mochongsoft.com', '2020-07-12 15:17:43', '1.0.71', '0'), ('24', '9', 'hzj@mochongsoft.com', '2020-07-17 21:59:27', '1.0.6', '0');
COMMIT;

-- ----------------------------
--  Table structure for `sso_feps_deploy`
-- ----------------------------
DROP TABLE IF EXISTS `sso_feps_deploy`;
CREATE TABLE `sso_feps_deploy` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `deploy_desc` varchar(100) NOT NULL,
  `deploy_at` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deploy_man` varchar(50) NOT NULL,
  `build_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_feps_deploy`
-- ----------------------------
BEGIN;
INSERT INTO `sso_feps_deploy` VALUES ('1', 'test', '2020-07-04 17:21:36', 'hzj', '1'), ('2', 'test', '2020-07-04 17:22:55', 'hzj', '3'), ('3', 'test', '2020-07-04 17:23:06', 'hzj', '1'), ('4', 'a', '2020-07-04 17:49:59', 'hzj', '1'), ('5', 'b', '2020-07-04 17:50:17', 'hzj', '1'), ('6', 'c', '2020-07-04 18:06:32', 'hzj', '1'), ('7', 'gg', '2020-07-04 18:13:11', 'hzj', '2'), ('8', 'd', '2020-07-04 18:20:00', 'hzj', '1'), ('9', 'hh', '2020-07-04 18:30:36', 't', '1'), ('10', 'y', '2020-07-04 18:30:47', 'e', '2'), ('11', 'adsf--', '2020-07-04 19:24:39', 'hzj', '2'), ('12', 'yyy', '2020-07-05 11:48:32', 't', '6'), ('13', '32', '2020-07-05 11:48:58', 'sf', '6'), ('14', '767', '2020-07-05 11:56:23', 'hzj', '5'), ('15', 'yy', '2020-07-05 12:07:26', 'hzj', '7'), ('16', 'yt', '2020-07-05 12:08:00', 'hzj', '7'), ('17', 'adsf', '2020-07-05 12:09:29', 'hzj', '4'), ('18', 'a', '2020-07-05 12:11:08', 'hzj', '3'), ('19', 'uy', '2020-07-05 12:11:18', 'hzj', '2'), ('20', '12', '2020-07-05 12:11:28', 'hzj', '1'), ('21', 'b', '2020-07-05 12:12:10', 'hzj', '6'), ('22', '测试功能', '2020-07-05 14:30:43', 'hzj', '10'), ('23', 'adsf', '2020-07-05 19:06:08', 'hzj', '15'), ('24', 'adsf', '2020-07-05 19:06:21', 'hzj', '14'), ('25', 'adsf', '2020-07-05 19:08:01', 'hzj', '15'), ('26', 'adsf', '2020-07-06 19:58:26', 'hzj', '14'), ('27', 'a', '2020-07-06 19:58:34', 'hzj', '15'), ('28', 'sdf', '2020-07-08 10:00:08', 'asd', '16'), ('29', 'asdf', '2020-07-08 10:00:35', 'hzj', '14'), ('30', 'asdf', '2020-07-08 10:00:52', 'hzj', '13'), ('31', 'asdasdf', '2020-07-08 10:01:45', 'hzj', '15'), ('32', 'aaaaaaaaaaaaaaa', '2020-07-08 10:01:55', 'hzj', '13'), ('33', '功能描述：\n1.新增主体\n2.删除lll\n3.优化加载功能', '2020-07-08 10:03:44', 'hzj', '14'), ('34', 'test', '2020-07-08 14:20:26', 'hzj', '18'), ('35', 'test', '2020-07-08 14:20:43', 'hzj', '17'), ('37', 'ggf', '2020-07-09 08:11:06', 'hzj', '19'), ('38', 'sdfsdf', '2020-07-09 09:26:34', 'hzj', '19'), ('39', 'sdf', '2020-07-09 09:30:10', 'hzj', '19'), ('40', 'dsfdf', '2020-07-09 09:34:54', 'hzj', '19'), ('41', 'jj', '2020-07-09 09:39:25', 'hzj', '19'), ('42', 'sdfsd', '2020-07-09 09:52:06', 'hzj', '19'), ('43', 'erter', '2020-07-09 21:50:12', 'hzj', '19'), ('44', 'sdfsd', '2020-07-09 21:52:44', 'hzj', '19'), ('45', 'fhh', '2020-07-09 22:15:09', 'hzj', '19'), ('46', 'asdf', '2020-07-09 22:26:50', 'hzj', '19'), ('47', 'sdfsd', '2020-07-09 22:43:42', 'hzj', '19'), ('48', 'fsdfsd', '2020-07-09 23:05:01', 'hzj', '19'), ('49', 'sdfds', '2020-07-10 14:15:54', 'hzj', '19'), ('50', 'asfd', '2020-07-10 14:23:34', 'hzj', '19'), ('51', 'asfd', '2020-07-10 14:23:34', 'hzj', '19'), ('52', 'sdf', '2020-07-10 14:23:48', 'hzj', '19'), ('53', 'sdfsad', '2020-07-10 14:38:29', 'hzj', '19'), ('54', 'sdfdf', '2020-07-10 16:10:27', 'hzj', '19');
COMMIT;

-- ----------------------------
--  Table structure for `sso_feps_products`
-- ----------------------------
DROP TABLE IF EXISTS `sso_feps_products`;
CREATE TABLE `sso_feps_products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_feps_products`
-- ----------------------------
BEGIN;
INSERT INTO `sso_feps_products` VALUES ('1', 'p1'), ('2', 'p2'), ('3', 'fe/test'), ('4', 'fe/act'), ('5', 'test'), ('6', 'admin-promotion'), ('7', 'ci-test'), ('8', 'help'), ('9', 'admin-ceo');
COMMIT;

-- ----------------------------
--  Table structure for `sso_menus`
-- ----------------------------
DROP TABLE IF EXISTS `sso_menus`;
CREATE TABLE `sso_menus` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `menu_name` varchar(50) DEFAULT NULL,
  `menu_path` varchar(100) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `menu_component` varchar(200) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `product_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_menus`
-- ----------------------------
BEGIN;
INSERT INTO `sso_menus` VALUES ('1', 'users', '用户管理', '/users', 'user', '', '0', '1'), ('2', 'org', '用户池', '/users/index', null, '/manager/users/index', '1', '1'), ('3', 'product', '项目用户', '/users/product', null, '/manager/users/product', '1', '1'), ('5', 'roles', '角色管理', '/roles', null, '', '0', '1'), ('6', 'products', '项目管理', '/products', null, '/manager/products/index', '0', '1'), ('7', 'org', '角色池', '/roles/index', null, '/manager/roles/index', '5', '1'), ('8', 'product', '项目角色', '/roles/product', null, '/manager/roles/product', '5', '1'), ('9', 'menus', '菜单管理', '/menus', null, '', '0', '1'), ('10', 'product', '项目菜单', '/menus/product', null, '/manager/menus/index', '9', '1');
COMMIT;

-- ----------------------------
--  Table structure for `sso_product_roles`
-- ----------------------------
DROP TABLE IF EXISTS `sso_product_roles`;
CREATE TABLE `sso_product_roles` (
  `product_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_product_roles`
-- ----------------------------
BEGIN;
INSERT INTO `sso_product_roles` VALUES ('1', '1'), ('1', '3'), ('1', '12'), ('10', '2'), ('10', '5'), ('11', '2'), ('11', '5');
COMMIT;

-- ----------------------------
--  Table structure for `sso_product_user_role`
-- ----------------------------
DROP TABLE IF EXISTS `sso_product_user_role`;
CREATE TABLE `sso_product_user_role` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`,`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_product_user_role`
-- ----------------------------
BEGIN;
INSERT INTO `sso_product_user_role` VALUES ('1', '1', '1'), ('1', '2', '10'), ('1', '2', '11');
COMMIT;

-- ----------------------------
--  Table structure for `sso_products`
-- ----------------------------
DROP TABLE IF EXISTS `sso_products`;
CREATE TABLE `sso_products` (
  `id` tinyint(4) unsigned NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) NOT NULL,
  `product_alias` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_products`
-- ----------------------------
BEGIN;
INSERT INTO `sso_products` VALUES ('1', '权限系统', 'SYS_ADMIN'), ('10', '前端配置系统', 'SYS_FE'), ('11', '前端发布系统', 'SYS_FE_DEPLOY');
COMMIT;

-- ----------------------------
--  Table structure for `sso_roles`
-- ----------------------------
DROP TABLE IF EXISTS `sso_roles`;
CREATE TABLE `sso_roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `role_alias` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_roles`
-- ----------------------------
BEGIN;
INSERT INTO `sso_roles` VALUES ('1', '超级管理员', 'SUPER_ADMIN'), ('2', '项目管理员', 'PROD_ADMIN'), ('3', '人事主管', 'ORG_ADMIN'), ('5', '普通员工', 'EMPLOYEE'), ('12', '前端发布人员', 'FE_DEPLOY');
COMMIT;

-- ----------------------------
--  Table structure for `sso_tool_qr`
-- ----------------------------
DROP TABLE IF EXISTS `sso_tool_qr`;
CREATE TABLE `sso_tool_qr` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `slut` varchar(32) NOT NULL,
  `url` varchar(200) DEFAULT NULL,
  `qr_desc` varchar(255) DEFAULT NULL,
  `at` datetime DEFAULT NULL,
  `qr_class` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_tool_qr`
-- ----------------------------
BEGIN;
INSERT INTO `sso_tool_qr` VALUES ('1', 'asdfasd', 'https://s.factorymart1.com/code', '小cx', '2020-07-20 21:01:57', null), ('2', 'sdaaa', 'https://baidu.com', '草料', '2020-07-19 21:25:24', null), ('3', '3ccbd6e0-ca8e-11ea-b8cb-893b05f4', 'https://baidu.com', '后台', null, null), ('4', '5ebe5480-ca8e-11ea-8987-1bf04305', 'https://bkimg.cdn.bcebos.com/pic/5bafa40f4bfbfbed24c6677078f0f736afc31f25?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg', '送你 54 道 JavaScript 面试题', '2020-07-20 21:39:01', null), ('5', '82b02490-ca8e-11ea-8987-1bf04305', 'http://172.17.0.209:1030/webhook/bitbucket', 'webhook', '2020-07-20 21:40:01', null);
COMMIT;

-- ----------------------------
--  Table structure for `sso_tool_schedule`
-- ----------------------------
DROP TABLE IF EXISTS `sso_tool_schedule`;
CREATE TABLE `sso_tool_schedule` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `t_type` tinyint(4) NOT NULL,
  `t_timer` varchar(255) NOT NULL,
  `t_desc` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_tool_schedule`
-- ----------------------------
BEGIN;
INSERT INTO `sso_tool_schedule` VALUES ('13', 'aa', '4cdf1e70-c90d-11ea-8f73-1f2685f1eec3', '2', '2020-07-18T15:25:20.087Z', 'rrr'), ('14', 'bitores988', '68674e60-c90d-11ea-8f73-1f2685f1eec3', '2', '2020-07-18T15:45:07.216Z', null);
COMMIT;

-- ----------------------------
--  Table structure for `sso_users`
-- ----------------------------
DROP TABLE IF EXISTS `sso_users`;
CREATE TABLE `sso_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `real_name` varchar(50) DEFAULT NULL,
  `cdcard` varchar(20) DEFAULT NULL,
  `mobile` varchar(11) DEFAULT NULL,
  `in_time` datetime DEFAULT NULL,
  `out_time` datetime DEFAULT NULL,
  `is_in` tinyint(1) DEFAULT NULL,
  `login_name` varchar(50) NOT NULL,
  `login_pwd` varchar(50) NOT NULL,
  `login_count` int(11) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `sso_users`
-- ----------------------------
BEGIN;
INSERT INTO `sso_users` VALUES ('1', '黄政杰', '111111119', '15955555827', '2020-06-25 10:08:06', null, '1', 'hzj', '8a47929d296938bf45a8fe39b884d8a86535144d', '0', '3099e40ae1858511de58330cc98ef0914ae5d5d78eec45f75f6772001842'), ('9', 'A', '131231231', '15925611828', null, null, null, 'abc', 'b2174265897b47700c7bc79c8fa8b373a9bba241', null, '991b758377ae2be9e79b712325af3e0f211a512313a0f54fac3a759a379c'), ('10', 'B', '1312312312', '15925611829', null, null, null, 'abcd', '6d81455a4bc5e550bcb7be0da98188f539ea9eff', null, '2b3347262d72fceef4c60c85dbf0de4d64a399c6c1a33518892f466da480'), ('11', 'C', '1312312314', '15925611820', null, null, null, 'abcde', '6854e6e3a9d5726f5db05436a5da57f78cd10231', null, '209c76ce39815ec497b3f604c437a4c6a7fcabb22aa2ec63e9af1b635c92');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
