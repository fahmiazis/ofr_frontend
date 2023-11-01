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
import coa from '../../redux/actions/coa'
import {BsCircle} from 'react-icons/bs'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList} from 'react-icons/fa'
import Sidebar from "../../components/Header";
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import style from '../../assets/css/input.module.css'
import placeholder from  "../../assets/img/placeholder.png"
import user from '../../redux/actions/user'
import klaim from '../../redux/actions/klaim'
import bank from '../../redux/actions/bank'
import finance from '../../redux/actions/finance'
import {connect} from 'react-redux'
import moment from 'moment'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import Select from 'react-select'
import notif from '../../redux/actions/notif'
import Pdf from "../../components/Pdf"
import depo from '../../redux/actions/depo'
import {default as axios} from 'axios'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import dokumen from '../../redux/actions/dokumen'
import email from '../../redux/actions/email'
import Email from '../../components/Klaim/Email'
import NumberInput from '../../components/NumberInput'
import Countdown from 'react-countdown'
const {REACT_APP_BACKEND_URL} = process.env

const addSchema = Yup.object().shape({
    keterangan: Yup.string().required("must be filled"),
    periode_awal: Yup.date().required("must be filled"),
    periode_akhir: Yup.date().required('must be filled'),
    nilai_ajuan: Yup.string().required("must be filled"),
    status_npwp: Yup.string().required('must be filled'),
    no_surkom: Yup.string().required("must be filled"),
    nama_program: Yup.string().required("must be filled"),
    dn_area: Yup.string().required("must be filled")
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});


