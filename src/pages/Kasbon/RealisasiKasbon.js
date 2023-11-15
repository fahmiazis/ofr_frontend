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
import user from '../../redux/actions/user'
import {connect} from 'react-redux'
import moment from 'moment'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import finance from '../../redux/actions/finance'
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
import Tracking from '../../components/Ops/tracking'
import TableRincian from '../../components/Ops/tableRincian'
import dokumen from '../../redux/actions/dokumen'
import email from '../../redux/actions/email'
import Email from '../../components/Ops/Email'
import FAA from '../../components/Ops/FAA'
import FPD from '../../components/Ops/FPD'
import pagu from '../../redux/actions/pagu'
import faktur from '../../redux/actions/faktur'
import bank from '../../redux/actions/bank'
import vendor from '../../redux/actions/vendor'
import rekening from '../../redux/actions/rekening'
import coa from '../../redux/actions/coa'
import Select from 'react-select'
import NumberInput from '../../components/NumberInput'
const {REACT_APP_BACKEND_URL, REACT_APP_URL_FULL} = process.env
const nonObject = 'Non Object PPh'

const addSchema = Yup.object().shape({
    keterangan: Yup.string().required("must be filled"),
    periode_awal: Yup.date().required("must be filled"),
    periode_akhir: Yup.date().required('must be filled'),
    dpp: Yup.number(),
    ppn: Yup.number(),
    // nilai_ajuan: Yup.string().required("must be filled"),
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});


class Kasbon extends Component {
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
            newOps: [],
            totalfpd: 0,
            dataMenu: [],
            listMenu: [],
            collap: false,
            tipeCol: '',
            formDis: false,
            history: false,
            upload: false,
            openDraft: false,
            message: '',
            subject: '',
            openAppDoc: false,
            openRejDoc: false,
            time: 'pilih',
            time1: moment().startOf('week').format('YYYY-MM-DD'),
            time2: moment().format('YYYY-MM-DD'),
            docHist: false,
            detailDoc: {},
            docCon: false,
            listOps: [],
            modalDownload: false,
            dataDownload: [],
            bankList: [],
            no_coa: '',
            nama_coa: '',
            bank: '',
            digit: 0,
            rekList: [],
            norek: '',
            tiperek: '',
            tujuan_tf: '',
            transList: [],
            jenisTrans: '',
            idTrans: '',
            jenisVendor: '',
            status_npwp: '',
            dataTrans: {},
            nominal: 0,
            nilai_ajuan: 0,
            nilai_buku: 0,
            nilai_utang: 0,
            nilai_vendor: 0,
            tipeVendor: '',
            nilai_dpp: 0,
            nilai_ppn: 0,
            tipePpn: '',
            listNpwp: [],
            listNik: [],
            dataList: {},
            fakturList: [],
            dataSelFaktur: { no_faktur: '' },
            noNpwp: '',
            noNik: '',
            nama: '',
            alamat: '',
            tgl_faktur: '',
            isLoading: false,
            typeniknpwp: '',
            type_kasbon: 'kasbon',
            modalRev: false
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

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    getApproveStock = async (value) => { 
        const token = localStorage.getItem('token')
        await this.props.getApproveStock(token, value.no, value.nama)
    }

