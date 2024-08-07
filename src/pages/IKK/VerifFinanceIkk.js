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
import notif from '../../redux/actions/notif'
import Pdf from "../../components/Pdf"
import depo from '../../redux/actions/depo'
import {default as axios} from 'axios'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import ikk from '../../redux/actions/ikk'
import Tracking from '../../components/Ikk/tracking'
import Formikk from '../../components/Ikk/formikk'
import FPD from '../../components/Ikk/FPD'
import dokumen from '../../redux/actions/dokumen'
import ExcelJS from "exceljs"
import fs from "file-saver"
import email from '../../redux/actions/email'
import NumberInput from '../../components/NumberInput'
import Email from '../../components/Ikk/Email'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
const {REACT_APP_BACKEND_URL} = process.env

const opsSchema = Yup.object().shape({
    nilai_utang: Yup.number().required('must be filled'),
    nilai_buku: Yup.number().required('must be filled'),
    nilai_bayar: Yup.number().required('must be filled'),
    no_skb: Yup.string().required('must be filled'),
    jenis_pph: Yup.string().required('must be filled'),
    datef_skb: Yup.date().required("must be filled"),
    datel_skb: Yup.date().required('must be filled')
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});


class VerifIkk extends Component {
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
            newIkk: [],
            totalfpd: 0,
            dataMenu: [],
            listMenu: [],
            formDis: false,
            history: false,
            upload: false,
            openAppDoc: false,
            openRejDoc: false,
            listIkk: [],
            modalDownload: false,
            dataDownload: [],
            time: 'pilih',
            time1: moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            docHist: false,
            detailDoc: {},
            docCon: false,
            openDraft: false,
            message: '',
            subject: '',
            tipeEmail: '',
            dataRej: {},
            statEmail: '',
            modResmail: false,
            dataZip: [],
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    checkDoc = (val) => {
        const { dataZip } = this.state
        const {dataDoc} = this.props.ikk
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataDoc.length; i++) {
                data.push(dataDoc[i].id)
            }
            this.setState({dataZip: data})
        } else {
            dataZip.push(val)
            this.setState({dataZip: dataZip})
        }
    }

    unCheckDoc = (val) => {
        const {dataZip} = this.state
        if (val === 'all') {
            const data = []
            this.setState({dataZip: data})
        } else {
            const data = []
            for (let i = 0; i < dataZip.length; i++) {
                if (dataZip[i] === val) {
                    data.push()
                } else {
                    data.push(dataZip[i])
                }
            }
            this.setState({dataZip: data})
        }
    }

    submitStock = async () => {
        const token = localStorage.getItem('token')
        await this.props.submitStock(token)
        this.getDataCart()
    }

    approveZip = async () => {
        const token = localStorage.getItem('token')
        const {idDoc, dataZip} = this.state
        const { detailIkk } = this.props.ikk
        const tempno = {
            no: detailIkk[0].no_transaksi,
            name: 'Draft Pengajuan Ikk'
        }
        const data = {
            list: dataZip
        }
        await this.props.approveDokumen(token, idDoc, data)
        await this.props.getDocIkk(token, tempno)
        this.setState({confirm: 'isAppDoc'})
        this.openConfirm()
        this.openModalAppZip()
    }

    openModalAppZip = () => {
        this.setState({openAppZip: !this.state.openAppZip})
    }

    rejectZip = async () => {
        const token = localStorage.getItem('token')
        const {idDoc, dataZip} = this.state
        const { detailIkk } = this.props.ikk
        const tempno = {
            no: detailIkk[0].no_transaksi,
            name: 'Draft Pengajuan Ikk'
        }
        const data = {
            list: dataZip
        }
        await this.props.rejectDokumen(token, idDoc, data)
        await this.props.getDocIkk(token, tempno)
        this.setState({confirm: 'isRejDoc'})
        this.openConfirm()
        this.openModalRejZip()
    }

    openModalRejZip = () => {
        this.setState({openRejZip: !this.state.openRejZip})
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

    rejectIkk = async (val) => {
        const {listMut, listReason, listMenu} = this.state
        const { detailIkk } = this.props.ikk
        const token = localStorage.getItem('token')
        const tempno = {
            no: detailIkk[0].no_transaksi
        }
        let temp = ''
        for (let i = 0; i < listReason.length; i++) {
            temp += listReason[i] + '. '
        }
        const data = {
            no: detailIkk[0].no_transaksi,
            list: listMut,
            alasan: temp + val.alasan,
            menu: listMenu.toString(),
            type: "verif"
        }
        await this.props.rejectIkk(token, data)
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
        const {detailIkk} = this.props.ikk
        let total = 0
        for (let i = 0; i < detailIkk.length; i++) {
            total += parseInt(detailIkk[i].nilai_ajuan)
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
        this.getDataIkk()
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
        const dataCek = localStorage.getItem('docData')
        const {item, type} = (this.props.location && this.props.location.state) || {}
        if (type === 'approve') {
            this.getDataIkk()
            this.prosesDetail(item)
        } else if (dataCek !== undefined && dataCek !== null) {
            const data = {
                no_transaksi: dataCek
            }
            this.getDataIkk()
            this.prosesDocTab(data)
        } else {
            this.getDataIkk()
        }
    }

    componentDidUpdate() {
        const { isApprove, isReject, subVerif } = this.props.ikk
        if (subVerif === false) {
            this.setState({confirm: 'rejSubmit'})
            this.openConfirm()
            this.openModalApprove()
            this.props.resetIkk()
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

    getDataIkk = async (value) => {
        this.setState({limit: value === undefined ? 10 : value.limit})
        this.changeFilter('available')
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
            name: 'Draft Pengajuan Ikk'
        }
        this.setState({listMut: []})
        await this.props.getDetail(token, tempno)
        await this.props.getApproval(token, tempno)
        await this.props.getDocIkk(token, data)
        this.openModalRinci()
    }

    prosesStatEmail = async (val) => {
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const {filter} = this.state

        let tempno = {
            no: val[0].no_transaksi,
            kode: val[0].kode_plant
        }
        
        if (level === '5') {
            if (val[0].status_reject === 0) {
                tempno = {
                    ...tempno,
                    jenis: 'ikk',
                    tipe: 'revisi',
                    menu: 'Revisi Area (IKK)'
                }
               
            } else {
                tempno = {
                    ...tempno,
                    jenis: 'ikk',
                    tipe: 'approve',
                    menu: 'Pengajuan Ikk (IKK)'
                }
            }
        } else {
            const cekMenu = level === '2' ? 'Verifikasi Finance (IKK)' : 'Verifikasi Tax (IKK)'
            if (val[0].status_reject === 1) {
                tempno = {
                    ...tempno,
                    jenis: 'ikk',
                    tipe: 'reject',
                    menu: cekMenu
                }
            } else {
                tempno = {
                    ...tempno,
                    jenis: 'ikk',
                    tipe: 'submit',
                    menu: cekMenu
                }
            }
        }
        await this.props.getDraftEmail(token, tempno)

        const { draftEmail } = this.props.email
        const resSend = {
            ...tempno,
            draft: draftEmail
        }
        await this.props.getResmail(token, resSend)
        
        this.openModResmail()
    }

    openModResmail = () => {
        const {modResmail} = this.state
        if (modResmail === false) {
            this.setState({statEmail: 'resend'})
            this.setState({modResmail: !this.state.modResmail})
        } else {
            this.setState({statEmail: ''})
            this.setState({modResmail: !this.state.modResmail})
        }
    }

    prosesResmail = async () => {
        const token = localStorage.getItem("token")
        const { listReject } = this.state
        const { detailIkk } = this.props.ikk
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
            no: detailIkk[0].no_transaksi,
            tipe: 'ikk'
        }
        await this.props.sendEmail(token, tempno)
        this.openModResmail()
        this.setState({confirm: 'resmail'})
        this.openConfirm()
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

    prosesEditIkk = async (val) => {
        const token = localStorage.getItem("token")
        const {dataRinci} = this.state
        const data = {
            nilai_utang: val.nilai_utang,
            nilai_buku: val.nilai_buku,
            nilai_bayar: val.nilai_bayar,
            no_skb: val.no_skb,
            jenis_pph: val.jenis_pph,
            datef_skb: val.datef_skb,
            datel_skb: val.datel_skb
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
        const {dataIkk, noDis} = this.props.ikk
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = level === '2' ? 3 : 4
        const statusAll = 'all'
        const role = localStorage.getItem('role')
        if (val === 'available') {
            const newIkk = []
            await this.props.getIkk(token, status, 'all', 'all', val, 'verif')
            this.setState({filter: val, newIkk: newIkk})
        } else if (val === 'reject') {
            const newIkk = []
            await this.props.getIkk(token, status, 'all', 'all', val, 'verif')
            this.setState({filter: val, newIkk: newIkk})
        } else if (val === 'revisi') {
            const newIkk = []
            await this.props.getIkk(token, status, 'all', 'all', val, 'verif')
            this.setState({filter: val, newIkk: newIkk})
        } else {
            const newIkk = []
            await this.props.getIkk(token, statusAll, 'all', 'all', val, 'verif', status)
            this.setState({filter: val, newIkk: newIkk})
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
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = level === '2' ? 3 : 4
        await this.props.getIkk(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, 'verif', filter === 'all' ? status : 'undefined', cekTime1, cekTime2)
    }

    prosesSubmit = async () => {
        const {listIkk} = this.state
        const {newIkk} = this.props.ikk
        const data = []
        for (let i = 0; i < listIkk.length; i++) {
            for (let j = 0; j < newIkk.length; j++) {
                if (newIkk[j].no_transaksi === listIkk[i]) {
                    data.push(newIkk[j])
                }
            }
        }
        this.openModalApprove()
    }

    approveDataIkk = async () => {
        const { detailIkk } = this.props.ikk
        const {listIkk} = this.state
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const noTrans = detailIkk.length > 0 ? detailIkk[0].no_transaksi : listIkk[0]
        const tempno = {
            no: noTrans,
            list: listIkk
        }
        if (level === '4' || level === '14') {
            await this.props.submitVerif(token, tempno)
            this.dataSendEmail()
        } else {
            await this.props.submitVerif(token, tempno)
            this.dataSendEmail()
        }
    }

    dataSendEmail = async (val) => {
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const { detailIkk } = this.props.ikk
        const { draftEmail } = this.props.email
        const { message, subject } = this.state
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        const tipeProses = val === 'reject' ? 'reject perbaikan' : level === '4' || level === '14' ?  'approve' : 'verifikasi'
        const tipeRoute = val === 'reject' ? 'revikk' : level === '4' || level === '14'  ? 'listikk' : 'veriffinikk'
        const tipeMenu = level === '4' || level === '14' ? 'list ajuan bayar' : 'verifikasi ikk'
        const tempno = {
            draft: draftEmail,
            nameTo: draftEmail.to.username,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: detailIkk[0].no_transaksi,
            tipe: 'ikk',
            menu: tipeMenu,
            proses: tipeProses,
            route: tipeRoute
        }
        await this.props.sendEmail(token, tempno)
        await this.props.addNotif(token, tempno)
        if (val === 'reject') {
            this.getDataIkk()
            this.setState({confirm: 'reject'})
            this.openConfirm()
            this.openDraftEmail()
            this.openModalReject()
            this.openModalRinci()
        } else {
            this.getDataIkk()
            this.setState({confirm: 'isApprove'})
            this.openConfirm()
            this.openDraftEmail()
            this.openModalApprove()
            this.openModalRinci()
        }
    }

    prepSendEmail = async () => {
        const { detailIkk } = this.props.ikk
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const app = detailIkk[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'submit'
        const cekMenu = level === '2' ? 'Verifikasi Finance (IKK)' : 'Verifikasi Tax (IKK)'
        const tempno = {
            no: detailIkk[0].no_transaksi,
            kode: detailIkk[0].kode_plant,
            jenis: 'ikk',
            tipe: tipe,
            menu: cekMenu 
        }
        await this.props.getDraftEmail(token, tempno)
        this.setState({tipeEmail: 'app'})
        this.openDraftEmail()
    }

    prepReject = async (val) => {
        const { detailIkk } = this.props.ikk
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const app = detailIkk[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'reject'
        const cekMenu = level === '2' ? 'Verifikasi Finance (IKK)' : 'Verifikasi Tax (IKK)'
        const tempno = {
            no: detailIkk[0].no_transaksi,
            kode: detailIkk[0].kode_plant,
            jenis: 'ikk',
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

    chekAppList = (val) => {
        const { listIkk } = this.state
        const {newIkk} = this.props.ikk
        if (val === 'all') {
            const data = []
            for (let i = 0; i < newIkk.length; i++) {
                data.push(newIkk[i].no_transaksi)
            }
            this.setState({listIkk: data})
        } else {
            listIkk.push(val)
            this.setState({listIkk: listIkk})
        }
    }

    chekRejList = (val) => {
        const {listIkk} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listIkk: data})
        } else {
            const data = []
            for (let i = 0; i < listIkk.length; i++) {
                if (listIkk[i] === val) {
                    data.push()
                } else {
                    data.push(listIkk[i])
                }
            }
            this.setState({listIkk: data})
        }
    }

    prosesDownload = () => {
        const {listIkk} = this.state
        const {dataIkk} = this.props.ikk
        const data = []
        for (let i = 0; i < listIkk.length; i++) {
            for (let j = 0; j < dataIkk.length; j++) {
                if (dataIkk[j].no_transaksi === listIkk[i]) {
                    data.push(dataIkk[j])
                }
            }
        }
        this.setState({dataDownload: data})
        this.openDownload()
    }

    openDownload = () => {
        this.setState({modalDownload: !this.state.modalDownload})
    }

    downloadExcel = async () => {
        const { dataDownload } = this.state

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data ajuan')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        ws.columns = [
            {header: 'NO', key: 'c1'},
            {header: 'NO AJUAN', key: 'c22'},
            {header: 'COST CENTRE', key: 'c2'}, 
            {header: 'NO COA', key: 'c3'},
            {header: 'NAMA COA', key: 'c4'},
            {header: 'KETERANGAN TAMBAHAN', key: 'c5'},
            {header: 'PERIODE', key: 'c6'},
            {header: 'NILAI YANG DIAJUKAN', key: 'c7'},
            {header: 'BANK', key: 'c8'},
            {header: 'NOMOR REKENING', key: 'c9'},
            {header: 'ATAS NAMA', key: 'c10'},
            {header: 'MEMILIKI NPWP', key: 'c11'},
            {header: 'NAMA SESUAI NPWP', key: 'c12'},
            {header: 'NOMOR NPWP', key: 'c13'},
            {header: 'NAMA SESUAI KTP', key: 'c14'},
            {header: 'NOMOR KTP', key: 'c15'},
            {header: 'DPP', key: 'c16'},
            {header: 'PPN', key: 'c17'},
            {header: 'PPh', key: 'c18'},
            {header: 'NILAI YANG DIBAYARKAN', key: 'c19'},
            {header: 'TANGGAL TRANSFER', key: 'c20'},
            {header: 'Jenis PPh', key: 'c21'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c1: index + 1,
                c22: item.no_transaksi,
                c2: item.cost_center,
                c3: item.no_coa,
                c4: item.nama_coa,
                c5: item.uraian,
                c6: `${moment(item.periode_awal).format('DD/MMMM/YYYY')} - ${moment(item.periode_akhir).format('DD/MMMM/YYYY')}`,
                c7: item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c8: item.bank_tujuan,
                c9: item.norek_ajuan,
                c10: item.nama_tujuan,
                c11: item.status_npwp === 0 ? 'Tidak' : item.status_npwp === 1 ? 'Ya' : '-',
                c12: item.status_npwp === 0 ? '' : item.nama_npwp,
                c13: item.status_npwp === 0 ? '' : item.no_npwp,
                c14: item.status_npwp === 0 ? item.nama_ktp : '',
                c15: item.status_npwp === 0 ? item.no_ktp : '',
                c16: item.dpp,
                c17: item.ppn,
                c18: item.nilai_utang,
                c19: item.nilai_bayar === null || item.nilai_bayar === undefined ? 0 : item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c20: item.tanggal_transfer !== null ? `${moment(item.tanggal_transfer).format('DD/MMMM/YYYY')}` : '-',
                c21: item.jenis_pph,
            }
        )
        ) })

        ws.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
              cell.border = borderStyles;
            })
          })
          

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Data Ajuan IKK ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const {time1, time2, filter} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = level === '2' ? 3 : 4
        if(e.key === 'Enter'){
            await this.props.getIkk(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, 'verif', filter === 'all' ? status : 'undefined', cekTime1, cekTime2, e.target.value)
        }
    }

    changeView = (val) => {
        this.setState({view: val})
        if (val === 'list') {
            this.getDataList()
        } else {
            this.getDataIkk()
        }
    }

    downloadDataZip = () => {
        const {dataZip} = this.state
        const {dataDoc} = this.props.ikk
        let zip = new JSZip();
    
        const remoteZips = dataDoc.map(async (item) => {
            const cekData = dataZip.find(e => e === item.id)
            if (cekData !== undefined) {
                const response = await fetch(`${REACT_APP_BACKEND_URL}/show/doc/${item.id}`);
                const data = await response.blob();
                zip.file(`${item.desc} ~ ${item.history}`, data);
                return data;
            }
        })

        Promise.all(remoteZips).then(() => {
            zip.generateAsync({ type: "blob" }).then((content) => {
              saveAs(content, `Dokumen Lampiran ${dataDoc[0].no_transaksi} ${moment().format('DDMMYYYY h:mm:ss')}.zip`);
            })
          })
    }

    getAppIkk = async (val) => {
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
            name: 'Draft Pengajuan Ikk'
        }
        await this.props.getDocIkk(token, tempno)
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
            name: 'Draft Pengajuan Ikk'
        }
        this.setState({listMut: []})
        await this.props.getDetail(token, tempno)
        await this.props.getApproval(token, tempno)
        await this.props.getDocIkk(token, data)
        this.openModalRinci()
        this.openProsesModalDoc(sendDoc)
    }

    openDocNewTab = async (val) => {
        localStorage.setItem('docData', val[0].no_transaksi)
        const newWindow = window.open('veriffinikk', '_blank', 'noopener,noreferrer')
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
        const { detailIkk } = this.props.ikk
        const tempno = {
            no: detailIkk[0].no_transaksi,
            name: 'Draft Pengajuan Ikk'
        }
        await this.props.approveDokumen(token, idDoc)
        await this.props.getDocIkk(token, tempno)
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
        const { detailIkk } = this.props.ikk
        const tempno = {
            no: detailIkk[0].no_transaksi,
            name: 'Draft Pengajuan Ikk'
        }
        await this.props.rejectDokumen(token, idDoc)
        await this.props.getDocIkk(token, tempno)
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

    cekDataDoc = () => {
        const { dataDoc, detailIkk } = this.props.ikk
        const level = localStorage.getItem("level")
        if (level === '4' || level === '14') {
            const resData = detailIkk.find(({stat_skb}) => stat_skb === 'ya')
            if (resData !== undefined) {
                const cekDoc = dataDoc.find(({desc}) => desc === 'Dokumen SKB')
                const stat = cekDoc.status
                const cekLevel = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[0] : ''
                const cekStat = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[1] : ''

                if (resData.jenis_pph === null ||
                    resData.no_skb === null ||
                    resData.nilai_bayar === null ||
                    resData.datef_skb === null ||
                    resData.datel_skb === null ||
                    resData.nilai_utang === null ||
                    resData.nilai_buku === null
                    ) 
                {
                    this.setState({confirm: 'rejTax'})
                    this.openConfirm()
                } else if (cekLevel !== ` level ${level}` || cekStat !== ` status approve`) {
                    this.setState({confirm: 'appNotifDoc'})
                    this.openConfirm()
                } else {
                    this.openModalApprove()
                }
            } else {
                this.openModalApprove()
            }
        } else {
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
                this.openModalApprove()
            } else {
                this.setState({confirm: 'appNotifDoc'})
                this.openConfirm()
            }
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
        const {detailIkk} = this.props.ikk
        if (val === 'all') {
            const data = []
            for (let i = 0; i < detailIkk.length; i++) {
                data.push(detailIkk[i].id)
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
            return (item.kode_menu === 'Ikk' && data.push(item))
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
        const {dataRinci, dataZip, filter, tipeEmail, listMut, dataDownload, listReason, dataMenu, listMenu, detailDoc, listIkk} = this.state
        const { detailDepo, dataDepo } = this.props.depo
        const { dataReason } = this.props.reason
        const { noDis, detailIkk, ttdIkk, dataDoc, newIkk } = this.props.ikk
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
                                <div className={style.titleDashboard}>Verifikasi {level === '2' ? 'Finance' : "Tax"} (Ikhtisar Kas Kecil)</div>
                            </div>
                            <div className={style.secEmail3}>
                                <div className={style.searchEmail2}>
                                    <text>Filter:  </text>
                                    <Input className={style.filter} type="select" value={filter} onChange={e => this.changeFilter(e.target.value)}>
                                        <option value="all">All</option>
                                        <option value="reject">Reject</option>
                                        <option value="available">Available Submit</option>
                                        {/* <option value="revisi">Available Reapprove (Revisi)</option> */}
                                    </Input>
                                </div>
                                <div className={style.headEmail2}>
                                    {level === '14' ?  (
                                        <>
                                            {filter === 'available' && (
                                                <Button 
                                                    className='mr-1' 
                                                    onClick={this.prosesSubmit} 
                                                    color="primary" 
                                                    size="lg"
                                                    disabled={listIkk.length > 0 ? false : true}
                                                >
                                                    Submit
                                                </Button>
                                            )}
                                            <Button className='mr-1' color="success" size="lg" onClick={this.prosesDownload}>Download</Button>
                                        </>
                                    ) : null}
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
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab} id="table-klaim">
                                        <thead>
                                            <tr>
                                                {level === '14' && (
                                                    <th>
                                                        <input  
                                                        className='mr-2'
                                                        type='checkbox'
                                                        checked={listIkk.length === 0 ? false : listIkk.length === newIkk.length ? true : false}
                                                        onChange={() => listIkk.length === newIkk.length ? this.chekRejList('all') : this.chekAppList('all')}
                                                        />
                                                        Select
                                                    </th>
                                                )}
                                                <th>No</th>
                                                <th>NO.AJUAN</th>
                                                <th>COST CENTRE</th>
                                                <th>AREA</th>
                                                <th>NO.COA</th>
                                                <th>JENIS TRANSAKSI</th>
                                                <th>KETERANGAN TAMBAHAN</th>
                                                <th>TGL AJUAN</th>
                                                <th>STATUS</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newIkk.map(item => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        {level === '14' && (
                                                            <th>
                                                                <input 
                                                                type='checkbox'
                                                                checked={listIkk.find(element => element === item.no_transaksi) !== undefined ? true : false}
                                                                onChange={listIkk.find(element => element === item.no_transaksi) === undefined ? () => this.chekAppList(item.no_transaksi) : () => this.chekRejList(item.no_transaksi)}
                                                                />
                                                            </th>
                                                        )}
                                                        <th>{newIkk.indexOf(item) + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.cost_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.sub_coa}</th>
                                                        <th>{item.uraian}</th>
                                                        <th>{moment(item.start_ikk).format('DD MMMM YYYY')}</th>
                                                        <th>{item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>{filter === 'available' ? 'Proses' : 'Detail'}</Button>
                                                            <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {newIkk.length === 0 && (
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
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailIkk.length > 0 ? detailIkk[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailIkk.length > 0 ? detailIkk[0].no_transaksi : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailIkk.length > 0 ? moment(detailIkk[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
                            </Row>
                        </div>
                        <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr>
                                        <th>
                                            <input  
                                            className='mr-2'
                                            type='checkbox'
                                            checked={listMut.length === 0 ? false : listMut.length === detailIkk.length ? true : false}
                                            onChange={() => listMut.length === detailIkk.length ? this.chekRej('all') : this.chekApp('all')}
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
                                        <th>Vendor Memiliki SKB</th>
                                        <th>TANGGAL TRANSFER</th>
                                        <th>Jenis PPh</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailIkk.length !== 0 && detailIkk.map(item => {
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
                                                    {item.stat_skb === 'ya' && (
                                                        <Button className='mt-2' color="info" size='sm' onClick={() => this.getRincian(item)}>Proses</Button>
                                                    )}
                                                </th>
                                                )}
                                                <th scope="row">{detailIkk.indexOf(item) + 1}</th>
                                                <th>{item.cost_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.uraian}</th>
                                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.status_npwp === 0 ? 'Tidak' : item.status_npwp === 1 ? 'Ya' : '-'}</th>
                                                <th>{item.status_npwp === 0 ? '' : item.nama_npwp}</th>
                                                <th>{item.status_npwp === 0 ? '' : item.no_npwp}</th>
                                                <th>{item.dpp}</th>
                                                <th>{item.ppn}</th>
                                                <th>{item.nilai_utang}</th>
                                                <th>{item.nilai_bayar === null || item.nilai_bayar === undefined ? 0 : item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.stat_skb === 'ya' ? 'Ya' : '-'}</th>
                                                <th>{item.tanggal_transfer !== null ? moment(item.tanggal_transfer).format('DD/MMMM/YYYY') : '-'}</th>
                                                <th>{item.jenis_pph}</th>
                                                <th>{item.history !== null && item.history.split(',').reverse()[0]}</th>
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
                            <Button className="mr-2" color="warning"  onClick={() => this.openModalFaa()}>Form Ikk</Button>
                            <Button color="primary"  onClick={() => this.openDocCon()}>Dokumen</Button>
                        </div>
                        <div className="btnFoot">
                            {filter === 'available' || 
                            (detailIkk[0] !== undefined && 
                            (detailIkk[0].status_transaksi === 0 || 
                            detailIkk[0].status_transaksi === 8)) ? null : (
                                <Button className='mr-2' color="warning"  onClick={() => this.prosesStatEmail(detailIkk)}>Status Email</Button>
                            )}
                            {filter !== 'available' && filter !== 'revisi' ? (
                                <div></div>
                            ) : (
                                <>
                                    <Button className="mr-2" disabled={filter === 'revisi'  && listMut.length > 0 ? false : filter !== 'available' ? true : listMut.length === 0 ? true : false} color="danger" onClick={this.prepareReject}>
                                        Reject
                                    </Button>
                                    <Button color="success" disabled={listIkk.length > 0 ? true : filter === 'revisi'  ? false : filter !== 'available' ? true : false} onClick={this.cekDataDoc}>
                                        Submit
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Modal>
                <Modal size="xl" className='modalrinci' isOpen={this.state.modalDownload} toggle={this.openDownload}>
                    <ModalHeader>
                        Download
                    </ModalHeader>
                    <ModalBody>
                        <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab} id="table-to-xls">
                                <thead>
                                    <tr>
                                        <th>NO</th>
                                        <th>NO AJUAN</th>
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
                                        <th>PPh</th>
                                        <th>NILAI YANG DIBAYARKAN</th>
                                        <th>TANGGAL TRANSFER</th>
                                        <th>Jenis PPh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataDownload.length !== 0 && dataDownload.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{dataDownload.indexOf(item) + 1}</th>
                                                <th>{item.no_transaksi}</th>
                                                <th>{item.cost_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.uraian}</th>
                                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.status_npwp === 0 ? 'Tidak' : item.status_npwp === 1 ? 'Ya' : '-'}</th>
                                                <th>{item.status_npwp === 0 ? '' : item.nama_npwp}</th>
                                                <th>{item.status_npwp === 0 ? '' : item.no_npwp}</th>
                                                <th>{item.status_npwp === 0 ? item.nama_ktp : ''}</th>
                                                <th>{item.status_npwp === 0 ? item.no_ktp : ''}</th>
                                                <th>{item.dpp}</th>
                                                <th>{item.ppn}</th>
                                                <th>{item.nilai_utang}</th>
                                                <th>{item.nilai_bayar === null || item.nilai_bayar === undefined ? 0 : item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.tanggal_transfer !== null ? moment(item.tanggal_transfer).format('DD/MMMM/YYYY') : '-'}</th>
                                                <th>{item.jenis_pph}</th>
                                            </tr>
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
                            <Button className="mr-2" color='warning' onClick={this.downloadExcel} >Download</Button>
                            <Button color="success" onClick={this.openDownload}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal className='modalrinci' isOpen={this.state.modalFaa} toggle={this.openModalFaa} size="xl">
                <ModalBody>
                        <Formikk totalfpd={this.state.totalfpd} />
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
                        <FPD totalfpd={this.state.totalfpd} />
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
                        Update Data Ikk
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <Formik
                            initialValues = {{
                                uraian: dataRinci.uraian,
                                periode_awal: dataRinci.periode_awal,
                                periode_akhir: dataRinci.periode_akhir,
                                nilai_ajuan: dataRinci.nilai_ajuan,
                                bank_tujuan: dataRinci.bank_tujuan,
                                norek_ajuan: dataRinci.norek_ajuan,
                                nama_tujuan: dataRinci.nama_tujuan,
                                status_npwp: dataRinci.status_npwp === 0 ? 'Tidak' : dataRinci.status_npwp === 1 ? 'Ya' : '',
                                nama_vendor: dataRinci.nama_vendor === null ? '' : dataRinci.nama_vendor,
                                no_npwp: dataRinci.no_npwp === null ? '' : dataRinci.no_npwp,
                                no_ktp: dataRinci.no_ktp === null ? '' : dataRinci.no_ktp,
                                nama_ktp: dataRinci.nama_ktp === null ? '' : dataRinci.nama_ktp,
                                dpp: dataRinci.dpp === null ? '' : dataRinci.dpp,
                                ppn: dataRinci.ppn === null ? '' : dataRinci.ppn,
                                nilai_utang: dataRinci.nilai_utang === null ? '' : dataRinci.nilai_utang,
                                nilai_buku: dataRinci.nilai_buku,
                                nilai_bayar: dataRinci.nilai_bayar,
                                no_skb: dataRinci.no_skb,
                                jenis_pph: dataRinci.jenis_pph,
                                datef_skb: dataRinci.datef_skb,
                                datel_skb: dataRinci.datel_skb
                            }}
                            validationSchema = {opsSchema}
                            onSubmit={(values) => {this.prosesEditIkk(values)}}
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
                                                value={values.uraian}
                                                onBlur={handleBlur("uraian")}
                                                onChange={handleChange("uraian")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.uraian ? (
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
                                            <Col md={3}>Nilai yg diajukan</Col>
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
                                            <Col md={3}>Tujuan Transfer</Col>
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
                                            <Col md={3}>Nama Vendor/NPWP/KTP</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.nama_vendor}
                                                onBlur={handleBlur("nama_vendor")}
                                                onChange={handleChange("nama_vendor")}
                                                />
                                            </Col>
                                        </Row>
                                        {values.status_npwp === 'Ya' && values.nama_vendor === '' ? (
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
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Nilai Yang Dibayarkan</Col>
                                        <Col md={9} className="colRinci">:  
                                            <NumberInput
                                            className="inputRinci"
                                            value={values.nilai_bayar}
                                            onValueChange={val => setFieldValue("nilai_bayar", val.floatValue)}
                                            />
                                            {/* <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.nilai_bayar}
                                            onBlur={handleBlur("nilai_bayar")}
                                            onChange={handleChange("nilai_bayar")}
                                            /> */}
                                        </Col>
                                    </Row>
                                    {errors.nilai_bayar && (
                                        <text className={style.txtError}>must be filled</text>
                                    )}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Nilai Yang Dibukukan</Col>
                                        <Col md={9} className="colRinci">:  
                                            <NumberInput
                                            className="inputRinci"
                                            value={values.nilai_buku}
                                            onValueChange={val => setFieldValue("nilai_buku", val.floatValue)}
                                            />
                                            {/* <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.nilai_buku}
                                            onBlur={handleBlur("nilai_buku")}
                                            onChange={handleChange("nilai_buku")}
                                            /> */}
                                        </Col>
                                    </Row>
                                    {errors.nilai_buku && (
                                        <text className={style.txtError}>must be filled</text>
                                    )}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Nilai Utang PPh</Col>
                                        <Col md={9} className="colRinci">:  
                                            <NumberInput
                                            className="inputRinci"
                                            value={values.nilai_utang}
                                            onValueChange={val => setFieldValue("nilai_utang", val.floatValue)}
                                            />
                                            {/* <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.nilai_utang}
                                            onBlur={handleBlur("nilai_utang")}
                                            onChange={handleChange("nilai_utang")}
                                            /> */}
                                        </Col>
                                    </Row>
                                    {errors.nilai_utang && (
                                        <text className={style.txtError}>must be filled</text>
                                    )}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Jenis PPh</Col>
                                        <Col md={9} className="colRinci">:  <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.jenis_pph}
                                            onBlur={handleBlur("jenis_pph")}
                                            onChange={handleChange("jenis_pph")}
                                            />
                                        </Col>
                                    </Row>
                                    {errors.jenis_pph && (
                                        <text className={style.txtError}>must be filled</text>
                                    )}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>No SKB</Col>
                                        <Col md={9} className="colRinci">:  <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.no_skb}
                                            onBlur={handleBlur("no_skb")}
                                            onChange={handleChange("no_skb")}
                                            />
                                        </Col>
                                    </Row>
                                    {errors.no_skb && (
                                        <text className={style.txtError}>must be filled</text>
                                    )}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Periode SKB</Col>
                                        <Col md={9} className="colRinci">: 
                                            <Input
                                            type= "date"
                                            className="inputRinci"
                                            value={moment(values.datef_skb).format('YYYY-MM-DD')}
                                            onBlur={handleBlur("datef_skb")}
                                            onChange={handleChange("datef_skb")}
                                            />
                                            <text className='mr-1 ml-1'>To</text>
                                            <Input
                                            type= "date"
                                            className="inputRinci"
                                            value={moment(values.datel_skb).format('YYYY-MM-DD')}
                                            onBlur={handleBlur("datel_skb")}
                                            onChange={handleChange("datel_skb")}
                                            />
                                        </Col>
                                    </Row>
                                    {errors.datef_skb || errors.datel_skb ? (
                                        <text className={style.txtError}>must be filled</text>
                                    ) : values.datef_skb > values.datel_skb ? (
                                        <text className={style.txtError}>Pastikan periode diisi dengan benar</text>
                                    ) : null }
                                    <div className="modalFoot mt-3">
                                        <div></div>
                                        <div className='btnfoot'>
                                            <Button 
                                                className="mr-3" 
                                                size="md"
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
                <Modal isOpen={this.props.ikk.isLoading || this.props.dokumen.isLoading || this.props.notif.isLoading || this.props.email.isLoading} size="sm">
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
                    ) : this.state.confirm === 'rejSubmitKlm' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'appNotifDoc' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Submit, Pastikan Dokumen Lampiran Telah Diapprove</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'rejTax' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Submit, Pastikan Semua Data Telah Terisi</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'rejSubmit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'isAppDoc' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'resmail' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Kirim Email</div>
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
                <div className='row justify-content-md-center mb-4'>
                    <Button size='lg' onClick={() => this.openConfirm(false)} color='primary'>OK</Button>
                </div>
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
                   Kelengkapan Dokumen {detailIkk !== undefined && detailIkk.length > 0 && detailIkk[0].no_transaksi}
                </ModalHeader>
                <ModalBody>
                    <Container>
                        {dataDoc.length > 0 && (
                            <Row className="mt-3 mb-4">
                                <Col md={12} lg={12} className='mb-2' >
                                    <div className="btnDocIo mb-2 ml-4" >
                                        <Input 
                                            type='checkbox'
                                            checked={dataZip.length === 0 ? false : dataZip.length === dataDoc.length ? true : false}
                                            onChange={() => dataZip.length === dataDoc.length ? this.unCheckDoc('all') : this.checkDoc('all')}
                                        />
                                        Ceklis All
                                    </div>
                                </Col>
                            </Row>
                        )}
                        {dataDoc !== undefined && dataDoc.map(x => {
                            return (
                                <Row className="mt-3 mb-4">
                                    {x.path !== null ? (
                                        <Col md={12} lg={12} className='mb-2' >
                                            <div className="btnDocIo mb-2 ml-4" >
                                                <Input 
                                                    type='checkbox'
                                                    checked={dataZip.find(element => element === x.id) !== undefined ? true : false}
                                                    onChange={dataZip.find(element => element === x.id) === undefined ? () => this.checkDoc(x.id) : () => this.unCheckDoc(x.id)}
                                                />
                                                {x.desc === null ? 'Lampiran' : x.desc}
                                            </div>
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
                                        null
                                    )}
                                </Row>
                            )
                        })}
                    </Container>
                </ModalBody>
                <div className="modalFoot ml-3">
                    <div className="btnFoot">
                        <Button disabled={dataZip.length === 0} className="mr-2" color="success" onClick={this.openModalAppZip}>
                            Approve Document
                        </Button>
                        <Button disabled={dataZip.length === 0} className="mr-2" color="danger" onClick={this.openModalRejZip}>
                            Reject Document
                        </Button>
                    </div>
                    <div className="btnFoot">
                        <Button disabled={dataZip.length === 0} className="mr-2" color="primary" onClick={this.downloadDataZip}>
                            Download Document
                        </Button>
                        <Button color="secondary" onClick={this.openModalDoc}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                <ModalHeader>Dokumen</ModalHeader>
                <ModalBody>
                    <div className={style.readPdf}>
                        <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} />
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        {filter === 'available' ? (
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
                        {detailIkk.length > 0 && detailIkk[0].history.split(',').map(item => {
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
                <Modal isOpen={this.state.docCon} toggle={this.openDocCon} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div className='btnDocCon'>
                                <text>
                                    Pilih Open Kelengkapan Dokumen
                                </text>
                            </div>
                            <div className='btnDocCon mb-4'>
                                <Button color="primary" className='mr-2' onClick={() => this.openProsesModalDoc(detailIkk[0])}>Open Pop Up</Button>
                                <Button color="success" className='ml-2' onClick={() => this.openDocNewTab(detailIkk)}>Open New Tab</Button>
                            </div>
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
                                    onClick={() => tipeEmail === 'reject' ? this.rejectIkk(this.state.dataRej) : this.approveDataIkk()} 
                                    color="primary"
                                >
                                   {tipeEmail === 'reject' ? 'Reject' : 'Submit'} & Send Email
                                </Button>
                                <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modResmail} size='xl'>
                    <ModalHeader>Status Email</ModalHeader>
                    <ModalBody>
                        <Email handleData={this.getMessage} statMail={this.state.statEmail} />
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button
                                    disabled={this.state.message === '' || this.state.subject === '' ? true : false} 
                                    className="mr-2"
                                    onClick={() => this.prosesResmail()} 
                                    color="primary"
                                >
                                    Resend Email
                                </Button>
                                <Button className="mr-3" onClick={this.openModResmail}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openAppZip} toggle={this.openModalAppZip} centered={true}>
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
                                <Button color="primary" onClick={() => this.approveZip()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalAppZip}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openRejZip} toggle={this.openModalRejZip} centered={true}>
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
                                <Button color="primary" onClick={() => this.rejectZip()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalRejZip}>Tidak</Button>
                            </div>
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
    ikk: state.ikk,
    menu: state.menu,
    reason: state.reason,
    dokumen: state.dokumen,
    email: state.email
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNameApprove: approve.getNameApprove,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    getRole: user.getRole,
    getIkk: ikk.getIkk,
    getDetail: ikk.getDetail,
    getApproval: ikk.getApproval,
    getDocIkk: ikk.getDocCart,
    approveIkk: ikk.approveIkk,
    getAllMenu: menu.getAllMenu,
    getReason: reason.getReason,
    rejectIkk: ikk.rejectIkk,
    resetIkk: ikk.resetIkk,
    submitVerif: ikk.submitVerif,
    editVerif: ikk.editVerif,
    showDokumen: dokumen.showDokumen,
    approveDokumen: dokumen.approveDokumen,
    rejectDokumen: dokumen.rejectDokumen,
    confirmNewIdent: ikk.confirmNewIdent,
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    addNotif: notif.addNotif,
    getResmail: email.getResmail
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifIkk)
