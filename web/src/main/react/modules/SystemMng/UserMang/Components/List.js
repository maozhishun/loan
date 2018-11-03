import React from 'react'
import {
  Table,
  Modal,
  Select
} from 'antd';
import AddUserWin from './AddUserWin'
var confirm = Modal.confirm;
const Option = Select.Option;
const objectAssign = require('object-assign');
export default React.createClass({
  getInitialState() {
    return {
      selectedRowKeys: [], // 这里配置默认勾选列
      loading: false,
      data: [],
      pagination: {},
      canEdit: true,
      visible: false,
    };
  },
  componentWillReceiveProps(nextProps, nextState) {
    this.clearSelectedList();
    this.fetch(nextProps.params);
  },
  hideModal() {
    this.setState({
      visible: false,
    });
    this.refreshList();
  },
  //新增跟编辑弹窗
  showModal(title, record, canEdit) {
    var record = record;
    if (title == '编辑' || title == '查看') {
      var record = record;
      if (record.officeOver) {
        record.officeOver = record.officeOver.split(',');
      }
      record.roleId = record.roleId.split(',');
      this.refs.AddUserWin.setFieldsValue(record);
    } else if (title == '新增') {
      record = null
    }
    this.setState({
      canEdit: canEdit,
      visible: true,
      title: title,
      record: record
    }, () => {
      Utils.ajaxData({
        url: '/modules/system/getRoleList.htm',
        data:{
          username:window.roleId
        },
        method: 'get',
        type: 'json',
        callback: (result) => {
          var item=result.data.map((item, index) => {
            return <Option key={item.id} >{item.name}</Option>
          });
          this.setState({
            roleList: item,
          })
        }
      });
    });
  },
  rowKey(record) {
    return record.id;
  },

  //分页
  handleTableChange(pagination, filters, sorter) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.refreshList();
  },
  fetch(params = {}) {
    this.setState({
      loading: true
    });
    if (!params.pageSize) {
      var params = {};
      params = {
        pageSize: 10,
        currentPage: 1,
        parentofficeId: localStorage.officeId,
        userName:window.roleId
      }
    }
    Utils.ajaxData({
      url: '/modules/system/general/getSysUserList.htm',
      data: params,
      callback: (result) => {
        const pagination = this.state.pagination;
        pagination.current = params.currentPage;
        pagination.pageSize = params.pageSize;
        pagination.total = result.totalCount;
        if (!pagination.current) {
          pagination.current = 1
        };
        this.setState({
          loading: false,
          data: result.data,
          pagination
        });
      }
    });
  },
  clearSelectedList() {
    this.setState({
      selectedRowKeys: [],
    });
  },
  refreshList() {
    var pagination = this.state.pagination;
    var params = objectAssign({}, this.props.params, {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      parentofficeId: localStorage.officeId,
      userName:window.roleId
    });
    this.fetch(params);
  },
  changeStatus(title) {
    var me = this;
    var ids = me.state.selectedRowKeys;
    var status;
    var msg = "";
    var tips = "";
    var trueurl = "";
    if (title == "重置密码") {
      msg = '重置成功';
      status = 'editpassword';
      tips = '是否将用户密码改成【123456】？';
      trueurl = "/modules/system/userEditPage.htm";
      confirm({
        title: tips,
        onOk: function () {
          Utils.ajaxData({
            url: trueurl,
            data: {
              ids: ids,
              status: status
            },
            method: 'post',
            callback: (result) => {
              Modal.success({
                title: result.msg,
              });
              me.refreshList();
            }
          });
        },
        onCancel: function () { }
      });
    } else {
      if (title == "锁定") {
        msg = '锁定成功';
        status = 'lock';
        tips = '您是否确定锁定';
        trueurl = "/modules/system/userEditPage.htm"
      } else if (title == "解锁") {
        msg = '解锁成功';
        status = 'unlock';
        tips = '您是否确定解锁';
        trueurl = "/modules/system/userEditPage.htm"
      }
      confirm({
        title: tips,
        onOk: function () {
          Utils.ajaxData({
            url: trueurl,
            data: {
              ids: ids,
              status: status
            },
            method: 'post',
            callback: (result) => {
              Modal.success({
                title: result.msg,
              });
              me.refreshList();
            }
          });
        },
        onCancel: function () { }
      });
    }

  },
  componentDidMount() {
    this.fetch();
  },
  onRowClick(record) {
    var id = record.id;
    var selectedRowKeys = this.state.selectedRowKeys;
    if (selectedRowKeys.indexOf(id) < 0) {
      selectedRowKeys.push(id);
    } else {
      selectedRowKeys.remove(id)
    }
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  },
  //选择
  onSelectAll(selected, selectedRowKeys, selectedRows, changeRows) {
    if (selected) {
      this.setState({
        selectedRowKeys
      })
    } else {
      this.setState({
        selectedRowKeys: []
      })
    }
  },
  render() {
    var me = this;
    const {
      loading,
      selectedRowKeys
    } = this.state;
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelectAll: this.onSelectAll,
    };
    const hasSelected = selectedRowKeys.length > 0;
    var columns = [{
      title: '真实姓名',
      dataIndex: 'name'
    }, {
        title: '用户名称',
        dataIndex: "userName"
      }, {
        title: '工号',
        dataIndex: 'number'
      }, {
        title: '所属部门',
        dataIndex: "officeName"
      }, {
        title: '用户角色',
        dataIndex: "roleName"
      }, {
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => {
          if (text == 0) {
            return <span>正常</span>
          } else if (text == 1) {
            return <span>锁定</span>
          } else {
            return <span></span>
          }
        }
      }, {
        title: '操作',
        dataIndex: "",
        render(text, record) {
          return <div style={{ textAlign: "left" }}><a href="#" onClick={me.showModal.bind(me, '编辑', record, true) }>编辑 </a><a href="#" onClick={me.showModal.bind(me, '查看', record, false) }>查看 </a></div>
        }
      }];
    var state = this.state;
    return (
      <div className="block-panel">
        <div className="actionBtns" style={{ marginBottom: 16 }}>
          <button className="ant-btn" onClick={this.showModal.bind(this, '新增', null, true) }>
            新增
          </button>
          <button className="ant-btn" disabled={!hasSelected} onClick={this.changeStatus.bind(this, '重置密码') }>
            重置密码
          </button>
          <button className="ant-btn" disabled={!hasSelected} onClick={this.changeStatus.bind(this, '锁定') }>
            锁定
          </button>
          <button className="ant-btn" disabled={!hasSelected} onClick={this.changeStatus.bind(this, '解锁') }>
            解锁
          </button>
        </div>
        <Table columns={columns} rowKey={this.rowKey}  size="middle"
          rowSelection={rowSelection}
          onRowClick={this.onRowClick}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}  />
        <AddUserWin ref="AddUserWin"  visible={state.visible}  roleList={this.state.roleList}  title={state.title} hideModal={me.hideModal} record={state.record}
          canEdit={state.canEdit}/>
      </div>
    );
  }
})
