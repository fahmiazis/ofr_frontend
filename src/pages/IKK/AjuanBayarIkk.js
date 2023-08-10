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
// import notif from '../redux/actions/notif'
import Pdf from "../../components/Pdf"
import depo from '../../redux/actions/depo'
import {default as axios} from 'axios'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import ikk from '../../redux/actions/ikk'
import Tracking from '../../components/Ikk/tracking'
import TableRincian from '../../components/Ikk/tableRincian'
import Formikk from '../../components/Ikk/formikk'
import FPD from '../../components/Ikk/FPD'
import dokumen from '../../redux/actions/dokumen'
import email from '../../redux/actions/email'
import Email from '../../components/Ikk/Email'
const {REACT_APP_BACKEND_URL} = process.env

const ikkSchema = Yup.object().shape({
    ppu: Yup.string().required('must be filled'),
    pa: Yup.string().required('must be filled'),
    nominal: Yup.number().required('must be filled')
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});


class AjuanBayarIkk extends Component {
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
            listIkk: [],
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
            emailReject: false
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

    getApproveStock = async (value) => { 
        const token = localStorage.getItem('token')
        await this.props.getApproveStock(token, value.no, value.nama)
    }

    approveIkk = async () => {
        const { detailIkk } = this.props.ikk
        const token = localStorage.getItem('token')
        const tempno = {
            no: detailIkk[0].no_pembayaran
        }
        await this.props.approveListIkk(token, tempno)
        this.dataSendEmail('approve')
    }

