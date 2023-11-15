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
import ikk from '../../redux/actions/ikk'
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
import pagu from '../../redux/actions/pagu'
import {default as axios} from 'axios'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import dokumen from '../../redux/actions/dokumen'
import vendor from '../../redux/actions/vendor'
import faktur from '../../redux/actions/faktur'
import email from '../../redux/actions/email'
import Email from '../../components/Ikk/Email'
import NumberInput from '../../components/NumberInput'
import Countdown from 'react-countdown'
const {REACT_APP_BACKEND_URL} = process.env
const nonObject = 'Non Object PPh'

const addSchema = Yup.object().shape({
    uraian: Yup.string().required("must be filled"),
    periode_awal: Yup.date().required("must be filled"),
    periode_akhir: Yup.date().required('must be filled')
    // nilai_ajuan: Yup.string().required("must be filled"),
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});


class CartIkk extends Component {
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
            openDraft: false,
            subject: '',
            message: '',
            isLoading: false,
            typeniknpwp: '',
            dataDelete: '',
            showOptions: false,
            tipeSkb: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
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
            const { noikk } = this.props.ikk
            const { detail } = this.state
            const tempno = {
                no: noikk
            }
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocIkk(token, noikk, detail.id, data)
            // this.props.uploadDocIkk(token, tempno, data)
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
        this.getDataIkk()
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

