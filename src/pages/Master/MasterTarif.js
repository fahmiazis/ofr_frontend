import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner, UncontrolledDropdown, Row, Col, Badge} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import { PageCard, Toolbar, ToolbarSpacer, FilterField, SearchBox, Pager } from '../../components/ui/Page'
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
import ExcelJS from "exceljs"
import fs from "file-saver"
const {REACT_APP_BACKEND_URL} = process.env

const tarifSchema = Yup.object().shape({
    system: Yup.string().required(),
    gl_account: Yup.number().required(),
    gl_name: Yup.string().required(),
    jenis_transaksi: Yup.string().required(),
    type_transaksi: Yup.string().required(),
    jenis_pph: Yup.string().required(),
    status_npwp: Yup.string().required(),
    tarif_pph: Yup.number().typeError('must be a number').required(),
    dpp_nongrossup: Yup.number().typeError('must be a number').required(),
    dpp_grossup: Yup.number().typeError('must be a number').required(),
    tax_type: Yup.string().required(),
    tax_code: Yup.string().required(),
    grouping: Yup.string().required(),
    min_nominal: Yup.number().transform((val, ori) => ori === '' ? null : val).typeError('must be a number').nullable(),
    max_nominal: Yup.number().transform((val, ori) => ori === '' ? null : val).typeError('must be a number').nullable()
});

const tarifEditSchema = tarifSchema

// nilai persen di db "2%" -> 2 untuk input form
const persenInput = (val) => val === null || val === undefined || val === '' ? '' : `${parseFloat(String(val).split('%')[0])}`
const dateInput = (val) => val === null || val === undefined || val === '' ? '' : moment(val).format('YYYY-MM-DD')
// non active bila end_period sudah lewat
const isActive = (item) => item.end_period === null || moment(item.end_period).isAfter(moment())

