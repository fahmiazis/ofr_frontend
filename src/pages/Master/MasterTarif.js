import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner, UncontrolledDropdown} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaBankCircle, FaBars} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel} from 'react-icons/ai'
import depo from '../../redux/actions/depo'
import user from '../../redux/actions/user'
import tarif from '../../redux/actions/tarif'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import NavBar from '../../components/NavBar'
import moment from 'moment'
const {REACT_APP_BACKEND_URL} = process.env

const tarifSchema = Yup.object().shape({
    system: Yup.string().required(),
    gl_account: Yup.number().required(),
    gl_name: Yup.string().required(),
    jenis_transaksi: Yup.string().required(),
    type_transaksi: Yup.string().required(),
    jenis_pph: Yup.string().required(),
    status_npwp: Yup.string().required(),
    tarif_pph: Yup.string().required(),
    dpp_nongrossup: Yup.string().required(),
    dpp_grossup: Yup.string().required(),
    tax_type: Yup.string().required(),
    tax_code: Yup.string().required()
});

const tarifEditSchema = Yup.object().shape({
    system: Yup.string().required(),
    gl_account: Yup.number().required(),
    gl_name: Yup.string().required(),
    jenis_transaksi: Yup.string().required(),
    type_transaksi: Yup.string().required(),
    jenis_pph: Yup.string().required(),
    status_npwp: Yup.string().required(),
    tarif_pph: Yup.string().required(),
    dpp_nongrossup: Yup.string().required(),
    dpp_grossup: Yup.string().required(),
    tax_type: Yup.string().required(),
    tax_code: Yup.string().required()
});