class CartKlaim extends Component {
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
            modalPreview: false,
            view: 'card',
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
            newStock: [],
            options: [],
            bankList: [],
            no_coa: '',
            nama_coa: '',
            modalFpd: false,
            modalFaa: false,
            totalfpd: 0,
            bank: '',
            digit: 0,
            rekList: [],
            norek: '',
            tiperek: '',
            tujuan_tf: '',
            openDraft: false,
            subject: '',
            message: '',
            isLoading: false,
            dataDelete: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
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
        } else if (
            type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
            type !== 'application/vnd.ms-excel' && 
            type !== 'application/pdf' && 
            type !== 'application/x-7z-compressed' && 
            type !== 'application/vnd.rar' && 
            type !== 'application/zip' && type !== 'application/x-zip-compressed' && 
            type !== 'application/octet-stream' && type !== 'multipart/x-zip' && 
            type !== 'application/x-rar-compressed' && type !== 'image/jpeg' && type !== 'image/png'
            ) {
            this.setState({errMsg: 'Invalid file type. Only excel, pdf, zip, and rar files are allowed.'})
            this.uploadAlert()
        } else {
            const { noklaim } = this.props.klaim
            const { detail } = this.state
            const tempno = {
                no: noklaim
            }
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocKlaim(token, noklaim, detail.id, data)
            // this.props.uploadDocKlaim(token, tempno, data)
        }
    }

    openModalFaa = () => {
        this.setState({modalFaa: !this.state.modalFaa})
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

    approveStock = async () => {
        const {dataItem} = this.state
        const token = localStorage.getItem('token')
        await this.props.approveStock(token, dataItem.no_stock)
        await this.props.getApproveStock(token, dataItem.no_stock, dataItem.kode_plant.split('').length === 4 ? 'stock opname' : 'stock opname HO')
        await this.props.notifStock(token, dataItem.no_stock, 'approve', 'HO', null, null)
    }

    rejectStock = async (value) => {
        const {dataItem, listMut} = this.state
        const token = localStorage.getItem('token')
        const data = {
            alasan: value.alasan,
            listMut: listMut
        }
        await this.props.rejectStock(token, dataItem.no_stock, data)
        await this.props.getDetailStock(token, dataItem.id)
        await this.props.getApproveStock(token, dataItem.no_stock, dataItem.kode_plant.split('').length === 4 ? 'stock opname' : 'stock opname HO')
        await this.props.notifStock(token, dataItem.no_stock, 'reject', null, null, null, data)
    }

    dropApp = () => {
        this.setState({dropApp: !this.state.dropApp})
    }

    openModalConfirm = () => {
        this.setState({openConfirm: !this.state.openConfirm})
    }

    openModalPreview = () => {
        this.setState({modalPreview: !this.state.modalPreview})
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
        this.openModalPreview()
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

    prepareSelect = () => {
        const { dataCoa } = this.props.coa
        const { dataBank } = this.props.bank
        const temp = [
            {value: '', label: '-Pilih-'}
        ]
        const bank = [
            {value: '', label: '-Pilih-'}
        ]
        dataCoa.map(item => {
            return (
                temp.push({value: item.no_coa, label: item.nama_subcoa})
            )
        })
        dataBank.map(item => {
            return (
                bank.push({value: item.digit, label: item.name})
            )
        })
        this.setState({options: temp, bankList: bank})
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
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        await this.props.getCoa(token, 'klaim')
        await this.props.getBank(token)
        if (level === "5" || level === "9") {
            this.getDataCart()
        } else {
            this.getDataKlaim()
        }
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    getMessage = (val) => {
        this.setState({message: val.message, subject: val.subject})
        console.log(val)
    }

    prepSendEmail = async () => {
        const {dataCart, noklaim} = this.props.klaim
        const token = localStorage.getItem("token")
        const tipe = 'approve'
        const tempno = {
            no: noklaim,
            kode: dataCart[0].kode_plant,
            jenis: 'klaim',
            tipe: tipe,
            menu: 'Pengajuan Klaim (Klaim)'
        }
        const data = {
            no: noklaim
        }
        await this.props.getApproval(token, data)
        await this.props.getDetail(token, data)
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    cekDok = async () => {
        const { dataDoc } = this.props.klaim
        const verifDoc = []
        const tempDoc = []
        for (let i = 0; i < dataDoc.length; i++) {
            if (dataDoc[i].stat_upload === 1 && dataDoc[i].path !== null) {
                verifDoc.push(dataDoc[i])
                tempDoc.push(dataDoc[i])
            } else if (dataDoc[i].stat_upload === 1) {
                tempDoc.push(dataDoc[i])
            }
        }
        if (verifDoc.length === tempDoc.length) {
            this.prepSendEmail()
        } else {
            this.openConfirm(this.setState({confirm: 'verifdoc'}))
        }
    }

    closeTransaksi = async () => {
        const token = localStorage.getItem("token")
        const { noklaim } = this.props.klaim
        const { draftEmail } = this.props.email
        const { message, subject } = this.state
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        const data = {
            draft: draftEmail,
            nameTo: draftEmail.to.username,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: noklaim,
            tipe: 'klaim',
            menu: 'pengajuan klaim',
            proses: 'approve',
            route: 'klaim'
        }
        const tempno = {
            no: noklaim
        }
        await this.props.sendEmail(token, data)
        await this.props.submitKlaimFinal(token, tempno)
        await this.props.addNotif(token, data)
        await this.props.getCart(token)
        this.openModalDoc()
        this.modalSubmitPre()
        this.openDraftEmail()
        this.openConfirm(this.setState({confirm: 'submit'}))
    }

    componentDidUpdate() {
        const { isAdd, isUpload, isEdit } = this.props.klaim
        const token = localStorage.getItem("token")
        if (isAdd === true) {
            this.openModalAdd()
            this.props.getCart(token)
            this.openConfirm(this.setState({confirm: 'addcart'}))
            this.props.resetKlaim()
        } else if (isAdd === false) {
            this.openConfirm(this.setState({confirm: 'rejCart'}))
            this.props.resetKlaim()
        } else if (isUpload === true) {
            const { noklaim } = this.props.klaim
            const tempno = {
                no: noklaim,
                name: 'Draft Pengajuan Klaim'
            }
            this.props.getDocKlaim(token, tempno)
            this.props.resetKlaim()
        } else if (isEdit === true) {
            this.props.getCart(token)
            this.openConfirm(this.setState({confirm: 'editcart'}))
            this.props.resetKlaim()
        }
    }

    submitKlaim = async (val) => {
        const token = localStorage.getItem("token")
        this.openModalConfirm()
        await this.props.submitKlaim(token)
        this.openProsesModalDoc()
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

    getDataCart = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.getCart(token)
        this.prepareSelect()
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataKlaim = async (value) => {
        // const token = localStorage.getItem("token")
        // await this.props.getStockAll(token)
        // await this.props.getRole(token)
        this.setState({limit: value === undefined ? 10 : value.limit})
        this.changeFilter('available')
    }

    getDataList = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 400, '', 1)
        await this.props.getStockAll(token)
    }

    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
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

    openModalSub = () => {
        this.setState({modalSubmit: !this.state.modalSubmit})
    }

    openSum = () => {
        this.setState({modalSum: !this.state.modalSum})
    }

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
    }

    changeFilter = (val) => {
        const dataStock = []
        // const {dataStock} = this.props.stock
        // const {dataRole} = this.props.user
        // const level = localStorage.getItem('level')
        // const role = level === '16' || level === '13' ? dataRole.find(({nomor}) => nomor === '27').name : localStorage.getItem('role')
        // if (level === '2') {
        //     this.setState({filter: val, newStock: dataStock})
        // } else {
        //     if (val === 'available') {
        //         const newStock = []
        //         for (let i = 0; i < dataStock.length; i++) {
        //             const app = dataStock[i].appForm
        //             const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
        //             if (level === '7' || level === 7) {
        //                 if ((app.length === 0 || app[app.length - 1].status === null) || (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && (app[find].status === null || app[find].status === 0))) {
        //                     newStock.push(dataStock[i])
        //                 }
        //             } else if (find === 0 || find === '0') {
        //                 if (app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
        //                     newStock.push(dataStock[i])
        //                 }
        //             } else {
        //                 if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
        //                     newStock.push(dataStock[i])
        //                 }
        //             }
        //         }
        //         this.setState({filter: val, newStock: newStock})
        //     } else {
        //         this.setState({filter: val, newStock: dataStock})
        //     }
        // }
        this.setState({filter: val, newStock: dataStock})
    }

    prosesSubmitPre = async () => {
        this.modalSubmitPre()
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

    updateGrouping = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            grouping: val.target
        }
        if (val.target === 'DIPINJAM SEMENTARA') {
            this.setState({stat: val.target, })
            await this.props.getDetailAsset(token, val.item.no_asset)
            this.openProsesModalDoc()
        } else {
            await this.props.updateAsset(token, val.item.id, data)
            this.getDataCart()
        }
    }

    changeView = (val) => {
        this.setState({view: val})
        if (val === 'list') {
            this.getDataList()
        } else {
            this.getDataKlaim()
        }
    }


    deleteCart = async (val) => {
        const token = localStorage.getItem("token")
        const {dataDelete} = this.state
        await this.props.deleteCart(token, dataDelete)
        await this.props.getCart(token)
        this.setState({confirm: 'delCart'})
        this.openConfirm()
        this.openModalDelete()
    }

    prosesDelete = (val) => {
        this.setState({dataDelete: val})
        this.openModalDelete()
    }

    openModalDelete = () => {
        this.setState({modalDelete: !this.state.modalDelete})
    }

    addCartKlaim = async (val) => {
        const token = localStorage.getItem("token")
        const {detailDepo} = this.props.depo
        const data = {
            no_coa: this.state.no_coa,
            keterangan: val.keterangan,
            periode_awal: val.periode_awal,
            periode_akhir: val.periode_akhir,
            nilai_ajuan: val.nilai_ajuan,
            bank_tujuan: this.state.bank,
            norek_ajuan: this.state.tujuan_tf === "PMA" ? this.state.norek : val.norek_ajuan,
            nama_tujuan: this.state.tujuan_tf === 'PMA' ? `PMA-${detailDepo.area}` : val.nama_tujuan,
            tujuan_tf: this.state.tujuan_tf,
            tiperek: this.state.tiperek,
            status_npwp: val.status_npwp === 'Tidak' ? 0 : val.status_npwp === 'Ya' ? 1 : null,
            nama_npwp: val.status_npwp === 'Tidak' ? '' : val.nama_npwp,
            no_npwp: val.status_npwp === 'Tidak' ? '' : val.no_npwp,
            nama_ktp: val.status_npwp === 'Tidak' ? val.nama_ktp : '',
            no_ktp: val.status_npwp === 'Tidak' ? val.no_ktp : '',
            periode: '',
            no_surkom: val.no_surkom,
            nama_program: val.nama_program,
            dn_area: val.dn_area
        }
        await this.props.addCart(token, data)
    }

    editCartKlaim = async (val) => {
        const token = localStorage.getItem("token")
        const {detailDepo} = this.props.depo
        const data = {
            no_coa: this.state.no_coa,
            keterangan: val.keterangan,
            periode_awal: val.periode_awal,
            periode_akhir: val.periode_akhir,
            nilai_ajuan: val.nilai_ajuan,
            bank_tujuan: this.state.bank,
            norek_ajuan: this.state.tujuan_tf === "PMA" ? this.state.norek : val.norek_ajuan,
            nama_tujuan: this.state.tujuan_tf === 'PMA' ? `PMA-${detailDepo.area}` : val.nama_tujuan,
            tujuan_tf: this.state.tujuan_tf,
            tiperek: this.state.tiperek,
            status_npwp: val.status_npwp === 'Tidak' ? 0 : val.status_npwp === 'Ya' ? 1 : null,
            nama_npwp: val.status_npwp === 'Tidak' ? '' : val.nama_npwp,
            no_npwp: val.status_npwp === 'Tidak' ? '' : val.no_npwp,
            nama_ktp: val.status_npwp === 'Tidak' ? val.nama_ktp : '',
            no_ktp: val.status_npwp === 'Tidak' ? val.no_ktp : '',
            periode: '',
            no_surkom: val.no_surkom,
            nama_program: val.nama_program,
            dn_area: val.dn_area
        }
        const {idKlaim} = this.props.klaim
        await this.props.editKlaim(token, idKlaim.id, data)
        this.openModalEdit()
    }

    updateNewAsset = async (value) => {
        const token = localStorage.getItem("token")
        const data = {
            [value.target.name]: value.target.value
        }
        const target = value.target.name
        if (target === 'lokasi' || target === 'keterangan' || target === 'merk') {
            if (value.key === 'Enter') {
                await this.props.updateAsset(token, value.item.id, data)
                this.setState({idTab: null})
                this.getDataCart()
            } else {
                this.setState({idTab: value.item.id})
            }
        } else {
            if (target === "status_fisik" || target === "kondisi") {
                const data = {
                    [value.target.name]: value.target.value,
                    grouping: null
                }
                await this.props.updateAsset(token, value.item.id, data)
                this.getDataCart()
            } else {
                await this.props.updateAsset(token, value.item.id, data)
                this.getDataCart()
            }
        }
    }

    updateStatus = async (val) => {
        const token = localStorage.getItem('token')
        const { detailAsset } = this.props.asset
        const { stat } = this.state
        const data = {
            grouping: stat === 'null' ? null : stat
        }
        await this.props.updateAssetNew(token, detailAsset.id, data)
        this.getDataCart()
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

    updateCond = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            [val.tipe]: val.val
        }
        const {detailAsset} = this.props.asset
        await this.props.updateAsset(token, detailAsset.id, data)
        this.getDataCart()
    }

    openModalFpd = () => {
        this.setState({modalFpd: !this.state.modalFpd})
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

    prosesOpenAdd = async () => {
        const token = localStorage.getItem('token')
        const {dataCart} = this.props.klaim
        if (dataCart.length > 0) {
            this.openConfirm(this.setState({confirm: 'rejCartAdd'}))
        } else {
            await this.props.getFinRek(token)
            await this.props.getDetailDepo(token)
            const { dataRek } = this.props.finance
            const spending = dataRek[0].rek_spending
            const zba = dataRek[0].rek_zba
            const bankcoll = dataRek[0].rek_bankcoll
            const temp = [
                {label: '-Pilih-', value: ''},
                spending !== '0' ? {label: `${spending}~Rekening Spending Card`, value: 'Rekening Spending Card'} : {value: '', label: ''},
                zba !== '0' ? {label: `${zba}~Rekening ZBA`, value: 'Rekening ZBA'} : {value: '', label: ''},
                bankcoll !== '0' ? {label: `${bankcoll}~Rekening Bank Coll`, value: 'Rekening Bank Coll'} : {value: '', label: ''}
            ]
            this.setState({rekList: temp})
            this.openModalAdd()
        }
    }

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailId(token, val)
        await this.props.getFinRek(token)
        await this.props.getDetailDepo(token)
        const { dataRek } = this.props.finance
        const spending = dataRek[0].rek_spending
        const zba = dataRek[0].rek_zba
        const bankcoll = dataRek[0].rek_bankcoll
        const temp = [
            {label: '-Pilih-', value: ''},
            spending !== '0' ? {label: `${spending}~Rekening Spending Card`, value: 'Rekening Spending Card'} : {value: '', label: ''},
            zba !== '0' ? {label: `${zba}~Rekening ZBA`, value: 'Rekening ZBA'} : {value: '', label: ''},
            bankcoll !== '0' ? {label: `${bankcoll}~Rekening Bank Coll`, value: 'Rekening Bank Coll'} : {value: '', label: ''}
        ]

        const {idKlaim} = this.props.klaim
        this.setState({
            rekList: temp, 
            isLoading: true, 
            norek: idKlaim.norek_ajuan,
            tiperek: idKlaim.tiperek,
        })

        this.selectCoa({value: idKlaim.no_coa, label: idKlaim.nama_coa})
        this.selectTujuan(idKlaim.tujuan_tf)
        this.prepBank(idKlaim.bank_tujuan)

        setTimeout(() => {
            this.setState({isLoading: false})
            this.openModalEdit()
         }, 1000)
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

    goRoute(val) {
        this.props.history.push(`/${val}`)
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    openProsesModalDoc = async () => {
        const token = localStorage.getItem("token")
        const { noklaim } = this.props.klaim
        const tempno = {
            no: noklaim,
            name: 'Draft Pengajuan Klaim'
        }
        await this.props.getDocKlaim(token, tempno)
        this.openModalDoc()
    }

    openModalDoc = () => {
        this.setState({modalDoc: !this.state.modalDoc})
    }

    openModalAdd = () => {
        this.setState({no_coa: '', nama_coa: '', bank: '', digit: 0, norek: '', tiperek: '', tujuan_tf: ''})
        this.setState({modalAdd: !this.state.modalAdd})
    }

    selectCoa = (e) => {
        this.setState({no_coa: e.value, nama_coa: e.label})
    }

    selectBank = (e) => {
        this.setState({bank: e.label, digit: e.value})
    }

    prepBank = (val) => {
        const { dataBank } = this.props.bank
        const data = dataBank.find(({bank}) => bank === val)
        if (data === undefined) {
            this.setState()
        } else {
            this.setState({bank: data.name, digit: data.digit})
        }
    }

    selectRek = (e) => {
        this.setState({norek: e.label.split('~')[0], tiperek: e.value})
    }

    selectTujuan = (val) => {
        if (val === 'PMA') {
            this.setState({tujuan_tf: val, bank: 'Bank Mandiri', digit: 13})
        } else {
            this.setState({tujuan_tf: val, bank: '', digit: 0})
        }
    }

    modalStatus = () => {
        this.setState({openStatus: !this.state.openStatus})
    }

    chekApp = (val) => {
        const { listMut } = this.state
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

    chekRej = (val) => {
        const { listMut } = this.state
        listMut.push(val)
        this.setState({listMut: listMut})
    }

    prosesDetail = async (req, res) => {
        const token = localStorage.getItem("token")
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
        const {dataRinci, dropApp, dataItem, listMut, drop, newStock} = this.state
        const {dataCart, dataDoc, idKlaim} = this.props.klaim
        const { detailDepo, dataDepo } = this.props.depo
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
                                <div className={style.titleDashboard}>Draft Pengajuan Klaim</div>
                            </div>
                            <div className={style.secklaim}>
                                <Button className='mr-2 mb-2' onClick={this.prosesOpenAdd} color="info" size="lg">Add</Button>
                                <Button className='mb-2' onClick={this.prosesSubmitPre} color="success" size="lg">Submit</Button>
                            </div>
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
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
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataCart.length !== 0 && dataCart.map(item => {
                                                return (
                                                <tr>
                                                    <th scope="row">{dataCart.indexOf(item) + 1}</th>
                                                    <th>{item.cost_center}</th>
                                                    <th>{item.no_coa}</th>
                                                    <th>{item.nama_coa}</th>
                                                    <th>{item.keterangan}</th>
                                                    <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                    <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                    <th>{item.bank_tujuan}</th>
                                                    <th>{item.norek_ajuan}</th>
                                                    <th>{item.nama_tujuan}</th>
                                                    <th>
                                                        <Button onClick={() => this.prosesOpenEdit(item.id)} className='mb-1 mr-1' color='success'>EDIT</Button>
                                                        <Button onClick={() => this.prosesDelete(item.id)} color='danger'>DELETE</Button>
                                                    </th>
                                                </tr>
                                                )
                                            })}
                                            
                                        </tbody>
                                    </Table>
                                    {/* <div className={style.spin}>
                                            <Spinner type="grow" color="primary"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                            <Spinner type="grow" color="warning"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                            <Spinner type="grow" color="info"/>
                                    </div> */}
                                    {/* <Table bordered responsive hover className={style.tab}>
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
                                            <tr>
                                                <th>1</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                                <th>-</th>
                                            </tr>
                                        </tbody>
                                    </Table> */}
                                </div>
                                <div>
                                    <div className={style.infoPageEmail1}>
                                        <text>Showing 1 of 1 pages</text>
                                        <div className={style.pageButton}>
                                            <button 
                                                className={style.btnPrev} 
                                                color="info" 
                                                // disabled={page.prevLink === null ? true : false} 
                                                onClick={this.prev}>Prev
                                            </button>
                                            <button 
                                                className={style.btnPrev} 
                                                color="info" 
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
                <Modal isOpen={this.state.modalAdd} size="lg">
                    <ModalHeader>
                        Tambah Ajuan Klaim
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <Formik
                            initialValues = {{
                                keterangan: '',
                                periode_awal: '',
                                periode_akhir: '',
                                nilai_ajuan: 0,
                                norek_ajuan: '',
                                nama_tujuan: '',
                                status_npwp: '',
                                nama_npwp: '',
                                no_npwp: '',
                                no_ktp: '',
                                nama_ktp: '',
                                no_surkom: '',
                                nama_program: '',
                                dn_area: ''
                            }}
                            validationSchema = {addSchema}
                            onSubmit={(values) => {this.addCartKlaim(values)}}
                            >
                            {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci2">
                                    <div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>COA</Col>
                                            <Col md={9} className="colRinci">: 
                                                <Select
                                                    className="inputRinci2"
                                                    options={this.state.options}
                                                    onChange={this.selectCoa}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.no_coa === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No COA</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={this.state.no_coa}
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
                                                value={this.state.nama_coa}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.no_coa === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No Surkom</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.no_surkom}
                                                onBlur={handleBlur("no_surkom")}
                                                onChange={handleChange("no_surkom")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.no_surkom ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nama Program</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.nama_program}
                                                onBlur={handleBlur("nama_program")}
                                                onChange={handleChange("nama_program")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.nama_program ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>DN Area</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.dn_area}
                                                onBlur={handleBlur("dn_area")}
                                                onChange={handleChange("dn_area")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.dn_area ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
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
                                            <Col md={3}>Periode</Col>
                                            <Col md={9} className="colRinci">: 
                                                <Input
                                                type= "date" 
                                                className="inputRinci"
                                                value={values.periode_awal}
                                                onBlur={handleBlur("periode_awal")}
                                                onChange={handleChange("periode_awal")}
                                                />
                                                <text className='mr-1 ml-1'>To</text>
                                                <Input
                                                type= "date" 
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
                                            <Col md={9} className="colRinci">:  <NumberInput 
                                                    value={values.nilai_ajuan}
                                                    className="inputRinci1"
                                                    onValueChange={val => setFieldValue("nilai_ajuan", val.floatValue)}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.nilai_ajuan ? (
                                            <text className={style.txtError}>{errors.nilai_ajuan}</text>
                                        ) : null}
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
                                                />
                                            ) : (
                                                <Input
                                                type= "text" 
                                                className="inputRinci"
                                                disabled={this.state.digit === 0 ? true : false}
                                                minLength={this.state.digit === null ? 10 : this.state.digit}
                                                maxLength={this.state.digit === null ? 16 : this.state.digit}
                                                value={values.norek_ajuan}
                                                onBlur={handleBlur("norek_ajuan")}
                                                onChange={handleChange("norek_ajuan")}
                                                />
                                            )}
                                            </Col>
                                        </Row>
                                        {this.state.digit !== null && values.norek_ajuan.length !== this.state.digit && this.state.tujuan_tf !== 'PMA'? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : this.state.digit === null && (values.norek_ajuan.length < 10 || values.norek_ajuan.length > 16) && this.state.tujuan_tf !== 'PMA'? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : this.state.tujuan_tf === 'PMA' && this.state.norek.length !== this.state.digit ? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Atas Nama</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={this.state.tujuan_tf === '' || this.state.tujuan_tf === 'PMA' ? true : false}
                                                type= "text" 
                                                className="inputRinci"
                                                value={this.state.tujuan_tf === 'PMA' ? `PMA-${detailDepo.area}` : values.nama_tujuan}
                                                onBlur={handleBlur("nama_tujuan")}
                                                onChange={handleChange("nama_tujuan")}
                                                />
                                            </Col>
                                        </Row>
                                        {values.nama_tujuan === '' && this.state.tujuan_tf !== 'PMA' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
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
                                        ) : null}
                                    </div>
                                    <div className="modalFoot mt-3">
                                        <div></div>
                                        <div className='btnfoot'>
                                            <Button 
                                                className="mr-3" 
                                                size="md" 
                                                disabled={this.state.no_coa === '' ? true 
                                                : values.status_npwp === 'Ya' && (values.nama_npwp === '' || values.no_npwp === '' ) ? true 
                                                : values.status_npwp === 'Tidak' && (values.nama_ktp === '' || values.no_ktp === '' ) ? true 
                                                // : values.norek_ajuan.length < this.state.digit ? true 
                                                : this.state.tujuan_tf === '' ? true
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
                        Edit Ajuan Klaim
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <Formik
                            initialValues = {{
                                keterangan: idKlaim.keterangan || '',
                                periode_awal: idKlaim.periode_awal || '',
                                periode_akhir: idKlaim.periode_akhir || '',
                                nilai_ajuan: idKlaim.nilai_ajuan || 0,
                                norek_ajuan: idKlaim.norek_ajuan || '',
                                nama_tujuan: idKlaim.nama_tujuan || '',
                                status_npwp: idKlaim.status_npwp === 0 ? 'Tidak' : idKlaim.status_npwp === 1 && 'Ya',
                                nama_npwp: idKlaim.nama_npwp || '',
                                no_npwp: idKlaim.no_npwp || '',
                                no_ktp: idKlaim.no_ktp || '',
                                nama_ktp: idKlaim.nama_ktp || '',
                                no_surkom: idKlaim.no_surkom || '',
                                nama_program: idKlaim.nama_program || '',
                                dn_area: idKlaim.dn_area || ''
                            }}
                            validationSchema = {addSchema}
                            onSubmit={(values) => {this.editCartKlaim(values)}}
                            >
                            {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci2">
                                    <div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>COA</Col>
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
                                            <Col md={3}>No COA</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={this.state.no_coa}
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
                                                value={this.state.nama_coa}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.no_coa === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No Surkom</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.no_surkom}
                                                onBlur={handleBlur("no_surkom")}
                                                onChange={handleChange("no_surkom")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.no_surkom ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nama Program</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.nama_program}
                                                onBlur={handleBlur("nama_program")}
                                                onChange={handleChange("nama_program")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.nama_program ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>DN Area</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.dn_area}
                                                onBlur={handleBlur("dn_area")}
                                                onChange={handleChange("dn_area")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.dn_area ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
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
                                            <Col md={3}>Nilai Yang Diajukan</Col>
                                            <Col md={9} className="colRinci">:  <NumberInput 
                                                    value={values.nilai_ajuan}
                                                    className="inputRinci1"
                                                    onValueChange={val => setFieldValue("nilai_ajuan", val.floatValue)}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.nilai_ajuan ? (
                                            <text className={style.txtError}>{errors.nilai_ajuan}</text>
                                        ) : null}
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
                                                minLength={this.state.digit === null ? 10 : this.state.digit}
                                                maxLength={this.state.digit === null ? 16 : this.state.digit}
                                                value={values.norek_ajuan}
                                                onBlur={handleBlur("norek_ajuan")}
                                                onChange={handleChange("norek_ajuan")}
                                                />
                                            )}
                                            </Col>
                                        </Row>
                                        {this.state.digit !== null && values.norek_ajuan.length !== this.state.digit && this.state.tujuan_tf !== 'PMA'? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : this.state.digit === null && (values.norek_ajuan.length < 10 || values.norek_ajuan.length > 16) && this.state.tujuan_tf !== 'PMA'? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : this.state.tujuan_tf === 'PMA' && this.state.norek.length !== this.state.digit ? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Atas Nama</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={this.state.tujuan_tf === '' || this.state.tujuan_tf === 'PMA' ? true : false}
                                                type= "text" 
                                                className="inputRinci"
                                                value={this.state.tujuan_tf === 'PMA' ? `PMA-${detailDepo.area}` : values.nama_tujuan}
                                                onBlur={handleBlur("nama_tujuan")}
                                                onChange={handleChange("nama_tujuan")}
                                                />
                                            </Col>
                                        </Row>
                                        {values.nama_tujuan === '' && this.state.tujuan_tf !== 'PMA' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
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
                                        {values.status_npwp === 'Tidak' && values.no_ktp.length <= 16 ? (
                                            <text className={style.txtError}>must be filled with 16 digits characters</text>
                                        ) : null}
                                    </div>
                                    <div className="modalFoot mt-3">
                                        <div></div>
                                        <div className='btnfoot'>
                                            <Button 
                                                className="mr-3" 
                                                size="md" 
                                                disabled={this.state.no_coa === '' ? true 
                                                : values.status_npwp === 'Ya' && (values.nama_npwp === '' || values.no_npwp === '' ) ? true 
                                                : values.status_npwp === 'Tidak' && (values.nama_ktp === '' || values.no_ktp === '' ) ? true 
                                                // : values.norek_ajuan.length < this.state.digit ? true 
                                                : this.state.tujuan_tf === '' ? true
                                                : false } 
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
                <Modal isOpen={this.state.modalStock} toggle={this.openModalStock} size="lg">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                </Modal>
                <Modal isOpen={this.state.modalDelete} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk delete data ajuan ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.deleteCart()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalDelete}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalRinci} className='modalrinci'  toggle={this.openModalRinci} size="xl">
                    <ModalBody>
                        <div>
                            <div className="stockTitle">form ajuan area (claim)</div>
                            {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                                {/* <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3"  /></Col> */}
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                {/* <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3" /></Col> */}
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                {/* <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailStock.length > 0 ? moment(detailStock[0].tanggalStock).format('DD MMMM YYYY') : ''} /></Col> */}
                            </Row>
                        </div>
                            <div className={style.tableDashboard}>
                                <Table bordered responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>NO.AJUAN</th>
                                            <th>NO.COA</th>
                                            <th>NAMA COA</th>
                                            <th>KETERANGAN TAMBAHAN</th>
                                            <th>PERIODE</th>
                                            <th>NILAI YANG DIAJUKAN</th>
                                            <th>ATAS NAMA</th>
                                            <th>Select item to reject</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </Table>
                            </div>
                    </ModalBody>
                    <div className="modalFoot ml-3">
                        <Button color="primary"  onClick={() => this.openPreview(dataItem)}>Preview</Button>
                        <div className="btnFoot">
                            <Button className="mr-2" disabled={this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false} color="danger" onClick={this.openModalReject}>
                                Reject
                            </Button>
                            {/* {level === '2' ? (
                                <Button color="success" disabled={this.state.filter !== 'available' ? true : detailStock.find(({status_app}) => status_app === 0) !== undefined ? true : listMut.length === 0 ? false : true} onClick={this.openModalSub}>
                                    Submit
                                </Button>
                            ) : (
                                <Button color="success" disabled={this.state.filter !== 'available' ? true : detailStock.find(({status_app}) => status_app === 0) !== undefined ? true : listMut.length === 0 ? false : true} onClick={this.openModalApprove}>
                                    Approve
                                </Button>
                            )} */}
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalPreview} toggle={this.openModalPreview} size="xl">
                    <ModalHeader>
                        Preview
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <div className="stockTitle">kertas kerja opname aset kantor</div>
                            <div className="ptStock">pt. pinus merah abadi</div>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>kantor pusat/cabang</Col>
                                {/* <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3"  /></Col> */}
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>depo/cp</Col>
                                {/* <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3" /></Col> */}
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>opname per tanggal</Col>
                                {/* <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailStock.length > 0 ? moment(detailStock[0].tanggalStock).format('DD MMMM YYYY') : ''} /></Col> */}
                            </Row>
                        </div>
                            <div className={style.tableDashboard}>
                                <Table bordered responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>NO. ASET</th>
                                            <th>DESKRIPSI</th>
                                            <th>MERK</th>
                                            <th>SATUAN</th>
                                            <th>UNIT</th>
                                            <th>KONDISI</th>
                                            <th>LOKASI</th>
                                            <th>GROUPING</th>
                                            <th>KETERANGAN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </Table>
                            </div>
                        <Table borderless responsive className="tabPreview">
                           <thead>
                               <tr>
                                   <th className="buatPre">Dibuat oleh,</th>
                                   <th className="buatPre">Diperiksa oleh,</th>
                                   <th className="buatPre">Disetujui oleh,</th>
                               </tr>
                           </thead>
                           <tbody className="tbodyPre">
                               {/* <tr>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {stockApp.pembuat !== undefined && stockApp.pembuat.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                {stockApp.pembuat !== undefined && stockApp.pembuat.map(item => {
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
                                                    {stockApp.pemeriksa !== undefined && stockApp.pemeriksa.length === 0 ? (
                                                        <th className="headPre">
                                                            <div className="mb-2">-</div>
                                                            <div>-</div>
                                                        </th>
                                                    ) : stockApp.pemeriksa !== undefined && stockApp.pemeriksa.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {stockApp.pemeriksa !== undefined && stockApp.pemeriksa.length === 0 ? (
                                                        <td className="footPre">-</td>
                                                    ) : stockApp.pemeriksa !== undefined && stockApp.pemeriksa.map(item => {
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
                                                    {stockApp.penyetuju !== undefined && stockApp.penyetuju.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {stockApp.penyetuju !== undefined && stockApp.penyetuju.map(item => {
                                                        return (
                                                            <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                        )
                                                    })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                               </tr> */}
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
                            <Button color="success" onClick={this.openModalPreview}>
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
                    onSubmit={(values) => {this.rejectStock(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                            <div className={style.quest}>Anda yakin untuk reject ?</div>
                            <div className={style.alasan}>
                                <text className="col-md-3">
                                    Alasan
                                </text>
                                <Input 
                                type="name" 
                                name="Input" 
                                className="col-md-9"
                                value={values.alasan}
                                onChange={handleChange('alasan')}
                                onBlur={handleBlur('alasan')}
                                />
                            </div>
                            {errors.alasan ? (
                                    <text className={style.txtError}>{errors.alasan}</text>
                                ) : null}
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={handleSubmit}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalReject}>Tidak</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.klaim.isLoading || this.props.email.isLoading || this.state.isLoading} size="sm">
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
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.approveStock()}>Ya</Button>
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
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.submitAset()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalSub}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApprove && (level === '5' || level === '6')} toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk mengajukan  
                                    <text className={style.verif}> stock opname </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.submitStock()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openConfirm} toggle={this.openModalConfirm} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Apakah anda yakin ingin submit pengajuan klaim ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.submitKlaim()}>Ya</Button>
                                <Button color="secondary" onClick={() => this.openModalConfirm()}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.submitPre} toggle={this.modalSubmitPre} size="xl">
                    <ModalBody>
                        <div>
                            {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                            {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={dataCart.length > 0 ? dataCart[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            {/* <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={''} /></Col>
                            </Row> */}
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
                                    {dataCart.length !== 0 && dataCart.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{dataCart.indexOf(item) + 1}</th>
                                                <th>{item.cost_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.keterangan}</th>
                                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                <th>{item.nilai_ajuan}</th>
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
                                                <th>-</th>
                                            </tr>
                                            )
                                        })}
                                </tbody>
                            </Table>
                        </div>
                    </ModalBody>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertM}</div>
                    </Alert> */}
                    <div className="modalFoot ml-3">
                        <div className="btnFoot">
                            {/* <Button className="mr-2" color="info"  onClick={() => this.openModalFpd()}>FPD</Button>
                            <Button className="mr-2" color="warning"  onClick={() => this.openModalFaa()}>FAA</Button> */}
                        </div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="success" onClick={this.openModalConfirm}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalFaa} toggle={this.openModalFaa} size="xl">
                    <ModalHeader>
                        FORM AJUAN AREA
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                            {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={dataCart.length > 0 ? dataCart[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={''} /></Col>
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
                                    {dataCart.length !== 0 && dataCart.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{dataCart.indexOf(item) + 1}</th>
                                                <th>{item.cost_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.keterangan}</th>
                                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                <th>{item.nilai_ajuan}</th>
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
                                                <th>-</th>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                        <Table borderless responsive className="tabPreview">
                           <thead>
                               <tr>
                                   <th className="buatPre">Dibuat oleh,</th>
                                   <th className="buatPre">Diperiksa oleh,</th>
                                   <th className="buatPre">Disetujui oleh,</th>
                               </tr>
                           </thead>
                           <tbody className="tbodyPre">
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
                <Modal isOpen={this.state.modalFpd} toggle={this.openModalFpd} size="xl">
                    <ModalBody>
                        <div>
                            <div className="fpdTit">FORM PERMINTAAN DANA</div>
                            <div className='fpdTit'>cabang/depo : {dataCart.length > 0 ? dataCart[0].area : ''}</div>
                            <div className='fpdTit'>no : </div>
                        </div>
                        <div className={style.tableDashboard}>
                            <Row>
                                <Col md={1} className='upper'>
                                    <div className='liner'>no</div>
                                </Col>
                                <Col md={8} className='upper'>
                                    <div className='line'>keperluan / <br />keterangan</div>
                                </Col>
                                <Col md={3} className='upper'>
                                    <div className='liner'>rupiah</div>
                                </Col>
                            </Row>
                            {dataCart.length !== 0 && dataCart.map(item => {
                                return (
                                    <Row className='mt-4'>
                                        <Col md={1} className='upper'>
                                            <div className='line'>{dataCart.indexOf(item) + 1}</div>
                                        </Col>
                                        <Col md={8} className='upper'>
                                            <div className='line2'>{item.keterangan}</div>
                                            <div className='line mt-1'>NO REK {item.bank_tujuan} {item.norek_ajuan}</div>
                                        </Col>
                                        <Col md={3} className='upper'>
                                            <div className='line'>{item.nilai_ajuan}</div>
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
                                        {dataCart.length > 0 && dataCart.reduce((preVal, curVal) => parseInt(preVal.nilai_ajuan) + parseInt(curVal.nilai_ajuan), 0)}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div>{dataCart.length > 0 ? dataCart[0].area : ''}, {moment().format('DD MMMM YYYY')}</div>
                        <Table borderless responsive className="tabPreview mt-4">
                           <thead>
                               <tr>
                                   <th className="buatPre">Dibuat oleh,</th>
                                   <th className="buatPre">Diperiksa oleh,</th>
                                   <th className="buatPre">Disetujui oleh,</th>
                               </tr>
                           </thead>
                           <tbody className="tbodyPre">
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
                                    onClick={() => this.closeTransaksi()} 
                                    color="primary"
                                >
                                    Approve & Send Email
                                </Button>
                                <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={() => this.openConfirm(false)}>
                    <ModalBody>
                        <Countdown renderer={this.rendererTime} date={Date.now() + 3000} />
                        {this.state.confirm === 'addcart' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Menambahkan Data</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'delCart' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Menghapus Data</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'editcart' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Menyimpan Perubahan Data</div>
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
                        ) : this.state.confirm === 'verifdoc' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Submit Klaim</div>
                                    <div className={[style.sucUpdate, style.green]}>Pastikan seluruh dokumen lampiran telah diupload</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejCart' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Data</div>
                                    <div className={[style.sucUpdate, style.green]}>{this.props.klaim.alertMsg}</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejCartAdd' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Data</div>
                                    <div className={[style.sucUpdate, style.green]}>Maximal 1 data dalam satu ajuan klaim</div>
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
            <Modal size="xl" isOpen={this.state.modalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen
                </ModalHeader>
                <ModalBody>
                    <Container>
                        {/* <input
                        color='success'
                        type="file"
                        onChange={this.onChangeUpload}
                        /> */}
                        {dataDoc !== undefined && dataDoc.map(x => {
                            return (
                                <Row className="mt-3 mb-4">
                                    {x.path !== null ? (
                                        <Col md={12} lg={12} >
                                            <div className="btnDocIo mb-2" >{x.desc}</div>
                                            {x.status === 0 ? (
                                                <AiOutlineClose size={20} />
                                            ) : x.status === 3 ? (
                                                <AiOutlineCheck size={20} />
                                            ) : (
                                                <BsCircle size={20} />
                                            )}
                                            <button className="btnDocIo blue" onClick={() => this.showDokumen(x)} >{x.history}</button>
                                            <div className="colDoc">
                                                <input
                                                type="file"
                                                className='ml-4'
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                                <text className="txtError ml-4">Maximum file upload is 20 Mb</text>
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col md={12} lg={12} className="colDoc">
                                            <text className="btnDocIo" >{x.desc}</text>
                                            <text className="italRed" >{x.stat_upload === 0 ? '*tidak harus upload' : '*harus upload'}</text>
                                            <div className="colDoc">
                                                <input
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            </div>
                                            <text className="txtError">Maximum file upload is 20 Mb</text>
                                        </Col>
                                    )}
                                </Row>
                            )
                        })}
                    </Container>
                </ModalBody>
                <ModalFooter>
                    <Button className="mr-2" disabled={dataDoc.length > 0 ? false : true} color="primary" onClick={this.cekDok}>
                        Done
                    </Button>
                    <Button color="secondary" onClick={this.openModalDoc}>
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
            </>
        )
    }
}

const mapStateToProps = state => ({
    approve: state.approve,
    depo: state.depo,
    user: state.user,
    notif: state.notif,
    coa: state.coa,
    klaim: state.klaim,
    bank: state.bank,
    finance: state.finance,
    dokumen: state.dokumen,
    email: state.email
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNameApprove: approve.getNameApprove,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    getRole: user.getRole,
    getCoa: coa.getCoa,
    getDetailCoa: coa.getDetailCoa,
    addCart: klaim.addCart,
    getCart: klaim.getCart,
    deleteCart: klaim.deleteCart,
    resetKlaim: klaim.resetKlaim,
    submitKlaim: klaim.submitKlaim,
    getDocKlaim: klaim.getDocCart,
    uploadDocKlaim: klaim.UploadDocCart,
    getBank: bank.getBank,
    submitKlaimFinal: klaim.submitKlaimFinal,
    getApproval: klaim.getApproval,
    getFinRek: finance.getFinRek,
    showDokumen: dokumen.showDokumen,
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    getDetail: klaim.getDetail,
    getDetailId: klaim.getDetailId,
    editKlaim: klaim.editKlaim,
    addNotif: notif.addNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(CartKlaim)
