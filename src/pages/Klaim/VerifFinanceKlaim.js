/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {VscAccount} from 'react-icons/vsc'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import approve from '../../redux/actions/approve'
import {BsCircle} from 'react-icons/bs'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList} from 'react-icons/fa'
import Sidebar from "../../components/Header";
import { AiOutlineFileExcel, AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
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
import notif from '../../redux/actions/notif'
import spvklaim from '../../redux/actions/spvklaim'

import Pdf from "../../components/Pdf"
import depo from '../../redux/actions/depo'
import {default as axios} from 'axios'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import klaim from '../../redux/actions/klaim'
import Tracking from '../../components/Klaim/tracking'
import dokumen from '../../redux/actions/dokumen'
import email from '../../redux/actions/email'
import Email from '../../components/Klaim/Email'
import ExcelJS from "exceljs"
import fs from "file-saver"
import NumberInput from '../../components/NumberInput'
const {REACT_APP_BACKEND_URL} = process.env
const accKlaim = ['3', '13', '23']

const klaimSchema = Yup.object().shape({
    pa: Yup.number().required('must be filled'),
    ppu: Yup.number().required('must be filled'),
    nominal: Yup.number().required('must be filled'),
    kode_vendor: Yup.string().required('must be filled')
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});


class VerifKlaim extends Component {
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
            formDis: false,
            history: false,
            upload: false,
            docHist: false,
            detailDoc: {},
            openDraft: false,
            message: '',
            subject: '',
            time: 'pilih',
            time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            tipeEmail: '',
            dataRej: {},
            listKlaim: []
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
            menu: listMenu.toString(),
            type: "verif"
        }
        await this.props.rejectKlaim(token, data)
        this.dataSendEmail('reject')
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
        let total = 0
        for (let i = 0; i < detailKlaim.length; i++) {
            total += parseInt(detailKlaim[i].nilai_ajuan)
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

    async componentDidMount () {
        // const level = localStorage.getItem('level')
        const token = localStorage.getItem('token')
        await this.props.getSpvklaim(token)
        this.getDataKlaim()
    }

    componentDidUpdate() {
        const { isApprove, isReject, subVerif, uploadKlaim } = this.props.klaim
        if (subVerif === false) {
            this.setState({confirm: 'rejSubmit'})
            this.openConfirm()
            this.openModalApprove()
            this.props.resetKlaim()
        } else if (uploadKlaim === false) {
            this.setState({confirm: 'rejUpload'})
            this.openConfirm()
            this.openModalUpload()
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
        this.setState({limit: value === undefined ? 10 : value.limit})
        this.changeFilter('available')
    }

    getDataList = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 400, '', 1)
    }

    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload, fileUpload: ''})
    }

    prosesDetail = async (val) => {
        const token = localStorage.getItem("token")
        const tempno = {
            no: val.no_transaksi
        }
        const data = {
            no: val.no_transaksi,
            name: 'Draft Pengajuan Klaim'
        }
        this.setState({listMut: []})
        await this.props.getDetail(token, tempno)
        await this.props.getApproval(token, tempno)
        await this.props.getDocKlaim(token, data)
        this.openModalRinci()
    }

    cekDataDoc = () => {
        const { dataDoc } = this.props.klaim
        const level = localStorage.getItem("level")
        // if (level === '3') {
        //     this.openModalApprove()
        // } else {
        const tempdoc = []
        const arrDoc = []
        for (let i = 0; i < dataDoc.length; i++) {
            if (dataDoc[i].path !== null) {
                const arr = dataDoc[i]
                const stat = arr.status
                const cekLevel = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[0] : ''
                const cekStat = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[1] : ''
                if (cekLevel === ` level ${level}` && cekStat === ` status approve`) {
                    tempdoc.push(arr)
                    arrDoc.push(arr)
                } else {
                    arrDoc.push(arr)
                }
            }
        }
        if (tempdoc.length === arrDoc.length) {
            this.cekDataKlaim()
        } else {
            this.setState({confirm: 'appNotifDoc'})
            this.openConfirm()
        }
        // }
    }

    cekDataKlaim = () => {
        const { detailKlaim } = this.props.klaim
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailKlaim[0].no_transaksi
        }
        if (level === '3' || level === '13') {
            const cek = []
            detailKlaim.map(item => {
                return ((item.ppu !== null && item.pa !== null && item.nominal !== null && item.kode_vendor !== null) && cek.push(item))
            })
            if (cek.length === detailKlaim.length) {
                this.openModalApprove()
            } else {
                this.setState({confirm: 'rejSubmit'})
                this.openConfirm()
            }
        } else {
            this.openModalApprove()
        }
    }

    openModalDok = () => {
        this.setState({opendok: !this.state.opendok})
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

    prosesEditKlaim = async (val) => {
        const token = localStorage.getItem("token")
        const {dataRinci} = this.state
        const data = {
            ppu: val.ppu,
            pa: val.pa,
            nominal: val.nominal,
            kode_vendor: val.kode_vendor
        }
        const tempno = {
            no: dataRinci.no_transaksi,
            id: dataRinci.id
        }
        await this.props.editVerif(token, dataRinci.id, data)
        await this.props.getDetail(token, tempno)
        this.setState({confirm: 'approve'})
        this.openConfirm()
        this.openModalEdit()
    }

    changeFilter = async (val) => {
        const {dataKlaim, noDis} = this.props.klaim
        const {time1, time2} = this.state
        const type = localStorage.getItem('tipeKasbon')
        const level = localStorage.getItem('level')
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = level === '2' ? 3 : 4
        const statusAll = 'all'
        const role = localStorage.getItem('role')
        if (val === 'available') {
            const newKlaim = []
            await this.props.getKlaim(token, status, 'all', 'all', val, 'verif', 'undefined', cekTime1, cekTime2)
            this.setState({filter: val, newKlaim: newKlaim})
        } else if (val === 'reject') {
            const newKlaim = []
            await this.props.getKlaim(token, status, 'all', 'all', val, 'verif', 'undefined', cekTime1, cekTime2)
            this.setState({filter: val, newKlaim: newKlaim})
        } else if (val === 'revisi') {
            const newKlaim = []
            await this.props.getKlaim(token, status, 'all', 'all', val, 'verif', 'undefined', cekTime1, cekTime2)
            this.setState({filter: val, newKlaim: newKlaim})
        } else {
            const newKlaim = []
            await this.props.getKlaim(token, statusAll, 'all', 'all', val, 'verif', status, cekTime1, cekTime2)
            this.setState({filter: val, newKlaim: newKlaim})
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
        const {time1, time2, filter} = this.state
        const level = localStorage.getItem('level')
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = filter === 'all' ? 'all' : level === '2' ? 3 : 4
        await this.props.getKlaim(token, status, 'all', 'all', filter, 'verif', 'undefined', cekTime1, cekTime2)
    }

    prosesSubmitPre = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAssetAll(token, 1000, '', 1, 'asset')
        this.modalSubmitPre()
    }

    approveDataKlaim = async () => {
        const { detailKlaim } = this.props.klaim
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailKlaim[0].no_transaksi
        }
        if (level === '3' || level === '13') {
            const cek = []
            detailKlaim.map(item => {
                return ((item.ppu !== null && item.pa !== null && item.nominal !== null && item.kode_vendor !== null) && cek.push(item))
            })
            if (cek.length === detailKlaim.length) {
                await this.props.submitVerif(token, tempno)
                this.dataSendEmail()
            } else {
                this.setState({confirm: 'rejSubmit'})
                this.openConfirm()
                this.openModalApprove()
            }
        } else {
            await this.props.submitVerif(token, tempno)
            this.dataSendEmail()
        }
    }

    dataSendEmail = async (val) => {
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const { detailKlaim } = this.props.klaim
        const { draftEmail } = this.props.email
        const { message, subject } = this.state
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        const tipeProses = val === 'reject' ? 'reject perbaikan' : level === '3' || level === '13' ? 'approve' : 'verifikasi'
        const tipeRoute = val === 'reject' ? 'revklm' : level === '3' || level === '13'  ? 'listklm' : 'veriffinklm'
        const tipeMenu = level === '3' || level === '13' ? 'list ajuan bayar' : 'verifikasi klaim'
        const tempno = {
            draft: draftEmail,
            nameTo: draftEmail.to.username,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: detailKlaim[0].no_transaksi,
            tipe: 'klaim',
            menu: tipeMenu,
            proses: tipeProses,
            route: tipeRoute
        }
        await this.props.sendEmail(token, tempno)
        await this.props.addNotif(token, tempno)
        if (val === 'reject') {
            this.getDataKlaim()
            this.setState({confirm: 'reject'})
            this.openConfirm()
            this.openDraftEmail()
            this.openModalReject()
            this.openModalRinci()
        } else {
            this.getDataKlaim()
            this.setState({confirm: 'submit'})
            this.openConfirm()
            this.openDraftEmail()
            this.openModalApprove()
            this.openModalRinci()
        }
    }

    prepSendEmail = async () => {
        const { detailKlaim } = this.props.klaim
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const app = detailKlaim[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'submit'
        const cekMenu = level === '2' ? 'Verifikasi Finance (Klaim)' : 'Verifikasi Klaim (Klaim)'
        const tempno = {
            no: detailKlaim[0].no_transaksi,
            kode: detailKlaim[0].kode_plant,
            jenis: 'klaim',
            tipe: tipe,
            menu: cekMenu 
        }
        await this.props.getDraftEmail(token, tempno)
        this.setState({tipeEmail: 'app'})
        this.openDraftEmail()
    }

    prepReject = async (val) => {
        const { detailKlaim } = this.props.klaim
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const app = detailKlaim[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'reject'
        const cekMenu = level === '2' ? 'Verifikasi Finance (Klaim)' : 'Verifikasi Klaim (Klaim)'
        const tempno = {
            no: detailKlaim[0].no_transaksi,
            kode: detailKlaim[0].kode_plant,
            jenis: 'klaim',
            tipe: tipe,
            menu: cekMenu 
        }
        await this.props.getDraftEmail(token, tempno)
        this.setState({tipeEmail: 'reject'})
        this.setState({dataRej: val})
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    getMessage = (val) => {
        this.setState({message: val.message, subject: val.subject})
    }

    onSearch = async (e) => {
        const {time1, time2, filter} = this.state
        const level = localStorage.getItem('level')
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = filter === 'all' ? 'all' : level === '2' ? 3 : 4
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            await this.props.getKlaim(token, status, 'all', 'all', filter, 'verif', 'undefined', cekTime1, cekTime2, e.target.value)
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

    docHistory = (val) => {
        this.setState({detailDoc: val})
        this.setState({docHist: !this.state.docHist})
        console.log(val.status)
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    openProsesModalDoc = async (val) => {
        const token = localStorage.getItem("token")
        const tempno = {
            no: val.no_transaksi,
            name: 'Draft Pengajuan Klaim'
        }
        await this.props.getDocKlaim(token, tempno)
        this.openModalDoc()
    }

    openModalDoc = () => {
        this.setState({modalDoc: !this.state.modalDoc})
    }

    approveDoc = async () => {
        const token = localStorage.getItem('token')
        const {idDoc} = this.state
        const { detailKlaim } = this.props.klaim
        const tempno = {
            no: detailKlaim[0].no_transaksi,
            name: 'Draft Pengajuan Klaim'
        }
        await this.props.approveDokumen(token, idDoc)
        await this.props.getDocKlaim(token, tempno)
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
        const { detailKlaim } = this.props.klaim
        const tempno = {
            no: detailKlaim[0].no_transaksi,
            name: 'Draft Pengajuan Klaim'
        }
        await this.props.rejectDokumen(token, idDoc)
        await this.props.getDocKlaim(token, tempno)
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
        this.setState({dataRinci: val, bank: val.bank_tujuan})
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

    chekKlApp = (val) => {
        const { listKlaim } = this.state
        const {newKlaim} = this.props.klaim
        if (val === 'all') {
            const data = []
            for (let i = 0; i < newKlaim.length; i++) {
                data.push(newKlaim[i].id)
            }
            this.setState({listKlaim: data})
        } else {
            listKlaim.push(val)
            this.setState({listKlaim: listKlaim})
        }
    }

    chekKlRej = (val) => {
        const {listKlaim} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listKlaim: data})
        } else {
            const data = []
            for (let i = 0; i < listKlaim.length; i++) {
                if (listKlaim[i] === val) {
                    data.push()
                } else {
                    data.push(listKlaim[i])
                }
            }
            this.setState({listKlaim: data})
        }
    }
    prepareReject = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAllMenu(token, 'reject', 'Klaim')
        await this.props.getReason(token)
        const dataMenu = this.props.menu.dataAll
        const data = []
        dataMenu.map(item => {
            return (item.kode_menu === 'Klaim' && data.push(item))
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

    downloadAjuan = () => {
        const {listKlaim} = this.state
        const {newKlaim} = this.props.klaim
        const dataDownload = []

        if (newKlaim.length === 0 || listKlaim.length === 0) {
            this.setState({confirm: 'rejDownload'})
            this.openConfirm()
        } else {
            for (let i = 0; i < listKlaim.length; i++) {
                for (let j = 0; j < newKlaim.length; j++) {
                    if (newKlaim[j].id === listKlaim[i]) {
                        dataDownload.push(newKlaim[j])
                    }
                }
            }
    
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
                {header: 'NO AJUAN', key: 'c2'},
                {header: 'PPU', key: 'c3'},
                {header: 'PA', key: 'c4'},
                {header: 'KODE VENDOR', key: 'c5'},
                {header: 'NOMINAL VERIFIKASI', key: 'c6'},
                {header: 'NO COA', key: 'c7'},
                {header: 'NAMA COA', key: 'c8'},
                {header: 'TGL AJUAN', key: 'c9'},
                {header: 'NILAI YANG DIAJUKAN', key: 'c10'},
                {header: 'DN AREA', key: 'c11'}
            ]
    
            dataDownload.map((item, index) => { return ( ws.addRow(
                {
                    c2: item.no_transaksi,
                    c3: item.ppu,
                    c4: item.pa,
                    c5: item.kode_vendor,
                    c6: item.nominal,
                    c7: item.no_coa,
                    c8: item.nama_coa,
                    c9: moment(item.start_klaim).format('DD MMMM YYYY'),
                    c10: item.nilai_ajuan,
                    c11: item.dn_area
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
                  `Data Upload Ajuan Klaim ${moment().format('DD MMMM YYYY')}.xlsx`
                )
            })
        }
    }

    uploadAjuan = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        await this.props.uploadDataKlaim(token, data)

        const {messUpload} = this.props.klaim
        if (messUpload.length > 0) {
            this.setState({confirm: 'failUpload'})
            this.openConfirm()
            this.openModalUpload()
        } else {
            this.setState({confirm: 'upload'})
            this.openConfirm()
            this.getDataKlaim()
            this.openModalUpload()
        }
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('fullname')
        const {dataRinci, listKlaim, tipeEmail, listMut, drop, listReason, dataMenu, listMenu, detailDoc} = this.state
        const {dataSpvklaim} = this.props.spvklaim
        const { detailDepo, dataDepo } = this.props.depo
        const { dataReason } = this.props.reason
        const { noDis, detailKlaim, ttdKlaim, dataDoc, newKlaim, messUpload } = this.props.klaim
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
                                <div className={style.titleDashboard}>Verifikasi {level === '2' ? 'Finance' : "Klaim"}</div>
                            </div>
                            <div className={style.secEmail4}>
                                {accKlaim.find(item => item.toString() === level) !== undefined ? (
                                    <div className='rowCenter'>
                                        <Button className='mr-1' onClick={this.openModalUpload} color="warning" size="lg">Upload Ajuan</Button>
                                        <Button className='mr-1' onClick={this.downloadAjuan} color="success" size="lg">Download Ajuan</Button>
                                    </div>
                                ) : <div></ div>}
                                <div className={style.searchEmail2}>
                                    <text>Filter:  </text>
                                    <Input className={style.filter} type="select" value={this.state.filter} onChange={e => this.changeFilter(e.target.value)}>
                                        <option value="all">All</option>
                                        <option value="reject">Reject</option>
                                        <option value="available">Available Submit</option>
                                        {/* <option value="revisi">Available Reapprove (Revisi)</option> */}
                                    </Input>
                                </div>
                            </div>
                            <div className={[style.secEmail4]}>
                                <div className='rowCenter'>
                                    <Input className={style.filter3} type="select" value={this.state.time} onChange={e => this.changeTime(e.target.value)}>
                                        <option value="all">Time (All)</option>
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
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab} id="table-klaim">
                                        <thead>
                                            <tr>
                                                {accKlaim.find(item => item.toString() === level) !== undefined && (
                                                    <th>
                                                        <input  
                                                        className='mr-2'
                                                        type='checkbox'
                                                        checked={listKlaim.length === 0 ? false : listKlaim.length === newKlaim.length ? true : false}
                                                        onChange={() => listKlaim.length === newKlaim.length ? this.chekKlRej('all') : this.chekKlApp('all')}
                                                        />
                                                        {/* Select */}
                                                    </th>
                                                )}
                                                <th>No</th>
                                                <th>NO.AJUAN</th>
                                                <th>COST CENTRE</th>
                                                <th>AREA</th>
                                                <th>NO.COA</th>
                                                <th>NAMA COA</th>
                                                <th>KETERANGAN TAMBAHAN</th>
                                                <th>TGL AJUAN</th>
                                                <th>STATUS</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        {accKlaim.find(x => x.toString() === level) !== undefined ? (
                                            <tbody>
                                                {newKlaim.map(item => {
                                                    return (
                                                        level ===  '3' ? (
                                                            item.picklaim !== null && 
                                                            // Object.values(item.picklaim).find(item => item.toLowerCase() === names.toLowerCase()) !== undefined && 
                                                            item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase() !== undefined &&
                                                            item.picklaim[Object.keys(item.picklaim).find(x => x.toLowerCase() === item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase())].toLowerCase() === names.toLowerCase() &&
                                                            (
                                                                <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                                    <th>
                                                                        <input 
                                                                        type='checkbox'
                                                                        checked={listKlaim.find(element => element === item.id) !== undefined ? true : false}
                                                                        onChange={listKlaim.find(element => element === item.id) === undefined ? () => this.chekKlApp(item.id) : () => this.chekKlRej(item.id)}
                                                                        />
                                                                    </th>
                                                                    <th>{newKlaim.indexOf(item) + 1}</th>
                                                                    <th>{item.no_transaksi}</th>
                                                                    <th>{item.cost_center}</th>
                                                                    <th>{item.area}</th>
                                                                    <th>{item.no_coa}</th>
                                                                    <th>{item.nama_coa}</th>
                                                                    <th>{item.keterangan}</th>
                                                                    <th>{moment(item.start_klaim).format('DD MMMM YYYY')}</th>
                                                                    <th>{item.history.split(',').reverse()[0]}</th>
                                                                    <th>
                                                                        <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>
                                                                            {this.state.filter !== 'available' && this.state.filter !== 'revisi' ? 'Detail' : 'Proses'}
                                                                        </Button>
                                                                        <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                                    </th>
                                                                </tr>
                                                            )
                                                        ) : level ===  '23' ? (
                                                            item.picklaim !== null && 
                                                            // Object.values(item.picklaim).find(item => item.toLowerCase() === names.toLowerCase()) !== undefined && 
                                                            item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase() !== undefined &&
                                                            dataSpvklaim.find(({pic_klaim}) => pic_klaim.toLowerCase() === item.picklaim[Object.keys(item.picklaim).find(x => x.toLowerCase() === item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase())].toLowerCase()) !== undefined
                                                            && dataSpvklaim.find(({pic_klaim}) => pic_klaim.toLowerCase() === item.picklaim[Object.keys(item.picklaim).find(x => x.toLowerCase() === item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase())].toLowerCase()).spv_klaim.toLowerCase() === names.toLowerCase()
                                                            && 
                                                            (
                                                                <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                                    <th>
                                                                        <input 
                                                                        type='checkbox'
                                                                        checked={listKlaim.find(element => element === item.id) !== undefined ? true : false}
                                                                        onChange={listKlaim.find(element => element === item.id) === undefined ? () => this.chekKlApp(item.id) : () => this.chekKlRej(item.id)}
                                                                        />
                                                                    </th>
                                                                    <th>{newKlaim.indexOf(item) + 1}</th>
                                                                    <th>{item.no_transaksi}</th>
                                                                    <th>{item.cost_center}</th>
                                                                    <th>{item.area}</th>
                                                                    <th>{item.no_coa}</th>
                                                                    <th>{item.nama_coa}</th>
                                                                    <th>{item.keterangan}</th>
                                                                    <th>{moment(item.start_klaim).format('DD MMMM YYYY')}</th>
                                                                    <th>{item.history.split(',').reverse()[0]}</th>
                                                                    <th>
                                                                        <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>
                                                                            {this.state.filter !== 'available' && this.state.filter !== 'revisi' ? 'Detail' : 'Proses'}
                                                                        </Button>
                                                                        <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                                    </th>
                                                                </tr>
                                                            )
                                                        ) : (
                                                            <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                                    <th>
                                                                        <input 
                                                                        type='checkbox'
                                                                        checked={listKlaim.find(element => element === item.id) !== undefined ? true : false}
                                                                        onChange={listKlaim.find(element => element === item.id) === undefined ? () => this.chekKlApp(item.id) : () => this.chekKlRej(item.id)}
                                                                        />
                                                                    </th>
                                                                    <th>{newKlaim.indexOf(item) + 1}</th>
                                                                    <th>{item.no_transaksi}</th>
                                                                    <th>{item.cost_center}</th>
                                                                    <th>{item.area}</th>
                                                                    <th>{item.no_coa}</th>
                                                                    <th>{item.nama_coa}</th>
                                                                    <th>{item.keterangan}</th>
                                                                    <th>{moment(item.start_klaim).format('DD MMMM YYYY')}</th>
                                                                    <th>{item.history.split(',').reverse()[0]}</th>
                                                                    <th>
                                                                        <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>
                                                                            {this.state.filter !== 'available' && this.state.filter !== 'revisi' ? 'Detail' : 'Proses'}
                                                                        </Button>
                                                                        <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                                    </th>
                                                                </tr>
                                                        )
                                                        // : (
                                                        //     <div>
                                                        //         <div>{item.picklaim[Object.keys(item.picklaim).find(x => x.toLowerCase() === item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase())].toLowerCase()}</div>
                                                        //         <div>{names.toLowerCase()}</div>
                                                        //         <div>{item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase()}</div>
                                                        //     </div>
                                                        // )
                                                    )
                                                })}
                                            </tbody>
                                        ) : (
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
                                                            <th>{item.history.split(',').reverse()[0]}</th>
                                                            <th>
                                                                <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>
                                                                    {this.state.filter !== 'available' && this.state.filter !== 'revisi' ? 'Detail' : 'Proses'}
                                                                </Button>
                                                                <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                            </th>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        )}
                                        
                                    </Table>
                                    {newKlaim.length === 0 && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
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
                <Modal isOpen={this.state.modalRinci} className='modalrinci'  toggle={this.openModalRinci} size="xl">
                    <ModalBody>
                        <div>
                            {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                            {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailKlaim.length > 0 ? detailKlaim[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailKlaim.length > 0 ? detailKlaim[0].no_transaksi : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailKlaim.length > 0 ? moment(detailKlaim[0].start_klaim).format('DD MMMM YYYY') : ''} /></Col>
                            </Row>
                        </div>
                        <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr className='tbklaim'>
                                        <th>
                                            <input  
                                            className='mr-2'
                                            type='checkbox'
                                            checked={listMut.length === 0 ? false : listMut.length === detailKlaim.length ? true : false}
                                            onChange={() => listMut.length === detailKlaim.length ? this.chekRej('all') : this.chekApp('all')}
                                            />
                                            Select
                                        </th>
                                        {level === '2' ? (<></>) : (
                                            <th>OPSI</th>
                                        )}
                                        <th>NO</th>
                                        <th>COST CENTRE</th>
                                        <th>NO COA</th>
                                        <th>NAMA COA</th>
                                        <th>DN Area</th>
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
                                        <th>NIK</th>
                                        <th>PPU</th>
                                        <th>PA</th>
                                        <th>NOMINAL VERIFIKASi</th>
                                        <th>NILAI YANG DIBAYARKAN</th>
                                        <th>TANGGAL TRANSFER</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailKlaim.length !== 0 && detailKlaim.map(item => {
                                        return (
                                            <tr>
                                                <th>
                                                    <input 
                                                    type='checkbox'
                                                    checked={listMut.find(element => element === item.id) !== undefined ? true : false}
                                                    onChange={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                    />
                                                </th>
                                                {level === '2' ? (<></>) : (
                                                <th>
                                                    <Button className='mt-2' color="info" size='sm' onClick={() => this.getRincian(item)}>Proses</Button>
                                                </th>
                                                )}
                                                <th scope="row">{detailKlaim.indexOf(item) + 1}</th>
                                                <th>{item.cost_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.dn_area}</th>
                                                <th>{item.keterangan}</th>
                                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.status_npwp === 0 ? 'Tidak' : 'Ya'}</th>
                                                <th>{item.status_npwp === 0 ? '-' : item.nama_npwp}</th>
                                                <th>{item.status_npwp === 0 ? '-' : item.no_npwp}</th>
                                                <th>{item.status_npwp === 0 ? item.nama_ktp : '-'}</th>
                                                <th>{item.status_npwp === 0 ? item.no_ktp : '-'}</th>
                                                <th>{item.ppu}</th>
                                                <th>{item.pa}</th>
                                                <th>{item.nominal}</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
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
                            <Button color="primary"  onClick={() => this.openProsesModalDoc(detailKlaim[0])}>Dokumen</Button>
                        </div>
                        <div className="btnFoot">
                            {this.state.filter !== 'available' && this.state.filter !== 'revisi' ? (
                                <div></div>
                            ) : (
                                <>
                                    <Button className="mr-2" disabled={this.state.filter === 'revisi'  && listMut.length > 0 ? false : this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false} color="danger" onClick={this.prepareReject}>
                                        Reject
                                    </Button>
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
                        <div>
                            {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                            {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailKlaim.length > 0 ? detailKlaim[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailKlaim.length > 0 ? detailKlaim[0].no_transaksi : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailKlaim.length > 0 ? moment(detailKlaim[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailKlaim.length !== 0 && detailKlaim.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{detailKlaim.indexOf(item) + 1}</th>
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
                                                    {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.map(item => {
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
                                                {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.map(item => {
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
                                                    {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length === 0 ? (
                                                        <th className="headPre">
                                                            <div className="mb-2">-</div>
                                                            <div>-</div>
                                                        </th>
                                                    ) : ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.map(item => {
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
                                                    {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length === 0 ? (
                                                        <td className="footPre">-</td>
                                                    ) : ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.map(item => {
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
                                                    {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.map(item => {
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
                                                    {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.map(item => {
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
                                                    {ttdKlaim.mengetahui !== undefined && ttdKlaim.mengetahui.map(item => {
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
                                                    {ttdKlaim.mengetahui !== undefined && ttdKlaim.mengetahui.map(item => {
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
                            <div className='fpdTit'>cabang/depo : {detailKlaim.length > 0 ? detailKlaim[0].area : ''}</div>
                            <div className='fpdTit'>no : {detailKlaim.length > 0 ? detailKlaim[0].no_transaksi : ''}</div>
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
                            {detailKlaim.length !== 0 && detailKlaim.map(item => {
                                return (
                                    <Row className='mt-4'>
                                        <Col md={1} className='upper'>
                                            <div className='line'>{detailKlaim.indexOf(item) + 1}</div>
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
                        <div className='bold'>{detailKlaim.length > 0 ? detailKlaim[0].area : ''}, {moment(detailKlaim.length > 0 ? moment(detailKlaim[0].updatedAt).format('DD MMMM YYYY') : '').format('DD MMMM YYYY')}</div>
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
                                                    {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.map(item => {
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
                                                {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.map(item => {
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
                                                    {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length === 0 ? (
                                                        <th className="headPre">
                                                            <div className="mb-2">-</div>
                                                            <div>-</div>
                                                        </th>
                                                    ) : ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.map(item => {
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
                                                    {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length === 0 ? (
                                                        <td className="footPre">-</td>
                                                    ) : ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.map(item => {
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
                                                    {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.map(item => {
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
                                                    {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.map(item => {
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
                <Modal isOpen={this.state.modalEdit} toggle={this.openModalEdit} size="lg">
                    <ModalHeader>
                        Update Data Klaim
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <Formik
                            initialValues = {{
                                keterangan: dataRinci.keterangan,
                                periode_awal: dataRinci.periode_awal,
                                periode_akhir: dataRinci.periode_akhir,
                                nilai_ajuan: dataRinci.nilai_ajuan,
                                norek_ajuan: dataRinci.norek_ajuan,
                                nama_tujuan: dataRinci.nama_tujuan,
                                status_npwp: dataRinci.status_npwp === 0 ? 'Tidak' : 'Ya',
                                nama_npwp: dataRinci.nama_npwp === null ? '' : dataRinci.nama_npwp,
                                no_npwp: dataRinci.no_npwp === null ? '' : dataRinci.no_npwp,
                                no_ktp: dataRinci.no_ktp === null ? '' : dataRinci.no_ktp,
                                nama_ktp: dataRinci.nama_ktp === null ? '' : dataRinci.nama_ktp,
                                ppu: dataRinci.ppu === null ? '' : dataRinci.ppu,
                                pa: dataRinci.pa === null ? '' : dataRinci.pa,
                                nominal: dataRinci.nominal === null ? '' : dataRinci.nominal,
                                kode_vendor: dataRinci.kode_vendor === null ? '' : dataRinci.kode_vendor
                            }}
                            validationSchema = {klaimSchema}
                            onSubmit={(values) => {this.prosesEditKlaim(values)}}
                            >
                            {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci2">
                                    <div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No COA</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={dataRinci.no_coa}
                                                onBlur={handleBlur("no_coa")}
                                                onChange={handleChange("no_coa")}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.no_coa === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nama COA</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={dataRinci.nama_coa}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.no_coa === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text"
                                                disabled
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
                                            <Col md={3}>Periode</Col>
                                            <Col md={9} className="colRinci">: 
                                                <Input
                                                type= "date"
                                                disabled
                                                className="inputRinci"
                                                value={moment(values.periode_awal).format('YYYY-MM-DD')}
                                                onBlur={handleBlur("periode_awal")}
                                                onChange={handleChange("periode_awal")}
                                                />
                                                <text className='mr-1 ml-1'>To</text>
                                                <Input
                                                type= "date" 
                                                disabled
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
                                            <Col md={3}>Nilai DN Area</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.nilai_ajuan}
                                                onBlur={handleBlur("nilai_ajuan")}
                                                onChange={handleChange("nilai_ajuan")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.nilai_ajuan ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Bank</Col>
                                            <Col md={9} className="colRinci">: <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.bank_tujuan}
                                                onBlur={handleBlur("bank_tujuan")}
                                                onChange={handleChange("bank_tujuan")}
                                                />
                                            </Col>
                                        </Row>
                                        {values.bank_tujuan === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nomor Rekening</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                disabled
                                                minLength={this.state.digit}
                                                maxLength={this.state.digit}
                                                value={values.norek_ajuan}
                                                onBlur={handleBlur("norek_ajuan")}
                                                onChange={handleChange("norek_ajuan")}
                                                />
                                            </Col>
                                        </Row>
                                        {/* {errors.norek_ajuan || values.norek_ajuan.length !== this.state.digit ? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : null} */}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Atas Nama</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.nama_tujuan}
                                                onBlur={handleBlur("nama_tujuan")}
                                                onChange={handleChange("nama_tujuan")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.nama_tujuan ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Memiliki NPWP</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.status_npwp}
                                                onBlur={handleBlur("status_npwp")}
                                                onChange={handleChange("status_npwp")}
                                                >
                                                    <option>{values.status_npwp}</option>
                                                    <option>-Pilih-</option>
                                                    <option value="Ya">Ya</option>
                                                    <option value="Tidak">Tidak</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.status_npwp ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nama Sesuai NPWP</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.status_npwp === 'Ya' ? values.nama_npwp : ''}
                                                onBlur={handleBlur("nama_npwp")}
                                                onChange={handleChange("nama_npwp")}
                                                />
                                            </Col>
                                        </Row>
                                        {values.status_npwp === 'Ya' && values.nama_npwp === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nomor NPWP</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                minLength={15}
                                                maxLength={15}
                                                className="inputRinci"
                                                value={values.status_npwp === 'Ya' ? values.no_npwp : ''}
                                                onBlur={handleBlur("no_npwp")}
                                                onChange={handleChange("no_npwp")}
                                                />
                                            </Col>
                                        </Row>
                                        {values.status_npwp === 'Ya' && values.no_npwp.length < 15  ? (
                                            <text className={style.txtError}>must be filled with 15 digits characters</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nama Sesuai KTP</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.status_npwp === 'Tidak' ? values.nama_ktp : ''}
                                                onBlur={handleBlur("nama_ktp")}
                                                onChange={handleChange("nama_ktp")}
                                                />
                                            </Col>
                                        </Row>
                                        {values.status_npwp === 'Tidak' && values.nama_ktp === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nomor KTP</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                minLength={16}
                                                maxLength={16}
                                                value={values.status_npwp === 'Tidak' ? values.no_ktp : ''}
                                                onBlur={handleBlur("no_ktp")}
                                                onChange={handleChange("no_ktp")}
                                                />
                                            </Col>
                                        </Row>
                                        {values.status_npwp === 'Tidak' && values.no_ktp.length < 16 ? (
                                            <text className={style.txtError}>must be filled with 16 digits characters</text>
                                        ) : null}
                                    </div>
                                    {/* <Row className="mb-2 rowRinci">
                                        <Col md={3}>PPU</Col>
                                        <Col md={9} className="colRinci">:  <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.ppu}
                                            onBlur={handleBlur("ppu")}
                                            onChange={handleChange("ppu")}
                                            />
                                        </Col>
                                    </Row> */}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>PPU</Col>
                                        <Col md={9} className="colRinci">:  <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.ppu}
                                            onBlur={handleBlur("ppu")}
                                            onChange={handleChange("ppu")}
                                            minLength={10}
                                            maxLength={10}
                                            />
                                        </Col>
                                    </Row>
                                    {errors.ppu ? (
                                        <text className={style.txtError}>{errors.ppu}</text>
                                    ) : values.ppu.toString().length !== 10 ?
                                        <text className={style.txtError}>Mohon diisi hingga 10 digit angka</text>
                                    : null}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>PA</Col>
                                        <Col md={9} className="colRinci">:  <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.pa}
                                            onBlur={handleBlur("pa")}
                                            onChange={handleChange("pa")}
                                            minLength={16}
                                            maxLength={16}
                                            />
                                        </Col>
                                    </Row>
                                    {errors.pa ? (
                                        <text className={style.txtError}>{errors.pa}</text>
                                    ) : values.pa.toString().length !== 16 ?
                                        <text className={style.txtError}>Mohon diisi hingga 16 digit angka</text>
                                    : null}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Kode Vendor</Col>
                                        <Col md={9} className="colRinci">:  <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.kode_vendor}
                                            onBlur={handleBlur("kode_vendor")}
                                            onChange={handleChange("kode_vendor")}
                                            minLength={10}
                                            maxLength={10}
                                            />
                                        </Col>
                                    </Row>
                                    {errors.kode_vendor ? (
                                        <text className={style.txtError}>{errors.kode_vendor}</text>
                                    ) : values.kode_vendor.toString().length !== 10 ?
                                        <text className={style.txtError}>Mohon diisi hingga 10 digit</text>
                                    : null}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Nominal verifikasi</Col>
                                        <Col md={9} className="colRinci">:  
                                            <NumberInput
                                                className="inputRinci"
                                                value={values.nominal}
                                                onValueChange={val => setFieldValue("nominal", val.floatValue)}
                                                />
                                                {/* <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.nominal}
                                            onBlur={handleBlur("nominal")}
                                            onChange={handleChange("nominal")}
                                            /> */}
                                        </Col>
                                    </Row>
                                    {errors.nominal ? (
                                        <text className={style.txtError}>{errors.nominal}</text>
                                    ) : null}
                                    <div className="modalFoot mt-3">
                                        <div></div>
                                        <div className='btnfoot'>
                                            <Button 
                                                className="mr-3" 
                                                size="md" 
                                                disabled={ 
                                                    values.ppu.toString().length !== 10 ? true 
                                                    : values.pa.toString().length !== 16 ? true 
                                                    : values.kode_vendor.toString().length !== 10 ? true
                                                    : values.nominal === '' ? true 
                                                    : false 
                                                } 
                                                color="primary" 
                                                onClick={handleSubmit}>
                                                Save
                                            </Button>
                                            <Button className="" size="md" color="secondary" onClick={() => this.openModalEdit()}>Close</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.prepReject(values)}}
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
                <Modal isOpen={this.props.klaim.isLoading || this.props.email.isLoading} size="sm">
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
                                    Anda yakin untuk submit     
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
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
            <Modal isOpen={this.state.modalConfirm} size={this.state.confirm === 'failUpload' ? 'lg' : 'sm'} toggle={this.openConfirm}>
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
                    ) : this.state.confirm === 'rejSubmitKlm' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit, pastikan nilai ppu, pa, nominal, dan kode vendor telah diisi</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejDownload' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Download, Mohon Pilih Data Ajuan Terlebih Dahulu</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejUpload' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Upload, Pastikan Template Upload Data Sesuai</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejSubmit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit, pastikan nilai ppu, pa, nominal, dan kode vendor telah diisi</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'appNotifDoc' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Approve, Pastikan Dokumen Lampiran Telah Diapprove</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'upload' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Upload Data Klaim</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'failUpload' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green, style.mb4]}>Gagal Upload</div>
                                {messUpload.length > 0 ? messUpload.map(item => {
                                    return (
                                        item.map(x => {
                                            return (
                                                x !== null &&
                                                <div className={[style.sucUpdate, style.green, style.mb3]}>{`${x.mess} Pada No Ajuan ${x.no_transaksi}`}</div>
                                            )
                                        })
                                    )
                                }) : (
                                    <div></div>
                                )}
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
                                    ) : (
                                        // <Col md={6} lg={6} className="colDoc">
                                        //     <text className="btnDocIo" >{x.desc === null ? 'Lampiran' : x.desc}</text>
                                        //     <div className="colDoc">
                                        //         <input
                                        //         type="file"
                                        //         onClick={() => this.setState({detail: x})}
                                        //         onChange={this.onChangeUpload}
                                        //         />
                                        //     </div>
                                        //     <text className="txtError ml-4">Maximum file upload is 20 Mb</text>
                                        // </Col>
                                        <div></div>
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
                        {detailKlaim.length > 0 && detailKlaim[0].history.split(',').map(item => {
                            return (
                                item !== null && item !== 'null' && 
                                <Button className='mb-2' color='info'>{item}</Button>
                            )
                        })}
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
                                    onClick={() => tipeEmail === 'reject' ? this.rejectKlaim(this.state.dataRej) : this.approveDataKlaim()}
                                    color="primary"
                                >
                                    {tipeEmail === 'reject' ? 'Reject' : 'Submit'} & Send Email
                                </Button>
                                <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master User</ModalHeader>
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
                        <div className='btnUpload'>
                            {/* <Button color="info" onClick={this.DownloadTemplate}>Download Template</Button> */}
                            <div></div>
                            <Button className='mr-2' color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadAjuan}>Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
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
    menu: state.menu,
    reason: state.reason,
    dokumen: state.dokumen,
    email: state.email,
    spvklaim: state.spvklaim
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNameApprove: approve.getNameApprove,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    getRole: user.getRole,
    getKlaim: klaim.getKlaim,
    getDetail: klaim.getDetail,
    getApproval: klaim.getApproval,
    getDocKlaim: klaim.getDocCart,
    approveKlaim: klaim.approveKlaim,
    getAllMenu: menu.getAllMenu,
    getReason: reason.getReason,
    rejectKlaim: klaim.rejectKlaim,
    resetKlaim: klaim.resetKlaim,
    submitVerif: klaim.submitVerif,
    editVerif: klaim.editVerif,
    showDokumen: dokumen.showDokumen,
    approveDokumen: dokumen.approveDokumen,
    rejectDokumen: dokumen.rejectDokumen,
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    addNotif: notif.addNotif,
    uploadDataKlaim: klaim.uploadDataKlaim,
    getSpvklaim: spvklaim.getSpvklaim
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifKlaim)