const statusOptions = [
    {value: 'all', name: 'All'},
    {value: 'active', name: 'Active'},
    {value: 'non_active', name: 'Non Active'}
]

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
            status: 'all',
            modalDel: false,
            page: 1,
            listData: []
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

    chekApp = (val) => {
        const { listData } = this.state
        const {dataAll} = this.props.tarif
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataAll.length; i++) {
                data.push(dataAll[i].id)
            }
            this.setState({listData: data})
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

    downloadData = () => {
        const {listData} = this.state
        const {dataAll} = this.props.tarif
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
            {header: 'SAP/SCYLLA', key: 'c1'},
            {header: 'GL Account', key: 'c2'},
            {header: 'GL Jurnal', key: 'c3'},
            {header: 'GL Name', key: 'c4'},
            {header: 'Jenis Transaksi', key: 'c5'},
            {header: 'PO/NON PO', key: 'c6'},
            {header: 'Grouping', key: 'c7'},
            {header: 'OP/BADAN', key: 'c8'},
            {header: 'Jenis PPh', key: 'c9'},
            {header: 'NPWP/NIK', key: 'c10'},
            {header: 'WHT Tax Type', key: 'c11'},
            {header: 'WHT Tax Code', key: 'c12'},
            {header: 'Nominal Minimum', key: 'c13'},
            {header: 'Nominal Maximum', key: 'c14'},
            {header: 'Tarif PPh', key: 'c15'},
            {header: 'Tarif DPP Non Grossup', key: 'c16'},
            {header: 'Tarif DPP Grossup', key: 'c17'},
            {header: 'Start Periode', key: 'c18'},
            {header: 'End Periode', key: 'c19'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c1: item.system,
                c2: item.gl_account,
                c3: item.gl_jurnal,
                c4: item.gl_name,
                c5: item.jenis_transaksi,
                c6: item.po,
                c7: item.grouping,
                c8: item.type_transaksi,
                c9: item.jenis_pph,
                c10: item.status_npwp,
                c11: item.tax_type,
                c12: item.tax_code,
                c13: item.min_nominal === null ? '0' : item.min_nominal,
                c14: item.max_nominal === null ? '-' : item.max_nominal,
                c15: item.tarif_pph,
                c16: item.dpp_nongrossup,
                c17: item.dpp_grossup,
                c18: item.start_period === null ? '' : moment(item.start_period).format('DD-MM-YYYY'),
                c19: item.end_period === null ? '' : moment(item.end_period).format('DD-MM-YYYY')
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
              `Master Tarif ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    DownloadTemplate = () => {
        const {listUser} = this.state
        const {dataUser} = this.props.user
        const dataDownload = []
        for (let i = 0; i < listUser.length; i++) {
            for (let j = 0; j < dataUser.length; j++) {
                if (dataUser[j].id === listUser[i]) {
                    dataDownload.push(dataUser[j])
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
            {header: 'SAP/SCYLLA', key: 'c1'},
            {header: 'GL Account', key: 'c2'},
            {header: 'GL Jurnal', key: 'c3'},
            {header: 'GL Name', key: 'c4'},
            {header: 'Jenis Transaksi', key: 'c5'},
            {header: 'PO/NON PO', key: 'c6'},
            {header: 'Grouping', key: 'c7'},
            {header: 'OP/BADAN', key: 'c8'},
            {header: 'Jenis PPh', key: 'c9'},
            {header: 'NPWP/NIK', key: 'c10'},
            {header: 'WHT Tax Type', key: 'c11'},
            {header: 'WHT Tax Code', key: 'c12'},
            {header: 'Nominal Minimum', key: 'c13'},
            {header: 'Nominal Maximum', key: 'c14'},
            {header: 'Tarif PPh', key: 'c15'},
            {header: 'Tarif DPP Non Grossup', key: 'c16'},
            {header: 'Tarif DPP Grossup', key: 'c17'},
            {header: 'Start Periode', key: 'c18'},
            {header: 'End Periode', key: 'c19'}
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
                `Template Master Tarif ${moment().format('DD MMMM YYYY')}.xlsx`
            );
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
            this.getDataCount({limit: this.state.limit, search: this.state.search, page: 1})
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
            this.setState({confirm: values.mode === 'new' ? 'editNew' : 'edit'})
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
        const status = value === undefined || value.status === undefined ? this.state.status : value.status
        await this.props.getTarif(token, limit, search, pages, status)
        this.setState({limit: value === undefined ? 10 : value.limit, search: search, filter: filter, page: pages, status: status})
    }

    changeStatus = (e) => {
        this.getDataCount({limit: this.state.limit, search: this.state.search, status: e.target.value, page: 1})
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

    // field form add / edit tarif, 2 kolom
    renderFormTarif = ({ handleChange, handleBlur, values, errors }) => {
        const field = (name, label, type = 'text', options) => (
            <Col md={6} className="mb-3" key={name}>
                <label className="mb-1">{label}</label>
                <Input
                type={type}
                name={name}
                value={values[name]}
                onBlur={handleBlur(name)}
                onChange={handleChange(name)}
                >
                    {options && <option value="">-Pilih-</option>}
                    {options && options.map(item => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                </Input>
                {errors[name] ? (
                    <text className={style.txtError}>{errors[name]}</text>
                ) : null}
            </Col>
        )
        const opt = (list) => list.map(item => typeof item === 'string' ? {value: item, label: item} : item)
        return (
            <Row>
                {field('system', 'System', 'select', opt(['SAP', 'SCYLLA']))}
                {field('grouping', 'Grouping', 'select', opt(['KASBON', 'NON KASBON']))}
                {field('gl_account', 'GL Account')}
                {field('gl_jurnal', 'GL Jurnal')}
                {field('gl_name', 'GL Name')}
                {field('jenis_transaksi', 'Jenis Transaksi')}
                {field('po', 'PO/NON PO')}
                {field('type_transaksi', 'Type Transaksi (OP/Badan)', 'select', opt(['Badan', 'Orang Pribadi', 'Non Object PPh']))}
                {field('jenis_pph', 'Jenis PPh')}
                {field('status_npwp', 'Status NPWP/NIK', 'select', opt(['NPWP', 'NIK', 'No Need NPWP/NIK']))}
                {field('tax_type', 'Tax Type')}
                {field('tax_code', 'Tax Code')}
                {field('min_nominal', 'Nominal Minimum', 'number')}
                {field('max_nominal', 'Nominal Maximum', 'number')}
                {field('tarif_pph', 'Tarif PPh (%)', 'number')}
                {field('dpp_nongrossup', 'Tarif DPP Non Grossup (%)', 'number')}
                {field('dpp_grossup', 'Tarif DPP Grossup (%)', 'number')}
                {field('status_ident', 'Status Identitas', 'select', [{value: 'Ya', label: 'Wajib Isi'}, {value: 'Tidak', label: 'Tidak Wajib Isi'}])}
                {field('start_period', 'Start Periode', 'date')}
                {field('end_period', 'End Periode', 'date')}
            </Row>
        )
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg, listData,} = this.state
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
                                <PageCard
                                    title="Master Tarif"
                                    actions={
                                        <>
                                            <Button onClick={this.openModalAdd} color="primary">Add</Button>
                                            <Button onClick={this.openModalUpload} color="warning">Upload</Button>
                                            {/* <Button onClick={this.ExportMaster} color="success">Download</Button> */}
                                            <Button onClick={this.downloadData} color="success">Download</Button>
                                        </>
                                    }
                                >
                                    <Toolbar>
                                        <SearchBox
                                            onChange={this.onSearch}
                                            value={this.state.search}
                                            onKeyPress={this.onSearch}
                                        />
                                        <FilterField label="Status" auto>
                                            <Input type="select" value={this.state.status} onChange={this.changeStatus}>
                                                {statusOptions.map(item => (
                                                    <option key={item.value} value={item.value}>{item.name}</option>
                                                ))}
                                            </Input>
                                        </FilterField>
                                        <ToolbarSpacer />
                                        <FilterField label="Show entries">
                                            <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                            <DropdownToggle caret color="light">
                                                {this.state.limit}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 10, search: this.state.search, page: 1})}>10</DropdownItem>
                                                <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 20, search: this.state.search, page: 1})}>20</DropdownItem>
                                                <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 50, search: this.state.search, page: 1})}>50</DropdownItem>
                                                <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 'all', search: this.state.search, page: 1})}>All</DropdownItem>
                                            </DropdownMenu>
                                            </ButtonDropdown>
                                        </FilterField>
                                    </Toolbar>
                                
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
                                                <th>No</th>
                                                <th>SAP/SCYLLA</th>
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
                                                <th>Status</th>
                                                <th>History End Periode</th>
                                                <th>Updated By</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataAll.length !== 0 && dataAll.map(item => {
                                                return (
                                                <tr onClick={()=>this.openModalEdit(this.setState({detail: item}))}>
                                                    <th>
                                                        <input 
                                                        type='checkbox'
                                                        checked={listData.find(element => element === item.id) !== undefined ? true : false}
                                                        onChange={listData.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                        />
                                                    </th>
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
                                                    <td>{item.tarif_pph}</td>
                                                    <td>{item.dpp_nongrossup}</td>
                                                    <td>{item.dpp_grossup}</td>
                                                    <td>{item.start_period === null ? '-' : moment(item.start_period).format('DD MMMM YYYY')}</td>
                                                    <td>{item.end_period === null ? '-' : moment(item.end_period).format('DD MMMM YYYY')}</td>
                                                    <td>
                                                        <Badge color={isActive(item) ? 'success' : 'secondary'}>
                                                            {isActive(item) ? 'Active' : 'Non Active'}
                                                        </Badge>
                                                    </td>
                                                    <td>{item.history_end_period ? moment(item.history_end_period).format('DD MMMM YYYY HH:mm') : '-'}</td>
                                                    <td>{item.updated_by || '-'}</td>
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
                                    <Pager
                                        current={page.currentPage}
                                        pages={page.pages}
                                        onPrev={this.prev}
                                        onNext={this.next}
                                        prevDisabled={page.prevLink === null}
                                        nextDisabled={page.nextLink === null}
                                    />
                                </PageCard>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="lg">
                    <ModalHeader toggle={this.openModalAdd}>Add Master VerifTax</ModalHeader>
                    <Formik
                    initialValues={{
                        system: '',
                        gl_account: '',
                        gl_jurnal: '',
                        gl_name: '',
                        jenis_transaksi: '',
                        type_transaksi: '',
                        jenis_pph: '',
                        po: '',
                        status_npwp: '',
                        status_ident: '',
                        tarif_pph: '',
                        dpp_nongrossup: '',
                        dpp_grossup: '',
                        tax_type: '',
                        tax_code: '',
                        grouping: '',
                        min_nominal: '',
                        max_nominal: '',
                        start_period: '',
                        end_period: ''
                    }}
                    validationSchema={tarifSchema}
                    onSubmit={(values) => {this.addTarif(values)}}
                    >
                        {(formik) => (
                    <ModalBody>
                        {this.renderFormTarif(formik)}
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={formik.handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="lg">
                    <ModalHeader toggle={this.openModalEdit}>Edit Master VerifTax</ModalHeader>
                    <Formik
                    initialValues={{
                        system: detail.system || '',
                        gl_account: detail.gl_account || '',
                        gl_jurnal: detail.gl_jurnal || '',
                        gl_name: detail.gl_name || '',
                        jenis_transaksi: detail.jenis_transaksi || '',
                        type_transaksi: detail.type_transaksi || '',
                        jenis_pph: detail.jenis_pph || '',
                        po: detail.po || '',
                        status_npwp: detail.status_npwp || '',
                        status_ident: detail.status_ident ? detail.status_ident : detail.jenis_pph === 'Non PPh' ? 'Tidak' : 'Ya',
                        tarif_pph: persenInput(detail.tarif_pph),
                        dpp_nongrossup: persenInput(detail.dpp_nongrossup),
                        dpp_grossup: persenInput(detail.dpp_grossup),
                        tax_type: detail.tax_type || '',
                        tax_code: detail.tax_code || '',
                        grouping: detail.grouping || '',
                        min_nominal: detail.min_nominal === null || detail.min_nominal === undefined ? '' : detail.min_nominal,
                        max_nominal: detail.max_nominal === null || detail.max_nominal === undefined ? '' : detail.max_nominal,
                        start_period: dateInput(detail.start_period),
                        end_period: dateInput(detail.end_period),
                        mode: 'update'
                    }}
                    validationSchema={tarifEditSchema}
                    onSubmit={(values) => {this.editTarif(values, detail.id)}}
                    >
                        {(formik) => (
                    <ModalBody>
                        <div className="mb-3">
                            <label className="mb-1"><b>Jenis Update</b></label>
                            <div>
                                <label className="mr-4">
                                    <input
                                    type="radio"
                                    className="mr-2"
                                    name="mode"
                                    checked={formik.values.mode === 'update'}
                                    onChange={() => formik.setFieldValue('mode', 'update')}
                                    />
                                    Ubah data ini saja (koreksi data)
                                </label>
                                <label>
                                    <input
                                    type="radio"
                                    className="mr-2"
                                    name="mode"
                                    checked={formik.values.mode === 'new'}
                                    onChange={() => {
                                        formik.setFieldValue('mode', 'new')
                                        formik.setFieldValue('start_period', moment().format('YYYY-MM-DD'))
                                        formik.setFieldValue('end_period', '')
                                    }}
                                    />
                                    Perubahan tarif (data ini jadi Non Active &amp; dibuat baris baru)
                                </label>
                            </div>
                            {formik.values.mode === 'new' && (
                                <small className="text-muted">
                                    Data ini akan diberi end periode hari ini dan history end periode, lalu data baru dibuat dengan isian di bawah.
                                </small>
                            )}
                        </div>
                        {this.renderFormTarif(formik)}
                        {detail.history_end_period && (
                            <div className="mb-2">
                                <small className="text-muted">
                                    Tergantikan data baru pada {moment(detail.history_end_period).format('DD MMMM YYYY HH:mm')}
                                </small>
                            </div>
                        )}
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button className="mr-2" onClick={this.openModalDel} color='danger'>Delete Tarif</Button>
                            </div>
                            <div>
                                <Button className="mr-2" onClick={formik.handleSubmit} color="primary">Save</Button>
                                <Button onClick={this.openModalEdit}>Cancel</Button>
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
                        ) : this.state.confirm === 'editNew' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Membuat Tarif Baru, Data Lama Non Active</div>
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
                                Anda yakin untuk delete tarif {detail.jenis_transaksi} ?
                            </text>
                        </div>
                        <div className={style.btnApprove}>
                            <Button color="primary" onClick={() => this.delTarif()}>Ya</Button>
                            <Button color="secondary" onClick={this.openModalDel}>Tidak</Button>
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
	