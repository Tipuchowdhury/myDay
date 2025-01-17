import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  CardTitle,
  Table,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// action
import {
  apiError,
  registerUserInManager,
  registerUser,
  registerUserFailed,
  registerStatusClear,
  addCompanyRegister,
  companyListRegister,
  companyAddFreshRegister,
  companyListFreshRegister,
  userList,
  deleteUserData,
  userDeleteFresh,
  updateUserData,
  userGetInfo,
  userUpdateFresh,
  userInfoFresh,
} from "../../store/actions";
import { roleList } from "store/ACL/Role/actions";

// Redux
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// import images
import profileImg from "../../assets/images/profile-img.png";
import logoImg from "../../assets/images/logo.svg";
import toastr from "toastr";
import Select from "react-select";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const AdminRegister = props => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    email: "",
    password: "",
    confirm_password: "",
    fname: "",
    lname: "",
    work_phone: "",
    mobile_phone: "",
    user_type: "Property Manager",
    company_name: "",
    customer_type: "Property Manager",
    role: "",
    loader: false,
  });
  const {
    email,
    password,
    confirm_password,
    fname,
    lname,
    work_phone,
    mobile_phone,
    user_type,
    company_name,
    customer_type,
    role,
  } = state;
  const [editState, setEditState] = useState({
    id: "",
    fname: "",
    lname: "",
    user_type: "",
    work_phone: "",
    mobile_phone: "",
    company_name: "",
    address: "",
  });
  const data = {
    fname: editState.fname,
    lname: editState.lname,
    work_phone: editState.work_phone,
    mobile_phone: editState.mobile_phone,
    user_type: editState.user_type,
    address: editState.address,
  };
  const ref = useRef();
  const [companyForm, setCompanyForm] = useState(false);
  const [phone, setPhone] = useState({ mobile_phone: null, work_phone: null });
  const [userUpdateForm, setUserUpdateForm] = useState(false);
  const [togState, setTogState] = useState(false);
  const [togUserState, setTogUserState] = useState(false);
  const [route, setRoute] = useState();
  const [selectedGroup, setSelectedGroup] = useState();
  const [selectedUserUpdateGroup, setSelectedUserUpdateGroup] = useState();
  const [editFormStatus, setEditFormStatus] = useState(false);
  const [modal, setModal] = useState(false);
  const [init, setInit] = useState(true);

  const toggle = () => setModal(!modal);

  if (init) {
    props.roleList();
    props.userList();
    setInit(false);
  }

  useEffect(() => {
    if (props.loading === "Success") {
      setState({ ...state, loader: false });
      toastr.success("Registration Successfull");
      props.registerStatusClear();
      setState({
        email: "",
        password: "",
        confirm_password: "",
        fname: "",
        lname: "",
        work_phone: "",
        mobile_phone: "",
        user_type: "",
        company_name: "",
      });
      props.userList();
    } else if (props.loading === "Faild") {
      toastr.error(props.registrationError.message);
      props.registerStatusClear();
    }

    if (props.user_delete_loading == "Success") {
      props.userList();
      props.userDeleteFresh();
      toastr.success("Success");
    }
    if (props.user_info_data) {
      setEditState({
        ...editState,
        id: props.user_info_data.data.id,
        fname: props.user_info_data.data.first_name,
        lname: props.user_info_data.data.last_name,
        work_phone: props.user_info_data.data.work_phone,
        mobile_phone: props.user_info_data.data.mobile_phone,
        user_type: props.user_info_data.data.user_type,
        address: props.user_info_data.data.address,
      });
    }

    if (props.user_update_loading == "Success") {
      props.userList();
      props.userUpdateFresh();
      toastr.success("User Updated Successfully");
    }
  }, [props]);

  const handleregistrationFormValues = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const emptyFormValues = () => {
    useState({
      id: "",
      fname: "",
      lname: "",
      user_type: "",
      work_phone: "",
      mobile_phone: "",
      company_name: "",
    });
  };

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
    //  console.log(state);
    if (e.target.name == "user_type" && e.target.value == "Property Manager") {
      setCompanyForm(true);
      props.companyListRegister();
    } else if (
      e.target.name == "user_type" &&
      e.target.value != "Property Manager"
    ) {
      setCompanyForm(false);
    }
  };

  const handleUserUpdate = e => {
    setEditState(prevEditState => ({
      ...prevEditState,
      user_type: e.target.value,
    }));
    if (e.target.name == "user_type" && e.target.value == "Property Manager") {
      setUserUpdateForm(true);
      props.companyListRegister();
    } else if (
      e.target.name == "user_type" &&
      e.target.value != "Property Manager"
    ) {
      setUserUpdateForm(false);
    }
  };

  //========== role data =============
  let userRoles = undefined;
  if (props.role_list_data) {
    userRoles = props.role_list_data?.data?.roles?.map((item, key) => (
      <option key={key} value={item.id}>
        {item.name}
      </option>
    ));
  }
  var companyData = undefined;
  var optionGroup = [];
  if (props.company_list_data) {
    let option = [];
    companyData = props.company_list_data.data.data.companies.map(
      (item, key) => {
        let menuObj = {
          label: item.company_name,
          value: item.id,
        };

        option.push(menuObj);
      }
    );
    optionGroup = [
      {
        options: option,
      },
    ];
  }

  const tog_standard = route => {
    setTogState(prevTogState => !prevTogState);
    setRoute(route);
  };
  const edit_user_list_toggle = () => {
    setTogUserState(prevTogUserState => !prevTogUserState);
    setEditFormStatus(false);
    setUserUpdateForm(false);
    // props.userInfoFresh();
  };
  const tog_user_standard = event => {
    setEditFormStatus(true);
    let id = event.target.getAttribute("data-id");
    setTogUserState(prevTogUserState => !prevTogUserState);
    if (id) props.userGetInfo(id);
  };

  const handleSelectGroup = selectedGroup => {
    setSelectedGroup(selectedGroup);
    setState({ ...state, company_name: selectedGroup.value });
  };
  const handleSelectUserUpdateGroup = selectedUserUpdateGroup => {
    setSelectedUserUpdateGroup(selectedUserUpdateGroup);
    setEditState({ ...editState, company_name: selectedUserUpdateGroup.value });
  };

  if (props.company_add_loading === "Success") {
    toastr.success("Your Company Added Successfully");
    props.companyAddFreshRegister();
    props.companyListRegister();
  } else if (props.company_add_loading === "Success") {
    toastr.error("Your Company Added Failed");
    props.companyAddFreshRegister();
  }

  var userData;
  if (props.user_list_data) {
    userData = props.user_list_data?.data?.map((item, key) => {
      if (key > 0) {
        return (
          <tr key={key}>
            <th scope="row">{key}</th>
            <td>{item?.first_name + " " + item?.last_name}</td>
            <td>{item?.email}</td>
            <td>{item?.user_type}</td>
            <td>{item?.roles?.[0]?.role?.name}</td>
            <td></td>
            <td></td>
            <td>
              <button
                type="submit"
                className="btn btn-info w-md"
                onClick={tog_user_standard}
                data-id={item.id}
              >
                <i className="fas fa-user-edit me-1" />
                Edit
              </button>
            </td>
          </tr>
        );
      }
    });
  }
  const handleRegisterForm = e => {
    e.preventDefault();
    setState({ ...state, loader: true });
    props.registerUserInManager(state, phone);
    setPhone({ mobile_phone: null, work_phone: null });
    setModal(!modal);
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          {/* <Breadcrumbs title="Users" breadcrumbItem="Register" /> */}
          <h4 className="ms-2 text-primary">User List</h4>
          <Row>

            <Col lg={2} style={{ display: "flex", flexDirection: "column" }}>
              <Card style={{ borderRadius: "15px" }}>
                <CardBody className="py-4">
                  <Button
                    //type="button"
                    className="btn btn-info mb-3 d-flex justify-content-between align-items-center w-100"
                    onClick={toggle}

                    color={
                      modal
                        ? "buttonColor"
                        : "buttonColor"
                    }

                  >
                    Add User  <i className="bx bx-plus-circle font-size-18 align-middle ms-2" />
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col lg={10}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">User List</CardTitle>

                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Type</th>
                          <th>Role</th>
                          <th>Bills</th>
                          <th>Invoice</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{userData}</tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal isOpen={togState} toggle={tog_standard}>
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Module Routes
              </h5>
              <button
                type="button"
                onClick={() => setTogState(false)}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Row>
                <Col lg={12}>
                  <div className="p-2">
                    {props.error ? (
                      <Alert color="danger">
                        {JSON.stringify(props.error.response.data.message)}
                      </Alert>
                    ) : null}
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        company: (state && state.company) || "",
                        address: (state && state.address) || "",
                        phone: (state && state.phone) || "",
                      }}
                      validationSchema={Yup.object().shape({
                        company: Yup.string().required("Please Enter Company"),
                        address: Yup.string().required("Please Enter Address"),
                        phone: Yup.string().required("Please Enter Phone"),
                      })}
                      onSubmit={(values, onSubmitProps) => {
                        props.addCompanyRegister(values);
                        onSubmitProps.resetForm();
                        setTogState(false);
                      }}
                    >
                      {({ errors, status, touched }) => (
                        <Form className="form-horizontal">
                          <div className="mb-3">
                            <Label for="company" className="form-label">
                              Company
                            </Label>
                            <Field
                              name="company"
                              type="text"
                              className={
                                "form-control" +
                                (errors.company && touched.company
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="company"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                          <div className="mb-3">
                            <Label for="address" className="form-label">
                              Address
                            </Label>
                            <Field
                              name="address"
                              type="text"
                              className={
                                "form-control" +
                                (errors.address && touched.address
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="address"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                          <div className="mb-3">
                            <Label for="phone" className="form-label">
                              Phone
                            </Label>
                            <Field
                              name="phone"
                              type="text"
                              className={
                                "form-control" +
                                (errors.phone && touched.phone
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="phone"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                          <div className="mt-3">
                            <button className="btn btn-info w-md" type="submit">
                              Submit
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={tog_standard}
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </Modal>
          {editFormStatus && (
            <Modal isOpen={togUserState} toggle={tog_user_standard}>
              <div className="modal-header" style={{ backgroundColor: "#153D58" }}>

                <div style={{ display: "flex", justifyContent: "space-between", width: "460px", marginTop: "10px" }}>
                  <div>
                    <span className="text-white"> Update User</span>
                  </div>
                  <i className="mdi mdi-close-thick font-size-20 text-white" onClick={edit_user_list_toggle} style={{ cursor: "pointer" }}></i>
                </div>
              </div>

              <div className="modal-body" style={{ backgroundColor: "#F2F6FA" }}>
                <Row>
                  <Col lg={12}>
                    <div className="p-2">

                      <Formik
                        innerRef={ref}
                        enableReinitialize={true}
                        initialValues={{
                          userid: (editState && editState.id) || "",
                          user_fname: (editState && editState.fname) || "",
                          user_lname: (editState && editState.lname) || "",
                          user_user_type:
                            (editState && editState.user_type) || "",
                          user_work_phone:
                            (editState && editState.work_phone) || "",
                          user_mobile_phone:
                            (editState && editState.mobile_phone) || "",
                          company_name:
                            (editState && editState.company_name) || "",
                          address: (editState && editState.address) || "",
                        }}
                        validationSchema={Yup.object().shape({
                          user_fname: Yup.string().required(
                            "Please Enter Valid First Name"
                          ),
                          user_lname: Yup.string().required(
                            "Please Enter Valid Last Name"
                          ),
                        })}
                        onSubmit={(values, onSubmitProps) => {
                          console.log(values);
                          dispatch(updateUserData(values));
                          setUserUpdateForm(false);
                          setTogUserState(false);
                        }}
                      >
                        {({ errors, status, touched }) => (
                          <Form className="form-horizontal">
                            <Row>
                              <Col md={6} lg={6} xl={6}>
                                <div className="form-group-new" >
                                  <Field
                                    name="user_fname"
                                    type="text"
                                    value={data.fname}
                                    onChange={event => {
                                      setEditState(prevEditState => ({
                                        ...prevEditState,
                                        fname: event.target.value,
                                      }));
                                    }}
                                    className={
                                      "form-control" +
                                      (errors.user_fname && touched.user_fname
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <label htmlFor="usr"> First Name</label>
                                  <ErrorMessage
                                    name="user_fname"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col md={6} lg={6} xl={6}>
                                <div className="form-group-new">
                                  <Field
                                    name="user_lname"
                                    type="text"
                                    value={data.lname}
                                    onChange={event => {
                                      setEditState(prevEditState => ({
                                        ...prevEditState,
                                        lname: event.target.value,
                                      }));
                                    }}
                                    className={
                                      "form-control" +
                                      (errors.user_lname && touched.user_lname
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <label htmlFor="usr"> Last Name</label>
                                  <ErrorMessage
                                    name="user_lname"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6} lg={6} xl={6}>
                                <div className="form-group-new" >
                                  <Field
                                    name="user_user_type"
                                    className={
                                      "form-control" +
                                      (errors.user_user_type &&
                                        touched.user_user_type
                                        ? " is-invalid"
                                        : "")
                                    }
                                    value={data.user_type}

                                  >

                                  </Field>
                                  <ErrorMessage
                                    name="user_user_type"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                  <label htmlFor="usr">  Customer Type</label>
                                </div>
                              </Col>
                              <Col md={6} lg={6} xl={6}>
                                <div className="form-group-new" >
                                  {/* <Label for="address" className="form-label">
                                    Address
                                  </Label> */}
                                  <Field
                                    name="address"
                                    type="text"
                                    value={data.address}
                                    onChange={event => {
                                      setEditState(prevEditState => ({
                                        ...prevEditState,
                                        address: event.target.value,
                                      }));
                                    }}
                                    className={
                                      "form-control" +
                                      (errors.address && touched.address
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="address"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                  <label>Address</label>
                                </div>
                              </Col>
                            </Row>
                            {userUpdateForm ? (
                              <Row>
                                <Col md={6} lg={6} xl={6}>
                                  <div className="mb-3">
                                    <Label
                                      for="company_name"
                                      className="form-label"
                                    >
                                      Company Name
                                    </Label>
                                    {optionGroup != [] ? (
                                      <Select
                                        value={selectedUserUpdateGroup}
                                        onChange={handleSelectUserUpdateGroup}
                                        options={optionGroup}
                                        classNamePrefix="select2-selection"
                                      />
                                    ) : null}
                                    <ErrorMessage
                                      name="company_name"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                </Col>
                                <Col md={6} lg={6} xl={6}>
                                  <div className="mt-4">
                                    <button
                                      className="btn btn-info w-md"
                                      type="button"
                                      onClick={tog_standard}
                                    >
                                      Add Company
                                    </button>
                                  </div>
                                </Col>
                              </Row>
                            ) : null}
                            <Row>
                              <Col md={12}>
                                <div className="form-group-new" >
                                  <PhoneInput
                                    country={"au"}
                                    value={data.mobile_phone}
                                    onChange={value =>
                                      setEditState(prevEditState => ({
                                        ...prevEditState,
                                        mobile_phone: value,
                                      }))
                                    }

                                  />
                                  <label htmlFor="usr">Mobile Phone</label>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <div className="form-group-new" >

                                  <PhoneInput
                                    country={"au"}
                                    value={data.work_phone}
                                    onChange={value =>
                                      setEditState(prevEditState => ({
                                        ...prevEditState,
                                        work_phone: value,
                                      }))
                                    }
                                  />
                                  <label htmlFor="usr">Work Phone</label>
                                </div>
                              </Col>
                            </Row>
                            <div className="mt-3 d-flex justify-content-end">
                              <button
                                className="btn btn-buttonColor w-md"
                                type="submit"
                              >
                                Submit
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </Col>
                </Row>
              </div>
            </Modal>
          )}

          {/* ============== Register user modal starts from here ================ */}
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader style={{ backgroundColor: "#6E62E5" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "460px", marginTop: "10px" }}>
                <div>
                  <span className="text-white">Register User</span>
                </div>
                <i className="mdi mdi-close-thick font-size-20 text-white" onClick={toggle} style={{ cursor: "pointer" }}></i>
              </div>
            </ModalHeader>
            <ModalBody style={{ backgroundColor: "#F2F6FA" }}>

              <div className="p-2 ">
                <Formik
                  innerRef={ref}
                  enableReinitialize={true}
                  initialValues={{
                    email: (state && state.email) || "",
                    password: (state && state.password) || "",
                    confirm_password:
                      (state && state.confirm_password) || "",
                    fname: (state && state.fname) || "",
                    lname: (state && state.lname) || "",
                    //customer_type: (state && state.customer_type) || "",
                    // work_phone: (state && state.work_phone) || "",
                    // mobile_phone: (state && state.mobile_phone) || "",
                    user_type: (state && state.user_type) || "",
                    //company_name: (state && state.company_name) || "",
                    role: (state && state.role) || "",
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .email("Invalid Email Formet")
                      .required("Please Enter Your Email"),
                    password: Yup.string()
                      .required("Please Enter Valid Password")
                      .min(8, "Too Short!"),
                    confirm_password: Yup.string()
                      .oneOf(
                        [Yup.ref("password"), ""],
                        "Password Must Match"
                      )
                      .required("Please Confirm Your Password"),
                    fname: Yup.string().required(
                      "Please Enter Valid First Name"
                    ),
                    lname: Yup.string()
                      .required("Please Enter Valid Last Name")
                      .min(2, "Too Short!"),
                    user_type: Yup.string().required(
                      "Please Select User Type"
                    ),
                    role: Yup.string().required("Please Select a role"),
                    // customer_type: Yup.string().required(
                    //   "Please Select a customer_type"
                    // ),
                  })}
                  onSubmit={(values, onSubmitProps) => { }}
                >
                  {({ errors, status, touched }) => (
                    <Form
                      className="form-horizontal"
                      onSubmit={handleRegisterForm}
                    >
                      <Row className="mt-3">
                        <Col md={6} lg={6} xl={6}>
                          <div className="form-group-new" style={{ marginBottom: "-15px" }}>

                            <Field
                              name="fname"
                              type="text"
                              className={
                                "form-control" +
                                (errors.fname && touched.fname
                                  ? " is-invalid"
                                  : "")
                              }
                              value={state.fname}
                              onChange={handleregistrationFormValues}
                            />

                            <ErrorMessage
                              name="fname"
                              component="div"
                              className="invalid-feedback"
                            />
                            <label htmlFor="usr"> First Name</label>
                          </div>
                        </Col>
                        <Col md={6} lg={6} xl={6}>
                          <div className="form-group-new">
                            {/* <Label for="lname" className="form-label">
                              Last Name
                            </Label> */}
                            <Field
                              name="lname"
                              type="text"
                              className={
                                "form-control" +
                                (errors.lname && touched.lname
                                  ? " is-invalid"
                                  : "")
                              }
                              value={state.lname}
                              onChange={handleregistrationFormValues}
                            />

                            <ErrorMessage
                              name="lname"
                              component="div"
                              className="invalid-feedback"
                            />
                            <label htmlFor="usr">Last Name</label>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12} lg={12} xl={12}>
                          <div className="form-group-new" >
                            {/* <Label for="email" className="form-label">
                              Email
                            </Label> */}
                            <Field
                              name="email"
                              type="email"
                              className={
                                "form-control" +
                                (errors.email && touched.email
                                  ? " is-invalid"
                                  : "")
                              }
                              value={state.email}
                              onChange={handleregistrationFormValues}
                            />

                            <ErrorMessage
                              name="email"
                              component="div"
                              className="invalid-feedback"
                            />
                            <label htmlFor="usr">Email</label>
                          </div>
                        </Col>

                      </Row>

                      <Row>
                        <Col md={12} lg={12} xl={12}>
                          <div className="form-group-new">
                            {/* <label className="form-label">Role</label> */}

                            <select
                              name="role"
                              className={
                                "form-control" +
                                (errors.role && touched.role
                                  ? " is-invalid"
                                  : "")
                              }
                              value={state.role}
                              onChange={handleregistrationFormValues}
                            >
                              <option value={""}>Select Role</option>
                              {userRoles}
                            </select>

                            <ErrorMessage
                              name="role"
                              component="div"
                              className="invalid-feedback"
                            />
                            <label htmlFor="usr">Role</label>
                          </div>
                        </Col>
                      </Row>

                      {companyForm ? (
                        <Row>
                          <Col md={8} lg={8} xl={8}>
                            <div className="form-group-new">

                              {optionGroup != [] ? (
                                <Select
                                  value={selectedGroup}
                                  onChange={handleSelectGroup}
                                  options={optionGroup}
                                  classNamePrefix="select2-selection"
                                />
                              ) : null}

                              <ErrorMessage
                                name="company_name"
                                component="div"
                                className="invalid-feedback"
                              />
                              <label htmlFor="usr"> Company Name</label>
                            </div>
                          </Col>
                          <Col md={4} lg={4} xl={4}>
                            <div className="align-items-center">
                              <button
                                className="btn btn-info w-md"
                                type="button"
                                onClick={tog_standard}
                              >
                                Add Company
                              </button>
                            </div>
                          </Col>
                        </Row>
                      ) : null}
                      <Row>
                        <Col md={12}>
                          <div className="form-group-new" style={{ marginBottom: "-15px" }}>


                            <PhoneInput
                              country={"au"}
                              value={phone.mobile_phone}
                              onChange={value =>
                                setPhone({ ...phone, mobile_phone: value })
                              }
                            />
                            <label htmlFor="usr"> Mobile Phone</label>
                          </div>
                        </Col>

                      </Row>
                      <Row>
                        <Col md={12}>
                          <div className="form-group-new" >


                            <PhoneInput
                              country={"au"}
                              value={phone.work_phone}
                              onChange={value =>
                                setPhone({ ...phone, work_phone: value })
                              }
                              className="mt-2"
                            // style={{width: '100%'}}
                            />
                            <label htmlFor="usr">Work Phone</label>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6} lg={6} xl={6}>
                          <div className="form-group-new" >

                            <Field
                              name="password"
                              autoComplete="true"
                              type="password"
                              className={
                                "form-control" +
                                (errors.password && touched.password
                                  ? " is-invalid"
                                  : "")
                              }
                              value={state.password}
                              onChange={handleregistrationFormValues}
                            />

                            <ErrorMessage
                              name="password"
                              component="div"
                              className="invalid-feedback"
                            />
                            <label htmlFor="usr">Password</label>
                          </div>
                        </Col>
                        <Col md={6} lg={6} xl={6}>
                          <div className="form-group-new" >

                            <Field
                              name="confirm_password"
                              autoComplete="true"
                              type="password"
                              className={
                                "form-control" +
                                (errors.confirm_password &&
                                  touched.confirm_password
                                  ? " is-invalid"
                                  : "")
                              }
                              value={state.confirm_password}
                              onChange={handleregistrationFormValues}
                            />

                            <ErrorMessage
                              name="confirm_password"
                              component="div"
                              className="invalid-feedback"
                            />
                            <label htmlFor="usr">Confirm Password</label>
                          </div>
                        </Col>
                      </Row>

                      <div className="mt-3 d-flex justify-content-end">
                        <button
                          className="btn btn-buttonColor w-md"
                          type="submit"
                        >
                          Register
                        </button>


                      </div>
                    </Form>
                  )}
                </Formik>
              </div>

            </ModalBody>
          </Modal>

          {/* ============== Register user modal ends here ================ */}
          {/* -----Modal for Loader------ */}
          <Modal
            isOpen={state.loader}
            // role="dialog"
            // autoFocus={true}
            centered={true}
            tabIndex="-1"
            size="small"
            style={{ border: "none", width: "5%" }}
          >
            <ModalBody>
              <i
                className="bx bx-loader bx-spin font-size-42 align-middle me-2"
                style={{ zindex: 100 }}
              />
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

AdminRegister.propTypes = {
  apiError: PropTypes.any,
  registerUserInManager: PropTypes.func,
  registerUser: PropTypes.func,
  registerUserFailed: PropTypes.any,
  registrationError: PropTypes.any,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  const {
    user,
    registrationError,
    loading,
    company_list_data,
    company_list_loading,
    company_add_loading,
    company_delete_loading,
    company_delete_data,
    user_list_data,
    user_list_error,
    user_list_loading,
    user_delete_data,
    user_delete_loading,
    user_update_data,
    user_update_error,
    user_update_loading,
    user_info_data,
    user_info_error,
    user_info_loading,
  } = state.Account;

  const { role_list_data, role_list_error, role_list_loading } = state.Role;
  return {
    user,
    registrationError,
    loading,
    company_list_data,
    company_list_loading,
    company_add_loading,
    company_delete_loading,
    company_delete_data,
    user_list_data,
    user_list_error,
    user_list_loading,
    user_delete_data,
    user_delete_loading,
    user_update_data,
    user_update_error,
    user_update_loading,
    user_info_data,
    user_info_error,
    user_info_loading,

    role_list_data,
    role_list_error,
    role_list_loading,
  };
};

export default connect(mapStateToProps, {
  registerUser,
  registerUserInManager,
  apiError,
  registerUserFailed,
  registerStatusClear,
  addCompanyRegister,
  companyAddFreshRegister,
  companyListRegister,
  companyListFreshRegister,
  userList,
  deleteUserData,
  userDeleteFresh,
  updateUserData,
  userGetInfo,
  userUpdateFresh,
  userInfoFresh,
  registerUserInManager,
  roleList,
})(AdminRegister);
