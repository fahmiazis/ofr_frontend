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
import FAA from '../../components/Klaim/FAA'
import FPD from '../../components/Klaim/FPD'
import klaim from '../../redux/actions/klaim'
import Tracking from '../../components/Klaim/tracking'
import dokumen from '../../redux/actions/dokumen'
import email from '../../redux/actions/email'
import Email from '../../components/Klaim/Email'
import finance from '../../redux/actions/finance'
import ListOutlet from '../../components/Klaim/ListOutlet'
import ExcelJS from "exceljs"
import fs from "file-saver"
import NumberInput from '../../components/NumberInput'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import Select from 'react-select'
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import { MdUpload, MdDownload, MdEditSquare, MdAddCircle, MdDelete } from "react-icons/md";
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
            docHist: false,
            detailDoc: {},
            openDraft: false,
            message: '',
            subject: '',
            time: 'pilih',
            // time1: moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD'),
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            tipeEmail: '',
            dataRej: {},
            listKlaim: [],
            dataZip: [],
            dataDownload: [],
            dataFakturKl: [],
            dataOutlet: [],
            tujuan_tf: '',
            bank: '',
            digit: 0,
            rekList: [],
            isLoading: false,
            no_coa: '',
            nama_coa: '',
            options: [],
            bankList: [],
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
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
        await this.props.getOutlet(token, val.id)
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
        const {time1, time2, search, limit} = this.state
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
            await this.props.getKlaim(token, status, 'all', 'all', val, 'verif', 'undefined', cekTime1, cekTime2, search, 'all', limit)
            this.setState({filter: val, newKlaim: newKlaim})
        } else if (val === 'reject') {
            const newKlaim = []
            await this.props.getKlaim(token, status, 'all', 'all', val, 'verif', 'undefined', cekTime1, cekTime2, search, 'all', limit)
            this.setState({filter: val, newKlaim: newKlaim})
        } else if (val === 'revisi') {
            const newKlaim = []
            await this.props.getKlaim(token, status, 'all', 'all', val, 'verif', 'undefined', cekTime1, cekTime2, search, 'all', limit)
            this.setState({filter: val, newKlaim: newKlaim})
        } else {
            const newKlaim = []
            await this.props.getKlaim(token, statusAll, 'all', 'all', val, 'verif', status, cekTime1, cekTime2, search, 'all', limit)
            this.setState({filter: val, newKlaim: newKlaim})
        }
    }

    getDataLimit = async (val) => {
        const {time1, time2, filter, search} = this.state
        const level = localStorage.getItem('level')
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = filter === 'all' ? 'all' : level === '2' ? 3 : 4
        this.setState({limit: val})
        await this.props.getKlaim(token, status, 'all', 'all', filter, 'verif', 'undefined', cekTime1, cekTime2, search, 'all', val)
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
        const level = localStorage.getItem('level')
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = filter === 'all' ? 'all' : level === '2' ? 3 : 4
        await this.props.getKlaim(token, status, 'all', 'all', filter, 'verif', 'undefined', cekTime1, cekTime2, search, 'all', limit)
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
            nameTo: draftEmail.to.fullname,
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
        const {time1, time2, filter, limit} = this.state
        const level = localStorage.getItem('level')
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = filter === 'all' ? 'all' : level === '2' ? 3 : 4
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            await this.props.getKlaim(token, status, 'all', 'all', filter, 'verif', 'undefined', cekTime1, cekTime2, e.target.value, 'all', limit)
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

    approveZip = async () => {
        const token = localStorage.getItem('token')
        const {idDoc, dataZip} = this.state
        const { detailKlaim } = this.props.klaim
        const tempno = {
            no: detailKlaim[0].no_transaksi,
            name: 'Draft Pengajuan Klaim'
        }
        const data = {
            list: dataZip
        }
        await this.props.approveDokumen(token, idDoc, data)
        await this.props.getDocKlaim(token, tempno)
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
        const { detailKlaim } = this.props.klaim
        const tempno = {
            no: detailKlaim[0].no_transaksi,
            name: 'Draft Pengajuan Klaim'
        }
        const data = {
            list: dataZip
        }
        await this.props.rejectDokumen(token, idDoc, data)
        await this.props.getDocKlaim(token, tempno)
        this.setState({confirm: 'isRejDoc'})
        this.openConfirm()
        this.openModalRejZip()
    }

    openModalRejZip = () => {
        this.setState({openRejZip: !this.state.openRejZip})
    }

    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailId(token, val)
        await this.props.getFinRek(token)
        await this.props.getOutlet(token, val)
        await this.props.getFakturKl(token, val)
        const { dataRek } = this.props.finance
        const spending = dataRek[0].rek_spending
        const zba = dataRek[0].rek_zba
        const bankcoll = dataRek[0].rek_bankcoll
        const temp = [
            { label: '-Pilih-', value: '' },
            spending !== '0' ? { label: `${spending}~Rekening Spending Card`, value: 'Rekening Spending Card' } : { value: '', label: '' },
            zba !== '0' ? { label: `${zba}~Rekening ZBA`, value: 'Rekening ZBA' } : { value: '', label: '' },
            bankcoll !== '0' ? { label: `${bankcoll}~Rekening Bank Coll`, value: 'Rekening Bank Coll' } : { value: '', label: '' }
        ]

        const { idKlaim } = this.props.klaim
        this.setState({
            rekList: temp,
            isLoading: true,
            norek: idKlaim.norek_ajuan,
            tiperek: idKlaim.tiperek,
            nilai_ajuan: idKlaim.nilai_ajuan
        })

        this.selectCoa({ value: idKlaim.no_coa, label: idKlaim.nama_coa })
        this.selectTujuan(idKlaim.tujuan_tf)
        this.prepBank(idKlaim.bank_tujuan)

        const { klaimOutlet } = this.props.klaim
        const { klaimFaktur } = this.props.klaim
        this.setState({ dataOutlet: klaimOutlet,  dataFakturKl: klaimFaktur, dataRinci: idKlaim})

        setTimeout(() => {
            this.setState({ isLoading: false })
            this.openModalEdit()
        }, 1000)
    }

    selectCoa = (e) => {
        this.setState({ no_coa: e.value, nama_coa: e.label })
    }

    selectTujuan = (val) => {
        if (val === 'PMA') {
            this.setState({ tujuan_tf: val, bank: 'Bank Mandiri', digit: 13 })
        } else {
            this.setState({ tujuan_tf: val, bank: '', digit: 0 })
        }
    }

    prepBank = (val) => {
        const cekVal = val === 'Bank Mandiri' ? 'BANK MANDIRI' : val
        const { dataBank } = this.props.bank
        const data = dataBank.find(({name}) => name ===  cekVal)
        if (data === undefined) {
            this.setState()
        } else {
            this.setState({ bank: data.name, digit: data.digit })
        }
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

    printData = (val) => {
        const {detailKlaim} = this.props.klaim
        localStorage.setItem('printData', detailKlaim[0].no_transaksi)
        const newWindow = window.open(`/${val}`, '_blank', 'noopener,noreferrer')
        if (newWindow) {
            newWindow.opener = null
        }
        // this.props.history.push(`/${val}`)
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

    prosesDownloadFinance = async () => {
        const token = localStorage.getItem("token")
        const {listKlaim} = this.state
        const {newKlaim} = this.props.klaim
        const data = []
        for (let i = 0; i < listKlaim.length; i++) {
            for (let j = 0; j < newKlaim.length; j++) {
                if (newKlaim[j].id === listKlaim[i]) {
                    data.push(newKlaim[j])
                }
            }
        }
        const dataSend = {
            list: listKlaim
        }
        this.setState({dataDownload: data})
        await this.props.downloadFormVerif(token, dataSend)

        const {time1, time2, filter, limit} = this.state
        const level = localStorage.getItem('level')
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const status = filter === 'all' ? 'all' : level === '2' ? 3 : 4
        await this.props.getKlaim(token, status, 'all', 'all', filter, 'verif', 'undefined', cekTime1, cekTime2, this.state.search, 'all', limit)
        
        this.downloadExcel()
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
            {header: 'DN Area', key: 'c11'},
            {header: 'NO Surkom', key: 'c12'},
            {header: 'NO Faktur', key: 'c13'},
            {header: 'Nama Program', key: 'c14'},
            {header: 'Nominal Verifikasi', key: 'c15'},
            {header: 'PPU', key: 'c16'},
            {header: 'PA', key: 'c17'},
            {header: 'NILAI YANG DIBAYARKAN', key: 'c18'},
            {header: 'TANGGAL TRANSFER', key: 'c19'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c1: index + 1,
                c22:item.no_transaksi,
                c2: item.cost_center,
                c3: item.no_coa,
                c4: item.nama_coa,
                c5: item.keterangan,
                c6: `${moment(item.periode_awal).format('DD/MMMM/YYYY')} - ${moment(item.periode_akhir).format('DD/MMMM/YYYY')}`,
                c7: item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c8: item.bank_tujuan,
                c9: item.norek_ajuan,
                c10: item.nama_tujuan,
                c11: item.dn_area,
                c12: item.no_surkom,
                c13: item.no_faktur,
                c14: item.nama_program,
                c15: item.nominal,
                c16: item.ppu,
                c17: item.pa,
                c18: item.nilai_bayar === null || item.nilai_bayar === undefined ? 0 : item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c19: item.tanggal_transfer !== null ? `${moment(item.tanggal_transfer).format('DD/MMMM/YYYY')}` : '-',
            }
        )
        ) })

        ws.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
              cell.border = borderStyles;
            })
          })
        
        ws.columns.forEach((column, index) => {
            const lengths = column.values.map(v => v.toString().length)
            const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
            column.width = maxLength + 5
        })

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Data Ajuan Klaim ${moment().format('DD MMMM YYYY')}.xlsx`
            )
          })
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

    downloadTandaTerima = () => {
        const {listKlaim} = this.state
        const {newKlaim} = this.props.klaim
        const {dataSpvklaim} = this.props.spvklaim
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
                {header: 'No', key: 'c1'},
                {header: 'No. FPD', key: 'c2'},
                {header: 'Nama Distributor', key: 'c3'},
                {header: 'Area', key: 'c4'},
                {header: 'Channel GT/MT', key: 'c5'},
                {header: 'Nama Program', key: 'c6'},
                {header: 'No. DN', key: 'c7'},
                {header: 'Nilai DN', key: 'c8'},
                {header: 'Nilai Verifikasi', key: 'c9'},
                {header: 'Selisih', key: 'c10'},
                {header: 'No. PPU', key: 'c11'},
                {header: 'No. PA', key: 'c12'},
                {header: 'Tipe Klaim', key: 'c13'},
                {header: 'Keterangan', key: 'c14'},
                {header: 'PIC', key: 'c15'},
                {header: 'AGING/BUKAN AGING', key: 'c16'}
            ]
    
            dataDownload.map((item, index) => { return ( ws.addRow(
                {
                    c1: index + 1,
                    c2: item.no_transaksi,
                    c3: "Pinus Merah Abadi, PT",
                    c4: item.depo.area,
                    c5: item.scarea !== null ? item.scarea.channel : '',
                    c6: item.nama_program,
                    c7: item.dn_area,
                    c8: parseFloat(item.nilai_ajuan).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    c9: parseFloat(item.nominal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    c10: parseFloat(parseFloat(item.nominal) - parseFloat(item.nilai_ajuan)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    c11: item.ppu,
                    c12: item.pa,
                    c13: 'TIDAK SETTING SYSTEM & TIDAK POTONG TAGIHAN',
                    c14: item.keterangan,
                    c15: item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase() !== undefined &&
                        dataSpvklaim.find(({pic_klaim}) => pic_klaim.toLowerCase() === item.picklaim[Object.keys(item.picklaim).find(x => x.toLowerCase() === item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase())].toLowerCase()) !== undefined
                        && dataSpvklaim.find(({pic_klaim}) => pic_klaim.toLowerCase() === item.picklaim[Object.keys(item.picklaim).find(x => x.toLowerCase() === item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase())].toLowerCase()).pic_klaim,
                    c16: ''
                }
            )
            ) })

            ws.addRow(
                {
                    c7: 'TOTAL :',
                    c8: dataDownload.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.nilai_ajuan);
                    }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    c9: dataDownload.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.nominal);
                    }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    c10: parseFloat(dataDownload.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.nominal);
                    }, 0) - dataDownload.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.nilai_ajuan);
                    }, 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    c11: '',
                    c12: '',
                    c13: '',
                    c14: '',
                    c15: '',
                    c16: ''
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
                  `Tanda Terima FPD Klaim ${moment().format('DD MMMM YYYY')}.xlsx`
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
        const {dataRinci, listKlaim, tipeEmail, listMut, dataZip, listReason, dataMenu, listMenu, detailDoc, dataFakturKl, dataOutlet } = this.state
        const {dataSpvklaim} = this.props.spvklaim
        const { detailDepo, dataDepo } = this.props.depo
        const { dataReason } = this.props.reason
        const { noDis, detailKlaim, ttdKlaim, dataDoc, newKlaim, messUpload, idKlaim} = this.props.klaim
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
                                        <Button className='mr-1' onClick={this.downloadTandaTerima} color="primary" size="lg">Download Tanda Terima</Button>
                                    </div>
                                ) : (
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
                                )}
                                {accKlaim.find(item => item.toString() === level) !== undefined && (
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
                                )}
                            </div>
                            <div className={style.secEmail4}>
                                {accKlaim.find(item => item.toString() === level) !== undefined ? (
                                    <div className='rowCenter'>
                                        <Button className='mr-1' onClick={this.openModalUpload} color="warning" size="lg">Upload Template</Button>
                                        <Button className='mr-1' onClick={this.downloadAjuan} color="success" size="lg">Download Template</Button>
                                    </div>
                                ) : level === '2' ? (
                                    <div className='rowCenter'>
                                        <Button 
                                        className='mr-1' 
                                        color="success" 
                                        size="lg" 
                                        onClick={this.prosesDownloadFinance}
                                        disabled={this.state.listKlaim.length > 0 ? false : true}
                                        >
                                            Download Ajuan
                                        </Button>
                                    </div>
                                ) : (
                                    <div></ div>
                                )}
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
                                    className={style.search2}
                                    onChange={this.onSearch}
                                    value={this.state.search}
                                    onKeyPress={this.onSearch}
                                    >
                                    </Input>
                                </div>
                            </div>
                                <div className={style.tableDashboard1}>
                                    <Table bordered responsive hover className={
                                        [
                                        style.tab, 
                                        newKlaim.length > 0 && level ===  '3' &&  newKlaim.filter((item) => 
                                        item.picklaim !== null && 
                                        // Object.values(item.picklaim).find(item => item.toLowerCase() === names.toLowerCase()) !== undefined && 
                                        // item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase() !== undefined &&
                                        item.nama_coa !== undefined &&
                                        // item.picklaim[Object.keys(item.picklaim).find(x => x.toLowerCase() === item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase())].toLowerCase() === names.toLowerCase() &&
                                        item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)] !== null && 
                                        item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)].toLowerCase() === names.toLowerCase()
                                        ).length > 0 ? 'tableJurnal1' 
                                        : newKlaim.length > 0 && level ===  '23' && newKlaim.filter((item) => 
                                        item.picklaim !== null && 
                                        // Object.values(item.picklaim).find(item => item.toLowerCase() === names.toLowerCase()) !== undefined && 
                                        item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase() !== undefined &&
                                        item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)] !== null &&
                                        dataSpvklaim.find(({pic_klaim}) => pic_klaim.toLowerCase() === item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)].toLowerCase()) !== undefined &&
                                        dataSpvklaim.find(({pic_klaim}) => pic_klaim.toLowerCase() === item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)].toLowerCase()).spv_klaim.toLowerCase() === names.toLowerCase()
                                        ).length > 0 ? 'tableJurnal1' 
                                        : ''
                                    ]
                                    } 
                                        id="table-klaim">
                                        <thead>
                                            <tr>
                                                {(accKlaim.find(item => item.toString() === level) !== undefined || level === '2') && (
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
                                                <th>NO.DN AREA</th>
                                                <th>COST CENTRE</th>
                                                <th>AREA</th>
                                                <th>NO.COA</th>
                                                <th>NAMA COA</th>
                                                <th>KETERANGAN TAMBAHAN</th>
                                                <th>TGL AJUAN</th>
                                                <th>STATUS</th>
                                                <th>OPSI</th>
                                                {level === '2' && (
                                                    <th>STATUS DOWNLOAD</th>
                                                )}
                                            </tr>
                                        </thead>
                                        {accKlaim.find(x => x.toString() === level) !== undefined ? (
                                            <tbody>
                                                {level ===  '3' ? (
                                                    newKlaim.filter((item) => 
                                                    item.picklaim !== null && 
                                                    // Object.values(item.picklaim).find(item => item.toLowerCase() === names.toLowerCase()) !== undefined && 
                                                    // item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase() !== undefined &&
                                                    item.nama_coa !== undefined &&
                                                    // item.picklaim[Object.keys(item.picklaim).find(x => x.toLowerCase() === item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase())].toLowerCase() === names.toLowerCase() &&
                                                    item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)] !== null && 
                                                    item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)].toLowerCase() === names.toLowerCase()
                                                    ).map((item, index) => {
                                                    return ( 
                                                        <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                            <th>
                                                                <input 
                                                                type='checkbox'
                                                                checked={listKlaim.find(element => element === item.id) !== undefined ? true : false}
                                                                onChange={listKlaim.find(element => element === item.id) === undefined ? () => this.chekKlApp(item.id) : () => this.chekKlRej(item.id)}
                                                                />
                                                            </th>
                                                            <th>{index + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>{item.dn_area}</th>
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
                                                })
                                            ) : level ===  '23' ? (
                                                newKlaim.filter((item) => 
                                                item.picklaim !== null && 
                                                // Object.values(item.picklaim).find(item => item.toLowerCase() === names.toLowerCase()) !== undefined && 
                                                item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase() !== undefined &&
                                                item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)] !== null &&
                                                dataSpvklaim.find(({pic_klaim}) => pic_klaim.toLowerCase() === item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)].toLowerCase()) !== undefined &&
                                                dataSpvklaim.find(({pic_klaim}) => pic_klaim.toLowerCase() === item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)].toLowerCase()).spv_klaim.toLowerCase() === names.toLowerCase()
                                                ).map((item, index) => {
                                                    return (
                                                        <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                            <th>
                                                                <input 
                                                                type='checkbox'
                                                                checked={listKlaim.find(element => element === item.id) !== undefined ? true : false}
                                                                onChange={listKlaim.find(element => element === item.id) === undefined ? () => this.chekKlApp(item.id) : () => this.chekKlRej(item.id)}
                                                                />
                                                            </th>
                                                            <th>{index + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>{item.dn_area}</th>
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
                                                })
                                            ) : (
                                                newKlaim.map((item, index) => {
                                                    return (
                                                        <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                            <th>
                                                                <input 
                                                                type='checkbox'
                                                                checked={listKlaim.find(element => element === item.id) !== undefined ? true : false}
                                                                onChange={listKlaim.find(element => element === item.id) === undefined ? () => this.chekKlApp(item.id) : () => this.chekKlRej(item.id)}
                                                                />
                                                            </th>
                                                            <th>{index + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>{item.dn_area}</th>
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
                                                })
                                            )
                                            // : (
                                            //     <div>
                                            //         <div>{item.picklaim[Object.keys(item.picklaim).find(x => x.toLowerCase() === item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase())].toLowerCase()}</div>
                                            //         <div>{names.toLowerCase()}</div>
                                            //         <div>{item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase()}</div>
                                            //     </div>
                                            // )
                                                    }
                                            </tbody>
                                        ) : (
                                            <tbody>
                                                {newKlaim.map(item => {
                                                    return (
                                                        <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                            {level === '2' && (
                                                                <th>
                                                                    <input 
                                                                    type='checkbox'
                                                                    checked={listKlaim.find(element => element === item.id) !== undefined ? true : false}
                                                                    onChange={listKlaim.find(element => element === item.id) === undefined ? () => this.chekKlApp(item.id) : () => this.chekKlRej(item.id)}
                                                                    />
                                                                </th>
                                                            )}
                                                            <th>{newKlaim.indexOf(item) + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>{item.dn_area}</th>
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
                                                            {level === '2' && (
                                                                <th>{item.status_download === 1 ? 'Telah Download' : 'Belum Download'}</th>
                                                            )}
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        )}
                                        
                                    </Table>
                                    {newKlaim.length === 0 || (level ===  '3' &&  newKlaim.filter((item) => 
                                        item.picklaim !== null && 
                                        // Object.values(item.picklaim).find(item => item.toLowerCase() === names.toLowerCase()) !== undefined && 
                                        // item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase() !== undefined &&
                                        item.nama_coa !== undefined &&
                                        // item.picklaim[Object.keys(item.picklaim).find(x => x.toLowerCase() === item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase())].toLowerCase() === names.toLowerCase() &&
                                        item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)] !== null && 
                                        item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)].toLowerCase() === names.toLowerCase()
                                        ).length === 0) || (level ===  '23' && newKlaim.filter((item) => 
                                        item.picklaim !== null && 
                                        // Object.values(item.picklaim).find(item => item.toLowerCase() === names.toLowerCase()) !== undefined && 
                                        item.nama_coa.split(' ')[(item.nama_coa.split(' ').length) - 1].toLowerCase() !== undefined &&
                                        item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)] !== null &&
                                        dataSpvklaim.find(({pic_klaim}) => pic_klaim.toLowerCase() === item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)].toLowerCase()) !== undefined &&
                                        dataSpvklaim.find(({pic_klaim}) => pic_klaim.toLowerCase() === item.picklaim[Object.keys(item.picklaim).find(x => item.nama_coa.toLowerCase().indexOf(x.toLowerCase()) !== -1)].toLowerCase()).spv_klaim.toLowerCase() === names.toLowerCase()
                                        ).length === 0) && (
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
                                        <th>NO Surkom</th>
                                        <th>NO Faktur</th>
                                        <th>Nama Program</th>
                                        <th>KETERANGAN TAMBAHAN</th>
                                        <th>PERIODE</th>
                                        <th>NILAI YANG DIAJUKAN</th>
                                        <th>BANK</th>
                                        <th>NOMOR REKENING</th>
                                        <th>ATAS NAMA</th>
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
                                                    <Button className='mt-2' color="info" size='sm' onClick={() => this.prosesOpenEdit(item.id)}>Proses</Button>
                                                </th>
                                                )}
                                                <th scope="row">{detailKlaim.indexOf(item) + 1}</th>
                                                <th>{item.cost_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.dn_area}</th>
                                                <th>{item.no_surkom}</th>
                                                <th>{item.no_faktur}</th>
                                                <th>{item.nama_program}</th>
                                                <th>{item.keterangan}</th>
                                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
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
                            <ListOutlet />
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
                        <FAA />
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning" onClick={() => this.printData('klmfaa')}>
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
                    <div className="modalFoot ml-3" >
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning" onClick={() => this.printData('klmfpd')}>
                                {/* <TableStock /> */}
                                Download
                            </Button>
                            <Button color="success" onClick={this.openModalFpd}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalEdit} toggle={this.openModalEdit} size="xl">
                    <ModalHeader>
                        Update Data Klaim
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <Formik
                            initialValues = {{
                                keterangan: idKlaim.keterangan,
                                periode_awal: idKlaim.periode_awal,
                                periode_akhir: idKlaim.periode_akhir,
                                nilai_ajuan: idKlaim.nilai_ajuan,
                                norek_ajuan: idKlaim.norek_ajuan,
                                nama_tujuan: idKlaim.nama_tujuan,
                                status_npwp: idKlaim.status_npwp === 0 ? 'Tidak' : 'Ya',
                                nama_npwp: idKlaim.nama_npwp === null ? '' : idKlaim.nama_npwp,
                                no_npwp: idKlaim.no_npwp === null ? '' : idKlaim.no_npwp,
                                no_ktp: idKlaim.no_ktp === null ? '' : idKlaim.no_ktp,
                                nama_ktp: idKlaim.nama_ktp === null ? '' : idKlaim.nama_ktp,
                                no_surkom: idKlaim.no_surkom || '',
                                nama_program: idKlaim.nama_program || '',
                                dn_area: idKlaim.dn_area || '',
                                no_faktur: idKlaim.no_faktur || '',
                                ppu: idKlaim.ppu === null ? '' : idKlaim.ppu,
                                pa: idKlaim.pa === null ? '' : idKlaim.pa,
                                nominal: idKlaim.nominal === null ? '' : idKlaim.nominal,
                                kode_vendor: idKlaim.kode_vendor === null ? '' : idKlaim.kode_vendor
                            }}
                            validationSchema = {klaimSchema}
                            onSubmit={(values) => {this.prosesEditKlaim(values)}}
                            >
                            {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci2">
                                    <div>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>COA</Col>
                                                <Col md={9} className="colRinci">:
                                                    <Select
                                                        isDisabled
                                                        className="inputRinci2"
                                                        options={this.state.options}
                                                        onChange={this.selectCoa}
                                                        value={{ value: this.state.no_coa, label: this.state.nama_coa }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No COA</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled
                                                    type="text"
                                                    className="inputRinci"
                                                    value={this.state.no_coa}
                                                    onBlur={handleBlur("no_coa")}
                                                    onChange={handleChange("no_coa")}
                                                />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nama COA</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled
                                                    type="text"
                                                    className="inputRinci"
                                                    value={this.state.nama_coa}
                                                />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No Surkom</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled
                                                    type="text"
                                                    className="inputRinci"
                                                    value={values.no_surkom}
                                                    onBlur={handleBlur("no_surkom")}
                                                    onChange={handleChange("no_surkom")}
                                                />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nama Program</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled
                                                    type="text"
                                                    className="inputRinci"
                                                    value={values.nama_program}
                                                    onBlur={handleBlur("nama_program")}
                                                    onChange={handleChange("nama_program")}
                                                />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>DN Area</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled
                                                    type="text"
                                                    className="inputRinci"
                                                    value={values.dn_area}
                                                    onBlur={handleBlur("dn_area")}
                                                    onChange={handleChange("dn_area")}
                                                />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci2">
                                                <Col md={3}>Faktur</Col>
                                                <Col md={9} className="colTable" style={{ paddingLeft: '3%' }}>
                                                    {/* <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    value={values.no_faktur}
                                                    onBlur={handleBlur("no_faktur")}
                                                    onChange={handleChange("no_faktur")}
                                                    /> */}
                                                    <div className='rowBetween'>
                                                        <div>Daftar Faktur</div>
                                                        <div className='rowCenter mt-2 mb-2'>
                                                            {/* <Button size='sm' onClick={this.openUpFakturKl} className='ml-1' color='primary'><MdUpload size={20}/></Button>
                                                            <Button size='sm' onClick={this.downloadFakturKl} className='ml-1' color='warning'><MdDownload size={20}/></Button> */}
                                                        </div>
                                                    </div>
                                                    <Table striped bordered hover responsive className={[style.tab]}>
                                                        <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>No Faktur</th>
                                                                <th>Tgl Faktur</th>
                                                                <th>Value</th>
                                                                <th>Ket</th>
                                                                {/* <th>Action</th> */}
                                                            </tr>
                                                        </thead>
                                                        {dataFakturKl.length > 0 && dataFakturKl.map((item, index) => {
                                                            return (
                                                                <>
                                                                    <tbody>
                                                                        <td>{index + 1}</td>
                                                                        <td>{item.no_faktur}</td>
                                                                        <td>{moment(item.date_faktur).format('DD MMMM YYYY')}</td>
                                                                        <td>{item.val}</td>
                                                                        <td>{item.keterangan}</td>
                                                                        {/* <td className='rowCenter'>
                                                                            <Button size='sm' onClick={() => this.openDetFakturKl(this.setState({ detFakturKl: item }))} color='info'><MdEditSquare size={20}/></Button>
                                                                            <Button size='sm' onClick={() => this.confirmDelFakturKl(this.setState({ dataDel: item }))} className='ml-1' color='danger'><MdDelete size={20}/></Button>
                                                                        </td> */}
                                                                    </tbody>
                                                                </>
                                                            )
                                                        })}
                                                        <tbody>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            {/* <td>
                                                                <Button size='sm' onClick={this.openAddFakturKl} color='success'><MdAddCircle size={20}/></Button>
                                                            </td> */}
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Keterangan</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled
                                                    type="text"
                                                    className="inputRinci"
                                                    value={values.keterangan}
                                                    onBlur={handleBlur("keterangan")}
                                                    onChange={handleChange("keterangan")}
                                                />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Periode</Col>
                                                <Col md={9} className="colRinci">:
                                                    <Input
                                                        disabled
                                                        type="date"
                                                        className="inputRinci"
                                                        value={moment(values.periode_awal).format('YYYY-MM-DD')}
                                                        onBlur={handleBlur("periode_awal")}
                                                        onChange={handleChange("periode_awal")}
                                                    />
                                                    <text className='mr-1 ml-1'>To</text>
                                                    <Input
                                                        disabled
                                                        type="date"
                                                        className="inputRinci"
                                                        value={moment(values.periode_akhir).format('YYYY-MM-DD')}
                                                        onBlur={handleBlur("periode_akhir")}
                                                        onChange={handleChange("periode_akhir")}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Yang Diajukan</Col>
                                                <Col md={9} className="colRinci">:  <NumberInput
                                                    value={this.state.tujuan_tf === 'Outlet' ? (dataOutlet.length > 0 ? dataOutlet.reduce((accumulator, object) => {
                                                        return accumulator + parseFloat(object.nilai_ajuan);
                                                    }, 0) : 0) : this.state.nilai_ajuan}
                                                    // disabled={this.state.tujuan_tf === 'Outlet' ? true : false}
                                                    disabled
                                                    className="inputRinci1"
                                                    onValueChange={val => this.onEnterVal(val.floatValue)}
                                                />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Tujuan Transfer</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled={level === '5' || level === '6' ? false : true}
                                                    type="select"
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
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Bank</Col>
                                                <Col md={9} className="colRinci">:
                                                    {this.state.tujuan_tf === 'PMA' ? (
                                                        <Input
                                                            type="text"
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
                                                            value={{label: this.state.bank, value: this.state.digit}}
                                                        />
                                                    )}
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nomor Rekening</Col>
                                                <Col md={9} className="colRinci">:
                                                    {this.state.tujuan_tf === 'PMA' ? (
                                                        <Select
                                                            isDisabled
                                                            className="inputRinci2"
                                                            options={this.state.rekList}
                                                            onChange={this.selectRek}
                                                            value={{ label: this.state.norek, value: this.state.tiperek }}
                                                        />
                                                    ) : (
                                                        <Input
                                                            type="text"
                                                            className="inputRinci"
                                                            disabled
                                                            minLength={this.state.digit === null ? 10 : this.state.digit}
                                                            maxLength={this.state.digit === null ? 16 : this.state.digit}
                                                            value={values.norek_ajuan}
                                                            onBlur={handleBlur("norek_ajuan")}
                                                            onChange={handleChange("norek_ajuan")}
                                                        />
                                                    )}
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Atas Nama</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled={this.state.tujuan_tf === '' || this.state.tujuan_tf === 'PMA' ? true : false}
                                                    type="text"
                                                    className="inputRinci"
                                                    value={this.state.tujuan_tf === 'PMA' ? `PMA-${idKlaim.area}` : values.nama_tujuan}
                                                    onBlur={handleBlur("nama_tujuan")}
                                                    onChange={handleChange("nama_tujuan")}
                                                />
                                                </Col>
                                            </Row>
                                            {((dataOutlet.length > 0 && this.state.tujuan_tf === 'Outlet') 
                                            // || (dataOutlet.length > 0 && this.state.tujuan_tf === 'Outlet')
                                            ) &&
                                                <>
                                                    <div className='mt-3 mb-3'>
                                                        List Outlet
                                                    </div>
                                                    <Table striped bordered hover responsive className={style.tab}>
                                                        <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Nilai Ajuan</th>
                                                                <th>Memiliki NPWP</th>
                                                                <th>Nama NPWP</th>
                                                                <th>No NPWP</th>
                                                                <th>Nama KTP</th>
                                                                <th>No KTP</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {dataOutlet.length !== 0 && dataOutlet.map(item => {
                                                                return (
                                                                    <tr>
                                                                        <th>{dataOutlet.indexOf(item) + 1}</th>
                                                                        <td>{item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                                        <td>{item.status_npwp === 1 ? 'Ya' : 'Tidak'}</td>
                                                                        <td>{item.nama_npwp}</td>
                                                                        <td>{item.no_npwp}</td>
                                                                        <td>{item.nama_ktp}</td>
                                                                        <td>{item.no_ktp}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </>
                                            }
                                            {(this.state.tujuan_tf === 'Outlet'
                                            // || (this.state.tujuan_tf === 'Outlet')
                                            ) ? (
                                                <div className='row justify-content-md-center mb-4'>
                                                    <div className='mainRinci2' onClick={this.openKlaimOutlet}>
                                                        <CiCirclePlus size={70} className='mb-2 secondary' color='secondary' />
                                                        <div className='secondary'>Tambah Outlet</div>
                                                    </div>
                                                </div>
                                            ) : null}
                                            {/* <Row className="mb-2 rowRinci">
                                            <Col md={3}>Memiliki NPWP</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '6' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.status_npwp}
                                                onBlur={handleBlur("status_npwp")}
                                                onChange={handleChange("status_npwp")}
                                                >
                                                    <option value=''>Pilih</option>
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
                                                disabled={values.status_npwp === 'Ya' ? false : true}
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
                                                disabled={values.status_npwp === 'Ya' ? false : true}
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
                                        ) : values.status_npwp === 'Ya' && errors.no_npwp ? (
                                            <text className={style.txtError}>{errors.no_npwp}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nama Sesuai KTP</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={values.status_npwp === 'Tidak' ? false : true}
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
                                                disabled={values.status_npwp === 'Tidak' ? false : true}
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
                                        ) : values.status_npwp === 'Tidak' && errors.no_ktp ? (
                                            <text className={style.txtError}>{errors.no_ktp}</text>
                                        ) : null} */}
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
                                        <Col md={3}>PPU <text className='txtError'>{'*'}</text></Col>
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
                                    ) : values.ppu !== undefined && values.ppu.toString().length !== 10 ?
                                        <text className={style.txtError}>Mohon diisi hingga 10 digit angka</text>
                                    : null}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>PA <text className='txtError'>{'*'}</text></Col>
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
                                    ) : values.pa !== undefined && values.pa.toString().length !== 16 ?
                                        <text className={style.txtError}>Mohon diisi hingga 16 digit angka</text>
                                    : null}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Kode Vendor <text className='txtError'>{'*'}</text></Col>
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
                                    ) : values.kode_vendor !== undefined && values.kode_vendor.toString().length !== 10 ?
                                        <text className={style.txtError}>Mohon diisi hingga 10 digit</text>
                                    : null}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Nominal verifikasi <text className='txtError'>{'*'}</text></Col>
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
                                                    values.ppu !== undefined && values.ppu.toString().length !== 10 ? true 
                                                    : values.pa !== undefined && values.pa.toString().length !== 16 ? true 
                                                    : values.kode_vendor !== undefined && values.kode_vendor.toString().length !== 10 ? true
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
                <Modal isOpen={this.props.klaim.isLoading || this.state.isLoading || this.props.email.isLoading || this.props.dokumen.isLoading || this.props.notif.isLoading} size="sm">
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
            <Modal isOpen={this.state.modalConfirm} size="lg" toggle={this.openConfirm}>
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
                   Kelengkapan Dokumen
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
                                            onChange={() => dataZip.length > 0 ? this.unCheckDoc('all') : this.checkDoc('all')}
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
                                        <div></div>
                                    )}
                                </Row>
                            )
                        })}
                    </Container>
                </ModalBody>
                {/* </hr> */}
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
                        <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} dataFile={this.state.fileName}/>
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
                    <ModalHeader>Upload Data</ModalHeader>
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
    spvklaim: state.spvklaim,
    finance: state.finance,
    bank: state.bank
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
    getSpvklaim: spvklaim.getSpvklaim,
    getOutlet: klaim.getOutlet,
    downloadFormVerif: klaim.downloadFormVerif,
    getDetailId: klaim.getDetailId,
    getFinRek: finance.getFinRek,
    getOutlet: klaim.getOutlet,
    getFakturKl: klaim.getFakturKl,
    nextKlaim: klaim.nextKlaim
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifKlaim)