    showAlert = () => {
        this.setState({alert: true})
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 2000)
    }

    async componentDidMount() {
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        await this.props.getCoa(token, 'ikk')
        await this.props.getBank(token)
        await this.props.getVendor(token)
        await this.props.getAllNotif(token)
        this.getDataCart()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    getMessage = (val) => {
        this.setState({message: val.message, subject: val.subject})
        console.log(val)
    }

    prepSendEmail = async () => {
        const {dataCart, noikk} = this.props.ikk
        const token = localStorage.getItem("token")
        const tipe = 'approve'
        const tempno = {
            no: noikk,
            kode: dataCart[0].kode_plant,
            jenis: 'ikk',
            tipe: tipe,
            menu: 'Pengajuan Ikk (IKK)'
        }
        const data = {
            no: noikk
        }
        await this.props.getApproval(token, data)
        await this.props.getDetail(token, data)
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    cekDok = async () => {
        const { dataDoc } = this.props.ikk
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
        const { noikk } = this.props.ikk
        const { draftEmail } = this.props.email
        const { message, subject } = this.state
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        const tempno = {
            no: noikk
        }
        const data = {
            draft: draftEmail,
            nameTo: draftEmail.to.username,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: noikk,
            tipe: 'ikk',
            menu: 'pengajuan ikk',
            proses: 'approve',
            route: 'ikk'
        }
        await this.props.sendEmail(token, data)
        await this.props.submitIkkFinal(token, tempno)
        await this.props.addNotif(token, data)
        await this.props.getCart(token)
        this.openModalDoc()
        this.modalSubmitPre()
        this.openDraftEmail()
        this.openConfirm(this.setState({confirm: 'submit', nominal: 0}))
    }

    componentDidUpdate() {
        const { isAdd, isUpload, isEdit } = this.props.ikk
        const token = localStorage.getItem("token")
        console.log(this.state.tipeVendor)
        console.log(this.state.jenisVendor)
        if (isAdd === true) {
            this.openModalAdd()
            this.props.getCart(token)
            this.openConfirm(this.setState({confirm: 'addcart'}))
            this.props.resetIkk()
        } else if (isAdd === false) {
            this.openConfirm(this.setState({confirm: 'rejCart'}))
            this.props.resetIkk()
        } else if (isUpload === true) {
            const { noikk } = this.props.ikk
            const tempno = {
                no: noikk,
                name: 'Draft Pengajuan Ikk'
            }
            this.props.getDocIkk(token, tempno)
            this.props.resetIkk()
        } else if (isEdit === true) {
            this.props.getCart(token)
            this.openConfirm(this.setState({confirm: 'editcart'}))
            this.props.resetIkk()
        }
    }

    submitIkk = async (val) => {
        const token = localStorage.getItem("token")
        const {listMut} = this.state
        const data = {
            list: listMut
        }
        this.openModalConfirm()
        await this.props.submitIkk(token, data)
        this.openProsesModalDoc()
    }

    downloadData = () => {
        const { fileName } = this.state
        const download = fileName.path.split('/')
        const cek = download[2].split('.')
        console.log(fileName)
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
        await this.props.getPagu(token)
        this.prepareSelect()
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataIkk = async (value) => {
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
            uraian: val.uraian,
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
        this.setState({filter: val, newStock: dataStock})
    }

    prosesSubmitPre = async () => {
        const {listMut} = this.state
        if (listMut.length > 0) {
            this.modalSubmitPre()
        } else {
            this.openConfirm(this.setState({confirm: 'failSubChek'}))
        }
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
            uraian: value.uraian,
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

    addCartIkk = async (val) => {
        console.log('masuk add cart ikk')
        const token = localStorage.getItem("token")
        const {detailDepo} = this.props.depo
        const {dataTrans, nilai_buku, nilai_ajuan, nilai_utang, tgl_faktur,
             nilai_vendor, tipeVendor, tipePpn, nilai_dpp, nilai_ppn, typeniknpwp,
             dataSelFaktur, noNpwp, noNik, nama, alamat, status_npwp} = this.state
        const data = {
            user_jabatan: val.user_jabatan,
            no_bpkk: val.no_bpkk,
            no_coa: this.state.no_coa,
            uraian: val.uraian,
            periode_awal: val.periode_awal,
            periode_akhir: val.periode_akhir,
            bank_tujuan: this.state.bank,
            // norek_ajuan: this.state.tujuan_tf === "PMA" ? this.state.norek : val.norek_ajuan,
            norek_ajuan: this.state.norek,
            nama_tujuan: this.state.tujuan_tf === 'PMA' ? `PMA-${detailDepo.area}` : val.nama_tujuan,
            tujuan_tf: this.state.tujuan_tf,
            tiperek: this.state.tiperek,
            status_npwp: status_npwp === 'Tidak' ? 0 : status_npwp === 'Ya' ? 1 : 2,
            nama_npwp: status_npwp === 'Tidak' ? '' : status_npwp === 'Ya' ? nama : '',
            no_npwp: status_npwp === 'Tidak' ? '' : status_npwp === 'Ya' ? noNpwp : '',
            nama_ktp: status_npwp === 'Tidak' ? nama : status_npwp === 'Ya' ? '' : '',
            no_ktp: status_npwp === 'Tidak' ? noNik : status_npwp === 'Ya' ? '' : '',
            periode: '',
            nama_vendor: nama,
            alamat_vendor: alamat,
            penanggung_pajak: tipeVendor,
            type_transaksi: tipePpn,
            no_faktur: dataSelFaktur.no_faktur,
            dpp: nilai_dpp,
            ppn: nilai_ppn,
            tgl_tagihanbayar: val.tgl_tagihanbayar,
            nilai_ajuan: parseInt(nilai_ajuan),
            nilai_buku: parseInt(nilai_buku),
            nilai_utang: parseInt(nilai_utang),
            nilai_vendor: parseInt(nilai_vendor),
            nilai_bayar: parseInt(nilai_vendor),
            jenis_pph: dataTrans.jenis_pph,
            tgl_faktur: tgl_faktur,
            typeniknpwp: typeniknpwp,
            stat_skb: this.state.jenisVendor === nonObject ? '' : this.state.tipeSkb
        }
        await this.props.addCart(token, data, dataTrans.id)
    }

    editCartIkk = async (val) => {
        const token = localStorage.getItem("token")
        const {idIkk} = this.props.ikk
        const {detailDepo} = this.props.depo
        const { dataTrans, nilai_buku, nilai_ajuan, nilai_utang, tgl_faktur,
            nilai_vendor, tipeVendor, tipePpn, nilai_dpp, nilai_ppn, typeniknpwp,
            dataSelFaktur, noNpwp, noNik, nama, alamat, status_npwp } = this.state
        const data = {
            user_jabatan: val.user_jabatan,
            no_bpkk: val.no_bpkk,
            no_coa: this.state.no_coa,
            uraian: val.uraian,
            periode_awal: val.periode_awal,
            periode_akhir: val.periode_akhir,
            bank_tujuan: this.state.bank,
            // norek_ajuan: this.state.tujuan_tf === "PMA" ? this.state.norek : val.norek_ajuan,
            norek_ajuan: this.state.norek,
            nama_tujuan: this.state.tujuan_tf === 'PMA' ? `PMA-${detailDepo.area}` : val.nama_tujuan,
            tujuan_tf: this.state.tujuan_tf,
            tiperek: this.state.tiperek,
            status_npwp: status_npwp === 'Tidak' ? 0 : status_npwp === 'Ya' && 1,
            nama_npwp: status_npwp === 'Tidak' ? '' : status_npwp === 'Ya' && nama,
            no_npwp: status_npwp === 'Tidak' ? '' : status_npwp === 'Ya' && noNpwp,
            nama_ktp: status_npwp === 'Tidak' ? nama : status_npwp === 'Ya' && '',
            no_ktp: status_npwp === 'Tidak' ? noNik : status_npwp === 'Ya' && '',
            periode: '',
            nama_vendor: nama,
            alamat_vendor: alamat,
            penanggung_pajak: tipeVendor,
            type_transaksi: tipePpn,
            no_faktur: dataSelFaktur.no_faktur,
            dpp: nilai_dpp,
            ppn: nilai_ppn,
            tgl_tagihanbayar: val.tgl_tagihanbayar,
            nilai_ajuan: parseInt(nilai_ajuan),
            nilai_buku: parseInt(nilai_buku),
            nilai_utang: parseInt(nilai_utang),
            nilai_vendor: parseInt(nilai_vendor),
            nilai_bayar: parseInt(nilai_vendor),
            jenis_pph: dataTrans.jenis_pph,
            tgl_faktur: tgl_faktur,
            typeniknpwp: typeniknpwp,
            stat_skb: this.state.jenisVendor === nonObject ? '' : this.state.tipeSkb
        }
        await this.props.editIkk(token, idIkk.id, dataTrans.id, data )
        this.openModalEdit()
    }

    prosesModalFpd = () => {
        const {dataCart} = this.props.ikk
        const {listMut} = this.state
        let total = 0
        for (let i = 0; i < dataCart.length; i++) {
            if (listMut.find(element => element === dataCart[i].id)!== undefined) {
                total += parseFloat(dataCart[i].nilai_ajuan)
            }
        }
        this.setState({totalfpd: total})
        this.openModalFpd()
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
        await this.props.getFinRek(token)
        await this.props.getDetailDepo(token)
        const { dataRek } = this.props.finance
        const spending = dataRek[0].rek_spending
        const zba = dataRek[0].rek_zba
        const bankcol = dataRek[0].rek_bankcol
        const temp = [
            {label: '-Pilih-', value: ''},
            spending !== '0' ? {label: `${spending}~Rekening Spending Card`, value: 'Rekening Spending Card'} : {value: '', label: ''}
            // zba !== '0' ? {label: `${zba}~Rekening ZBA`, value: 'Rekening ZBA'} : {value: '', label: ''},
            // bankcol !== '0' ? {label: `${bankcol}~Rekening Bank Coll`, value: 'Rekening Bank Coll'} : {value: '', label: ''}
        ]
        this.setState({
            rekList: temp, 
            jenisVendor: '',
            status_npwp: '',
            nominal: 0,
            nilai_ajuan: 0,
            nilai_buku: 0,
            nilai_utang: 0,
            nilai_vendor: 0,
            tipeVendor: '',
            nilai_dpp: 0,
            nilai_ppn: 0,
            tipePpn: '',
            dataList: {},
            dataSelFaktur: { no_faktur: '' },
            noNpwp: '',
            noNik: '',
            nama: '',
            alamat: '',
            tgl_faktur: '',
            tipeSkb: ''
        })
        this.openModalAdd()
    }

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailId(token, val)
        await this.props.getFinRek(token)
        await this.props.getDetailDepo(token)
        const { dataRek } = this.props.finance
        const spending = dataRek[0].rek_spending
        const zba = dataRek[0].rek_zba
        const bankcol = dataRek[0].rek_bankcol
        const temp = [
            {label: '-Pilih-', value: ''},
            spending !== '0' ? {label: `${spending}~Rekening Spending Card`, value: 'Rekening Spending Card'} : {value: '', label: ''},
            // zba !== '0' ? {label: `${zba}~Rekening ZBA`, value: 'Rekening ZBA'} : {value: '', label: ''},
            // bankcol !== '0' ? {label: `${bankcol}~Rekening Bank Coll`, value: 'Rekening Bank Coll'} : {value: '', label: ''}
        ]

        const {idIkk} = this.props.ikk

        this.setState({
            isLoading: true,
            rekList: temp,
            nama: idIkk.nama_vendor, 
            alamat: idIkk.alamat_vendor, 
            noNpwp: idIkk.no_npwp, 
            noNik: idIkk.no_ktp,
            norek: idIkk.norek_ajuan,
            tiperek: idIkk.tiperek,
            nilai_dpp: idIkk.dpp,
            nilai_ppn: idIkk.ppn,
            nilai_ajuan: idIkk.nilai_ajuan,
            nilai_buku: idIkk.nilai_buku,
            nilai_utang: idIkk.nilai_utang,
            nilai_vendor: idIkk.nilai_vendor,
            nilai_bayar: idIkk.nilai_vendor,
            jenis_pph: idIkk.jenis_pph,
            tipePpn: idIkk.type_transaksi,
            tipeVendor: idIkk.penanggung_pajak,
            status_npwp: idIkk.status_npwp === 0 ? 'Tidak' : idIkk.status_npwp === 1 ? 'Ya' : nonObject,
            dataSelFaktur: { no_faktur: idIkk.no_faktur },
            tipeSkb: idIkk.stat_skb
        })
        const cekNpwp = idIkk.no_npwp === '' || idIkk.no_npwp === null ? null : idIkk.no_npwp

        this.selectCoa({value: idIkk.no_coa, label: `${idIkk.no_coa} ~ ${idIkk.nama_coa}`})
        this.prepNikNpwp(cekNpwp)
        this.selectTujuan(idIkk.tujuan_tf)
        this.prepBank(idIkk.bank_tujuan)
        
        setTimeout(() => {
            this.prepFaktur(idIkk.no_faktur)
         }, 500)
        setTimeout(() => {
            this.cekTrans()
         }, 300)
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
        const { noikk } = this.props.ikk
        const tempno = {
            no: noikk,
            name: 'Draft Pengajuan Ikk'
        }
        await this.props.getDocIkk(token, tempno)
        this.openModalDoc()
    }

    openModalDoc = () => {
        this.setState({modalDoc: !this.state.modalDoc})
    }

    openModalAdd = () => {
        this.setState({no_coa: '', nama_coa: '', bank: '', digit: 0, norek: '', tiperek: '', tujuan_tf: ''})
        this.setState({idTrans: '', jenisTrans: '', dataTrans: {}, jenisVendor: ''})
        this.setState({
            jenisVendor: '',
            status_npwp: '',
            nominal: 0,
            nilai_ajuan: 0,
            nilai_buku: 0,
            nilai_utang: 0,
            nilai_vendor: 0,
            tipeVendor: '',
            nilai_dpp: 0,
            nilai_ppn: 0,
            tipePpn: '',
            dataList: {},
            dataSelFaktur: { no_faktur: '' },
            noNpwp: '',
            noNik: '',
            nama: '',
            alamat: '',
            tgl_faktur: ''
        })
        this.setState({modalAdd: !this.state.modalAdd})
    }

    selectJenis = async (val) => {
        const {idTrans, jenisTrans, status_npwp} = this.state
        this.setState({jenisVendor: val, status_npwp: val === 'Badan' ? 'Ya' : status_npwp})
        setTimeout(() => {
            this.selectTrans({value: idTrans, label: jenisTrans})
         }, 100)
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
                    // diffDays < 90 &&
                    item.status === null && temp.push({value: item.id, label: `${item.no_faktur}~${item.nama}`})
                )
            })
            this.setState({fakturList: temp})
        }
    }

    selectNikNpwp = async (e) => {
        const token = localStorage.getItem("token")
        const { dataVendor } = this.props.vendor
        const idVal = e.val.value
        const data = dataVendor.find(({id}) => id === idVal)
        if (data === undefined) {
            console.log()
        } else {
            if (data.no_npwp === 'TIDAK ADA') {
                this.setState({dataList: data, nama: data.nama, alamat: data.alamat, noNpwp: data.no_npwp, noNik: data.no_ktp, typeniknpwp: 'auto'})
            } else {
                await this.props.getFaktur(token, data.no_npwp)
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
                        diffDays < 10000 && item.status === null && temp.push({value: item.id, label: `${item.no_faktur}~${item.nama}`})
                    )
                })
                this.setState({dataList: data, nama: data.nama, alamat: data.alamat, noNpwp: data.no_npwp, noNik: data.no_ktp, fakturList: temp, typeniknpwp: 'auto'})
            }
        }
    }

    selectNpwp = async (val) => {
        const {idTrans, jenisTrans} = this.state
        this.setState({status_npwp: val})
        setTimeout(() => {
            this.selectTrans({value: idTrans, label: jenisTrans})
         }, 100)
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
                this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis, tipeVendor: jenis})
                this.formulaTax()
            } else if (jenisVendor === '' || jenisVendor === nonObject) {
                temp = cek
                jenis = ''
                this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis, tipeVendor: jenis})
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
                    this.setState({idTrans: '', jenisTrans: '', dataTrans: {}, jenisVendor: '', tipeVendor: ''})
                } else {
                    console.log('masuk not undefined')
                    temp = selectCoaFin === undefined ? selectCoa : selectCoaFin
                    jenis = jenisVendor === nonObject ? '' : jenisVendor
                    this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis, tipeVendor: ''})
                    this.formulaTax()
                }
            }
        }
        
    }

    cekTrans = () => {
        const { allCoa } = this.props.coa
        const {idIkk} = this.props.ikk
        const pph = idIkk.jenis_pph
        const statNpwp = idIkk.status_npwp
        const npwp = idIkk.no_npwp === '' || idIkk.no_npwp === null ? null : idIkk.no_npwp
        const cekPph = pph === 'Non PPh' || pph === '' || pph === null ? 'Non PPh' : pph
        const trans = idIkk.sub_coa
        const vendor = cekPph === 'Non PPh' ? nonObject : idIkk.jenis_vendor !== null && idIkk.jenis_vendor !== '' ? idIkk.jenis_vendor : null
        const cekStat = cekPph === 'Non PPh' ? 'No Need NPWP/NIK' : statNpwp === 1 && npwp !== null ? 'NPWP' : 'NIK'
        const nilaiBuku = idIkk.nilai_buku
        const nilaiUtang = idIkk.nilai_utang
        // console.log({idIkk, stat_npwp: idIkk.status_npwp, npwp: idIkk.no_npwp, nik: idIkk.no_ktp})
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

    selectBank = (e) => {
        this.setState({bank: e.label, digit: e.value})
    }

    selectRek = (e) => {
        const rek = e.label.split('~')[0]
        const tiperek = e.label.split('~')[1]
        this.setState({norek: rek, tiperek: tiperek})
    }

    selectTujuan = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getFinRek(token, val === 'PMA' ? 'undefined' : 'all')
        const { dataRek } = this.props.finance
        const temp = []
        for (let i = 0; i < dataRek.length; i++) {
            const spending = dataRek[i].rek_spending
            const plant = dataRek[i].area
            if (spending !== '0') {
                temp.push({label: `${spending}~Rekening Spending Card~${plant}`, value: spending})
            }
        }
        this.setState({
            tujuan_tf: val, 
            bank: 'Bank Mandiri', 
            digit: 13,
            rekList: temp
        })
    }

    selectTipe = async (val) => {
        this.setState({tipeVendor: val})
        setTimeout(() => {
            this.formulaTax()
        }, 200)
    }

    selectSkb = async (val) => {
        this.setState({tipeSkb: val})
    }

    selectTypePpn = async (val) => {
        if (val === 'Ya') {
            this.setState({tipePpn: val, tipeVendor: "Vendor"})
            setTimeout(() => {
                this.formulaTax()
            }, 200)
        } else {
            this.setState({dataSelFaktur: { no_faktur: '' }, tgl_faktur: ''})
            this.setState({tipePpn: val, nilai_dpp: 0, nilai_ppn: 0 })
            setTimeout(() => {
                this.formulaTax()
            }, 200)
        }
    }

    onEnterVal = (val) => {
        this.setState({nilai_ajuan: val})
        setTimeout(() => {
            this.formulaTax()
         }, 200)
    }

    selectFaktur = (e) => {
        const {dataFaktur} = this.props.faktur
        const idVal = e.value
        const data = dataFaktur.find(({id}) => id === idVal)
        if (data === undefined) {
            console.log()
        } else {
            const nilai_ajuan = parseFloat(data.jumlah_dpp) + parseFloat(data.jumlah_ppn)
            this.setState({dataSelFaktur: data, nilai_ajuan: nilai_ajuan, nilai_dpp: data.jumlah_dpp, nilai_ppn: data.jumlah_ppn, tgl_faktur: data.tgl_faktur})
            setTimeout(() => {
                this.formulaTax()
             }, 500)
        }
    }

    prepFaktur = (val) => {
        console.log('masuk prep faktur')
        const {dataFaktur} = this.props.faktur
        const data = dataFaktur.find(({no_faktur}) => no_faktur === val)
        console.log({dataFaktur, val})
        if (data === undefined) {
            console.log()
        } else {
            const nilai_ajuan = parseFloat(data.jumlah_dpp) + parseFloat(data.jumlah_ppn)
            this.setState({dataSelFaktur: data, nilai_ajuan: nilai_ajuan, nilai_dpp: data.jumlah_dpp, nilai_ppn: data.jumlah_ppn, tgl_faktur: data.tgl_faktur})
            setTimeout(() => {
                this.formulaTax()
             }, 500)
        }
    }

    inputFaktur = (val) => {
        const {dataSelFaktur} = this.state
        const data = {
            no_faktur: val
        }
        const cek = dataSelFaktur.no_faktur.split('')
        if (cek.length > 1 && val === '') {
            this.setState({dataSelFaktur: dataSelFaktur})
        } else {
            this.setState({dataSelFaktur: data})
        }
        
    }

    inputNik = (val) => {
        // const {noNik} = this.state
        // const cek = noNik.split('')
        // if (cek.length > 1 && val === '') {
        //     this.setState({noNik: noNik})
        // } else {
        //     this.setState({noNik: val, typeniknpwp: 'manual'})
        // }
        if( val.length === 16 ) {
            this.setState({ showOptions : true })
        } else {
            this.setState(
                { showOptions : false },
                console.log('Option lenght is short {} {}', val, val.length)
            )
        }
    }

    inputNpwp = (val) => {
        // const {noNpwp} = this.state
        // const cek = noNpwp.split('')
        // if (cek.length > 1 && val === '') {
        //     this.setState({noNpwp: noNpwp})
        // } else {
        //     this.setState({noNpwp: val, typeniknpwp: 'manual'})
        // }
        if( val.length === 15 ) {
            this.setState({ showOptions : true })
        } else {
            this.setState(
                { showOptions : false },
                console.log('Option lenght is short {} {}', val, val.length)
            )
        }
    }

    inputNama = (val) => {
        this.setState({nama: val})
    }

    inputAlamat = (val) => {
        this.setState({alamat: val})
    }

    enterDPP = (val) => {
        const {nilai_ppn} = this.state
        const nilai_ajuan = parseFloat(val) + parseFloat(nilai_ppn)
        this.setState({nilai_ajuan: nilai_ajuan, nilai_dpp: val})
        setTimeout(() => {
            this.formulaTax()
         }, 500)
    }

    enterPPN = (val) => {
        const {nilai_dpp} = this.state
        const nilai_ajuan = parseFloat(val) + parseFloat(nilai_dpp)
        this.setState({nilai_ajuan: nilai_ajuan, nilai_ppn: val})
        setTimeout(() => {
            this.formulaTax()
         }, 500)
    }

    formulaTax = (val, type) => {
        const {dataTrans, nilai_ajuan, tipeVendor, tipePpn, nilai_dpp, nilai_ppn} = this.state
        const nilai = nilai_ajuan
        const tipe = tipeVendor
        console.log(dataTrans)
        if (dataTrans.jenis_pph === 'Non PPh' || dataTrans.jenis_pph === undefined) {
            this.setState({nilai_ajuan: nilai, nilai_utang: 0, nilai_buku: nilai, nilai_vendor: nilai, tipeVendor: nonObject})
        } else {
            if (tipePpn === 'Ya') {
                if (tipe === 'PMA') {
                    const nilai_buku = nilai_dpp
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(dataTrans.tarif_pph))
                    const nilai_vendor = Math.ceil((parseFloat(nilai_buku) + parseFloat(nilai_ppn)) - parseFloat(nilai_utang))
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                } else if (tipe === 'Vendor') {
                    const nilai_buku = nilai_dpp
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(dataTrans.tarif_pph))
                    const nilai_vendor = Math.ceil((parseFloat(nilai_buku) + parseFloat(nilai_ppn)) - parseFloat(nilai_utang))
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                }
            } else {
                if (tipe === 'PMA') {
                    const nilai_buku = Math.ceil(parseFloat(nilai) / parseFloat(dataTrans.dpp_grossup))
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(dataTrans.tarif_pph))
                    const nilai_vendor = nilai
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                } else if (tipe === 'Vendor') {
                    const nilai_buku = nilai
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(dataTrans.tarif_pph))
                    const nilai_vendor = Math.ceil(parseFloat(nilai) - parseFloat(nilai_utang))
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                }
            }
        }
    }

    modalStatus = () => {
        this.setState({openStatus: !this.state.openStatus})
    }

    chekApp = (val) => {
        const { listMut, nominal } = this.state
        const {dataCart} = this.props.ikk
        const {dataPagu} = this.props.pagu
        if (val === 'all') {
            const data = []
            let temp = parseFloat(nominal)
            for (let i = 0; i < dataCart.length; i++) {
                temp += parseFloat(dataCart[i].nilai_ajuan)
                data.push(dataCart[i].id)
            }
            if (temp > parseFloat(dataPagu.pagu)) {
                this.openConfirm(this.setState({confirm: 'failChek'}))
            } else {
                this.setState({listMut: data, nominal: temp})  
            }
        } else {
            let temp = parseFloat(nominal) + parseFloat(val.nilai_ajuan)
            if (temp > parseFloat(dataPagu.pagu)) {
                this.openConfirm(this.setState({confirm: 'failChek'}))
            } else {
                listMut.push(val.id)
                this.setState({listMut: listMut, nominal: temp})
            }
        }
    }

    chekRej = (val) => {
        const {listMut, nominal} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listMut: data, nominal: 0})
        } else {
            const data = []
            let temp = parseFloat(nominal)
            for (let i = 0; i < listMut.length; i++) {
                if (listMut[i] === val.id) {
                    data.push()
                    temp -= parseFloat(val.nilai_ajuan)
                } else {
                    data.push(listMut[i])
                }
            }
            this.setState({listMut: data, nominal: temp})
        }
    }

    prosesDetail = async (req, res) => {
        const token = localStorage.getItem("token")
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
        const {dataRinci, dropApp, dataItem, listMut, drop, newStock, dataTrans, showOptions} = this.state
        const {dataCart, dataDoc, depoCart, idIkk} = this.props.ikk
        const {dataPagu} = this.props.pagu
        const { detailDepo, dataDepo } = this.props.depo
        const {listGl} = this.props.coa
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
                                <div className={style.titleDashboard}>Draft Pengajuan IKK</div>
                            </div>
                            <div className='pagu'>
                                <div className={style.secPaguIkk}>
                                    <Button className='mr-2 mb-2' onClick={this.prosesOpenAdd} color="info" size="lg">Add</Button>
                                    <Button className='mb-2' onClick={this.prosesSubmitPre} color="success" size="lg">Submit</Button>
                                </div>
                                <div className='divPagu'>
                                    <Row className="mb-2 rowRinci">
                                        <Col md={6} className="uppercase">Nilai Pagu</Col> 
                                        <Col md={6}>: {(parseFloat(dataPagu.pagu)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Col>
                                    </Row>
                                    <Row className="mb-2 rowRinci">
                                        <Col md={6} className="uppercase">Nilai Saldo</Col> 
                                        <Col md={6}>: 0</Col>
                                    </Row>
                                    <Row className="mb-2 rowRinci">
                                        <Col md={6} className="uppercase">Nilai Yang Diajukan</Col> 
                                        <Col md={6}>: {(this.state.nominal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Col>
                                    </Row>
                                </div>
                                
                            </div>
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input  
                                                    className='mr-2'
                                                    type='checkbox'
                                                    checked={listMut.length === 0 ? false : listMut.length === dataCart.length ? true : false}
                                                    onChange={() => listMut.length === dataCart.length ? this.chekRej('all') : this.chekApp('all')}
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
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataCart.length !== 0 && dataCart.map(item => {
                                                return (
                                                <tr>
                                                    <th>
                                                        <input 
                                                        type='checkbox'
                                                        checked={listMut.find(element => element === item.id) !== undefined ? true : false}
                                                        onChange={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item) : () => this.chekRej(item)}
                                                        />
                                                    </th>
                                                    <th scope="row">{dataCart.indexOf(item) + 1}</th>
                                                    <th>{item.cost_center}</th>
                                                    <th>{item.no_coa}</th>
                                                    <th>{item.nama_coa}</th>
                                                    <th>{item.uraian}</th>
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
                <Modal className='modalrinci' isOpen={this.state.modalAdd} size="xl">
                    <ModalHeader>
                        Tambah Ajuan IKK
                    </ModalHeader>
                    <ModalBody>
                        <Formik
                        initialValues = {{
                            uraian: '',
                            periode_awal: '',
                            periode_akhir: '',
                            norek_ajuan: '',
                            nama_tujuan: '',
                            status_npwp: '',
                            nama_npwp: '',
                            no_npwp: '',
                            no_ktp: '',
                            nama_ktp: '',
                            nama_vendor: '',
                            alamat_vendor: '',
                            type_transaksi: '',
                            no_faktur: '',
                            dpp: 0,
                            ppn: 0,
                            no_bpkk: '',
                            tgl_tagihanbayar: '',
                            user_jabatan: '',
                        }}
                        validationSchema = {addSchema}
                        onSubmit={(values) => {this.addCartIkk(values)}}
                        >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
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
                                                value={detailDepo.area}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Profit center</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={detailDepo.profit_center}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No BPKK</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.no_bpkk}
                                                onBlur={handleBlur("no_bpkk")}
                                                onChange={handleChange("no_bpkk")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.no_bpkk ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>GL Name</Col>
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
                                                    options={showOptions ? this.state.listNpwp : []}
                                                    onChange={e => this.selectNikNpwp({val: e, type: 'npwp'})}
                                                    onInputChange={e => this.inputNpwp(e)}
                                                    isSearchable
                                                    components={
                                                        {
                                                          DropdownIndicator: () => null,
                                                        }
                                                    }
                                                    value={this.state.status_npwp === 'Ya' ? {value: this.state.noNpwp, label: this.state.noNpwp} : { value: '', label: '' }}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.status_npwp === 'Ya' && this.state.typeniknpwp === 'manual' && (this.state.noNpwp.length < 15 || this.state.noNpwp.length > 15)  ? (
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
                                                    options={showOptions ? this.state.listNik : []}
                                                    onChange={e => this.selectNikNpwp({val: e, type: 'nik'})}
                                                    onInputChange={e => this.inputNik(e)}
                                                    isSearchable
                                                    components={
                                                        {
                                                          DropdownIndicator: () => null,
                                                        }
                                                    }
                                                    value={this.state.status_npwp === 'Tidak' ? {value: this.state.noNik, label: this.state.noNik} : { value: '', label: '' }}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.status_npwp === 'Tidak' && this.state.typeniknpwp === 'manual' && (this.state.noNik.length < 16 || this.state.noNik.length > 16) ? (
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
                                                // disabled={
                                                //     this.state.jenisVendor === nonObject && listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? false
                                                //     : this.state.jenisVendor === nonObject ? true
                                                //     : false
                                                // }
                                                disabled
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
                                                type= "textarea" 
                                                // disabled={
                                                //     this.state.jenisVendor === nonObject && listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? false
                                                //     : this.state.jenisVendor === nonObject ? true
                                                //     : false
                                                // }
                                                disabled
                                                className="inputRinci"
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
                                                disabled={listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? true : false}
                                                type= "select" 
                                                className="inputRinci"
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
                                                // disabled={
                                                //     this.state.fakturList.length > 0 ? true
                                                //     : this.state.tipePpn === "Ya" ? false 
                                                //     : true
                                                // }
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
                                            <Col md={9} className="colRinci">:  
                                            {this.state.tipeVendor === nonObject 
                                                ? <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    disabled={this.state.tipeVendor === nonObject ? true : false}
                                                    value={this.state.tipeVendor}
                                                /> :
                                                <Input
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
                                                }
                                            </Col>
                                        </Row>
                                        {this.state.tipeVendor === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Yang Diajukan</Col>
                                            <Col md={9} className="colRinci">:  <NumberInput
                                                disabled={
                                                    this.state.idTrans === '' ? true 
                                                    : this.state.tipePpn === "Ya" || this.state.tipePpn === "" ? true
                                                    : false
                                                }
                                                className="inputRinci1"
                                                value={this.state.nilai_ajuan}
                                                maxLength={8}
                                                onValueChange={val => this.onEnterVal(val.floatValue)}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.nilai_ajuan > 1000000 && this.state.tipePpn === "Tidak" ? (
                                            <text className={style.txtError}>maximal pengisian nilai adalah 1 juta</text>
                                        ) : null}
                                        {this.state.nilai_ajuan === 0 && this.state.tipePpn === "Tidak" ? (
                                            <text className={style.txtError}>must be filled with number</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Vendor Memiliki Surat Keterangan Bebas Pajak (SKB)/Surat Keterangan (SKT)</Col>
                                            <Col md={9} className="colRinci">:  
                                            {(this.state.jenisVendor === nonObject || this.state.idTrans === '')
                                                ? <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    disabled
                                                    value={nonObject}
                                                />
                                            : 
                                                <Input
                                                type= "select" 
                                                className="inputRinci"
                                                value={this.state.tipeSkb}
                                                disabled={this.state.idTrans === '' ? true : false}
                                                // value={values.penanggung_pajak}
                                                // onBlur={handleBlur("penanggung_pajak")}
                                                onChange={e => {this.selectSkb(e.target.value)}}
                                                >
                                                    <option value=''>Pilih</option>
                                                    <option value="ya">Ya</option>
                                                    <option value="tidak">Tidak</option>
                                                </Input>
                                            }
                                                
                                            </Col>
                                        </Row>
                                        {this.state.jenisVendor !== nonObject && this.state.tipeSkb === '' ? (
                                            <text className={style.txtError}>must be filled</text>
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
                                                value={values.tgl_tagihanbayar}
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
                                                    <option value="ATM tertelan/hilang/terblokir">ATM tertelan/hilang/terblokir</option>
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
                                            <Col md={3}>Bank</Col>
                                            <Col md={9} className="colRinci">: 
                                            <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={this.state.bank}
                                                disabled
                                            />
                                            {/* {this.state.tujuan_tf === 'PMA' ? (
                                                
                                            ) : (
                                                <Select
                                                isDisabled={this.state.tujuan_tf === '' && true}
                                                className="inputRinci2"
                                                options={this.state.bankList}
                                                onChange={this.selectBank}
                                                />
                                            )} */}
                                            </Col>
                                        </Row>
                                        {this.state.bank === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nomor Rekening</Col>
                                            <Col md={9} className="colRinci">:  
                                                <Select
                                                    className="inputRinci2"
                                                    options={this.state.rekList}
                                                    onChange={this.selectRek}
                                                    value={{label: this.state.norek, value: this.state.tiperek}}
                                                />
                                            {/* {this.state.tujuan_tf === 'PMA' ? (
                                                
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
                                            )} */}
                                            </Col>
                                        </Row>
                                        {/* {this.state.digit !== null && values.norek_ajuan.length !== this.state.digit && this.state.tujuan_tf !== 'PMA'? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : this.state.digit === null && (values.norek_ajuan.length < 10 || values.norek_ajuan.length > 16) && this.state.tujuan_tf !== 'PMA'? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : this.state.tujuan_tf === 'PMA' && this.state.norek.length !== this.state.digit ? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : null} */}
                                        {this.state.norek.length !== this.state.digit ? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="modalFoot mt-5">
                                <div className='btnfoot ml-3'>
                                    <Button className="" size="md" color="warning" onClick={() => this.props.history.push('/verifven')}>Ajukan Data Vendor</Button>
                                </div>
                                <div className='btnfoot'>
                                    <Button 
                                        className="mr-3" 
                                        size="md" 
                                        disabled={this.state.no_coa === '' ? true 
                                        : values.status_npwp === 'Ya' && (values.nama_npwp === '' || values.no_npwp === '' ) ? true 
                                        : values.status_npwp === 'Tidak' && (values.nama_ktp === '' || values.no_ktp === '' ) ? true 
                                        // : values.norek_ajuan.length < this.state.digit ? true 
                                        : this.state.tujuan_tf === '' ? true
                                        : this.state.tipePpn === "Tidak" && this.state.nilai_ajuan > 1000000 ? true
                                        : this.state.jenisVendor !== nonObject && this.state.tipeSkb === '' ? true
                                        : false } 
                                        color="primary" 
                                        onClick={handleSubmit}>
                                        Save
                                    </Button>
                                    <Button className="" size="md" color="secondary" onClick={() => this.openModalAdd()}>Close</Button>
                                </div>
                            </div>
                            </>
                        )}
                        </Formik>
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
                <Modal className='modalrinci' isOpen={this.state.modalEdit} size="xl">
                    <ModalHeader>
                        Edit Ajuan IKK
                    </ModalHeader>
                    <ModalBody>
                        <Formik
                        initialValues = {{
                            uraian: idIkk.uraian || '',
                            periode_awal: idIkk.periode_awal || '',
                            periode_akhir: idIkk.periode_akhir || '',
                            norek_ajuan: idIkk.norek_ajuan || '',
                            nama_tujuan: idIkk.nama_tujuan || '',
                            status_npwp: idIkk.status_npwp || '',
                            nama_npwp: idIkk.nama_npwp || '',
                            no_npwp: idIkk.no_npwp || '',
                            no_ktp: idIkk.no_ktp || '',
                            nama_ktp: idIkk.nama_ktp || '',
                            nama_vendor: idIkk.nama_vendor || '',
                            alamat_vendor: idIkk.alamat_vendor || '',
                            type_transaksi: idIkk.type_transaksi || '',
                            no_faktur: idIkk.no_faktur || '',
                            dpp: idIkk.dpp || 0,
                            ppn: idIkk.ppn || 0,
                            no_bpkk: idIkk.no_bpkk || '',
                            tgl_tagihanbayar: idIkk.tgl_tagihanbayar || '',
                            user_jabatan: idIkk.user_jabatan || '',
                        }}
                        validationSchema = {addSchema}
                        onSubmit={(values) => {this.editCartIkk(values)}}
                        >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
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
                                                value={detailDepo.area}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Profit center</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled
                                                type= "text" 
                                                className="inputRinci"
                                                value={detailDepo.profit_center}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No BPKK</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.no_bpkk}
                                                onBlur={handleBlur("no_bpkk")}
                                                onChange={handleChange("no_bpkk")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.no_bpkk ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
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
                                                    options={showOptions ? this.state.listNpwp : []}
                                                    onChange={e => this.selectNikNpwp({val: e, type: 'npwp'})}
                                                    onInputChange={e => this.inputNpwp(e)}
                                                    isSearchable
                                                    components={
                                                        {
                                                          DropdownIndicator: () => null,
                                                        }
                                                    }
                                                    value={this.state.status_npwp === 'Ya' ? {value: this.state.noNpwp, label: this.state.noNpwp} : { value: '', label: '' }}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.status_npwp === 'Ya' && this.state.typeniknpwp === 'manual' && this.state.noNpwp.length < 15 && this.state.noNpwp.length > 15  ? (
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
                                                    options={showOptions ? this.state.listNik : []}
                                                    onChange={e => this.selectNikNpwp({val: e, type: 'nik'})}
                                                    onInputChange={e => this.inputNik(e)}
                                                    isSearchable
                                                    components={
                                                        {
                                                          DropdownIndicator: () => null,
                                                        }
                                                    }
                                                    value={this.state.status_npwp === 'Tidak' ? {value: this.state.noNik, label: this.state.noNik} : { value: '', label: '' }}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.status_npwp === 'Tidak' && this.state.typeniknpwp === 'manual' && this.state.noNik.length < 16 && this.state.noNik.length > 16 ? (
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
                                                // disabled={
                                                //     this.state.jenisVendor === nonObject && listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? false
                                                //     : this.state.jenisVendor === nonObject ? true
                                                //     : false
                                                // }
                                                disabled
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
                                                type= "textarea" 
                                                // disabled={
                                                //     this.state.jenisVendor === nonObject && listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? false
                                                //     : this.state.jenisVendor === nonObject ? true
                                                //     : false
                                                // }
                                                disabled
                                                className="inputRinci"
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
                                                disabled={listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? true : false}
                                                type= "select" 
                                                className="inputRinci"
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
                                                // disabled={
                                                //     this.state.fakturList.length > 0 ? true
                                                //     : this.state.tipePpn === "Ya" ? false 
                                                //     : true
                                                // }
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
                                                disabled={
                                                    this.state.idTrans === '' ? true 
                                                    : this.state.tipePpn === "Ya" || this.state.tipePpn === "" ? true
                                                    : false
                                                }
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
                                            <Col md={3}>Vendor Memiliki Surat Keterangan Bebas Pajak (SKB)/Surat Keterangan (SKT)</Col>
                                            <Col md={9} className="colRinci">:  
                                            {(this.state.jenisVendor === nonObject || this.state.idTrans === '')
                                                ? <Input
                                                    type= "text" 
                                                    className="inputRinci"
                                                    disabled
                                                    value={nonObject}
                                                />
                                            : 
                                                <Input
                                                type= "select" 
                                                className="inputRinci"
                                                value={this.state.tipeSkb}
                                                disabled={this.state.idTrans === '' ? true : false}
                                                // value={values.penanggung_pajak}
                                                // onBlur={handleBlur("penanggung_pajak")}
                                                onChange={e => {this.selectSkb(e.target.value)}}
                                                >
                                                    <option value=''>Pilih</option>
                                                    <option value="ya">Ya</option>
                                                    <option value="tidak">Tidak</option>
                                                </Input>
                                            }
                                                
                                            </Col>
                                        </Row>
                                        {this.state.jenisVendor !== nonObject && this.state.tipeSkb === '' ? (
                                            <text className={style.txtError}>must be filled</text>
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
                                                    <option value="ATM tertelan/hilang/terblokir">ATM tertelan/hilang/terblokir</option>
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
                                            <Col md={3}>Bank</Col>
                                            <Col md={9} className="colRinci">: 
                                            <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={this.state.bank}
                                                disabled
                                            />
                                            {/* {this.state.tujuan_tf === 'PMA' ? (
                                                
                                            ) : (
                                                <Select
                                                isDisabled={this.state.tujuan_tf === '' && true}
                                                className="inputRinci2"
                                                options={this.state.bankList}
                                                onChange={this.selectBank}
                                                />
                                            )} */}
                                            </Col>
                                        </Row>
                                        {this.state.bank === '' ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nomor Rekening</Col>
                                            <Col md={9} className="colRinci">: 
                                                <Select
                                                    className="inputRinci2"
                                                    options={this.state.rekList}
                                                    onChange={this.selectRek}
                                                    value={{label: this.state.norek, value: this.state.tiperek}}
                                                /> 
                                            {/* {this.state.tujuan_tf === 'PMA' ? (
                                                
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
                                            )} */}
                                            </Col>
                                        </Row>
                                        {/* {this.state.digit !== null && values.norek_ajuan.length !== this.state.digit && this.state.tujuan_tf !== 'PMA'? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : this.state.digit === null && (values.norek_ajuan.length < 10 || values.norek_ajuan.length > 16) && this.state.tujuan_tf !== 'PMA'? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : this.state.tujuan_tf === 'PMA' && this.state.norek.length !== this.state.digit ? (
                                            <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                        ) : null} */}
                                        {this.state.norek.length !== this.state.digit ? (
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
                                            : values.status_npwp === 'Ya' && (values.nama_npwp === '' || values.no_npwp === '' ) ? true 
                                            : values.status_npwp === 'Tidak' && (values.nama_ktp === '' || values.no_ktp === '' ) ? true 
                                            // : values.norek_ajuan.length < this.state.digit ? true 
                                            : this.state.tujuan_tf === '' ? true
                                            : this.state.tipePpn === "Tidak" && this.state.nilai_ajuan > 1000000 ? true
                                            : false } 
                                            color="primary" 
                                            onClick={handleSubmit}>
                                            Save
                                        </Button>
                                        <Button className="" size="md" color="secondary" onClick={() => this.openModalEdit()}>Close</Button>
                                    </div>
                                </div>
                            </>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalStock} toggle={this.openModalStock} size="lg">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
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
                <Modal isOpen={
                    this.props.ikk.isLoading 
                    || this.props.email.isLoading 
                    || this.props.approve.isLoading 
                    || this.props.finance.isLoading 
                    || this.props.user.isLoading 
                    || this.props.dokumen.isLoading 
                    || this.props.coa.isLoading 
                    || this.props.notif.isLoading 
                    || this.props.bank.isLoading 
                    || this.props.pagu.isLoading 
                    || this.state.isLoading 
                    || this.props.faktur.isLoading 
                    || this.props.vendor.isLoading
                    } size="sm">
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
                                    Apakah anda yakin ingin submit pengajuan ikk ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.submitIkk()}>Ya</Button>
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
                                        <th>NAMA NPWP</th>
                                        <th>NOMOR NPWP</th>
                                        <th>NAMA KTP</th>
                                        <th>NOMOR KTP</th>
                                        <th>DPP</th>
                                        <th>PPN</th>
                                        <th>PPh</th>
                                        <th>Jenis PPh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataCart.length !== 0 && dataCart.map(item => {
                                        return (
                                            listMut.find(element => element === item.id) !== undefined ? (
                                                <tr>
                                                    <th scope="row">{dataCart.indexOf(item) + 1}</th>
                                                    <th>{item.cost_center}</th>
                                                    <th>{item.no_coa}</th>
                                                    <th>{item.nama_coa}</th>
                                                    <th>{item.uraian}</th>
                                                    <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                    <th>{item.nilai_ajuan}</th>
                                                    <th>{item.bank_tujuan}</th>
                                                    <th>{item.norek_ajuan}</th>
                                                    <th>{item.nama_tujuan}</th>
                                                    <th>{item.status_npwp === 0 ? 'Tidak' : 'Ya'}</th>
                                                    <th>{item.nama_npwp}</th>
                                                    <th>
                                                        <div className='rowCenter'>
                                                            {item.typeniknpwp === 'manual' && item.status_npwp === 1 && (
                                                                <Button className='mr-1' color='warning' size='sm'>new</Button>
                                                            )}
                                                            <text>{item.no_npwp}</text>
                                                        </div>
                                                    </th>
                                                    <th>{item.nama_ktp}</th>
                                                    <th>
                                                        <div className='rowCenter'>
                                                            {item.typeniknpwp === 'manual' && item.status_npwp === 0 && (
                                                                <Button className='mr-1' color='warning' size='sm'>new</Button>
                                                            )}
                                                            <text>{item.no_ktp}</text>
                                                        </div>
                                                    </th>
                                                    <th>{item.dpp}</th>
                                                    <th>{item.ppn}</th>
                                                    <th>{item.nilai_utang}</th>
                                                    <th>{item.jenis_pph}</th>
                                                </tr>
                                            ) : (
                                                null
                                            )
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
                            {/* <Button className="mr-2" color="info"  onClick={() => this.prosesModalFpd()}>FPD</Button>
                            <Button className="mr-2" color="warning"  onClick={() => this.openModalFaa()}>Form IKK</Button> */}
                        </div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="success" onClick={this.openModalConfirm}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalFaa} toggle={this.openModalFaa} size="xl">
                    <ModalBody>
                        <div className='mb-3'>
                            <div className='titleIkk'>
                                <div>
                                    <div className="uppercase">pt. pinus merah abadi</div>
                                    <div className="uppercase">cabang / depo : {dataCart.length > 0 ? dataCart[0].area : ''}</div>
                                </div>
                                <div className='secIkk'>
                                    <div className="uppercase mr-1">nomor ikk :</div> 
                                    <div className="uppercase numIkk ml-1">{dataCart.length > 0 ? dataCart[0].no_transaksi : ''}</div>
                                </div>
                            </div>
                            <div className='subIkk'>
                                <div className='uppercase'>ikhtisar kas kecil</div>
                                <div>Tanggal : {dataCart.length > 0 &&  dataCart[0].start_ikk !== null ? moment(dataCart[0].start_ikk).format('DD MMMM YYYY') : ''}</div>
                            </div>
                        </div>
                        <div>
                            <Table bordered responsive hover 
                                className={style.tabikk}
                            >
                                <thead>
                                    <tr>
                                        <th className='tbklaim' rowSpan={2}>NO</th>
                                        <th className='tbklaim' rowSpan={2}>NO. BPKK</th>
                                        <th className='tbklaim' rowSpan={2} colSpan={2}>URAIAN</th>
                                        <th className='tbklaim' rowSpan={2}>KETERANGAN</th>
                                        <th colSpan={2}>USER</th>
                                        <th className='tbklaim' rowSpan={2}>JUMLAH</th>
                                    </tr>
                                    <tr>
                                        <th>NAMA</th>
                                        <th>JABATAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataCart.length !== 0 && dataCart.map(item => {
                                        return (
                                            listMut.find(element => element === item.id) !== undefined ? (
                                            <tr>
                                                <th scope="row">{dataCart.indexOf(item) + 1}</th>
                                                <th>{item.no_bpkk}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.sub_coa}</th>
                                                <th>{item.nama_npwp === null || item.nama_npwp === '' ? item.nama_ktp : item.nama_npwp}</th>
                                                <th>{item.user_jabatan}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                            </tr>
                                            ) : (null)
                                            )
                                        })}
                                </tbody>
                            </Table>
                        </div>
                        <Table borderless responsive className="tabPreview">
                           <thead>
                               <tr>
                                   <th className="buatPre">Disetujui oleh,</th>
                                   <th className="buatPre">Dibuat oleh,</th>
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
                                    listMut.find(element => element === item.id) !== undefined ? (
                                    <Row className='mt-4'>
                                        <Col md={1} className='upper'>
                                            <div className='line'>{dataCart.indexOf(item) + 1}</div>
                                        </Col>
                                        <Col md={8} className='upper'>
                                            <div className='line2'>{item.uraian}</div>
                                            <div className='line mt-1'>NO REK {item.bank_tujuan} {item.norek_ajuan}</div>
                                        </Col>
                                        <Col md={3} className='upper'>
                                            <div className='line'>{parseFloat(item.nilai_ajuan)}</div>
                                        </Col>
                                    </Row>
                                    ) : (null)
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
                                        {this.state.totalfpd}
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
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit Ikk</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan seluruh dokumen lampiran telah diupload</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failChek' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Memilih Data Ikk</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan nilai ajuan data yg dipilih tidak melewati nilai pagu</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failSubChek' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit Ikk</div>
                                <div className={[style.sucUpdate, style.green]}>Pilih data IKK yg ingin diajukan terlebih dahulu</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failJenisTrans' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Mohon pilih ulang jenis transaksi</div>
                                <div className={[style.sucUpdate, style.green]}>Pilihan jenis transaksi tidak tersedia</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejCart' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Data</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan pengisian program dan periode sesuai dengan SOP</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'delCart' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menghapus Data</div>
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
                    <Button color="primary" onClick={this.openModalDoc}>
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
    ikk: state.ikk,
    bank: state.bank,
    pagu: state.pagu,
    finance: state.finance,
    dokumen: state.dokumen,
    vendor: state.vendor,
    faktur: state.faktur,
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
    addCart: ikk.addCart,
    getCart: ikk.getCart,
    deleteCart: ikk.deleteCart,
    resetIkk: ikk.resetIkk,
    submitIkk: ikk.submitIkk,
    getDocIkk: ikk.getDocCart,
    uploadDocIkk: ikk.uploadDocCart,
    getBank: bank.getBank,
    submitIkkFinal: ikk.submitIkkFinal,
    getApproval: ikk.getApproval,
    getFinRek: finance.getFinRek,
    getPagu: pagu.getPagu,
    showDokumen: dokumen.showDokumen,
    getVendor: vendor.getVendor,
    getFaktur: faktur.getFaktur,
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    getDetail: ikk.getDetail,
    getDetailId: ikk.getDetailId,
    editIkk: ikk.editIkk,
    getAllNotif: notif.getAllNotif,
    addNotif: notif.addNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(CartIkk)
