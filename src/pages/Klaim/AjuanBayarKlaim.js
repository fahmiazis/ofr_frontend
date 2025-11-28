/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
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
import klaim from '../../redux/actions/klaim'
import Tracking from '../../components/Klaim/tracking'
import TableRincian from '../../components/Klaim/tableRincian'
import FAA from '../../components/Klaim/FAA'
import FPD from '../../components/Klaim/FPD'
import dokumen from '../../redux/actions/dokumen'
import email from '../../redux/actions/email'
import Email from '../../components/Klaim/Email'
import Countdown from 'react-countdown'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import ExcelJS from "exceljs"
import fs from "file-saver"
const {REACT_APP_BACKEND_URL} = process.env

const klaimSchema = Yup.object().shape({
    ppu: Yup.string().required('must be filled'),
    pa: Yup.string().required('must be filled'),
    nominal: Yup.number().required('must be filled')
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});


class AjuanBayarKlaim extends Component {
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
            limit: 100,
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
            listKlaim: [],
            modalDownload: false,
            dataDownload: [],
            no_transfer: '',
            tgl_transfer: null,
            rinciAjuan: false,
            modalSubmit: false,
            modalApplist: false,
            openDraft: false,
            message: '',
            subject: '',
            tipeTrans: '',
            tipeEmail: '',
            dataRej: {},
            tipeReject: '',
            emailReject: false,
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            dataZip: [],
            docHist: false,
            detailDoc: {},
            listPay: []
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    docHistory = (val) => {
        this.setState({detailDoc: val})
        this.setState({docHist: !this.state.docHist})
    }