    rejectIkk = async (val) => {
        const {listMut, listReason, listMenu, tipeReject} = this.state
        const { detailIkk } = this.props.ikk
        const token = localStorage.getItem('token')
        const noTrans = tipeReject === 'area' ? detailIkk[0].no_transaksi : detailIkk[0].no_pembayaran
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
            await this.props.rejectIkk(token, data)
            this.dataSendEmail('reject')
        } else {
            await this.props.rejectListIkk(token, data)
            this.dataSendEmail('reject')
        }
    }

    dataSendEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { detailIkk } = this.props.ikk
        const { draftEmail } = this.props.email
        const { message, subject, tipeTrans, dataDownload, tipeReject } = this.state
        const dataTrans = tipeTrans === 'submit' ? dataDownload : detailIkk
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
        const tempno = {
            nameTo: draftEmail.to.username,
            to: val === 'reject' ? tempto.toString() : draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: noTrans,
            tipe: 'ikk',
            jenis: 'ajuan'
        }
        await this.props.sendEmail(token, tempno)
        if (tipeTrans === 'submit') {
            this.getDataIkk()
            this.setState({confirm: 'submit'})
            this.openConfirm()
            this.openDraftEmail()
            this.openModalSubmit()
            this.modalSubmitPre()
        } else if (val === 'reject') {
            this.getDataIkk()
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
            this.getDataIkk()
            this.setState({confirm: 'isApprove'})
            this.openConfirm()
            this.openDraftEmail()
            this.openModalApplist()
            this.modalRinciAjuan()
        }
    }

    prepSendEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { detailIkk } = this.props.ikk
        const {dataDownload} = this.state
        const dataTrans = val === 'submit' ? dataDownload : detailIkk
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
        console.log(tipe)
        const cekMenu = 'List Ajuan Bayar (IKK)'
        const tempno = {
            no: noTrans,
            kode: dataTrans[0].kode_plant,
            jenis: 'ikk',
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
        const { detailIkk } = this.props.ikk
        const dataTrans = detailIkk
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
        const cekMenu = 'List Ajuan Bayar (IKK)'
        const tempno = {
            no: noTrans,
            kode: dataTrans[0].kode_plant,
            jenis: 'ikk',
            tipe: tipe,
            menu: cekMenu
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
        const { detailIkk } = this.props.ikk
        const token = localStorage.getItem("token")
        const app = detailIkk[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'reject'
        const cekMenu = 'List Ajuan Bayar (IKK)'
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
        // const level = localStorage.getItem('level')
        this.getDataIkk()
    }

    componentDidUpdate() {
        const { isApplist, isRejectList } = this.props.ikk
        console.log(this.state.no_transfer, this.state.tgl_transfer)
        if (isApplist === false) {
            this.setState({confirm: 'rejApprove'})
            this.openConfirm()
            this.openModalApplist()
            this.props.resetIkk()
        } else if (isRejectList === false) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
            this.openModalReject()
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
        const level = localStorage.getItem('level')
        this.setState({limit: value === undefined ? 10 : value.limit})
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
        const level = localStorage.getItem('level')
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

    prosesEditIkk = async (val) => {
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
        const {dataIkk, noDis} = this.props.ikk
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = level === '2'  && val === 'verif' ? 5 : 6
        const statusAll = 'all'
        const category = level === '2' && val === 'verif' ? 'verif' : 'ajuan bayar'
        const role = localStorage.getItem('role')
        if (val === 'available') {
            const newIkk = []
            await this.props.getIkk(token, status, 'all', 'all', val, category)
            this.setState({filter: val, newIkk: newIkk})
        } else if (val === 'reject') {
            const newIkk = []
            await this.props.getIkk(token, status, 'all', 'all', val, category)
            this.setState({filter: val, newIkk: newIkk})
        } else if (val === 'revisi') {
            const newIkk = []
            await this.props.getIkk(token, status, 'all', 'all', val, category)
            this.setState({filter: val, newIkk: newIkk})
        } else if (val === 'verif') {
            const newIkk = []
            await this.props.getIkk(token, status, 'all', 'all', val, category)
            this.setState({filter: val, newIkk: newIkk})
        } else {
            const newIkk = []
            await this.props.getIkk(token, statusAll, 'all', 'all', val, category, status)
            this.setState({filter: val, newIkk: newIkk})
        }
    }

    prosesSubmit = async () => {
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
        this.modalSubmitPre()
    }

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
    }

    approveDataIkk = async () => {
        const { detailIkk } = this.props.ikk
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailIkk[0].no_transaksi
        }
        await this.props.submitVerif(token, tempno)
        this.getDataIkk()
        this.setState({confirm: 'submit'})
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
            list: this.state.listIkk,
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
            this.getDataIkk()
        }
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

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    openProsesModalDoc = async (val) => {
        const token = localStorage.getItem("token")
        const tempno = {
            no: val.no_transaksi,
            name: 'Draft Pengajuan Ikk'
        }
        await this.props.getDocIkk(token, tempno)
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

    chekAppList = (val) => {
        const { listIkk } = this.state
        const {newIkk} = this.props.ikk
        if (val === 'all') {
            const data = []
            for (let i = 0; i < newIkk.length; i++) {
                if (newIkk[i].status_reject !== 1) {
                    data.push(newIkk[i].no_transaksi)
                }
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

    prepareReject = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getAllMenu(token, 'reject', 'IKK')
        await this.props.getReason(token)
        const dataMenu = this.props.menu.dataAll
        const data = []
        dataMenu.map(item => {
            return (item.kode_menu === 'Ikk' && data.push(item))
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
        const {tipeTrans, tipeReject, dataRinci, listMut, listReason, dataMenu, listMenu, listIkk, dataDownload} = this.state
        const { detailDepo, dataDepo } = this.props.depo
        const { dataReason } = this.props.reason
        const { noDis, detailIkk, ttdIkk, ttdIkkList, dataDoc, newIkk } = this.props.ikk
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
                                <div className={style.titleDashboard}>Approval List Ajuan Bayar Ikk</div>
                            </div>
                            <div className={style.secEmail3}>
                                {this.state.filter === 'available' && level !== '2' ? (
                                    null
                                ) : (
                                    <div className={style.headEmail2}>
                                        {this.state.filter === 'verif' && level === '2' ? (
                                            <>
                                                <Button className='mr-1' onClick={this.prosesSubmit} color="primary" size="lg">Submit</Button>
                                                {/* <Button className='mr-1' onClick={this.openModalUpload} color="warning" size="lg">Upload</Button> */}
                                            </>
                                        ) : null}
                                        <Button className='mr-1' color="success" size="lg" onClick={this.prosesDownload}>Download</Button>
                                    </div>
                                )}
                                <div></div>
                            </div>
                            <div className={[style.secEmail4]}>
                                <div className={style.searchEmail2}>
                                    <text>Filter:  </text>
                                    <Input className={style.filter} type="select" value={this.state.filter} onChange={e => this.changeFilter(e.target.value)}>
                                        <option value="all">All</option>
                                        {/* <option value="reject">Reject</option> */}
                                        <option value={level === '2' ? "verif" : 'available'}>{level === '2' ? 'Verifikasi Ikk' : 'Available approve'}</option>
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
                            <div className={style.tableDashboard}>
                                {this.state.filter === 'verif' && level === '2' ? (
                                    <Table bordered responsive hover className={style.tab} id="table-klaim">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input  
                                                    className='mr-2'
                                                    type='checkbox'
                                                    checked={listIkk.length === 0 ? false : listIkk.length === newIkk.length ? true : false}
                                                    onChange={() => listIkk.length === newIkk.length ? this.chekRejList('all') : this.chekAppList('all')}
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
                                                <th>PERIODE</th>
                                                <th>STATUS</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newIkk.map(item => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>
                                                            <input 
                                                            type='checkbox'
                                                            isabled={item.status_reject === 1 ? true : false}
                                                            checked={listIkk.find(element => element === item.no_transaksi) !== undefined ? true : false}
                                                            onChange={listIkk.find(element => element === item.no_transaksi) === undefined ? () => this.chekAppList(item.no_transaksi) : () => this.chekRejList(item.no_transaksi)}
                                                            />
                                                        </th>
                                                        <th>{newIkk.indexOf(item) + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.cost_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{item.keterangan}</th>
                                                        <th>{moment(item.periode_awal).format('MMMM YYYY') === moment(item.periode_akhir).format('MMMM YYYY') ? moment(item.periode_awal).format('MMMM YYYY') : moment(item.periode_awal).format('MMMM YYYY') - moment(item.periode_akhir).format('MMMM YYYY')}</th>
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
                                                <th>No</th>
                                                <th>NO.Transaksi Ajuan Bayar</th>
                                                <th>Tanggal Submit Ajuan Bayar</th>
                                                <th>STATUS</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newIkk.map(item => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>{newIkk.indexOf(item) + 1}</th>
                                                        <th>{item.no_pembayaran}</th>
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
                        <div className='mb-3'>
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
                                                <th scope="row">{detailIkk.indexOf(item) + 1}</th>
                                                <th>{item.cost_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.keterangan}</th>
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
                                                <th>{item.tanggal_transfer !== null ? moment(item.tanggal_transfer).format('DD/MMMM/YYYY') : '-'}</th>
                                                <th>{item.jenis_pph}</th>
                                                <th>{item.history !== null && item.history.split(',').reverse()[0]}</th>
                                            </tr>
                                            )
                                        })}
                                </tbody>
                            </Table>
                    </ModalBody>
                    <div className="modalFoot ml-3">
                        <div className="btnFoot">
                            <Button className="mr-2" color="info"  onClick={() => this.prosesModalFpd()}>FPD</Button>
                            <Button className="mr-2" color="warning"  onClick={() => this.openModalFaa()}>Form Ikk</Button>
                            <Button color="primary"  onClick={() => this.openProsesModalDoc(detailIkk[0])}>Dokumen</Button>
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
                                        : listMut.length === 0 ? true : false} 
                                    color="danger" 
                                    onClick={() => this.prepareReject('area')}>
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
                                                <th>{item.cost_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.keterangan}</th>
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
                                                <th>{item.pph}</th>
                                                <th>{item.nilai_utang}</th>
                                                <th>{item.nilai_bayar === null || item.nilai_bayar === undefined ? 0 : item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.tanggal_transfer}</th>
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
                            <ReactHtmlToExcel
                                id="test-table-xls-button"
                                className="btn btn-warning mr-2"
                                table="table-to-xls"
                                filename={`Data Ikk ${moment().format('DD MMMM YYYY')}`}
                                sheet="Dokumentasi"
                                buttonText="Download"
                            />
                            <Button color="success" onClick={this.openDownload}>
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
                                    <tr>
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
                                                <th>{item.cost_center}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
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
                                value={detailIkk.length > 0 ? detailIkk[0].no_pembayaran : ''}
                                disabled
                                className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal transaksi</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input 
                                    name='tgl_transfer'
                                    value={detailIkk.length > 0 ? moment(detailIkk[0].tanggal_transfer).format('DD MMMM YYYY') : ''}
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
                                                <th scope="row">{detailIkk.indexOf(item) + 1}</th>
                                                <th>{item.no_transaksi}</th>
                                                <th>{item.area}</th>
                                                <th>{item.cost_center}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
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
                                    <th className="buatPre">Dibuat oleh,</th>
                                    <th className="buatPre">Diketahui oleh,</th>
                                    <th className="buatPre">Disetujui oleh,</th>
                                </tr>
                            </thead>
                            <tbody className="tbodyPre">
                                <tr>
                                    <td className="restTable">
                                        <Table bordered responsive className="divPre">
                                                <thead>
                                                    <tr>
                                                        {ttdIkkList.pembuat !== undefined && ttdIkkList.pembuat.map(item => {
                                                            return (
                                                                <th className="headPre">
                                                                    <div className="mb-3">{item.nama === null || item.status === null ? "-" : item.status === '0' ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')})` : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')})`}</div>
                                                                    <div>{item.nama === null ? "-" : item.nama}</div>
                                                                </th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                    {ttdIkkList.pembuat !== undefined && ttdIkkList.pembuat.map(item => {
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
                                                        {ttdIkkList.mengetahui !== undefined && ttdIkkList.mengetahui.map(item => {
                                                            return (
                                                                <th className="headPre">
                                                                    <div className="mb-3">{item.nama === null || item.status === null ? "-" : item.status === '0' ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')})` : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')})`}</div>
                                                                    <div>{item.nama === null ? "-" : item.nama}</div>
                                                                </th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {ttdIkkList.mengetahui !== undefined && ttdIkkList.mengetahui.map(item => {
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
                                                        {ttdIkkList.penyetuju !== undefined && ttdIkkList.penyetuju.map(item => {
                                                            return (
                                                                <th className="headPre">
                                                                    <div className="mb-3">{item.nama === null || item.status === null ? "-" : item.status === '0' ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')})` : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')})`}</div>
                                                                    <div>{item.nama === null ? "-" : item.nama}</div>
                                                                </th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {ttdIkkList.penyetuju !== undefined && ttdIkkList.penyetuju.map(item => {
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
                        {/* </Table> */}
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div>
                            <ReactHtmlToExcel
                                id="test-table-xls-button"
                                className="btn btn-warning mr-2"
                                table="form-list"
                                filename={`Data Ikk ${moment().format('DD MMMM YYYY')}`}
                                sheet="Dokumentasi"
                                buttonText="Download"
                            />
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
                    <ModalBody>
                        <Formikk />
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
                            validationSchema = {ikkSchema}
                            onSubmit={(values) => {this.prosesEditIkk(values)}}
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
                <Modal isOpen={this.props.ikk.isLoading || this.props.email.isLoading} size="sm">
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
                                <Button color="primary" onClick={() => this.approveDataIkk()}>Ya</Button>
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
                                : this.approveIkk()
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
                    <Email handleData={this.getMessage}/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button
                                disabled={this.state.message === '' ? true : false} 
                                className="mr-2"
                                onClick={() => this.rejectIkk(this.state.dataRej)} 
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
    getAllMenu: menu.getAllMenu,
    getReason: reason.getReason,
    rejectIkk: ikk.rejectIkk,
    resetIkk: ikk.resetIkk,
    submitVerif: ikk.submitVerif,
    editVerif: ikk.editVerif,
    submitAjuanBayar: ikk.submitAjuanBayar,
    getApprovalList: ikk.getApprovalList,
    approveListIkk: ikk.approveListIkk,
    rejectListIkk: ikk.rejectListIkk,
    showDokumen: dokumen.showDokumen,
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    getDraftAjuan: email.getDraftAjuan,
    // notifStock: notif.notifStock
}

export default connect(mapStateToProps, mapDispatchToProps)(AjuanBayarIkk)
