import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner, UncontrolledDropdown} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaBars} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel} from 'react-icons/ai'
import depo from '../../redux/actions/depo'
import user from '../../redux/actions/user'
import faktur from '../../redux/actions/faktur'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import moment from 'moment'
import NavBar from '../../components/NavBar'
import ExcelJS from "exceljs"
import fs from "file-saver"
const {REACT_APP_BACKEND_URL} = process.env

const fakturSchema = Yup.object().shape({
    no_faktur: Yup.string().required(),
    tgl_faktur: Yup.date().required(),
    npwp: Yup.string().required(),
    nama: Yup.string().required(),
    jumlah_dpp: Yup.string().required(),
    jumlah_ppn: Yup.string().required()
});

const fakturEditSchema = Yup.object().shape({
    no_faktur: Yup.string().required(),
    tgl_faktur: Yup.date().required(),
    npwp: Yup.string().required(),
    nama: Yup.string().required(),
    jumlah_dpp: Yup.string().required(),
    jumlah_ppn: Yup.string().required()
});

const changeSchema = Yup.object().shape({
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class MasterFaktur extends Component {
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
            page: 1,
            listData: [],
            isLoading: false,
            rawDel: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    downloadTemplate = () => {
        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data klaim')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        ws.columns = [					
            {header: 'NOMOR_FAKTUR', key: 'c1'},
            {header: 'TANGGAL_FAKTUR', key: 'c2'},
            {header: 'NPWP', key: 'c3'},
            {header: 'NAMA', key: 'c4'},
            {header: 'JUMLAH_DPP', key: 'c5'},
            {header: 'JUMLAH_PPN', key: 'c6'},
        ]

        ws.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                cell.border = borderStyles;
            })
        })

        ws.columns.forEach(column => {
            const lengths = column.values.map(v => v.toString().length)
            const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
            column.width = maxLength + 5
        })

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `Template upload faktur ${moment().format('DD MMMM YYYY')}.xlsx`
            )
        })
    }

    chekApp = (val) => {
        const { listData } = this.state
        const {dataAll} = this.props.faktur
        if (val === 'all') {
            this.setState({isLoading: true})
            const data = []
            for (let i = 0; i < dataAll.length; i++) {
                data.push(dataAll[i].id)
            }
            this.setState({listData: data})
            setTimeout(() => {
                this.setState({ isLoading: false })
            }, 1000)
        } else {
            listData.push(val)
            this.setState({listData: listData})
        }
    }

    chekRej = (val) => {
        const {listData} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listData: data})
        } else {
            const data = []
            for (let i = 0; i < listData.length; i++) {
                if (listData[i] === val) {
                    data.push()
                } else {
                    data.push(listData[i])
                }
            }
            this.setState({listData: data})
        }
    }

    deleteData = async () => {
        const token = localStorage.getItem("token")
        const {listData} = this.state
        const data = {
            list: listData
        }
        await this.props.deleteRaw(token, data)
        this.openRawdelete()
        this.setState({confirm: 'del'})
        this.openConfirm()
        this.getDataCount()
    }

    openRawdelete = () => {
        this.setState({rawDel: !this.state.rawDel})
    }

    downloadData = () => {
        const {listData} = this.state
        const {dataAll} = this.props.faktur
        const dataDownload = []
        for (let i = 0; i < listData.length; i++) {
            for (let j = 0; j < dataAll.length; j++) {
                if (dataAll[j].id === listData[i]) {
                    dataDownload.push(dataAll[j])
                }
            }
        }

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data user')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }
        

        ws.columns = [
            {header: 'NOMOR_FAKTUR', key: 'c1'},
            {header: 'TANGGAL_FAKTUR', key: 'c2'},
            {header: 'NPWP', key: 'c3'},
            {header: 'NAMA', key: 'c4'},
            {header: 'JUMLAH_DPP', key: 'c5'},
            {header: 'JUMLAH_PPN', key: 'c6'},
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c1: item.no_faktur,
                c2: moment(item.tgl_faktur).format('DD/MM/YYYY'),
                c3: item.npwp,
                c4: item.nama,
                c5: item.jumlah_dpp,
                c6: item.jumlah_ppn,
            }
        )
        ) })

        ws.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
              cell.border = borderStyles;
            })
          })

          ws.columns.forEach(column => {
            const lengths = column.values.map(v => v.toString().length)
            const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
            column.width = maxLength + 5
        })

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Master Faktur ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
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
        const {link} = this.props.faktur
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Master Faktur ${moment().format('DD MMMM YYYY')}.xlsx`); //or any other extension
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
        console.log(this.state.detail)
        this.setState({modalEdit: !this.state.modalEdit})
    }
    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }
    openModalDownload = () => {
        this.setState({modalDownload: !this.state.modalDownload})
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/faktur.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "template faktur.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    addFaktur = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addFaktur(token, values)
        const {isAdd} = this.props.faktur
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            await this.getDataCount()
            this.openModalAdd()
        }
    }

    delFaktur = async () => {
        const token = localStorage.getItem("token")
        const {detail} = this.state
        await this.props.deleteFaktur(token, detail.id)
        this.openModalEdit()
        this.setState({confirm: 'del'})
        this.openConfirm()
        await this.getDataCount()
        this.openModalDel()
    }

    next = async () => {
        const { page } = this.props.faktur
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.faktur
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataCount({limit: 10, search: this.state.search, page: 1})
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

    editFaktur = async (values, id) => {
        const token = localStorage.getItem("token")
        await this.props.updateFaktur(token, values, id)
        const {isUpdate} = this.props.faktur
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
        const {isError, isUpload, isExport, isReset} = this.props.faktur
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
        const { page } = this.props.faktur
        const pages = value === undefined || value.page === undefined ? page.currentPage : value.page
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        const filter = value === undefined || value.filter === undefined ? this.state.filter : value.filter
        console.log(this.state.filter)
        await this.props.getFaktur(token, limit, search, pages, filter)
        this.setState({limit: value === undefined ? 10 : value.limit, search: search, filter: filter, page: pages, listData: []})
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
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg, listData} = this.state
        const {dataFaktur, isAll, alertM, alertMsg, alertUpload, page, dataRole, dataAll} = this.props.faktur
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
                                    <div className={style.titleDashboard}>Master Faktur</div>
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
                                            {/* <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 'all', search: ''})}>All</DropdownItem> */}
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
                                    </div>
                                    <div className='filterFaktur'>
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
                                        <Button className='mr-1' onClick={this.openModalDownload} color="success" size="lg">Download</Button>
                                        <Button disabled={listData.length === 0 ? true : false} className='mr-1' onClick={this.openRawdelete} color="danger" size="lg">Delete</Button>
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
                                {dataAll.length === 0 ? (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>NO</th>
                                                <th>NO FAKTUR</th>
                                                <th>TGL FAKTUR</th>
                                                <th>NPWP</th>
                                                <th>NAMA</th>
                                                <th>JUMLAH DPP</th>
                                                <th>JUMLAH PPN</th>
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
                                                <th>
                                                    <input  
                                                    className='mr-2'
                                                    type='checkbox'
                                                    checked={listData.length === 0 ? false : listData.length === dataAll.length ? true : false}
                                                    onChange={() => listData.length === dataAll.length ? this.chekRej('all') : this.chekApp('all')}
                                                    />
                                                    {/* Select */}
                                                </th>
                                                <th>NO</th>
                                                <th>NO FAKTUR</th>
                                                <th>TGL FAKTUR</th>
                                                <th>NPWP</th>
                                                <th>NAMA</th>
                                                <th>JUMLAH DPP</th>
                                                <th>JUMLAH PPN</th>
                                                <th>STATUS</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataAll.length !== 0 && dataAll.map(item => {
                                                return (
                                                <tr >
                                                    <th>
                                                        <input 
                                                        type='checkbox'
                                                        checked={listData.find(element => element === item.id) !== undefined ? true : false}
                                                        onChange={listData.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                        />
                                                        {/* Select */}
                                                    </th>
                                                    <th scope="row">{(dataAll.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                    <td>{item.no_faktur}</td>
                                                    <td>{moment(item.tgl_faktur).format('DD/MM/YYYY')}</td>
                                                    <td>{item.npwp}</td>
                                                    <td>{item.nama}</td>
                                                    <td>{item.jumlah_dpp}</td>
                                                    <td>{item.jumlah_ppn}</td>
                                                    <td>
                                                        {item.status !== null ? 'used' 
                                                        : item.force === 1 ? 'available'
                                                        : Math.floor(Math.abs(moment().format('M') - moment(item.tgl_faktur).format('M'))) > 3 ? 'expired'
                                                        : 'available'
                                                        }
                                                    </td>
                                                    <td className='rowCenter'>
                                                        <Button 
                                                        onClick={()=>this.openModalEdit(this.setState({detail: item}))} 
                                                        className='mb-1 mr-1' 
                                                        color='success'>
                                                            Update
                                                        </Button>
                                                        
                                                        {item.status !== null && (
                                                            <Button 
                                                            onClick={()=>this.openModalEdit(this.setState({detail: item}))} 
                                                            className='mb-1 mr-1' 
                                                            color='success'>
                                                                Transaksi
                                                            </Button>
                                                        )}
                                                        
                                                        <Button 
                                                        className="" 
                                                        onClick={() => this.openModalDel(this.setState({detail: item}))} 
                                                        color='danger'>
                                                            Delete
                                                        </Button>
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
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master Faktur</ModalHeader>
                    <Formik
                    initialValues={{
                        no_faktur: '',
                        tgl_faktur: '',
                        npwp: '',
                        nama: '',
                        jumlah_dpp: '',
                        jumlah_ppn: ''
                    }}
                    validationSchema={fakturSchema}
                    onSubmit={(values) => {this.addFaktur(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                No Faktur
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                value={values.no_faktur}
                                onBlur={handleBlur("no_faktur")}
                                onChange={handleChange("no_faktur")}
                                />
                                {errors.no_faktur ? (
                                    <text className={style.txtError}>{errors.no_faktur}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tgl Faktur
                            </text>
                            <div className="col-md-9">
                                <Input
                                type= "date" 
                                className="inputRinci"
                                value={values.tgl_faktur}
                                onBlur={handleBlur("tgl_faktur")}
                                onChange={handleChange("tgl_faktur")}
                                />
                                {errors.tgl_faktur ? (
                                    <text className={style.txtError}>{errors.tgl_faktur}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                NPWP
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="npwp"
                                value={values.npwp}
                                onBlur={handleBlur("npwp")}
                                onChange={handleChange("npwp")}
                                />
                                {errors.npwp ? (
                                    <text className={style.txtError}>{errors.npwp}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama"
                                value={values.nama}
                                onBlur={handleBlur("nama")}
                                onChange={handleChange("nama")}
                                />
                                {errors.nama ? (
                                    <text className={style.txtError}>{errors.nama}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jumlah DPP
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="jumlah_dpp"
                                value={values.jumlah_dpp}
                                onBlur={handleBlur("jumlah_dpp")}
                                onChange={handleChange("jumlah_dpp")}
                                />
                                {errors.jumlah_dpp ? (
                                    <text className={style.txtError}>{errors.jumlah_dpp}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jumlah PPN
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="jumlah_ppn"
                                value={values.jumlah_ppn}
                                onBlur={handleBlur("jumlah_ppn")}
                                onChange={handleChange("jumlah_ppn")}
                                />
                                {errors.jumlah_ppn ? (
                                    <text className={style.txtError}>{errors.jumlah_ppn}</text>
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
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Faktur</ModalHeader>
                    <Formik
                    initialValues={{
                        no_faktur: detail.no_faktur === null ? '' : detail.no_faktur,
                        tgl_faktur: detail.tgl_faktur === null ? '' : detail.tgl_faktur,
                        npwp: detail.npwp === null ? '' : detail.npwp,
                        nama: detail.nama === null ? '' : detail.nama,
                        jumlah_dpp: detail.jumlah_dpp === null ? '' : detail.jumlah_dpp,
                        jumlah_ppn: detail.jumlah_ppn === null ? '' : detail.jumlah_ppn
                    }}
                    validationSchema={fakturEditSchema}
                    onSubmit={(values) => {this.editFaktur(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                No Faktur
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                value={values.no_faktur}
                                onBlur={handleBlur("no_faktur")}
                                onChange={handleChange("no_faktur")}
                                />
                                {errors.no_faktur ? (
                                    <text className={style.txtError}>{errors.no_faktur}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tgl Faktur
                            </text>
                            <div className="col-md-9">
                                <Input
                                type= "date" 
                                className="inputRinci"
                                value={moment(values.tgl_faktur).format('YYYY-MM-DD')}
                                onBlur={handleBlur("tgl_faktur")}
                                onChange={handleChange("tgl_faktur")}
                                />
                                {errors.tgl_faktur ? (
                                    <text className={style.txtError}>{errors.tgl_faktur}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                NPWP
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="npwp"
                                value={values.npwp}
                                onBlur={handleBlur("npwp")}
                                onChange={handleChange("npwp")}
                                />
                                {errors.npwp ? (
                                    <text className={style.txtError}>{errors.npwp}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama"
                                value={values.nama}
                                onBlur={handleBlur("nama")}
                                onChange={handleChange("nama")}
                                />
                                {errors.nama ? (
                                    <text className={style.txtError}>{errors.nama}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jumlah DPP
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="jumlah_dpp"
                                value={values.jumlah_dpp}
                                onBlur={handleBlur("jumlah_dpp")}
                                onChange={handleChange("jumlah_dpp")}
                                />
                                {errors.jumlah_dpp ? (
                                    <text className={style.txtError}>{errors.jumlah_dpp}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jumlah PPN
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="jumlah_ppn"
                                value={values.jumlah_ppn}
                                onBlur={handleBlur("jumlah_ppn")}
                                onChange={handleChange("jumlah_ppn")}
                                />
                                {errors.jumlah_ppn ? (
                                    <text className={style.txtError}>{errors.jumlah_ppn}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button className="mr-2" onClick={this.openModalDel} color='danger'>Delete Faktur</Button>
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
                    <ModalHeader>Upload Master Faktur</ModalHeader>
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
                            <Button color="info" onClick={this.downloadTemplate}>Download Template</Button>
                            <Button color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadMaster}>Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal toggle={this.openModalDownload} isOpen={this.state.modalDownload} centered>
                    <ModalHeader className='colCenter'>Pilih Tipe Download</ModalHeader>
                    <ModalBody className='colCenter'>
                        <div className='rowCenter'>
                            <Button color="info" onClick={this.ExportMaster}>Download All Data</Button>
                            <Button color="primary" className='ml-2' disabled={this.state.listData.length === 0 ? true : false } onClick={this.downloadData}>Download Selected Data</Button>
                            {/* <Button onClick={this.openModalUpload}>Cancel</Button> */}
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Memperbarui Faktur</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Faktur</div>
                            </div>
                        ) : this.state.confirm === 'del' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menghapus Faktur</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master Faktur</div>
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
                <Modal isOpen={this.props.faktur.isLoading || this.state.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.faktur.isUpload ? true: false} size="sm">
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
                                Anda yakin untuk delete faktur {detail.no_ktp} ?
                            </text>
                        </div>
                        <div className={style.btnApprove}>
                            <Button color="primary" onClick={() => this.delFaktur()}>Ya</Button>
                            <Button color="secondary" onClick={this.openModalDel}>Tidak</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.rawDel} toggle={this.openRawdelete} centered={true}>
                <ModalBody>
                    <div className={style.modalApprove}>
                        <div className='colCenter'>
                            <text className='mb-2'>
                                Anda yakin untuk delete list faktur berikut ?
                            </text>
                            {dataAll.map(item => {
                                return (
                                    listData.find((x) => x === item.id) !== undefined ? (
                                        <div>{item.no_faktur}</div>
                                    ) : (
                                        null
                                    )
                                )
                            })}
                        </div>
                        <div className={style.btnApprove}>
                            <Button color="primary" onClick={() => this.deleteData()}>Ya</Button>
                            <Button color="secondary" onClick={this.openRawdelete}>Tidak</Button>
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
    faktur: state.faktur
})

const mapDispatchToProps = {
    logout: auth.logout,
    addFaktur: faktur.addFaktur,
    updateFaktur: faktur.updateFaktur,
    getFaktur: faktur.getAllFaktur,
    uploadMaster: faktur.uploadMaster,
    nextPage: faktur.nextPage,
    exportMaster: faktur.exportMaster,
    resetError: faktur.resetError,
    resetPassword: user.resetPassword,
    deleteFaktur: faktur.deleteFaktur,
    deleteRaw: faktur.deleteRaw
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterFaktur)
	