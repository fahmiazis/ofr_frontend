import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner, UncontrolledDropdown} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaFinanceCircle, FaBars} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel, AiOutlineClose} from 'react-icons/ai'
import depo from '../../redux/actions/depo'
import user from '../../redux/actions/user'
import finance from '../../redux/actions/finance'
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

const financeSchema = Yup.object().shape({
    kode_plant: Yup.string().required(),
    profit_center: Yup.string().required(),
    region: Yup.string().required(),
    inisial: Yup.string().required(),
    rek_spending: Yup.string().required(),
    rek_zba: Yup.string().required(),
    rek_bankcoll: Yup.string().required(),
    type_live: Yup.string().required(),
    gl_kk: Yup.string().required(),
    area: Yup.string().required(),
    pagu: Yup.string().required(),
    pic_finance: Yup.string().required(),
    spv_finance: Yup.string().required(),
    spv2_finance: Yup.string().required(),
    asman_finance: Yup.string().required(),
    manager_finance: Yup.string().required(),
    pic_tax: Yup.string().required(),
    spv_tax: Yup.string().required(),
    asman_tax: Yup.string().required(),
    manager_tax: Yup.string().required(),
    aos: Yup.string().required(),
    rom: Yup.string().required(),
    bm: Yup.string().required(),
    nom: Yup.string().required(),
    rbm: Yup.string().required()
});


