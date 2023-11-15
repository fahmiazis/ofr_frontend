/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {VscAccount} from 'react-icons/vsc'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    Card, CardBody, Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import approve from '../../redux/actions/approve'
import {BsCircle} from 'react-icons/bs'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList, FaFileSignature} from 'react-icons/fa'
import {MdAssignment} from 'react-icons/md'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
import Sidebar from "../../components/Header";
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import style from '../../assets/css/input.module.css'
import placeholder from  "../../assets/img/placeholder.png"
import user from '../../redux/actions/user'
import {connect} from 'react-redux'
import moment from 'moment'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import menu from '../../redux/actions/menu'
import reason from '../../redux/actions/reason'
// import notif from '../redux/actions/notif'
import Pdf from "../../components/Pdf"
import depo from '../../redux/actions/depo'
import {default as axios} from 'axios'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import ops from '../../redux/actions/ops'
import dokumen from '../../redux/actions/dokumen'
import ExcelJS from "exceljs";
import fs from "file-saver";
const {REACT_APP_BACKEND_URL} = process.env
const ceknon = 'Non PPh'
const cek21 = 'PPh Pasal 21'
const cek23 = 'PPh Pasal 23'
const cek4a2 = 'PPh Pasal 4(2)'


const stockSchema = Yup.object().shape({
    merk: Yup.string().required("must be filled"),
    satuan: Yup.string().required("must be filled"),
    unit: Yup.number().required("must be filled"),
    lokasi: Yup.string().required("must be filled"),
    keterangan: Yup.string().validateSync("")
})

const addStockSchema = Yup.object().shape({
    deskripsi: Yup.string().required("must be filled"),
    merk: Yup.string().required("must be filled"),
    satuan: Yup.string().required("must be filled"),
    unit: Yup.number().required("must be filled"),
    lokasi: Yup.string().required("must be filled"),
    grouping: Yup.string().required("must be filled"),
    keterangan: Yup.string().validateSync("")
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});


class ReportOps extends Component {
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
            limit: 10,
            search: '',
            dataRinci: {},
            dataItem: {},
            modalEdit: false,
            modalRinci: false,
            dropApp: false,
            openReject: false,
            openApprove: false,
            modalFaa: false,
            modalFpd: false,
            view: 'list',
            fisik: '',
            kondisi: '',
            alert: false,
            submitPre: false,
            dataStatus: [],
            openStatus: false,
            stat: '',
            modalConfirm: false,
            confirm: '',
            modalDoc: false,
            listReason: [],
            modalStock: false,
            openPdf: false,
            modalAdd: false,
            openConfirm: false,
            modalSum: false,
            grouping: '',
            modalUpload: false,
            dataId: null,
            idTab: null,
            drop: false,
            bulan: moment().format('MMMM'),
            opendok: false,
            month: moment().format('M'),
            dropOp: false,
            noAsset: null,
            filter: 'all',
            newOps: [],
            totalfpd: 0,
            dataMenu: [],
            listMenu: [],
            collap: false,
            tipeCol: '',
            formDis: false,
            history: false,
            time: 'pilih',
            time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            dataDownload: [],
            modalDownload: false,
            titleDownload: '',
            listOps: [],
            jurnalMap: [1, 2],
            isLoading: false,
            jurnal2: [1, 2],
            jurnal3: [1, 2, 3],
            jurnal4: [1, 2, 3, 4],
            jurnal6: [1, 2, 3, 4, 5, 6],
            dataPph:{
                pph21: '21050107',
                pph23: '21050102',
                ppn: '11060204',
                pph4a2: '21050101',
                kasbon: 'V100IN0001',
                bankops: '11010401',
                pc_ho: 'P01H000001'
            }
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    submitStock = async () => {
        const token = localStorage.getItem('token')
        await this.props.submitStock(token)
        this.getDataCart()
    }

