/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle, AiOutlineClose} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import approve from '../../redux/actions/approve'
import user from '../../redux/actions/user'
import depo from '../../redux/actions/depo'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../../redux/actions/auth'
import sign from "../../assets/img/sign.png"
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import NavBar from '../../components/NavBar'
const {REACT_APP_BACKEND_URL} = process.env

const approveSchema = Yup.object().shape({
    jabatan: Yup.string().required(),
    jenis: Yup.string().required(),
    sebagai: Yup.string().required(),
    kategori: Yup.string(),
});

const nameSchema = Yup.object().shape({
    name: Yup.string().required("must be filled"),
    tipe: Yup.string().required("must be filled"),
    kode_plant: Yup.string().required("must be filled")
})

class Approve extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docked: false,
            open: false,
            transitions: true,
            touch: true,
            shadow: true,
            pullRight: false,
            touchHandleWidth: 20,
            dragToggleDistance: 30,
            alert: false,
            confirm: "",
            isOpen: false,
            dropOpen: false,
            dropOpenNum: false,
            value: '',
            onChange: new Date(),
            sidebarOpen: false,
            modalAdd: false,
            modalEdit: false,
            modalUpload: false,
            modalDownload: false,
            modalConfirm: false,
            approveName: false,
            modalApprove: false,
            detail: {},
            dataDivisi: [],
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            namaApprove: {},
            editModalName: false,
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    openApproveName = () => {
        this.setState({approveName: !this.state.approveName})
    }

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getDetailId(token, val.id)
        this.openEditAppName()
    }

    openEditAppName = () => {
        this.setState({editModalName: !this.state.editModalName})
    }

    openModalApprove = () => {
        this.setState({modalApprove: !this.state.modalApprove})
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    next = async () => {
        const { page } = this.props.approve
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.approve
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }
    onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }
    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }
    openModalAddName = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }
    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }
    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }
    openModalDownload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    deleteDataApprove = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.deleteApprove(token, values)
        await this.props.getDetailApprove(token, this.state.namaApprove.name, this.state.namaApprove.kode_plant)
    }

    addApproval = async (values) => {
        const token = localStorage.getItem("token")
        const data = {
            jabatan: values.jabatan,
            jenis: values.jenis,
            sebagai: values.sebagai,
            kategori: values.kategori,
            nama_approve: this.state.namaApprove.name,
            tipe: this.state.namaApprove.tipe,
            kode_plant: this.state.namaApprove.kode_plant
        }
        await this.props.createApprove(token, data)
        await this.props.getDetailApprove(token, this.state.namaApprove.name, this.state.namaApprove.kode_plant)
        this.openModalAdd()
    }

    addApproveName = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.createNameApprove(token, value)
        this.openApproveName()
        this.getDataApprove()
        this.setState({confirm: 'addname'})
        this.openConfirm()
    }

    
    editApproveName = async (value) => {
        const {idName} = this.props.approve
        const token = localStorage.getItem("token")
        await this.props.updateNameApprove(token, value, idName.id)
        this.openEditAppName()
        this.getDataApprove()
        this.setState({confirm: 'editname'})
        this.openConfirm()
    }

    editApproval = async (values, id) => {
        const token = localStorage.getItem("token")
        const data = {
            jabatan: values.jabatan,
            jenis: values.jenis,
            sebagai: values.sebagai,
            kategori: values.kategori,
            nama_approve: this.state.namaApprove.name,
            tipe: this.state.namaApprove.tipe,
            kode_plant: this.state.namaApprove.kode_plant
        }
        await this.props.updateApprove(token, id, data)
        await this.props.getDetailApprove(token,  this.state.namaApprove.name, this.state.namaApprove.kode_plant)
        this.openModalEdit()
    }

    componentDidUpdate() {
        const {isError, isUpload, isEditName, isAdd} = this.props.approve
        if (isError) {
            this.showAlert()
            this.props.resetError()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataApprove()
             }, 2100)
        } else if (isEditName === false) {
            this.props.resetError()
            this.setState({confirm: 'falEditName'})
            this.openConfirm()
        } else if (isAdd === false) {
            this.props.resetError()
            this.setState({confirm: 'falAddName'})
            this.openConfirm()
        }
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataApprove({limit: 10, search: this.state.search})
        }
    }

    componentDidMount() {
        this.getDataApprove()
        this.getDataDepo()
    }

    getDataDepo = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 1000, '')
        // const { dataDepo } = this.props.depo
    }

    getDataApprove = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.getNameApprove(token)
        await this.props.getRole(token)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataDetailApprove = async (val) => {
        this.setState({namaApprove: val})
        const token = localStorage.getItem("token")
        await this.props.getDetailApprove(token, val.name, val.kode_plant)
        this.openModalApprove()
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    delName = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.deleteNameApprove(token, val.id)
        this.getDataApprove()
        this.setState({confirm: 'delname'})
        this.openConfirm()
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg} = this.state
        const {dataApprove, dataName, alertM, alertMsg, alertUpload, page, detailApp, idName} = this.props.approve
        const { dataRole } = this.props.user
        const { dataDepo } = this.props.depo
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')

        const contentHeader =  (
            <div className={style.navbar}>
                <NavbarBrand
                href="#"
                onClick={this.menuButtonClick}
                >
                    <FaBars size={20} className={style.white} />
                </NavbarBrand>
                <NavBar />
            </div>
        )

        const sidebar = <SidebarContent />
        const sidebarProps = {
            sidebar,
            docked: this.state.docked,
            sidebarClassName: "custom-sidebar-class",
            contentId: "custom-sidebar-content-id",
            open: this.state.open,
            touch: this.state.touch,
            shadow: this.state.shadow,
            pullRight: this.state.pullRight,
            touchHandleWidth: this.state.touchHandleWidth,
            dragToggleDistance: this.state.dragToggleDistance,
            transitions: this.state.transitions,
            onSetOpen: this.onSetOpen
          };
        return (
            <>
                <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                                <div>{alertMsg}</div>
                                <div>{alertM}</div>
                                {alertUpload !== undefined && alertUpload.map(item => {
                                    return (
                                        <div>{item}</div>
                                    )
                                })}
                            </Alert>
                            <Alert color="danger" className={style.alertWrong} isOpen={upload}>
                                <div>{errMsg}</div>
                            </Alert>
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard}>Master Approval</div>
                                </div>
                                {/* <div className={style.secHeadDashboard}>
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                        <DropdownItem className={style.item} onClick={() => this.getDataApprove({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataApprove({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataApprove({limit: 50, search: ''})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
                                    </div>
                                </div> */}
                                <div className={style.secEmail4}>
                                    <div className={style.headEmail}>
                                        <Button color="success" size="lg" onClick={() => this.openApproveName()}>Add</Button>
                                    </div>
                                    <div className={style.searchEmail}>
                                        {/* <text>Search: </text>
                                        <Input 
                                        className={style.search}
                                        onChange={this.onSearch}
                                        value={this.state.search}
                                        onKeyPress={this.onSearch}
                                        >
                                            <FaSearch size={20} />
                                        </Input> */}
                                    </div>
                                </div>
                                {dataName.length === 0 ? (
                                    <div className={style.tableDashboard}>
                                        <Table bordered responsive hover className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Nama Approval</th>
                                                    <th>Tipe</th>
                                                    <th>Kode Plant</th>
                                                    <th>Opsi</th>
                                                </tr>
                                            </thead>
                                        </Table>
                                        <div className={style.spin}>
                                            Data tidak ditemukan
                                        </div> 
                                    </div>              
                                ) : (
                                    <div className={style.tableDashboard}>
                                        <Table bordered responsive hover className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Nama Approval</th>
                                                    <th>Tipe</th>
                                                    <th>Kode Plant</th>
                                                    <th>Opsi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataName.length !== 0 && dataName.map(item => {
                                                    return (
                                                    <tr>
                                                        <th scope="row">{(dataName.indexOf(item) + 1)}</th>
                                                        <td>{item.name}</td>
                                                        <td>{item.tipe}</td>
                                                        <td>{item.kode_plant}</td>
                                                        <td className='rowGeneral'>
                                                            <Button color="info" onClick={() => this.getDataDetailApprove(item)}>Detail</Button>
                                                            <Button onClick={() => this.prosesOpenEdit(item)} className='ml-2' color="success">Update</Button>
                                                            <Button onClick={() => this.delName(item)} className='ml-2' color="danger">Delete</Button>
                                                        </td>
                                                    </tr>
                                                )})}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                                <div>
                                    <div className={style.infoPageEmail}>
                                        {/* <text>Showing {page.currentPage} of {page.pages} pages</text>
                                        <div className={style.pageButton}>
                                            <button className={style.btnPrev} color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            <button className={style.btnPrev} color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal toggle={this.openApproveName} isOpen={this.state.approveName} size="lg">
                    <ModalHeader toggle={this.openApproveName}>Add Master Approval</ModalHeader>
                    <Formik
                    initialValues={{
                        name: "",
                        kode_plant: '',
                        tipe: ''
                    }}
                    validationSchema={nameSchema}
                    onSubmit={(values) => {this.addApproveName(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Approval
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="text" 
                                name="namec"
                                value={values.name}
                                onChange={handleChange("name")}
                                onBlur={handleBlur("name")}
                                />
                                {errors.name ? (
                                    <text className={style.txtError}>Must Be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tipe Approval
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="tipe"
                                value={values.tipe}
                                onChange={handleChange("tipe")}
                                onBlur={handleBlur("tipe")}
                                >
                                    <option>-Pilih Tipe Approval-</option>
                                    <option value='all'>All</option>
                                    <option value='area'>Area</option>
                                </Input>
                                {errors.tipe ? (
                                    <text className={style.txtError}>Must Be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Area
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                value={values.kode_plant}
                                onChange={handleChange("kode_plant")}
                                onBlur={handleBlur("kode_plant")}
                                >
                                    <option>-Pilih Area-</option>
                                    <option 
                                    color={values.tipe === "all" ? 'primary' : 'danger'} 
                                    disabled={values.tipe === "all" ? false : true} 
                                    value='all'>
                                        All
                                    </option>
                                    {dataDepo.length !== 0 && dataDepo.map(item => {
                                        return (
                                            <option 
                                            color={values.tipe === "area" ? 'primary' : 'danger'} 
                                            disabled={values.tipe === "area" ? false : true} 
                                            value={item.kode_plant}>
                                                {item.kode_plant + '-' + item.area}
                                            </option>
                                        )
                                    })}
                                </Input>
                                {errors.kode_plant ? (
                                    <text className={style.txtError}>Must Be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="" onClick={this.openApproveName}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openEditAppName} isOpen={this.state.editModalName} size="lg">
                    <ModalHeader>Edit Master Approval</ModalHeader>
                    <Formik
                    initialValues={{
                        name: idName.name,
                        kode_plant: idName.kode_plant,
                        tipe: idName.tipe
                    }}
                    validationSchema={nameSchema}
                    onSubmit={(values) => {this.editApproveName(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Approval
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="text" 
                                name="namec"
                                value={values.name}
                                onChange={handleChange("name")}
                                onBlur={handleBlur("name")}
                                />
                                {errors.name ? (
                                    <text className={style.txtError}>Must Be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tipe Approval
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="tipe"
                                value={values.tipe}
                                onChange={handleChange("tipe")}
                                onBlur={handleBlur("tipe")}
                                >
                                    <option>-Pilih Tipe Approval-</option>
                                    <option value='all'>All</option>
                                    <option value='area'>Area</option>
                                </Input>
                                {errors.tipe ? (
                                    <text className={style.txtError}>Must Be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Area
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="kode_plant"
                                value={values.kode_plant}
                                onChange={handleChange("kode_plant")}
                                onBlur={handleBlur("kode_plant")}
                                >
                                    <option>-Pilih Area-</option>
                                    <option 
                                    color={values.tipe === "all" ? 'primary' : 'danger'} 
                                    disabled={values.tipe === "all" ? false : true} 
                                    value='all'>
                                        All
                                    </option>
                                    {dataDepo.length !== 0 && dataDepo.map(item => {
                                        return (
                                            <option 
                                            color={values.tipe === "area" ? 'primary' : 'danger'} 
                                            disabled={values.tipe === "area" ? false : true} 
                                            value={item.kode_plant}>
                                                {item.kode_plant + '-' + item.area}
                                            </option>
                                        )
                                    })}
                                </Input>
                                {errors.kode_plant ? (
                                    <text className={style.txtError}>Must Be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="" onClick={this.openEditAppName}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal size="xl" toggle={this.openModalApprove} isOpen={this.state.modalApprove}>
                    <ModalHeader>
                        List Approval
                    </ModalHeader>
                    <ModalBody>
                        <div className={style.headEmail}>
                            <Button color="success" size="lg" className="mb-4" onClick={this.openModalAdd} >Add</Button>
                        </div>
                        <Table striped bordered hover responsive className={style.tab}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Jabatan</th>
                                    <th>Jenis</th>
                                    <th>Sebagai</th>
                                    <th>Kategori</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailApp.length !== 0 && detailApp.map(item => {
                                    return (
                                        <tr>
                                        <th>{detailApp.indexOf(item) + 1}</th>
                                        <td>{item.jabatan}</td>
                                        <td>{item.jenis}</td>
                                        <td>{item.sebagai}</td>
                                        <td>{item.kategori}</td>
                                        <td>
                                            <Button color="danger" className="mr-4" onClick={() => this.deleteDataApprove(item.id)}>Delete</Button>
                                            <Button color="info" onClick={() => this.openModalEdit(this.setState({detail: item}))}>Update</Button>
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </ModalBody>
                </Modal>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="lg">
                    <ModalHeader toggle={this.openModalAdd}>Add Approval</ModalHeader>
                    <Formik
                    initialValues={{
                        jabatan: "",
                        jenis: "",
                        sebagai: "",
                        kategori: "",
                    }}
                    validationSchema={approveSchema}
                    onSubmit={(values) => {this.addApproval(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jabatan
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="select" 
                                name="select"
                                value={values.jabatan}
                                onChange={handleChange("jabatan")}
                                onBlur={handleBlur("jabatan")}
                                >
                                    <option>-Pilih Jabatan-</option>
                                    {dataRole.length !== 0 && dataRole.map(item => {
                                        return (
                                            <option value={item.name}>{item.name}</option>
                                        )
                                    })}
                                </Input>
                                {errors.jabatan ? (
                                    <text className={style.txtError}>{errors.jabatan}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jenis
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.jenis}
                                onChange={handleChange("jenis")}
                                onBlur={handleBlur("jenis")}
                                >
                                    <option>-Pilih Jenis-</option>
                                    <option value="it">IT</option>
                                    <option value="non_it">Non IT</option>
                                    <option value="all">All</option>
                                </Input>
                                {errors.jenis ? (
                                        <text className={style.txtError}>{errors.jenis}</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Sebagai
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.sebagai}
                                onChange={handleChange("sebagai")}
                                onBlur={handleBlur("sebagai")}
                                >
                                    <option>-Pilih Sebagai-</option>
                                    <option value="pembuat">Pembuat</option>
                                    <option value="penerima">Penerima</option>
                                    <option value="pemeriksa">Pemeriksa</option>
                                    <option value="penyetuju">Penyetuju</option>
                                    <option value="mengetahui">Mengetahui</option>
                                </Input>
                                {errors.sebagai ? (
                                        <text className={style.txtError}>{errors.sebagai}</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Kategori
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.kategori}
                                onChange={handleChange("kategori")}
                                onBlur={handleBlur("kategori")}
                                >
                                    <option>-Pilih Kategori-</option>
                                    <option value="budget">Budget</option>
                                    <option value="non-budget">Non Budget</option>
                                    <option value="return">Return</option>
                                    <option value="all">All</option>
                                </Input>
                                {errors.kategori ? (
                                        <text className={style.txtError}>{errors.kategori}</text>
                                    ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="lg">
                    <ModalHeader>Edit Approval</ModalHeader>
                    <Formik
                    initialValues={{
                        jenis: detail.jenis,
                        jabatan: detail.jabatan,
                        sebagai: detail.sebagai,
                        kategori: detail.kategori,
                    }}
                    validationSchema={approveSchema}
                    onSubmit={(values) => {this.editApproval(values, detail.id)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jabatan
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="select" 
                                name="select"
                                value={values.jabatan}
                                onChange={handleChange("jabatan")}
                                onBlur={handleBlur("jabatan")}
                                >
                                    <option>-Pilih Jabatan-</option>
                                    {dataRole.length !== 0 && dataRole.map(item => {
                                        return (
                                            <option value={item.name}>{item.name}</option>
                                        )
                                    })}
                                </Input>
                                {errors.jabatan ? (
                                    <text className={style.txtError}>{errors.jabatan}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jenis
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.jenis}
                                onChange={handleChange("jenis")}
                                onBlur={handleBlur("jenis")}
                                >
                                    <option>-Pilih Jenis-</option>
                                    <option value="it">IT</option>
                                    <option value="non_it">Non IT</option>
                                    <option value="all">All</option>
                                </Input>
                                {errors.jenis ? (
                                        <text className={style.txtError}>{errors.jenis}</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Sebagai
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.sebagai}
                                onChange={handleChange("sebagai")}
                                onBlur={handleBlur("sebagai")}
                                >
                                    <option>-Pilih Sebagai-</option>
                                    <option value="pembuat">Pembuat</option>
                                    <option value="pemeriksa">Pemeriksa</option>
                                    <option value="penyetuju">Penyetuju</option>
                                    <option value="penerima">Penerima</option>
                                    <option value="mengetahui">Mengetahui</option>
                                </Input>
                                {errors.sebagai ? (
                                        <text className={style.txtError}>{errors.sebagai}</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Kategori
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.kategori}
                                onChange={handleChange("kategori")}
                                onBlur={handleBlur("kategori")}
                                >
                                    <option>-Pilih Kategori-</option>
                                    <option value="budget">Budget</option>
                                    <option value="non-budget">Non Budget</option>
                                    <option value="return">Return</option>
                                    <option value="all">All</option>
                                </Input>
                                {errors.kategori ? (
                                        <text className={style.txtError}>{errors.kategori}</text>
                                    ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalEdit}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'editname' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Memperbarui Nama Approval</div>
                        </div>
                        ) : this.state.confirm === 'falEditName' ? (
                            <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                <div className={style.sucUpdate}>Gagal Memperbarui Nama Approval, Nama Approval Telah Terdaftar</div>
                            </div>
                        )  : this.state.confirm === 'falAddName' ? (
                            <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                <div className={style.sucUpdate}>Gagal Menambahkan Nama Approval, Nama Approval Telah Terdaftar</div>
                            </div>
                        ) : this.state.confirm === 'addname' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Nama Approval</div>
                            </div>
                        ) : this.state.confirm === 'delname' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menghapus Nama Approval</div>
                            </div>
                        ) : this.state.confirm === 'upload' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master Approval</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'reset' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mereset Password</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.approve.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    approve: state.approve,
    user: state.user,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    resetError: approve.resetError,
    createApprove: approve.createApprove,
    createNameApprove: approve.createNameApprove,
    getApprove: approve.getApprove,
    getDetailApprove: approve.getDetailApprove,
    getNameApprove: approve.getNameApprove,
    deleteApprove: approve.deleteApprove,
    updateApprove: approve.updateApprove,
    getRole: user.getRole,
    getDepo: depo.getDepo,
    updateNameApprove: approve.updateNameApprove,
    getDetailId: approve.getDetailId,
    deleteNameApprove: approve.deleteNameApprove
}

export default connect(mapStateToProps, mapDispatchToProps)(Approve)