    rejectOps = async (val) => {
        const {listMut, listReason, listMenu} = this.state
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
            list: listMut,
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

    goProses(val) {
        localStorage.setItem('tipeKasbon', val.type)
        setTimeout(() => {
            this.props.history.push({
                pathname: `/${val.route}`,
                state: val
            })
         }, 200)
    }

    goRevisi = (val) => {
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

    prosesSubmitRevisi = async () => {
        const {detailOps} = this.props.ops
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailOps[0].no_transaksi
        }
        await this.props.submitRevisi(token, tempno)
        this.openModalRinci()
        this.openModalRev()
        this.getDataOps()
        this.setState({confirm: 'submit'})
        this.openConfirm()
    }

    openModalRev = () => {
        this.setState({modalRev: !this.state.modalRev})
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

    prepareSelect = () => {
        const { dataCoa } = this.props.coa
        const { dataBank } = this.props.bank
        const { dataVendor } = this.props.vendor
        const temp = [
            {value: '', label: '-Pilih-'}
        ]
        const trans = [
            {value: '', label: '-Pilih-'}
        ]
        const bank = [
            {value: '', label: '-Pilih-'}
        ]
        const listNpwp = [
            {value: '', label: '-Pilih-'}
        ]
        const listNik = [
            {value: '', label: '-Pilih-'}
        ]
        dataCoa.map(item => {
            return (
                temp.push({value: item.gl_account, label: `${item.gl_account} ~ ${item.gl_name}`})
            )
        })
        dataBank.map(item => {
            return (
                bank.push({value: item.digit, label: item.name})
            )
        })
        dataVendor.map(item => {
            return (
                item.no_npwp === 'TIDAK ADA' && item.no_ktp !== 'TIDAK ADA' ?
                    listNik.push({value: item.id, label: item.no_ktp}) 
                : item.no_ktp === 'TIDAK ADA' && item.no_npwp !== 'TIDAK ADA' ?
                    listNpwp.push({value: item.id, label: item.no_npwp}) 
                : listNpwp.push({value: item.id, label: item.no_npwp}) && listNik.push({value: item.id, label: item.no_ktp}) 
            )
        })
        this.setState({options: temp, bankList: bank, transList: trans, listNik: listNik, listNpwp: listNpwp})
    }

    async componentDidMount() {
        const token = localStorage.getItem('token')
        const dataCek = localStorage.getItem('docData')
        const {item, type} = (this.props.location && this.props.location.state) || {}
        await this.props.getCoa(token, 'kasbon')
        await this.props.getBank(token)
        await this.props.getVendor(token)
        if (type === 'approve') {
            this.getDataOps()
            this.prosesDetail(item)
        } else if (dataCek !== undefined && dataCek !== null) {
            const data = {
                no_transaksi: dataCek
            }
            this.getDataOps()
            this.prosesDocTab(data)
        } else {
            this.getDataOps()
        }
    }

    componentDidUpdate() {
        const { isApprove, isReject } = this.props.ops
        const { isSend } = this.props.email
        if (isApprove === false) {
            this.setState({confirm: 'rejApprove'})
            this.openConfirm()
            this.openModalApprove()
            this.props.resetOps()
        } else if (isReject === false) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
            this.openModalReject()
            this.props.resetOps()
        } else if (isSend === false) {
            this.setState({confirm: 'rejSend'})
            this.openConfirm()
            this.props.resetEmail()
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
        const level = localStorage.getItem('level')
        this.setState({limit: value === undefined ? 10 : value.limit})
        this.prepareSelect()
        this.changeFilter(level === '5' ? 'available' : 'all')
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
        const data = {
            no: val.no_transaksi,
            name: 'Draft Pengajuan Ops'
        }
        this.setState({listMut: []})
        await this.props.getDetail(token, tempno)
        await this.props.getApproval(token, tempno)
        await this.props.getDocOps(token, data)
        this.openModalRinci()
    }

    openModalDok = () => {
        this.setState({opendok: !this.state.opendok})
    }

    printData = (val) => {
        this.props.history.push(`/${val}`)
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
        const {dataOps, noDis} = this.props.ops
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = 8
        const statusAll = 'all'
        const {time1, time2} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const typeKasbon = 'kasbon'
        const realisasi = 'realisasi'
        if (val === 'available') {
            const newOps = []
            await this.props.getOps(token, status, 'all', 'all', val, 'verif', 'undefined', cekTime1, cekTime2, typeKasbon, realisasi)
            this.setState({filter: val, newOps: newOps})
        } else if (val === 'reject') {
            const newOps = []
            await this.props.getOps(token, status, 'all', 'all', val, 'verif', 'undefined', cekTime1, cekTime2, typeKasbon, realisasi)
            this.setState({filter: val, newOps: newOps})
        } else if (val === 'revisi') {
            const newOps = []
            await this.props.getOps(token, status, 'all', 'all', val, 'verif', 'undefined', cekTime1, cekTime2, typeKasbon, realisasi)
            this.setState({filter: val, newOps: newOps})
        } else {
            const newOps = []
            await this.props.getOps(token, statusAll, 'all', 'all', val, 'verif', 'undefined', cekTime1, cekTime2, typeKasbon, realisasi)
            this.setState({filter: val, newOps: newOps})
        }
    }

    changeTime = async (val) => {
        const token = localStorage.getItem("token")
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
        const typeKasbon = 'kasbon'
        const {time1, time2, filter} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const realisasi = 'realisasi'
        const status = filter === 'all' ? 'all' : 8
        await this.props.getOps(token, status, 'all', 'all', filter, 'verif', 'undefined', cekTime1, cekTime2, typeKasbon, realisasi)
    }
    
    cekDataDoc = () => {
        // const { dataDoc } = this.props.ops
        // const level = localStorage.getItem("level")
        // const tempdoc = []
        // for (let i = 0; i < dataDoc.length; i++) {
        //     const arr = dataDoc[i]
        //     const stat = arr.status
        //     const cekLevel = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[0] : ''
        //     const cekStat = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[1] : ''
        //     if (cekLevel === ` level ${level}` && cekStat === ` status approve`) {
        //         tempdoc.push(arr)
        //         console.log('masuk if')
        //     } else {
        //         console.log('masuk else')
        //         console.log(cekLevel)
        //     }
        // }
        // if (tempdoc.length === dataDoc.length) {
            
        // } else {
        //     this.setState({confirm: 'appNotifDoc'})
        //     this.openConfirm()
        // }
        this.openModalApprove()
    }

    prosesSubmitPre = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAssetAll(token, 1000, '', 1, 'asset')
        this.modalSubmitPre()
    }

    updateTransaksi = async (val) => {
        
    }

    approveDataOps = async () => {
        const { detailOps } = this.props.ops
        const token = localStorage.getItem("token")
        const level = localStorage.getItem("level")
        const tempno = {
            no: detailOps[0].no_transaksi,
            list: []
        }
        await this.props.submitRealisasi(token, tempno)
        this.dataSendEmail()
    }

    prepSendEmail = async () => {
        const { detailOps } = this.props.ops
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const app = detailOps[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'submit'
        const cekMenu = 'Pengajuan Realisasi Kasbon (Operasional)'
        const tempno = {
            no: detailOps[0].no_transaksi,
            kode: detailOps[0].kode_plant,
            jenis: 'ops',
            tipe: tipe,
            menu: cekMenu 
        }
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    dataSendEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { detailOps } = this.props.ops
        const { draftEmail } = this.props.email
        const { message, subject } = this.state
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        const tempno = {
            draft: draftEmail,
            nameTo: draftEmail.to.username,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: detailOps[0].no_transaksi,
            tipe: 'ops',
        }
        await this.props.sendEmail(token, tempno)
        this.getDataOps()
        this.setState({confirm: 'isApprove'})
        this.openConfirm()
        this.openDraftEmail()
        this.openModalApprove()
        this.openModalRinci()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    getMessage = (val) => {
        this.setState({message: val.message, subject: val.subject})
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
        localStorage.removeItem('docData')
        const tempno = {
            no: val.no_transaksi,
            name: 'Draft Pengajuan Ops'
        }
        await this.props.getDocOps(token, tempno)
        this.setState({docCon: false})
        this.openModalDoc()
    }

    prosesDocTab = async (val) => {
        const token = localStorage.getItem("token")
        const tempno = {
            no: val.no_transaksi
        }
        const sendDoc = {
            no_transaksi: val.no_transaksi
        }
        const data = {
            no: val.no_transaksi,
            name: 'Draft Pengajuan Ops'
        }
        this.setState({listMut: []})
        await this.props.getDetail(token, tempno)
        await this.props.getApproval(token, tempno)
        await this.props.getDocOps(token, data)
        this.openModalRinci()
        this.openProsesModalDoc(sendDoc)
    }

    openDocNewTab = async (val) => {
        localStorage.setItem('docData', val[0].no_transaksi)
        const newWindow = window.open('kasbon', '_blank', 'noopener,noreferrer')
        this.setState({docCon: false})
        if (newWindow) {
            newWindow.opener = null
        }
    }

    openDocCon = () => {
        this.setState({docCon: !this.state.docCon})
    }

    docHistory = (val) => {
        this.setState({detailDoc: val})
        this.setState({docHist: !this.state.docHist})
    }

    openModalDoc = () => {
        this.setState({modalDoc: !this.state.modalDoc})
    }

    approveDoc = async () => {
        const token = localStorage.getItem('token')
        const {idDoc} = this.state
        const { detailOps } = this.props.ops
        const tempno = {
            no: detailOps[0].no_transaksi,
            name: 'Draft Pengajuan Ops'
        }
        await this.props.approveDokumen(token, idDoc)
        await this.props.getDocOps(token, tempno)
        this.setState({confirm: 'isAppDoc'})
        this.openConfirm()
        this.openModalAppDoc()
        
    }

    openModalAppDoc = () => {
        this.setState({openAppDoc: !this.state.openAppDoc})
    }

    rejectDoc = async () => {
        const token = localStorage.getItem('token')
        const {idDoc} = this.state
        const { detailOps } = this.props.ops
        const tempno = {
            no: detailOps[0].no_transaksi,
            name: 'Draft Pengajuan Ops'
        }
        await this.props.rejectDokumen(token, idDoc)
        await this.props.getDocOps(token, tempno)
        this.setState({confirm: 'isRejDoc'})
        this.openConfirm()
        this.openModalRejDoc()
    }

    openModalRejDoc = () => {
        this.setState({openRejDoc: !this.state.openRejDoc})
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
        const {detailOps} = this.props.ops
        if (val === 'all') {
            const data = []
            for (let i = 0; i < detailOps.length; i++) {
                data.push(detailOps[i].id)
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
        await this.props.getAllMenu(token, 'reject', 'Operasional')
        await this.props.getReason(token)
        const dataMenu = this.props.menu.dataAll
        const data = []
        dataMenu.map(item => {
            return (item.kode_menu === 'Operasional' && data.push(item))
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

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailId(token, val)
        await this.props.getFinRek(token)
        await this.props.getDetailFinance(token)
        const { dataRek } = this.props.finance
        const spending = dataRek[0].rek_spending
        const zba = dataRek[0].rek_zba
        const bankcol = dataRek[0].rek_bankcol
        const temp = [
            {label: '-Pilih-', value: ''},
            spending !== '0' ? {label: `${spending}~Rekening Spending Card`, value: 'Rekening Spending Card'} : {value: '', label: ''},
            zba !== '0' ? {label: `${zba}~Rekening ZBA`, value: 'Rekening ZBA'} : {value: '', label: ''},
            bankcol !== '0' ? {label: `${bankcol}~Rekening Bank Coll`, value: 'Rekening Bank Coll'} : {value: '', label: ''}
        ]

        const {idOps} = this.props.ops

        this.setState({
            isLoading: true,
            rekList: temp,
            nama: idOps.nama_vendor, 
            alamat: idOps.alamat_vendor, 
            noNpwp: idOps.no_npwp, 
            noNik: idOps.no_ktp,
            norek: idOps.norek_ajuan,
            tiperek: idOps.tiperek,
            nilai_dpp: idOps.dpp,
            nilai_ppn: idOps.ppn,
            nilai_ajuan: idOps.nilai_ajuan,
            nilai_buku: idOps.nilai_buku,
            nilai_utang: idOps.nilai_utang,
            nilai_vendor: idOps.nilai_vendor,
            nilai_bayar: idOps.nilai_vendor,
            jenis_pph: idOps.jenis_pph,
            tipePpn: idOps.type_transaksi,
            tipeVendor: idOps.penanggung_pajak,
            status_npwp: idOps.status_npwp === 0 ? 'Tidak' : idOps.status_npwp === 1 ? 'Ya' : nonObject,
            dataSelFaktur: { no_faktur: idOps.no_faktur }
        })
        const cekNpwp = idOps.no_npwp === '' || idOps.no_npwp === null ? null : idOps.no_npwp

        this.selectCoa({value: idOps.no_coa, label: `${idOps.no_coa} ~ ${idOps.nama_coa}`})
        this.prepNikNpwp(cekNpwp)
        this.selectTujuan(idOps.tujuan_tf)
        this.prepBank(idOps.bank_tujuan)
        
        setTimeout(() => {
            this.prepFaktur(idOps.no_faktur)
         }, 500)
        setTimeout(() => {
            this.cekTrans()
         }, 300)
         setTimeout(() => {
            this.setState({isLoading: false})
            this.openEdit()
         }, 1000)
    }

    openEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    selectCoa = async (e) => {
        const {listGl} = this.props.coa
        this.setState({no_coa: e.value, nama_coa: e.label})
        if (listGl.find((x) => x === parseInt(e.value))) {
            this.setState({tipeVendor: "PMA"})
            setTimeout(() => {
                this.selectTypePpn('Tidak')
             }, 100)
            setTimeout(() => {
                this.prepareTrans()
             }, 200)
        } else {
            setTimeout(() => {
                this.prepareTrans()
             }, 100)
        }
    }

    prepNikNpwp = async (val) => {
        const token = localStorage.getItem("token")
        if (val === null) {
            this.setState({fakturList: []})
        } else {
            await this.props.getFaktur(token, val)
            const {dataFaktur} = this.props.faktur
            const temp = [
                {value: '', label: '-Pilih-'}
            ]
            dataFaktur.map(item => {
                const date1 = new Date(item.tgl_faktur)
                const date2 = new Date()
                const diffTime = Math.abs(date2 - date1)
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                return (
                    diffDays < 90 && item.status === null && temp.push({value: item.id, label: `${item.no_faktur}~${item.nama}`})
                )
            })
            this.setState({fakturList: temp})
        }
    }

    selectTujuan = (val) => {
        if (val === 'PMA') {
            this.setState({tujuan_tf: val, bank: 'Bank Mandiri', digit: 13})
        } else {
            this.setState({tujuan_tf: val, bank: '', digit: 0})
        }
    }

    prepBank = (val) => {
        const { dataBank } = this.props.bank
        const data = dataBank.find(({bank}) => bank === val)
        console.log({dataBank, val})
        if (data === undefined) {
            this.setState()
        } else {
            this.setState({bank: data.name, digit: data.digit})
        }
    }

    prepFaktur = (val) => {
        const {dataFaktur} = this.props.faktur
        const data = dataFaktur.find(({no_faktur}) => no_faktur === val)
        console.log({dataFaktur, val})
        if (data === undefined) {
            console.log('masuk prep faktur')
        } else {
            const nilai_ajuan = parseFloat(data.jumlah_dpp) + parseFloat(data.jumlah_ppn)
            this.setState({dataSelFaktur: data, nilai_ajuan: nilai_ajuan, nilai_dpp: data.jumlah_dpp, nilai_ppn: data.jumlah_ppn, tgl_faktur: data.tgl_faktur})
            setTimeout(() => {
                this.formulaTax()
             }, 500)
        }
    }

    cekTrans = () => {
        const { allCoa } = this.props.coa
        const {idOps} = this.props.ops
        const pph = idOps.jenis_pph
        const statNpwp = idOps.status_npwp
        const npwp = idOps.no_npwp === '' || idOps.no_npwp === null ? null : idOps.no_npwp
        const cekPph = pph === 'Non PPh' || pph === '' || pph === null ? 'Non PPh' : pph
        const trans = idOps.sub_coa
        const vendor = cekPph === 'Non PPh' ? nonObject : idOps.jenis_vendor !== null && idOps.jenis_vendor !== '' ? idOps.jenis_vendor : null
        const cekStat = cekPph === 'Non PPh' ? 'No Need NPWP/NIK' : statNpwp === 1 && npwp !== null ? 'NPWP' : 'NIK'
        const nilaiBuku = idOps.nilai_buku
        const nilaiUtang = idOps.nilai_utang
        // console.log({idOps, stat_npwp: idOps.status_npwp, npwp: idOps.no_npwp, nik: idOps.no_ktp})
        if (vendor === null) {
            const selectOp = allCoa.find(({type_transaksi, jenis_transaksi, status_npwp}) => 
                                type_transaksi === 'Orang Pribadi'  
                                && jenis_transaksi === trans
                                && status_npwp === cekStat)

            const selectBadan = allCoa.find(({type_transaksi, jenis_transaksi, status_npwp}) => 
                                type_transaksi === "Badan"
                                && jenis_transaksi === trans
                                && status_npwp === cekStat)

            const cekVal = ((nilaiUtang / nilaiBuku) * 100).toFixed(1)
            const finVal = `${cekVal.toString()}%`
            if (selectOp.tarif_pph === finVal) {
                this.selectTrans({value: selectOp.id, label: `${selectOp.gl_account} ~ ${selectOp.jenis_transaksi}`})
                setTimeout(() => {
                    this.selectJenis(selectOp.type_transaksi)
                }, 300)
            } else if (selectBadan.tarif_pph === finVal) {
                this.selectTrans({value: selectBadan.id, label: `${selectBadan.gl_account} ~ ${selectBadan.jenis_transaksi}`})
                setTimeout(() => {
                    this.selectJenis(selectBadan.type_transaksi)
                }, 300)
            }
        } else {
            const selectCoa = allCoa.find(({type_transaksi, jenis_transaksi, status_npwp}) => 
                            type_transaksi === vendor  
                            && jenis_transaksi === trans
                            && status_npwp === cekStat)
            this.selectTrans({value: selectCoa.id, label: `${selectCoa.gl_account} ~ ${selectCoa.jenis_transaksi}`})
            setTimeout(() => {
                this.selectJenis(selectCoa.type_transaksi)
            }, 300)    
        }
    }

    selectJenis = async (val) => {
        const {idTrans, jenisTrans, status_npwp} = this.state
        this.setState({jenisVendor: val, status_npwp: val === 'Badan' ? 'Ya' : status_npwp})
        setTimeout(() => {
            this.selectTrans({value: idTrans, label: jenisTrans})
         }, 100)
    }

    selectTrans = (e) => {
        const { allCoa } = this.props.coa
        const { jenisVendor, dataTrans } = this.state
        const statNpwp = this.state.status_npwp
        const cekStat = statNpwp === 'Ya' ? 'NPWP' : statNpwp === 'Tidak' ? 'NIK' : 'No Need NPWP/NIK'
        if (e.value === '') {
            this.setState()
        } else {
            let temp = {}
            let jenis = ''
            const cek = allCoa.find(({id}) => id === e.value)
            if (cek.type_transaksi === nonObject) {
                temp = cek
                jenis = nonObject
                this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis})
                this.formulaTax()
            } else if (jenisVendor === '' || jenisVendor === nonObject) {
                temp = cek
                jenis = ''
                this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis})
                this.formulaTax()
            } else {
                const selectCoa = allCoa.find(({type_transaksi, jenis_transaksi}) => 
                                    type_transaksi === jenisVendor && 
                                    jenis_transaksi === dataTrans.jenis_transaksi)
                const selectCoaFin = allCoa.find(({type_transaksi, jenis_transaksi, status_npwp}) => 
                                    type_transaksi === jenisVendor && 
                                    jenis_transaksi === dataTrans.jenis_transaksi
                                    && status_npwp === cekStat)
                if (selectCoa === undefined && selectCoaFin === undefined) {
                    this.openConfirm(this.setState({confirm: 'failJenisTrans'}))
                    this.setState({idTrans: '', jenisTrans: '', dataTrans: {}, jenisVendor: ''})
                } else {
                    console.log('masuk not undefined')
                    temp = selectCoaFin === undefined ? selectCoa : selectCoaFin
                    jenis = jenisVendor === nonObject ? '' : jenisVendor
                    this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis})
                    this.formulaTax()
                }
            }
        }
        
    }

    formulaTax = (val, type) => {
        const {dataTrans, nilai_ajuan, tipeVendor, tipePpn, nilai_dpp, nilai_ppn, type_kasbon} = this.state
        const nilai = nilai_ajuan
        const tipe = tipeVendor
        console.log(dataTrans)
        if (dataTrans.jenis_pph === 'Non PPh' || dataTrans.jenis_pph === undefined) {
            this.setState({nilai_ajuan: nilai, nilai_utang: 0, nilai_buku: nilai, nilai_vendor: nilai, tipeVendor: tipe})
        } else {
            if (tipePpn === 'Ya' && type_kasbon !== 'kasbon') {
                if (tipe === 'PMA') {
                    const nilai_buku = nilai_dpp
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(dataTrans.tarif_pph) / 100)
                    const nilai_vendor = Math.ceil((parseFloat(nilai_buku) + parseFloat(nilai_ppn)) - parseFloat(nilai_utang))
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                } else if (tipe === 'Vendor') {
                    const nilai_buku = nilai_dpp
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(dataTrans.tarif_pph) / 100)
                    const nilai_vendor = Math.ceil((parseFloat(nilai_buku) + parseFloat(nilai_ppn)) - parseFloat(nilai_utang))
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                }
            } else {
                if (tipe === 'PMA') {
                    const nilai_buku = Math.ceil(parseFloat(nilai) / parseFloat(dataTrans.dpp_grossup) * 100)
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(dataTrans.tarif_pph) / 100)
                    const nilai_vendor = nilai
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                } else if (tipe === 'Vendor') {
                    const nilai_buku = nilai
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(dataTrans.tarif_pph) / 100)
                    const nilai_vendor = Math.ceil(parseFloat(nilai) - parseFloat(nilai_utang))
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                }
            }
        }
    }

    prepareTrans = () => {
        const { allCoa } = this.props.coa
        const { no_coa, jenisVendor, status_npwp } = this.state
        const temp = [
            {value: '', label: '-Pilih-'}
        ]
        // const status = status_npwp === 'Ya' ? 'NPWP' : 'NIK'
        allCoa.map(item => {
            return (
                no_coa === item.gl_account
                && temp.find(({label}) => label === `${item.gl_account} ~ ${item.jenis_transaksi}`) === undefined
                // && jenisVendor === item.type_transaksi
                // && status === item.status_npwp
                ? temp.push({value: item.id, label: `${item.gl_account} ~ ${item.jenis_transaksi}`}) 
                : null
            )
        })
        this.setState({transList: temp})
        this.setState({idTrans: '', jenisTrans: '', dataTrans: {}, jenisVendor: ''})
    }

    selectTypePpn = async (val) => {
        if (val === 'Ya') {
            this.setState({tipePpn: val, tipeVendor: "Vendor"})
            setTimeout(() => {
                this.formulaTax()
            }, 200)
        } else {
            this.setState({dataSelFaktur: { no_faktur: '' }, tgl_faktur: ''})
            this.setState({tipePpn: val, nilai_dpp: 0, nilai_ppn: 0})
            setTimeout(() => {
                this.formulaTax()
            }, 200)
        }
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataRinci, dataTrans, type_kasbon, listMut, listReason, dataMenu, listMenu, detailDoc} = this.state
        const { detFinance } = this.props.finance
        const { dataReason } = this.props.reason
        const { noDis, detailOps, ttdOps, dataDoc, newOps, idOps } = this.props.ops
        const {listGl} = this.props.coa
        // const pages = this.props.finance.page

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
                                <div className={style.titleDashboard}>Realisasi Kasbon</div>
                            </div>
                            <div className={[style.secEmail4]}>
                                <div className={style.searchEmail2}>
                                    <text>Filter:  </text>
                                    <Input className={style.filter} type="select" value={this.state.filter} onChange={e => this.changeFilter(e.target.value)}>
                                        <option value="all">All</option>
                                        <option value="revisi">Open</option>
                                        <option value="reject">Close</option>
                                        {level === '5' && (
                                            <option value="available">Outstanding</option>
                                        )}
                                    </Input>
                                </div>
                                <div className={style.searchEmail2}>
                                </div>
                            </div>
                            <div className={[style.secEmail4]}>
                                <div className='rowCenter'>
                                    <div className='rowCenter'>
                                        <text className='mr-4'>Time:</text>
                                        <Input className={style.filter3} type="select" value={this.state.time} onChange={e => this.changeTime(e.target.value)}>
                                            <option value="all">All</option>
                                            <option value="pilih">Periode</option>
                                        </Input>
                                    </div>
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
                                                    className="inputRinci"
                                                    value={this.state.time2}
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
                            {level === '5' || level === '6' ? (
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab} id="table-ops">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>NO.AJUAN</th>
                                                <th>COST CENTRE</th>
                                                <th>AREA</th>
                                                <th>NO.COA</th>
                                                <th>NAMA COA</th>
                                                <th>KETERANGAN TAMBAHAN</th>
                                                <th>TGL AJUAN</th>
                                                <th>TIPE KASBON</th>
                                                <th>STATUS</th>
                                                <th>KETERANGAN</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
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
                                                        <th>{item.type_kasbon === null ? 'Non Kasbon' : 'Kasbon'}</th>
                                                        <th>{item.stat_kasbon === null ? 'Open' : 'Close'}</th>
                                                        <th>{item.history !== null && item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            <Button 
                                                            size='sm' 
                                                            onClick={
                                                                () => 
                                                                item.status_reject === 1 ? 
                                                                // this.goRevisi({route: 'revkasbon', type: 'revisi', item: item})
                                                                this.prosesDetail(item)
                                                                : this.prosesDetail(item)} 
                                                            className='mb-1 mr-1' 
                                                            color='success'>
                                                                {item.status_reject === 1 ? 'Revisi' : this.state.filter === 'available' ? 'Proses' : 'Detail'}
                                                            </Button>
                                                            <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {newOps.length === 0 && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab} id="table-ops">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>NO.AJUAN</th>
                                                <th>COST CENTRE</th>
                                                <th>AREA</th>
                                                <th>NO.COA</th>
                                                <th>NAMA COA</th>
                                                <th>KETERANGAN TAMBAHAN</th>
                                                <th>TGL AJUAN</th>
                                                <th>TIPE KASBON</th>
                                                <th>STATUS</th>
                                                <th>KETERANGAN</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
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
                                                        <th>{item.type_kasbon === null ? 'Non Kasbon' : 'Kasbon'}</th>
                                                        <th>{item.stat_kasbon === null ? 'Open' : 'Close'}</th>
                                                        <th>{item.history !== null && item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>Proses</Button>
                                                            <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {newOps.length === 0 && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            )}
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
                                            Opsi
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
                                        <th>DPP</th>
                                        <th>PPN</th>
                                        <th>PPh</th>
                                        <th>NILAI YANG DIBAYARKAN</th>
                                        <th>TANGGAL TRANSFER</th>
                                        <th>Jenis PPh</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailOps.length !== 0 && detailOps.map(item => {
                                        return (
                                            <tr>
                                                <th>
                                                    <Button size="sm" color='danger' onClick={() => this.prosesOpenEdit(item.id)}>Proses</Button>
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
                                                <th>{item.dpp}</th>
                                                <th>{item.ppn}</th>
                                                <th>{item.nilai_utang}</th>
                                                <th>{item.nilai_bayar}</th>
                                                <th>{item.tanggal_transfer}</th>
                                                <th>{item.jenis_pph}</th>
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
                            <Button color="primary"  onClick={() => this.openDocCon()}>Dokumen</Button>
                        </div>
                        <div className="btnFoot">
                            {detailOps.length !== 0 && detailOps[0].status_reject === 1 && (
                                <Button color="success" onClick={this.openModalRev}>
                                    Submit Revisi
                                </Button>
                            )}
                            {this.state.filter !== 'available' && this.state.filter !== 'revisi' ? (
                                <div></div>
                            ) : (
                                <>
                                    {/* <Button className="mr-2" disabled={this.state.filter === 'revisi'  && listMut.length > 0 ? false : this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false} color="danger" onClick={this.prepareReject}>
                                        Reject
                                    </Button> */}
                                    <Button color="success" disabled={this.state.filter === 'revisi'  ? false : this.state.filter !== 'available' ? true : false} onClick={this.cekDataDoc}>
                                        Submit
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
                        <FAA />
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning" onClick={() => this.printData('opsfaa')}>
                                {/* <TableStock /> */}
                                Download
                            </Button>
                            <Button color="success" onClick={this.openModalFaa}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalFpd} toggle={this.openModalFpd} size="lg" >
                    <ModalBody>
                        <FPD totalfpd={this.state.totalfpd} />
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning" onClick={() => this.printData('opsfpd')}>
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
                                    <Button color="primary" disabled={(values.alasan === '.' || values.alasan === '') && (listReason.length === 0 || listMenu.length === 0) ? true : false} onClick={handleSubmit}>Submit</Button>
                                    <Button className='ml-2' color="secondary" onClick={this.openModalReject}>Close</Button>
                                </div>
                            </div>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.ops.isLoading || this.props.menu.isLoading || this.props.reason.isLoading || this.props.email.isLoading || this.props.dokumen.isLoading} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApprove} toggle={this.openModalApprove} centered={true}>
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
                                {/* {level === '12' ? (
                                    <Button color="primary" onClick={() => this.approveDataOps()}>Ya</Button>
                                ) : (
                                    <Button color="primary" onClick={() => this.prepSendEmail()}>Ya</Button>
                                )} */}
                                <Button color="primary" onClick={() => this.prepSendEmail()}>Ya</Button>
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
                <Modal isOpen={this.state.modalRev} toggle={this.openModalRev} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk submit revisi    
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.prosesSubmitRevisi()}>Ya</Button>
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
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve dan Kirim Email</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejSend' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve dan Gagal Kirim Email</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'appNotifDoc' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Approve, Pastikan Dokumen Lampiran Telah Diapprove</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'submit' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'isAppDoc' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'isRejDoc' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Reject</div>
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
                   Kelengkapan Dokumen {detailOps !== undefined && detailOps.length > 0 && detailOps[0].no_transaksi}
                </ModalHeader>
                <ModalBody>
                    <Container>
                        {dataDoc !== undefined && dataDoc.map(x => {
                            return (
                                x.path !== null &&
                                <Row className="mt-3 mb-4">
                                    {x.path !== null && (
                                        <Col md={12} lg={12} className='mb-2' >
                                            <div className="btnDocIo mb-2" >{x.desc === null ? 'Lampiran' : x.desc}</div>
                                                {x.status !== null && x.status !== '1' && x.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                                x.status.split(',').reverse()[0].split(';')[1] === ` status approve` ? <AiOutlineCheck size={20} color="success" /> 
                                                : x.status !== null && x.status !== '1' && x.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                                x.status.split(',').reverse()[0].split(';')[1] === ` status reject` ?  <AiOutlineClose size={20} color="danger" /> 
                                                : (
                                                    <BsCircle size={20} />
                                                )}
                                            <button className="btnDocIo blue" onClick={() => this.showDokumen(x)} >{x.history}</button>
                                            <div>
                                                <Button color='success' onClick={() => this.docHistory(x)}>history</Button>
                                            </div>
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
                        {this.state.filter === 'available' ? (
                            <div>
                                <Button color="success" onClick={() => this.openModalAppDoc()}>Approve</Button>
                                <Button className='ml-1' color="danger" onClick={() => this.openModalRejDoc()}>Reject</Button>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <div className='rowGeneral'>
                            <Button color="primary" className='mr-1' onClick={() => this.downloadData()}>Download</Button>
                            <Button color="secondary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.formDis} toggle={() => {this.openModalDis()}} size="xl">
                <ModalBody>
                    <Tracking />
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
                        {detailOps.length > 0 && detailOps[0].history !== null && detailOps[0].history.split(',').map(item => {
                            return (
                                item !== null && item !== 'null' && 
                                <Button className='mb-2' color='info'>{item}</Button>
                            )
                        })}
                    </div>
                </ModalBody>
            </Modal>
            <Modal toggle={this.openDraftEmail} isOpen={this.state.openDraft} size='xl'>
                <ModalHeader>Email Pemberitahuan</ModalHeader>
                <ModalBody>
                    <Email handleData={this.getMessage}/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button
                                disabled={this.state.message === '' ? true : false} 
                                className="mr-2"
                                onClick={() => this.approveDataOps()} 
                                color="primary"
                            >
                                Approve & Send Email
                            </Button>
                            <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.openAppDoc} toggle={this.openModalAppDoc} centered={true}>
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
                                <Button color="primary" onClick={() => this.approveDoc()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalAppDoc}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openRejDoc} toggle={this.openModalRejDoc} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk reject     
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.rejectDoc()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalRejDoc}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.docHist} toggle={this.docHistory}>
                    <ModalBody>
                        <div className='mb-4'>History Dokumen</div>
                        <div className='history'>
                            {detailDoc.status !== undefined && detailDoc.status !== null && detailDoc.status.split(',').map(item => {
                                return (
                                    item !== null && item !== 'null' && 
                                    <Button className='mb-2' color='info'>{item}</Button>
                                )
                            })}
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.docCon} toggle={this.openDocCon} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div className='btnDocCon'>
                                <text>
                                    Pilih Open Kelengkapan Dokumen
                                </text>
                            </div>
                            <div className='btnDocCon mb-4'>
                                <Button color="primary" className='mr-2' onClick={() => this.openProsesModalDoc(detailOps[0])}>Open Pop Up</Button>
                                <Button color="success" className='ml-2' onClick={() => this.openDocNewTab(detailOps)}>Open New Tab</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalEdit} className='modalrinci' size="xl">
                    <ModalHeader>
                        Edit Ajuan Operasional Kasbon
                    </ModalHeader>
                    <ModalBody>
                            <Formik
                            initialValues = {{
                                keterangan: idOps.keterangan || '',
                                periode_awal: idOps.periode_awal || '',
                                periode_akhir: idOps.periode_akhir || '',
                                nilai_ajuan: idOps.nilai_ajuan || '',
                                norek_ajuan: idOps.norek_ajuan || '',
                                nama_tujuan: idOps.nama_tujuan || '',
                                status_npwp: idOps.status_npwp || '',
                                nama_npwp: idOps.nama_npwp || '',
                                no_npwp: idOps.no_npwp || '',
                                no_ktp: idOps.no_ktp || '',
                                nama_ktp: idOps.nama_ktp || '',
                                nama_vendor: idOps.nama_vendor || '',
                                alamat_vendor: idOps.alamat_vendor || '',
                                penanggung_pajak: idOps.penanggung_pajak || '',
                                type_transaksi: idOps.type_transaksi || '',
                                no_faktur: idOps.no_faktur || '',
                                dpp: idOps.dpp || 0,
                                ppn: idOps.ppn || 0,
                                tgl_tagihanbayar: idOps.tgl_tagihanbayar || '',
                                type_po: idOps.type_po || '',
                                no_po: idOps.no_po || '',
                                nilai_po: idOps.nilai_po || 0,
                                nilai_pr: idOps.nilai_pr || 0
                            }}
                            validationSchema = {addSchema}
                            onSubmit={(values) => {this.cekEdit(values)}}
                            >
                            {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <>
                                <div className="mainRinci3">
                                    <div className="rightRinci3">
                                        <div>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Area</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled
                                                    type= "text" 
                                                    className="inputRinci"
                                                    value={detFinance.area}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Profit center</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled
                                                    type= "text" 
                                                    className="inputRinci"
                                                    value={detFinance.profit_center}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>GL Name</Col>
                                                <Col md={9} className="colRinci">: 
                                                    <Select
                                                        className="inputRinci2"
                                                        options={this.state.options}
                                                        onChange={this.selectCoa}
                                                        value={{value: this.state.no_coa, label: this.state.nama_coa}}
                                                    />
                                                </Col>
                                            </Row>
                                            {this.state.no_coa === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Jenis Transaksi</Col>
                                                <Col md={9} className="colRinci">: 
                                                    <Select
                                                        // isDisabled={this.state.jenisVendor === '' ? true : false}
                                                        className="inputRinci2"
                                                        value={{value: this.state.idTrans, label: this.state.jenisTrans}}
                                                        options={this.state.transList}
                                                        // placeholder={this.state.jenisTrans}
                                                        onChange={this.selectTrans}
                                                    />
                                                </Col>
                                            </Row>
                                            {this.state.jenisTrans === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            {type_kasbon === 'kasbon' && (
                                                <>
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>Tipe PO</Col>
                                                        <Col md={9} className="colRinci">: 
                                                            <Input
                                                                type= "select" 
                                                                className="inputRinci"
                                                                // disabled={this.state.idTrans === '' ? true : false}
                                                                disabled
                                                                value={values.type_po}
                                                                onBlur={handleBlur('type_po')}
                                                                onChange={handleChange('type_po')}
                                                                >
                                                                    <option value=''>Pilih</option>
                                                                    <option value="po">PO</option>
                                                                    <option value="non po">Non PO</option>
                                                            </Input>
                                                        </Col>
                                                    </Row>
                                                    {values.type_po === '' ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>No PO</Col>
                                                        <Col md={9} className="colRinci">:  <Input
                                                            type= "text" 
                                                            disabled={values.type_po === 'po' ? false : true}
                                                            className="inputRinci"
                                                            value={values.no_po}
                                                            onBlur={handleBlur("no_po")}
                                                            onChange={handleChange('no_po')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {values.type_po === 'po' && values.no_po === '' ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>Nilai PO</Col>
                                                        <Col md={9} className="colRinci">:
                                                            <NumberInput
                                                                disabled={values.type_po === 'po' ? false : true}
                                                                className="inputRinci1"
                                                                value={values.nilai_po}
                                                                onValueChange={val => setFieldValue("nilai_po", val.floatValue)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {values.type_po === 'po' && values.nilai_po === 0 ? (
                                                        <div className='txtError'>must be filled</div>
                                                    ) : null}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>Nilai PR</Col>
                                                        <Col md={9} className="colRinci">:
                                                            <NumberInput
                                                                disabled={values.type_po === 'po' ? false : true}
                                                                className="inputRinci1"
                                                                value={values.nilai_pr}
                                                                onValueChange={val => setFieldValue("nilai_pr", val.floatValue)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {values.type_po === 'po' && values.nilai_pr === 0 ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null}
                                                </>
                                            )}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Jenis Vendor</Col>
                                                <Col md={9} className="colRinci">:  
                                                    {this.state.jenisVendor === nonObject 
                                                    ? <Input
                                                        type= "text" 
                                                        className="inputRinci"
                                                        disabled={this.state.jenisVendor === nonObject ? true : false}
                                                        value={this.state.jenisVendor}
                                                    />
                                                    :   <Input
                                                            type= "select" 
                                                            className="inputRinci"
                                                            disabled={this.state.idTrans === '' ? true : false}
                                                            value={this.state.jenisVendor}
                                                            onChange={e => this.selectJenis(e.target.value)}
                                                            >
                                                                <option value=''>Pilih</option>
                                                                <option value="Orang Pribadi">Orang Pribadi</option>
                                                                <option value="Badan">Badan</option>
                                                        </Input> }
                                                </Col>
                                            </Row>
                                            {this.state.jenisVendor === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Memiliki NPWP</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled={
                                                        this.state.jenisVendor === nonObject && listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? false
                                                        : this.state.jenisVendor === nonObject ? true
                                                        : this.state.jenisVendor === 'Badan' ? true 
                                                        : false
                                                    }
                                                    type= "select" 
                                                    className="inputRinci"
                                                    value={this.state.status_npwp}
                                                    onChange={e => this.selectNpwp(e.target.value)}
                                                    >
                                                        <option value=''>Pilih</option>
                                                        <option value="Ya">Ya</option>
                                                        <option value="Tidak">Tidak</option>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            {/* {this.state.status_npwp === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nomor NPWP</Col>
                                                <Col md={9} className="colRinci">:  
                                                    {/* <Input
                                                    disabled={this.state.status_npwp === 'Ya' ? false : true}
                                                    type= "text" 
                                                    minLength={15}
                                                    maxLength={15}
                                                    className="inputRinci"
                                                    value={this.state.status_npwp === 'Ya' ? values.no_npwp : ''}
                                                    onBlur={handleBlur("no_npwp")}
                                                    onChange={handleChange("no_npwp")}
                                                    /> */}
                                                    <Select
                                                        isDisabled={this.state.status_npwp === 'Ya' ? false : true}
                                                        className="inputRinci2"
                                                        options={this.state.listNpwp}
                                                        onChange={e => this.selectNikNpwp({val: e, type: 'npwp'})}
                                                        onInputChange={e => this.inputNpwp(e)}
                                                        isSearchable
                                                        value={this.state.status_npwp === 'Ya' ? {value: this.state.noNpwp, label: this.state.noNpwp} : { value: '', label: '' }}
                                                    />
                                                </Col>
                                            </Row>
                                            {this.state.status_npwp === 'Ya' && this.state.typeniknpwp === 'manual' && this.state.noNpwp.length <= 15 && this.state.noNpwp.length >= 15  ? (
                                                <text className={style.txtError}>must be filled with 15 digits characters</text>
                                            ) : null}
                                            {/* <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nama Sesuai NPWP</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled={this.state.status_npwp === 'Ya' ? false : true}
                                                    type= "text" 
                                                    className="inputRinci"
                                                    value={this.state.status_npwp === 'Ya' ? values.nama_npwp : ''}
                                                    onBlur={handleBlur("nama_npwp")}
                                                    onChange={handleChange("nama_npwp")}
                                                    />
                                                </Col>
                                            </Row>
                                            {this.state.status_npwp === 'Ya' && values.nama_npwp === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>NIK</Col>
                                                <Col md={9} className="colRinci">:  
                                                    {/* <Input
                                                    disabled={this.state.status_npwp === 'Tidak' ? false : true}
                                                    type= "text" 
                                                    className="inputRinci"
                                                    minLength={16}
                                                    maxLength={16}
                                                    value={this.state.status_npwp === 'Tidak' ? values.no_ktp : ''}
                                                    onBlur={handleBlur("no_ktp")}
                                                    onChange={handleChange("no_ktp")}
                                                    /> */}
                                                    <Select
                                                        isDisabled={this.state.status_npwp === 'Tidak' ? false : true}
                                                        className="inputRinci2"
                                                        options={this.state.listNik}
                                                        onChange={e => this.selectNikNpwp({val: e, type: 'nik'})}
                                                        onInputChange={e => this.inputNik(e)}
                                                        isSearchable
                                                        value={this.state.status_npwp === 'Tidak' ? {value: this.state.noNik, label: this.state.noNik} : { value: '', label: '' }}
                                                    />
                                                </Col>
                                            </Row>
                                            {this.state.status_npwp === 'Tidak' && this.state.typeniknpwp === 'manual' && this.state.noNik.length <= 16 && this.state.noNik.length >= 16 ? (
                                                <text className={style.txtError}>must be filled with 16 digits characters</text>
                                            ) : null}
                                            {/* <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nama Sesuai KTP</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled={this.state.status_npwp === 'Tidak' ? false : true}
                                                    type= "text" 
                                                    className="inputRinci"
                                                    value={this.state.status_npwp === 'Tidak' ? values.nama_ktp : ''}
                                                    onBlur={handleBlur("nama_ktp")}
                                                    onChange={handleChange("nama_ktp")}
                                                    />
                                                </Col>
                                            </Row>
                                            {this.state.status_npwp === 'Tidak' && values.nama_ktp === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nama Vendor/NPWP/KTP</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
                                                    disabled={
                                                        this.state.jenisVendor === nonObject && listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? false
                                                        : this.state.jenisVendor === nonObject ? true
                                                        : false
                                                    }
                                                    className="inputRinci"
                                                    value={this.state.nama}
                                                    // onBlur={handleBlur("nama_vendor")}
                                                    onChange={e => this.inputNama(e.target.value)}
                                                    />
                                                </Col>
                                            </Row>
                                            {/* {errors.nama_vendor ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Alamat Vendor</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    disabled={
                                                        this.state.jenisVendor === nonObject && listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? false
                                                        : this.state.jenisVendor === nonObject ? true
                                                        : false
                                                    }
                                                    value={this.state.alamat}
                                                    // onBlur={handleBlur("alamat_vendor")}
                                                    onChange={e => this.inputAlamat(e.target.value)}
                                                    />
                                                </Col>
                                            </Row>
                                            {/* {errors.alamat_vendor ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Transaksi Ber PPN</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    // disabled={listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? true : false}
                                                    type= "select" 
                                                    className="inputRinci"
                                                    disabled
                                                    value={this.state.tipePpn}
                                                    // value={values.type_transaksi}
                                                    // onBlur={handleBlur("type_transaksi")}
                                                    onChange={e => {this.selectTypePpn(e.target.value)}}
                                                    >
                                                        <option value=''>Pilih</option>
                                                        <option value="Ya">Ya</option>
                                                        <option value="Tidak">Tidak</option>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            {this.state.tipePpn === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No Faktur Pajak</Col>
                                                <Col md={9} className="colRinci">:  
                                                    <Select
                                                        className="inputRinci2"
                                                        isDisabled={this.state.tipePpn === "Ya" ? false : true}
                                                        options={this.state.fakturList}
                                                        onChange={this.selectFaktur}
                                                        // onInputChange={e => this.inputFaktur(e)}
                                                        // isSearchable
                                                        value={{value: this.state.dataSelFaktur.no_faktur, label: this.state.dataSelFaktur.no_faktur}}
                                                    />
                                                    {/* <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    disabled={this.state.tipePpn === "Ya" ? false : true}
                                                    value={this.state.tipePpn === 'Ya' ? values.no_faktur : ''}
                                                    onBlur={handleBlur("no_faktur")}
                                                    onChange={handleChange("no_faktur")}
                                                    /> */}
                                                </Col>
                                            </Row>
                                            {errors.no_faktur ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Tgl Faktur</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
                                                    disabled={
                                                        this.state.fakturList.length > 0 ? true
                                                        // : this.state.tipePpn === "Ya" ? false 
                                                        : true
                                                    }
                                                    className="inputRinci"
                                                    value={moment(this.state.tgl_faktur).format('DD MMMM YYYY')}
                                                    // value={values.dpp}
                                                    // onBlur={handleBlur("dpp")}
                                                    // onChange={handleChange("dpp")}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>DPP</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
                                                    disabled
                                                    className="inputRinci"
                                                    onChange={e => this.enterDPP(e.target.value)}
                                                    value={this.state.nilai_dpp}
                                                    // value={values.dpp}
                                                    // onBlur={handleBlur("dpp")}
                                                    // onChange={handleChange("dpp")}
                                                    />
                                                </Col>
                                            </Row>
                                            {errors.dpp ? (
                                                <text className={style.txtError}>must be filled with number</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>PPN</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
                                                    // disabled={
                                                    //     this.state.fakturList.length > 0 ? true
                                                    //     : this.state.tipePpn === "Ya" ? false 
                                                    //     : true
                                                    // }
                                                    disabled
                                                    className="inputRinci"
                                                    onChange={e => this.enterPPN(e.target.value)}
                                                    value={this.state.nilai_ppn}
                                                    // value={values.ppn}
                                                    // onBlur={handleBlur("ppn")}
                                                    // onChange={handleChange("ppn")}
                                                    />
                                                </Col>
                                            </Row>
                                            {errors.ppn ? (
                                                <text className={style.txtError}>must be filled with number</text>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="rightRinci3">
                                        <div>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Penanggung Pajak</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled={
                                                        listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? true
                                                        : this.state.idTrans === '' ? true 
                                                        : this.state.tipePpn === "Ya" ? true
                                                        : false
                                                    }
                                                    type= "select" 
                                                    className="inputRinci"
                                                    value={this.state.tipeVendor}
                                                    // value={values.penanggung_pajak}
                                                    // onBlur={handleBlur("penanggung_pajak")}
                                                    onChange={e => {this.selectTipe(e.target.value)}}
                                                    >
                                                        <option value=''>Pilih</option>
                                                        <option value="PMA">PMA</option>
                                                        <option value="Vendor">Vendor</option>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            {this.state.tipeVendor === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Yang Diajukan</Col>
                                                <Col md={9} className="colRinci">:  <NumberInput
                                                    // disabled={
                                                    //     type_kasbon === 'kasbon' && this.state.idTrans !== '' ? false
                                                    //     : this.state.idTrans === '' ? true 
                                                    //     : this.state.tipePpn === "Ya" || this.state.tipePpn === "" ? true
                                                    //     : false
                                                    // }
                                                    disabled
                                                    className="inputRinci1"
                                                    value={this.state.nilai_ajuan}
                                                    onValueChange={val => this.onEnterVal(val.floatValue)}
                                                />
                                                </Col>
                                            </Row>
                                            {this.state.nilai_ajuan === 0 && this.state.tipePpn === "Tidak" ? (
                                                <text className={style.txtError}>must be filled with number</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Yang Dibukukan</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    disabled
                                                    value={parseInt(this.state.nilai_buku).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Jenis PPh</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    disabled
                                                    value={dataTrans.jenis_pph}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Utang PPh</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    disabled
                                                    value={parseInt(this.state.nilai_utang).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Tgl Invoice</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "date" 
                                                    className="inputRinci"
                                                    value={moment(values.tgl_tagihanbayar).format('YYYY-MM-DD')}
                                                    onBlur={handleBlur("tgl_tagihanbayar")}
                                                    onChange={handleChange("tgl_tagihanbayar")}
                                                    />
                                                </Col>
                                            </Row>
                                            {errors.tgl_tagihanbayar ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Keterangan Tambahan</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    value={values.keterangan}
                                                    onBlur={handleBlur("keterangan")}
                                                    onChange={handleChange("keterangan")}
                                                    />
                                                </Col>
                                            </Row>
                                            {errors.keterangan ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Yang Dibayarkan</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    disabled
                                                    value={parseInt(this.state.nilai_vendor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Periode</Col>
                                                <Col md={9} className="colRinci">: 
                                                    <Input
                                                    type= "date" 
                                                    className="inputRinci"
                                                    value={moment(values.periode_awal).format('YYYY-MM-DD')}
                                                    onBlur={handleBlur("periode_awal")}
                                                    onChange={handleChange("periode_awal")}
                                                    />
                                                    <text className='mr-1 ml-1'>To</text>
                                                    <Input
                                                    type= "date" 
                                                    className="inputRinci"
                                                    value={moment(values.periode_akhir).format('YYYY-MM-DD')}
                                                    onBlur={handleBlur("periode_akhir")}
                                                    onChange={handleChange("periode_akhir")}
                                                    />
                                                </Col>
                                            </Row>
                                            {errors.periode_awal || errors.periode_akhir ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : values.periode_awal > values.periode_akhir ? (
                                                <text className={style.txtError}>Pastikan periode diisi dengan benar</text>
                                            ) : null }
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Tujuan Transfer</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled={level === '5' || level === '6' ? false : true}
                                                    type= "select" 
                                                    className="inputRinci"
                                                    value={this.state.tujuan_tf}
                                                    onChange={e => this.selectTujuan(e.target.value)}
                                                    >
                                                        <option value=''>Pilih</option>
                                                        <option value="PMA">PMA</option>
                                                        <option value="Outlet">Outlet</option>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            {this.state.tujuan_tf === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Atas Nama</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled={this.state.tujuan_tf === '' || this.state.tujuan_tf === 'PMA' ? true : false}
                                                    type= "text" 
                                                    className="inputRinci"
                                                    value={this.state.tujuan_tf === 'PMA' ? `PMA-${detFinance.area}` : values.nama_tujuan}
                                                    onBlur={handleBlur("nama_tujuan")}
                                                    onChange={handleChange("nama_tujuan")}
                                                    />
                                                </Col>
                                            </Row>
                                            {values.nama_tujuan === '' && this.state.tujuan_tf !== 'PMA' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Bank</Col>
                                                <Col md={9} className="colRinci">: 
                                                {this.state.tujuan_tf === 'PMA' ? (
                                                    <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    value={this.state.bank}
                                                    disabled
                                                    />
                                                ) : (
                                                    <Select
                                                    isDisabled={this.state.tujuan_tf === '' && true}
                                                    className="inputRinci2"
                                                    options={this.state.bankList}
                                                    onChange={this.selectBank}
                                                    />
                                                )}
                                                </Col>
                                            </Row>
                                            {this.state.bank === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nomor Rekening</Col>
                                                <Col md={9} className="colRinci">:  
                                                {this.state.tujuan_tf === 'PMA' ? (
                                                    <Select
                                                        className="inputRinci2"
                                                        options={this.state.rekList}
                                                        onChange={this.selectRek}
                                                        value={{label: this.state.norek, value: this.state.tiperek}}
                                                    />
                                                ) : (
                                                    <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    disabled={this.state.digit === 0 ? true : false}
                                                    minLength={this.state.digit}
                                                    maxLength={this.state.digit}
                                                    value={values.norek_ajuan}
                                                    onBlur={handleBlur("norek_ajuan")}
                                                    onChange={handleChange("norek_ajuan")}
                                                    />
                                                )}
                                                </Col>
                                            </Row>
                                            {(errors.norek_ajuan || values.norek_ajuan.length !== this.state.digit) && this.state.tujuan_tf !== 'PMA'? (
                                                <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                            ) : this.state.tujuan_tf === 'PMA' && this.state.norek.length !== this.state.digit ? (
                                                <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="modalFoot mt-3">
                                    <div></div>
                                    <div className='btnfoot'>
                                        <Button 
                                            className="mr-3" 
                                            size="md" 
                                            disabled={this.state.no_coa === '' ? true 
                                            // : values.status_npwp === 'Ya' && values.no_npwp === '' ? true 
                                            // : values.status_npwp === 'Tidak' &&  values.no_ktp === '' ? true 
                                            // : values.norek_ajuan.length < this.state.digit ? true 
                                            : this.state.tujuan_tf === '' ? true
                                            : false } 
                                            color="primary" 
                                            onClick={handleSubmit}>
                                            Save
                                        </Button>
                                        <Button className="" size="md" color="secondary" onClick={() => this.openEdit()}>Close</Button>
                                    </div>
                                </div>
                            </>
                            )}
                            </Formik>
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
    dokumen: state.dokumen,
    email: state.email,
    vendor: state.vendor,
    bank: state.bank,
    pagu: state.pagu,
    faktur: state.faktur,
    rekening: state.rekening,
    coa: state.coa,
    finance: state.finance
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNameApprove: approve.getNameApprove,
    getDetailFinance: finance.getDetailFinance,
    getDepo: depo.getDepo,
    getRole: user.getRole,
    getOps: ops.getOps,
    getDetail: ops.getDetail,
    getApproval: ops.getApproval,
    getDocOps: ops.getDocCart,
    submitRealisasi: ops.submitRealisasi,
    getAllMenu: menu.getAllMenu,
    getReason: reason.getReason,
    rejectOps: ops.rejectOps,
    resetOps: ops.resetOps,
    showDokumen: dokumen.showDokumen,
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    approveDokumen: dokumen.approveDokumen,
    rejectDokumen: dokumen.rejectDokumen,
    getFinRek: finance.getFinRek,
    getPagu: pagu.getPagu,
    getVendor: vendor.getVendor,
    getFaktur: faktur.getFaktur,
    getBank: bank.getBank,
    getDetailId: ops.getDetailId,
    getCoa: coa.getCoa,
    submitRevisi: ops.submitRevisi,
    // notifStock: notif.notifStock
}

export default connect(mapStateToProps, mapDispatchToProps)(Kasbon)
