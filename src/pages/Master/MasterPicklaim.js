import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner, UncontrolledDropdown} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaBars} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel} from 'react-icons/ai'
import depo from '../../redux/actions/depo'
import user from '../../redux/actions/user'
import picklaim from '../../redux/actions/picklaim'
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

const picklaimSchema = Yup.object().shape({
    kode_plant: Yup.string().required(),
    kode_dist: Yup.string().required(),
    profit_center: Yup.string().required(),
    area: Yup.string().required(),
    area_sap: Yup.string(),
    ksni: Yup.string(),
    nni: Yup.string(),
    nsi: Yup.string(),
    mas: Yup.string(),
    mcp: Yup.string(),
    simba: Yup.string(),
    lotte: Yup.string(),
    mun: Yup.string(),
    eiti: Yup.string(),
    edot: Yup.string(),
    meiji: Yup.string()
});


const changeSchema = Yup.object().shape({
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class MasterPicklaim extends Component {
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
            listData: []
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    chekApp = (val) => {
        const { listData } = this.state
        const {dataAll} = this.props.picklaim
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
        const {dataAll} = this.props.picklaim
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
            {header: 'KODE PLANT', key: 'c1'},
            {header: 'KODE DISTRIBUTION', key: 'c2'},
            {header: 'PROFIT CENTER', key: 'c3'},
            {header: 'NAMA AREA', key: 'c4'},
            {header: 'NAMA AREA SAP', key: 'c5'},
            {header: 'KSNI', key: 'c6'},
            {header: 'NNI', key: 'c7'},
            {header: 'NSI', key: 'c8'},
            {header: 'MAS', key: 'c9'},
            {header: 'MCP', key: 'c10'},
            {header: 'SIMBA', key: 'c11'},
            {header: 'LOTTE', key: 'c12'},
            {header: 'MUN', key: 'c13'},
            {header: 'EITI', key: 'c14'},
            {header: 'EDOT', key: 'c15'},
            {header: 'MEIJI', key: 'c16'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c1: item.kode_plant,
                c2: item.kode_dist,
                c3: item.profit_center,
                c4: item.area,
                c5: item.area_sap,
                c6: item.ksni,
                c7: item.nni,
                c8: item.nsi,
                c9: item.mas,
                c10: item.mcp,
                c11: item.simba,
                c12: item.lotte,
                c13: item.mun,
                c14: item.eiti,
                c15: item.edot,
                c16: item.meiji,
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
              `Master PIC Klaim ${moment().format('DD MMMM YYYY')}.xlsx`
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
        const {link} = this.props.picklaim
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master pic klaim.xlsx"); //or any other extension
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
            url: `${REACT_APP_BACKEND_URL}/masters/picklaim.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master pic klaim.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    addPicklaim = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addPicklaim(token, values)
        const {isAdd} = this.props.picklaim
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            await this.getDataCount()
            this.openModalAdd()
        }
    }

    delPicklaim = async () => {
        const token = localStorage.getItem("token")
        const {detail} = this.state
        await this.props.deletePicklaim(token, detail.id)
        this.openModalEdit()
        this.setState({confirm: 'del'})
        this.openConfirm()
        await this.getDataCount()
        this.openModalDel()
    }

    next = async () => {
        const { page } = this.props.picklaim
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.picklaim
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

    editPicklaim = async (values, id) => {
        const token = localStorage.getItem("token")
        await this.props.updatePicklaim(token, values, id)
        const {isUpdate} = this.props.picklaim
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
        const {isError, isUpload, isExport, isReset} = this.props.picklaim
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
        const { page } = this.props.picklaim
        const pages = value === undefined || value.page === undefined ? page.currentPage : value.page
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        const filter = value === undefined || value.filter === undefined ? this.state.filter : value.filter
        console.log(this.state.filter)
        await this.props.getPicklaim(token, limit, search, pages, filter)
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
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg, listData} = this.state
        const {dataPicklaim, isAll, alertM, alertMsg, alertUpload, page, dataRole, dataAll} = this.props.picklaim
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
                                    <div className={style.titleDashboard}>Master PIC Klaim</div>
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
                                    <div className='filterPicklaim'>
                                    </div>
                                </div>
                                <div className='secEmail'>
                                    <div className={style.headEmail}>
                                        <Button className='mr-1' onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                        <Button className='mr-1' onClick={this.openModalUpload} color="warning" size="lg">Upload</Button>
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
                                                <th>KODE PLANT</th>
                                                <th>KODE DISTRIBUTION</th>
                                                <th>PROFIT CENTER</th>
                                                <th>NAMA AREA</th>
                                                <th>NAMA AREA SAP</th>
                                                <th>KSNI</th>
                                                <th>NNI</th>
                                                <th>NSI</th>
                                                <th>MAS</th>
                                                <th>MCP</th>
                                                <th>SIMBA</th>
                                                <th>LOTTE</th>
                                                <th>MUN</th>
                                                <th>EITI</th>
                                                <th>EDOT</th>
                                                <th>MEIJI</th>
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
                                                <th>No</th>
                                                <th>KODE PLANT</th>
                                                <th>KODE DISTRIBUTION</th>
                                                <th>PROFIT CENTER</th>
                                                <th>NAMA AREA</th>
                                                <th>NAMA AREA SAP</th>
                                                <th>KSNI</th>
                                                <th>NNI</th>
                                                <th>NSI</th>
                                                <th>MAS</th>
                                                <th>MCP</th>
                                                <th>SIMBA</th>
                                                <th>LOTTE</th>
                                                <th>MUN</th>
                                                <th>EITI</th>
                                                <th>EDOT</th>
                                                <th>MEIJI</th>
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
                                                    <td>{item.kode_plant}</td>
                                                    <td>{item.kode_dist}</td>
                                                    <td>{item.profit_center}</td>
                                                    <td>{item.area}</td>
                                                    <td>{item.area_sap}</td>
                                                    <td>{item.ksni}</td>
                                                    <td>{item.nni}</td>
                                                    <td>{item.nsi}</td>
                                                    <td>{item.mas}</td>
                                                    <td>{item.mcp}</td>
                                                    <td>{item.simba}</td>
                                                    <td>{item.lotte}</td>
                                                    <td>{item.mun}</td>
                                                    <td>{item.eiti}</td>
                                                    <td>{item.edot}</td>
                                                    <td>{item.meiji}</td>
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
                    <ModalHeader toggle={this.openModalAdd}>Add Master Picklaim</ModalHeader>
                    <Formik
                    initialValues={{
                        kode_plant: '',
                        profit_center: '',
                        region: '',
                        inisial: ''
                    }}
                    validationSchema={picklaimSchema}
                    onSubmit={(values) => {this.addPicklaim(values)}}
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
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Picklaim</ModalHeader>
                    <Formik
                    initialValues={{
                    kode_plant: detail.kode_plant === null ? '' : detail.kode_plant,
                    profit_center: detail.profit_center === null ? '' : detail.profit_center,
                    region: detail.region === null ? '' : detail.region,
                    inisial: detail.inisial === null ? '' : detail.inisial
                    }}
                    validationSchema={picklaimSchema}
                    onSubmit={(values) => {this.editPicklaim(values, detail.id)}}
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
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button className="mr-2" onClick={this.openModalDel} color='danger'>Delete Picklaim</Button>
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
                    <ModalHeader>Upload Master Pic klaim</ModalHeader>
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
                            <div className={style.sucUpdate}>Berhasil Memperbarui Picklaim</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Picklaim</div>
                            </div>
                        ) : this.state.confirm === 'del' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menghapus Picklaim</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master Picklaim</div>
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
                <Modal isOpen={this.props.picklaim.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.picklaim.isUpload ? true: false} size="sm">
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
                                Anda yakin untuk delete picklaim {detail.region} ?
                            </text>
                        </div>
                        <div className={style.btnApprove}>
                            <Button color="primary" onClick={() => this.delPicklaim()}>Ya</Button>
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
    picklaim: state.picklaim
})

const mapDispatchToProps = {
    logout: auth.logout,
    addPicklaim: picklaim.addPicklaim,
    updatePicklaim: picklaim.updatePicklaim,
    getPicklaim: picklaim.getAllPicklaim,
    uploadMaster: picklaim.uploadMaster,
    nextPage: picklaim.nextPage,
    exportMaster: picklaim.exportMaster,
    resetError: picklaim.resetError,
    resetPassword: user.resetPassword,
    deletePicklaim: picklaim.deletePicklaim
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterPicklaim)
	