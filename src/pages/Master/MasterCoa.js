import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner, UncontrolledDropdown} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaCoaCircle, FaBars} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel} from 'react-icons/ai'
import depo from '../../redux/actions/depo'
import user from '../../redux/actions/user'
import coa from '../../redux/actions/coa'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import NavBar from '../../components/NavBar'
const {REACT_APP_BACKEND_URL} = process.env

const coaSchema = Yup.object().shape({
    no_coa: Yup.number().required(),
    nama_coa: Yup.string().required(),
    nama_subcoa: Yup.string().required(),
    tipe: Yup.string().required()
});

const coaEditSchema = Yup.object().shape({
    no_coa: Yup.number().required(),
    nama_coa: Yup.string().required(),
    nama_subcoa: Yup.string().required(),
    tipe: Yup.string().required()
});

const changeSchema = Yup.object().shape({
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class MasterCoa extends Component {
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
        const {link} = this.props.coa
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master coa.xlsx"); //or any other extension
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
            url: `${REACT_APP_BACKEND_URL}/masters/coa.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "coa.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    addCoa = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addCoa(token, values)
        const {isAdd} = this.props.coa
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            await this.getDataCount()
            this.openModalAdd()
        }
    }

    delCoa = async () => {
        const token = localStorage.getItem("token")
        const {detail} = this.state
        await this.props.deleteCoa(token, detail.id)
        this.openModalEdit()
        this.setState({confirm: 'del'})
        this.openConfirm()
        await this.getDataCount()
        this.openModalDel()
    }

    next = async () => {
        const { page } = this.props.coa
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.coa
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

    editCoa = async (values, id) => {
        const token = localStorage.getItem("token")
        await this.props.updateCoa(token, values, id)
        const {isUpdate} = this.props.coa
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
        const {isError, isUpload, isExport, isReset} = this.props.coa
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
        const { page } = this.props.coa
        const pages = value === undefined || value.page === undefined ? page.currentPage : value.page
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        const filter = value === undefined || value.filter === undefined ? this.state.filter : value.filter
        console.log(this.state.filter)
        await this.props.getCoa(token, limit, search, pages, filter)
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
        const {dataCoa, isAll, alertM, alertMsg, alertUpload, page, dataRole, dataAll} = this.props.coa
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
                                    <div className={style.titleDashboard}>Master COA</div>
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
                                    <div className='filterCoa'>
                                        {/* <text className='mr-2'>Filter:</text>
                                        <UncontrolledDropdown className={style.drop}>
                                            <DropdownToggle caret color="light">
                                                {this.state.filterName}
                                            </DropdownToggle>
                                            <DropdownMenu 
                                                right
                                                modifiers={{
                                                setMaxHeight: {
                                                    enabled: true,
                                                    order: 890,
                                                    fn: (data) => {
                                                    return {
                                                        ...data,
                                                        styles: {
                                                        ...data.styles,
                                                        overflow: 'auto',
                                                        maxHeight: '400px',
                                                        },
                                                    };
                                                    },
                                                },
                                            }}
                                            >
                                                {dataRole !== undefined && dataRole.map(item => {
                                                    return (
                                                        <DropdownItem className='uppercase' onClick={() => {this.setState({filter: item.id, filterName: item.name}); this.changeFilter({name: item.name, level: item.id})}}>{item.name}</DropdownItem>
                                                    )
                                                })}
                                            </DropdownMenu>
                                        </UncontrolledDropdown> */}
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
                                {isAll === false ? (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>No COA</th>
                                                <th>Nama COA</th>
                                                <th>Nama SUB COA</th>
                                                <th>Tipe</th>
                                            </tr>
                                        </thead>
                                    </Table>
                                        <div className={style.spin}>
                                            <Spinner type="grow" color="primary"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                            <Spinner type="grow" color="warning"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                            <Spinner type="grow" color="info"/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>No COA</th>
                                                <th>Nama COA</th>
                                                <th>Nama SUB COA</th>
                                                <th>Tipe</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataAll.length !== 0 && dataAll.map(item => {
                                                return (
                                                <tr onClick={()=>this.openModalEdit(this.setState({detail: item}))}>
                                                    <th scope="row">{(dataAll.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                    <td>{item.no_coa}</td>
                                                    <td>{item.nama_coa}</td>
                                                    <td>{item.nama_subcoa}</td>
                                                    <td>{item.tipe}</td>
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
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master Coa</ModalHeader>
                    <Formik
                    initialValues={{
                        no_coa: '',
                        nama_coa: '',
                        nama_subcoa: '',
                        tipe: ''
                    }}
                    validationSchema={coaSchema}
                    onSubmit={(values) => {this.addCoa(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                No COA
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="no_coa"
                                value={values.no_coa}
                                onBlur={handleBlur("no_coa")}
                                onChange={handleChange("no_coa")}
                                />
                                {errors.no_coa ? (
                                    <text className={style.txtError}>{errors.no_coa}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama COA
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama_coa"
                                value={values.nama_coa}
                                onBlur={handleBlur("nama_coa")}
                                onChange={handleChange("nama_coa")}
                                />
                                {errors.nama_coa ? (
                                    <text className={style.txtError}>{errors.nama_coa}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Sub COA
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama_subcoa"
                                value={values.nama_subcoa}
                                onBlur={handleBlur("nama_subcoa")}
                                onChange={handleChange("nama_subcoa")}
                                />
                                {errors.nama_subcoa ? (
                                    <text className={style.txtError}>{errors.nama_subcoa}</text>
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
                                name="tipe"
                                value={values.tipe}
                                onChange={handleChange("tipe")}
                                onBlur={handleBlur("tipe")}
                                >   
                                    <option>-Pilih-</option>
                                    <option value="OPS">Operasional</option>
                                    <option value="KLAIM">Klaim</option>
                                </Input>
                                {errors.tipe ? (
                                    <text className={style.txtError}>{errors.tipe}</text>
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
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Coa</ModalHeader>
                    <Formik
                    initialValues={{
                    no_coa: detail.no_coa === null ? '' : detail.no_coa,
                    nama_coa: detail.nama_coa === null ? '' : detail.nama_coa,
                    nama_subcoa: detail.nama_subcoa === null ? '' : detail.nama_subcoa,
                    tipe: detail.tipe === null ? '' : detail.tipe
                    }}
                    validationSchema={coaEditSchema}
                    onSubmit={(values) => {this.editCoa(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                No COA
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="no_coa"
                                value={values.no_coa}
                                onBlur={handleBlur("no_coa")}
                                onChange={handleChange("no_coa")}
                                />
                                {errors.no_coa ? (
                                    <text className={style.txtError}>{errors.no_coa}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama COA
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama_coa"
                                value={values.nama_coa}
                                onBlur={handleBlur("nama_coa")}
                                onChange={handleChange("nama_coa")}
                                />
                                {errors.nama_coa ? (
                                    <text className={style.txtError}>{errors.nama_coa}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Sub COA
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama_subcoa"
                                value={values.nama_subcoa}
                                onBlur={handleBlur("nama_subcoa")}
                                onChange={handleChange("nama_subcoa")}
                                />
                                {errors.nama_subcoa ? (
                                    <text className={style.txtError}>{errors.nama_subcoa}</text>
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
                                name="tipe"
                                value={values.tipe}
                                onChange={handleChange("tipe")}
                                onBlur={handleBlur("tipe")}
                                >   
                                    <option>-Pilih-</option>
                                    <option value="OPS">Operasional</option>
                                    <option value="KLAIM">Klaim</option>
                                </Input>
                                {errors.tipe ? (
                                    <text className={style.txtError}>{errors.tipe}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button className="mr-2" onClick={this.openModalDel} color='danger'>Delete Coa</Button>
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
                    <ModalHeader>Upload Master Coa</ModalHeader>
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
                            <div className={style.sucUpdate}>Berhasil Memperbarui Coa</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Coa</div>
                            </div>
                        ) : this.state.confirm === 'del' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menghapus Coa</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master Coa</div>
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
                <Modal isOpen={this.props.coa.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.coa.isUpload ? true: false} size="sm">
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
                                Anda yakin untuk delete coa {detail.nama_subcoa} ?
                            </text>
                        </div>
                        <div className={style.btnApprove}>
                            <Button color="primary" onClick={() => this.delCoa()}>Ya</Button>
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
    coa: state.coa
})

const mapDispatchToProps = {
    logout: auth.logout,
    addCoa: coa.addCoa,
    updateCoa: coa.updateCoa,
    getCoa: coa.getAllCoa,
    uploadMaster: coa.uploadMaster,
    nextPage: coa.nextPage,
    exportMaster: coa.exportMaster,
    resetError: coa.resetError,
    resetPassword: user.resetPassword,
    deleteCoa: coa.deleteCoa
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterCoa)
	