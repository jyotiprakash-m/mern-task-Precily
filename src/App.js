import React, { useState, useEffect } from 'react';
import axios from "axios";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { Modal, Table, Card, Row, Col, Button, message, Popconfirm, Form, Tooltip, Input } from 'antd';
const { TextArea } = Input;


function App() {


  const [addEmployeeForm] = Form.useForm();

  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [employeeId, setEmployeeId] = useState(null)
  const [updateMode, setUpdateMode] = useState(false)

  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDisplayModalVisible, setIsDisplayModalVisible] = useState(false);


  const columns = [
    { title: 'Employee Id', dataIndex: 'empId', key: 'empId' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => <span>{description ? description : "--"}</span>
    },
    {
      title: 'Action',
      dataIndex: '_id',
      key: '_id',
      render: (_id) => <>
        <Tooltip title="View Employee">
          <Button type="text" icon={<EyeOutlined style={{ color: "#337ab7" }} onClick={() => onDisplayEmployee(_id)} />} />
        </Tooltip>
        <Tooltip title="Update Employee">
          <Button type="text" icon={<EditOutlined style={{ color: "#337ab7" }} />} onClick={() => updateEmployee(_id)} />
        </Tooltip>
        <Tooltip title="Delete Employee">
          <Popconfirm
            title="Are you sure to delete this employee?"
            onConfirm={() => deleteEmployee(_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<DeleteOutlined style={{ color: "#ea4335" }} />} />
          </Popconfirm>
        </Tooltip>

      </>,
    },
  ];

  // Initial Api Call

  const fetchEmployees = async () => {
    const res = await axios.get("https://mern-task-jyoti.herokuapp.com/api/employees");
    setEmployees(res.data)
  }
  useEffect(() => {
    fetchEmployees()

  }, [])

  const showFormModal = () => {
    setIsFormModalVisible(true);
  };

  const handleOk = () => {
    setIsFormModalVisible(false);
    setIsDisplayModalVisible(false);
    setEmployee(null)
    setUpdateMode(false)
    setEmployeeId(null)
    addEmployeeForm.resetFields()
  };

  const handleCancel = () => {
    setIsFormModalVisible(false);
    setIsDisplayModalVisible(false);
    setEmployee(null)
    setUpdateMode(false)
    setEmployeeId(null)
    addEmployeeForm.resetFields()
  };

  // Display Employee Modal

  const onDisplayEmployee = async (_id) => {
    // console.log(_id)
    const res = await axios.get("https://mern-task-jyoti.herokuapp.com/api/employees/" + _id);
    setEmployee(res.data);
    setIsDisplayModalVisible(true);
  }


  // Update Employee

  const updateEmployee = async (_id) => {
    const res = await axios.get("https://mern-task-jyoti.herokuapp.com/api/employees/" + _id);
    const employeeData = res.data
    // setEmployee(res.data);
    employeeData && addEmployeeForm.setFieldsValue({
      'empId': employeeData.empId,
      'name': employeeData.name,
      'age': employeeData.age,
      'address': employeeData.address,
      'description': employeeData.description,
    })
    setUpdateMode(true)
    setEmployeeId(_id)
    setIsFormModalVisible(true)
  }

  // Delete Employee

  const deleteEmployee = async (_id) => {

    // console.log(_id)
    try {
      const res = await axios.delete("https://mern-task-jyoti.herokuapp.com/api/employees/" + _id);
      if (res) {
        message.success("Employee deleted successfully")
        fetchEmployees()
      } else {
        message.warning("Something went wrong")
      }
      setIsFormModalVisible(false)
    } catch (err) {
      console.log(err)
    }

  }

  // Submit Form
  const onFinishAddEmployee = async (value) => {
    // console.log(value)
    if (updateMode === true) {
      try {
        const res = await axios.put(`https://mern-task-jyoti.herokuapp.com/api/employees/${employeeId}`, value);
        if (res) {
          message.success('Update Successfully')
          fetchEmployees()
        } else {
          message.warning("Something went wrong")
        }
        // setIsFormModalVisible(false)
        handleCancel()
      } catch (err) {
        console.log(err)
      }

    } else {
      try {
        const res = await axios.post("https://mern-task-jyoti.herokuapp.com/api/employees", value);
        if (res) {
          message.success("Employee data has been added")
          fetchEmployees()
        } else {
          message.warning("Something went wrong")
        }
        // setIsFormModalVisible(false)
        handleCancel()
      } catch (err) {
        console.log(err)
      }
    }

  }



  return (
    <Card title="Employee Details" bordered={false} extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={showFormModal}>
        Employee
      </Button>
    }>

      <Table
        pagination={true}
        key="empId"
        scroll={{ x: 1000 }}
        columns={columns}
        // expandable={{
        //   expandedRowRender: record => <p style={{ margin: 0 }}><strong>Description: </strong>{record.description}</p>,
        // }}
        dataSource={employees ? employees : []}
      />


      {/* Modal for create Employee */}

      <Modal title="Add Employee Details" visible={isFormModalVisible} onOk={handleOk} onCancel={handleCancel} footer={<>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button htmlType="reset" form="addEmployeeForm">Reset</Button>
        <Button key="submit" type="primary" htmlType="submit" form="addEmployeeForm">Save</Button>
      </>} >

        <Form name="addEmployeeForm" form={addEmployeeForm} onFinish={onFinishAddEmployee} scrollToFirstError >
          <Card bordered={false} bodyStyle={{ paddingTop: "0px" }} style={{ paddingBottom: "0px", marginBottom: "0px" }} >
            <Row>
              <Col lg={24} md={24} sm={24} xs={24}>
                <Row gutter={[60, 0]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                      name="empId"
                      rules={[{ required: true, message: 'Employee Id is Required' }]}
                      label="Employee Id">
                      <Input placeholder="Enter the Employee Id" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[60, 0]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: 'Name Id is Required' }]}
                      label="Employee Name">
                      <Input placeholder="Enter the Employee Name" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[60, 0]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                      name="age"
                      rules={[{ required: true, message: 'Age is Required' }]}
                      label="Age">
                      <Input placeholder="Enter the Employee age" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[60, 0]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                      name="address"
                      rules={[{ required: true, message: 'Address is Required' }]}
                      label="Address">
                      <Input placeholder="Enter the Address" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[60, 0]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                      name="description"
                      rules={[{ required: true, message: 'Description is Required' }]}
                      label="Description">
                      <TextArea
                        placeholder="Write description/bio of Employee"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>


        </Form>

      </Modal>

      {/* Display employee details modal */}
      <Modal title="Display Employee Details" visible={isDisplayModalVisible} onCancel={handleCancel} footer={
        <Button onClick={handleCancel}>Cancel</Button>
      } >
        <Row>
          <Col span={24}>
            <Row>
              <Col lg={24} md={24} sm={24} xs={24}>
                <Row gutter={[60, 0]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <p><strong>Employee Id: </strong>{employee && employee.empId}</p>
                  </Col>
                </Row>
                <Row gutter={[60, 0]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <p><strong>Name: </strong>{employee && employee.name}</p>
                  </Col>
                </Row>
                <Row gutter={[60, 0]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <p><strong>Age: </strong>{employee && employee.age}</p>
                  </Col>
                </Row>
                <Row gutter={[60, 0]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <p><strong>Address: </strong>{employee && employee.address}</p>
                  </Col>
                </Row>
                <Row gutter={[60, 0]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <p><strong>Description: </strong>{employee && employee.description}</p>
                  </Col>
                </Row>
              </Col>
            </Row>

          </Col>
        </Row>

      </Modal>
    </Card>
  );
}

export default App;