const changeSchema = Yup.object().shape({
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class MasterTarif extends Component {
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
            level: "",
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            modalReset: false,
            filter: null,
            filterName: 'All',
            modalDel: false,
            page: 1
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
    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    resetPass = async (val) => {
        const token = localStorage.getItem("token")
        const {detail} = this.state
        const data = {
            new: val.new_password
        }
        await this.props.resetPassword(token, detail.id, data)
     }

    DownloadMaster = () => {
        const {link} = this.props.tarif
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master tarif.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
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
    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }
    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }
    openModalDownload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/tarif.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master tarif.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    addTarif = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addTarif(token, values)
        const {isAdd} = this.props.tarif
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            await this.getDataCount()
            this.openModalAdd()
        }
    }

    delTarif = async () => {
        const token = localStorage.getItem("token")
        const {detail} = this.state
        await this.props.deleteTarif(token, detail.id)
        this.openModalEdit()
        this.setState({confirm: 'del'})
        this.openConfirm()
        await this.getDataCount()
        this.openModalDel()
    }

    next = async () => {
        const { page } = this.props.tarif
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.tarif
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataCount({limit: 10, search: this.state.search})
        }
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

    editTarif = async (values, id) => {
        const token = localStorage.getItem("token")
        await this.props.updateTarif(token, values, id)
        const {isUpdate} = this.props.tarif
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.getDataCount()
            this.openModalEdit()
        }
    }

    ExportMaster = async () => {
        const token = localStorage.getItem('token')
        await this.props.exportMaster(token)
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport, isReset} = this.props.tarif
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isReset) {
            this.setState({confirm: 'reset'})
            this.props.resetError()
            this.openModalReset()
            this.openConfirm()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataCount()
             }, 2100)
        } else if (isExport) {
            this.DownloadMaster()
            this.props.resetError()
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem("token")
        this.getDataCount()
    }

    getDataCount = async (value) => {
        const { page } = this.props.tarif
        const pages = value === undefined || value.page === undefined ? page.currentPage : value.page
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        const filter = value === undefined || value.filter === undefined ? this.state.filter : value.filter
        console.log(this.state.filter)
        await this.props.getTarif(token, limit, search, pages, filter)
        this.setState({limit: value === undefined ? 10 : value.limit, search: search, filter: filter, page: pages})
    }

    changeFilter = async (val) => {
        this.setState({filter: val.level, filterName: val.name})
        this.getDataCount({limit: this.state.limit, search: this.state.search, filter: val.level, page: 1})
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    openModalReset = () => {
        this.setState({modalReset: !this.state.modalReset})
    }

    openModalDel = () => {
        this.setState({modalDel: !this.state.modalDel})
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg} = this.state
        const {dataTarif, isAll, alertM, alertMsg, alertUpload, page, dataRole, dataAll} = this.props.tarif
        const levels = localStorage.getItem('level')
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
                            <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
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
                                    <div className={style.titleDashboard}>Master Tarif</div>
                                </div>
                                <div className={style.secHeadDashboard} >
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 50, search: ''})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
                                    </div>
                                    <div className='filterTarif'>
                                    </div>
                                </div>
                                <div className='secEmail'>
                                    <div className={style.headEmail}>
                                        <Button className='mr-1' onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                        <Button className='mr-1' onClick={this.openModalUpload} color="warning" size="lg">Upload</Button>
                                        <Button className='mr-1' onClick={this.ExportMaster} color="success" size="lg">Download</Button>
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
                                
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>SAP/REDPINE</th>
                                                <th>GL Account</th>
                                                <th>GL Jurnal</th>
                                                <th>GL Name</th>
                                                <th>Jenis Transaksi</th>
                                                <th>PO/NON PO</th>
                                                <th>Grouping</th>
                                                <th>OP/BADAN</th>
                                                <th>Jenis PPh</th>
                                                <th>NPWP/NIK</th>
                                                <th>Tax Type</th>
                                                <th>Tax Code</th>
                                                <th>Nominal Minimal</th>
                                                <th>Nominal Maximal</th>
                                                <th>Tarif PPh</th>
                                                <th>Tarif DPP Non Grossup</th>
                                                <th>Tarif DPP Grossup</th>
                                                <th>Start Periode</th>
                                                <th>End Periode</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataAll.length !== 0 && dataAll.map(item => {
                                                return (
                                                <tr onClick={()=>this.openModalEdit(this.setState({detail: item}))}>
                                                    <th scope="row">{(dataAll.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                    <td>{item.system}</td>
                                                    <td>{item.gl_account}</td>
                                                    <td>{item.gl_jurnal}</td>
                                                    <td>{item.gl_name}</td>
                                                    <td>{item.jenis_transaksi}</td>
                                                    <td>{item.po}</td>
                                                    <td>{item.grouping}</td>
                                                    <td>{item.type_transaksi}</td>
                                                    <td>{item.jenis_pph}</td>
                                                    <td>{item.status_npwp}</td>
                                                    <td>{item.tax_type}</td>
                                                    <td>{item.tax_code}</td>
                                                    <td>{item.min_nominal === null ? '0' : item.min_nominal}</td>
                                                    <td>{item.max_nominal === null ? '-' : item.max_nominal}</td>
                                                    <td>{parseFloat(item.tarif_pph.split("%")[0]) * 100}%</td>
                                                    <td>{parseFloat(item.dpp_nongrossup.split("%")[0]) * 100}%</td>
                                                    <td>{parseFloat(item.dpp_grossup.split("%")[0]) * 100}%</td>
                                                    <td>{item.start_period === null ? '20 Desember 2023' : moment(item.start_period).format('DD MMMM YYYY')}</td>
                                                    <td>{item.end_period === null ? '-' : moment(item.end_period).format('DD MMMM YYYY')}</td>
                                                </tr>
                                            )})}
                                        </tbody>
                                    </Table>
                                    {dataAll.length === 0 && (
                                        <div className={style.spin}>
                                            Data tidak ditemukan
                                        </div>
                                    )}
                                </div>
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
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master VerifTax</ModalHeader>
                    <Formik
                    initialValues={{
                        system: '',
                        gl_account: '',
                        gl_name: '',
                        jenis_transaksi: '',
                        type_transaksi: '',
                        jenis_pph: '',
                        status_npwp: '',
                        status_ident: '',
                        tarif_pph: '',
                        dpp_nongrossup: '',
                        dpp_grossup: '',
                        tax_type: '',
                        tax_code: ''
                    }}
                    validationSchema={tarifSchema}
                    onSubmit={(values) => {this.addTarif(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                System
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="system"
                                value={values.system}
                                onBlur={handleBlur("system")}
                                onChange={handleChange("system")}
                                >
                                    <option>-Pilih-</option>
                                    <option value="SAP">SAP</option>
                                    <option value="REDPINE">REDPINE</option>
                                </Input>
                                {errors.system ? (
                                    <text className={style.txtError}>{errors.system}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                GL Account
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="gl_account"
                                value={values.gl_account}
                                onBlur={handleBlur("gl_account")}
                                onChange={handleChange("gl_account")}
                                />
                                {errors.gl_account ? (
                                    <text className={style.txtError}>{errors.gl_account}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                GL Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="gl_name"
                                value={values.gl_name}
                                onBlur={handleBlur("gl_name")}
                                onChange={handleChange("gl_name")}
                                />
                                {errors.gl_name ? (
                                    <text className={style.txtError}>{errors.gl_name}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jenis Transaksi
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="jenis_transaksi"
                                value={values.jenis_transaksi}
                                onBlur={handleBlur("jenis_transaksi")}
                                onChange={handleChange("jenis_transaksi")}
                                />
                                {errors.jenis_transaksi ? (
                                    <text className={style.txtError}>{errors.jenis_transaksi}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Type Transaksi
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="type_transaksi"
                                value={values.type_transaksi}
                                onBlur={handleBlur("type_transaksi")}
                                onChange={handleChange("type_transaksi")}
                                >
                                    <option>-Pilih-</option>
                                    <option value="Badan">Badan</option>
                                    <option value="Orang Pribadi">Orang Pribadi</option>
                                    <option value="Non Object PPh">Non Object PPh</option>
                                </Input>
                                {errors.type_transaksi ? (
                                    <text className={style.txtError}>{errors.type_transaksi}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jenis PPh
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="jenis_pph"
                                value={values.jenis_pph}
                                onBlur={handleBlur("jenis_pph")}
                                onChange={handleChange("jenis_pph")}
                                />
                                {errors.jenis_pph ? (
                                    <text className={style.txtError}>{errors.jenis_pph}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status NPWP/NIK
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="status_npwp"
                                value={values.status_npwp}
                                onBlur={handleBlur("status_npwp")}
                                onChange={handleChange("status_npwp")}
                                >
                                    <option>-Pilih-</option>
                                    <option value="NPWP">NPWP</option>
                                    <option value="NIK">NIK</option>
                                    <option value="No Need NPWP/NIK">No Need NPWP/NIK</option>
                                </Input>
                                {errors.status_npwp ? (
                                    <text className={style.txtError}>{errors.status_npwp}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tax Type
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="tax_type"
                                value={values.tax_type}
                                onBlur={handleBlur("tax_type")}
                                onChange={handleChange("tax_type")}
                                />
                                {errors.tax_type ? (
                                    <text className={style.txtError}>{errors.tax_type}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tax Code
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="tax_code"
                                value={values.tax_code}
                                onBlur={handleBlur("tax_code")}
                                onChange={handleChange("tax_code")}
                                />
                                {errors.tax_code ? (
                                    <text className={style.txtError}>{errors.tax_code}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tarif PPh
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="tarif_pph"
                                value={values.tarif_pph}
                                onBlur={handleBlur("tarif_pph")}
                                onChange={handleChange("tarif_pph")}
                                />
                                {errors.tarif_pph ? (
                                    <text className={style.txtError}>{errors.tarif_pph}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tarif DPP Non Grossup
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="dpp_nongrossup"
                                value={values.dpp_nongrossup}
                                onBlur={handleBlur("dpp_nongrossup")}
                                onChange={handleChange("dpp_nongrossup")}
                                />
                                {errors.dpp_nongrossup ? (
                                    <text className={style.txtError}>{errors.dpp_nongrossup}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tarif DPP Grossup
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="dpp_grossup"
                                value={values.dpp_grossup}
                                onBlur={handleBlur("dpp_grossup")}
                                onChange={handleChange("dpp_grossup")}
                                />
                                {errors.dpp_grossup ? (
                                    <text className={style.txtError}>{errors.dpp_grossup}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status Identitas
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="status_ident"
                                value={values.status_ident}
                                onBlur={handleBlur("status_ident")}
                                onChange={handleChange("status_ident")}
                                >
                                    <option>-Pilih-</option>
                                    <option value={'Ya'}>Wajib Isi</option>
                                    <option value="Tidak">Tidak Wajib Isi</option>
                                </Input>
                                {errors.status_ident ? (
                                    <text className={style.txtError}>{errors.status_ident}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit}>
                    <ModalHeader toggle={this.openModalEdit}>Edit Master VerifTax</ModalHeader>
                    <Formik
                    initialValues={{
                        system: detail.system === null ? '' : detail.system,
                        gl_account: detail.gl_account === null ? '' : detail.gl_account,
                        gl_name: detail.gl_name === null ? '' : detail.gl_name,
                        jenis_transaksi: detail.jenis_transaksi === null ? '' : detail.jenis_transaksi,
                        type_transaksi: detail.type_transaksi === null ? '' : detail.type_transaksi,
                        jenis_pph: detail.jenis_pph === null ? '' : detail.jenis_pph,
                        status_npwp: detail.status_npwp === null ? '' : detail.status_npwp,
                        status_ident: detail.status_ident === null && detail.jenis_pph === 'Non PPh' ? 'Tidak' : 'Ya',
                        tarif_pph: detail.tarif_pph === null ? '' : detail.tarif_pph,
                        dpp_nongrossup: detail.dpp_nongrossup === null ? '' : detail.dpp_nongrossup,
                        dpp_grossup: detail.dpp_grossup === null ? '' : detail.dpp_grossup,
                        tax_type: detail.tax_type === null ? '' : detail.tax_type,
                        tax_code: detail.tax_code === null ? '' : detail.tax_code
                    }}
                    validationSchema={tarifEditSchema}
                    onSubmit={(values) => {this.editTarif(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                System
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="system"
                                value={values.system}
                                onBlur={handleBlur("system")}
                                onChange={handleChange("system")}
                                >
                                    <option>-Pilih-</option>
                                    <option value="SAP">SAP</option>
                                    <option value="REDPINE">REDPINE</option>
                                </Input>
                                {errors.system ? (
                                    <text className={style.txtError}>{errors.system}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                GL Account
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="gl_account"
                                value={values.gl_account}
                                onBlur={handleBlur("gl_account")}
                                onChange={handleChange("gl_account")}
                                />
                                {errors.gl_account ? (
                                    <text className={style.txtError}>{errors.gl_account}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                GL Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="gl_name"
                                value={values.gl_name}
                                onBlur={handleBlur("gl_name")}
                                onChange={handleChange("gl_name")}
                                />
                                {errors.gl_name ? (
                                    <text className={style.txtError}>{errors.gl_name}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jenis Transaksi
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="jenis_transaksi"
                                value={values.jenis_transaksi}
                                onBlur={handleBlur("jenis_transaksi")}
                                onChange={handleChange("jenis_transaksi")}
                                />
                                {errors.jenis_transaksi ? (
                                    <text className={style.txtError}>{errors.jenis_transaksi}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Type Transaksi
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="type_transaksi"
                                value={values.type_transaksi}
                                onBlur={handleBlur("type_transaksi")}
                                onChange={handleChange("type_transaksi")}
                                >
                                    <option>-Pilih-</option>
                                    <option value="Badan">Badan</option>
                                    <option value="Orang Pribadi">Orang Pribadi</option>
                                    <option value="Non Object PPh">Non Object PPh</option>
                                </Input>
                                {errors.type_transaksi ? (
                                    <text className={style.txtError}>{errors.type_transaksi}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jenis PPh
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="jenis_pph"
                                value={values.jenis_pph}
                                onBlur={handleBlur("jenis_pph")}
                                onChange={handleChange("jenis_pph")}
                                />
                                {errors.jenis_pph ? (
                                    <text className={style.txtError}>{errors.jenis_pph}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status NPWP/NIK
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="status_npwp"
                                value={values.status_npwp}
                                onBlur={handleBlur("status_npwp")}
                                onChange={handleChange("status_npwp")}
                                >
                                    <option>-Pilih-</option>
                                    <option value="NPWP">NPWP</option>
                                    <option value="NIK">NIK</option>
                                    <option value="No Need NPWP/NIK">No Need NPWP/NIK</option>
                                </Input>
                                {errors.status_npwp ? (
                                    <text className={style.txtError}>{errors.status_npwp}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tax Type
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="tax_type"
                                value={values.tax_type}
                                onBlur={handleBlur("tax_type")}
                                onChange={handleChange("tax_type")}
                                />
                                {errors.tax_type ? (
                                    <text className={style.txtError}>{errors.tax_type}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tax Code
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="tax_code"
                                value={values.tax_code}
                                onBlur={handleBlur("tax_code")}
                                onChange={handleChange("tax_code")}
                                />
                                {errors.tax_code ? (
                                    <text className={style.txtError}>{errors.tax_code}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tarif PPh
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="tarif_pph"
                                value={values.tarif_pph}
                                onBlur={handleBlur("tarif_pph")}
                                onChange={handleChange("tarif_pph")}
                                />
                                {errors.tarif_pph ? (
                                    <text className={style.txtError}>{errors.tarif_pph}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tarif DPP Non Grossup
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="dpp_nongrossup"
                                value={values.dpp_nongrossup}
                                onBlur={handleBlur("dpp_nongrossup")}
                                onChange={handleChange("dpp_nongrossup")}
                                />
                                {errors.dpp_nongrossup ? (
                                    <text className={style.txtError}>{errors.dpp_nongrossup}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tarif DPP Grossup
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="dpp_grossup"
                                value={values.dpp_grossup}
                                onBlur={handleBlur("dpp_grossup")}
                                onChange={handleChange("dpp_grossup")}
                                />
                                {errors.dpp_grossup ? (
                                    <text className={style.txtError}>{errors.dpp_grossup}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status Identitas
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="status_ident"
                                value={values.status_ident}
                                onBlur={handleBlur("status_ident")}
                                onChange={handleChange("status_ident")}
                                >
                                    <option>-Pilih-</option>
                                    <option value={'Ya'}>Wajib Isi</option>
                                    <option value="Tidak">Tidak Wajib Isi</option>
                                </Input>
                                {errors.status_ident ? (
                                    <text className={style.txtError}>{errors.status_ident}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button className="mr-2" onClick={this.openModalDel} color='danger'>Delete Tarif</Button>
                            </div>
                            <div>
                                <Button  onClick={handleSubmit} color="primary">Save</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master VerifTax</ModalHeader>
                    <ModalBody className={style.modalUpload}>
                        <div className={style.titleModalUpload}>
                            <text>Upload File: </text>
                            <div className={style.uploadFileInput}>
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
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Memperbarui Tarif</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Tarif</div>
                            </div>
                        ) : this.state.confirm === 'del' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menghapus Tarif</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master VerifTax</div>
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
                <Modal isOpen={this.props.tarif.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.tarif.isUpload ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalReset} toggle={this.openModalReset}>
                    <ModalHeader>Change Password</ModalHeader>
                    <Formik
                    initialValues={{
                    confirm_password: '',
                    new_password: ''
                    }}
                    validationSchema={changeSchema}
                    onSubmit={(values) => {this.resetPass(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                            <div>{alertMsg}</div>
                            <div>{alertM}</div>
                        </Alert> */}
                        <div className={style.addModalDepo}>
                            <text className="col-md-4">
                                New password
                            </text>
                            <div className="col-md-8">
                                <Input 
                                type='password' 
                                name="new_password"
                                value={values.new_password}
                                onBlur={handleBlur("new_password")}
                                onChange={handleChange("new_password")}
                                />
                                {errors.new_password ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-4">
                                Confirm password
                            </text>
                            <div className="col-md-8">
                                <Input 
                                type='password' 
                                name="confirm_password"
                                value={values.confirm_password}
                                onBlur={handleBlur("confirm_password")}
                                onChange={handleChange("confirm_password")}
                                />
                                {values.confirm_password !== values.new_password ? (
                                    <text className={style.txtError}>Password do not match</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalReset} color="danger">Close</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                </Formik>
            </Modal>
            <Modal isOpen={this.state.modalDel} toggle={this.openModalDel} centered={true}>
                <ModalBody>
                    <div className={style.modalApprove}>
                        <div>
                            <text>
                                Anda yakin untuk delete tarif {detail.name} ?
                            </text>
                        </div>
                        <div className={style.btnApprove}>
                            <Button color="primary" onClick={() => this.delTarif()}>Ya</Button>
                            <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            </>
        )
    } 
}

const mapStateToProps = state => ({
    user: state.user,
    tarif: state.tarif
})

const mapDispatchToProps = {
    logout: auth.logout,
    addTarif: tarif.addTarif,
    updateTarif: tarif.updateTarif,
    getTarif: tarif.getAllTarif,
    uploadMaster: tarif.uploadMaster,
    nextPage: tarif.nextPage,
    exportMaster: tarif.exportMaster,
    resetError: tarif.resetError,
    resetPassword: user.resetPassword,
    deleteTarif: tarif.deleteTarif
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterTarif)
	