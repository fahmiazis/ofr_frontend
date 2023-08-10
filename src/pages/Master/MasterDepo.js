/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import depo from '../../redux/actions/depo'
import user from '../../redux/actions/user'
import {connect} from 'react-redux'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import NavBar from '../../components/NavBar'
const {REACT_APP_BACKEND_URL} = process.env

const depoSchema = Yup.object().shape({
    kode_plant: Yup.string().required('must be filled'),
    area: Yup.string().required('must be filled'),
    channel: Yup.string().required('must be filled'),
    distribution: Yup.string().required('must be filled'),
    status_area: Yup.string().required('must be filled'),
    profit_center: Yup.string().required('must be filled'),
    cost_center: Yup.string().required('must be filled'),
    kode_sap_1: Yup.string().required('must be filled'),
    kode_sap_2: Yup.string().validateSync(''),
    nom: Yup.string().required('must be filled'),
    om: Yup.string().required('must be filled'),
    bm: Yup.string().required('must be filled'),
    aos: Yup.string().required('must be filled'),
    pic_finance: Yup.string().required('must be filled'),
    spv_finance: Yup.string().required('must be filled'),
    asman_finance: Yup.string().required('must be filled'),
    manager_finance: Yup.string().required('must be filled'),
    pic_klaim: Yup.string().required('must be filled'),
    manager_klaim: Yup.string().required('must be filled'),
    pic_tax: Yup.string().required('must be filled'),
    manager_tax: Yup.string().required('must be filled'),
})

const genSchema = Yup.object().shape({
    level: Yup.number('must be filled').required('must be filled')
});