    checkDoc = (val) => {
        const { dataZip } = this.state
        const {dataDoc} = this.props.klaim
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataDoc.length; i++) {
                if (dataDoc[i].path !== null) {
                    data.push(dataDoc[i].id)
                }
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

    downloadDataZip = () => {
        const {dataZip} = this.state
        const {dataDoc} = this.props.klaim
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

    openConfirm = (val) => {
        if (val === false) {
            this.setState({modalConfirm: false})
        } else {
            this.setState({modalConfirm: true})
            setTimeout(() => {
                this.setState({modalConfirm: false})
             }, 3000)
        }
    }

    rendererTime = ({ hours, minutes, seconds, completed }) => {
        return <span>{seconds}</span>
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

    approveKlaim = async () => {
        const { detailKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        const tempno = {
            no: detailKlaim[0].no_pembayaran
        }
        await this.props.approveListKlaim(token, tempno)
        this.dataSendEmail('approve')
    }

    rejectKlaim = async (val) => {
        const {listMut, listReason, listMenu, tipeReject} = this.state
        const { detailKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        const noTrans = tipeReject === 'area' ? detailKlaim[0].no_transaksi : detailKlaim[0].no_pembayaran
        let temp = ''
        for (let i = 0; i < listReason.length; i++) {
            temp += listReason[i] + '. '
        }
        const data = {
            no: noTrans,
            list: listMut,
            alasan: temp + val.alasan,
            menu: listMenu.toString(),
            type: "verif"
        }
        if (tipeReject === 'area') {
            await this.props.rejectKlaim(token, data)
            this.dataSendEmail('reject')
        } else {
            await this.props.rejectListKlaim(token, data)
            this.dataSendEmail('reject')
        }
    }

    dataSendEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { detailKlaim } = this.props.klaim
        const { draftEmail } = this.props.email
        const { message, subject, tipeTrans, dataDownload, tipeReject } = this.state
        const dataTrans = tipeTrans === 'submit' ? dataDownload : detailKlaim
        const noPemb = dataTrans.length === 0 ? null : dataTrans[0].no_pembayaran === undefined ? null : dataTrans[0].no_pembayaran
        const noTrans = tipeTrans === 'submit' ? this.state.no_transfer : noPemb
        const cc = draftEmail.cc
        const to = draftEmail.to
        const tempcc = []
        const tempto = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        to.length > 0 && to.map(item => { return (tempto.push(item.email)) })

        const app = detailKlaim[0].appList
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        
        const tipeProses = val === 'reject' ? 'reject perbaikan' : tempApp.length === app.length-1 ? 'pembayaran' : 'approve'
        const tipeRoute = val === 'reject' ? 'revklm' : tempApp.length === app.length-1 ? 'payklm' : 'listklm'
        const tipeMenu = 'list ajuan bayar'

        const tempno = {
            draft: draftEmail,
            nameTo: draftEmail.to.fullname,
            to: val === 'reject' ? tempto.toString() : draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: noTrans,
            tipe: 'klaim',
            jenis: 'ajuan',
            menu: tipeMenu + ' klaim',
            proses: tipeProses,
            route: tipeRoute
        }
        
        await this.props.sendEmail(token, tempno)
        await this.props.addNotif(token, tempno)

        if (tipeTrans === 'submit') {
            this.getDataKlaim()
            this.setState({confirm: 'submit'})
            this.openConfirm()
            this.openDraftEmail()
            this.openModalSubmit()
            this.modalSubmitPre()
        } else if (val === 'reject') {
            this.getDataKlaim()
            this.setState({confirm: 'reject'})
            this.openConfirm()
            this.openEmailReject()
            this.openModalReject()
            if (tipeReject === 'area') {
                this.openModalRinci()
            } else {
                this.modalRinciAjuan()
            }
        } else {
            this.getDataKlaim()
            this.setState({confirm: 'isApprove'})
            this.openConfirm()
            this.openDraftEmail()
            this.openModalApplist()
            this.modalRinciAjuan()
        }
    }

    prepSendEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { detailKlaim } = this.props.klaim
        const {dataDownload} = this.state
        const dataTrans = val === 'submit' ? dataDownload : detailKlaim
        const noPemb = dataTrans.length === 0 ? null : dataTrans[0].no_pembayaran === undefined ? null : dataTrans[0].no_pembayaran
        const noTrans = val === 'submit' ? this.state.no_transfer : noPemb
        const app = dataTrans[0].appList
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = tempApp.length === app.length-1 ? 'full approve' : 'approve'
        const cekMenu = 'List Ajuan Bayar (Klaim)'
        const tempno = {
            no: noTrans,
            kode: dataTrans[0].kode_plant,
            jenis: 'klaim',
            tipe: tipe,
            menu: cekMenu
        }
        const draftno = {
            no: noTrans,
            tipe: 'ajuan bayar'
        }
        this.setState({tipeTrans: val})
        this.setState({tipeEmail: 'app'})
        await this.props.getDetail(token, draftno)
        await this.props.getDraftAjuan(token, tempno)
        this.openDraftEmail()
    }

    prepRejectHo = async (val) => {
        const token = localStorage.getItem("token")
        const { detailKlaim } = this.props.klaim
        const {listMenu, listMut} = this.state
        const dataTrans = detailKlaim
        const noPemb = dataTrans.length === 0 ? null : dataTrans[0].no_pembayaran === undefined ? null : dataTrans[0].no_pembayaran
        const noTrans = noPemb
        const app = dataTrans[0].appList
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'reject'
        const cekMenu = 'List Ajuan Bayar (Klaim)'
        const tempno = {
            no: noTrans,
            kode: dataTrans[0].kode_plant,
            jenis: 'klaim',
            tipe: tipe,
            menu: cekMenu,
            datareject: listMenu[0],
            listreject: listMut
        }
        const draftno = {
            no: noTrans,
            tipe: 'ajuan bayar'
        }
        await this.props.getDetail(token, draftno)
        await this.props.getDraftAjuan(token, tempno)
        this.setState({tipeEmail: 'reject'})
        this.setState({dataRej: val})
        this.openEmailReject()
    }

    prepRejectArea = async (val) => {
        const { detailKlaim } = this.props.klaim
        const token = localStorage.getItem("token")
        const app = detailKlaim[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'reject'
        const cekMenu = 'List Ajuan Bayar (Klaim)'
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
        this.openEmailReject()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    openEmailReject = () => {
        this.setState({emailReject: !this.state.emailReject}) 
    }

    getMessage = (val) => {
        this.setState({message: val.message, subject: val.subject})
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
        const { pageKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        await this.props.nextKlaim(token, pageKlaim.nextLink)
    }

    prev = async () => {
        const { pageKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        await this.props.nextKlaim(token, pageKlaim.prevLink)
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

    componentDidMount() {
        // const level = localStorage.getItem('level')
        this.getDataKlaim()
    }

    componentDidUpdate() {
        const { isApplist, isRejectList, subBayar } = this.props.klaim
        console.log(this.state.no_transfer, this.state.tgl_transfer)
        if (isApplist === false) {
            this.setState({confirm: 'rejApprove'})
            this.openConfirm()
            this.openModalApplist()
            this.props.resetKlaim()
        } else if (isRejectList === false) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
            this.openModalReject()
            this.props.resetKlaim()
        } else if (subBayar === false) {
            this.setState({confirm: 'rejsubBayar'})
            this.openConfirm()
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
        const level = localStorage.getItem('level')
        this.changeFilter(level === '2' ? 'verif' : 'available')
    }

    getDataList = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 400, '', 1)
    }

    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    prosesDetail = async (val, tipe) => {
        const token = localStorage.getItem("token")
        if (tipe === 'detail') {
            const tempno = {
                no: val.no_transaksi
            }
            this.setState({listMut: []})
            await this.props.getDetail(token, tempno)
            await this.props.getApproval(token, tempno)
            this.openModalRinci()
        } else {
            const tempno = {
                no: val.no_pembayaran,
                tipe: 'ajuan bayar'
            }
            this.setState({listMut: []})
            await this.props.getDetail(token, tempno)
            await this.props.getApprovalList(token, tempno)
            this.modalRinciAjuan()
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

    openModalApplist = () => {
        this.setState({modalApplist: !this.state.modalApplist})
    }

    openModalSubmit = () => {
        this.setState({modalSubmit: !this.state.modalSubmit})
    }

    openSum = () => {
        this.setState({modalSum: !this.state.modalSum})
    }

    prosesEditKlaim = async (val) => {
        const token = localStorage.getItem("token")
        const {dataRinci} = this.state
        const data = {
            ppu: val.ppu,
            pa: val.pa,
            nominal: val.nominal,
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
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = level === '2'  && val === 'verif' ? 5 : 6
        const statusAll = 'all'
        const category = level === '2' && val === 'verif' ? 'verif' : 'ajuan bayar'
        const {time1, time2, search, limit} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const role = localStorage.getItem('role')
        if (val === 'available') {
            const newKlaim = []
            await this.props.getKlaim(token, status, 'all', 'all', val, category, 'undefined', cekTime1, cekTime2, search, 'all', limit)
            this.setState({filter: val, newKlaim: newKlaim})
        } else if (val === 'reject') {
            const newKlaim = []
            await this.props.getKlaim(token, status, 'all', 'all', val, category, 'undefined', cekTime1, cekTime2, search, 'all', limit)
            this.setState({filter: val, newKlaim: newKlaim})
        } else if (val === 'revisi') {
            const newKlaim = []
            await this.props.getKlaim(token, status, 'all', 'all', val, category, 'undefined', cekTime1, cekTime2, search, 'all', limit)
            this.setState({filter: val, newKlaim: newKlaim})
        } else if (val === 'verif') {
            const newKlaim = []
            await this.props.getKlaim(token, status, 'all', 'all', val, category, 'undefined', cekTime1, cekTime2, search, 'all', limit)
            this.setState({filter: val, newKlaim: newKlaim})
        } else {
            const newKlaim = []
            await this.props.getKlaim(token, statusAll, 'all', 'all', val, category, status, cekTime1, cekTime2, search, 'all', limit)
            this.setState({filter: val, newKlaim: newKlaim})
        }
    }

    getDataLimit = async (val) => {
        const {time1, time2, filter, search} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = level === '2'  && filter === 'verif' ? 5 : 6
        const category = level === '2' && filter === 'verif' ? 'verif' : 'ajuan bayar'
        this.setState({limit: val})
        await this.props.getKlaim(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, category, filter === 'all' ? status : 'undefined', cekTime1, cekTime2, search, 'all', val)
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
        const {time1, time2, filter, search, limit} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = level === '2'  && filter === 'verif' ? 5 : 6
        const category = level === '2' && filter === 'verif' ? 'verif' : 'ajuan bayar'
        await this.props.getKlaim(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, category, filter === 'all' ? status : 'undefined', cekTime1, cekTime2, search, 'all', limit)
    }

    prosesSubmit = async () => {
        const token = localStorage.getItem("token")
        const {listKlaim} = this.state
        const {dataKlaim} = this.props.klaim
        const data = []
        if (listKlaim.length > 0) {
            for (let i = 0; i < listKlaim.length; i++) {
                for (let j = 0; j < dataKlaim.length; j++) {
                    if (dataKlaim[j].no_transaksi === listKlaim[i]) {
                        data.push(dataKlaim[j])
                    }
                }
            }
            await this.props.genNomorTransfer(token)
            const {noTransfer} = this.props.klaim
            this.setState({dataDownload: data, no_transfer: noTransfer})
            this.modalSubmitPre()
        } else {
            this.setState({confirm: 'failSubChek'})
            this.openConfirm()
        }
    }

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
    }

    approveDataKlaim = async () => {
        const { detailKlaim } = this.props.klaim
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailKlaim[0].no_transaksi
        }
        await this.props.submitVerif(token, tempno)
        this.getDataKlaim()
        this.setState({confirm: 'submit'})
        this.openConfirm()
        this.openModalApprove()
        this.openModalRinci()
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const {time1, time2, filter, limit} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = level === '2'  && filter === 'verif' ? 5 : 6
        const category = level === '2' && filter === 'verif' ? 'verif' : 'ajuan bayar'
        if(e.key === 'Enter'){
            await this.props.getKlaim(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, category, filter === 'all' ? status : 'undefined', cekTime1, cekTime2, e.target.value, 'all', limit)
        }
    }

    modalRinciAjuan = () => {
        this.setState({rinciAjuan: !this.state.rinciAjuan})
    }

    updateData = async (val) => {
        const data = {
            [val.target.name]: val.target.value
        }
        console.log(data)
        this.setState(data)
    }

    submitBayar = async () => {
        const token = localStorage.getItem("token")
        const data = {
            no_transfer: this.state.no_transfer,
            tgl_transfer: this.state.tgl_transfer, 
            list: this.state.listKlaim,
        }
        const tempno = {
            no: this.state.no_transfer
        }
        await this.props.submitAjuanBayar(token, data)
        await this.props.getApprovalList(token, tempno)
        this.prepSendEmail('submit')
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

    prosesDownload = () => {
        const {listKlaim} = this.state
        const {dataKlaim} = this.props.klaim
        const data = []
        for (let i = 0; i < listKlaim.length; i++) {
            for (let j = 0; j < dataKlaim.length; j++) {
                if (dataKlaim[j].no_transaksi === listKlaim[i]) {
                    data.push(dataKlaim[j])
                }
            }
        }
        this.setState({dataDownload: data})
        this.openDownload()
    }

    openDownload = () => {
        this.setState({modalDownload: !this.state.modalDownload})
    }

    downloadFaktur = async (val) => {
        const token = localStorage.getItem('token')
        const {listPay, listKlaim} = this.state
        const {newKlaim} = this.props.klaim
        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data faktur')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        ws.columns = [
            { header: 'No Ajuan', key: 'c1' },
            { header: 'No Faktur', key: 'c2' },
            { header: 'Tgl Faktur', key: 'c3' },
            { header: 'Value', key: 'c4' },
            { header: 'Keterangan', key: 'c5' }
        ]

        console.log(listPay)
        if (val === 'partial') {

            const {detailKlaim} = this.props.klaim
            for (let j = 0; j < detailKlaim.length; j++) {
                const dataFaktur = detailKlaim[j].faktur
                if (dataFaktur.length > 0) {
                    dataFaktur.map((item, index) => {
                        return (ws.addRow(
                            {
                                c1: detailKlaim[j].no_transaksi,
                                c2: item.no_faktur,
                                c3: item.date_faktur,
                                c4: item.val,
                                c5: item.keterangan,
                            }
                        )
                        )
                    })
                }
            }

            ws.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                    cell.border = borderStyles;
                })
            })
    
            ws.columns.forEach(column => {
                const lengths = column.values.map(v => v.toString().length)
                const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
                column.width = maxLength + 5
            })
    
            workbook.xlsx.writeBuffer().then(function (buffer) {
                fs.saveAs(
                    new Blob([buffer], { type: "application/octet-stream" }),
                    `Data Faktur Klaim ${detailKlaim[0].no_pembayaran} ${moment().format('DD MMMM YYYY')}.xlsx`
                )
            })
        } else {
            const listData = val === 'ajuan bayar' ? listPay : listKlaim
            if (listData.length === 0) {
                this.setState({confirm: 'failDownload'})
                this.openConfirm()
            } else {
                for (let i = 0; i < listData.length; i++) {
                    const cekData = newKlaim.find(item => item.no_pembayaran === listData[i] || item.no_transaksi === listData[i])
                    const tempno = {
                        no: val === 'ajuan bayar' ? cekData.no_pembayaran : cekData.no_transaksi,
                        tipe: val === 'ajuan bayar' ? 'ajuan bayar' : 'klaim'
                    }
                    await this.props.getDetail(token, tempno)
                    const {detailKlaim} = this.props.klaim
                    for (let j = 0; j < detailKlaim.length; j++) {
                        const dataFaktur = detailKlaim[j].faktur
                        if (dataFaktur.length > 0) {
                            dataFaktur.map((item, index) => {
                                return (ws.addRow(
                                    {
                                        c1: detailKlaim[j].no_transaksi,
                                        c2: item.no_faktur,
                                        c3: item.date_faktur,
                                        c4: item.val,
                                        c5: item.keterangan,
                                    }
                                )
                                )
                            })
                        }
                    }
                }
    
                ws.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                    row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                        cell.border = borderStyles;
                    })
                })
        
                ws.columns.forEach(column => {
                    const lengths = column.values.map(v => v.toString().length)
                    const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
                    column.width = maxLength + 5
                })
        
                workbook.xlsx.writeBuffer().then(function (buffer) {
                    fs.saveAs(
                        new Blob([buffer], { type: "application/octet-stream" }),
                        `Data Faktur Klaim ${moment().format('DD MMMM YYYY')}.xlsx`
                    )
                })
            }
        }
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