    onChangeUpload = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf' && type !== 'application/x-7z-compressed' && type !== 'application/vnd.rar' && type !== 'application/zip' && type !== 'application/x-zip-compressed' && type !== 'application/octet-stream' && type !== 'multipart/x-zip' && type !== 'application/x-rar-compressed') {
            this.setState({errMsg: 'Invalid file type. Only excel, pdf, zip, and rar files are allowed.'})
            this.uploadAlert()
        } else {
            const {detail} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocumentDis(token, detail.id, data)
        }
    }

    uploadPicture = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({errMsg: 'Invalid file type. Only image files are allowed.'})
            this.uploadAlert()
        } else {
            const {dataRinci} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadPicture(token, dataRinci.no_asset, data)
        }
    }

    uploadGambar = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({errMsg: 'Invalid file type. Only image files are allowed.'})
            this.uploadAlert()
        } else {
            const { dataId } = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadImage(token, dataId, data)
        }
    }

    getApproveStock = async (value) => { 
        const token = localStorage.getItem('token')
        await this.props.getApproveStock(token, value.no, value.nama)
    }

    rejectOps = async (val) => {
        const {listOps, listReason, listMenu} = this.state
        const { detailOps } = this.props.ops
        const token = localStorage.getItem('token')
        const tempno = {
            no: detailOps[0].no_transaksi
        }
        let temp = ''
        for (let i = 0; i < listReason.length; i++) {
            temp += listReason[i] + '. '
        }
        const data = {
            no: detailOps[0].no_transaksi,
            list: listOps,
            alasan: temp + val.alasan,
            menu: listMenu.toString()
        }
        await this.props.rejectOps(token, data)
        this.getDataOps()
        this.setState({confirm: 'reject'})
        this.openConfirm()
        this.openModalReject()
        this.openModalRinci()
    }

    showCollap = (val) => {
        if (val === 'close') {
            this.setState({collap: false})
        } else {
            this.setState({collap: false})
            setTimeout(() => {
                this.setState({collap: true, tipeCol: val})
             }, 500)
        }
    }

    dropApp = () => {
        this.setState({dropApp: !this.state.dropApp})
    }

    openModalConfirm = () => {
        this.setState({openConfirm: !this.state.openConfirm})
    }

    openModalFaa = () => {
        this.setState({modalFaa: !this.state.modalFaa})
    }

    openModalFpd = () => {
        this.setState({modalFpd: !this.state.modalFpd})
    }

    prosesModalFpd = () => {
        const {detailOps} = this.props.ops
        let total = 0
        for (let i = 0; i < detailOps.length; i++) {
            total += parseInt(detailOps[i].nilai_ajuan)
        }
        this.setState({totalfpd: total})
        this.openModalFpd()
    }

    openModalReject = () => {
        this.setState({openReject: !this.state.openReject})
    }

    openModalApprove = () => {
        this.setState({openApprove: !this.state.openApprove})
    }

    openPreview = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveStock(token, val.no_stock, val.kode_plant.split('').length === 4 ? 'stock opname' : 'stock opname HO')
        this.openModalFaa()
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
    }

    next = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.resetData()
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.resetData()
        await this.props.nextPage(token, page.prevLink)
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    goRoute(val) {
        this.props.history.push(`/${val}`)
    }

    getDetailStock = async (value) => {
        const token = localStorage.getItem("token")
        this.setState({dataItem: value})
        await this.props.getDetailStock(token, value.id)
        this.openModalRinci()
    }

    deleteStock = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.deleteStock(token, value.id)
        this.getDataOps()
    }

    showAlert = () => {
        this.setState({alert: true})
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 2000)
    }

    submitAset = async () => {
        const token = localStorage.getItem('token')
        const { detailStock } = this.props.stock
        await this.props.submitAsset(token, detailStock[0].no_stock)
    }

    componentDidMount() {
        // const level = localStorage.getItem('level')
        this.getDataOps()
    }

    componentDidUpdate() {
        const { isApprove, isReject } = this.props.ops
        if (isApprove === false) {
            this.setState({confirm: 'rejApprove'})
            this.openConfirm()
            this.openModalApprove()
            this.openModalRinci()
            this.props.resetOps()
        } else if (isReject === false) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
            this.openModalReject()
            this.openModalRinci()
            this.props.resetOps()
        }
    }

    downloadData = () => {
        const { fileName } = this.state
        const download = fileName.path.split('/')
        const cek = download[2].split('.')
        axios({
            url: `${REACT_APP_BACKEND_URL}/uploads/${download[2]}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName.history}.${cek[1]}`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    dropOpen = async (val) => {
        if (this.state.dropOp === false) {
            const token = localStorage.getItem("token")
            await this.props.getDetailAsset(token, val.no_asset)
            const { detailAsset } = this.props.asset
            if (detailAsset !== undefined) {
                this.setState({stat: detailAsset.grouping})
                if (detailAsset.kondisi === null && detailAsset.status_fisik === null) {
                    await this.props.getStatus(token, '', '', 'true')
                    this.modalStatus()
                } else {
                    await this.props.getStatus(token, detailAsset.status_fisik === null ? '' : detailAsset.status_fisik, detailAsset.kondisi === null ? '' : detailAsset.kondisi, 'true')
                    const { dataStatus } = this.props.stock
                    if (dataStatus.length === 0) {
                        this.modalStatus()
                    } else {
                        this.setState({noAsset: val.no_asset, dropOp: !this.state.dropOp})
                    }
                }
            } else {
                await this.props.getStatus(token, '', '', 'true')
                this.modalStatus()
            }
        } else {
            this.setState({dropOp: !this.state.dropOp})   
        }
    }

    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    getDataOps = async (value) => {
        this.setState({limit: value === undefined ? 10 : value.limit})
        this.changeFilter('bayar')
    }

    getDataList = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 400, '', 1)
    }

    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    prosesDetail = async (val) => {
        const token = localStorage.getItem("token")
        const tempno = {
            no: val.no_transaksi
        }
        this.setState({listOps: []})
        await this.props.getDetail(token, tempno)
        await this.props.getApproval(token, tempno)
        this.openModalRinci()
    }

    openModalDok = () => {
        this.setState({opendok: !this.state.opendok})
    }

    prosesTracking = async (val) => {
        const token = localStorage.getItem("token")
        const tempno = {
            no: val.no_transaksi
        }
        await this.props.getDetail(token, tempno)
        await this.props.getApproval(token, tempno)
        this.openModalDis()
    }

    openModalDis = () => {
        this.setState({formDis: !this.state.formDis})
    }

    getDokumentasi = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.exportStock(token, val.no, this.state.month)
        this.openModalDok()
    }

    addStock = async (val) => {
        const token = localStorage.getItem("token")
        const dataAsset = this.props.asset.assetAll
        const { detailDepo } = this.props.depo
        const { kondisi, fisik } = this.state
        const data = {
            area: detailDepo.nama_area,
            kode_plant: dataAsset[0].kode_plant,
            deskripsi: val.deskripsi,
            merk: val.merk,
            satuan: val.satuan,
            unit: val.unit,
            lokasi: val.lokasi,
            grouping: val.grouping,
            keterangan: val.keterangan,
            kondisi: kondisi,
            status_fisik: fisik
        }
        await this.props.addOpname(token, data)
        await this.props.getStockArea(token, '', 1000, 1, 'null')
        const { dataAdd } = this.props.stock
        this.setState({kondisi: '', fisik: '', dataId: dataAdd.id})
        this.openModalAdd()
        this.openModalUpload()
    }

    openModalSum = async () => {
        const token = localStorage.getItem('token')
        await this.props.getStockArea(token, '', 1000, 1, 'null')
        this.openSum()
    }

    openModalSub = () => {
        this.setState({modalSubmit: !this.state.modalSubmit})
    }

    openSum = () => {
        this.setState({modalSum: !this.state.modalSum})
    }

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
    }

    openHistory = () => {
        this.setState({history: !this.state.history})
    }

    changeFilter = async (val) => {
        const token = localStorage.getItem("token")
        const status = val === 'reject' ? 6 : val === 'bayar' ? 8 : 7
        const {time1, time2} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        if (val === 'available') {
            const newKlaim = []
            await this.props.getReport(token, status, 'all', 'all', cekTime1, cekTime2)
            this.setState({filter: val, newKlaim: newKlaim})
        } else if (val === 'reject') {
            const newKlaim = []
            await this.props.getReport(token, status, 'all', 'all', cekTime1, cekTime2)
            this.setState({filter: val, newKlaim: newKlaim})
        } else if (val === 'revisi') {
            const newKlaim = []
            await this.props.getReport(token, status, 'all', 'all', cekTime1, cekTime2)
            this.setState({filter: val, newKlaim: newKlaim})
        } else {
            const newKlaim = []
            await this.props.getReport(token, status, 'all', 'all', cekTime1, cekTime2)
            this.setState({filter: val, newKlaim: newKlaim})
        }
    }

    changeTime = async (val) => {
        this.setState({time: val})
        if (val === 'all') {
            this.setState({time1: '', time2: ''})
            setTimeout(() => {
                this.getDataTime()
             }, 500)
        }
    }

    selectTime = (val) => {
        this.setState({[val.type]: val.val})
    }

    getDataTime = async () => {
        const {time1, time2, filter} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = filter === 'reject' ? 6 : filter === 'bayar' ? 8 : 7
        await this.props.getReport(token, status, 'all', 'all', cekTime1, cekTime2)
    }

    prosesSubmitPre = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAssetAll(token, 1000, '', 1, 'asset')
        this.modalSubmitPre()
    }

    approveDataOps = async () => {
        const { detailOps } = this.props.ops
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailOps[0].no_transaksi
        }
        await this.props.approveOps(token, tempno)
        this.getDataOps()
        this.setState({confirm: 'isApprove'})
        this.openConfirm()
        this.openModalApprove()
        this.openModalRinci()
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const {time1, time2, filter} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = filter === 'reject' ? 6 : filter === 'bayar' ? 8 : 7
        if(e.key === 'Enter'){
            await this.props.getReport(token, status, 'all', 'all', cekTime1, cekTime2, undefined, e.target.value)
        }
    }

    updateAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { dataRinci } = this.state
        const { detailAsset } = this.props.asset
        const data = {
            merk: value.merk,
            satuan: value.satuan,
            unit: value.unit,
            lokasi: value.lokasi,
            grouping: detailAsset.grouping,
            keterangan: value.keterangan,
            status_fisik: detailAsset.fisik,
            kondisi: detailAsset.kondisi
        }
        await this.props.updateAssetNew(token, dataRinci.id, data)
    }

    changeView = (val) => {
        this.setState({view: val})
        if (val === 'list') {
            this.getDataList()
        } else {
            this.getDataOps()
        }
    }

    getAppOps = async (val) => {
        const token = localStorage.getItem("token")
        const tempno = {
            no: val.no_transaksi
        }
        await this.props.getApproval(token, tempno)
    }

    selectStatus = async (fisik, kondisi) => {
        this.setState({fisik: fisik, kondisi: kondisi})
        const token = localStorage.getItem("token")
        if (fisik === '' && kondisi === '') {
            console.log(fisik, kondisi)
        } else {
            await this.props.getStatus(token, fisik, kondisi, 'false')
        }
    }

    listStatus = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getDetailAsset(token, val)
        const { detailAsset } = this.props.asset
        if (detailAsset !== undefined) {
            this.setState({stat: detailAsset.grouping})
            if (detailAsset.kondisi === null && detailAsset.status_fisik === null) {
                await this.props.getStatus(token, '', '', 'true')
                this.modalStatus()
            } else {
                await this.props.getStatus(token, detailAsset.status_fisik === null ? '' : detailAsset.status_fisik, detailAsset.kondisi === null ? '' : detailAsset.kondisi, 'true')
                this.modalStatus()
            }
        }
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.showDokumen(token, value.id)
        this.setState({date: value.updatedAt, idDoc: value.id, fileName: value})
        const {isShow} = this.props.dokumen
        if (isShow) {
            this.openModalPdf()
        }
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    openProsesModalDoc = async (val) => {
        const token = localStorage.getItem("token")
        const tempno = {
            no: val.no_transaksi,
            name: 'Draft Pengajuan Ops'
        }
        await this.props.getDocOps(token, tempno)
        this.openModalDoc()
    }

    cekStatus = async (val) => {
        const token = localStorage.getItem("token")
        const { detailAsset } = this.props.asset
        if (val === 'DIPINJAM SEMENTARA') {
            await this.props.cekDokumen(token, detailAsset.no_asset)
        }
    }

    openModalDoc = () => {
        this.setState({modalDoc: !this.state.modalDoc})
    }

    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }

    getRincian = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({dataRinci: val})
        await this.props.getDetailAsset(token, val.no_asset)
        this.openModalEdit()
    }

    modalStatus = () => {
        this.setState({openStatus: !this.state.openStatus})
    }

    menuApp = (val) => {
        const { dataMenu } = this.state
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataMenu.length; i++) {
                data.push(dataMenu[i].id)
            }
            this.setState({listMenu: data})
        } else {
            const data = [val]
            this.setState({listMenu: data})
        }
    }

    menuRej = (val) => {
        const {listMenu} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listMenu: data})
        } else {
            const data = []
            for (let i = 0; i < listMenu.length; i++) {
                if (listMenu[i] === val) {
                    data.push()
                } else {
                    data.push(listMenu[i])
                }
            }
            this.setState({listMenu: data})
        }
    }

    reasonApp = (val) => {
        const { listReason } = this.state
        const {dataReason} = this.props.reason
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataReason.length; i++) {
                data.push(dataReason[i].id)
            }
            this.setState({listReason: data})
        } else {
            listReason.push(val)
            this.setState({listReason: listReason})
        }
    }

    reasonRej = (val) => {
        const {listReason} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listReason: data})
        } else {
            const data = []
            for (let i = 0; i < listReason.length; i++) {
                if (listReason[i] === val) {
                    data.push()
                } else {
                    data.push(listReason[i])
                }
            }
            this.setState({listReason: data})
        }
    }

    chekApp = (val) => {
        const { listOps } = this.state
        const {dataReport} = this.props.ops
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataReport.length; i++) {
                data.push(dataReport[i].id)
            }
            this.setState({listOps: data})
        } else {
            listOps.push(val)
            this.setState({listOps: listOps})
        }
    }

    prosesDownload = (val) => {
        const {listOps} = this.state
        const {dataReport} = this.props.ops
        const data = []
        for (let i = 0; i < listOps.length; i++) {
            for (let j = 0; j < dataReport.length; j++) {
                if (dataReport[j].id === listOps[i]) {
                    data.push(dataReport[j])
                }
            }
        }
        this.setState({dataDownload: data, titleDownload: val})
        this.openDownload()
    }

    prosesJurnal = (val) => {
        const {listOps} = this.state
        const {dataReport} = this.props.ops
        const data = []
        for (let i = 0; i < listOps.length; i++) {
            for (let j = 0; j < dataReport.length; j++) {
                if (dataReport[j].id === listOps[i]) {
                    data.push(dataReport[j])
                }
            }
        }
        this.setState({dataDownload: data, titleDownload: val})
        this.openJurnal()
    }

    openJurnal = () => {
        this.setState({modalJurnal: !this.state.modalJurnal})
    }

    openDownload = () => {
        this.setState({modalDownload: !this.state.modalDownload})
    }

    downloadOps = async () => {
        const { dataDownload } = this.state

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data operasional')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }


        ws.columns = [
            {header: 'NO', key: 'c1'},
            {header: 'PIC', key: 'c2'},
            {header: 'NAMA', key: 'c3'},
            {header: 'AREA', key: 'c4'},
            {header: 'NOMOR FPD', key: 'c5'},
            {header: 'COST CENTRE', key: 'c6'},
            {header: 'NO COA', key: 'c7'},
            {header: 'NAMA COA', key: 'c8'},
            {header: 'KETERANGAN TAMBAHAN', key: 'c9'},
            {header: 'TGL AJUAN', key: 'c10'},
            {header: 'PERIODE (DDMMYY)', key: 'c11'},
            {header: 'NILAI YANG DIAJUKAN', key: 'c12'},
            {header: 'BANK', key: 'c13'},
            {header: 'NOMOR REKENING', key: 'c14'},
            {header: 'ATAS NAMA', key: 'c15'},
            {header: 'MEMILIKI NPWP', key: 'c16'},
            {header: 'NAMA SESUAI NPWP', key: 'c17'},
            {header: 'NOMOR NPWP', key: 'c18'},
            {header: 'NAMA SESUAI KTP', key: 'c19'},
            {header: 'NIK', key: 'c20'},
            {header: 'DPP', key: 'c21'},
            {header: 'PPN', key: 'c22'},
            {header: 'PPh', key: 'c23'},
            {header: 'NILAI YANG DIBAYARKAN', key: 'c24'},
            {header: 'TANGGAL TRANSFER', key: 'c25'},
            {header: 'KETERANGAN', key: 'c26'},
            {header: 'STATUS', key: 'c27'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c1: index + 1,
                c2: item.finance.pic_finance,
                c3: item.area,
                c4: item.depo.channel,
                c5: item.no_transaksi,
                c6: item.cost_center,
                c7: item.no_coa,
                c8: item.nama_coa,
                c9: item.keterangan,
                c10: `${moment(item.start_ops).format('DD MMMM YYYY')}`,
                c11: `${moment(item.periode_awal).format('DD MMMM YYYY')} - ${moment(item.periode_akhir).format('DD MMMM YYYY')}`,
                c12: item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c13: item.bank_tujuan,
                c14: item.norek_ajuan,
                c15: item.nama_tujuan,
                c16: item.status_npwp === 0 ? 'Tidak' : 'Ya',
                c17: item.status_npwp === 0 ? '' : item.nama_npwp,
                c18: item.status_npwp === 0 ? '' : item.no_npwp,
                c19: item.status_npwp === 0 ? item.nama_ktp : '',
                c20: item.status_npwp === 0 ? item.no_ktp : '',
                c21: item.dpp,
                c22: item.ppn,
                c23: item.nilai_utang,
                c24: item.nilai_bayar,
                c25: `${moment(item.tanggal_transfer).format('DD MMMM YYYY')}`,
                c26: '',
                c27: item.history.split(',').reverse()[0],
            }
        )
        ) })

        ws.addRow(
            {
                c11: 'TOTAL :',
                c12: dataDownload.reduce((accumulator, object) => {
                    return accumulator + parseInt(object.nilai_ajuan);
                }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c13: '',
                c14: '',
                c15: '',
                c16: '',
                c17: '',
                c18: '',
                c19: '',
                c20: '',
                c21: '',
                c22: '',
                c23: '',
                c24: '',
                c25: '',
                c26: '',
                c27: '',
                c28: '',
            }
        )

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
              `Report Konsol Operasional ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    setLoading = (val) => {
        this.setState({isLoading: val})
    }

    downloadJurnal = async () => {
        this.setLoading(true)
        const { dataDownload, jurnalMap, dataPph, jurnal2,
        jurnal3, jurnal4, jurnal6 } = this.state

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('file upload operasional')
        
        // await ws.protect(REACT_APP_PASSWORD)

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        ws.columns = [
                {header: 'no', key: 'c1'},
                {header: 'header_text', key: 'c2'},
                {header: 'comp_code', key: 'c3'},
                {header: 'doc_date', key: 'c4'},
                {header: 'post_date', key: 'c5'},
                {header: 'period', key: 'c6'},
                {header: 'doc_type', key: 'c7'},
                {header: 'ref_doc_no', key: 'c8'},
                {header: 'curr', key: 'c9'},
                {header: 'item_no', key: 'c10'},
                {header: 'gl_acc', key: 'c11'},
                {header: 'post_key', key: 'c12'},
                {header: 'gl_indic', key: 'c13'},
                {header: 'func_area', key: 'c14'},
                {header: 'amount', key: 'c15'},
                {header: 'tax_code', key: 'c16'},
                {header: 'cost_ctr', key: 'c17'},
                {header: 'wbs_elemnt', key: 'c18'},
                {header: 'aufnr', key: 'c19'},
                {header: 'item_text', key: 'c20'},
                {header: 'valdate', key: 'c21'},
                {header: 'bsldate', key: 'c22'},
                {header: 'payterm', key: 'c23'},
                {header: 'paymeth', key: 'c24'},
                {header: 'parbank', key: 'c25'},
                {header: 'houbank', key: 'c26'},
                {header: 'prctr', key: 'c27'},
                {header: 'gsber', key: 'c28'},
                {header: 'vat_base', key: 'c29'},
                {header: 'account_id', key: 'c30'},
                {header: 'assignment', key: 'c31'},
                {header: 'ref_key(head)', key: 'c32'},
                {header: 'ref_key(head2)', key: 'c33'},
                {header: 'ref_key 3', key: 'c34'},
        ]

        ws.addRow(
            {
                c1: 'No Identifikasi',
                c2: 'Text Bebas',
                c3: 'Kode',
                c4: 'Tanggal Faktur',
                c5: 'Tanggal Posting',
                c6: '',
                c7: 'Tipe Dokumen',
                c8: 'No Dokumen Pendukung',
                c9: 'Mata Uang',
                c10: 'Nomor Item',
                c11: 'Nomor Akun',
                c12: 'Posting Key',
                c13: 'Kode Special',
                c14: 'Kosongi Saja',
                c15: 'Jumlah',
                c16: 'Kode PPN',
                c17: 'Cost Center',
                c18: 'No WBSt',
                c19: 'Kode Order',
                c20: 'Text Bebas',
                c21: 'Kosongi',
                c22: 'Tanggal',
                c23: 'TOP',
                c24: 'Metode',
                c25: 'Kode Rekening',
                c26: 'Kode Cabang',
                c27: 'Profit Center',
                c28: 'SBU',
                c29: 'DPP PPN',
                c30: 'Nomor ID',
                c31: 'Untuk AP',
                c32: 'Status Payment',
                c33: 'Hanya diisi',
                c34: 'Hanya diisi'
            }
        )

        // dataDownload.map((item, index) => { return (
        //     jurnalMap.map((x, iter) => {
        //         return (  ws.addRow({
        //             c1: index + 1,
        //             c2: item.no_transaksi,
        //             c3: 'PP01',
        //             c4: moment(item.tanggal_transfer).format('DDMMYYYY'),
        //             c5: moment(item.tanggal_transfer).format('DDMMYYYY'),
        //             c6: '',
        //             c7: 'SA',
        //             c8: item.finance.pic_finance,
        //             c9: 'IDR',
        //             c10: iter + 1,
        //             c11: iter === 0 ? item.depo.gl_kk : '11010401',
        //             c12: iter === 0 ? 40 : 50,
        //             c13: '',
        //             c14: '',
        //             c15: item.nilai_ajuan,
        //             c16: '',
        //             c17: '',
        //             c18: '',
        //             c19: '',
        //             c20: item.keterangan,
        //             c21: '',
        //             c22: '',
        //             c23: '',
        //             c24: '',
        //             c25: '',
        //             c26: '',
        //             c27: item.depo.profit_center,
        //             c28: '',
        //             c29: '',
        //             c30: '',
        //             c31: item.taxcode === null ? '' : (item.tax_type !== "No Need Tax Type" && item.tax_type !== null) && `${item.tax_type}-${item.tax_code}`,
        //             c32: '',
        //             c33: '',
        //             c34: '',
        //         })
        //         )
        //     })
        // ) })

        dataDownload.map((item, index) => { return (
            item.veriftax !== null && item.veriftax.grouping !== null && item.veriftax.grouping.toLowerCase() === 'kasbon' ? (
                jurnal2.map((x, iter) => {
                    return ( ws.addRow({
                        
                            c1: index + 1,
                            c2: item.no_transaksi,
                            c3: 'PP01',
                            c4: moment(item.tanggal_transfer).format('DDMMYYYY'),
                            c5: moment(item.tanggal_transfer).format('DDMMYYYY'),
                            c6: '',
                            c7: 'SA',
                            c8: item.depo.area,
                            c9: 'IDR',
                            c10:iter + 1,
                            c11: iter === 0 ? dataPph.kasbon : iter === 1 && dataPph.bankops,
                            c12: iter === 0 ? 29 : 50,
                            c13: iter === 0 && 'E',
                            c14: '',
                            c15: item.nilai_buku,
                            c16: '',
                            c17: item.depo.profit_center,
                            c18: '',
                            c19: '',
                            c20: item.sub_coa + 's',
                            c21: '',
                            c22: '',
                            c23: '',
                            c24: '',
                            c25: '',
                            c26: '',
                            c27: item.depo.profit_center,
                            c28: '',
                            c29: '',
                            c30: '',
                            c31: '',
                            c32: '',
                            c33: '',
                            c34: ''
                        })
                    )
                })
            ) : item.tujuan_tf === 'PMA' ? (
                (item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi !== 'Ya' ? ( // tidak berpph dan tidak berppn
                    jurnal2.map((x, iter) => {
                        return ( ws.addRow({
                            
                                c1: index + 1,
                                c2: item.no_transaksi,
                                c3: 'PP01',
                                c4: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c5: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c6: '',
                                c7: 'SA',
                                c8: item.depo.area,
                                c9: 'IDR',
                                c10: iter + 1,
                                c11: iter === 0 ? item.depo.gl_kk : iter === 1 && dataPph.bankops,
                                c12: iter === 0 ? 40 : 50,
                                c13: '',
                                c14: '',
                                c15: item.nilai_buku,
                                c16: '',
                                c17: iter === 0 ? item.depo.profit_center : '',
                                c18: '',
                                c19: '',
                                c20: item.sub_coa + 's',
                                c21: '',
                                c22: '',
                                c23: '',
                                c24: '',
                                c25: '',
                                c26: '',
                                c27: iter === 0 ? item.depo.profit_center : dataPph.pc_ho,
                                c28: '',
                                c29: '',
                                c30: '',
                                c31: '',
                                c32: '',
                                c33: '',
                                c34: '',
                            })
                        )
                    })
                ) : (item.jenis_pph !== 'Non PPh' && item.jenis_pph !== null) && item.type_transaksi !== 'Ya' ? ( // berpph tidak berppn
                    jurnal4.map((x, iter) => {
                        return ( ws.addRow({
                                c1: index + 1,
                                c2: item.no_transaksi,
                                c3: 'PP01',
                                c4: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c5: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c6: '',
                                c7: 'SA',
                                c8: item.depo.area,
                                c9: 'IDR',
                                c10: iter + 1,
                                c11: iter === 0 ? item.depo.gl_kk 
                                    : iter === 1 ? dataPph.bankops
                                    : iter === 2 ? item.veriftax.gl_jurnal
                                    : iter === 3 && 
                                    (item.jenis_pph === cek21 ? dataPph.pph21 :
                                    item.jenis_pph === cek23 ? dataPph.pph23 :
                                    item.jenis_pph === cek4a2 && dataPph.pph4a2)
                                ,
                                c12: iter === 0 || iter === 2 ? 40 : 50,
                                c13: '',
                                c14: '',
                                c15: iter === 0 || iter === 1 ? item.nilai_buku : item.nilai_utang,
                                c16: '',
                                c17: iter === 2 ? item.depo.profit_center : '',
                                c18: '',
                                c19: '',
                                c20: item.sub_coa + 's',
                                c21: '',
                                c22: '',
                                c23: '',
                                c24: '',
                                c25: '',
                                c26: '',
                                c27: iter === 1 ? dataPph.pc_ho : item.depo.profit_center,
                                c28: '',
                                c29: '',
                                c30: '',
                                c31: '',
                                c32: '',
                                c33: '',
                                c34: ''
                            })
                        )
                    })
                ) : (item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi === 'Ya' ? ( // berppn tidak berpph
                    jurnal4.map((x, iter) => {
                        return ( ws.addRow({
                                c1: index + 1,
                                c2: item.no_transaksi,
                                c3: 'PP01',
                                c4: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c5: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c6: '',
                                c7: 'SA',
                                c8: item.depo.area,
                                c9: 'IDR',
                                c10: iter + 1,
                                c11: iter === 0 ? item.depo.gl_kk 
                                    : iter === 1 ? dataPph.bankops
                                    : iter === 2 ? dataPph.ppn
                                    : iter === 3 && item.veriftax.gl_jurnal
                                ,
                                c12: iter === 0 || iter === 2 ? 40 : 50,
                                c13: '',
                                c14: '',
                                c15: iter === 0 || iter === 1 ? item.nilai_buku : item.ppn,
                                c16: '',
                                c17: iter === 3 ? item.depo.profit_center : '',
                                c18: '',
                                c19: '',
                                c20: item.sub_coa + 's',
                                c21: '',
                                c22: '',
                                c23: '',
                                c24: '',
                                c25: '',
                                c26: '',
                                c27: iter === 1 ? dataPph.pc_ho : item.depo.profit_center,
                                c28: '',
                                c29: '',
                                c30: '',
                                c31: '',
                                c32: '',
                                c33: '',
                                c34: ''
                            })
                        )
                    })
                ) : (item.jenis_pph !== 'Non PPh' && item.jenis_pph !== null) && item.type_transaksi === 'Ya' && ( // berpph dan berppn
                    jurnal6.map((x, iter) => {
                        return ( ws.addRow({
                                c1: index + 1,
                                c2: item.no_transaksi,
                                c3: 'PP01',
                                c4: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c5: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c6: '',
                                c7: 'SA',
                                c8: item.depo.area,
                                c9: 'IDR',
                                c10: iter + 1,
                                c11: iter === 0 ? item.depo.gl_kk 
                                    : iter === 1 ? dataPph.bankops
                                    : iter === 2 ? dataPph.ppn
                                    : iter === 3 ? item.veriftax.gl_jurnal
                                    : iter === 4 ? item.veriftax.gl_jurnal
                                    : iter === 5 && 
                                        (item.jenis_pph === cek21 ? dataPph.pph21 :
                                        item.jenis_pph === cek23 ? dataPph.pph23 :
                                        item.jenis_pph === cek4a2 && dataPph.pph4a2)
                                ,
                                c12: iter === 0 || iter === 2 || iter === 4 ? 40 : 50,
                                c13: '',
                                c14: '',
                                c15: iter === 0 || iter === 1 ? item.nilai_buku 
                                : iter === 2 || iter === 3 ? item.ppn
                                : item.nilai_utang
                                ,
                                c16: '',
                                c17: (iter === 3 || iter === 4) ? item.depo.profit_center : '',
                                c18: '',
                                c19: '',
                                c20: item.sub_coa + 's',
                                c21: '',
                                c22: '',
                                c23: '',
                                c24: '',
                                c25: '',
                                c26: '',
                                c27: iter === 1 ? dataPph.pc_ho : item.depo.profit_center,
                                c28: '',
                                c29: '',
                                c30: '',
                                c31: '',
                                c32: '',
                                c33: '',
                                c34: '',
                            })
                        )
                    })
                )
            ) : item.tujuan_tf !== 'PMA' && (
                (item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi !== 'Ya' ? ( // tidak berpph dan tidak berppn
                    jurnal2.map((x, iter) => {
                        return ( ws.addRow({
                                c1: index + 1,
                                c2: item.no_transaksi,
                                c3: 'PP01',
                                c4: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c5: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c6: '',
                                c7: 'SA',
                                c8: item.depo.area,
                                c9: 'IDR',
                                c10:iter + 1,
                                c11: iter === 0 ? item.veriftax.gl_jurnal : iter === 1 && dataPph.bankops,
                                c12: iter === 0 ? 40 : 50,
                                c13: '',
                                c14: '',
                                c15: item.nilai_buku,
                                c16: '',
                                c17: iter === 0 ? item.depo.profit_center : '',
                                c18: '',
                                c19: '',
                                c20: item.sub_coa + 's',
                                c21: '',
                                c22: '',
                                c23: '',
                                c24: '',
                                c25: '',
                                c26: '',
                                c27: iter === 0 ? item.depo.profit_center : dataPph.pc_ho,
                                c28: '',
                                c29: '',
                                c30: '',
                                c31: '',
                                c32: '',
                                c33: '',
                                c34: '',
                            })
                        )
                    })
                ) : (item.jenis_pph !== 'Non PPh' && item.jenis_pph !== null) && item.type_transaksi !== 'Ya' ? ( // berpph tidak berppn
                    jurnal3.map((x, iter) => {
                        return ( ws.addRow({
                                c1: index + 1,
                                c2: item.no_transaksi,
                                c3: 'PP01',
                                c4: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c5: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c6: '',
                                c7: 'SA',
                                c8: item.depo.area,
                                c9: 'IDR',
                                c10: iter + 1,
                                c11: iter === 0 ? item.veriftax.gl_jurnal 
                                    : iter === 1 ? 
                                    (item.jenis_pph === cek21 ? dataPph.pph21 :
                                    item.jenis_pph === cek23 ? dataPph.pph23 :
                                    item.jenis_pph === cek4a2 && dataPph.pph4a2)
                                    : iter === 2 && dataPph.bankops
                                ,
                                c12: iter === 0 ? 40 : 50,
                                c13: '',
                                c14: '',
                                c15: iter === 0 ? item.nilai_buku : iter === 1 ? item.nilai_utang : item.nilai_bayar,
                                c16: '',
                                c17: iter === 0 ? item.depo.profit_center : '',
                                c18: '',
                                c19: '',
                                c20: item.sub_coa + 's',
                                c21: '',
                                c22: '',
                                c23: '',
                                c24: '',
                                c25: '',
                                c26: '',
                                c27: iter === 2 ? dataPph.pc_ho : item.depo.profit_center,
                                c28: '',
                                c29: '',
                                c30: '',
                                c31: '',
                                c32: '',
                                c33: '',
                                c34: '',
                            })
                        )
                    })
                ) : (item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi === 'Ya' ? ( // berppn tidak berpph
                    jurnal3.map((x, iter) => {
                        return ( ws.addRow({
                                c1: index + 1,
                                c2: item.no_transaksi,
                                c3: 'PP01',
                                c4: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c5: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                c6: '',
                                c7: 'SA',
                                c8: item.depo.area,
                                c9: 'IDR',
                                c10: iter + 1,
                                c11: iter === 0 ? item.veriftax.gl_jurnal
                                    : iter === 1 ? dataPph.ppn
                                    : iter === 2 && dataPph.bankops
                                ,
                                c12: iter === 0 || iter === 1 ? 40 : 50,
                                c13: '',
                                c14: '',
                                c15: iter === 0 ? item.nilai_bayar : iter === 1 ? item.ppn : item.nilai_buku,
                                c16: '',
                                c17: iter === 0 ? item.depo.profit_center : '',
                                c18: '',
                                c19: '',
                                c20: item.sub_coa + 's',
                                c21: '',
                                c22: '',
                                c23: '',
                                c24: '',
                                c25: '',
                                c26: '',
                                c27: iter === 2 ? dataPph.pc_ho : item.depo.profit_center,
                                c28: '',
                                c29: '',
                                c30: '',
                                c31: '',
                                c32: '',
                                c33: '',
                                c34: '',
                            })
                        )
                    })
                ) : (item.jenis_pph !== 'Non PPh' && item.jenis_pph !== null) && item.type_transaksi === 'Ya' && ( // berpph dan berppn
                        jurnal4.map((x, iter) => {
                            return ( ws.addRow({
                                    c1: index + 1,
                                    c2: item.no_transaksi,
                                    c3: 'PP01',
                                    c4: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                    c5: moment(item.tanggal_transfer).format('DDMMYYYY'),
                                    c6: '',
                                    c7: 'SA',
                                    c8: item.depo.area,
                                    c9: 'IDR',
                                    c10: iter + 1,
                                    c11: iter === 0 ? item.veriftax.gl_jurnal 
                                        : iter === 1 ? dataPph.ppn
                                        : iter === 2 ? 
                                        (item.jenis_pph === cek21 ? dataPph.pph21 :
                                            item.jenis_pph === cek23 ? dataPph.pph23 :
                                            item.jenis_pph === cek4a2 && dataPph.pph4a2)
                                        : iter === 3 && dataPph.bankops
                                    ,
                                    c12: iter === 0 || iter === 1 ? 40 
                                    : (iter === 2 || iter === 3) && 50
                                    ,
                                    c13: '',
                                    c14: '',
                                    c15: 
                                        iter === 0 ? item.nilai_bayar 
                                        : iter === 1 ? item.ppn 
                                        : iter === 2 ? item.nilai_utang 
                                        : iter === 3 && item.nilai_buku 
                                    ,
                                    c16: '',
                                    c17: (iter === 0 || iter === 3) ? item.depo.profit_center : '',
                                    c18: '',
                                    c19: '',
                                    c20: item.sub_coa + 's',
                                    c21: '',
                                    c22: '',
                                    c23: '',
                                    c24: '',
                                    c25: '',
                                    c26: '',
                                    c27: iter === 3 ? dataPph.pc_ho : item.depo.profit_center,
                                    c28: '',
                                    c29: '',
                                    c30: '',
                                    c31: '',
                                    c32: '',
                                    c33: '',
                                    c34: ''
                                })
                            )
                        })
                )
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
            column.width = maxLength + 2
        })

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `FIle Upload Jurnal Operasional ${moment().format('DD MMMM YYYY')}.xlsx`
            )
        })
        this.setLoading(false)
    }

    chekRej = (val) => {
        const {listOps} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listOps: data})
        } else {
            const data = []
            for (let i = 0; i < listOps.length; i++) {
                if (listOps[i] === val) {
                    data.push()
                } else {
                    data.push(listOps[i])
                }
            }
            this.setState({listOps: data})
        }
    }

    prepareReject = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAllMenu(token, 'reject')
        await this.props.getReason(token)
        const dataMenu = this.props.menu.dataAll
        const data = []
        dataMenu.map(item => {
            return (item.kode_menu === 'Ops' && data.push(item))
        })
        this.setState({dataMenu: dataMenu})
        this.openModalReject()
    }

    getRinciStock = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({dataRinci: val, dataId: val.id})
        await this.props.getDetailItem(token, val.id)
        this.openModalStock()
    }

    openModalStock = () => {
        this.setState({modalStock: !this.state.modalStock})
    }

    dropDown = () => {
        this.setState({drop: !this.state.drop})
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataRinci, dropApp, dataPph, listOps, jurnalMap, listReason, 
            dataMenu, listMenu, dataDownload, jurnal2, jurnal3, jurnal4, jurnal6} = this.state
        const { detailDepo, dataDepo } = this.props.depo
        const { dataReason } = this.props.reason
        const { noDis, detailOps, ttdOps, dataDoc, newOps, dataReport } = this.props.ops
        // const pages = this.props.depo.page

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
                        <div className={style.bodyDashboard}>
                            {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                                <div>{alertM}</div>
                            </Alert> */}
                            <div className={style.headMaster}>
                                <div className={style.titleDashboard}>Report Konsol Operasional</div>
                            </div>
                            <div className={style.secEmail3}>
                                <div className={style.headEmail2}>
                                    <Button className="mr-2" color='success' onClick={this.prosesDownload}>Download Konsol</Button>
                                    <Button 
                                        color='warning' 
                                        className='mr-2' 
                                        onClick={() => this.prosesJurnal('Jurnal')}>
                                            Download Jurnal
                                    </Button>
                                </div>
                                <div className={style.searchEmail2}>
                                    <text>Status:  </text>
                                    <Input className={style.filter} type="select" value={this.state.filter} onChange={e => this.changeFilter(e.target.value)}>
                                        <option value="reject">Reject</option>
                                        <option value="ready">Siap Bayar</option>
                                        <option value="bayar">Telah Bayar</option>
                                    </Input>
                                </div>
                            </div>
                            <div className={[style.secEmail4]}>
                                <div className={style.headEmail2}>
                                    <Input className={style.filter2} type="select" value={this.state.time} onChange={e => this.changeTime(e.target.value)}>
                                        <option value="all">All</option>
                                        <option value="pilih">Periode</option>
                                    </Input>
                                    {this.state.time === 'pilih' ?  (
                                        <>
                                            <div className='rowCenter'>
                                                <text className='bold'>:</text>
                                                <Input
                                                    type= "date" 
                                                    className="inputRinci"
                                                    value={this.state.time1}
                                                    onChange={e => this.selectTime({val: e.target.value, type: 'time1'})}
                                                />
                                                <text className='mr-1 ml-1'>To</text>
                                                <Input
                                                    type= "date"
                                                    value={this.state.time2}
                                                    className="inputRinci"
                                                    onChange={e => this.selectTime({val: e.target.value, type: 'time2'})}
                                                />
                                                <Button
                                                disabled={this.state.time1 === '' || this.state.time2 === '' ? true : false} 
                                                color='primary' 
                                                onClick={this.getDataTime} 
                                                className='ml-1'>
                                                    Go
                                                </Button>
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                                <div className={style.searchEmail2}>
                                    <text>Search: </text>
                                    <Input 
                                    className={style.search}
                                    onChange={this.onSearch}
                                    value={this.state.search}
                                    onKeyPress={this.onSearch}
                                    >
                                    </Input>
                                </div>
                            </div>
                            <div className='mb-4 mt-2' />
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={[style.tab, 'tableJurnal']} id="table-ops">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input  
                                                    className='mr-2'
                                                    type='checkbox'
                                                    checked={listOps.length === 0 ? false : listOps.length === dataReport.length ? true : false}
                                                    onChange={() => listOps.length === dataReport.length ? this.chekRej('all') : this.chekApp('all')}
                                                    />
                                                </th>
                                                <th>No</th>
                                                <th>PIC</th>
                                                <th>NAMA</th>
                                                <th>AREA</th>
                                                <th>NOMOR FPD</th>
                                                <th>COST CENTRE</th>
                                                <th>NO COA</th>
                                                <th>NAMA COA</th>
                                                <th>KETERANGAN TAMBAHAN</th>
                                                <th>TGL AJUAN</th>
                                                <th>PERIODE (DDMMYY)</th>
                                                <th>NILAI YANG DIAJUKAN</th>
                                                <th>BANK</th>
                                                <th>NOMOR REKENING</th>
                                                <th>ATAS NAMA</th>
                                                <th>MEMILIKI NPWP</th>
                                                <th>NAMA SESUAI NPWP</th>
                                                <th>NOMOR NPWP</th>
                                                <th>NAMA SESUAI KTP</th>
                                                <th>NIK</th>
                                                <th>DPP</th>
                                                <th>PPN</th>
                                                <th>PPh</th>
                                                <th>Jenis PPh</th>
                                                <th>Transaksi Ber PPN</th>
                                                <th>Tujuan Transfer</th>
                                                <th>NILAI YANG DIAJUKAN</th>
                                                <th>NILAI YANG DIBAYARKAN</th>
                                                <th>NILAI YANG DIBUKUKAN</th>
                                                <th>PO</th>
                                                <th>TANGGAL TRANSFER</th>
                                                <th>KETERANGAN</th>
                                                <th>STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataReport.map(item => {
                                                return (
                                                   
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                         <td>
                                                            <input 
                                                            type='checkbox'
                                                            checked={listOps.find(element => element === item.id) !== undefined ? true : false}
                                                            onChange={listOps.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                            />
                                                        </td>
                                                        <td>{dataReport.indexOf(item) + 1}</td>
                                                        <td>{item.finance.pic_finance}</td>
                                                        <td>{item.area}</td>
                                                        <td>{item.depo.channel}</td>
                                                        <td>{item.no_transaksi}</td>
                                                        <td>{item.cost_center}</td>
                                                        <td>{item.no_coa}</td>
                                                        <td>{item.nama_coa}</td>
                                                        <td>{item.keterangan}</td>
                                                        <td>{moment(item.start_ops).format('DD MMMM YYYY')}</td>
                                                        <td>{moment(item.periode_awal).format('MMMM YYYY') === moment(item.periode_akhir).format('MMMM YYYY') ? moment(item.periode_awal).format('MMMM YYYY') : moment(item.periode_awal).format('DD MMMM YYYY') - moment(item.periode_akhir).format('DD MMMM YYYY')}</td>
                                                        <td>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.bank_tujuan}</td>
                                                        <td>{item.norek_ajuan}</td>
                                                        <td>{item.nama_tujuan}</td>
                                                        <td>{item.status_npwp === 0 ? 'Tidak' : 'Ya'}</td>
                                                        <td>{item.status_npwp === 0 ? '' : item.nama_npwp}</td>
                                                        <td>{item.status_npwp === 0 ? '' : item.no_npwp}</td>
                                                        <td>{item.status_npwp === 0 ? item.nama_ktp : ''}</td>
                                                        <td>{item.status_npwp === 0 ? item.no_ktp : ''}</td>
                                                        <td>{item.dpp}</td>
                                                        <td>{item.ppn}</td>
                                                        <td>{item.nilai_utang}</td>
                                                        <td>{item.jenis_pph}</td>
                                                        <td>{item.type_transaksi}</td>
                                                        <td>{item.tujuan_tf}</td>
                                                        <td>{item.nilai_ajuan}</td>
                                                        <td>
                                                            {item.nilai_bayar !== null ? item.nilai_bayar : 
                                                                (item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi !== 'Ya' ? item.nilai_ajuan
                                                                : item.jenis_pph !== 'Non PPh' && item.type_transaksi !== 'Ya' ? parseFloat(item.nilai_ajuan) - parseFloat(item.nilai_utang)
                                                                : item.jenis_pph !== 'Non PPh' && item.type_transaksi === 'Ya' && parseFloat(item.nilai_ajuan) - parseFloat(item.nilai_utang)
                                                            }
                                                        </td>
                                                        <td>{item.nilai_buku}</td>
                                                        <td>{item.no_po}</td>
                                                        <td>{moment(item.tanggal_transfer).format('DD MMMM YYYY')}</td>
                                                        <td>{item.type_kasbon === 'kasbon' ? 'Kasbon' : 'Non Kasbon'}</td>
                                                        <td>{item.history.split(',').reverse()[0]}</td>
                                                    </tr>
                                                )
                                            })}
                                            {dataReport.length > 0 && (
                                                <tr>
                                                    <th className='total' colSpan={12}>Total</th>
                                                    <th>
                                                        {dataReport.reduce((accumulator, object) => {
                                                            return accumulator + parseInt(object.nilai_ajuan);
                                                        }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                    </th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            <div>
                                <div className={style.infoPageEmail1}>
                                    <text>Showing 1 of 1 pages</text>
                                    <div className={style.pageButton}>
                                        <button 
                                            className={style.btnPrev} 
                                            color="info" 
                                            disabled
                                            // disabled={page.prevLink === null ? true : false} 
                                            onClick={this.prev}>Prev
                                        </button>
                                        <button 
                                            className={style.btnPrev} 
                                            color="info" 
                                            disabled
                                            // disabled={page.nextLink === null ? true : false} 
                                            onClick={this.next}>Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </MaterialTitlePanel>
                </Sidebar>

                 <Modal className='modalrinci' isOpen={this.state.modalDownload} toggle={this.openDownload} size="xl">
                    <ModalHeader>
                        Download Report
                    </ModalHeader>
                    <ModalBody>
                        <Table bordered responsive hover className={style.tab}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>PIC</th>
                                    <th>NAMA</th>
                                    <th>AREA</th>
                                    <th>NOMOR FPD</th>
                                    <th>COST CENTRE</th>
                                    <th>NO COA</th>
                                    <th>NAMA COA</th>
                                    <th>KETERANGAN TAMBAHAN</th>
                                    <th>TGL AJUAN</th>
                                    <th>PERIODE (DDMMYY)</th>
                                    <th>NILAI YANG DIAJUKAN</th>
                                    <th>BANK</th>
                                    <th>NOMOR REKENING</th>
                                    <th>ATAS NAMA</th>
                                    <th>MEMILIKI NPWP</th>
                                    <th>NAMA SESUAI NPWP</th>
                                    <th>NOMOR NPWP</th>
                                    <th>NAMA SESUAI KTP</th>
                                    <th>NIK</th>
                                    <th>DPP</th>
                                    <th>PPN</th>
                                    <th>PPh</th>
                                    <th>Jenis PPh</th>
                                    <th>NILAI YANG DIAJUKAN</th>
                                    <th>NILAI YANG DIBAYARKAN</th>
                                    <th>NILAI YANG DIBUKUKAN</th>
                                    <th>TANGGAL TRANSFER</th>
                                    <th>KETERANGAN</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataDownload.map(item => {
                                    return (
                                        <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                            <th>{dataDownload.indexOf(item) + 1}</th>
                                            <th>{item.finance.pic_finance}</th>
                                            <th>{item.area}</th>
                                            <th>{item.depo.channel}</th>
                                            <th>{item.no_transaksi}</th>
                                            <th>{item.cost_center}</th>
                                            <th>{item.no_coa}</th>
                                            <th>{item.nama_coa}</th>
                                            <th>{item.keterangan}</th>
                                            <th>{moment(item.start_ops).format('DD MMMM YYYY')}</th>
                                            <th>{moment(item.periode_awal).format('MMMM YYYY') === moment(item.periode_akhir).format('MMMM YYYY') ? moment(item.periode_awal).format('MMMM YYYY') : moment(item.periode_awal).format('DD MMMM YYYY') - moment(item.periode_akhir).format('DD MMMM YYYY')}</th>
                                            <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                            <th>{item.bank_tujuan}</th>
                                            <th>{item.norek_ajuan}</th>
                                            <th>{item.nama_tujuan}</th>
                                            <th>{item.status_npwp === 0 ? 'Tidak' : 'Ya'}</th>
                                            <th>{item.status_npwp === 0 ? '' : item.nama_npwp}</th>
                                            <th>{item.status_npwp === 0 ? '' : item.no_npwp}</th>
                                            <th>{item.status_npwp === 0 ? item.nama_ktp : ''}</th>
                                            <th>{item.status_npwp === 0 ? item.no_ktp : ''}</th>
                                            <th>{item.dpp}</th>
                                            <th>{item.ppn}</th>
                                            <th>{item.nilai_utang}</th>
                                            <th>{item.nilai_bayar}</th>
                                            <th>{moment(item.tanggal_transfer).format('DD MMMM YYYY')}</th>
                                            <th></th>
                                            <th>{item.history.split(',').reverse()[0]}</th>
                                        </tr>
                                    )
                                })}
                                {dataDownload.length > 0 && (
                                    <tr>
                                        <th className='total' colSpan={11}>Total</th>
                                        <th>
                                            {dataDownload.reduce((accumulator, object) => {
                                                return accumulator + parseInt(object.nilai_ajuan);
                                            }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                        </th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button color='warning' className='mb-4' onClick={this.downloadOps}>Download Report</Button>
                            <Button color='success' className='mb-4 ml-3' onClick={this.openDownload}>Close</Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalUpload} toggle={this.openModalUpload} size="lg">
                    <ModalHeader>
                        Upload gambar asset
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <div className="leftRinci2 mb-5">
                                <div className="titRinci">{dataRinci.nama_asset}</div>
                                {/* <img src={detRinci.img === undefined || detRinci.img.length === 0 ? placeholder : `${REACT_APP_BACKEND_URL}/${detRinci.img[detRinci.img.length - 1].path}`} className="imgRinci" /> */}
                                <Input type="file" className='mt-2' onChange={this.uploadGambar}>Upload Picture</Input>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='primary' onClick={this.openModalUpload}>Done</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalEdit} toggle={this.openModalEdit} size="lg">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                </Modal>
                <Modal isOpen={this.state.modalStock} toggle={this.openModalStock} size="lg">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                </Modal>
                <Modal isOpen={this.state.modalRinci} className='modalrinci'  toggle={this.openModalRinci} size="xl">
                    <ModalBody>
                        <div>
                            {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                            {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].no_transaksi : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailOps.length > 0 ? moment(detailOps[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
                            </Row>
                        </div>
                        <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr className='tbops'>
                                        <th>
                                            <input  
                                            className='mr-2'
                                            type='checkbox'
                                            checked={listOps.length === 0 ? false : listOps.length === detailOps.length ? true : false}
                                            onChange={() => listOps.length === detailOps.length ? this.chekRej('all') : this.chekApp('all')}
                                            />
                                            Select
                                        </th>
                                        <th>NO</th>
                                        <th>COST CENTRE</th>
                                        <th>NO COA</th>
                                        <th>NAMA COA</th>
                                        <th>KETERANGAN TAMBAHAN</th>
                                        <th>PERIODE</th>
                                        <th>NILAI YANG DIAJUKAN</th>
                                        <th>BANK</th>
                                        <th>NOMOR REKENING</th>
                                        <th>ATAS NAMA</th>
                                        <th>MEMILIKI NPWP</th>
                                        <th>NAMA SESUAI NPWP</th>
                                        <th>NOMOR NPWP</th>
                                        <th>NAMA SESUAI KTP</th>
                                        <th>NOMOR KTP</th>
                                        <th>DPP</th>
                                        <th>PPN</th>
                                        <th>NOMINAL</th>
                                        <th>NILAI YANG DIBAYARKAN</th>
                                        <th>TANGGAL TRANSFER</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailOps.length !== 0 && detailOps.map(item => {
                                        return (
                                            <tr>
                                                <th>
                                                    <input 
                                                    type='checkbox'
                                                    checked={listOps.find(element => element === item.id) !== undefined ? true : false}
                                                    onChange={listOps.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                    />
                                                </th>
                                                <th scope="row">{detailOps.indexOf(item) + 1}</th>
                                                <th>{item.cost_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.keterangan}</th>
                                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.status_npwp === 0 ? 'Tidak' : 'Ya'}</th>
                                                <th>{item.status_npwp === 0 ? '' : item.nama_npwp}</th>
                                                <th>{item.status_npwp === 0 ? '' : item.no_npwp}</th>
                                                <th>{item.status_npwp === 0 ? item.nama_ktp : ''}</th>
                                                <th>{item.status_npwp === 0 ? item.no_ktp : ''}</th>
                                                <th>{item.ppu}</th>
                                                <th>{item.pa}</th>
                                                <th>{item.nilai_bayar}</th>
                                                <th>{item.nilai_bayar}</th>
                                                <th>{item.tanggal_transfer}</th>
                                                <th>{item.isreject === 1 ? 'reject' : '-'}</th>
                                            </tr>
                                            )
                                        })}
                                </tbody>
                            </Table>
                        </div>
                    </ModalBody>
                    <div className="modalFoot ml-3">
                        <div className="btnFoot">
                            <Button className="mr-2" color="info"  onClick={() => this.prosesModalFpd()}>FPD</Button>
                            <Button className="mr-2" color="warning"  onClick={() => this.openModalFaa()}>FAA</Button>
                            <Button color="primary"  onClick={() => this.openProsesModalDoc(detailOps[0])}>Dokumen</Button>
                        </div>
                        <div className="btnFoot">
                            {this.state.filter !== 'available' && this.state.filter !== 'revisi' ? (
                                <div></div>
                            ) : (
                                <>
                                    <Button className="mr-2" disabled={this.state.filter === 'revisi'  && listOps.length > 0 ? false : this.state.filter !== 'available' ? true : listOps.length === 0 ? true : false} color="danger" onClick={this.prepareReject}>
                                        Reject
                                    </Button>
                                    <Button color="success" disabled={this.state.filter === 'revisi'  ? false : this.state.filter !== 'available' ? true : false} onClick={this.openModalApprove}>
                                        Approve
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Modal>
                <Modal className='modalrinci' isOpen={this.state.modalFaa} toggle={this.openModalFaa} size="xl">
                    <ModalHeader>
                        FORM AJUAN AREA
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                            {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].no_transaksi : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailOps.length > 0 ? moment(detailOps[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
                            </Row>
                        </div>
                        <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr className='tbops'>
                                        <th>
                                            <input  
                                            className='mr-2'
                                            type='checkbox'
                                            checked={listOps.length === 0 ? false : listOps.length === detailOps.length ? true : false}
                                            onChange={() => listOps.length === detailOps.length ? this.chekRej('all') : this.chekApp('all')}
                                            />
                                            Select
                                        </th>
                                        <th>NO</th>
                                        <th>COST CENTRE</th>
                                        <th>NO COA</th>
                                        <th>NAMA COA</th>
                                        <th>KETERANGAN TAMBAHAN</th>
                                        <th>PERIODE</th>
                                        <th>NILAI YANG DIAJUKAN</th>
                                        <th>BANK</th>
                                        <th>NOMOR REKENING</th>
                                        <th>ATAS NAMA</th>
                                        <th>MEMILIKI NPWP</th>
                                        <th>NAMA SESUAI NPWP</th>
                                        <th>NOMOR NPWP</th>
                                        <th>PPU</th>
                                        <th>PA</th>
                                        <th>NOMINAL</th>
                                        <th>NILAI YANG DIBAYARKAN</th>
                                        <th>TANGGAL TRANSFER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailOps.length !== 0 && detailOps.map(item => {
                                        return (
                                            <tr>
                                                <th>
                                                    <input 
                                                    type='checkbox'
                                                    checked={listOps.find(element => element === item.id) !== undefined ? true : false}
                                                    onChange={listOps.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                    />
                                                </th>
                                                <th scope="row">{detailOps.indexOf(item) + 1}</th>
                                                <th>{item.cost_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.keterangan}</th>
                                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.status_npwp === 0 ? '' : 'Ya'}</th>
                                                <th>{item.status_npwp === 0 ? '' : item.nama_npwp}</th>
                                                <th>{item.status_npwp === 0 ? '' : item.no_npwp}</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                        <Table borderless responsive className="tabPreview mt-4">
                           <thead>
                               <tr>
                                   <th className="buatPre">Dibuat oleh,</th>
                                   <th className="buatPre">Diperiksa oleh,</th>
                                   <th className="buatPre">Disetujui oleh,</th>
                                   <th className="buatPre">Diketahui oleh,</th>
                               </tr>
                           </thead>
                           <tbody className="tbodyPre">
                               <tr>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-3">{item.nama === null ? "-" : item.status === '0' ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')})` : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')})`}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
                                                    return (
                                                        <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                    )
                                                })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                                        <th className="headPre">
                                                            <div className="mb-2">-</div>
                                                            <div>-</div>
                                                        </th>
                                                    ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-3">{item.nama === null ? "-" : item.status === '0' ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')})` : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')})`}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                                        <td className="footPre">-</td>
                                                    ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
                                                        return (
                                                            <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                        )
                                                    })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-3">{item.nama === null ? "-" : item.status === '0' ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')})` : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')})`}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
                                                        return (
                                                            <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                        )
                                                    })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-3">{item.nama === null ? "-" : item.status === '0' ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')})` : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')})`}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.map(item => {
                                                        return (
                                                            <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                        )
                                                    })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                               </tr>
                           </tbody>
                       </Table>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning">
                                {/* <TableStock /> */}
                                Download
                            </Button>
                            <Button color="success" onClick={this.openModalFaa}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalFpd} toggle={this.openModalFpd} size="lg">
                    <ModalBody>
                        <div>
                            <div className="fpdTit">FORM PERMINTAAN DANA</div>
                            <div className='fpdTit'>cabang/depo : {detailOps.length > 0 ? detailOps[0].area : ''}</div>
                            <div className='fpdTit'>no : {detailOps.length > 0 ? detailOps[0].no_transaksi : ''}</div>
                        </div>
                        <div className={style.tableDashboard}>
                            <Row>
                                <Col md={1} className='upper'>
                                    <div className='liner2'>no</div>
                                </Col>
                                <Col md={8} className='upper'>
                                    <div className='line'>keperluan / <br />keterangan</div>
                                </Col>
                                <Col md={3} className='upper'>
                                    <div className='liner'>rupiah</div>
                                </Col>
                            </Row>
                            {detailOps.length !== 0 && detailOps.map(item => {
                                return (
                                    <Row className='mt-4'>
                                        <Col md={1} className='upper'>
                                            <div className='line'>{detailOps.indexOf(item) + 1}</div>
                                        </Col>
                                        <Col md={8} className='upper'>
                                            <div className='line2'>{item.keterangan}</div>
                                            <div className='line mt-1'>NO REK {item.bank_tujuan} {item.norek_ajuan}</div>
                                        </Col>
                                        <Col md={3} className='upper'>
                                            <div className='line'>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                                        </Col>
                                    </Row>
                                )
                            })}
                            <Row className='mt-4'>
                                <Col md={1} className='upper'>
                                </Col>
                                <Col md={8} className='upper'>
                                    <div className='line'>Total</div>
                                </Col>
                                <Col md={3} className='upper'>
                                    <div className='line'>
                                        {this.state.totalfpd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className='bold'>{detailOps.length > 0 ? detailOps[0].area : ''}, {moment(detailOps.length > 0 ? moment(detailOps[0].updatedAt).format('DD MMMM YYYY') : '').format('DD MMMM YYYY')}</div>
                        <Table borderless responsive className="tabPreview mt-4">
                           <thead>
                               <tr>
                                   <th className="buatPre">Dibuat oleh,</th>
                                   <th className="buatPre">Diperiksa oleh,</th>
                                   <th className="buatPre">Disetujui oleh,</th>
                               </tr>
                           </thead>
                           <tbody className="tbodyPre">
                               <tr>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-3">{item.nama === null ? "-" : item.status === '0' ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')})` : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')})`}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
                                                    return (
                                                        <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                    )
                                                })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                                        <th className="headPre">
                                                            <div className="mb-2">-</div>
                                                            <div>-</div>
                                                        </th>
                                                    ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-3">{item.nama === null ? "-" : item.status === '0' ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')})` : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')})`}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                                        <td className="footPre">-</td>
                                                    ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
                                                        return (
                                                            <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                        )
                                                    })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-3">{item.nama === null ? "-" : item.status === '0' ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')})` : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')})`}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
                                                        return (
                                                            <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                        )
                                                    })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                               </tr>
                           </tbody>
                       </Table>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning">
                                {/* <TableStock /> */}
                                Download
                            </Button>
                            <Button color="success" onClick={this.openModalFpd}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectOps(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                                <div className='mb-2 quest'>Anda yakin untuk reject ?</div>
                                <div className='mb-2 titStatus'>Pilih alasan :</div>
                                {dataReason.length > 0 && dataReason.map(item => {
                                    return (
                                    <div className="ml-2">
                                        <Input
                                        addon
                                        type="checkbox"
                                        checked= {listReason.find(element => element === item.desc) !== undefined ? true : false}
                                        onClick={listReason.find(element => element === item.desc) === undefined ? () => this.reasonApp(item.desc) : () => this.reasonRej(item.desc)}
                                        />  {item.desc}
                                    </div>
                                    )
                                })}
                                <div className={style.alasan}>
                                    <text className='ml-2'>
                                        Lainnya
                                    </text>
                                </div>
                                <Input 
                                type="name" 
                                name="select" 
                                className="ml-2 inputRec"
                                value={values.alasan}
                                onChange={handleChange('alasan')}
                                onBlur={handleBlur('alasan')}
                                />
                                <div className='ml-2'>
                                    {listReason.length === 0 ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                                <div className='mt-3 mb-2 titStatus'>Pilih menu revisi :</div>
                                {dataMenu.length > 0 && dataMenu.map(item => {
                                    return (
                                    <div className="ml-2">
                                        <Input
                                        addon
                                        type="checkbox"
                                        checked= {listMenu.find(element => element === item.name) !== undefined ? true : false}
                                        onClick={listMenu.find(element => element === item.name) === undefined ? () => this.menuApp(item.name) : () => this.menuRej(item.name)}
                                        />  {item.name}
                                    </div>
                                    )
                                })}
                                <div className={style.btnApprove}>
                                    <Button color="primary" disabled={(values.alasan === '.' || values.alasan === '') && listReason.length === 0 ? true : false} onClick={handleSubmit}>Submit</Button>
                                    <Button className='ml-2' color="secondary" onClick={this.openModalReject}>Close</Button>
                                </div>
                            </div>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.ops.isLoading || this.state.isLoading} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApprove && level !== '5'} toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve     
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.approveDataOps()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalSubmit} toggle={this.openModalSub} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk submit     
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.submitAset()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalSub}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm}>
                <ModalBody>
                    {this.state.confirm === 'approve' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'reject' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Reject</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejApprove' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'rejReject' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'isApprove' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'submit' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.alert} size="sm">
                <ModalBody>
                    <div>
                        <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>....</div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal size="xl" isOpen={this.state.modalDoc} toggle={this.openModalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen
                </ModalHeader>
                <ModalBody>
                <Container>
                        {dataDoc !== undefined && dataDoc.map(x => {
                            return (
                                <Row className="mt-3 mb-4">
                                    {x.path !== null ? (
                                        <Col md={12} lg={12} className='mb-2' >
                                            <div className="btnDocIo mb-2" >{x.desc === null ? 'Lampiran' : x.desc}</div>
                                            {x.status === 0 ? (
                                                <AiOutlineClose size={20} />
                                            ) : x.status === 3 ? (
                                                <AiOutlineCheck size={20} />
                                            ) : (
                                                <BsCircle size={20} />
                                            )}
                                            <button className="btnDocIo blue" onClick={() => this.showDokumen(x)} >{x.history}</button>
                                            {/* <div className="colDoc">
                                                <input
                                                className="ml-4"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                                <text className="txtError ml-4">Maximum file upload is 20 Mb</text>
                                            </div> */}
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} className="colDoc">
                                            <text className="btnDocIo" >{x.desc === null ? 'Lampiran' : x.desc}</text>
                                            <div className="colDoc">
                                                <input
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            </div>
                                            <text className="txtError ml-4">Maximum file upload is 20 Mb</text>
                                        </Col>
                                    )}
                                </Row>
                            )
                        })}
                    </Container>
                </ModalBody>
                <ModalFooter>
                    <Button className="mr-2" color="secondary" onClick={this.openModalDoc}>
                        Close
                    </Button>
                    {/* {this.state.stat === 'DIPINJAM SEMENTARA' && (dataDoc.length === 0 || dataDoc.find(({status}) => status === 1) === undefined) ? (
                        <Button color="primary" disabled onClick={this.updateStatus}>
                            Save 
                        </Button>
                    ) : this.state.stat === 'DIPINJAM SEMENTARA' && (
                        <Button color="primary" onClick={this.updateStatus}>
                            Save 
                        </Button>
                    )}
                    {this.state.stat !== 'DIPINJAM SEMENTARA' && (
                        <Button color="primary" onClick={this.openModalDoc}>
                            Save 
                        </Button>
                    )} */}
                </ModalFooter>
            </Modal>
            <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                <ModalHeader>Dokumen</ModalHeader>
                <ModalBody>
                    <div className={style.readPdf}>
                        <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} />
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        <div>
                            <Button color="success" onClick={() => this.downloadData()}>Download</Button>
                        </div>
                        <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                    </div>
                </ModalBody>
            </Modal>
            <Modal size="xl" className='modalrinci' isOpen={this.state.modalJurnal} toggle={this.openJurnal}>
                <ModalHeader>
                    Download Jurnal
                </ModalHeader>
                <ModalBody>
                    <div className={style.tableDashboard}>
                        <Table bordered responsive hover className='tabjurnal'>
                            <thead>
                                <tr>
                                    <th>no</th>
                                    <th>header_text</th>
                                    <th>comp_code</th>
                                    <th>doc_date</th>
                                    <th>post_date</th>
                                    <th>period</th>
                                    <th>doc_type</th>
                                    <th>ref_doc_no</th>
                                    <th>curr</th>
                                    <th>item_no</th>
                                    <th>gl_acc</th>
                                    <th>post_key</th>
                                    <th>gl_indic</th>
                                    <th>func_area</th>
                                    <th>amount</th>
                                    <th>tax_code</th>
                                    <th>cost_ctr</th>
                                    <th>wbs_elemnt</th>
                                    <th>aufnr</th>
                                    <th>item_text</th>
                                    <th>valdate</th>
                                    <th>bsldate</th>
                                    <th>payterm</th>
                                    <th>paymeth</th>
                                    <th>parbank</th>
                                    <th>houbank</th>
                                    <th>prctr</th>
                                    <th>gsber</th>
                                    <th>vat_base</th>
                                    <th>account_id</th>
                                    <th>assignment</th>
                                    <th>ref_key(head)</th>
                                    <th>ref_key(head2)</th>
                                    <th>ref_key 3</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>No Identifikasi</th>
                                    <th>Text Bebas</th>
                                    <th>Kode</th>
                                    <th>Tanggal Faktur</th>
                                    <th>Tanggal Posting</th>
                                    <th></th>
                                    <th>Tipe Dokumen</th>
                                    <th>No Dokumen Pendukung</th>
                                    <th>Mata Uang</th>
                                    <th>Nomor Item</th>
                                    <th>Nomor Akun</th>
                                    <th>Posting Key</th>
                                    <th>Kode Special</th>
                                    <th>Kosongi Saja</th>
                                    <th>Jumlah</th>
                                    <th>Kode PPN</th>
                                    <th>Cost Center</th>
                                    <th>No WBSt</th>
                                    <th>Kode Order</th>
                                    <th>Text Bebas</th>
                                    <th>Kosongi</th>
                                    <th>Tanggal</th>
                                    <th>TOP</th>
                                    <th>Metode</th>
                                    <th>Kode Rekening</th>
                                    <th>Kode Cabang</th>
                                    <th>Profit Center</th>
                                    <th>SBU</th>
                                    <th>DPP PPN</th>
                                    <th>Nomor ID</th>
                                    <th>Untuk AP</th>
                                    <th>Status Payment</th>
                                    <th>Hanya diisi</th>
                                    <th>Hanya diisi</th>
                                </tr>
                                {dataDownload.length !== 0 && dataDownload.map((item, index) => {
                                    return (
                                        item.veriftax !== null && item.veriftax.grouping !== null && item.veriftax.grouping.toLowerCase() === 'kasbon' ? (
                                            jurnal2.map((x, iter) => {
                                                return (
                                                    <tr>
                                                        <th>{index + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>PP01</th>
                                                        <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                        <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                        <th></th>
                                                        <th>SA</th>
                                                        <th>{item.finance.pic_finance}</th>
                                                        <th>IDR</th>
                                                        <th>{iter + 1}</th>
                                                        <th>{iter === 0 ? item.depo.gl_kk : iter === 1 && dataPph.bankops}</th>
                                                        <th>{iter === 0 ? 29 : 50}</th>
                                                        <th>{iter === 0 && 'E'}</th>
                                                        <th></th>
                                                        <th>{item.nilai_buku}</th>
                                                        <th></th>
                                                        <th>{item.depo.profit_center}</th>
                                                        <th></th>
                                                        <th></th>
                                                        <th>{item.sub_coa}s</th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th>{item.depo.profit_center}</th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        {/* <th>{item.taxcode === null ? '' : (item.tax_type !== "No Need Tax Type" && item.tax_type !== null) && `${item.tax_type}-${item.tax_code}`}</th> */}
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                )
                                            })
                                        ) : item.tujuan_tf === 'PMA' ? (
                                            (item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi !== 'Ya' ? ( // tidak berpph dan tidak berppn
                                                jurnal2.map((x, iter) => {
                                                    return (
                                                        <tr>
                                                            <th>{index + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>PP01</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th></th>
                                                            <th>SA</th>
                                                            <th>{item.depo.area}</th>
                                                            <th>IDR</th>
                                                            <th>{iter + 1}</th>
                                                            <th>{iter === 0 ? item.depo.gl_kk : iter === 1 && dataPph.bankops}</th>
                                                            <th>{iter === 0 ? 40 : 50}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{item.nilai_buku}</th>
                                                            <th></th>
                                                            <th>{iter === 0 && item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{item.sub_coa}s</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 0 ? item.depo.profit_center : dataPph.pc_ho}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            {/* <th>{item.taxcode === null ? '' : (item.tax_type !== "No Need Tax Type" && item.tax_type !== null) && `${item.tax_type}-${item.tax_code}`}</th> */}
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    )
                                                })
                                            ) : (item.jenis_pph !== 'Non PPh' && item.jenis_pph !== null) && item.type_transaksi !== 'Ya' ? ( // berpph tidak berppn
                                                jurnal4.map((x, iter) => {
                                                    return (
                                                        <tr>
                                                            <th>{index + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>PP01</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th></th>
                                                            <th>SA</th>
                                                            <th>{item.depo.area}</th>
                                                            <th>IDR</th>
                                                            <th>{iter + 1}</th>
                                                            <th>{iter === 0 ? item.depo.gl_kk 
                                                                : iter === 1 ? dataPph.bankops
                                                                : iter === 2 ? item.veriftax.gl_jurnal
                                                                : iter === 3 && 
                                                                (item.jenis_pph === cek21 ? dataPph.pph21 :
                                                                item.jenis_pph === cek23 ? dataPph.pph23 :
                                                                item.jenis_pph === cek4a2 && dataPph.pph4a2)
                                                            }</th>
                                                            <th>{iter === 0 || iter === 2 ? 40 : 50}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 0 || iter === 1 ? item.nilai_buku : item.nilai_utang}</th>
                                                            <th></th>
                                                            <th>{iter === 2 && item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{item.sub_coa}s</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 1 ? dataPph.pc_ho : item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            {/* <th>{item.taxcode === null ? '' : (item.tax_type !== "No Need Tax Type" && item.tax_type !== null) && `${item.tax_type}-${item.tax_code}`}</th> */}
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    )
                                                })
                                            ) : (item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi === 'Ya' ? ( // berppn tidak berpph
                                                jurnal4.map((x, iter) => {
                                                    return (
                                                        <tr>
                                                            <th>{index + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>PP01</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th></th>
                                                            <th>SA</th>
                                                            <th>{item.depo.area}</th>
                                                            <th>IDR</th>
                                                            <th>{iter + 1}</th>
                                                            <th>{iter === 0 ? item.depo.gl_kk 
                                                                : iter === 1 ? dataPph.bankops
                                                                : iter === 2 ? dataPph.ppn
                                                                : iter === 3 && item.veriftax.gl_jurnal
                                                            }</th>
                                                            <th>{iter === 0 || iter === 2 ? 40 : 50}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 0 || iter === 1 ? item.nilai_buku : item.ppn}</th>
                                                            <th></th>
                                                            <th>{iter === 3 && item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{item.sub_coa}s</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 1 ? dataPph.pc_ho : item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            {/* <th>{item.taxcode === null ? '' : (item.tax_type !== "No Need Tax Type" && item.tax_type !== null) && `${item.tax_type}-${item.tax_code}`}</th> */}
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    )
                                                })
                                            ) : (item.jenis_pph !== 'Non PPh' && item.jenis_pph !== null) && item.type_transaksi === 'Ya' && ( // berpph dan berppn
                                                jurnal6.map((x, iter) => {
                                                    return (
                                                        <tr>
                                                            <th>{index + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>PP01</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th></th>
                                                            <th>SA</th>
                                                            <th>{item.depo.area}</th>
                                                            <th>IDR</th>
                                                            <th>{iter + 1}</th>
                                                            <th>{iter === 0 ? item.depo.gl_kk 
                                                                : iter === 1 ? dataPph.bankops
                                                                : iter === 2 ? dataPph.ppn
                                                                : iter === 3 ? item.veriftax.gl_jurnal
                                                                : iter === 4 ? item.veriftax.gl_jurnal
                                                                : iter === 5 && 
                                                                    (item.jenis_pph === cek21 ? dataPph.pph21 :
                                                                    item.jenis_pph === cek23 ? dataPph.pph23 :
                                                                    item.jenis_pph === cek4a2 && dataPph.pph4a2)
                                                            }</th>
                                                            <th>{iter === 0 || iter === 2 || iter === 4 ? 40 : 50}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 0 || iter === 1 ? item.nilai_buku 
                                                            : iter === 2 || iter === 3 ? item.ppn
                                                            : item.nilai_utang
                                                            }</th>
                                                            <th></th>
                                                            <th>{(iter === 3 || iter === 4) && item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{item.sub_coa}s</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 1 ? dataPph.pc_ho : item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            {/* <th>{item.taxcode === null ? '' : (item.tax_type !== "No Need Tax Type" && item.tax_type !== null) && `${item.tax_type}-${item.tax_code}`}</th> */}
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    )
                                                })
                                            )
                                        ) : item.tujuan_tf !== 'PMA' && (
                                            (item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi !== 'Ya' ? ( // tidak berpph dan tidak berppn
                                                jurnal2.map((x, iter) => {
                                                    return (
                                                        <tr>
                                                            <th>{index + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>PP01</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th></th>
                                                            <th>SA</th>
                                                            <th>{item.depo.area}</th>
                                                            <th>IDR</th>
                                                            <th>{iter + 1}</th>
                                                            <th>{iter === 0 ? item.veriftax.gl_jurnal : iter === 1 && dataPph.bankops}</th>
                                                            <th>{iter === 0 ? 40 : 50}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{item.nilai_buku}</th>
                                                            <th></th>
                                                            <th>{iter === 0 && item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{item.sub_coa}s</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 0 ? item.depo.profit_center : dataPph.pc_ho}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            {/* <th>{item.taxcode === null ? '' : (item.tax_type !== "No Need Tax Type" && item.tax_type !== null) && `${item.tax_type}-${item.tax_code}`}</th> */}
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    )
                                                })
                                            ) : (item.jenis_pph !== 'Non PPh' && item.jenis_pph !== null) && item.type_transaksi !== 'Ya' ? ( // berpph tidak berppn
                                                jurnal3.map((x, iter) => {
                                                    return (
                                                        <tr>
                                                            <th>{index + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>PP01</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th></th>
                                                            <th>SA</th>
                                                            <th>{item.depo.area}</th>
                                                            <th>IDR</th>
                                                            <th>{iter + 1}</th>
                                                            <th>{iter === 0 ? item.veriftax.gl_jurnal 
                                                                : iter === 1 ? 
                                                                (item.jenis_pph === cek21 ? dataPph.pph21 :
                                                                item.jenis_pph === cek23 ? dataPph.pph23 :
                                                                item.jenis_pph === cek4a2 && dataPph.pph4a2)
                                                                : iter === 2 && dataPph.bankops
                                                            }</th>
                                                            <th>{iter === 0 ? 40 : 50}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 0 ? item.nilai_buku : iter === 1 ? item.nilai_utang : item.nilai_bayar}</th>
                                                            <th></th>
                                                            <th>{iter === 0 && item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{item.sub_coa}s</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 2 ? dataPph.pc_ho : item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            {/* <th>{item.taxcode === null ? '' : (item.tax_type !== "No Need Tax Type" && item.tax_type !== null) && `${item.tax_type}-${item.tax_code}`}</th> */}
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    )
                                                })
                                            ) : (item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi === 'Ya' ? ( // berppn tidak berpph
                                                jurnal3.map((x, iter) => {
                                                    return (
                                                        <tr>
                                                            <th>{index + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>PP01</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th></th>
                                                            <th>SA</th>
                                                            <th>{item.depo.area}</th>
                                                            <th>IDR</th>
                                                            <th>{iter + 1}</th>
                                                            <th>{iter === 0 ? item.veriftax.gl_jurnal
                                                                : iter === 1 ? dataPph.ppn
                                                                : iter === 2 && dataPph.bankops
                                                            }</th>
                                                            <th>{iter === 0 || iter === 1 ? 40 : 50}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 0 ? item.nilai_bayar : iter === 1 ? item.ppn : item.nilai_buku}</th>
                                                            <th></th>
                                                            <th>{iter === 0 && item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{item.sub_coa}s</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 2 ? dataPph.pc_ho : item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            {/* <th>{item.taxcode === null ? '' : (item.tax_type !== "No Need Tax Type" && item.tax_type !== null) && `${item.tax_type}-${item.tax_code}`}</th> */}
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    )
                                                })
                                            ) : (item.jenis_pph !== 'Non PPh' && item.jenis_pph !== null) && item.type_transaksi === 'Ya' && ( // berpph dan berppn
                                                jurnal4.map((x, iter) => {
                                                    return (
                                                        <tr>
                                                            <th>{index + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>PP01</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th>{moment(item.tanggal_transfer).format('DDMMYYYY')}</th>
                                                            <th></th>
                                                            <th>SA</th>
                                                            <th>{item.depo.area}</th>
                                                            <th>IDR</th>
                                                            <th>{iter + 1}</th>
                                                            <th>{iter === 0 ? item.veriftax.gl_jurnal 
                                                                : iter === 1 ? dataPph.ppn
                                                                : iter === 2 ? 
                                                                (item.jenis_pph === cek21 ? dataPph.pph21 :
                                                                    item.jenis_pph === cek23 ? dataPph.pph23 :
                                                                    item.jenis_pph === cek4a2 && dataPph.pph4a2)
                                                                : iter === 3 && dataPph.bankops
                                                            }</th>
                                                            <th>{iter === 0 || iter === 1 ? 40 
                                                            : (iter === 2 || iter === 3) && 50
                                                            }</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>
                                                                {iter === 0 ? item.nilai_bayar 
                                                                    : iter === 1 ? item.ppn 
                                                                    : iter === 2 ? item.nilai_utang 
                                                                    : iter === 3 && item.nilai_buku 
                                                                }
                                                            </th>
                                                            <th></th>
                                                            <th>{(iter === 0 || iter === 3) && item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{item.sub_coa}s</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th>{iter === 3 ? dataPph.pc_ho : item.depo.profit_center}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            {/* <th>{item.taxcode === null ? '' : (item.tax_type !== "No Need Tax Type" && item.tax_type !== null) && `${item.tax_type}-${item.tax_code}`}</th> */}
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    )
                                                })
                                            )
                                        )
                                        )
                                    })}
                            </tbody>
                        </Table>
                    </div>
                </ModalBody>
                <hr />
                <div className="modalFoot ml-3">
                    <div></div>
                    <div className="btnFoot">
                        <Button className="mr-2" color='warning' onClick={this.downloadJurnal} >Download</Button>
                        <Button color="success" onClick={this.openJurnal}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={this.state.formDis} toggle={() => {this.openModalDis(); this.showCollap('close')}} size="xl">
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={detailOps.find(({status_transaksi}) => status_transaksi === 26) === undefined ? false : true}>
                        <div>Data Penjualan Asset Sedang Dilengkapi oleh divisi purchasing</div>
                    </Alert> */}
                    <ModalBody>
                        <Row className='trackTitle ml-4'>
                            <Col>
                                Tracking Pengajuan Ops
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub'>
                            <Col md={3}>
                                Area
                            </Col>
                            <Col md={9}>
                            : {detailOps[0] === undefined ? '' : detailOps[0].area}
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub'>
                            <Col md={3}>
                            No Ajuan
                            </Col>
                            <Col md={9}>
                            : {detailOps[0] === undefined ? '' : detailOps[0].no_transaksi}
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub1'>
                            <Col md={3}>
                            Tanggal Ajuan
                            </Col>
                            <Col md={9}>
                            : {detailOps[0] === undefined ? '' : moment(detailOps[0].start_ops === null ? detailOps[0].createdAt : detailOps[0].start_ops).locale('idn').format('DD MMMM YYYY ')}
                            </Col>
                        </Row>
                        <Row className='mt-2 ml-4 m40'>
                            <Col md={12}>
                                <Button onClick={this.openHistory} size='sm' color='success'>History lengkap</Button>
                            </Col>
                        </Row>
                        <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                            <div class="step completed">
                                <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Submit')} ><FiSend size={40} className="center1" /></button>
                                </div>
                                <h4 class="step-title">Submit Ops</h4>
                            </div>
                            <div class={detailOps[0] === undefined ? 'step' : detailOps[0].status_transaksi > 2 ? "step completed" : 'step'} >
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Proses Approval')}><MdAssignment size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Proses Approval</h4>
                            </div>
                            <div class={detailOps[0] === undefined ? 'step' : detailOps[0].status_transaksi > 3 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Verifikasi Finance')}><FiSettings size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Verifikasi Finance</h4>
                            </div>
                            <div class={detailOps[0] === undefined ? 'step' : detailOps[0].status_transaksi > 4 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Verifikasi Ops')}><FiSettings size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Verifikasi Ops</h4>
                            </div>
                            <div class={detailOps[0] === undefined ? 'step' : detailOps[0].status_transaksi === 5 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon"><AiOutlineCheck size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Selesai</h4>
                            </div>
                        </div>
                        <Collapse isOpen={this.state.collap} className="collapBody">
                            <Card className="cardCollap">
                                <CardBody>
                                    <div className='textCard1'>{this.state.tipeCol}</div>
                                    {this.state.tipeCol === 'submit' ? (
                                        <div>Tanggal submit : {detailOps[0] === undefined ? '' : moment(detailOps[0].start_ops === null ? detailOps[0].createdAt : detailOps[0].start_ops).locale('idn').format('DD MMMM YYYY ')}</div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div>Rincian Data:</div>
                                    <Table striped bordered responsive hover className="tableDis mb-3">
                                        <thead>
                                            <tr>
                                                <th>NO</th>
                                                <th>COST CENTRE</th>
                                                <th>NO COA</th>
                                                <th>NAMA COA</th>
                                                <th>KETERANGAN TAMBAHAN</th>
                                                <th>PERIODE</th>
                                                <th>NILAI YANG DIAJUKAN</th>
                                                <th>BANK</th>
                                                <th>NOMOR REKENING</th>
                                                <th>ATAS NAMA</th>
                                                <th>MEMILIKI NPWP</th>
                                                <th>NAMA SESUAI NPWP</th>
                                                <th>NOMOR NPWP</th>
                                                <th>PPU</th>
                                                <th>PA</th>
                                                <th>NOMINAL</th>
                                                <th>NILAI YANG DIBAYARKAN</th>
                                                <th>TANGGAL TRANSFER</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detailOps.length !== 0 && detailOps.map(item => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{detailOps.indexOf(item) + 1}</th>
                                                        <th>{item.cost_center}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{item.keterangan}</th>
                                                        <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                        <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                        <th>{item.bank_tujuan}</th>
                                                        <th>{item.norek_ajuan}</th>
                                                        <th>{item.nama_tujuan}</th>
                                                        <th>{item.status_npwp === 0 ? '' : 'Ya'}</th>
                                                        <th>{item.status_npwp === 0 ? '' : item.nama_npwp}</th>
                                                        <th>{item.status_npwp === 0 ? '' : item.no_npwp}</th>
                                                        <th>{item.ppu}</th>
                                                        <th>{item.pa}</th>
                                                        <th>{item.nilai_bayar}</th>
                                                        <th>{item.nilai_bayar}</th>
                                                        <th>{item.tanggal_transfer}</th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {detailOps[0] === undefined || this.state.tipeCol === 'Submit' ? (
                                        <div></div>
                                    ) : (
                                        <div>
                                            <div className="mb-4 mt-2">Tracking {this.state.tipeCol} :</div>
                                            {this.state.tipeCol === 'Proses Approval' ? (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    {detailOps[0] !== undefined && detailOps[0].appForm.length && detailOps[0].appForm.slice(0).reverse().map(item => {
                                                        return (
                                                            <div class={item.status === '1' ? 'step completed' : item.status === '0' ? 'step reject' : 'step'}>
                                                                <div class="step-icon-wrap">
                                                                <button class="step-icon"><FaFileSignature size={30} className="center2" /></button>
                                                                </div>
                                                                <h4 class="step-title">{item.jabatan}</h4>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : this.state.tipeCol === 'Verifikasi Finance' ? (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    <div class={detailOps[0] === undefined ? 'step' : detailOps[0].status_transaksi > 3 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Check Dokumen</h4>
                                                    </div>
                                                    <div class={detailOps[0] === undefined ? 'step' : detailOps[0].status_transaksi > 3 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Selesai</h4>
                                                    </div>
                                                </div>
                                            ) : this.state.tipeCol === 'Verifikasi Ops' && (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    <div class={detailOps[0] === undefined ? 'step' : detailOps[0].status_transaksi > 4 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FiSettings size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Proses Kelengkapan Data</h4>
                                                    </div>
                                                    <div class={detailOps[0] === undefined ? 'step' : detailOps[0].status_transaksi > 4 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Check Dokumen</h4>
                                                    </div>
                                                    <div class={detailOps[0] === undefined ? 'step' : detailOps[0].status_transaksi > 4 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Selesai</h4>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Collapse>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        {/* <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailOps[0] !== undefined && detailOps[0].no_disposal})}>Preview</Button> */}
                        <div></div>
                        <div className="btnFoot">
                            <Button color="primary" onClick={() => {this.openModalDis(); this.showCollap('close')}}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.history} toggle={this.openHistory}>
                    <ModalBody>
                        <div className='mb-4'>History Transaksi</div>
                        <div className='history'>
                            {detailOps.length > 0 && detailOps[0].history.split(',').map(item => {
                                return (
                                    item !== null && item !== 'null' && 
                                    <Button className='mb-2' color='info'>{item}</Button>
                                )
                            })}
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    approve: state.approve,
    depo: state.depo,
    user: state.user,
    notif: state.notif,
    ops: state.ops,
    menu: state.menu,
    reason: state.reason,
    dokumen: state.dokumen
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNameApprove: approve.getNameApprove,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    getRole: user.getRole,
    getReport: ops.getReport,
    getDetail: ops.getDetail,
    getApproval: ops.getApproval,
    getDocOps: ops.getDocCart,
    approveOps: ops.approveOps,
    getAllMenu: menu.getAllMenu,
    getReason: reason.getReason,
    rejectOps: ops.rejectOps,
    resetOps: ops.resetOps,
    showDokumen: dokumen.showDokumen
    // notifStock: notif.notifStock
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportOps)
