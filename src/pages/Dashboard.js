/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {VscAccount} from 'react-icons/vsc'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    Card, CardBody, Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import approve from '../redux/actions/approve'
import {BsCircle} from 'react-icons/bs'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList, FaFileSignature} from 'react-icons/fa'
import {MdAssignment} from 'react-icons/md'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
import Sidebar from "../components/Header";
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import MaterialTitlePanel from "../components/material_title_panel"
import SidebarContent from "../components/sidebar_content"
import style from '../assets/css/input.module.css'
import placeholder from  "../assets/img/placeholder.png"
import user from '../redux/actions/user'
import {connect} from 'react-redux'
import moment from 'moment'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../redux/actions/auth'
import menu from '../redux/actions/menu'
import reason from '../redux/actions/reason'
// import notif from '../redux/actions/notif'
import Pdf from "../components/Pdf"
import depo from '../redux/actions/depo'
import dokumen from '../redux/actions/dokumen'
import {default as axios} from 'axios'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import TblHead from '../components/TblHead'
import NavBar from '../components/NavBar'
import klaim from '../redux/actions/klaim'
import ops from '../redux/actions/ops'
import ikk from '../redux/actions/ikk'
import FAA from '../components/Klaim/FAA'
import FPD from '../components/Klaim/FPD'
import FAAOps from '../components/Ops/FAA'
import FPDOps from '../components/Ops/FPD'
import Formikk from '../components/Ikk/formikk'
import FPDIkk from '../components/Ikk/FPD'
import Tracking from '../components/Klaim/tracking'
import TrackingIkk from '../components/Ikk/tracking'
import TrackingOps from '../components/Ops/tracking'
const {REACT_APP_BACKEND_URL} = process.env

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


class Klaim extends Component {
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
            listMut: [],
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
            filter: 'available',
            newKlaim: [],
            totalfpd: 0,
            dataMenu: [],
            listMenu: [],
            collap: false,
            tipeCol: '',
            formDis: false,
            history: false,
            filterIkk: 'available',
            newIkk: [],
            filterOps: 'available',
            newOps: [],
            filterKasbon: 'available',
            newKasbon: [],
            typeTrans: '',
            statKlaim: 'all',
            statOps: 'all',
            statIkk: 'all',
            timeKlaim: 'pilih',
            time1Klaim: moment().startOf('month').format('YYYY-MM-DD'),
            time2Klaim: moment().endOf('month').format('YYYY-MM-DD'),
            timeOps: 'pilih',
            time1Ops: moment().startOf('month').format('YYYY-MM-DD'),
            time2Ops: moment().endOf('month').format('YYYY-MM-DD'),
            timeKasbon: 'pilih',
            time1Kasbon: moment().startOf('month').format('YYYY-MM-DD'),
            time2Kasbon: moment().endOf('month').format('YYYY-MM-DD'),
            timeIkk: 'pilih',
            time1Ikk: moment().startOf('month').format('YYYY-MM-DD'),
            time2Ikk: moment().endOf('month').format('YYYY-MM-DD'),

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

