CREATE TABLE `hous_mortgage_registration` (
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号id',
	`creator` int(11) DEFAULT NULL COMMENT '创建人',
	`create_time` datetime DEFAULT NULL COMMENT '创建时间',
	`modifier` int(11) DEFAULT NULL COMMENT '修改者',
	`modify_time` datetime DEFAULT NULL COMMENT '修改时间',
	`is_delete` tinyint(4) unsigned zerofill DEFAULT NULL COMMENT '0不删除1已删除',
	`process_instance_id` varchar(64) DEFAULT NULL COMMENT '流程ID',
	`project_id` int(11) DEFAULT NULL COMMENT '项目编号',
	`mortgage` tinyint(4) DEFAULT NULL COMMENT '有无抵押',
	`seizure` tinyint(4) DEFAULT NULL COMMENT '有无查封',
	`business_occupancy` tinyint(4) DEFAULT NULL COMMENT '有无业务占用',
	`net_signed_occupancy` tinyint(4) DEFAULT NULL COMMENT '有无网签占用',
	`credit_card_number` varchar(32) DEFAULT NULL COMMENT '卡号',
	`bank_account` varchar(64) DEFAULT NULL COMMENT '开户行',
	`account_opening` varchar(64) DEFAULT NULL COMMENT '开户网点',
	`charge_number` varchar(64) DEFAULT NULL COMMENT '押品编号',
	`his_right_certificate` varchar(64) DEFAULT NULL COMMENT '他项权利证名称(即解押押品名称)',
	`mortgage_right` varchar(64) DEFAULT NULL COMMENT '抵押权人',
	`client` varchar(64) DEFAULT NULL COMMENT '委托人',
	`collection_time` datetime DEFAULT NULL COMMENT '领取时间(即解押押品入库时间)',
	`registered_person` varchar(64) DEFAULT NULL COMMENT '登记人(即解押入库人)',
	`outbound_collection_time` datetime DEFAULT NULL COMMENT '押品出库时间',
	`outbound_person` varchar(50) DEFAULT NULL COMMENT '出库人',
	`remark` varchar(255) DEFAULT NULL COMMENT '备注',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='抵押登记表';