import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle, AiOutlineClose} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import dokumen from '../../redux/actions/dokumen'
import menu from '../../redux/actions/menu'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import depo from '../../redux/actions/depo'
import Sidebar from "../../components/Header";
import NavBar from '../../components/NavBar'
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
const {REACT_APP_BACKEND_URL} = process.env

const dokumenSchema = Yup.object().shape({
    name: Yup.string().required(),
    stat_upload: Yup.number().required(),
});

const nameSchema = Yup.object().shape({
    name: Yup.string().required("must be filled"),
    type: Yup.string().required("must be filled"),
    kode_plant: Yup.string().required("must be filled")
})

class MasterDokumen extends Component {
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
            detail: {},
            dataDivisi: [],
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            dataTrans: [],
            menu: '',
            transaksi: '',
            modalDel: false,
            nameDocs: {},
            modalApprove: false,
            editModalName: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
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
        const { page } = this.props.dokumen
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.dokumen
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

    delReason = async () => {
        const token = localStorage.getItem("token")
        const {detail} = this.state
        await this.props.deleteDokumen(token, detail.id)
        this.openModalEdit()
        this.setState({confirm: 'del'})
        this.openConfirm()
        this.getDataDokumen()
        this.openModalDel()
    }

    openModalDel = () => {
        this.setState({modalDel: !this.state.modalDel})
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    openDraftEdit = (val) => {
        const {dataAll} = this.props.menu
        const dataTrans =  []
        dataAll.map(item => {
            return (item.kode_menu === val.jenis && dataTrans.push(item))
        })
        this.setState({dataTrans: dataTrans, detail: val, menu: val.jenis, transaksi: val.type})
        this.openModalEdit()
    }

    changeMenu = (val) => {
        const {dataAll} = this.props.menu
        console.log(dataAll)
        const dataTrans =  []
        dataAll.map(item => {
            return (item.kode_menu === val && dataTrans.push(item))
        })
        this.setState({dataTrans: dataTrans, menu: val, transaksi: ''})
    }

    changeTrans = (val) => {
        this.setState({transaksi: val})
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/dokumen.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "dokumen.xlsx");
            document.body.appendChild(link);
            link.click();
        });
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
        this.setState({menu: '', transaksi: '', dataTrans: []})
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
    openModalApprove = () => {
        this.setState({modalApprove: !this.state.modalApprove})
    }

    openDocumentName = () => {
        this.setState({approveName: !this.state.approveName})
    }
    
    addDocumentName = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.createNameDocument(token, value)
        this.openDocumentName()
        this.getDataDokumen()
        this.setState({confirm: 'addname'})
        this.openConfirm()
    }

    addDokumen = async (val) => {
        const token = localStorage.getItem("token")
        const { menu, transaksi, nameDocs } = this.state
        const { idName } = this.props.dokumen
        console.log(nameDocs)
        const data = {
            name: val.name,
            jenis: idName.menu,
            type: idName.name,
            stat_upload: val.stat_upload,
            kode_plant: nameDocs.kode_plant
        }
        await this.props.addDokumen(token, data)
        const {isAdd} = this.props.dokumen
        if (isAdd) {
            await this.props.getDetailDocument(token, idName.name, idName.kode_plant)
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.openModalAdd()
            this.getDataDokumen()
        }
    }

    editDocumentName = async (value) => {
        const token = localStorage.getItem("token")
        const {idName} = this.props.dokumen
        await this.props.updateNameDocument(token, value, idName.id)
        this.openEditName()
        this.getDataDokumen()
        this.setState({confirm: 'editname'})
        this.openConfirm()
    }

    DownloadMaster = () => {
        const {link} = this.props.dokumen
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master dokumen.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    ExportMaster = () => {
        const token = localStorage.getItem('token')
        this.props.exportMaster(token)
    }

    onChangeHandler = e => {
        const {size, type} = e.target.files[0]
        if (size >= 5120000) {
            this.setState({errMsg: "Maximum upload size 5 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' ){
            this.setState({errMsg: 'Invalid file type. Only excel files are allowed.'})
            this.uploadAlert()
        } else {
            this.setState({fileUpload: e.target.files[0]})
        }
    }

    uploadMaster = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        await this.props.uploadMaster(token, data)
    }

    editDokumen = async (val, id) => {
        const token = localStorage.getItem("token")
        const { menu, transaksi, nameDocs } = this.state
        const {idName} = this.props.dokumen
        const data = {
            name: val.name,
            jenis: idName.menu,
            type: idName.name,
            stat_upload: val.stat_upload,
            kode_plant: nameDocs.kode_plant
        }
        await this.props.updateDokumen(token, id, data)
        const {isUpdate} = this.props.dokumen
        if (isUpdate) {
            await this.props.getDetailDocument(token, idName.name, idName.kode_plant)
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.openModalEdit()
            this.getDataDokumen()
        }
    }

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getTempDoc(token, val.id)
        const {idName} = this.props.dokumen
        const {dataAll} = this.props.menu
        const dataTrans =  []
        dataAll.map(item => {
            return (item.kode_menu === idName.menu && dataTrans.push(item))
        })
        this.setState({dataTrans: dataTrans})
        this.openEditName()
    }

    openEditName = () => {
        this.setState({editModalName: !this.state.editModalName})
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport, isUpdate, isAdd, isCreate, isEditName} = this.props.dokumen
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataDokumen()
             }, 2100)
        } else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        } else if (isUpdate === false) {
            this.setState({confirm: 'falseUpdate'})
            this.openConfirm()
            this.props.resetError()
        } else if (isAdd === false) {
            this.setState({confirm: 'falseAdd'})
            this.openConfirm()
            this.props.resetError()
        } else if (isCreate === false) {
            this.setState({confirm: 'falseAddName'})
            this.openConfirm()
            this.props.resetError()
        } else if (isEditName === false) {
            this.setState({confirm: 'falseUpName'})
            this.openConfirm()
            this.props.resetError()
        }
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataDokumen({limit: 10, search: this.state.search})
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem("token")
        await this.props.getAllMenu(token, 'proses')
        this.getDataDepo()
        this.getDataDokumen()
    }

    getDataDepo = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 1000, '')
        // const { dataDepo } = this.props.depo
    }

    getDataDokumen = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.dokumen
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getNameDocument(token, limit, search, page.currentPage)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    deleteDataDocument = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.deleteDokumen(token, values)
        await this.props.getDetailDocument(token, this.state.nameDocs.name, this.state.nameDocs.kode_plant)
    }

    getDataDetailDokumen = async (val) => {
        this.setState({nameDocs: val})
        const token = localStorage.getItem("token")
        await this.props.getTempDoc(token, val.id)
        await this.props.getDetailDocument(token, val.name, val.kode_plant)
        this.openModalApprove()
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg, dataTrans} = this.state
        const { dataAll, nameMenu } = this.props.menu
        const {dataDokumen, dataName, detailName, isGet, alertM, alertMsg, alertUpload, page, idName} = this.props.dokumen
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const { dataDepo } = this.props.depo

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
                                    <div className={style.titleDashboard}>Master Dokumen</div>
                                </div>
                                <div className={style.secHeadDashboard}>
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                        <DropdownItem className={style.item} onClick={() => this.getDataDokumen({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataDokumen({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataDokumen({limit: 50, search: ''})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
                                    </div>
                                </div>
                                <div className='secEmail'>
                                    <div className={style.headEmail}>
                                        <Button className='mr-1' onClick={() => this.openDocumentName()} color="primary" size="lg">Add</Button>
                                        {/* <Button className='mr-1' onClick={this.openModalUpload} color="warning" size="lg">Upload</Button>
                                        <Button className='mr-1' onClick={this.ExportMaster} color="success" size="lg">Download</Button> */}
                                    </div>
                                    <div className={style.searchEmail}>
                                        <text>Search: </text>
                                        <Input 
                                        className={style.search}
                                        onChange={this.onSearch}
                                        value={this.state.search}
                                        onKeyPress={this.onSearch}
                                        >
                                            <FaSearch size={20} />
                                        </Input>
                                    </div>
                                </div>
                                {dataName.length === 0 ? (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama Transaksi</th>
                                                <th>Tipe</th>
                                                <th>Kode Plant</th>
                                                <th>Status</th>
                                                <th>Opsi</th>
                                            </tr>
                                        </thead>
                                    </Table>
                                    </div>
                                ) : (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama Transaksi</th>
                                                <th>Tipe</th>
                                                <th>Kode Plant</th>
                                                <th>Status</th>
                                                <th>Opsi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {/* {dataDokumen.length !== 0 && dataDokumen.map(item => {
                                                return (
                                            <tr onClick={() => this.openDraftEdit(item)}>
                                                <th scope="row">{(dataDokumen.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                <td>{item.name}</td>
                                                <td>{item.jenis}</td>
                                                <td>{item.type}</td>
                                                <td>{item.stat_upload === 1 ? 'Harus upload' : 'Tidak harus upload'}</td>
                                            </tr>
                                        )})} */}
                                        {dataName.length !== 0 && dataName.map(item => {
                                            return (
                                            <tr>
                                                <th scope="row">{(dataName.indexOf(item) + 1)}</th>
                                                <td>{item.name}</td>
                                                <td>{item.type}</td>
                                                <td>{item.kode_plant}</td>
                                                <td>{item.status === null ? 'active' : item.status}</td>
                                                <td className='rowGeneral'>
                                                    <Button color="info" onClick={() => this.getDataDetailDokumen(item)}>Detail</Button>
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
                                    <div className='infoPageEmail'>
                                        <text>Showing {page.currentPage} of {page.pages} pages</text>
                                        <div className={style.pageButton}>
                                            <button className={style.btnPrev} color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            <button className={style.btnPrev} color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="lg">
                    <ModalHeader toggle={this.openModalAdd}>Add Master Dokumen</ModalHeader>
                    <Formik
                    initialValues={{
                        name: "",
                        stat_upload: null,
                    }}
                    validationSchema={dokumenSchema}
                    onSubmit={(values) => {this.addDokumen(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Dokumen
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="textarea" 
                                name="nama_pic"
                                value={values.name}
                                onChange={handleChange("name")}
                                onBlur={handleBlur("name")}
                                />
                                {errors.name ? (
                                    <text className={style.txtError}>must be filled with character</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Menu
                            </text>
                            <div className="col-md-9">
                                <Input 
                                name="menu"
                                disabled
                                value={idName.menu}
                                onChange={e => this.changeMenu(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Transaksi
                            </text>
                            <div className="col-md-9">
                                <Input
                                name="transaksi"
                                disabled
                                value={idName.name}
                                onChange={e => this.changeTrans(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status Upload
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="select" 
                                name="stat_upload"
                                value={values.stat_upload}
                                onChange={handleChange("stat_upload")}
                                onBlur={handleBlur("stat_upload")}
                                >
                                    <option>-Pilih-</option>
                                    <option value={1}>Harus upload</option>
                                    <option value={0}>Tidak harus upload</option>
                                </Input>
                                {values.stat_upload === null ? (
                                    <text className={style.txtError}>must be filled</text>
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
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Dokumen</ModalHeader>
                    <Formik
                    initialValues={{
                        name: detail.name,
                        stat_upload: detail.stat_upload,
                    }}
                    validationSchema={dokumenSchema}
                    onSubmit={(values) => {this.editDokumen(values, detail.id)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Dokumen
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="textarea" 
                                name="nama_pic"
                                value={values.name}
                                onChange={handleChange("name")}
                                onBlur={handleBlur("name")}
                                />
                                {errors.name ? (
                                    <text className={style.txtError}>must be filled with character</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Menu
                            </text>
                            <div className="col-md-9">
                                <Input 
                                name="menu"
                                disabled
                                value={idName.menu}
                                onChange={e => this.changeMenu(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Transaksi
                            </text>
                            <div className="col-md-9">
                                <Input
                                name="transaksi"
                                disabled
                                value={idName.name}
                                onChange={e => this.changeTrans(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status Upload
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="select" 
                                name="stat_upload"
                                value={values.stat_upload}
                                onChange={handleChange("stat_upload")}
                                onBlur={handleBlur("stat_upload")}
                                >
                                    <option>-Pilih-</option>
                                    <option value={1}>Harus upload</option>
                                    <option value={0}>Tidak harus upload</option>
                                </Input>
                                {values.stat_upload === null ? (
                                    <text className={style.txtError}>must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button className="mr-2" onClick={this.openModalDel} color='danger'>Delete</Button>
                            </div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-2" onClick={this.openModalEdit}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openDocumentName} isOpen={this.state.approveName} size="lg">
                    <ModalHeader toggle={this.openDocumentName}>Add Template Dokumen</ModalHeader>
                    <Formik
                    initialValues={{
                        name: "",
                        kode_plant: '',
                        type: '',
                        status: '',
                        menu: ''
                    }}
                    validationSchema={nameSchema}
                    onSubmit={(values) => {this.addDocumentName(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Menu
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.menu}
                                onBlur={handleBlur("menu")}
                                onChange={(e) => {
                                        handleChange("menu")(e) 
                                        this.changeMenu(e.target.value)
                                    }
                                }
                                // onChange={e => this.changeMenu(e.target.value)}
                                >
                                    <option>-Pilih-</option>
                                    {nameMenu.length > 0 && nameMenu.map(item => {
                                        return (
                                            <option value={item.name}>{item.name}</option>
                                        )
                                    })}
                                </Input>
                                {values.menu === '' ? (
                                        <text className={style.txtError}>must be filled</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Transaksi
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="select" 
                                name="select"
                                disabled={dataTrans.length === 0}
                                value={values.name}
                                onBlur={handleBlur("name")}
                                onChange={handleChange('name')}
                                >
                                    <option>-Pilih-</option>
                                    {dataTrans.length > 0 && dataTrans.map(item => {
                                        return (
                                            <option value={item.name}>{item.name}</option>
                                        )
                                    })}
                                </Input>
                                {dataTrans.length === 0 || values.name === '' ? (
                                    <text className={style.txtError}>must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tipe
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="type"
                                value={values.type}
                                onChange={handleChange("type")}
                                onBlur={handleBlur("type")}
                                >
                                    <option>-Pilih Tipe-</option>
                                    <option value='all'>All</option>
                                    <option value='area'>Area</option>
                                </Input>
                                {errors.type ? (
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
                                    color={values.type === "all" ? 'primary' : 'danger'} 
                                    disabled={values.type === "all" ? false : true} 
                                    value='all'>
                                        All
                                    </option>
                                    {dataDepo.length !== 0 && dataDepo.map(item => {
                                        return (
                                            <option 
                                            color={values.type === "area" ? 'primary' : 'danger'} 
                                            disabled={values.type === "area" ? false : true} 
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
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="status"
                                value={values.status}
                                onChange={handleChange("status")}
                                onBlur={handleBlur("status")}
                                >
                                    <option>-Pilih Tipe-</option>
                                    <option value='active'>Active</option>
                                    <option value='inactive'>Inactive</option>
                                </Input>
                                {errors.status ? (
                                    <text className={style.txtError}>Must Be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="" onClick={this.openDocumentName}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openEditName} isOpen={this.state.editModalName} size="lg">
                    <ModalHeader toggle={this.openEditName}>Edit Template Dokumen</ModalHeader>
                    <Formik
                    initialValues={{
                        name: idName.name,
                        kode_plant: idName.kode_plant,
                        type: idName.type,
                        status: idName.status,
                        menu: idName.menu
                    }}
                    validationSchema={nameSchema}
                    onSubmit={(values) => {this.editDocumentName(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Menu
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.menu}
                                onBlur={handleBlur("menu")}
                                onChange={(e) => {
                                    handleChange("menu")(e) 
                                    this.changeMenu(e.target.value)
                                    }
                                }
                                >
                                    <option>-Pilih-</option>
                                    {nameMenu.length > 0 && nameMenu.map(item => {
                                        return (
                                            <option value={item.name}>{item.name}</option>
                                        )
                                    })}
                                </Input>
                                {values.menu === '' ? (
                                        <text className={style.txtError}>must be filled</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Transaksi
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="select" 
                                name="select"
                                value={values.name}
                                onBlur={handleBlur("name")}
                                onChange={handleChange('name')}
                                >
                                    <option>-Pilih-</option>
                                    {dataTrans.length > 0 && dataTrans.map(item => {
                                        return (
                                            <option value={item.name}>{item.name}</option>
                                        )
                                    })}
                                </Input>
                                {values.name === '' ? (
                                    <text className={style.txtError}>must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tipe
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="type"
                                value={values.type}
                                onChange={handleChange("type")}
                                onBlur={handleBlur("type")}
                                >
                                    <option>-Pilih Tipe-</option>
                                    <option value='all'>All</option>
                                    <option value='area'>Area</option>
                                </Input>
                                {errors.type ? (
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
                                    color={values.type === "all" ? 'primary' : 'danger'} 
                                    disabled={values.type === "all" ? false : true} 
                                    value='all'>
                                        All
                                    </option>
                                    {dataDepo.length !== 0 && dataDepo.map(item => {
                                        return (
                                            <option 
                                            color={values.type === "area" ? 'primary' : 'danger'} 
                                            disabled={values.type === "area" ? false : true} 
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
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="status"
                                value={values.status}
                                onChange={handleChange("status")}
                                onBlur={handleBlur("status")}
                                >
                                    <option>-Pilih Tipe-</option>
                                    <option value='active'>Active</option>
                                    <option value='inactive'>Inactive</option>
                                </Input>
                                {errors.status ? (
                                    <text className={style.txtError}>Must Be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="" onClick={this.openEditName}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master Dokumen</ModalHeader>
                    <ModalBody className={style.modalUpload}>
                        <div className={style.titleModalUpload}>
                            <text>Upload File: </text>
                            <div className={[style.uploadFileInput, "ml-4"]}>
                                <AiOutlineFileExcel size={35} />
                                <div className="ml-3">
                                    <Input
                                    type="file"
                                    name="file"
                                    accept=".xls,.xlsx"
                                    onChange={this.onChangeHandler}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={style.btnUpload}>
                            <Button color="info" onClick={this.DownloadTemplate}>Download Template</Button>
                            <Button color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadMaster}>Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="md">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Update Dokumen</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menambah Dokumen</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Mengupload Master Dokumen</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'addname' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Template Document</div>
                            </div>
                        ) : this.state.confirm === 'editname' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Update Template Document</div>
                            </div>
                        ) : this.state.confirm === 'delname' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menghapus Template Document</div>
                            </div>
                        ) : this.state.confirm === 'del' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menghapus Dokumen</div>
                            </div>
                        ) : this.state.confirm === 'falseUpdate' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Update Dokumen</div>
                                    <div className={[style.sucUpdate, style.green]}>Nama Dokumen telah terdaftar</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseAdd' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Add Dokumen</div>
                                    <div className={[style.sucUpdate, style.green]}>Nama Dokumen telah terdaftar</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseAddName' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Add Template</div>
                                    <div className={[style.sucUpdate, style.green]}>Template telah terdaftar</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseUpName' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Update Template</div>
                                    <div className={[style.sucUpdate, style.green]}>Template telah terdaftar</div>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal size="xl" toggle={this.openModalApprove} isOpen={this.state.modalApprove}>
                    <ModalHeader>
                        List Document
                    </ModalHeader>
                    <ModalBody>
                        <div className={style.headEmail}>
                            <Button color="success" size="lg" className="mb-4" onClick={this.openModalAdd} >Add</Button>
                        </div>
                        <Table striped bordered hover responsive className={style.tab}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama dokumen</th>
                                    <th>Menu</th>
                                    <th>Transaksi</th>
                                    <th>Status upload</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailName.length !== 0 && detailName.map(item => {
                                    return (
                                        <tr>
                                        <th>{detailName.indexOf(item) + 1}</th>
                                        <td>{item.name}</td>
                                        <td>{item.jenis}</td>
                                        <td>{item.type}</td>
                                        <td>{item.stat_upload === 1 ? 'Harus upload' : 'Tidak harus upload'}</td>
                                        <td>
                                            <Button color="danger" className="mr-4" onClick={() => this.deleteDataDocument(item.id)}>Delete</Button>
                                            <Button color="info" onClick={() => this.openModalEdit(this.setState({detail: item}))}>Update</Button>
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.dokumen.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.dokumen.isUpload ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Mengupload Master</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    dokumen: state.dokumen,
    menu: state.menu,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    addDokumen: dokumen.addDokumen,
    updateDokumen: dokumen.updateDokumen,
    getDokumen: dokumen.getDokumen,
    resetError: dokumen.resetError,
    uploadMaster: dokumen.uploadMaster,
    nextPage: dokumen.nextPage,
    exportMaster: dokumen.exportMaster,
    getAllMenu: menu.getAllMenu,
    deleteDokumen: dokumen.deleteDokumen,
    getDepo: depo.getDepo,
    createNameDocument: dokumen.createNameDocument,
    updateNameDocument: dokumen.updateNameDocument,
    getNameDocument: dokumen.getNameDocument,
    getDetailDocument: dokumen.getDetailDocument,
    deleteNameDocument: dokumen.deleteNameDocument,
    getDetailId: dokumen.getDetailId,
    getTempDoc: dokumen.getTempDoc
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterDokumen)
