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
import menu from '../../redux/actions/menu'
import reason from '../../redux/actions/reason'
import notif from '../../redux/actions/notif'
import Pdf from "../../components/Pdf"
import depo from '../../redux/actions/depo'
import email from '../../redux/actions/email'
import dokumen from '../../redux/actions/dokumen'
import {default as axios} from 'axios'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import ikk from '../../redux/actions/ikk'
import Tracking from '../../components/Ikk/tracking'
import FPD from '../../components/Ikk/FPD'
import Formikk from '../../components/Ikk/formikk'
import Email from '../../components/Ikk/Email'
import JurnalArea from '../../components/Ikk/JurnalArea'
import TableRincian from '../../components/Ikk/tableRincian'
import NumberInput from '../../components/NumberInput'
import Countdown from 'react-countdown'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
const {REACT_APP_BACKEND_URL} = process.env
const userAppArea = ['10', '11', '12', '15']

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

const emailSchema = Yup.object().shape({
    message: Yup.string().required()
});

const nilaiSchema = Yup.object().shape({
    nilai_verif: Yup.string().required(),
    tgl_getdana: Yup.date().required()
});

class IKK extends Component {
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
            collap: false,
            tipeCol: '',
            formDis: false,
            history: false,
            upload: false,
            openDraft: false,
            openAppDoc: false,
            openRejDoc: false,
            message: '',
            time: 'pilih',
            time1: moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            subject: '',
            docHist: false,
            detailDoc: {},
            docCon: false,
            tipeEmail: '',
            dataRej: {},
            jurnalArea: false,
            tipeNilai: 'all',
            modalNilai: false,
            nilai_verif: 0,
            tglGetDana: null,
            dataZip: [],
            listReject: [],
            statEmail: '',
            modResmail: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    openConfirm = (val) => {
        if (val === false) {
            this.setState({modalConfirm: false})
        } else {
            this.setState({modalConfirm: true})
            // setTimeout(() => {
            //     this.setState({modalConfirm: false})
            //  }, 3000)
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

    checkDoc = (val) => {
        const { dataZip } = this.state
        const {dataDoc} = this.props.ikk
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

    rejectIkk = async (val) => {
        const {listMut, listReason, listMenu, listReject} = this.state
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
            type_reject: listReject[0]
        }
        console.log(data)
        await this.props.rejectIkk(token, data)
        this.dataSendEmail('reject')
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

    prosesModalFaa = () => {
        const {detailIkk} = this.props.ikk
        let total = 0
        for (let i = 0; i < detailIkk.length; i++) {
            total += parseFloat(detailIkk[i].nilai_ajuan)
        }
        this.setState({totalfpd: total})
        this.openModalFaa()
    }

    prosesModalFpd = () => {
        const {detailIkk} = this.props.ikk
        let total = 0
        for (let i = 0; i < detailIkk.length; i++) {
            total += parseFloat(detailIkk[i].nilai_ajuan)
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

    async componentDidMount() {
        const token = localStorage.getItem("token")
        const dataCek = localStorage.getItem('docData')
        const {item, type} = (this.props.location && this.props.location.state) || {}
        if (type === 'approve') {
            this.getDataIkk()
            // this.prosesDetail(item)
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
        const { isApprove, isReject  } = this.props.ikk
        const { isSend } = this.props.email
        if (isApprove === false) {
            this.setState({confirm: 'rejApprove'})
            this.openConfirm()
            this.openModalApprove()
            this.props.resetIkk()
        } else if (isReject === false) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
            this.openModalReject()
            this.props.resetIkk()
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

    printData = (val) => {
        this.props.history.push(`/${val}`)
    }

    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    getDataIkk = async (value) => {
        const level = localStorage.getItem('level')
        this.setState({limit: value === undefined ? 10 : value.limit})
        const cekLevArea = userAppArea.find(item => item === level) !== undefined
        this.changeFilter(cekLevArea ? 'available' : 'all')
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
        const app = val[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
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
            const tipe = tempApp.length === app.length ? 'full approve' : 'approve'
            const cekMenu = 'Pengajuan Ikk (IKK)'
            if (val[0].status_reject === 1) {
                tempno = {
                    ...tempno,
                    jenis: 'ikk',
                    tipe: 'reject',
                    typeReject: val[0].status_transaksi === 0 ? 'pembatalan' : 'perbaikan',
                    menu: cekMenu
                }
            } else {
                tempno = {
                    ...tempno,
                    jenis: 'ikk',
                    tipe: tipe,
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
        const {dataIkk, noDis} = this.props.ikk
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = val === 'bayar' || val === 'completed' ? 8 : 2
        const statusAll = 'all'
        const {time1, time2} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const role = localStorage.getItem('role')
        if (val === 'all') {
            const newIkk = []
            await this.props.getIkk(token, statusAll, 'all', 'all', val, 'approve', 'undefined', cekTime1, cekTime2)
            this.setState({filter: val, newIkk: newIkk})
        } else {
            const newIkk = []
            await this.props.getIkk(token, status, 'all', 'all', val, 'approve', 'undefined', cekTime1, cekTime2)
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
        const token = localStorage.getItem("token")
        const status = filter === 'all' ? 'all' : filter === 'bayar' || filter === 'completed' ? 8 : 2
        await this.props.getIkk(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, 'approve', 'undefined', cekTime1, cekTime2)
    }

    prosesSubmitPre = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAssetAll(token, 1000, '', 1, 'asset')
        this.modalSubmitPre()
    }

    updateTransaksi = async (val) => {
        
    }

    approveDataIkk = async () => {
        const level = localStorage.getItem('level')
        const { detailIkk } = this.props.ikk
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailIkk[0].no_transaksi
        }
        await this.props.approveIkk(token, tempno)
        // if (level === '11') {
        //     // this.getDataIkk()
        //     // this.setState({confirm: 'isApprove'})
        //     // this.openConfirm()
        //     // this.openModalApprove()
        //     // this.openModalRinci()
        // } else {
        this.dataSendEmail()
        // }
    }

    cekDataDoc = () => {
        const { dataDoc } = this.props.ikk
        const level = localStorage.getItem("level")
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

    dataSendEmail = async (val) => {
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
        const app = detailIkk[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipeProses = val === 'reject' && listReject[0] === 'pembatalan' ? 'reject pembatalan' : val === 'reject' && listReject[0] !== 'pembatalan' ? 'reject perbaikan' : tempApp.length === app.length-1 ? 'verifikasi' : 'approve'
        const tipeRoute = val === 'reject' && listReject[0] === 'pembatalan' ? 'ikk' : val === 'reject' && listReject[0] !== 'pembatalan' ? 'revikk' : tempApp.length === app.length-1 ? 'veriffinikk' : 'ikk'
        const tipeMenu = tempApp.length === app.length-1 ? 'verifikasi ikk' : 'pengajuan ikk'
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
        this.openDraftEmail()
        if (val === 'reject') {
            this.getDataIkk()
            this.setState({confirm: 'reject'})
            this.openConfirm()
            this.openModalReject()
            this.openModalRinci()
        } else {
            this.getDataIkk()
            this.setState({confirm: 'isApprove'})
            this.openConfirm()
            this.openModalApprove()
            this.openModalRinci()
        }
    }

    prepApprove = async () => {
        const { detailIkk } = this.props.ikk
        const token = localStorage.getItem("token")
        const app = detailIkk[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = tempApp.length === app.length-1 ? 'full approve' : 'approve'
        const tempno = {
            no: detailIkk[0].no_transaksi,
            kode: detailIkk[0].kode_plant,
            jenis: 'ikk',
            tipe: tipe,
            menu: 'Pengajuan Ikk (IKK)'
        }
        await this.props.getDraftEmail(token, tempno)
        this.setState({tipeEmail: 'app'})
        this.openDraftEmail()
    }

    prepReject = async (val) => {
        const { detailIkk } = this.props.ikk
        const { listReject } = this.state
        const token = localStorage.getItem("token")
        const app = detailIkk[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'reject'
        const tempno = {
            no: detailIkk[0].no_transaksi,
            kode: detailIkk[0].kode_plant,
            jenis: 'ikk',
            tipe: tipe,
            typeReject: listReject[0],
            menu: 'Pengajuan Ikk (IKK)'
        }
        await this.props.getDraftEmail(token, tempno)
        this.setState({tipeEmail: 'reject'})
        this.setState({dataRej: val})
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const {time1, time2, filter} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = filter === 'all' ? 'all' : filter === 'bayar' || filter === 'completed' ? 8 : 2
        if(e.key === 'Enter'){
            await this.props.getIkk(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, 'approve', 'undefined', cekTime1, cekTime2, e.target.value)
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
        const newWindow = window.open('ikk', '_blank', 'noopener,noreferrer')
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
        const token = localStorage.getItem("token")
        const {detailIkk} = this.props.ikk
        const tempno = {
            no: detailIkk[0].no_transaksi,
            id: val.id
        }
        await this.props.getDetailId(token, val.id)
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

    prosesJurnalArea = async (val) => {
        const token = localStorage.getItem("token")
        const tempno = {
            no: val.no_transaksi
        }
        await this.props.getDetail(token, tempno)
        this.openJurnalArea()
    }

    openJurnalArea = () => {
        this.setState({jurnalArea: !this.state.jurnalArea})
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

    rejectApp = (val) => {
        const data = [val]
        this.setState({listReject: data})
    }

    rejectRej = (val) => {
        const {listReject} = this.state
        const data = []
        for (let i = 0; i < listReject.length; i++) {
            if (listReject[i] === val) {
                data.push()
            } else {
                data.push(listReject[i])
            }
        }
        this.setState({listReject: data})
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

    separator = (val) => {
        if (val === undefined || val === null) {
            return 0
        } else {
            return val.item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
    }

    getMessage = (val) => {
        this.setState({message: val.message, subject: val.subject})
        console.log(val)
    }

    prepareReject = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAllMenu(token, 'reject', 'IKK')
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

    prosesModalBukti = async () => {
        const token = localStorage.getItem("token")
        const { detailIkk } = this.props.ikk
        const tempno = {
            no: detailIkk[0].no_pembayaran
        }
        await this.props.getDocBayar(token, tempno)
        this.modalBukti()
    }

    modalBukti = () => {
        this.setState({openBukti: !this.state.openBukti})
    }

    openModalStock = () => {
        this.setState({modalStock: !this.state.modalStock})
    }

    dropDown = () => {
        this.setState({drop: !this.state.drop})
    }

    selTipe = (val) => {
        this.setState({tipeNilai: val})
    }

    openNilaiVerif = () => {
        this.setState({modalNilai: !this.state.modalNilai})
    }

    updateNilai = async (val) => {
        const token = localStorage.getItem('token')
        const {tipeNilai, nilai_verif, tglGetDana} = this.state
        const {detailIkk} = this.props.ikk
        const tempno = {
            no: detailIkk[0].no_transaksi
        }
        const data = {
            type: tipeNilai,
            nilai: tipeNilai === 'all' ? nilai_verif : val.nilai_verif,
            id: tipeNilai === 'all' ? detailIkk[0].id : val.id,
            no: detailIkk[0].no_transaksi,
            tglGetDana: tipeNilai === 'all' ? tglGetDana : val.tgl_getdana
        }
        await this.props.updateNilaiVerif(token, data)
        if (tipeNilai === 'all') {
            await this.props.getDetail(token, tempno)
            this.setState({confirm: 'inputVerif', nilai_verif: 0})
            this.openConfirm()
            this.openNilaiVerif()
            this.getDataIkk()
        } else {
            await this.props.getDetail(token, tempno)
            this.setState({confirm: 'inputVerif', nilai_verif: 0})
            this.openConfirm()
            this.openModalEdit()
            this.getDataIkk()
        }
        
    }

    updateData = async (val) => {
        const data = {
            [val.target.name]: val.target.value
        }
        console.log(data)
        this.setState(data)
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {listReject, listMut, listReason, dataMenu, listMenu, detailDoc, tipeEmail, filter, dataZip} = this.state
        const { detailDepo, dataDepo } = this.props.depo
        const { dataReason } = this.props.reason
        const { draftEmail } = this.props.email
        const { noDis, detailIkk, ttdIkk, dataDoc, newIkk, idIkk, docBukti } = this.props.ikk
        const changeSepar = toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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
                                <div className={style.titleDashboard}>Pengajuan IKK</div>
                            </div>
                            <div className={[style.secEmail4]}>
                                {level === '5' || level === '6' ? (
                                    <>
                                        <Button onClick={() => this.goRoute('cartikk')} color="info" size="lg">Create</Button>
                                        <div className={style.searchEmail2}>
                                            <text>Filter:  </text>
                                            <Input className={style.filter} type="select" value={filter} onChange={e => this.changeFilter(e.target.value)}>
                                                <option value="all">All</option>
                                                <option value="bayar">Telah Bayar</option>
                                                <option value="completed">Selesai</option>
                                                <option value="reject">Reject</option>
                                                {/* <option value="revisi">Available Reapprove (Revisi)</option> */}
                                            </Input>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={style.searchEmail2}>
                                        </div>
                                        <div className={style.searchEmail2}>
                                            <text>Filter:  </text>
                                            <Input className={style.filter} type="select" value={this.state.filter} onChange={e => this.changeFilter(e.target.value)}>
                                                <option value="all">All</option>
                                                <option value="reject">Reject</option>
                                                <option value="available">Available Approve</option>
                                                <option value="bayar">Telah Bayar</option>
                                                <option value="completed">Selesai</option>
                                                {/* <option value="revisi">Available Reapprove (Revisi)</option> */}
                                            </Input>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={[style.secEmail4]}>
                                <div className='rowCenter'>
                                    <div className='rowCenter'>
                                        <Input className={style.filter3} type="select" value={this.state.time} onChange={e => this.changeTime(e.target.value)}>
                                            <option value="all">Time (All)</option>
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
                                    <Table bordered responsive hover className={style.tab} id="table-ikk">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>NO.AJUAN</th>
                                                <th>COST CENTRE</th>
                                                <th>AREA</th>
                                                <th>NO.COA</th>
                                                <th>NAMA COA</th>
                                                <th>TGL AJUAN</th>
                                                <th>STATUS</th>
                                                <th>HISTORY</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newIkk.length > 0 && newIkk.filter(({ end_ikk }) => (filter !== 'bayar' && filter !== 'completed') || (filter === 'completed' && end_ikk !== null) || (filter === 'bayar' && end_ikk === null)).map((item, index) => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>{index + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.depo.profit_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{moment(item.start_ikk).format('DD MMMM YYYY')}</th>
                                                        {/* <th>-</th> */}
                                                        <th>
                                                            {
                                                                item.status_transaksi === 0 ? 'Reject Pembatalan' 
                                                                : item.status_reject === 1 ? 'Reject Perbaikan'
                                                                : item.status_reject === 0 ? 'Telah Revisi'
                                                                : item.status_transaksi === 8 ? 'Transaksi selesai' 
                                                                : item.status_transaksi === 4 ? 'Verifikasi Finance' 
                                                                : item.status_transaksi === 5 ? 'Verifikasi Tax' 
                                                                : item.status_transaksi === 2 && 'Approval Area'
                                                            }
                                                        </th>
                                                        <th>{item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>{filter === 'bayar' ? 'Proses' : 'Detail'}</Button>
                                                            <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {(newIkk.length === 0 || (filter === 'completed' && newIkk.find(({end_ikk}) => end_ikk !== null) === undefined) || (filter === 'bayar' && newIkk.find(({end_ikk}) => end_ikk === null) === undefined)) && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab} id="table-ikk">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>NO.AJUAN</th>
                                                <th>COST CENTRE</th>
                                                <th>AREA</th>
                                                <th>NO.COA</th>
                                                <th>JENIS TRANSAKSI</th>
                                                <th>TGL AJUAN</th>
                                                <th>STATUS</th>
                                                <th>HISTORY</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newIkk.length > 0 && newIkk.filter(({ end_ikk }) => (filter !== 'bayar' && filter !== 'completed') || (filter === 'completed' && end_ikk !== null) || (filter === 'bayar' && end_ikk === null)).map((item, index) => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>{index + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.depo.profit_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.sub_coa}</th>
                                                        <th>{moment(item.start_ikk).format('DD MMMM YYYY')}</th>
                                                        <th>
                                                            {
                                                                item.status_transaksi === 0 ? 'Reject Pembatalan' 
                                                                : item.status_reject === 1 ? 'Reject Perbaikan'
                                                                : item.status_reject === 0 ? 'Telah Revisi'
                                                                : item.status_transaksi === 8 ? 'Transaksi selesai' 
                                                                : item.status_transaksi === 4 ? 'Verifikasi Finance' 
                                                                : item.status_transaksi === 5 ? 'Verifikasi Tax' 
                                                                : item.status_transaksi === 2 && 'Approval Area'
                                                            }
                                                        </th>
                                                        <th>{item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>{filter === 'available' ? 'Proses' : 'Detail'}</Button>
                                                            <Button size='sm' className='mb-1 mr-1' onClick={() => this.prosesJurnalArea(item)} color='primary'>Jurnal Area</Button>
                                                            <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {(newIkk.length === 0 || (filter === 'completed' && newIkk.find(({end_ikk}) => end_ikk !== null) === undefined) || (filter === 'bayar' && newIkk.find(({end_ikk}) => end_ikk === null) === undefined)) && (
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
                <Modal size="xl" className='modalrinci' isOpen={this.state.modalNilai}>
                    <ModalBody>
                        <div>
                            <div className="stockTitle">INPUT NILAI YANG DITERIMA</div>
                        </div>
                        <div className='rowGeneral'>
                            <Button onClick={() => this.selTipe('all')} color={this.state.tipeNilai === 'all' ? 'primary' : 'secondary'}>Input Total</Button>
                            <Button className='ml-2' onClick={() => this.selTipe('parcial')} color={this.state.tipeNilai === 'all' ? 'secondary' : 'primary'}>Input Detail</Button>
                        </div>
                        <Row className="ptStock inputStock">
                            <Col md={3} xl={3} sm={3}>Nilai Total Diterima</Col>
                            <Col md={4} xl={4} sm={4} className="inputStock">:
                                <Input 
                                name='nilai_verif'
                                disabled={this.state.tipeNilai !== 'all'}
                                onChange={e => this.updateData({target: e.target, key: e.key})} 
                                // value = {detailIkk[0].type_nilaiverif === 'all' ? detailIkk[0].nilai_verif : }
                                className="ml-3" />
                            </Col>
                        </Row>
                        <Row className="ptStock inputStock">
                            <Col md={3} xl={3} sm={3}>Tgl Pengambilan Dana</Col>
                            <Col md={4} xl={4} sm={4} className="inputStock">:
                                <Input 
                                type='date'
                                name='tglGetDana'
                                disabled={this.state.tipeNilai !== 'all'}
                                onChange={e => this.updateData({target: e.target, key: e.key})} 
                                // value = {detailIkk[0].type_nilaiverif === 'all' ? detailIkk[0].nilai_verif : }
                                className="ml-3" />
                            </Col>
                        </Row>
                        <Button 
                            color='primary' 
                            disabled={this.state.nilai_verif === 0 || this.state.tglGetDana === null || this.state.tipeNilai !== 'all'} 
                            onClick={this.updateNilai} >
                                Update
                        </Button>
                        <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab} id="table-to-xls">
                                <thead>
                                    <tr className='tbklaim'>
                                        <th>NO</th>
                                        <th>NO.AJUAN</th>
                                        <th>COST CENTRE</th>
                                        <th>AREA</th>
                                        <th>NO.COA</th>
                                        <th>NAMA COA</th>
                                        <th>KETERANGAN TAMBAHAN</th>
                                        <th>Nilai Ajuan</th>
                                        <th>Nilai Bayar</th>
                                        <th>Nilai Diterima</th>
                                        <th>Opsi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailIkk.length !== 0 && detailIkk.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{detailIkk.indexOf(item) + 1}</th>
                                                <th>{item.no_transaksi}</th>
                                                <th>{item.depo.profit_center}</th>
                                                <th>{item.area}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.keterangan}</th>
                                                <th>{item.nilai_ajuan !== null && item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.nilai_bayar === null ? item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>
                                                    {/* <Input 
                                                    name='nilai_verif'
                                                    disabled
                                                    value={item.nilai_verif}
                                                    onChange={e => this.updateData({target: e.target, key: e.key})} 
                                                    // value = {detailIkk[0].type_nilaiverif === 'all' ? detailIkk[0].nilai_verif : }
                                                    /> */}
                                                    {item.nilai_verif !== null && item.nilai_verif.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                </th>
                                                <th><Button onClick={() => this.getRincian(item)} color='primary' disabled={this.state.tipeNilai === 'all'}>Update</Button></th>
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
                            <Button color="success" onClick={this.openNilaiVerif}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalEdit} size="lg">
                    <ModalHeader>
                        Input Detail Nilai Diterima
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <Formik
                            initialValues = {{
                                id: idIkk.id,
                                keterangan: idIkk.keterangan || '',
                                periode_awal: idIkk.periode_awal || '',
                                periode_akhir: idIkk.periode_akhir || '',
                                nilai_ajuan: parseFloat(idIkk.nilai_ajuan) || 0,
                                no_transaksi: idIkk.no_transaksi || '',
                                nama_tujuan: idIkk.nama_tujuan || '',
                                status_npwp: idIkk.status_npwp === 0 ? 'Tidak' : idIkk.status_npwp === 1 && 'Ya',
                                nama_npwp: idIkk.nama_npwp || '',
                                no_coa: idIkk.no_coa || '',
                                nama_coa: idIkk.nama_coa || '',
                                nama_ktp: idIkk.nama_ktp || '',
                                no_surkom: idIkk.no_surkom || '',
                                nilai_verif: idIkk.nilai_verif || 0,
                                nilai_bayar: idIkk.nilai_bayar === null ? parseFloat(idIkk.nilai_ajuan) : parseFloat(idIkk.nilai_bayar),
                                tgl_getdana: idIkk.tgl_getdana || '',
                            }}
                            validationSchema = {nilaiSchema}
                            onSubmit={(values) => {this.updateNilai(values)}}
                            >
                            {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci2">
                                    <div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No Ajuan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.no_transaksi}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No COA</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.no_coa}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nama COA</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.nama_coa}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.keterangan}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Yang Diajukan</Col>
                                            <Col md={9} className="colRinci">:  <NumberInput 
                                                    disabled
                                                    value={values.nilai_ajuan}
                                                    className="inputRinci1"
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Yang Dibayarkan</Col>
                                            <Col md={9} className="colRinci">:  <NumberInput 
                                                    disabled
                                                    value={values.nilai_bayar === null ? values.nilai_ajuan : values.nilai_bayar}
                                                    className="inputRinci1"
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Yang Diterima</Col>
                                            <Col md={9} className="colRinci">:  <NumberInput 
                                                    value={values.nilai_verif}
                                                    className="inputRinci1"
                                                    onValueChange={val => setFieldValue("nilai_verif", val.floatValue)}
                                                />
                                            </Col>
                                        </Row>
                                        {values.nilai_verif === 0 ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Tgl Pengambilan Dana</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                    type='date'
                                                    value={values.tgl_getdana === '' ? '' : moment(values.tgl_getdana).format('YYYY-MM-DD')}
                                                    className="inputRinci1"
                                                    onBlur={handleBlur("tgl_getdana")}
                                                    onChange={handleChange("tgl_getdana")}
                                                />
                                            </Col>
                                        </Row>
                                        {values.tgl_getdana === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                    </div>
                                    <div className="modalFoot mt-3">
                                        <div></div>
                                        <div className='btnfoot'>
                                            <Button 
                                                className="mr-3" 
                                                size="md" 
                                                disabled={values.nilai_verif === 0}
                                                color="primary" 
                                                onClick={handleSubmit}>
                                                Update
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
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailIkk.length > 0 ? moment(detailIkk[0].start_ikk).format('DD MMMM YYYY') : ''} /></Col>
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
                                        <th>Jenis Vendor</th>
                                        <th>Transaksi Ber PPN</th>
                                        <th>Penanggung Pajak</th>
                                        <th>DPP</th>
                                        <th>PPN</th>
                                        <th>NILAI YANG DIBAYARKAN</th>
                                        <th>Vendor Memiliki SKB</th>
                                        <th>TANGGAL TRANSFER</th>
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
                                                <th>{item.depo.profit_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.uraian}</th>
                                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.status_npwp === 0 ? '' : 'Ya'}</th>
                                                <th>{item.status_npwp === 0 ? '' : item.nama_npwp}</th>
                                                <th>{item.status_npwp === 0 ? '' : item.no_npwp}</th>
                                                <th>{item.jenis_vendor}</th>
                                                <th>{item.type_transaksi}</th>
                                                 <th>{item.penanggung_pajak}</th>
                                                <th>{item.dpp}</th>
                                                <th>{item.ppn}</th>
                                                <th>{item.nilai_bayar}</th>
                                                <th>{item.stat_skb === 'ya' ? 'Ya' : '-'}</th>
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
                            <Button className="mr-2" color="warning"  onClick={() => this.prosesModalFaa()}>Form Ikk</Button>
                            <Button className="mr-2" color="primary"  onClick={() => this.openDocCon()}>Dokumen</Button>
                            {detailIkk.length > 0 && detailIkk[0].status_transaksi === 8 && (
                                <Button color="success"  onClick={() => this.prosesModalBukti()}>Bukti Bayar</Button>
                            )}
                        </div>
                        <div className="btnFoot">
                            {filter === 'available' || 
                            (detailIkk[0] !== undefined && 
                            (detailIkk[0].status_transaksi === 0 || 
                            detailIkk[0].status_transaksi === 8)) ? null : (
                                <Button className='mr-2' color="warning"  onClick={() => this.prosesStatEmail(detailIkk)}>Status Email</Button>
                            )}
                            {this.state.filter !== 'available' && this.state.filter !== 'revisi' ? (
                                <>
                                    {(filter === 'bayar' || filter === 'completed') && level === '5' && (
                                        <Button className="mr-2"  color="danger" onClick={this.openNilaiVerif}>
                                            Input Nilai Diterima
                                        </Button>
                                    )}
                                    <Button className='' onClick={() => this.prosesJurnalArea(detailIkk[0])} color='success'>Jurnal</Button>
                                </>
                                
                            ) : (
                                <>
                                    <Button className="mr-2" disabled={this.state.filter === 'revisi'  && listMut.length > 0 ? false : this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false} color="danger" onClick={this.prepareReject}>
                                        Reject
                                    </Button>
                                    <Button color="success" disabled={this.state.filter === 'revisi'  ? false : this.state.filter !== 'available' ? true : false} onClick={this.cekDataDoc}>
                                        Approve
                                    </Button>
                                </>
                            )}
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
                            <Button className="mr-2" color="warning" onClick={() => this.printData('ikkfaa')}>
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
                            <Button className="mr-2" color="warning" onClick={() => this.printData('ikkfpd')}>
                                {/* <TableStock /> */}
                                Download
                            </Button>
                            <Button color="success" onClick={this.openModalFpd}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal size="lg" isOpen={this.state.jurnalArea} toggle={this.openJurnalArea}>
                    <ModalBody>
                        <JurnalArea />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="mr-2" color="warning" onClick={() => this.printData('jurnalikk')}>
                            {/* <TableStock /> */}
                            Download
                        </Button>
                        <Button color="success" onClick={this.openJurnalArea}>
                            Close
                        </Button>
                    </ModalFooter>
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
                                <div className='mb-2 titStatus'>Pilih reject :</div>
                                    <div className="ml-2">
                                        <Input
                                        addon
                                        type="checkbox"
                                        checked= {listReject.find(element => element === 'perbaikan') !== undefined ? true : false}
                                        onClick={listReject.find(element => element === 'perbaikan') === undefined ? () => this.rejectApp('perbaikan') : () => this.rejectRej('perbaikan')}
                                        />  Perbaikan
                                    </div>
                                    <div className="ml-2">
                                        <Input
                                        addon
                                        type="checkbox"
                                        checked= {listReject.find(element => element === 'pembatalan') !== undefined ? true : false}
                                        onClick={listReject.find(element => element === 'pembatalan') === undefined ? () => this.rejectApp('pembatalan') : () => this.rejectRej('pembatalan')}
                                        />  Pembatalan
                                    </div>
                                <div className='ml-2'>
                                    {listReject.length === 0 ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                                <div className='mt-3 mb-2 titStatus'>Pilih alasan :</div>
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
                                <div className='ml-2'>
                                    {listMenu.length === 0 ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                                <div className={style.btnApprove}>
                                    <Button 
                                    color="primary" 
                                    disabled={((values.alasan === '.' || values.alasan === '') && listReason.length === 0) || (listMenu.length === 0 || listReject.length === 0) ? true : false}
                                    onClick={handleSubmit}>Submit</Button>
                                    <Button className='ml-2' color="secondary" onClick={this.openModalReject}>Close</Button>
                                </div>
                            </div>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.ikk.isLoading || this.props.menu.isLoading || this.props.reason.isLoading || this.props.email.isLoading || this.props.dokumen.isLoading} size="sm">
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
                                {/* {level === '11' ? (
                                    <Button color="primary" onClick={() => this.approveDataIkk()}>Ya</Button>
                                ) : (
                                    <Button color="primary" onClick={() => this.prepApprove()}>Ya</Button>
                                )} */}
                                <Button color="primary" onClick={() => this.prepApprove()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
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
            <Modal isOpen={this.state.modalConfirm} toggle={() => this.openConfirm(false)}>
                <ModalBody>
                    {/* <Countdown renderer={this.rendererTime} date={Date.now() + 3000} /> */}
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
                    ) : this.state.confirm === 'appNotifDoc' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Approve, Pastikan Dokumen Lampiran Telah Diapprove</div>
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
                    ) : this.state.confirm === 'resmail' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Kirim Email</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'inputVerif' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update Nilai Yang Diterima</div>
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
                                onClick={() => tipeEmail === 'reject' ? this.rejectIkk(this.state.dataRej) : this.approveDataIkk()} 
                                color="primary"
                            >
                                {tipeEmail === 'reject' ? 'Reject' : 'Approve'} & Send Email
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
            <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                <ModalHeader>Dokumen</ModalHeader>
                <ModalBody>
                    <div className={style.readPdf}>
                        <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} dataFile={this.state.fileName} />
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
                        {detailIkk.length > 0 && detailIkk[0].history !== null && detailIkk[0].history.split(',').map(item => {
                            return (
                                item !== null && item !== 'null' && 
                                <Button className='mb-2' color='info'>{item}</Button>
                            )
                        })}
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
                <Modal size="xl" isOpen={this.state.openBukti} toggle={this.modalBukti}>
                <ModalHeader>
                   Kelengkapan Bukti Bayar
                </ModalHeader>
                <ModalBody>
                <Container>
                        {docBukti !== undefined && docBukti.map(x => {
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
                                        </Col>
                                    ) : (
                                        null
                                    )}
                                </Row>
                            )
                        })}
                    </Container>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.modalBukti}>
                        Close
                    </Button>
                </ModalFooter>
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
    email: state.email,
    dokumen: state.dokumen
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
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    showDokumen: dokumen.showDokumen,
    approveDokumen: dokumen.approveDokumen,
    rejectDokumen: dokumen.rejectDokumen,
    getDetailId: ikk.getDetailId,
    updateNilaiVerif: ikk.updateNilaiVerif,
    getAllNotif: notif.getAllNotif,
    addNotif: notif.addNotif,
    getResmail: email.getResmail,
    getDocBayar: ikk.getDocBayar,
}

export default connect(mapStateToProps, mapDispatchToProps)(IKK)