class MasterDepo extends Component {
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
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            openModalGen: false,
            colname: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    next = async () => {
        const { page } = this.props.depo
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.depo
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/depo.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "depo.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    ExportMaster = () => {
        const token = localStorage.getItem('token')
        this.props.exportMaster(token)
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
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

    addDepo = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addDepo(token, values)
        const {isAdd} = this.props.depo
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.openModalAdd()
            this.getDataDepo()
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

    editDepo = async (values, id) => {
        const token = localStorage.getItem("token")
        await this.props.updateDepo(token, id, values)
        const {isUpdate} = this.props.depo
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.getDataDepo()
            this.openModalEdit()
        }
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.depo
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataDepo()
             }, 2100)
        } else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        }
    }

    DownloadMaster = () => {
        const {link} = this.props.depo
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master depo.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    componentDidMount() {
        this.getDataDepo()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataDepo({limit: 10, search: this.state.search})
        }
    }

    getDataDepo = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.depo
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getDepo(token, limit, search, page.currentPage)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    generateUser = async (val) => {
        const token = localStorage.getItem("token")
        const {colname} = this.state
        const data = {
            column: colname,
            level: val.level
        }
        await this.props.generateUser(token, data)
        this.setState({confirm: 'generate'})
        this.openConfirm()
        this.modalGen()
    }

    prosesGenerate = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getRole(token)
        this.setState({colname: val})
        this.modalGen()
    }

    modalGen = () => {
        this.setState({openModalGen: !this.state.openModalGen})
    }

    render() {
        const {dropOpen, detail, upload, errMsg} = this.state
        const {dataDepo, isGet, alertM, alertMsg, alertUpload, page} = this.props.depo
        const {dataRole} = this.props.user
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
                                    <div className={style.titleDashboard}>Master Depo</div>
                                </div>
                                <div className={style.secHeadDashboard}>
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem className={style.item} onClick={() => this.getDataDepo({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataDepo({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataDepo({limit: 50, search: ''})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
                                    </div>
                                </div>
                                <div className='secEmail'>
                                    <div className={style.headEmail}>
                                        <Button className='mr-1' onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                        <Button className='mr-1' onClick={this.openModalUpload} color="warning" size="lg">Upload</Button>
                                        <Button className='mr-1' color="success" size="lg" onClick={this.ExportMaster}>Download</Button>
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
                                                <th onClick={() => this.prosesGenerate('aos')}>
                                                    Kode Plant
                                                </th>
                                                <th>Nama Area</th>
                                                <th>Channel</th>
                                                <th>Distribution</th>
                                                <th>Status Depo</th>
                                                <th>Profit Center</th>
                                                <th>Cost Center</th>
                                                <th>Kode SAP 1</th>
                                                <th>Kode SAP 2</th>
                                                <th onClick={() => this.prosesGenerate('nom')}>
                                                    Nama NOM
                                                </th>
                                                <th onClick={() => this.prosesGenerate('om')}>
                                                    Nama OM
                                                </th>
                                                <th onClick={() => this.prosesGenerate('bm')}>
                                                    Nama BM
                                                </th>
                                                <th onClick={() => this.prosesGenerate('aos')}>
                                                    Nama AOS
                                                </th>
                                                <th onClick={() => this.prosesGenerate('pic_finance')}>
                                                    PIC FINANCE
                                                </th>
                                                <th onClick={() => this.prosesGenerate('spv_finance')}>
                                                    SPV FINANCE</th>
                                                <th onClick={() => this.prosesGenerate('asman_finance')}>
                                                    ASMAN FINANCE
                                                </th>
                                                <th onClick={() => this.prosesGenerate('manager_finance')}>
                                                    MANAGER FINANCE
                                                </th>
                                                <th onClick={() => this.prosesGenerate('pic_klaim')}>
                                                    PIC KLAIM
                                                </th>
                                                <th onClick={() => this.prosesGenerate('manager_klaim')}>
                                                    MANAGER KLAIM
                                                </th>
                                                <th onClick={() => this.prosesGenerate('pic_tax')}>
                                                    PIC TAX
                                                </th>
                                                <th onClick={() => this.prosesGenerate('manager_tax')}>
                                                    MANAGER TAX
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataDepo.length !== 0 && dataDepo.map(item => {
                                                return (
                                                <tr onClick={() => this.openModalEdit(this.setState({detail: item}))}>
                                                    <th scope="row">{(dataDepo.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                    <td>{item.kode_plant}</td>
                                                    <td>{item.area}</td>
                                                    <td>{item.channel}</td>
                                                    <td>{item.distribution}</td>
                                                    <td>{item.status_area}</td>
                                                    <td>{item.profit_center}</td>
                                                    <td>{item.cost_center}</td>
                                                    <td>{item.kode_sap_1}</td>
                                                    <td>{item.kode_sap_2}</td>
                                                    <td>{item.nom}</td>
                                                    <td>{item.om}</td>
                                                    <td>{item.bm}</td>
                                                    <td>{item.aos}</td>
                                                    <td>{item.pic_finance}</td>
                                                    <td>{item.spv_finance}</td>
                                                    <td>{item.asman_finance}</td>
                                                    <td>{item.manager_finance}</td>
                                                    <td>{item.pic_klaim}</td>
                                                    <td>{item.manager_klaim}</td>
                                                    <td>{item.pic_tax}</td>
                                                    <td>{item.manager_tax}</td>
                                                </tr>
                                                )})}
                                        </tbody>
                                    </Table>
                                    {dataDepo.length === 0 && (
                                        <div className={style.spin}>
                                            Data tidak ditemukan
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className='infoPageEmail'>
                                        <text>Showing {page.currentPage} of {page.pages} pages</text>
                                        <div className={style.pageButton}>
                                            <button className={[style.btnPrev]} color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            <button className={style.btnPrev} color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal toggle={this.modalGen} isOpen={this.state.openModalGen}>
                    <ModalHeader>Generate User</ModalHeader>
                    <Formik
                    initialValues={{
                    level: null
                    }}
                    validationSchema={genSchema}
                    onSubmit={(values) => {this.generateUser(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Kolom
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="text" 
                                name="colname"
                                disabled
                                value={this.state.colname}
                                />
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                User Level
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                name="level"
                                disabled={this.state.colname === 'aos' ? true : false}
                                value={this.state.colname === 'aos' ? 5 : values.level}
                                onChange={handleChange("level")}
                                onBlur={handleBlur("level")}
                                >
                                    <option>-Pilih Level-</option>
                                    {dataRole.length !== 0 && dataRole.map(item => {
                                        return (
                                            <option value={item.level}>{item.name}</option>
                                        )
                                    })}
                                </Input>
                                {errors.level ? (
                                    <text className={style.txtError}>{errors.level}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" disabled={values.level === null ? true : false} onClick={handleSubmit} color="primary">Generate</Button>
                                <Button className="mr-3" onClick={this.modalGen}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="lg">
                    <ModalHeader>Add Depo</ModalHeader>
                    <Formik
                    initialValues={{
                        area: "",
                        channel: "",
                        distribution: "",
                        status_area: "",
                        profit_center: "",
                        cost_center: "",
                        kode_sap_1: "",
                        kode_sap_2: "",
                        kode_plant: "",
                        nom: "",
                        om: "",
                        bm: "",
                        aos: "",
                        pic_finance: "",
                        spv_finance: "",
                        asman_finance: "",
                        manager_finance: "",
                        pic_klaim: "",
                        manager_klaim: "",
                        pic_tax: "",
                        manager_tax: "",
                    }}
                    validationSchema={depoSchema}
                    onSubmit={(values) => {this.addDepo(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <div className={style.bodyDepo}>
                    <ModalBody className={style.addDepo}>
                        <div className="col-md-6">
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode Plant
                                </text>
                                <div className="col-md-8">
                                    <Input
                                    type="text" 
                                    name="kode_plant"
                                    value={values.kode_plant}
                                    onBlur={handleBlur("kode_plant")}
                                    onChange={handleChange("kode_plant")}
                                    />
                                    {errors.kode_plant ? (
                                        <text className={style.txtError}>{errors.kode_plant}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama Area
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="area"
                                value={values.area}
                                onBlur={handleBlur("area")}
                                onChange={handleChange("area")}
                                />
                                {errors.area ? (
                                    <text className={style.txtError}>{errors.area}</text>
                                ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Channel
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.channel}
                                    onChange={handleChange("channel")}
                                    onBlur={handleBlur("channel")}
                                    >
                                        <option>-Pilih Channel-</option>
                                        <option value="GT">GT</option>
                                        <option value="MT">MT</option>
                                    </Input>
                                    {errors.channel ? (
                                        <text className={style.txtError}>{errors.channel}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Distribution
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.distribution}
                                    onChange={handleChange("distribution")}
                                    onBlur={handleBlur("distribution")}
                                    >
                                        <option>-Pilih Distribution-</option>
                                        <option value="PMA">PMA</option>
                                        <option value="SUB">SUB</option>
                                    </Input>
                                    {errors.distribution ? (
                                        <text className={style.txtError}>{errors.distribution}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Status Area
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.status_area}
                                    onChange={handleChange("status_area")}
                                    onBlur={handleBlur("status_area")}
                                    >
                                        <option>-Pilih Status Depo-</option>
                                        <option value="Cabang SAP">Cabang SAP</option>
                                        <option value="Cabang Scylla">Cabang Scylla</option>
                                        <option value="Depo SAP">Depo SAP</option>
                                        <option value="Depo Scylla">Depo Scylla</option>
                                    </Input>
                                    {errors.status_area ? (
                                        <text className={style.txtError}>{errors.status_area}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Profit Center
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="spv"
                                    value={values.profit_center}
                                    onBlur={handleBlur("profit_center")}
                                    onChange={handleChange("profit_center")}
                                    />
                                    {errors.profit_center ? (
                                        <text className={style.txtError}>{errors.profit_center}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Cost Center
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="spv"
                                    value={values.cost_center}
                                    onBlur={handleBlur("cost_center")}
                                    onChange={handleChange("cost_center")}
                                    />
                                    {errors.cost_center ? (
                                        <text className={style.txtError}>{errors.cost_center}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode SAP 1
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.kode_sap_1}
                                onBlur={handleBlur("kode_sap_1")}
                                onChange={handleChange("kode_sap_1")}
                                />
                                   {errors.kode_sap_1 ? (
                                        <text className={style.txtError}>{errors.kode_sap_1}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode SAP 2
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.kode_sap_2}
                                onBlur={handleBlur("kode_sap_2")}
                                onChange={handleChange("kode_sap_2")}
                                />
                                   {errors.kode_sap_2 ? (
                                        <text className={style.txtError}>{errors.kode_sap_2}</text>
                                    ) : null}
                                </div>    
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama NOM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.nom}
                                onBlur={handleBlur("nom")}
                                onChange={handleChange("nom")}
                                />
                                   {errors.nom ? (
                                        <text className={style.txtError}>{errors.nom}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama OM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.om}
                                onBlur={handleBlur("om")}
                                onChange={handleChange("om")}
                                />
                                    {errors.om ? (
                                        <text className={style.txtError}>{errors.om}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama BM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.bm}
                                onBlur={handleBlur("bm")}
                                onChange={handleChange("bm")}
                                />
                                   {errors.bm ? (
                                        <text className={style.txtError}>{errors.bm}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama AOS
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.aos}
                                onBlur={handleBlur("aos")}
                                onChange={handleChange("aos")}
                                />
                                    {errors.aos ? (
                                        <text className={style.txtError}>{errors.aos}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    PIC FINANCE
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.pic_finance}
                                onBlur={handleBlur("pic_finance")}
                                onChange={handleChange("pic_finance")}
                                />
                                    {errors.pic_finance ? (
                                        <text className={style.txtError}>{errors.pic_finance}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    SPV FINANCE
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.spv_finance}
                                onBlur={handleBlur("spv_finance")}
                                onChange={handleChange("spv_finance")}
                                />
                                    {errors.spv_finance ? (
                                        <text className={style.txtError}>{errors.spv_finance}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    ASMAN FINANCE
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.asman_finance}
                                onBlur={handleBlur("asman_finance")}
                                onChange={handleChange("asman_finance")}
                                />
                                    {errors.asman_finance ? (
                                        <text className={style.txtError}>{errors.asman_finance}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    MANAGER FINANCE
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.manager_finance}
                                onBlur={handleBlur("manager_finance")}
                                onChange={handleChange("manager_finance")}
                                />
                                    {errors.manager_finance ? (
                                        <text className={style.txtError}>{errors.manager_finance}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    PIC KLAIM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.pic_finance}
                                onBlur={handleBlur("pic_finance")}
                                onChange={handleChange("pic_finance")}
                                />
                                    {errors.pic_finance ? (
                                        <text className={style.txtError}>{errors.pic_finance}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    MANAGER KLAIM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.manager_finance}
                                onBlur={handleBlur("manager_finance")}
                                onChange={handleChange("manager_finance")}
                                />
                                    {errors.manager_finance ? (
                                        <text className={style.txtError}>{errors.manager_finance}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    PIC TAX
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.pic_finance}
                                onBlur={handleBlur("pic_finance")}
                                onChange={handleChange("pic_finance")}
                                />
                                    {errors.pic_finance ? (
                                        <text className={style.txtError}>{errors.pic_finance}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    MANAGER TAX
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.manager_finance}
                                onBlur={handleBlur("manager_finance")}
                                onChange={handleChange("manager_finance")}
                                />
                                    {errors.manager_finance ? (
                                        <text className={style.txtError}>{errors.manager_finance}</text>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                        <hr/>
                        <div className={[style.foot]}>
                            <div></div>
                            <div className='mb-3'>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="lg">
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Depo</ModalHeader>
                    <Formik
                    initialValues={{
                        area: detail.area === null ? '' : detail.area,
                        channel: detail.channel === null ? '' : detail.channel,
                        distribution: detail.distribution === null ? '' : detail.distribution,
                        status_area: detail.status_area === null ? '' : detail.status_area,
                        profit_center: detail.profit_center === null ? '' : detail.profit_center,
                        cost_center: detail.cost_center === null ? '' : detail.cost_center,
                        kode_sap_1: detail.kode_sap_1 === null ? '' : detail.kode_sap_1,
                        kode_sap_2: detail.kode_sap_2 === null ? '' : detail.kode_sap_2,
                        kode_plant: detail.kode_plant === null ? '' : detail.kode_plant,
                        nom: detail.nom === null ? '' : detail.nom,
                        om: detail.om === null ? '' : detail.om,
                        bm: detail.bm === null ? '' : detail.bm,
                        aos: detail.aos === null ? '' : detail.aos,
                        pic_finance: detail.pic_finance === null ? '' : detail.pic_finance,
                        spv_finance: detail.spv_finance === null ? '' : detail.spv_finance,
                        asman_finance: detail.asman_finance === null ? '' : detail.asman_finance,
                        manager_finance: detail.manager_finance === null ? '' : detail.manager_finance,
                        pic_klaim: detail.pic_klaim === null ? '' : detail.pic_klaim,
                        manager_klaim: detail.manager_klaim === null ? '' : detail.manager_klaim,
                        pic_tax: detail.pic_tax === null ? '' : detail.pic_tax,
                        manager_tax: detail.manager_tax === null ? '' : detail.manager_tax,
                    }}
                    validationSchema={depoSchema}
                    onSubmit={(values) => {this.editDepo(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <div className={style.bodyDepo}>
                        <ModalBody className={style.addDepo}>
                        <div className="col-md-6">
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode Plant
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name"
                                name="spv"
                                value={values.kode_plant}
                                onBlur={handleBlur("kode_plant")}
                                onChange={handleChange("kode_plant")}
                                />
                                   {errors.kode_plant ? (
                                        <text className={style.txtError}>{errors.kode_plant}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama Area
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="area"
                                value={values.area}
                                onBlur={handleChange("area")}
                                onChange={handleBlur("area")}
                                />
                                {errors.area ? (
                                    <text className={style.txtError}>{errors.area}</text>
                                ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Channel
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.channel}
                                    onChange={handleChange("channel")}
                                    onBlur={handleBlur("channel")}
                                    >
                                        <option>-Pilih Channel-</option>
                                        <option value="GT">GT</option>
                                        <option value="MT">MT</option>
                                    </Input>
                                    {errors.channel ? (
                                        <text className={style.txtError}>{errors.channel}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Distribution
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.distribution}
                                    onChange={handleChange("distribution")}
                                    onBlur={handleBlur("distribution")}
                                    >
                                        <option>-Pilih Distribution-</option>
                                        <option value="PMA">PMA</option>
                                        <option value="SUB">SUB</option>
                                    </Input>
                                    {errors.distribution ? (
                                        <text className={style.txtError}>{errors.distribution}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Status Depo
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.status_area}
                                    onChange={handleChange("status_area")}
                                    onBlur={handleBlur("status_area")}
                                    >
                                        <option>-Pilih Status Depo-</option>
                                        <option value="Cabang SAP">Cabang SAP</option>
                                        <option value="Cabang Scylla">Cabang Scylla</option>
                                        <option value="Depo SAP">Depo SAP</option>
                                        <option value="Depo Scylla">Depo Scylla</option>
                                    </Input>
                                    {errors.status_area ? (
                                        <text className={style.txtError}>{errors.status_area}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Profit Center
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="spv"
                                    value={values.profit_center}
                                    onBlur={handleBlur("profit_center")}
                                    onChange={handleChange("profit_center")}
                                    />
                                    {errors.profit_center ? (
                                        <text className={style.txtError}>{errors.profit_center}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Cost Center
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="spv"
                                    value={values.cost_center}
                                    onBlur={handleBlur("cost_center")}
                                    onChange={handleChange("cost_center")}
                                    />
                                    {errors.cost_center ? (
                                        <text className={style.txtError}>{errors.cost_center}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode SAP 1
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.kode_sap_1}
                                onBlur={handleBlur("kode_sap_1")}
                                onChange={handleChange("kode_sap_1")}
                                />
                                   {errors.kode_sap_1 ? (
                                        <text className={style.txtError}>{errors.kode_sap_1}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode SAP 2
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.kode_sap_2}
                                onBlur={handleBlur("kode_sap_2")}
                                onChange={handleChange("kode_sap_2")}
                                />
                                   {errors.kode_sap_2 ? (
                                        <text className={style.txtError}>{errors.kode_sap_2}</text>
                                    ) : null}
                                </div>    
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama NOM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.nom}
                                onBlur={handleBlur("nom")}
                                onChange={handleChange("nom")}
                                />
                                   {errors.nom ? (
                                        <text className={style.txtError}>{errors.nom}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama OM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.om}
                                onBlur={handleBlur("om")}
                                onChange={handleChange("om")}
                                />
                                    {errors.om ? (
                                        <text className={style.txtError}>{errors.om}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama BM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="bm"
                                value={values.bm}
                                onBlur={handleBlur("bm")}
                                onChange={handleChange("bm")}
                                />
                                    {errors.bm ? (
                                        <text className={style.txtError}>{errors.bm}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama AOS
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.aos}
                                onBlur={handleBlur("aos")}
                                onChange={handleChange("aos")}
                                />
                                    {errors.aos ? (
                                        <text className={style.txtError}>{errors.aos}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    PIC FINANCE
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.pic_finance}
                                onBlur={handleBlur("pic_finance")}
                                onChange={handleChange("pic_finance")}
                                />
                                    {errors.pic_finance ? (
                                        <text className={style.txtError}>{errors.pic_finance}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    SPV FINANCE
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.spv_finance}
                                onBlur={handleBlur("spv_finance")}
                                onChange={handleChange("spv_finance")}
                                />
                                    {errors.spv_finance ? (
                                        <text className={style.txtError}>{errors.spv_finance}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    ASMAN FINANCE
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.asman_finance}
                                onBlur={handleBlur("asman_finance")}
                                onChange={handleChange("asman_finance")}
                                />
                                    {errors.asman_finance ? (
                                        <text className={style.txtError}>{errors.asman_finance}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    MANAGER FINANCE
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="spv"
                                value={values.manager_finance}
                                onBlur={handleBlur("manager_finance")}
                                onChange={handleChange("manager_finance")}
                                />
                                    {errors.manager_finance ? (
                                        <text className={style.txtError}>{errors.manager_finance}</text>
                                    ) : null}
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        PIC KLAIM
                                    </text>
                                    <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="spv"
                                    value={values.pic_klaim}
                                    onBlur={handleBlur("pic_klaim")}
                                    onChange={handleChange("pic_klaim")}
                                    />
                                        {errors.pic_klaim ? (
                                            <text className={style.txtError}>{errors.pic_klaim}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        MANAGER KLAIM
                                    </text>
                                    <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="spv"
                                    value={values.manager_klaim}
                                    onBlur={handleBlur("manager_klaim")}
                                    onChange={handleChange("manager_klaim")}
                                    />
                                        {errors.manager_klaim ? (
                                            <text className={style.txtError}>{errors.manager_klaim}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        PIC TAX
                                    </text>
                                    <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="spv"
                                    value={values.pic_tax}
                                    onBlur={handleBlur("pic_tax")}
                                    onChange={handleChange("pic_tax")}
                                    />
                                        {errors.pic_tax ? (
                                            <text className={style.txtError}>{errors.pic_tax}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        MANAGER TAX
                                    </text>
                                    <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="spv"
                                    value={values.manager_tax}
                                    onBlur={handleBlur("manager_tax")}
                                    onChange={handleChange("manager_tax")}
                                    />
                                        {errors.manager_tax ? (
                                            <text className={style.txtError}>{errors.manager_tax}</text>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div className='mb-3'>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalEdit}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master Depo</ModalHeader>
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
                            <div className={style.sucUpdate}>Berhasil Memperbarui Depo</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Depo</div>
                            </div>
                        ) : this.state.confirm === 'generate' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil generate user</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master Depo</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.depo.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.depo.isUpload ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    depo: state.depo,
    user: state.user
})

const mapDispatchToProps = {
    logout: auth.logout,
    addDepo: depo.addDepo,
    updateDepo: depo.updateDepo,
    getDepo: depo.getDepo,
    resetError: depo.resetError,
    uploadMaster: depo.uploadMaster,
    nextPage: depo.nextPage,
    exportMaster: depo.exportMaster,
    getRole: user.getRole,
    generateUser: user.generateUser
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterDepo)