    cekStatus = async (val) => {
        const token = localStorage.getItem("token")
        const { detailAsset } = this.props.asset
        if (val === 'DIPINJAM SEMENTARA') {
            await this.props.cekDokumen(token, detailAsset.no_asset)
        }
    }

    openModalDoc = () => {
        this.setState({modalDoc: !this.state.modalDoc, dataZip: []})
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

    chekAppList = (val) => {
        const { listKlaim } = this.state
        const {newKlaim} = this.props.klaim
        if (val === 'all') {
            const data = []
            for (let i = 0; i < newKlaim.length; i++) {
                if (newKlaim[i].status_reject !== 1) {
                    data.push(newKlaim[i].no_transaksi)
                }
            }
            this.setState({listKlaim: data})
        } else {
            listKlaim.push(val)
            this.setState({listKlaim: listKlaim})
        }
    }

    chekRejList = (val) => {
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

    chekAppPay = (val) => {
        const { listPay } = this.state
        const {newKlaim} = this.props.klaim
        if (val === 'all') {
            const data = []
            for (let i = 0; i < newKlaim.length; i++) {
                if (newKlaim[i].status_reject !== 1) {
                    data.push(newKlaim[i].no_pembayaran)
                }
            }
            this.setState({listPay: data})
        } else {
            listPay.push(val)
            this.setState({listPay: listPay})
        }
    }

    chekRejPay = (val) => {
        const {listPay} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listPay: data})
        } else {
            const data = []
            for (let i = 0; i < listPay.length; i++) {
                if (listPay[i] === val) {
                    data.push()
                } else {
                    data.push(listPay[i])
                }
            }
            this.setState({listPay: data})
        }
    }

    prepareReject = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getAllMenu(token, 'reject', 'Klaim')
        await this.props.getReason(token)
        const dataMenu = this.props.menu.dataAll
        const data = []
        dataMenu.map(item => {
            return (item.kode_menu === 'Klaim' && data.push(item))
        })
        this.setState({dataMenu: dataMenu, tipeReject: val})
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
        const {detailDoc, tipeTrans, tipeReject, dataRinci, listMut, listReason, dataMenu, listMenu, listKlaim, dataDownload, dataZip, listPay} = this.state
        const { detailDepo, dataDepo } = this.props.depo
        const { dataReason } = this.props.reason
        const { noDis, detailKlaim, ttdKlaim, ttdKlaimList, dataDoc, newKlaim } = this.props.klaim
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
                                <div className={style.titleDashboard}>Approval List Ajuan Klaim</div>
                            </div>
                            <div className={style.secEmail3}>
                                <div className={style.searchEmail2}>
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className={style.drop} isOpen={this.state.drop} toggle={this.dropDown}>
                                            <DropdownToggle caret color="light">
                                                {this.state.limit}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem className={style.item} onClick={() => this.getDataLimit(10)}>10</DropdownItem>
                                                <DropdownItem className={style.item} onClick={() => this.getDataLimit(20)}>20</DropdownItem>
                                                <DropdownItem className={style.item} onClick={() => this.getDataLimit(50)}>50</DropdownItem>
                                                <DropdownItem className={style.item} onClick={() => this.getDataLimit(100)}>100</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
                                    </div>
                                </div>
                                {this.state.filter === 'available' && level !== '2' ? (
                                    <div className={style.searchEmail2}>
                                    </div>
                                ) : (
                                    <div className={style.headEmail2}>
                                        {this.state.filter === 'verif' && level === '2' ?  (
                                            <>
                                                <Button className='mr-1' onClick={this.prosesSubmit} color="primary" size="lg">Submit</Button>
                                                {/* <Button className='mr-1' onClick={this.openModalUpload} color="warning" size="lg">Upload</Button> */}
                                            </>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                            <div className={style.secEmail4}>
                                <div className={style.searchEmail2}>
                                    <text>Filter:  </text>
                                    <Input className={style.filter} type="select" value={this.state.filter} onChange={e => this.changeFilter(e.target.value)}>
                                        <option value="all">All</option>
                                        {/* <option value="reject">Reject</option> */}
                                        <option value={level === '2' ? "verif" : 'available'}>{level === '2' ? 'Verifikasi Klaim' : 'Available approve'}</option>
                                        {/* <option value="revisi">Available Reapprove (Revisi)</option> */}
                                    </Input>
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
                                <div className={style.headEmail2}>
                                    {level === '2' &&  (
                                        <Button className='mr-1' color="success" size="lg" onClick={this.prosesDownload}>Download Ajuan</Button>
                                    )}
                                    <Button className='mr-1' color="warning" size="lg" onClick={() => this.downloadFaktur(this.state.filter === 'verif' ? 'klaim' : 'ajuan bayar')}>Download Data Faktur</Button>
                                </div>
                            </div>
                            <div className={style.tableDashboard}>
                                {this.state.filter === 'verif' && level === '2' ? (
                                    <Table bordered responsive hover className={style.tab} id="table-klaim">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input  
                                                    className='mr-2'
                                                    type='checkbox'
                                                    checked={listKlaim.length === 0 ? false : listKlaim.length === newKlaim.length ? true : false}
                                                    onChange={() => listKlaim.length === newKlaim.length ? this.chekRejList('all') : this.chekAppList('all')}
                                                    />
                                                    Select
                                                </th>
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
                                        <tbody>
                                            {newKlaim.map(item => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>
                                                            <input 
                                                            type='checkbox'
                                                            disabled={item.status_reject === 1 ? true : false}
                                                            checked={listKlaim.find(element => element === item.no_transaksi) !== undefined ? true : false}
                                                            onChange={listKlaim.find(element => element === item.no_transaksi) === undefined ? () => this.chekAppList(item.no_transaksi) : () => this.chekRejList(item.no_transaksi)}
                                                            />
                                                        </th>
                                                        <th>{newKlaim.indexOf(item) + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.depo.profit_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{item.keterangan}</th>
                                                        <th>{moment(item.start_klaim).format('DD MMMM YYYY')}</th>
                                                        <th>{item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            <Button size='sm' onClick={() => this.prosesDetail(item, 'detail')} className='mb-1 mr-1' color='success'>Detail</Button>
                                                            <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Table bordered responsive hover className={style.tab} id="table-klaim">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input  
                                                    className='mr-2'
                                                    type='checkbox'
                                                    checked={listPay.length === 0 ? false : listPay.length === newKlaim.length ? true : false}
                                                    onChange={() => listPay.length === newKlaim.length ? this.chekRejPay('all') : this.chekAppPay('all')}
                                                    />
                                                    Select
                                                </th>
                                                <th>No</th>
                                                <th>NO.Transaksi Ajuan Bayar</th>
                                                <th>Tanggal Submit Ajuan Bayar</th>
                                                <th>Tanggal Rencana Bayar</th>
                                                <th>STATUS</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newKlaim.map(item => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>
                                                            <input 
                                                            type='checkbox'
                                                            disabled={item.status_reject === 1 ? true : false}
                                                            checked={listPay.find(element => element === item.no_pembayaran) !== undefined ? true : false}
                                                            onChange={listPay.find(element => element === item.no_pembayaran) === undefined ? () => this.chekAppPay(item.no_pembayaran) : () => this.chekRejPay(item.no_pembayaran)}
                                                            />
                                                        </th>
                                                        <th>{newKlaim.indexOf(item) + 1}</th>
                                                        <th>{item.no_pembayaran}</th>
                                                        <th>{moment(item.tgl_sublist).format('DD MMMM YYYY')}</th>
                                                        <th>{moment(item.tanggal_transfer).format('DD MMMM YYYY')}</th>
                                                        <th>{item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            <Button size='sm' onClick={() => this.prosesDetail(item, 'ajuan bayar')} className='mb-1 mr-1' color='success'>Proses</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                )}
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
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailKlaim.length > 0 ? moment(detailKlaim[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
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
                                        <th>PPU</th>
                                        <th>PA</th>
                                        <th>NOMINAL VERIFIKASI</th>
                                        <th>TANGGAL TRANSFER</th>
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
                                                <th scope="row">{detailKlaim.indexOf(item) + 1}</th>
                                                <th>{item.depo.profit_center}</th>
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
                                                <th>{item.nominal === null || item.nominal === undefined ? 0 : item.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.tanggal_transfer}</th>
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
                            {this.state.filter !== 'verif' && this.state.filter !== 'available' && this.state.filter !== 'revisi' ? (
                                <div></div>
                            ) : (
                                <>
                                    <Button 
                                    className="mr-2" 
                                    disabled={
                                        this.state.filter === 'revisi'  && listMut.length > 0 ? false 
                                        : this.state.filter !== 'available' && this.state.filter !== 'verif' ? true 
                                        : listMut.length === 0 ? true : false
                                    } 
                                    color="danger" onClick={() => this.prepareReject('area')}>
                                        Reject
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
                                        <th>NAMA SESUAI KTP</th>
                                        <th>NOMOR KTP</th>
                                        <th>PPU</th>
                                        <th>PA</th>
                                        <th>NOMINAL VERIFIKASI</th>
                                        <th>TANGGAL TRANSFER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataDownload.length !== 0 && dataDownload.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{dataDownload.indexOf(item) + 1}</th>
                                                <th>{item.depo.profit_center}</th>
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
                                                <th>{item.nominal === null || item.nominal === undefined ? 0 : item.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.tanggal_transfer}</th>
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
                            <ReactHtmlToExcel
                                id="test-table-xls-button"
                                className="btn btn-warning mr-2"
                                table="table-to-xls"
                                filename={`Data Klaim ${moment().format('DD MMMM YYYY')}`}
                                sheet="Dokumentasi"
                                buttonText="Download"
                            />
                            <Button color="success" onClick={this.openModalFaa}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal size="xl" className='modalrinci' isOpen={this.state.submitPre}>
                    <ModalBody>
                        <div>
                            <div className="stockTitle">DAFTAR PENGIRIMAN DANA KE CABANG</div>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>No Transaksi</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input 
                                name='no_transfer'
                                value={this.state.no_transfer}
                                disabled
                                onChange={e => this.updateData({target: e.target, key: e.key})} 
                                className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal transaksi</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input 
                                    type='date'
                                    name='tgl_transfer'
                                    onChange={e => this.updateData({target: e.target, key: e.key})} 
                                    className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>sumber rekening</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value="1300015005005 / PT PINUS MERAH ABADI" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>nama bank</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value="BANK MANDIRI  BINA CITRA  BANDUNG" /></Col>
                            </Row>
                        </div>
                        <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab} id="table-to-xls">
                                <thead>
                                    <tr className='tbklaim'>
                                        <th>NO</th>
                                        <th>No FPD</th>
                                        <th>Cabang</th>
                                        <th>COST CENTRE</th>
                                        <th>Nama Bank</th>
                                        <th>No Rekening</th>
                                        <th>Atas Nama</th>
                                        <th>Nominal</th>
                                        <th>Keterangan</th>
                                        <th>No PO</th>
                                        <th>Area</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataDownload.length !== 0 && dataDownload.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{dataDownload.indexOf(item) + 1}</th>
                                                <th>{item.no_transaksi}</th>
                                                <th>{item.area}</th>
                                                <th>{item.depo.profit_center}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.nominal === null || item.nominal === undefined ? 0 : item.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.keterangan}</th>
                                                <th>-</th>
                                                <th>{item.depo.channel}</th>
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
                            <Button color="warning mr-2" disabled={dataDownload.length === 0 || this.state.no_transfer === '' || this.state.tgl_transfer === null ? true : false} onClick={this.openModalSubmit}>
                                Submit
                            </Button>
                            <Button color="success" onClick={this.modalSubmitPre}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal size="xl" className='modalrinci' isOpen={this.state.rinciAjuan} toggle={this.modalRinciAjuan}>
                    <ModalBody>
                        {/* <Table id="form-list"> */}
                        <div>
                            <div className="stockTitle">DAFTAR PENGIRIMAN DANA KE CABANG</div>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>No Transaksi</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input 
                                name='no_transfer'
                                value={detailKlaim.length > 0 ? detailKlaim[0].no_pembayaran : ''}
                                disabled
                                className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal transaksi</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input 
                                    name='tgl_transfer'
                                    value={detailKlaim.length > 0 ? moment(detailKlaim[0].tanggal_transfer).format('DD MMMM YYYY') : ''}
                                    disabled
                                    className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>sumber rekening</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value="1300015005005 / PT PINUS MERAH ABADI" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>nama bank</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value="BANK MANDIRI  BINA CITRA  BANDUNG" /></Col>
                            </Row>
                        </div>
                        <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab} id="table-to-xls">
                                <thead>
                                    <tr className='tbklaim'>
                                        {this.state.filter === 'all' ? null : (
                                            <th>
                                                <input  
                                                className='mr-2'
                                                type='checkbox'
                                                checked={listMut.length === 0 ? false : listMut.length === detailKlaim.length ? true : false}
                                                onChange={() => listMut.length === detailKlaim.length ? this.chekRej('all') : this.chekApp('all')}
                                                />
                                                Select
                                            </th>
                                        )}
                                        <th>NO</th>
                                        <th>No FPD</th>
                                        <th>Cabang</th>
                                        <th>COST CENTRE</th>
                                        <th>Nama Bank</th>
                                        <th>No Rekening</th>
                                        <th>Atas Nama</th>
                                        <th>Nominal</th>
                                        <th>Keterangan</th>
                                        <th>No PO</th>
                                        <th>Area</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailKlaim.length !== 0 && detailKlaim.map(item => {
                                        return (
                                            <tr>
                                                {this.state.filter === 'all' ? null : (
                                                    <th>
                                                        <input 
                                                        type='checkbox'
                                                        checked={listMut.find(element => element === item.id) !== undefined ? true : false}
                                                        onChange={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                        />
                                                    </th>
                                                )}
                                                <th scope="row">{detailKlaim.indexOf(item) + 1}</th>
                                                <th>{item.no_transaksi}</th>
                                                <th>{item.area}</th>
                                                <th>{item.depo.profit_center}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.nominal === null || item.nominal === undefined ? 0 : item.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.keterangan}</th>
                                                <th>-</th>
                                                <th>{item.depo.channel}</th>
                                            </tr>
                                            )
                                        })}
                                </tbody>
                            </Table>
                        </div>
                        <Table borderless responsive className="tabPreview mt-4">
                            <thead>
                                <tr>
                                    {ttdKlaimList.pembuat !== undefined && ttdKlaimList.pembuat.length > 0 && (
                                        <th className="buatPre">Dibuat oleh,</th>
                                    )}
                                    {ttdKlaimList.pemeriksa !== undefined && ttdKlaimList.pemeriksa.length > 0 && (
                                        <th className="buatPre">Diperiksa oleh,</th>
                                    )}
                                    {ttdKlaimList.mengetahui !== undefined && ttdKlaimList.mengetahui.length > 0 && (
                                        <th className="buatPre">Diketahui oleh,</th>
                                    )}
                                    {ttdKlaimList.penyetuju !== undefined && ttdKlaimList.penyetuju.length > 0 && (
                                        <th className="buatPre">Disetujui oleh,</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="tbodyPre">
                                <tr>
                                    {ttdKlaimList.pembuat !== undefined && ttdKlaimList.pembuat.length > 0 && (
                                        <td className="restTable">
                                            <Table bordered responsive className="divPre">
                                                    <thead>
                                                        <tr>
                                                            {ttdKlaimList.pembuat !== undefined && ttdKlaimList.pembuat.map(item => {
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
                                                        {ttdKlaimList.pembuat !== undefined && ttdKlaimList.pembuat.map(item => {
                                                            return (
                                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                            )
                                                        })}
                                                        </tr>
                                                    </tbody>
                                            </Table>
                                        </td>
                                    )}
                                    {ttdKlaimList.pemeriksa !== undefined && ttdKlaimList.pemeriksa.length > 0 && (
                                        <td className="restTable">
                                            <Table bordered responsive className="divPre">
                                                    <thead>
                                                        <tr>
                                                            {ttdKlaimList.pemeriksa !== undefined && ttdKlaimList.pemeriksa.map(item => {
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
                                                            {ttdKlaimList.pemeriksa !== undefined && ttdKlaimList.pemeriksa.map(item => {
                                                                return (
                                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                                )
                                                            })}
                                                        </tr>
                                                    </tbody>
                                            </Table>
                                        </td>
                                    )}
                                    {ttdKlaimList.mengetahui !== undefined && ttdKlaimList.mengetahui.length > 0 && (
                                        <td className="restTable">
                                            <Table bordered responsive className="divPre">
                                                    <thead>
                                                        <tr>
                                                            {ttdKlaimList.mengetahui !== undefined && ttdKlaimList.mengetahui.map(item => {
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
                                                            {ttdKlaimList.mengetahui !== undefined && ttdKlaimList.mengetahui.map(item => {
                                                                return (
                                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                                )
                                                            })}
                                                        </tr>
                                                    </tbody>
                                            </Table>
                                        </td>
                                    )}
                                    {ttdKlaimList.penyetuju !== undefined && ttdKlaimList.penyetuju.length > 0 && (
                                        <td className="restTable">
                                            <Table bordered responsive className="divPre">
                                                    <thead>
                                                        <tr>
                                                            {ttdKlaimList.penyetuju !== undefined && ttdKlaimList.penyetuju.map(item => {
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
                                                            {ttdKlaimList.penyetuju !== undefined && ttdKlaimList.penyetuju.map(item => {
                                                                return (
                                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                                )
                                                            })}
                                                        </tr>
                                                    </tbody>
                                            </Table>
                                        </td>
                                    )}
                                </tr>
                            </tbody>
                        </Table>
                        {/* </Table> */}
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div>
                            <Button color='primary' onClick={() => this.props.history.push('/formlistklm')}>Download</Button>
                            <Button className='ml-2' color='warning' onClick={() => this.downloadFaktur('partial')}>Download Data Faktur</Button>
                        </div>
                        <div className="btnFoot">
                            {this.state.filter === 'all' ? null : (
                                <>
                                    <Button color="success mr-2" onClick={this.openModalApplist}>
                                        Approve
                                    </Button>
                                    <Button 
                                    color="danger"
                                    disabled={this.state.filter === 'revisi'  && listMut.length > 0 ? false : this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false} 
                                    onClick={() => this.prepareReject('ho')}>
                                        Reject
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
                                nominal: dataRinci.nominal === null ? '' : dataRinci.nominal
                            }}
                            validationSchema = {klaimSchema}
                            onSubmit={(values) => {this.prosesEditKlaim(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
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
                                                value={values.periode_awal}
                                                onBlur={handleBlur("periode_awal")}
                                                onChange={handleChange("periode_awal")}
                                                />
                                                <text className='mr-1 ml-1'>To</text>
                                                <Input
                                                type= "date" 
                                                disabled
                                                className="inputRinci"
                                                value={values.periode_akhir}
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
                                            <Col md={3}>Nilai Yang Diajukan</Col>
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
                                        <Col md={3}>PA</Col>
                                        <Col md={9} className="colRinci">:  <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.pa}
                                            onBlur={handleBlur("pa")}
                                            onChange={handleChange("pa")}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>NOMINAL</Col>
                                        <Col md={9} className="colRinci">:  <Input
                                            type= "text" 
                                            className="inputRinci"
                                            value={values.nominal}
                                            onBlur={handleBlur("nominal")}
                                            onChange={handleChange("nominal")}
                                            />
                                        </Col>
                                    </Row>
                                    <div className="modalFoot mt-3">
                                        <div></div>
                                        <div className='btnfoot'>
                                            <Button 
                                                className="mr-3" 
                                                size="md" 
                                                disabled={ values.ppu === '' ? true 
                                                : values.pa === '' ? true 
                                                : values.nominal === '' ? true 
                                                : false } 
                                                color="primary" 
                                                onClick={handleSubmit}>
                                                Save
                                            </Button>
                                            <Button className="" size="md" color="secondary" onClick={() => this.openModalAdd()}>Close</Button>
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
                    onSubmit={(values) => {tipeReject === 'area' ? this.prepRejectArea(values) : this.prepRejectHo(values)}}
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
                                    {listReason.length === 0 && (values.alasan === '.' || values.alasan === '')? (
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
                <Modal isOpen={this.props.klaim.isLoading || this.props.email.isLoading || this.props.notif.isLoading} size="sm">
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
                                <Button color="primary" onClick={() => this.approveDataKlaim()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalApplist} toggle={this.openModalApplist} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve list ajuan bayar    
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.prepSendEmail('approve')}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApplist}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalSubmit} toggle={this.openModalSubmit} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk submit list ajuan bayar    
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.submitBayar()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalSubmit}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            <Modal isOpen={this.state.modalConfirm} toggle={() => this.openConfirm(false)}>
                <ModalBody>
                    <Countdown renderer={this.rendererTime} date={Date.now() + 3000} />
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
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit, pastikan nilai ppu, pa, dan nominal telah diisi</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejSubmit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit, pastikan nilai ppu, pa, dan nominal telah diisi</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejsubBayar' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>No Transaksi telah terdaftar</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failSubChek' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className={[style.sucUpdate, style.green]}>Pilih data klaim yg ingin diajukan terlebih dahulu</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failDownload' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Download</div>
                                <div className={[style.sucUpdate, style.green]}>Pilih data klaim yg ingin didownload terlebih dahulu</div>
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
                   Kelengkapan Dokumen {detailKlaim !== undefined && detailKlaim.length > 0 && detailKlaim[0].no_transaksi}
                </ModalHeader>
                <ModalBody>
                <Container>
                    {dataDoc.length >= 0 && (
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

                    {dataDoc.length !== 0 && dataDoc.map(x => {
                        return (
                            x.path !== null &&
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
                                        <div className='mt-3'>
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
                <ModalFooter>
                    <Button disabled={dataZip.length === 0} className="mr-2" color="primary" onClick={this.downloadDataZip}>
                        Download Document
                    </Button>
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
            <Modal isOpen={this.state.openDraft} size='xl'>
                <ModalHeader>Email Pemberitahuan</ModalHeader>
                <ModalBody>
                    <Email handleData={this.getMessage}/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button
                                disabled={this.state.message === '' ? true : false} 
                                className="mr-2"
                                onClick={() => tipeTrans === 'submit' ? this.dataSendEmail('submit')
                                : this.approveKlaim()
                                } 
                                color="primary"
                            >
                                {tipeTrans === 'submit' ? 'Send Email' : 'Approve & Send Email'}
                            </Button>
                            {tipeTrans === 'submit' ? null : (
                                <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                            )}
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.emailReject} size='xl'>
                <ModalHeader>Email Pemberitahuan</ModalHeader>
                <ModalBody>
                    <Email handleData={this.getMessage} cekData={this.state.listMut} tipe={'reject'}/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button
                                disabled={this.state.message === '' ? true : false} 
                                className="mr-2"
                                onClick={() => this.rejectKlaim(this.state.dataRej)} 
                                color="primary"
                            >
                                Reject & Send Email
                            </Button>
                            <Button className="mr-3" onClick={this.openEmailReject}>Cancel</Button>
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
    klaim: state.klaim,
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
    getKlaim: klaim.getKlaim,
    getDetail: klaim.getDetail,
    getApproval: klaim.getApproval,
    getDocKlaim: klaim.getDocCart,
    getAllMenu: menu.getAllMenu,
    getReason: reason.getReason,
    rejectKlaim: klaim.rejectKlaim,
    resetKlaim: klaim.resetKlaim,
    submitVerif: klaim.submitVerif,
    editVerif: klaim.editVerif,
    submitAjuanBayar: klaim.submitAjuanBayar,
    getApprovalList: klaim.getApprovalList,
    approveListKlaim: klaim.approveListKlaim,
    rejectListKlaim: klaim.rejectListKlaim,
    showDokumen: dokumen.showDokumen,
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    getDraftAjuan: email.getDraftAjuan,
    genNomorTransfer: klaim.genNomorTransfer,
    addNotif: notif.addNotif,
    nextKlaim: klaim.nextKlaim
}

export default connect(mapStateToProps, mapDispatchToProps)(AjuanBayarKlaim)