    rejectKlaim = async (val) => {
        const {listMut, listReason, listMenu} = this.state
        const { detailKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        const tempno = {
            no: detailKlaim[0].no_transaksi
        }
        let temp = ''
        for (let i = 0; i < listReason.length; i++) {
            temp += listReason[i] + '. '
        }
        const data = {
            no: detailKlaim[0].no_transaksi,
            list: listMut,
            alasan: temp + val.alasan,
            menu: listMenu.toString()
        }
        await this.props.rejectKlaim(token, data)
        this.getDataKlaim()
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
        const {detailKlaim} = this.props.klaim
        const {detailOps} = this.props.ops
        const {detailIkk} = this.props.ikk
        const {typeTrans} = this.state
        const cek = typeTrans === 'klaim' ? detailKlaim : typeTrans === 'ops' || typeTrans === 'kasbon' ? detailOps : detailIkk
        let total = 0
        for (let i = 0; i < cek.length; i++) {
            total += parseInt(cek[i].nilai_ajuan)
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

    goProses = (val) => {
        this.props.history.push({
            pathname: `/${val.route}`,
            state: val
        })
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
        this.getDataKlaim()
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
        this.getDataKlaim()
        this.getDataIkk()
        this.getDataOps()
        this.getDataKasbon()
    }

    componentDidUpdate() {
        const { isApprove, isReject } = this.props.klaim
        if (isApprove === false) {
            this.setState({confirm: 'rejApprove'})
            this.openConfirm()
            this.openModalApprove()
            this.openModalRinci()
            this.props.resetKlaim()
        } else if (isReject === false) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
            this.openModalReject()
            this.openModalRinci()
            this.props.resetKlaim()
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

    getDataKlaim = async (value) => {
        const level = localStorage.getItem('level')
        this.setState({limit: value === undefined ? 10 : value.limit})
        this.changeFilterKlaim(level === '5' ? 'all' : 'available')
    }

    changeFilterKlaim = async (val) => {
        const {time1Klaim, time2Klaim, statKlaim} = this.state
        const cekTime1 = time1Klaim === '' ? 'undefined' : time1Klaim
        const cekTime2 = time2Klaim === '' ? 'undefined' : time2Klaim
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = statKlaim
        const tipe = status === '3' || status === '4' ? 'verif' : status === '6' ? 'ajuan bayar' : 'approve'
        const newKlaim = []
        await this.props.getKlaim(token, status, 'all', 'all', val, tipe, 'undefined', cekTime1, cekTime2)
        this.setState({filter: val, newKlaim: newKlaim})
    }

    changeStatKlaim = async (val) => {
        const {time1Klaim, time2Klaim, filter} = this.state
        const cekTime1 = time1Klaim === '' ? 'undefined' : time1Klaim
        const cekTime2 = time2Klaim === '' ? 'undefined' : time2Klaim
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const tipe = val === '3' || val === '4' ? 'verif' : val === '6' ? 'ajuan bayar' : 'approve'
        const status = val
        await this.props.getKlaim(token, status, 'all', 'all', filter, tipe, 'undefined', cekTime1, cekTime2)
        this.setState({statKlaim: val})
    }

    getDataIkk = async (value) => {
        const level = localStorage.getItem('level')
        this.setState({limit: value === undefined ? 10 : value.limit})
        this.changeFilterIkk(level === '5' ? 'all' : 'available')
    }

    changeFilterIkk = async (val) => {
        const {statIkk, time1Ikk, time2Ikk} = this.state
        const cekTime1 = time1Ikk === '' ? 'undefined' : time1Ikk
        const cekTime2 = time2Ikk === '' ? 'undefined' : time2Ikk
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = statIkk
        const tipe = status === '3' || status === '4' ? 'verif' : status === '6' ? 'ajuan bayar' : 'approve'
        const newIkk = []
        await this.props.getIkk(token, status, 'all', 'all', val, tipe, 'undefined', cekTime1, cekTime2)
        this.setState({filterIkk: val, newIkk: newIkk})
    }

    changeStatIkk = async (val) => {
        const {filterIkk, time1Ikk, time2Ikk} = this.state
        const cekTime1 = time1Ikk === '' ? 'undefined' : time1Ikk
        const cekTime2 = time2Ikk === '' ? 'undefined' : time2Ikk
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const tipe = val === '3' || val === '4' ? 'verif' : val === '6' ? 'ajuan bayar' : 'approve'
        const status = val
        console.log(typeof status)
        console.log(tipe, filterIkk, status)
        await this.props.getIkk(token, status, 'all', 'all', filterIkk, tipe, 'undefined', cekTime1, cekTime2)
        this.setState({statIkk: val})
    }

    getDataOps = async (value) => {
        const level = localStorage.getItem('level')
        this.setState({limit: value === undefined ? 10 : value.limit})
        this.changeFilterOps(level === '5' ? 'all' : 'available')
    }

    changeFilterOps = async (val) => {
        const {statOps, time1Ops, time2Ops} = this.state
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const cekTime1 = time1Ops === '' ? 'undefined' : time1Ops
        const cekTime2 = time2Ops === '' ? 'undefined' : time2Ops
        const status = statOps
        const tipe = status === '3' || status === '4' ? 'verif' : status === '6' ? 'ajuan bayar' : 'approve'
        const newOps = []
        await this.props.getOps(token, status, 'all', 'all', val, tipe, 'undefined', cekTime1, cekTime2, 'non kasbon')
        this.setState({filterOps: val, newOps: newOps})
    }

    changeStatOps = async (val) => {
        const {filterOps, time1Ops, time2Ops} = this.state
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const cekTime1 = time1Ops === '' ? 'undefined' : time1Ops
        const cekTime2 = time2Ops === '' ? 'undefined' : time2Ops
        const tipe = val === '3' || val === '4' ? 'verif' : val === '6' ? 'ajuan bayar' : 'approve'
        const status = val
        await this.props.getOps(token, status, 'all', 'all', filterOps, tipe, 'undefined', cekTime1, cekTime2, 'non kasbon')
        this.setState({statOps: val})
    }

    getDataKasbon = async (value) => {
        const level = localStorage.getItem('level')
        this.setState({limit: value === undefined ? 10 : value.limit})
        this.changeFilterKasbon(level === '5' ? 'all' : 'available')
    }

    changeFilterKasbon = async (val) => {
        const {statKasbon, time1Kasbon, time2Kasbon} = this.state
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const cekTime1 = time1Kasbon === '' ? 'undefined' : time1Kasbon
        const cekTime2 = time2Kasbon === '' ? 'undefined' : time2Kasbon
        const status = statKasbon
        const tipe = status === '3' || status === '4' ? 'verif' : status === '6' ? 'ajuan bayar' : 'approve'
        const newKasbon = []
        await this.props.getKasbon(token, status, 'all', 'all', val, tipe, 'undefined', cekTime1, cekTime2, 'non kasbon')
        this.setState({filterKasbon: val, newKasbon: newKasbon})
    }

    changeStatKasbon = async (val) => {
        const {filterKasbon, time1Kasbon, time2Kasbon} = this.state
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const cekTime1 = time1Kasbon === '' ? 'undefined' : time1Kasbon
        const cekTime2 = time2Kasbon === '' ? 'undefined' : time2Kasbon
        const tipe = val === '3' || val === '4' ? 'verif' : val === '6' ? 'ajuan bayar' : 'approve'
        const status = val
        await this.props.getKasbon(token, status, 'all', 'all', filterKasbon, tipe, 'undefined', cekTime1, cekTime2, 'non kasbon')
        this.setState({statKasbon: val})
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
            no: val.item.no_transaksi
        }
        this.setState({listMut: [], typeTrans: val.type})
        if (val.type === 'klaim') {
            await this.props.getDetail(token, tempno)
            await this.props.getApproval(token, tempno)
            this.openModalRinci()
        } else if (val.type === 'ops') {
            await this.props.getDetailOps(token, tempno)
            await this.props.getApprovalOps(token, tempno)
            this.openModalRinci()
        } else if (val.type === 'kasbon') {
            await this.props.getDetailOps(token, tempno)
            await this.props.getApprovalOps(token, tempno)
            this.openModalRinci()
        } else {
            await this.props.getDetailIkk(token, tempno)
            await this.props.getApprovalIkk(token, tempno)
            this.openModalRinci()
        }
    }

    openModalDok = () => {
        this.setState({opendok: !this.state.opendok})
    }

    prosesTracking = async () => {
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

    prosesSubmitPre = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAssetAll(token, 1000, '', 1, 'asset')
        this.modalSubmitPre()
    }

    approveDataKlaim = async () => {
        const { detailKlaim } = this.props.klaim
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailKlaim[0].no_transaksi
        }
        await this.props.approveKlaim(token, tempno)
        this.getDataKlaim()
        this.setState({confirm: 'isApprove'})
        this.openConfirm()
        this.openModalApprove()
        this.openModalRinci()
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem("token")
        if(e.key === 'Enter'){
            await this.props.getAssetAll(token, 10, e.target.value, 1)
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
            this.getDataKlaim()
        }
    }

    getAppKlaim = async (val) => {
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
        const {typeTrans} = this.state
        const nameDoc = typeTrans === 'klaim' ? 'Draft Pengajuan Klaim' : typeTrans === 'ops' || typeTrans === 'kasbon' ? 'Draft Pengajuan Ops' : 'Draft Pengajuan Ikk'
        const tempno = {
            no: val.no_transaksi,
            name: nameDoc
        }
        if (typeTrans === 'klaim') {
            await this.props.getDocKlaim(token, tempno)
            this.openModalDoc()
        } else if (typeTrans === 'ops') {
            await this.props.getDocOps(token, tempno)
            this.openModalDoc()
        } else if (typeTrans === 'kasbon') {
            await this.props.getDocOps(token, tempno)
            this.openModalDoc()
        } else {
            await this.props.getDocIkk(token, tempno)
            this.openModalDoc()
        }
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
        const { listMut } = this.state
        const {detailKlaim} = this.props.klaim
        if (val === 'all') {
            const data = []
            for (let i = 0; i < detailKlaim.length; i++) {
                data.push(detailKlaim[i].id)
            }
            this.setState({listMut: data})
        } else {
            listMut.push(val)
            this.setState({listMut: listMut})
        }
    }

    chekRej = (val) => {
        const {listMut} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listMut: data})
        } else {
            const data = []
            for (let i = 0; i < listMut.length; i++) {
                if (listMut[i] === val) {
                    data.push()
                } else {
                    data.push(listMut[i])
                }
            }
            this.setState({listMut: data})
        }
    }

    prepareReject = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAllMenu(token, 'reject')
        await this.props.getReason(token)
        const dataMenu = this.props.menu.dataAll
        const data = []
        dataMenu.map(item => {
            return (item.kode_menu === 'Klaim' && data.push(item))
        })
        this.setState({dataMenu: dataMenu})
        this.openModalReject()
    }

    goRoute = (route) => {
        this.props.history.push(`/${route}`)
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

    changeTimeKlaim = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({timeKlaim: val})
        if (val === 'all') {
            this.setState({time1Klaim: '', time2Klaim: ''})
            setTimeout(() => {
                this.getDataTimeKlaim()
             }, 500)
        }
    }

    selectTimeKlaim = (val) => {
        this.setState({[val.type]: val.val})
    }

    getDataTimeKlaim = async () => {
        const {time1Klaim, time2Klaim, filter, statKlaim} = this.state
        const cekTime1 = time1Klaim === '' ? 'undefined' : time1Klaim
        const cekTime2 = time2Klaim === '' ? 'undefined' : time2Klaim
        const token = localStorage.getItem("token")
        const statNow = statKlaim
        const tipe = statNow === '3' || statNow === '4' ? 'verif' : statNow === '6' ? 'ajuan bayar' : 'approve'
        const status = statKlaim
        await this.props.getKlaim(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, tipe, 'undefined', cekTime1, cekTime2)
    }

    changeTimeOps = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({timeOps: val})
        if (val === 'all') {
            this.setState({time1Ops: '', time2Ops: ''})
            setTimeout(() => {
                this.getDataTimeOps()
             }, 500)
        }
    }

    selectTimeOps = (val) => {
        this.setState({[val.type]: val.val})
    }

    getDataTimeOps = async () => {
        const {time1Ops, time2Ops, filterOps, statOps} = this.state
        const cekTime1 = time1Ops === '' ? 'undefined' : time1Ops
        const cekTime2 = time2Ops === '' ? 'undefined' : time2Ops
        const statNow = statOps
        const tipe = statNow === '3' || statNow === '4' ? 'verif' : statNow === '6' ? 'ajuan bayar' : 'approve'
        const token = localStorage.getItem("token")
        const status = statOps
        await this.props.getOps(token, filterOps === 'all' ? 'all' : status, 'all', 'all', filterOps, tipe, 'undefined', cekTime1, cekTime2, 'non kasbon')
    }

    changeTimeKasbon = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({timeKasbon: val})
        if (val === 'all') {
            this.setState({time1Kasbon: '', time2Ops: ''})
            setTimeout(() => {
                this.getDataTimeKasbon()
             }, 500)
        }
    }

    selectTimeKasbon = (val) => {
        this.setState({[val.type]: val.val})
    }

    getDataTimeKasbon = async () => {
        const {time1Kasbon, time2Kasbon, filterKasbon, statKasbon} = this.state
        const cekTime1 = time1Kasbon === '' ? 'undefined' : time1Kasbon
        const cekTime2 = time2Kasbon === '' ? 'undefined' : time2Kasbon
        const statNow = statKasbon
        const tipe = statNow === '3' || statNow === '4' ? 'verif' : statNow === '6' ? 'ajuan bayar' : 'approve'
        const token = localStorage.getItem("token")
        const status = statKasbon
        await this.props.getKasbon(token, filterKasbon === 'all' ? 'all' : status, 'all', 'all', filterKasbon, tipe, 'undefined', cekTime1, cekTime2, 'non kasbon')
    }

    changeTimeIkk = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({timeIkk: val})
        if (val === 'all') {
            this.setState({time1Ikk: '', time2Ikk: ''})
            setTimeout(() => {
                this.getDataTimeIkk()
             }, 500)
        }
    }

    selectTimeIkk = (val) => {
        this.setState({[val.type]: val.val})
    }

    getDataTimeIkk = async () => {
        const {time1Ikk, time2Ikk, filterIkk, statIkk} = this.state
        const cekTime1 = time1Ikk === '' ? 'undefined' : time1Ikk
        const cekTime2 = time2Ikk === '' ? 'undefined' : time2Ikk
        const token = localStorage.getItem("token")
        const statNow = statIkk
        const tipe = statNow === '3' || statNow === '4' ? 'verif' : statNow === '6' ? 'ajuan bayar' : 'approve'
        const status = statIkk
        await this.props.getIkk(token, filterIkk === 'all' ? 'all' : status, 'all', 'all', filterIkk, tipe, 'undefined', cekTime1, cekTime2)
    }


    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {typeTrans} = this.state
        const { dataReason } = this.props.reason
        const { detailKlaim, dataDoc, newKlaim, isLoading } = this.props.klaim
        const { detailIkk, newIkk } = this.props.ikk
        const loadingIkk = this.props.ikk.isLoading
        const { detailOps, newOps, newKasbon } = this.props.ops
        const loadingOps = this.props.ops.isLoading
        const loadingKasbon = this.props.ops.isLoadingKasbon
        const docAjuan = typeTrans === 'klaim' ? dataDoc : typeTrans === 'ops' || typeTrans === 'kasbon' ? this.props.ops.dataDoc : this.props.ikk.dataDoc
        const dataAjuan = typeTrans === 'klaim' ? detailKlaim : typeTrans === 'ops' || typeTrans === 'kasbon' ? detailOps : detailIkk
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
                                <div className={style.titleDashboard}>Dashboard</div>
                            </div>
                            <div className='boxDash'>
                                <div className='subtitle'>Klaim</div>
                                <div className={style.secEmail3}>
                                    <Button color='primary' onClick={() => this.goRoute('klaim')}>More Data</Button>
                                    <div className={style.searchEmail2}>
                                        <text>Filter:  </text>
                                        <Input className={style.filter} type="select" value={this.state.filter} onChange={e => this.changeFilterKlaim(e.target.value)}>
                                            <option value="all">All</option>
                                            <option value="reject">Reject</option>
                                            <option value="available">Available Approve</option>
                                        </Input>
                                    </div>
                                </div>
                                <div className={[style.secEmail4]}>
                                    <div className='rowCenter'>
                                        <div className='rowCenter'>
                                            {/* <text className='mr-4'>Time:</text> */}
                                            <Input className={style.filter3} type="select" value={this.state.timeKlaim} onChange={e => this.changeTimeKlaim(e.target.value)}>
                                                <option value="all">Time (All)</option>
                                                <option value="pilih">Periode</option>
                                            </Input>
                                        </div>
                                        {this.state.timeKlaim === 'pilih' ?  (
                                            <>
                                                <div className='rowCenter'>
                                                    <text className='bold'>:</text>
                                                    <Input
                                                        type= "date" 
                                                        className="inputRinci"
                                                        value={this.state.time1Klaim}
                                                        onChange={e => this.selectTimeKlaim({val: e.target.value, type: 'time1Klaim'})}
                                                    />
                                                    <text className='mr-1 ml-1'>To</text>
                                                    <Input
                                                        type= "date" 
                                                        className="inputRinci"
                                                        value={this.state.time2Klaim}
                                                        onChange={e => this.selectTimeKlaim({val: e.target.value, type: 'time2Klaim'})}
                                                    />
                                                    <Button
                                                    disabled={this.state.time1Klaim === '' || this.state.time2Klaim === '' ? true : false} 
                                                    color='primary' 
                                                    onClick={this.getDataTimeKlaim} 
                                                    className='ml-1'>
                                                        Go
                                                    </Button>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className={style.searchEmail2}>
                                        <text>Status:  </text>
                                        <Input className={style.filter} type="select" value={this.state.statKlaim} onChange={e => this.changeStatKlaim(e.target.value)}>
                                            <option value='all'>All</option>
                                            <option value={2} >Pengajuan Area</option>
                                            <option value={6} >List Ajuan Bayar</option>
                                            <option value={3} >Verifikasi Finance</option>
                                            <option value={4} >Verifikasi Klaim</option>
                                        </Input>
                                    </div>
                                </div>
                                <div className={style.tableDashboard}>
                                    <TblHead tagBody={
                                        <tbody>
                                            {newKlaim.map(item => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>{newKlaim.indexOf(item) + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.cost_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{item.keterangan}</th>
                                                        <th>{moment(item.start_klaim).format('DD MMMM YYYY')}</th>
                                                        <th>{item.history !== null && item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            {this.state.filter === "available" && (
                                                                <Button size='sm' onClick={() => this.goProses({route: 'klaim', type: 'approve', item: item})}  className='mb-1 mr-1' color='success'>Proses</Button>
                                                            )}
                                                            <Button size='sm' className='mb-1' onClick={() => this.prosesDetail({type: 'klaim', item: item})} color='warning'>Rincian</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                    </tbody>
                                    } />
                                    {isLoading && (
                                        <div className={style.spin}>
                                            <Spinner type="grow" color="primary"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                            <Spinner type="grow" color="warning"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                            <Spinner type="grow" color="info"/>
                                        </div>
                                    )}
                                    {(newKlaim.length === 0 || (this.state.filter === 'completed' && newKlaim.find(({end_klaim}) => end_klaim !== null) === undefined) || (this.state.filter === 'bayar' && newKlaim.find(({end_klaim}) => end_klaim === null) === undefined)) && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='boxDash'>
                                <div className='subtitle'>Operasional</div>
                                <div className={style.secEmail3}>
                                    <Button color='primary' onClick={() => this.goRoute('ops')}>More Data</Button>
                                    <div className={style.searchEmail2}>
                                        <text>Filter:  </text>
                                        <Input className={style.filter} type="select" value={this.state.filterOps} onChange={e => this.changeFilterOps(e.target.value)}>
                                            <option value="all">All</option>
                                            <option value="reject">Reject</option>
                                            <option value="available">Available Approve</option>
                                            {/* <option value="revisi">Available Reapprove (Revisi)</option> */}
                                        </Input>
                                    </div>
                                </div>
                                <div className={[style.secEmail4]}>
                                    <div className='rowCenter'>
                                        <div className='rowCenter'>
                                            {/* <text className='mr-4'>Time:</text> */}
                                            <Input className={style.filter3} type="select" value={this.state.timeOps} onChange={e => this.changeTimeOps(e.target.value)}>
                                                <option value="all">Time (All)</option>
                                                <option value="pilih">Periode</option>
                                            </Input>
                                        </div>
                                        {this.state.timeOps === 'pilih' ?  (
                                            <>
                                                <div className='rowCenter'>
                                                    <text className='bold'>:</text>
                                                    <Input
                                                        type= "date" 
                                                        className="inputRinci"
                                                        value={this.state.time1Ops}
                                                        onChange={e => this.selectTimeOps({val: e.target.value, type: 'time1Ops'})}
                                                    />
                                                    <text className='mr-1 ml-1'>To</text>
                                                    <Input
                                                        type= "date" 
                                                        className="inputRinci"
                                                        value={this.state.time2Ops}
                                                        onChange={e => this.selectTimeOps({val: e.target.value, type: 'time2Ops'})}
                                                    />
                                                    <Button
                                                    disabled={this.state.time1Ops === '' || this.state.time2Ops === '' ? true : false} 
                                                    color='primary' 
                                                    onClick={this.getDataTimeOps} 
                                                    className='ml-1'>
                                                        Go
                                                    </Button>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className={style.searchEmail2}>
                                        <text>Status:  </text>
                                        <Input className={style.filter} type="select" value={this.state.statOps} onChange={e => this.changeStatOps(e.target.value)}>
                                        <option value='all'>All</option>
                                            <option value={2} >Pengajuan Area</option>
                                            <option value={6} >List Ajuan Bayar</option>
                                            <option value={3} >Verifikasi Finance</option>
                                            <option value={4} >Verifikasi Tax</option>
                                        </Input>
                                    </div>
                                </div>
                                <div className={style.tableDashboard}>
                                    <TblHead tagBody={
                                        <tbody>
                                            {newOps.map(item => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>{newOps.indexOf(item) + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.cost_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{item.keterangan}</th>
                                                        <th>{moment(item.start_ops).format('DD MMMM YYYY')}</th>
                                                        <th>{item.history !== null && item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            {this.state.filterOps === "available" && (
                                                                <Button size='sm' onClick={() => this.goProses({route: 'ops', type: 'approve', item: item})}  className='mb-1 mr-1' color='success'>Proses</Button>
                                                            )}
                                                            <Button size='sm' className='mb-1' onClick={() => this.prosesDetail({type: 'ops', item: item})} color='warning'>Rincian</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    } />
                                    {loadingOps && (
                                        <div className={style.spin}>
                                            <Spinner type="grow" color="primary"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                            <Spinner type="grow" color="warning"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                            <Spinner type="grow" color="info"/>
                                        </div>
                                    )}
                                    {(newOps.length === 0 || (this.state.filterOps === 'completed' && newOps.find(({end_ops}) => end_ops !== null) === undefined) || (this.state.filterOps === 'bayar' && newOps.find(({end_ops}) => end_ops === null) === undefined)) && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='boxDash'>
                                <div className='subtitle'>Kasbon</div>
                                <div className={style.secEmail3}>
                                    <Button color='primary' onClick={() => this.goRoute('kasbon')}>More Data</Button>
                                    <div className={style.searchEmail2}>
                                        <text>Filter:  </text>
                                        <Input className={style.filter} type="select" value={this.state.filterKasbon} onChange={e => this.changeFilterKasbon(e.target.value)}>
                                            <option value="all">All</option>
                                            <option value="reject">Reject</option>
                                            <option value="available">Available Approve</option>
                                            {/* <option value="revisi">Available Reapprove (Revisi)</option> */}
                                        </Input>
                                    </div>
                                </div>
                                <div className={[style.secEmail4]}>
                                    <div className='rowCenter'>
                                        <div className='rowCenter'>
                                            {/* <text className='mr-4'>Time:</text> */}
                                            <Input className={style.filter3} type="select" value={this.state.timeKasbon} onChange={e => this.changeTimeKasbon(e.target.value)}>
                                                <option value="all">Time (All)</option>
                                                <option value="pilih">Periode</option>
                                            </Input>
                                        </div>
                                        {this.state.timeKasbon === 'pilih' ?  (
                                            <>
                                                <div className='rowCenter'>
                                                    <text className='bold'>:</text>
                                                    <Input
                                                        type= "date" 
                                                        className="inputRinci"
                                                        value={this.state.time1Kasbon}
                                                        onChange={e => this.selectTimeKasbon({val: e.target.value, type: 'time1Kasbon'})}
                                                    />
                                                    <text className='mr-1 ml-1'>To</text>
                                                    <Input
                                                        type= "date" 
                                                        className="inputRinci"
                                                        value={this.state.time2Kasbon}
                                                        onChange={e => this.selectTimeKasbon({val: e.target.value, type: 'time2Kasbon'})}
                                                    />
                                                    <Button
                                                    disabled={this.state.time1Kasbon === '' || this.state.time2Kasbon === '' ? true : false} 
                                                    color='primary' 
                                                    onClick={this.getDataTimeKasbon} 
                                                    className='ml-1'>
                                                        Go
                                                    </Button>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className={style.searchEmail2}>
                                        <text>Status:  </text>
                                        <Input className={style.filter} type="select" value={this.state.statKasbon} onChange={e => this.changeStatKasbon(e.target.value)}>
                                        <option value='all'>All</option>
                                            <option value={2} >Pengajuan Area</option>
                                            <option value={6} >List Ajuan Bayar</option>
                                            <option value={3} >Verifikasi Finance</option>
                                            <option value={4} >Verifikasi Tax</option>
                                        </Input>
                                    </div>
                                </div>
                                <div className={style.tableDashboard}>
                                    <TblHead tagBody={
                                        <tbody>
                                            {newKasbon.map(item => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>{newKasbon.indexOf(item) + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.cost_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{item.keterangan}</th>
                                                        <th>{moment(item.start_ops).format('DD MMMM YYYY')}</th>
                                                        <th>{item.history !== null && item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            {this.state.filterKasbon === "available" && (
                                                                <Button size='sm' onClick={() => this.goProses({route: 'kasbon', type: 'approve', item: item})}  className='mb-1 mr-1' color='success'>Proses</Button>
                                                            )}
                                                            <Button size='sm' className='mb-1' onClick={() => this.prosesDetail({type: 'kasbon', item: item})} color='warning'>Rincian</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    } />
                                    {loadingKasbon && (
                                        <div className={style.spin}>
                                            <Spinner type="grow" color="primary"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                            <Spinner type="grow" color="warning"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                            <Spinner type="grow" color="info"/>
                                        </div>
                                    )}
                                    {(newKasbon.length === 0 || (this.state.filterKasbon === 'completed' && newKasbon.find(({end_ops}) => end_ops !== null) === undefined) || (this.state.filterKasbon === 'bayar' && newKasbon.find(({end_ops}) => end_ops === null) === undefined)) && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='boxDash mb-4'>
                                <div className='subtitle'>Ikhtisar Kas Kecil</div>
                                <div className={style.secEmail3}>
                                    <Button color='primary' onClick={() => this.goRoute('ikk')}>More Data</Button>
                                    <div className={style.searchEmail2}>
                                        <text>Filter:  </text>
                                        <Input className={style.filter} type="select" value={this.state.filterIkk} onChange={e => this.changeFilterIkk(e.target.value)}>
                                            <option value="all">All</option>
                                            <option value="reject">Reject</option>
                                            <option value="available">Available Approve</option>
                                            {/* <option value="revisi">Available Reapprove (Revisi)</option> */}
                                        </Input>
                                    </div>
                                </div>
                                <div className={[style.secEmail4]}>
                                    <div className='rowCenter'>
                                        <div className='rowCenter'>
                                            {/* <text className='mr-4'>Time:</text> */}
                                            <Input className={style.filter3} type="select" value={this.state.timeIkk} onChange={e => this.changeTimeIkk(e.target.value)}>
                                                <option value="all">Time (All)</option>
                                                <option value="pilih">Periode</option>
                                            </Input>
                                        </div>
                                        {this.state.timeIkk === 'pilih' ?  (
                                            <>
                                                <div className='rowCenter'>
                                                    <text className='bold'>:</text>
                                                    <Input
                                                        type= "date" 
                                                        className="inputRinci"
                                                        value={this.state.time1Ikk}
                                                        onChange={e => this.selectTimeIkk({val: e.target.value, type: 'time1Ikk'})}
                                                    />
                                                    <text className='mr-1 ml-1'>To</text>
                                                    <Input
                                                        type= "date" 
                                                        className="inputRinci"
                                                        value={this.state.time2Ikk}
                                                        onChange={e => this.selectTimeIkk({val: e.target.value, type: 'time2Ikk'})}
                                                    />
                                                    <Button
                                                    disabled={this.state.time1Ikk === '' || this.state.time2Ikk === '' ? true : false} 
                                                    color='primary' 
                                                    onClick={this.getDataTimeIkk} 
                                                    className='ml-1'>
                                                        Go
                                                    </Button>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className={style.searchEmail2}>
                                        <text>Status:  </text>
                                        <Input className={style.filter} type="select" value={this.state.statIkk} onChange={e => this.changeStatIkk(e.target.value)}>
                                            <option value='all'>All</option>
                                            <option value={2} >Pengajuan Area</option>
                                            <option value={6} >List Ajuan Bayar</option>
                                            <option value={3} >Verifikasi Finance</option>
                                            <option value={4} >Verifikasi Tax</option>
                                        </Input>
                                    </div>
                                </div>
                                <div className={style.tableDashboard}>
                                    <TblHead tagBody={
                                        <tbody>
                                            {newIkk.map(item => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>{newIkk.indexOf(item) + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.cost_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{item.keterangan}</th>
                                                        <th>{moment(item.start_ikk).format('DD MMMM YYYY')}</th>
                                                        <th>{item.history !== null && item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            {this.state.filterIkk === "available" && (
                                                                <Button 
                                                                onClick={() => this.goProses(this.state.statIkk === '3' || this.state.statIkk === '4' 
                                                                    ? {route: 'veriffinikk', type: 'approve', item: item} 
                                                                    : {route: 'ikk', type: 'approve', item: item})} 
                                                                size='sm'  
                                                                className='mb-1 mr-1' 
                                                                color='success'>
                                                                    Proses
                                                                </Button>
                                                            )}
                                                            <Button 
                                                            size='sm' 
                                                            className='mb-1' 
                                                            onClick={() => this.prosesDetail({type: 'ikk', item: item})} 
                                                            color='warning'>
                                                                Rincian
                                                            </Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    } />
                                    {loadingIkk && (
                                        <div className={style.spin}>
                                            <Spinner type="grow" color="primary"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                            <Spinner type="grow" color="warning"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                            <Spinner type="grow" color="info"/>
                                        </div>
                                    )}
                                    {(newIkk.length === 0 || (this.state.filterIkk === 'completed' && newIkk.find(({end_ikk}) => end_ikk !== null) === undefined) || (this.state.filterIkk === 'bayar' && newIkk.find(({end_ikk}) => end_ikk === null) === undefined)) && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal isOpen={this.state.modalRinci} className='modalrinci'  toggle={this.openModalRinci} size="xl">
                    <ModalBody>
                        <div>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={dataAjuan.length > 0 ? dataAjuan[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={dataAjuan.length > 0 ? dataAjuan[0].no_transaksi : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={dataAjuan.length > 0 ? moment(dataAjuan[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
                            </Row>
                        </div>
                        <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr className='tbklaim'>
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
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataAjuan.length !== 0 && dataAjuan.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{dataAjuan.indexOf(item) + 1}</th>
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
                                                <th>{item.nominal}</th>
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
                            <Button color="primary"  onClick={() => this.openProsesModalDoc(dataAjuan[0])}>Dokumen</Button>
                        </div>
                        <div className="btnFoot">
                            <Button color="success" onClick={this.prosesTracking}>
                                Tracking
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal className='modalrinci' isOpen={this.state.modalFaa} toggle={this.openModalFaa} size="xl">
                    {typeTrans === 'klaim' || typeTrans === 'ops' || typeTrans === 'kasbon' ? (
                        <ModalHeader>
                            FORM AJUAN AREA
                        </ModalHeader>
                    ) : null}
                    <ModalBody>
                        {typeTrans === 'klaim' ? (
                            <FAA />
                        ) : typeTrans === 'ops' || typeTrans === 'kasbon' ? (
                            <FAAOps />
                        ) : (
                            <Formikk />
                        )}
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
                        {typeTrans === 'klaim' ? (
                            <FPD totalfpd={this.state.totalfpd} />
                        ) : typeTrans === 'ops' || typeTrans === 'kasbon' ? (
                            <FPDOps totalfpd={this.state.totalfpd} />
                        ) : (
                            <FPDIkk totalfpd={this.state.totalfpd} />
                        )}
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
                {/* <Modal isOpen={this.props.klaim.isLoading ? true : false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal> */}
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
                        {docAjuan !== undefined && docAjuan.map(x => {
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
            <Modal isOpen={this.state.formDis} toggle={() => {this.openModalDis()}} size="xl">
                <ModalBody>
                    {typeTrans === 'klaim' ? (
                            <Tracking />
                        ) : typeTrans === 'ops' || typeTrans === 'kasbon' ? (
                            <TrackingOps />
                        ) : (
                            <TrackingIkk />
                        )}
                </ModalBody>
                <hr />
                <div className="modalFoot ml-3">
                    <div></div>
                    <div className="btnFoot">
                        <Button color="primary" onClick={() => {this.openModalDis()}}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={this.state.history} toggle={this.openHistory}>
                <ModalBody>
                    <div className='mb-4'>History Transaksi</div>
                    <div className='history'>
                        {detailKlaim.length > 0 && detailKlaim[0].history.split(',').map(item => {
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
    klaim: state.klaim,
    ikk: state.ikk,
    ops: state.ops,
    menu: state.menu,
    dokumen: state.dokumen,
    reason: state.reason
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNameApprove: approve.getNameApprove,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    getRole: user.getRole,
    getKlaim: klaim.getKlaim,
    getOps: ops.getOps,
    getKasbon: ops.getKasbon,
    getIkk: ikk.getIkk,
    getDetail: klaim.getDetail,
    getApproval: klaim.getApproval,
    getDetailOps: ops.getDetail,
    getApprovalOps: ops.getApproval,
    getDetailIkk: ikk.getDetail,
    getApprovalIkk: ikk.getApproval,
    getDocKlaim: klaim.getDocCart,
    getDocOps: ops.getDocCart,
    getDocIkk: ikk.getDocCart,
    approveKlaim: klaim.approveKlaim,
    getAllMenu: menu.getAllMenu,
    getReason: reason.getReason,
    rejectKlaim: klaim.rejectKlaim,
    resetKlaim: klaim.resetKlaim,
    showDokumen: dokumen.showDokumen,
    // notifStock: notif.notifStock
}

export default connect(mapStateToProps, mapDispatchToProps)(Klaim)