const changeSchema = Yup.object().shape({
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class MasterFinance extends Component {
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
            fileStruktur: '',
            limit: 10,
            search: '',
            modalReset: false,
            filter: null,
            filterName: 'All',
            modalDel: false,
            page: 1,
            listData: [],
            pickUpload: false,
            modalStruktur: false
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
        const {link} = this.props.finance
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master finance.xlsx"); //or any other extension
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

    openPickUpload = () => {
        this.setState({pickUpload: !this.state.pickUpload})
    }

    openModalStruktur = () => {
        this.setState({modalStruktur: !this.state.modalStruktur})
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/finance.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master finance.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    downloadStrukur = () => {
        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }
        

        ws.columns = [, , , 
            {header: 'KODE PLANT', key: 'c1'},
            {header: 'AOS', key: 'c2'},
            {header: 'ROM', key: 'c3'},
            {header: 'BM', key: 'c4'}
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
              `Template Struktur Area ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    addFinance = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addFinance(token, values)
        const {isAdd} = this.props.finance
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            await this.getDataCount()
            this.openModalAdd()
        }
    }

    delFinance = async () => {
        const token = localStorage.getItem("token")
        const {detail} = this.state
        await this.props.deleteFinance(token, detail.id)
        this.openModalEdit()
        this.setState({confirm: 'del'})
        this.openConfirm()
        await this.getDataCount()
        this.openModalDel()
    }

    next = async () => {
        const { page } = this.props.finance
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.finance
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
        this.setState({confirm: 'upload'})
        this.openConfirm()
        this.setState({modalUpload: false, pickUpload: false})
        setTimeout(() => {
            this.getDataCount()
        }, 100)
    }

    onChangeStruktur = e => {
        const {size, type} = e.target.files[0]
        if (size >= 5120000) {
            this.setState({errMsg: "Maximum upload size 5 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' ){
            this.setState({errMsg: 'Invalid file type. Only excel files are allowed.'})
            this.uploadAlert()
        } else {
            this.setState({fileStruktur: e.target.files[0]})
        }
    }

    uploadStruktur = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileStruktur)
        await this.props.uploadStruktur(token, data)
        this.setState({confirm: 'upload'})
        this.openConfirm()
        this.setState({modalStruktur: false, pickUpload: false})
        setTimeout(() => {
            this.getDataCount()
        }, 100)
    }

    editFinance = async (values, id) => {
        const token = localStorage.getItem("token")
        await this.props.updateFinance(token, values, id)
        const {isUpdate} = this.props.finance
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
        const {isError, isUpload, isExport, isReset, isStruktur} = this.props.finance
        if (isError) {
            this.props.resetError()
        } else if (isReset) {
            this.setState({confirm: 'reset'})
            this.props.resetError()
            this.openModalReset()
            this.openConfirm()
        } else if (isUpload === false) {
            this.setState({confirm: 'failUpload'})
            this.openConfirm()
            this.props.resetError()
        } else if (isExport) {
            this.DownloadMaster()
            this.props.resetError()
        } else if (isStruktur === false) {
            this.setState({confirm: 'failUpload'})
            this.openConfirm()
            this.props.resetError()
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem("token")
        this.getDataCount()
    }

    getDataCount = async (value) => {
        const { page } = this.props.finance
        const pages = value === undefined || value.page === undefined ? page.currentPage : value.page
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        const filter = value === undefined || value.filter === undefined ? this.state.filter : value.filter
        console.log(this.state.filter)
        await this.props.getFinance(token, limit, search, pages, filter)
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

    chekApp = (val) => {
        const { listData } = this.state
        const {dataAll} = this.props.finance
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
        const {dataAll} = this.props.finance
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
            {header: 'KODE PLANT', key: 'c2'}, 
            {header: 'PROFIT/COST CENTER', key: 'c3'}, 
            {header: 'NAMA AREA', key: 'c4'}, 
            {header: 'REGION', key: 'c5'}, 
            {header: 'INISIAL', key: 'c6'}, 
            {header: 'NO REK SPENDING CARD', key: 'c7'}, 
            {header: 'NO REK ZBA', key: 'c8'}, 
            {header: 'NO REK BANK COLL', key: 'c9'}, 
            {header: 'PAGU IKK', key: 'c10'}, 
            {header: 'SISTEM AREA', key: 'c11'}, 
            {header: 'PIC CONSOLE', key: 'c12'}, 
            {header: 'SPV FINANCE 1', key: 'c13'}, 
            {header: 'SPV FINANCE 2', key: 'c14'}, 
            {header: 'ASST MGR FIN', key: 'c15'}, 
            {header: 'MGR FIN', key: 'c16'}, 
            {header: 'PIC TAX', key: 'c17'}, 
            {header: 'SPV TAX', key: 'c18'}, 
            {header: 'ASMEN TAX', key: 'c19'}, 
            {header: 'MGR TAX', key: 'c20'}, 
            {header: 'AOS', key: 'c21'}, 
            {header: 'ROM', key: 'c22'}, 
            {header: 'BM', key: 'c23'}, 
            {header: 'NOM', key: 'c24'}, 
            {header: 'RBM', key: 'c25'}, 
            {header: 'CHANNEL', key: 'c26'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c2: item.kode_plant,
                c3: item.profit_center,
                c4: item.area,
                c5: item.region,
                c6: item.inisial,
                c7: item.rek_spending,
                c8: item.rek_zba,
                c9: item.rek_bankcoll,
                c10: item.pagu,
                c11: item.type_live,
                c12: item.pic_finance,
                c13: item.spv_finance,
                c14: item.spv2_finance,
                c15: item.asman_finance,
                c16: item.manager_finance,
                c17: item.pic_tax,
                c18: item.spv_tax,
                c19: item.asman_tax,
                c20: item.manager_tax,
                c21: item.aos,
                c22: item.rom,
                c23: item.bm,
                c24: item.nom,
                c25: item.rbm,
                c26: item.channel
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
              `Master Finance ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    render() {
        const {isOpen, dropOpen, listData, detail, level, upload, errMsg} = this.state
        const {dataFinance, isAll, alertM, alertMsg, alertUpload, page, dataRole, dataAll} = this.props.finance
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
                                    <div className={style.titleDashboard}>Master Finance</div>
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
                                            <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 'all', search: ''})}>All</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
                                    </div>
                                    <div className='filterFinance'>
                                    </div>
                                </div>
                                <div className='secEmail'>
                                    <div className={style.headEmail}>
                                        <Button className='mr-1' onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                        <Button className='mr-1' onClick={this.openPickUpload} color="warning" size="lg">Upload</Button>
                                        <Button className='mr-1' onClick={this.downloadData} color="success" size="lg">Download</Button>
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
                                                <th>No</th>
                                                <th>Kode Plant</th>
                                                <th>Profit Center</th>
                                                <th>Region</th>
                                                <th>Inisial</th>
                                                <th>Rekening Spending Card</th>
                                                <th>Rekening ZBA</th>
                                                <th>Rekening Bank Coll</th>
                                                <th>Sistem Area</th>
                                                <th>PAGU IKK</th>
                                                <th>GL KK</th>

                                                <th>PIC FINANCE</th>
                                                <th>SPV FINANCE 1</th>
                                                <th>SPV FINANCE 2</th>
                                                <th>ASST MGR FIN</th>
                                                <th>MGR FIN</th>
                                                <th>PIC TAX</th>
                                                <th>SPV TAX</th>
                                                <th>ASMEN TAX</th>
                                                <th>MGR TAX</th>
                                                <th>AOS</th>
                                                <th>ROM</th>
                                                <th>BM</th>
                                                <th>NOM</th>
                                                <th>RBM</th>
                                            </tr>
                                        </thead>
                                    </Table>
                                        <div className={style.spin}>
                                            Data tidak ditemukan
                                        </div>
                                    </div>
                                ) : (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={[style.tab, 'tableJurnal']}>
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
                                                <th>Kode Plant</th>
                                                <th>Profit Center</th>
                                                <th>Region</th>
                                                <th>Nama Area</th>
                                                <th>Inisial</th>
                                                <th>Rekening Spending Card</th>
                                                <th>Rekening ZBA</th>
                                                <th>Rekening Bank Coll</th>
                                                <th>Sistem Area</th>
                                                <th>PAGU IKK</th>
                                                <th>GL KK</th>

                                                <th>PIC FINANCE</th>
                                                <th>SPV FINANCE 1</th>
                                                <th>SPV FINANCE 2</th>
                                                <th>ASST MGR FIN</th>
                                                <th>MGR FIN</th>
                                                <th>PIC TAX</th>
                                                <th>SPV TAX</th>
                                                <th>ASMEN TAX</th>
                                                <th>MGR TAX</th>
                                                <th>AOS</th>
                                                <th>ROM</th>
                                                <th>BM</th>
                                                <th>NOM</th>
                                                <th>RBM</th>
                                                <th>Opsi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataAll.length !== 0 && dataAll.map(item => {
                                                return (
                                                <tr>
                                                    <th>
                                                        <input 
                                                        type='checkbox'
                                                        checked={listData.find(element => element === item.id) !== undefined ? true : false}
                                                        onChange={listData.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                        />
                                                    </th>
                                                    <th scope="row">{(dataAll.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                    <td>{item.kode_plant}</td>
                                                    <td>{item.profit_center}</td>
                                                    <td>{item.region}</td>
                                                    <td>{item.area}</td>
                                                    <td>{item.inisial}</td>
                                                    <td>{item.rek_spending}</td>
                                                    <td>{item.rek_zba}</td>
                                                    <td>{item.rek_bankcoll}</td>
                                                    <td>{item.type_live}</td>
                                                    <td>{item.pagu}</td>
                                                    <td>{item.gl_kk}</td>

                                                    <td>{item.pic_finance}</td>
                                                    <td>{item.spv_finance}</td>
                                                    <td>{item.spv2_finance}</td>
                                                    <td>{item.asman_finance}</td>
                                                    <td>{item.manager_finance}</td>
                                                    <td>{item.pic_tax}</td>
                                                    <td>{item.spv_tax}</td>
                                                    <td>{item.asman_tax}</td>
                                                    <td>{item.manager_tax}</td>
                                                    <td>{item.aos}</td>
                                                    <td>{item.rom}</td>
                                                    <td>{item.bm}</td>
                                                    <td>{item.nom}</td>
                                                    <td>{item.rbm}</td>
                                                    <td>
                                                        <Button onClick={()=>this.openModalEdit(this.setState({detail: item}))} color='primary'>Edit</Button>
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
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="xl">
                    <ModalHeader toggle={this.openModalAdd}>Add Master Finance</ModalHeader>
                    <Formik
                    initialValues={{
                        kode_plant: '',
                        profit_center: '',
                        region: '',
                        inisial: '',
                        rek_spending: '',
                        rek_zba: '',
                        rek_bankcoll: '',
                        type_live: '',
                        gl_kk: '',
                        area: '',
                        pagu: '',
                        pic_finance: '',
                        spv_finance: '',
                        spv2_finance: '',
                        asman_finance: '',
                        manager_finance: '',
                        pic_tax: '',
                        spv_tax: '',
                        asman_tax: '',
                        manager_tax: '',
                        aos: '',
                        rom: '',
                        bm: '',
                        nom: '',
                        rbm: ''
                    }}
                    validationSchema={financeSchema}
                    onSubmit={(values) => {this.addFinance(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Kode Plant
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
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
                            <text className="col-md-3">
                                Profit Center
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="profit_center"
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
                            <text className="col-md-3">
                                Region
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="region"
                                value={values.region}
                                onBlur={handleBlur("region")}
                                onChange={handleChange("region")}
                                />
                                {errors.region ? (
                                    <text className={style.txtError}>{errors.region}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Area
                            </text>
                            <div className="col-md-9">
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
                            <text className="col-md-3">
                                Inisial
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="inisial"
                                value={values.inisial}
                                onBlur={handleBlur("inisial")}
                                onChange={handleChange("inisial")}
                                />
                                {errors.inisial ? (
                                    <text className={style.txtError}>{errors.inisial}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Rekening Spending Card
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="rek_spending"
                                value={values.rek_spending}
                                onBlur={handleBlur("rek_spending")}
                                onChange={handleChange("rek_spending")}
                                />
                                {errors.rek_spending ? (
                                    <text className={style.txtError}>{errors.rek_spending}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Rekening ZBA
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="rek_zba"
                                value={values.rek_zba}
                                onBlur={handleBlur("rek_zba")}
                                onChange={handleChange("rek_zba")}
                                />
                                {errors.rek_zba ? (
                                    <text className={style.txtError}>{errors.rek_zba}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Rekening Bank Coll
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="rek_bankcoll"
                                value={values.rek_bankcoll}
                                onBlur={handleBlur("rek_bankcoll")}
                                onChange={handleChange("rek_bankcoll")}
                                />
                                {errors.rek_bankcoll ? (
                                    <text className={style.txtError}>{errors.rek_bankcoll}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Sistem Area
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="type_live"
                                value={values.type_live}
                                onBlur={handleBlur("type_live")}
                                onChange={handleChange("type_live")}
                                />
                                {errors.type_live ? (
                                    <text className={style.txtError}>{errors.type_live}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                PAGU IKK
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="pagu"
                                value={values.pagu}
                                onBlur={handleBlur("pagu")}
                                onChange={handleChange("pagu")}
                                />
                                {errors.pagu ? (
                                    <text className={style.txtError}>{errors.pagu}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                GL KK
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="gl_kk"
                                value={values.gl_kk}
                                onBlur={handleBlur("gl_kk")}
                                onChange={handleChange("gl_kk")}
                                />
                                {errors.gl_kk ? (
                                    <text className={style.txtError}>{errors.gl_kk}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                PIC FINANCE
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="pic_finance"
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
                            <text className="col-md-3">
                                SPV FINANCE 1
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="spv_finance"
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
                            <text className="col-md-3">
                                SPV FINANCE 2
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="spv2_finance"
                                value={values.spv2_finance}
                                onBlur={handleBlur("spv2_finance")}
                                onChange={handleChange("spv2_finance")}
                                />
                                {errors.spv2_finance ? (
                                    <text className={style.txtError}>{errors.spv2_finance}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                ASST MGR FIN
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="asman_finance"
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
                            <text className="col-md-3">
                                MGR FIN
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="manager_finance"
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
                            <text className="col-md-3">
                                PIC TAX
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="pic_tax"
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
                            <text className="col-md-3">
                                SPV TAX
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="spv_tax"
                                value={values.spv_tax}
                                onBlur={handleBlur("spv_tax")}
                                onChange={handleChange("spv_tax")}
                                />
                                {errors.spv_tax ? (
                                    <text className={style.txtError}>{errors.spv_tax}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                ASMEN TAX
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="asman_tax"
                                value={values.asman_tax}
                                onBlur={handleBlur("asman_tax")}
                                onChange={handleChange("asman_tax")}
                                />
                                {errors.asman_tax ? (
                                    <text className={style.txtError}>{errors.asman_tax}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                MGR TAX
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="manager_tax"
                                value={values.manager_tax}
                                onBlur={handleBlur("manager_tax")}
                                onChange={handleChange("manager_tax")}
                                />
                                {errors.manager_tax ? (
                                    <text className={style.txtError}>{errors.manager_tax}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                AOS
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="aos"
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
                            <text className="col-md-3">
                                ROM
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="rom"
                                value={values.rom}
                                onBlur={handleBlur("rom")}
                                onChange={handleChange("rom")}
                                />
                                {errors.rom ? (
                                    <text className={style.txtError}>{errors.rom}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                BM
                            </text>
                            <div className="col-md-9">
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
                            <text className="col-md-3">
                                NOM
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nom"
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
                            <text className="col-md-3">
                                RBM
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="rbm"
                                value={values.rbm}
                                onBlur={handleBlur("rbm")}
                                onChange={handleChange("rbm")}
                                />
                                {errors.rbm ? (
                                    <text className={style.txtError}>{errors.rbm}</text>
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
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="xl">
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Finance</ModalHeader>
                    <Formik
                    initialValues={{
                    kode_plant: detail.kode_plant === null ? '' : detail.kode_plant,
                    profit_center: detail.profit_center === null ? '' : detail.profit_center,
                    region: detail.region === null ? '' : detail.region,
                    area: detail.area === null ? '' : detail.area,
                    inisial: detail.inisial === null ? '' : detail.inisial,
                    rek_spending: detail.rek_spending === null ? '' : detail.rek_spending,
                    rek_zba: detail.rek_zba === null ? '' : detail.rek_zba,
                    rek_bankcoll: detail.rek_bankcoll === null ? '' : detail.rek_bankcoll,
                    type_live: detail.type_live === null ? '' : detail.type_live,
                    gl_kk: detail.gl_kk === null ? '' : detail.gl_kk,
                    pagu: detail.pagu === null ? '' : detail.pagu,
                    pic_finance: detail.pic_finance === null ? '' : detail.pic_finance,
                    spv_finance: detail.spv_finance === null ? '' : detail.spv_finance,
                    spv2_finance: detail.spv2_finance === null ? '' : detail.spv2_finance,
                    asman_finance: detail.asman_finance === null ? '' : detail.asman_finance,
                    manager_finance: detail.manager_finance === null ? '' : detail.manager_finance,
                    pic_tax: detail.pic_tax === null ? '' : detail.pic_tax,
                    spv_tax: detail.spv_tax === null ? '' : detail.spv_tax,
                    asman_tax: detail.asman_tax === null ? '' : detail.asman_tax,
                    manager_tax: detail.manager_tax === null ? '' : detail.manager_tax,
                    aos: detail.aos === null ? '' : detail.aos,
                    rom: detail.rom === null ? '' : detail.rom,
                    bm: detail.bm === null ? '' : detail.bm,
                    nom: detail.nom === null ? '' : detail.nom,
                    rbm: detail.rbm === null ? '' : detail.rbm
                    }}
                    validationSchema={financeSchema}
                    onSubmit={(values) => {this.editFinance(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Kode Plant
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
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
                            <text className="col-md-3">
                                Profit Center
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="profit_center"
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
                            <text className="col-md-3">
                                Region
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="region"
                                value={values.region}
                                onBlur={handleBlur("region")}
                                onChange={handleChange("region")}
                                />
                                {errors.region ? (
                                    <text className={style.txtError}>{errors.region}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Area
                            </text>
                            <div className="col-md-9">
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
                            <text className="col-md-3">
                                Inisial
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="inisial"
                                value={values.inisial}
                                onBlur={handleBlur("inisial")}
                                onChange={handleChange("inisial")}
                                />
                                {errors.inisial ? (
                                    <text className={style.txtError}>{errors.inisial}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Rekening Spending Card
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="rek_spending"
                                value={values.rek_spending}
                                onBlur={handleBlur("rek_spending")}
                                onChange={handleChange("rek_spending")}
                                />
                                {errors.rek_spending ? (
                                    <text className={style.txtError}>{errors.rek_spending}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Rekening ZBA
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="rek_zba"
                                value={values.rek_zba}
                                onBlur={handleBlur("rek_zba")}
                                onChange={handleChange("rek_zba")}
                                />
                                {errors.rek_zba ? (
                                    <text className={style.txtError}>{errors.rek_zba}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Rekening Bank Coll
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="rek_bankcoll"
                                value={values.rek_bankcoll}
                                onBlur={handleBlur("rek_bankcoll")}
                                onChange={handleChange("rek_bankcoll")}
                                />
                                {errors.rek_bankcoll ? (
                                    <text className={style.txtError}>{errors.rek_bankcoll}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Sistem Area
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="type_live"
                                value={values.type_live}
                                onBlur={handleBlur("type_live")}
                                onChange={handleChange("type_live")}
                                />
                                {errors.type_live ? (
                                    <text className={style.txtError}>{errors.type_live}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                PAGU IKK
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="pagu"
                                value={values.pagu}
                                onBlur={handleBlur("pagu")}
                                onChange={handleChange("pagu")}
                                />
                                {errors.pagu ? (
                                    <text className={style.txtError}>{errors.pagu}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                GL KK
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="gl_kk"
                                value={values.gl_kk}
                                onBlur={handleBlur("gl_kk")}
                                onChange={handleChange("gl_kk")}
                                />
                                {errors.gl_kk ? (
                                    <text className={style.txtError}>{errors.gl_kk}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                PIC FINANCE
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="pic_finance"
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
                            <text className="col-md-3">
                                SPV FINANCE 1
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="spv_finance"
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
                            <text className="col-md-3">
                                SPV FINANCE 2
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="spv2_finance"
                                value={values.spv2_finance}
                                onBlur={handleBlur("spv2_finance")}
                                onChange={handleChange("spv2_finance")}
                                />
                                {errors.spv2_finance ? (
                                    <text className={style.txtError}>{errors.spv2_finance}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                ASST MGR FIN
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="asman_finance"
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
                            <text className="col-md-3">
                                MGR FIN
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="manager_finance"
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
                            <text className="col-md-3">
                                PIC TAX
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="pic_tax"
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
                            <text className="col-md-3">
                                SPV TAX
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="spv_tax"
                                value={values.spv_tax}
                                onBlur={handleBlur("spv_tax")}
                                onChange={handleChange("spv_tax")}
                                />
                                {errors.spv_tax ? (
                                    <text className={style.txtError}>{errors.spv_tax}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                ASMEN TAX
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="asman_tax"
                                value={values.asman_tax}
                                onBlur={handleBlur("asman_tax")}
                                onChange={handleChange("asman_tax")}
                                />
                                {errors.asman_tax ? (
                                    <text className={style.txtError}>{errors.asman_tax}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                MGR TAX
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="manager_tax"
                                value={values.manager_tax}
                                onBlur={handleBlur("manager_tax")}
                                onChange={handleChange("manager_tax")}
                                />
                                {errors.manager_tax ? (
                                    <text className={style.txtError}>{errors.manager_tax}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                AOS
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="aos"
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
                            <text className="col-md-3">
                                ROM
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="rom"
                                value={values.rom}
                                onBlur={handleBlur("rom")}
                                onChange={handleChange("rom")}
                                />
                                {errors.rom ? (
                                    <text className={style.txtError}>{errors.rom}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                BM
                            </text>
                            <div className="col-md-9">
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
                            <text className="col-md-3">
                                NOM
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nom"
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
                            <text className="col-md-3">
                                RBM
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="rbm"
                                value={values.rbm}
                                onBlur={handleBlur("rbm")}
                                onChange={handleChange("rbm")}
                                />
                                {errors.rbm ? (
                                    <text className={style.txtError}>{errors.rbm}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button className="mr-2" onClick={this.openModalDel} color='danger'>Delete Finance</Button>
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
                    <ModalHeader>Upload Master Finance</ModalHeader>
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
                <Modal toggle={this.openPickUpload} isOpen={this.state.pickUpload} centered>
                    <ModalHeader className='colCenter'>Pilih Tipe Upload</ModalHeader>
                    <ModalBody className='colCenter'>
                        <div className='rowCenter'>
                            <Button color="info" onClick={this.openModalStruktur}>Upload Struktur Area</Button>
                            <Button color="primary" className='ml-2' onClick={this.openModalUpload}>Upload Master Finance</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal toggle={this.openModalStruktur} isOpen={this.state.modalStruktur} >
                    <ModalHeader>Upload Struktur Area</ModalHeader>
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
                                    onChange={this.onChangeStruktur}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={style.btnUpload}>
                            <Button color="info" onClick={this.downloadStrukur}>Download Template</Button>
                            <Button color="primary" disabled={this.state.fileStruktur === "" ? true : false } onClick={this.uploadStruktur}>Upload</Button>
                            <Button onClick={this.openModalStruktur}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Memperbarui Finance</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Finance</div>
                            </div>
                        ) : this.state.confirm === 'del' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menghapus Finance</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master Finance</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'reset' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mereset Password</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'failUpload' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green, style.mb4]}>Gagal Upload</div>
                                    <div className={[style.sucUpdate, style.green, style.mb3]}>{this.props.finance.alertMsg}</div>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.finance.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.finance.isUpload ? true: false} size="sm">
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
                                Anda yakin untuk delete {detail.region} ?
                            </text>
                        </div>
                        <div className={style.btnApprove}>
                            <Button color="primary" onClick={() => this.delFinance()}>Ya</Button>
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
    finance: state.finance
})

const mapDispatchToProps = {
    logout: auth.logout,
    addFinance: finance.addFinance,
    updateFinance: finance.updateFinance,
    getFinance: finance.getAllFinance,
    uploadMaster: finance.uploadMaster,
    uploadStruktur: finance.uploadStruktur,
    nextPage: finance.nextPage,
    exportMaster: finance.exportMaster,
    resetError: finance.resetError,
    resetPassword: user.resetPassword,
    deleteFinance: finance.deleteFinance
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterFinance)
	