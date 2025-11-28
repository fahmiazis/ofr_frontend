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
import { AiOutlineFileExcel, AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import MaterialTitlePanel from "../components/material_title_panel"
import SidebarContent from "../components/sidebar_content"
import style from '../assets/css/input.module.css'
import user from '../redux/actions/user'
import vendor from '../redux/actions/vendor'
import {connect} from 'react-redux'
import moment from 'moment'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../redux/actions/auth'
import menu from '../redux/actions/menu'
import reason from '../redux/actions/reason'
import notif from '../redux/actions/notif'
import Pdf from "../components/Pdf"
import depo from '../redux/actions/depo'
import email from '../redux/actions/email'
import dokumen from '../redux/actions/dokumen'
import bank from '../redux/actions/bank'
import {default as axios} from 'axios'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../components/NavBar'
import ikk from '../redux/actions/ikk'
import verven from '../redux/actions/verven'
import Tracking from '../components/Ikk/tracking'
import FPD from '../components/Ikk/FPD'
import Formikk from '../components/Ikk/formikk'
import Email from '../components/Ikk/EmailVerven'
import JurnalArea from '../components/Ikk/JurnalArea'
import TableRincian from '../components/Ikk/tableRincian'
import NumberInput from '../components/NumberInput'
import Countdown from 'react-countdown'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import Select from 'react-select'
import { MdUpload, MdDownload, MdEditSquare, MdAddCircle, MdDelete } from "react-icons/md";
import readXlsxFile from 'read-excel-file'
import ExcelJS from "exceljs"
import fs from "file-saver"
const accessFi = [8, 7, 17, 2, 9]
const {REACT_APP_BACKEND_URL} = process.env

const vendorSchema = Yup.object().shape({
    nama: Yup.string().required('must be filled'),
    jenis: Yup.string().required('must be filled'),
    no_npwp: Yup.number(),
    no_ktp: Yup.number(),
    alamat: Yup.string().required('must be filled'),
    datef_skb: Yup.date(),
    datel_skb: Yup.date(),
    no_skb: Yup.string(),
    no_skt: Yup.string()
})

const filterSchema = Yup.object().shape({
    ident: Yup.number()
});

const rekvenSchema = Yup.object().shape({
    // nik: Yup.string(),
    // npwp: Yup.string(),
    // bank: Yup.string().required('must be filled'),
    no_rekening: Yup.string(),
    tujuan_tf: Yup.string().required('must be filled'),
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
            detail: {},
            drop: false,
            bulan: moment().format('MMMM'),
            opendok: false,
            month: moment().format('M'),
            dropOp: false,
            noAsset: null,
            filter: 'available',
            newVerven: [],
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
            time: 'all',
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            // time2: moment().endOf('month').format('YYYY-MM-DD'),
            time1: '',
            time2: '',
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
            dataAdd: {},
            rinciEdit: false,
            modalId: false,
            statEmail: '',
            modResmail: false,
            appDoc: false,
            type_skb: '',
            fileName: {},
            infoError: '',
            detRekven: {},
            dataDel: {},
            modalAddRekven: false,
            detModRekven: false,
            modUpRekven: false,
            fileUpload: '',
            bankList: [],
            bank: '',
            digit: 0,
            modalEdit: '',
            detailVen: {},
            duplikat: [],
            dataRegis: {},
            typeTrans: false,
            openSync: false,
            typeAjuan: '',
            modalDelRekven: false
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

    checkDoc = (val) => {
        const { dataZip } = this.state
        const {dataDoc} = this.props.verven
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
        const {dataDoc} = this.props.verven
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
        if (size >= 25000000) {
            this.setState({errMsg: "Maximum upload size 25 MB", confirm: 'maxUpload'})
            this.openConfirm()
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
            this.setState({
                errMsg: 'Invalid file type. Only excel, pdf, zip, png, jpg and rar files are allowed.',
                confirm: 'onlyUpload'
            })
            this.openConfirm()
        } else {
            const { noTrans } = this.props.verven
            const { detail } = this.state
            const tempno = {
                no: noTrans
            }
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocVerven(token, detail.no_transaksi, detail.id, data)
        }
    }

    uploadPicture = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 25 MB"})
            this.openConfirm()
        } else if (type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({errMsg: 'Invalid file type. Only image files are allowed.'})
            this.openConfirm()
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
            this.setState({errMsg: "Maximum upload size 25 MB"})
            this.openConfirm()
        } else if (type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({errMsg: 'Invalid file type. Only image files are allowed.'})
            this.openConfirm()
        } else {
            const { dataId } = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadImage(token, dataId, data)
        }
    }

    onChangeHandler = e => {
        const { size, type } = e.target.files[0]
        if (size >= 5120000) {
            this.setState({ errMsg: "Maximum upload size 5 MB" })
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel') {
            this.setState({ errMsg: 'Invalid file type. Only excel files are allowed.' })
            this.uploadAlert()
        } else {
            this.setState({ fileUpload: e.target.files[0] })
        }
    }

    getApproveStock = async (value) => { 
        const token = localStorage.getItem('token')
        await this.props.getApproveStock(token, value.no, value.nama)
    }

    rejectVerven = async (val) => {
        const {listMut, listReason, listMenu, listReject} = this.state
        const { detailVerven } = this.props.verven
        const token = localStorage.getItem('token')
        const tempno = {
            no: detailVerven[0].no_transaksi
        }
        let temp = ''
        for (let i = 0; i < listReason.length; i++) {
            temp += listReason[i] + '. '
        }
        const data = {
            no: detailVerven[0].no_transaksi,
            list: listMut,
            alasan: temp + val.alasan,
            menu: listMenu.toString(),
            type_reject: listReject[0]
        }
        console.log(data)
        await this.props.rejectVerven(token, data)
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
        const {detailVerven} = this.props.verven
        let total = 0
        for (let i = 0; i < detailVerven.length; i++) {
            total += parseFloat(detailVerven[i].nilai_ajuan)
        }
        this.setState({totalfpd: total})
        this.openModalFaa()
    }

    prosesModalFpd = () => {
        const {detailVerven} = this.props.verven
        let total = 0
        for (let i = 0; i < detailVerven.length; i++) {
            total += parseFloat(detailVerven[i].nilai_ajuan)
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
        this.getDataVerven()
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
        const typeNotif = localStorage.getItem('typeNotif')
        const {item, type, regis} = (this.props.location && this.props.location.state) || {}
        const data = {
            kdMenu: 'Verifikasi Data Vendor',
            subMenu: 'Verifikasi Finance'
        }
        await this.props.getSubMenu(token, data)
        console.log(dataCek)
        if (typeNotif !== undefined && typeNotif === 'approve') {
            localStorage.removeItem('typeNotif')
            await this.getDataVerven()
            this.prosesDetail(item)
        } else if (dataCek !== undefined && dataCek !== null) {
            const data = {
                no_transaksi: dataCek
            }
            this.getDataVerven()
            this.prosesDocTab(data)
        } else if (regis !== undefined && regis.length > 0) {
            this.setState({dataRegis: regis[0]})
        } else {
            this.getDataVerven()
        }
    }

    setError = (val) => {
        this.setState({infoError: val, confirm: 'errfill'})
        setTimeout(() => {
            this.openConfirm()
        }, 100)
    }

    componentDidUpdate() {
        const token = localStorage.getItem("token")
        const { isApprove } = this.props.verven
        const { isReject, isUpload, isAdd } = this.props.verven
        const {type_skb} = this.state
        const { isSend } = this.props.email
        if (isApprove === false) {
            this.setState({confirm: 'rejApprove'})
            this.openConfirm()
            this.openModalApprove()
            this.props.resetVerven()
        }  else if (isUpload === true) {
            const { noTrans } = this.props.verven
            const data = {
                no: noTrans,
                name: 'Pengajuan area',
                tipeSkb: type_skb === '' ? 'tidak' : type_skb === 'SKB' || type_skb === 'SKT' ? 'ya' : type_skb
            }
            this.props.getDocument(token, data)
            this.props.resetVerven()
        } else if (isReject === false) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
            this.openModalReject()
            this.props.resetVerven()
        } else if (isSend === false) {
            this.setState({confirm: 'rejSend'})
            this.openConfirm()
            this.props.resetEmail()
        } else if (isAdd === false) {
            console.log('masuk king')
            this.setState({confirm: 'addFalse'})
            this.openConfirm()
            this.props.resetVerven()
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

    prosesOpenRekven = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getBank(token)
        const { dataBank } = this.props.bank
        const bank = [
            { value: '', label: '-Pilih-' }
        ]
        dataBank.map(item => {
            return (
                bank.push({ value: item.digit, label: item.name })
            )
        })
        this.setState({ bankList: bank })
        if (val === 'add') {
            this.openAddRekven()
        } else {
            const { dataBank } = this.props.bank
            const cekVal = this.state.detRekven.bank
            const data = dataBank.find(({name}) => name === cekVal)
            console.log({dataBank, val})
            if (data === undefined) {
                this.setState()
            } else {
                this.setState({bank: data.name, digit: data.digit})
            }
            this.openDetRekven()
        }
    }
    

    openAddRekven = () => {
        this.setState({ modalAddRekven: !this.state.modalAddRekven })
    }

    openDetRekven = () => {
        this.setState({ detModRekven: !this.state.detModRekven })
    }

    openUpRekven = (val) => {
        this.setState({ modUpRekven: !this.state.modUpRekven, fileUpload: '' })
    }

    cekRekven = (val) => {
        const data = val.data
        if ((data.no_ktp === null || data.no_ktp === '') && (data.no_npwp === null || data.no_npwp === '')) {
            this.setState({confirm: 'falseIdent'})
            this.openConfirm()
        } else {
            this.setState({detailVen: data})
            if (val.type === 'add') {
                this.prosesOpenRekven('add')
            } else if (val.type === 'edit') {
                this.prosesOpenRekven('edit')
            } else if (val.type === 'upload') {
                this.openUpRekven()
            } else if (val.type === 'download') {
                this.downloadRekven()
            }
        }
    }


    downloadRekven = () => {
        const { dataRekven } = this.props.verven

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data rekening vendor')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }


        ws.columns = [
            { header: 'NIK', key: 'c1' },
            { header: 'NPWP', key: 'c2' },
            { header: 'BANK', key: 'c3' },
            { header: 'NO REKENING', key: 'c4' }
        ]

        if (dataRekven.length > 0) {
            dataRekven.map((item, index) => {
                return (ws.addRow(
                    {
                        c1: item.nik,
                        c2: item.npwp,
                        c3: item.bank,
                        c4: item.no_rekening
                    }
                )
                )
            })
        } else {
            for (let i = 0; i < 1; i++) {
                ws.addRow(
                    {
                        c1: this.state.detailVen.no_ktp,
                        c2: this.state.detailVen.no_npwp,
                        c3: '',
                        c4: ''
                    }
                )
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
                `Data Rekening Vendor ${moment().format('DD MMMM YYYY')}.xlsx`
            )
        })
    }


    addDataRekven = async (val) => {
        const { modalEdit, rinciEdit } = this.state
        const { dataRekven, detailVerven } = this.props.verven
        
        const token = localStorage.getItem('token')
        const data = {
            nik: val.nik,
            npwp: val.npwp,
            bank: val.tujuan_tf === 'rekening' ? this.state.bank : 'ID Pelanggan',
            no_rekening: val.tujuan_tf === 'rekening' ? val.no_rekening : 'ID Pelanggan',
            tujuan_tf: val.tujuan_tf
        }

        const noTrans = rinciEdit === true ? detailVerven[0].no_transaksi : this.props.verven.noTrans

        const noData = {
            no: noTrans
        }

        const dataNo = {
            no: noTrans,
            name: 'Pengajuan area'
        }
        
        if (dataRekven.length > 0) {
            const cek = dataRekven.find((item) => (data.no_rekening !== '' && item.no_rekening === data.no_rekening))
            if (cek !== undefined) {
                this.setState({ confirm: 'rejAddRekven' })
                this.openConfirm()
            } else {
                const send = {
                    no: noTrans,
                    ...data
                }
                await this.props.addRekven(token, send)
                await this.props.getRekven(token, noData)
                await this.props.getDocument(token, dataNo)
                this.setState({ confirm: 'sucAddRekven' })
                this.openConfirm()
                this.openAddRekven()
                // if (modalEdit === true) {
                //     const send = {
                //         no: noTrans,
                //         ...data
                //     }
                //     await this.props.addRekven(token, send)
                //     await this.props.getRekven(token, noData)
                //     const dataApi = this.props.ops.dataRekven
                //     this.setState({ dataRekven: dataApi })
                //     this.setState({ confirm: 'sucAddRekven' })
                //     this.openConfirm()
                //     this.openAddRekven()
                // } else {
                //     dataRekven.push(data)
                //     this.setState({ dataRekven: dataRekven })
                //     this.setState({ confirm: 'sucAddRekven' })
                //     this.openConfirm()
                //     this.openAddRekven()
                // }
            }
        } else {
            const send = {
                no: noTrans,
                ...data
            }
            await this.props.addRekven(token, send)
            await this.props.getRekven(token, noData)
            await this.props.getDocument(token, dataNo)
            this.setState({ confirm: 'sucAddRekven' })
            this.openConfirm()
            this.openAddRekven()
            // if (modalEdit === true) {
            //     const send = {
            //         no: noTrans,
            //         ...data
            //     }
            //     await this.props.addRekven(token, send)
            //     await this.props.getRekven(token, noData)
            //     const dataApi = this.props.ops.dataRekven
            //     this.setState({ dataRekven: dataApi })
            //     this.setState({ confirm: 'sucAddRekven' })
            //     this.openConfirm()
            //     this.openAddRekven()
            // } else {
            //     dataRekven.push(data)
            //     this.setState({ dataRekven: dataRekven })
            //     this.setState({ confirm: 'sucAddRekven' })
            //     this.openConfirm()
            //     this.openAddRekven()
            // }
        }
    }

    updateDataRekven = async (val) => {
        const { detRekven, modalEdit, rinciEdit } = this.state
        const { dataRekven, detailVerven } = this.props.verven
        const token = localStorage.getItem('token')
        const data = {
            nik: val.nik,
            npwp: val.npwp,
            bank: val.tujuan_tf === 'rekening' ? this.state.bank : 'ID Pelanggan',
            no_rekening: val.tujuan_tf === 'rekening' ? val.no_rekening : 'ID Pelanggan',
            tujuan_tf: val.tujuan_tf
        }

        const noTrans = rinciEdit === true ? detailVerven[0].no_transaksi : this.props.verven.noTrans

        const noData = {
            no: noTrans
        }

        const dataNo = {
            no: noTrans,
            name: 'Pengajuan area'
        }
        const dataUp = []
        if (dataRekven.length > 0) {
            const cek = dataRekven.find((item) => (data.no_rekening !== '' && item.no_rekening === data.no_rekening))
            if (cek !== undefined) {
                this.setState({ confirm: 'rejEditRekven' })
                this.openConfirm()
            } else {
                const send = {
                    no: noTrans,
                    id: detRekven.id,
                    ...data
                }
                await this.props.updateRekven(token, send)
                await this.props.getRekven(token, noData)
                await this.props.getDocument(token, dataNo)
                this.setState({ confirm: 'editRekven' })
                this.openConfirm()
                this.openDetRekven()
            }
        }
    }

    delDataRekven = async () => {
        const { detRekven, modalEdit } = this.state
        const { noTrans, dataRekven } = this.props.verven
        const token = localStorage.getItem('token')
        const noData = {
            no: noTrans
        }
        await this.props.deleteRekven(token, detRekven.id)
        await this.props.getRekven(token, noData)
        this.setState({ confirm: 'delRekven' })
        this.openConfirm()
        this.confirmDel()
    }

    confirmDel = () => {
        this.setState({ modalDelRekven: !this.state.modalDelRekven })
    }

    uploadDataRekven = async (val) => {
        const { fileUpload, modalEdit } = this.state
        const { noTrans, dataRekven } = this.props.verven
        const token = localStorage.getItem('token')
        const dataTemp = []
        const rows = await readXlsxFile(fileUpload)
        const dataCek = []
        const count = []
        const parcek = [
            'NIK',
            'NPWP',
            'BANK',
            'NO REKENING'
        ]
        const noData = {
            no: noTrans
        }
        const valid = rows[0]
        for (let i = 0; i < parcek.length; i++) {
            if (valid[i] === parcek[i]) {
                count.push(1)
            }
        }
        if (count.length === parcek.length) {
            rows.shift()
            const noIdent = []
            const result = []
            for (let i = 0; i < rows.length; i++) {
                console.log('masuk cek duplikat')
                const dataOps = rows[i]
                const noid = `no rekening: ${dataOps[3]}`
                noIdent.push(noid)
            }

            const obj = {}

            noIdent.forEach(item => {
                if (!obj[item]) { obj[item] = 0 }
                obj[item] += 1
            })

            for (const prop in obj) {
                if (obj[prop] >= 2) {
                    result.push(prop)
                }
            }
            if (result.length > 0) {
                this.openUpRekven()
                this.setState({ confirm: 'dupUpload', duplikat: result })
                this.openConfirm()
            } else {
                for (let i = 0; i < rows.length; i++) {
                    const dataOps = rows[i]
                    const data = {
                        nik: dataOps[0],
                        npwp: dataOps[1] ,
                        bank: dataOps[2],
                        no_rekening: dataOps[3]
                    }

                    dataTemp.push(data)
                }
                console.log(dataCek)
                console.log(dataTemp)
                const comb = [...dataRekven, ...dataTemp]
                console.log(comb)
                const send = {
                    no: noTrans,
                    list: comb
                }
                await this.props.uploadRekven(token, send)
                await this.props.getRekven(token, noData)
                const { opsRekven } = this.props.ops
                this.setState({ dataRekven: opsRekven })
                
                const valRekven = opsRekven.reduce((accumulator, object) => {
                    return accumulator + parseFloat(object.nominal);
                }, 0)
                this.setState({nilai_ajuan: valRekven})
                setTimeout(() => {
                    this.formulaTax()
                }, 100)
                
                this.openUpRekven()
                this.setState({ confirm: 'upload' })
                this.openConfirm()
            }
        } else {
            this.openUpRekven()
            this.setState({ confirm: 'falseUpload' })
            this.openConfirm()
        }
    }

    selectBank = (e) => {
        const digit = e.value === null || e.value === undefined || e.value === '' ? null : e.value
        this.setState({ bank: e.label, digit: digit })
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

    getDataVerven = async (value) => {
        const level = localStorage.getItem('level')
        this.setState({limit: value === undefined ? 10 : value.limit})
        const access = [4, 14, 8, 7, 17, 2, 9]
        await this.changeFilter(access.find(item => item === parseInt(level)) ? 'available' : 'all')
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

        this.setState({listMut: []})
        await this.props.getDetailVerven(token, tempno)
        await this.props.getRekven(token, tempno)
        this.openModalRinci()

        // await this.props.getResmail(token, tempno)

        // const { dataResmail } = this.props.email
        // if (dataResmail === null || filter === 'available') {
        //     this.openModalRinci()
        // } else {
        //     const data = {
        //         no: val.no_transaksi,
        //         kode: val.kode_plant,
        //         jenis: dataResmail.type_trans,
        //         tipe: dataResmail.type,
        //         menu: dataResmail.menu
        //     }
        //     await this.props.getDraftEmail(token, data)
        //     this.openModalRinci()
        // }
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
                    jenis: 'vendor',
                    tipe: 'submit',
                    menu: 'Revisi Data (Verifikasi Data Vendor)'
                }
               
            } else {
                tempno = {
                    ...tempno,
                    jenis: 'vendor',
                    tipe: 'submit',
                    menu: 'Pengajuan area (Verifikasi Data Vendor)'
                }
            }
        } else {
            if (val[0].status_reject === 1) {
                tempno = {
                    ...tempno,
                    jenis: 'vendor',
                    tipe: 'reject',
                    typeReject: val[0].status_transaksi === 0 ? 'pembatalan' : 'perbaikan',
                    menu: 'Pengajuan area (Verifikasi Data Vendor)'
                }
            } else {
                tempno = {
                    ...tempno,
                    jenis: 'vendor',
                    tipe: 'submit',
                    menu: 'Verifikasi Tax (Verifikasi Data Vendor)'
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
        const { detailVerven } = this.props.verven
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
            no: detailVerven[0].no_transaksi,
            tipe: 'vendor'
        }
        await this.props.sendEmail(token, tempno)
        this.openModResmail()
        this.setState({confirm: 'resmail'})
        this.openConfirm()
    }

    prosesDetailEdit = async (val) => {
        const token = localStorage.getItem("token")
        const tempno = {
            no: val.no_transaksi
        }
        this.setState({listMut: []})
        await this.props.getDetailVerven(token, tempno)
        await this.props.getRekven(token, tempno)
        this.openRinciEdit()
    }

    openRinciEdit = () => {
        this.setState({rinciEdit: !this.state.rinciEdit})
    }

    prosesEditId = async (val) => {
        const token = localStorage.getItem("token")
        const send = {
            no: val.no_transaksi
        }
        await this.props.getDetailId(token, val.id)
        await this.props.getRekven(token, send)
        const {idVerven} = this.props.verven
        this.setState({type_skb: idVerven.type_skb})
        this.openEdit()
    }

    prosesEdit = async (val) => {
        const token = localStorage.getItem("token")
        const { detailVerven, idVerven } = this.props.verven
        const tipe = this.state.type_skb

        const sendData = {
            nama: val.nama,
            no_npwp: val.no_npwp.length < 16 ? '' : val.no_npwp,
            no_ktp: val.jenis === 'Orang Pribadi' ? val.no_ktp : '',
            alamat: val.alamat,
            jenis: val.jenis,
            type_skb: tipe,
            no_skb: val.no_skb,
            no_skt: val.no_skt,
            datef_skb: val.datef_skb,
            datel_skb: val.datel_skb
        }

        await this.props.editVerven(token, idVerven.id, sendData)

        const noData = {
            no: detailVerven[0].no_transaksi
        }
        await this.props.getDetailVerven(token, noData)
        this.setState({confirm: 'isEdit'})
        this.openConfirm()
        this.openEdit()
    }

    openEdit = () => {
        this.setState({modalId: !this.state.modalId})
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
        const {dataIkk, noDis} = this.props.verven
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const status = val === 'available' && accessFi.find(x => x === parseInt(level)) ? 2 : val === 'available' && (level === '4' || level === '14') ? 3 : 9
        const statusAll = val === 'bayar' || val === 'completed' ? 8 : 'all'
        const {time1, time2} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const role = localStorage.getItem('role')
        
        if (val === 'available') {
            const newVerven = []
            await this.props.getVerven(token, status, 'all', 'all', val, 'approve', 'undefined', cekTime1, cekTime2)
            this.setState({filter: val, newVerven: newVerven})
        } else {
            const newVerven = []
            await this.props.getVerven(token, statusAll, 'all', 'all', val, 'approve', 'undefined', cekTime1, cekTime2)
            this.setState({filter: val, newVerven: newVerven})
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
        await this.props.getVerven(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, 'approve', 'undefined', cekTime1, cekTime2)
    }

    prosesSubmitPre = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAssetAll(token, 1000, '', 1, 'asset')
        this.modalSubmitPre()
    }

    updateTransaksi = async (val) => {
        
    }

    verifDataVendor = async () => {
        const level = localStorage.getItem('level')
        const { detailVerven } = this.props.verven
        const token = localStorage.getItem("token")
        if (level === '4' || level === '14') {
            const tempno = {
                no: detailVerven[0].no_transaksi,
                list: []
            }
            await this.props.submitVerifVerven(token, tempno)
            this.dataSendEmail('verif')
        } else if (accessFi.find(x => x === parseInt(level))) {
            const tempno = {
                no: detailVerven[0].no_transaksi,
                list: [],
                type: detailVerven[0].status_transaksi === 5 ? 'rekening' : 'vendor'
            }
            await this.props.submitVerifFinance(token, tempno)
            this.dataSendEmail('verif')
        }
        // if (level === '11') {
        //     // this.getDataVerven()
        //     // this.setState({confirm: 'isApprove'})
        //     // this.openConfirm()
        //     // this.openModalApprove()
        //     // this.openModalRinci()
        // } else {
        // this.dataSendEmail('verif')
        // }
    }

    submitRevVen = async () => {
        const level = localStorage.getItem('level')
        const { detailVerven } = this.props.verven
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailVerven[0].no_transaksi,
            list: []
        }
        await this.props.revisiVerven(token, tempno)
        // if (level === '11') {
        //     // this.getDataVerven()
        //     // this.setState({confirm: 'isApprove'})
        //     // this.openConfirm()
        //     // this.openModalApprove()
        //     // this.openModalRinci()
        // } else {
        this.dataSendEmail('revisi')
        // }
    }

    cekDataDoc = async () => {
        const token = localStorage.getItem("token")
        const level = localStorage.getItem("level")
        const {detailVerven} = this.props.verven

        const data = {
            no: detailVerven[0].no_transaksi,
            name: 'Pengajuan area'
        }

        await this.props.getDocument(token, data)
        const { dataDoc } = this.props.verven
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
        const { detailVerven } = this.props.verven
        const { draftEmail } = this.props.email
        const { message, subject } = this.state
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        const tempApp = []
        const tipeProses = val === 'add' ? 'pengajuan area' : val === 'reject' ? 'reject pengajuan' : val === 'revisi' ? 'revisi pengajuan' : 'verifikasi tax'
        const tipeRoute = 'verifven'
        const tipeMenu = 'verifikasi data vendor'
        const tempno = {
            draft: draftEmail,
            nameTo: draftEmail.to.username,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: detailVerven[0].no_transaksi,
            tipe: 'vendor',
            menu: tipeMenu,
            proses: tipeProses,
            route: tipeRoute
        }
        await this.props.sendEmail(token, tempno)
        await this.props.addNotif(token, tempno)
        this.openDraftEmail()
        if (val === 'reject') {
            this.getDataVerven()
            this.setState({confirm: 'reject'})
            this.openConfirm()
            this.openModalReject()
            this.openModalRinci()
        } else if (val === 'add') {
            this.getDataVerven()
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.openModalAdd()
        } else if (val === 'revisi') {
            this.getDataVerven()
            this.setState({confirm: 'revTrue'})
            this.openConfirm()
            this.openRinciEdit()
        } else {
            this.getDataVerven()
            this.setState({confirm: 'isApprove'})
            this.openConfirm()
            this.openModalApprove()
            this.openModalRinci()
        }
    }

    prepApprove = async () => {
        const level = localStorage.getItem('level')
        const { detailVerven } = this.props.verven
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailVerven[0].no_transaksi,
            kode: detailVerven[0].kode_plant,
            jenis: 'vendor',
            tipe: 'submit',
            menu: `Verifikasi ${accessFi.find(x => x === parseInt(level)) ? 'Finance' : 'Tax'} (Verifikasi Data Vendor)`,
            typeAjuan: detailVerven[0].status_transaksi === 5 ? 'rekening' : 'vendor'
        }
        await this.props.getDraftEmail(token, tempno)
        this.setState({tipeEmail: 'verif'})
        this.openDraftEmail()
    }

    prepReject = async (val) => {
        const { detailVerven } = this.props.verven
        const { listReject } = this.state
        const token = localStorage.getItem("token")
        const tipe = 'reject'
        const tempno = {
            no: detailVerven[0].no_transaksi,
            kode: detailVerven[0].kode_plant,
            jenis: 'vendor',
            tipe: tipe,
            typeReject: listReject[0],
            menu: 'Pengajuan area (Verifikasi Data Vendor)'
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
            await this.props.getVerven(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, 'approve', 'undefined', cekTime1, cekTime2, e.target.value)
        }
    }

    changeView = (val) => {
        this.setState({view: val})
        if (val === 'list') {
            this.getDataList()
        } else {
            this.getDataVerven()
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

    cekDok = async (val) => {
        const token = localStorage.getItem("token")
        const { dataDoc, noTrans } = this.props.verven
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
        const send = {
            no: noTrans
        }
        await this.props.getRekven(token, send)
        const {dataRekven} = this.props.verven
        if (verifDoc.length !== tempDoc.length) {
            this.openConfirm(this.setState({confirm: 'verifdoc'}))
        } else if (dataRekven.length === 0) {
            this.openConfirm(this.setState({confirm: 'falseRekven'}))
        } else {
            this.modalConfirmAdd(val)
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
        const { detailVerven } = this.props.verven
        const tempno = {
            no: detailVerven[0].no_transaksi,
            name: 'Pengajuan area'
        }
        await this.props.approveDokumen(token, idDoc)
        await this.props.getDocument(token, tempno)
        this.setState({confirm: 'isAppDoc'})
        this.openConfirm()
        this.openAppDoc()
        
    }

    openAppDoc = () => {
        this.setState({appDoc: !this.state.appDoc})
    }

    rejectDoc = async () => {
        const token = localStorage.getItem('token')
        const {idDoc} = this.state
        const { detailVerven } = this.props.verven
        const tempno = {
            no: detailVerven[0].no_transaksi,
            name: 'Pengajuan area'
        }
        await this.props.rejectDokumen(token, idDoc)
        await this.props.getDocument(token, tempno)
        this.setState({confirm: 'isRejDoc'})
        this.openConfirm()
        this.openModalRejDoc()
    }

    openModalRejDoc = () => {
        this.setState({openRejDoc: !this.state.openRejDoc})
    }

    openModalAppDoc = () => {
        this.setState({openAppDoc: !this.state.openAppDoc})
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    openProsesModalDoc = async (val) => {
        const token = localStorage.getItem("token")
        localStorage.removeItem('docData')
        const {detailVerven} = this.props.verven 
        const data = {
            no: detailVerven[0].no_transaksi,
            name: 'Pengajuan area'
        }
        await this.props.getDocument(token, data)
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
            name: 'Pengajuan area'
        }
        this.setState({listMut: []})
        await this.props.getDetailVerven(token, tempno)
        await this.props.getDocument(token, data)
        this.openModalRinci()
        this.openProsesModalDoc(sendDoc)
    }

    openDocNewTab = async (val) => {
        localStorage.setItem('docData', val[0].no_transaksi)
        const newWindow = window.open('verifven', '_blank', 'noopener,noreferrer')
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

    prepAddVerven = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.generateNoVendor(token)
        const {noTrans} = this.props.verven
        console.log(noTrans)
        const data = {
            no: noTrans,
            name: 'Pengajuan area',
            modalOpen: 'ya',
            typeAjuan: val
        }
        const send = {
            no: noTrans
        }
        await this.props.getDocument(token, data)
        await this.props.getRekven(token, send)
        this.setState({typeTrans: false, openSync: false, typeAjuan: val})
        this.openModalAdd()
    }

    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd, type_skb: ''})
    }

    getRincian = async (val) => {
        const token = localStorage.getItem("token")
        const {detailVerven} = this.props.verven
        const tempno = {
            no: detailVerven[0].no_transaksi,
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
        const {detailVerven} = this.props.verven
        if (val === 'all') {
            const data = []
            for (let i = 0; i < detailVerven.length; i++) {
                data.push(detailVerven[i].id)
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

    addVerVendor = async () => {
        
        const token = localStorage.getItem("token")
        this.dataSendEmail('add')
    }

    modalConfirmAdd = (val) => {
        this.setState({dataAdd: val})
        this.openModalAppDoc()
    }

    getDraftAdd = async () => {
        const {dataAdd} = this.state
        const { noTrans } = this.props.verven
        const tipe = this.state.type_skb
        const dataSend = {
            nama: dataAdd.nama,
            jenis: dataAdd.jenis,
            no_npwp: dataAdd.no_npwp.length < 16 ? '' : dataAdd.no_npwp,
            no_ktp: dataAdd.jenis === 'Orang Pribadi' ? dataAdd.no_ktp : '',
            alamat: dataAdd.alamat,
            no: noTrans,
            type_skb: tipe,
            no_skb: dataAdd.no_skb,
            no_skt: dataAdd.no_skt,
            datef_skb: dataAdd.datef_skb,
            datel_skb: dataAdd.datel_skb,
            typeAjuan: this.state.typeAjuan
        }
        const token = localStorage.getItem("token")
        this.openModalAppDoc()
        await this.props.addVerven(token, dataSend)

        const { dataAddVer } = this.props.verven
        const noData = {
            no: dataAddVer.no_transaksi
        }
        await this.props.getDetailVerven(token, noData)
        
        const tempno = {
            no: dataAddVer.no_transaksi,
            kode: dataAddVer.kode_plant,
            jenis: 'vendor',
            tipe: 'submit',
            menu: 'Pengajuan area (Verifikasi Data Vendor)'
        }
        await this.props.getDraftEmail(token, tempno)

        this.setState({tipeEmail: 'submit'})
        this.openDraftEmail()
    }

    getDraftRevisi = async () => {
        const { detailVerven } = this.props.verven
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailVerven[0].no_transaksi,
            kode: detailVerven[0].kode_plant,
            jenis: 'vendor',
            tipe: 'submit',
            menu: 'Revisi Data (Verifikasi Data Vendor)'
        }
        await this.props.getDraftEmail(token, tempno)
        this.setState({tipeEmail: 'revisi'})
        this.openDraftEmail()
    }

    getRinciStock = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({dataRinci: val, dataId: val.id})
        await this.props.getDetailItem(token, val.id)
        this.openModalStock()
    }

    selectTipeSkb = async (val) => {
        const token = localStorage.getItem("token")
        const {noTrans} = this.props.verven
        if (val === '') {
            this.setState({type_skb: val})
        } else {
            const data = {
                no: noTrans,
                name: 'Pengajuan area',
                tipeSkb: val === '' ? 'tidak' : val === 'SKB' || val === 'SKT' ? 'ya' : val
            }
            await this.props.getDocument(token, data)
            this.setState({type_skb: val})
        }
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
        const {detailVerven} = this.props.verven
        const tempno = {
            no: detailVerven[0].no_transaksi
        }
        const data = {
            type: tipeNilai,
            nilai: tipeNilai === 'all' ? nilai_verif : val.nilai_verif,
            id: tipeNilai === 'all' ? detailVerven[0].id : val.id,
            no: detailVerven[0].no_transaksi,
            tglGetDana: tipeNilai === 'all' ? tglGetDana : val.tgl_getdana
        }
        await this.props.updateNilaiVerif(token, data)
        if (tipeNilai === 'all') {
            await this.props.getDetail(token, tempno)
            this.setState({confirm: 'inputVerif', nilai_verif: 0})
            this.openConfirm()
            this.openNilaiVerif()
            this.getDataVerven()
        } else {
            await this.props.getDetail(token, tempno)
            this.setState({confirm: 'inputVerif', nilai_verif: 0})
            this.openConfirm()
            this.openModalEdit()
            this.getDataVerven()
        }
        
    }

    updateData = async (val) => {
        const data = {
            [val.target.name]: val.target.value
        }
        console.log(data)
        this.setState(data)
    }

    openTypeTrans = () => {
        this.setState({typeTrans: !this.state.typeTrans})
    }

    openModsync = () => {
        this.setState({openSync: !this.state.openSync})
    }

    prosesSync = async (val) => {
        const token = localStorage.getItem('token')
        const sendData = {
            noIdent: `${val.ident}`
        }

        await this.props.getVendor(token, sendData)

        const { dataVendor } = this.props.vendor
        console.log(dataVendor)
        this.setState({dataRegis: dataVendor[0]})
        this.prepAddVerven('rekening')
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {listReject, listMut, listReason, dataMenu, listMenu, detailDoc, tipeEmail, filter, dataZip, fileName, duplikat, dataRegis, typeAjuan} = this.state
        const { detailDepo, dataDepo } = this.props.depo
        const { dataReason } = this.props.reason
        const { draftEmail } = this.props.email
        const {newVerven, detailVerven, idVerven, dataDoc, messAdd, dataRekven} = this.props.verven
        const { dataBank } = this.props.bank
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
                                <div className={style.titleDashboard}>{level === '4' || level === '14' ? 'Verifikasi ' : 'Pengajuan '}Data Vendor</div>
                            </div>
                            <div className={[style.secEmail4]}>
                                {level === '5' || level === '6' ? (
                                    <>
                                        <Button onClick={() => this.openTypeTrans()} color="info" size="lg">Create</Button>
                                        <div className={style.searchEmail2}>
                                            <text>Filter:  </text>
                                            <Input className={style.filter} type="select" value={filter} onChange={e => this.changeFilter(e.target.value)}>
                                                <option value="all">All</option>
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
                                                <option value="available">Available Verif</option>
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
                                                <th>AREA</th>
                                                <th>TGL AJUAN</th>
                                                <th>NAMA VENDOR</th>
                                                <th>JENIS VENDOR</th>
                                                <th>NPWP</th>
                                                <th>NIK</th>
                                                <th>STATUS</th>
                                                <th>HISTORY</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newVerven.length > 0 && newVerven.filter(({ status_transaksi }) => (filter === 'completed' && status_transaksi === 8) || (filter !== 'completed' && status_transaksi !== 8)).map((item, index) => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>{index + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.depo === null || item.depo === undefined ? '' : item.depo.area}</th>
                                                        <th>{moment(item.start_transaksi).format('DD MMMM YYYY')}</th>
                                                        <th>{item.nama}</th>
                                                        <th>{item.jenis_vendor !== null && item.jenis_vendor !== '' ? item.jenis_vendor : item.nik === null || item.nik === '' || item.nik === 'TIDAK ADA' ? "Badan" : "Orang Pribadi"}</th>
                                                        <th>{item.npwp}</th>
                                                        <th>{item.nik}</th>
                                                        <th>
                                                            {
                                                                item.status_transaksi === 0 ? 'Reject Pembatalan' 
                                                                : item.status_reject === 1 ? 'Reject Perbaikan'
                                                                : item.status_reject === 0 ? 'Telah Revisi'
                                                                : item.status_transaksi === 8 ? 'selesai' 
                                                                : item.status_transaksi === 2 || item.status_transaksi === 5 ? 'Proses Verifikasi Finance'
                                                                : item.status_transaksi === 3 && 'Proses Verifikasi Tax'
                                                            }
                                                        </th>
                                                        <th>{item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            <Button 
                                                            size='sm' 
                                                            onClick={() => 
                                                                item.status_reject === 1 && item.status_transaksi !== 0 ? this.prosesDetailEdit(item)
                                                                : this.prosesDetail(item)
                                                            } 
                                                            className='mb-1 mr-1' 
                                                            color='success'
                                                            >
                                                               { item.status_reject === 1 && item.status_transaksi !== 0 ? "Proses" : "Detail"}
                                                            </Button>
                                                            {/* <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button> */}
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {(newVerven.length === 0 || (filter === 'completed' && newVerven.find(({status_transaksi}) => status_transaksi === 8) === undefined) || (filter !== 'completed' && newVerven.find(({status_transaksi}) => status_transaksi !== 8) === undefined)) && (
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
                                                <th>AREA</th>
                                                <th>TGL AJUAN</th>
                                                <th>NAMA VENDOR</th>
                                                <th>JENIS VENDOR</th>
                                                <th>NPWP</th>
                                                <th>NIK</th>
                                                <th>STATUS</th>
                                                <th>HISTORY</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newVerven.length > 0 && newVerven.filter(({ status_transaksi }) => (filter === 'completed' && status_transaksi === 8) || (filter !== 'completed' && status_transaksi !== 8)).map((item, index) => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                                        <th>{index + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.depo === null || item.depo === undefined ? '' : item.depo.area}</th>
                                                        <th>{moment(item.start_transaksi).format('DD MMMM YYYY')}</th>
                                                        <th>{item.nama}</th>
                                                        <th>{item.jenis_vendor !== null && item.jenis_vendor !== '' ? item.jenis_vendor : item.nik === null || item.nik === '' || item.nik === 'TIDAK ADA' ? "Badan" : "Orang Pribadi"}</th>
                                                        <th>{item.npwp}</th>
                                                        <th>{item.nik}</th>
                                                        <th>
                                                            {
                                                                item.status_transaksi === 0 ? 'Reject Pembatalan' 
                                                                : item.status_reject === 1 ? 'Reject Perbaikan'
                                                                : item.status_reject === 0 ? 'Telah Revisi'
                                                                : item.status_transaksi === 8 ? 'selesai' 
                                                                : item.status_transaksi === 2 || item.status_transaksi === 5 ? 'Proses Verifikasi Finance'
                                                                : item.status_transaksi === 3 && 'Proses Verifikasi Tax'
                                                            }
                                                        </th>
                                                        <th>{item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>{filter === 'available' ? 'Proses' : 'Detail'}</Button>
                                                            {/* <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button> */}
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {(newVerven.length === 0 || (filter === 'completed' && newVerven.find(({status_transaksi}) => status_transaksi === 8) === undefined) || (filter !== 'completed' && newVerven.find(({status_transaksi}) => status_transaksi !== 8) === undefined)) && (
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
                <Modal isOpen={this.state.modalAdd} size="xl" className='xl'>
                    <ModalHeader>Form Pengajuan {typeAjuan === 'rekening' ? 'Rekning Vendor' : 'Data Vendor'}</ModalHeader>
                    <Formik
                    initialValues={{
                        nama: typeAjuan === 'rekening' ? dataRegis.nama : '',
                        jenis: typeAjuan === 'rekening' ? (dataRegis.jenis_vendor === null ? 'Orang Pribadi' : dataRegis.jenis_vendor ) : '',
                        no_npwp: typeAjuan === 'rekening' ? (dataRegis.no_npwp === null ? '' : dataRegis.no_npwp) : '',
                        no_ktp: typeAjuan === 'rekening' ? (dataRegis.no_ktp  === null ? '' : dataRegis.no_ktp) : '',
                        alamat: typeAjuan === 'rekening' ? dataRegis.alamat : '',
                        datef_skb: '',
                        datel_skb: '',
                        no_skb: '',
                        no_skt: ''
                    }}
                    validationSchema={vendorSchema}
                    onSubmit={(values) => {this.cekDok(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Vendor <text className='txtError'>{'*'}</text>
                            </text>
                            <div className="col-md-9">
                                <Input 
                                disabled={typeAjuan === 'rekening' ? true : false}
                                type="name" 
                                name="nama"
                                value={values.nama}
                                onBlur={handleBlur("nama")}
                                onChange={handleChange("nama")}
                                />
                                {/* {errors.nama ? (
                                    <text className={style.txtError}>{errors.nama}</text>
                                ) : null} */}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jenis Vendor <text className='txtError'>{'*'}</text>
                            </text>
                            <div className="col-md-9">
                                <Input
                                    disabled={typeAjuan === 'rekening' ? true : false}
                                    type= "select" 
                                    value={values.jenis}
                                    onBlur={handleBlur("jenis")}
                                    onChange={handleChange("jenis")}
                                    >
                                        <option value=''>Pilih</option>
                                        <option value="Orang Pribadi">Orang Pribadi</option>
                                        <option value="Badan">Badan</option>
                                </Input>
                                {/* {errors.jenis || values.jenis === '' ? (
                                    <text className={style.txtError}>{errors.jenis}</text>
                                ) : null} */}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                No NPWP {values.jenis === 'Badan' && <text className='txtError'>{'*'}</text>}
                            </text>
                            <div className="col-md-9">
                                <Input 
                                    // disabled={typeAjuan === 'rekening' ? true : false}
                                    type="name"
                                    name="no_npwp"
                                    value={values.no_npwp}
                                    // .replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6')
                                    onBlur={handleBlur("no_npwp")}
                                    onChange={handleChange("no_npwp")}
                                    minLength={16}
                                    maxLength={16}
                                    className='spaceChar'
                                />
                                {(
                                    (values.no_npwp.toString().length !== 16 || errors.no_npwp) && values.jenis === 'Badan') || 
                                    ((values.no_npwp.toString().length > 0 && values.no_npwp.toString().length < 16) || errors.no_npwp) ? 
                                (
                                    <text className={style.txtError}>must be filled with number & 16 digits characters</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                No KTP {values.jenis === 'Orang Pribadi' && <text className='txtError'>{'*'}</text>}
                            </text>
                            <div className="col-md-9">
                                <Input 
                                    type="name"
                                    name="no_ktp"
                                    // disabled={(values.jenis === 'Badan' || values.jenis === '' || typeAjuan === 'rekening') ? true : false}
                                    disabled={(values.jenis === 'Badan' || values.jenis === '') ? true : false}
                                    value={values.jenis === 'Orang Pribadi' ? values.no_ktp : ''}
                                    onBlur={handleBlur("no_ktp")}
                                    onChange={handleChange("no_ktp")}
                                    minLength={16}
                                    maxLength={16}
                                    className='spaceChar'
                                />
                                {values.jenis === 'Orang Pribadi' && (values.no_ktp.toString().length !== 16 || errors.no_ktp)  ? (
                                    <text className={style.txtError}>must be filled with number & 16 digits characters</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Alamat <text className='txtError'>{'*'}</text>
                            </text>
                            <div className="col-md-9">
                                <Input 
                                disabled={typeAjuan === 'rekening' ? true : false}
                                type="textarea" 
                                name="alamat"
                                value={values.alamat}
                                onBlur={handleBlur("alamat")}
                                onChange={handleChange("alamat")}
                                />
                                {/* {errors.alamat ? (
                                    <text className={style.txtError}>{errors.alamat}</text>
                                ) : null} */}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Vendor Memiliki SKB / SKT <text className='txtError'>{'*'}</text>
                            </text>
                            <div className="col-md-9">
                                <Input
                                    type= "select" 
                                    value={this.state.type_skb}
                                    onChange={(e) => this.selectTipeSkb(e.target.value)}
                                    >
                                        <option value=''>Pilih</option>
                                        <option value="SKT">SKT</option>
                                        <option value="SKB">SKB</option>
                                        <option value="tidak">Tidak</option>
                                </Input>
                                {/* {this.state.type_skb === '' ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null} */}
                            </div>
                        </div>
                        {(this.state.type_skb === 'SKT' || this.state.type_skb === 'SKB') && (
                            <>
                            {this.state.type_skb === 'SKB' && (
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        No SKB <text className='txtError'>{'*'}</text>
                                    </text>
                                    <div className="col-md-9">
                                        <Input 
                                        type="name" 
                                        name="no_skb"
                                        value={values.no_skb}
                                        onBlur={handleBlur("no_skb")}
                                        onChange={handleChange("no_skb")}
                                        />
                                        {errors.no_skb ? (
                                            <text className={style.txtError}>{errors.no_skb}</text>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                            {this.state.type_skb === 'SKT' && (
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        No SKT <text className='txtError'>{'*'}</text>
                                    </text>
                                    <div className="col-md-9">
                                        <Input 
                                        type="name" 
                                        name="no_skt"
                                        value={values.no_skt}
                                        onBlur={handleBlur("no_skt")}
                                        onChange={handleChange("no_skt")}
                                        />
                                        {errors.no_skt ? (
                                            <text className={style.txtError}>{errors.no_skt}</text>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Periode SKB / SKT <text className='txtError'>{'*'}</text>
                                </text>
                                <div className="col-md-9 rowCenter">
                                    <Input
                                    type= "date"
                                    value={moment(values.datef_skb).format('YYYY-MM-DD')}
                                    onBlur={handleBlur("datef_skb")}
                                    onChange={handleChange("datef_skb")}
                                    />
                                    <text className='mr-1 ml-1'>To</text>
                                    <Input
                                    type= "date"
                                    value={moment(values.datel_skb).format('YYYY-MM-DD')}
                                    onBlur={handleBlur("datel_skb")}
                                    onChange={handleChange("datel_skb")}
                                    />
                                </div>
                            </div>
                            {errors.datef_skb || errors.datel_skb ? (
                                <text className={style.txtError}>must be filled</text>
                            ) : values.datef_skb > values.datel_skb ? (
                                <text className={style.txtError}>Pastikan periode diisi dengan benar</text>
                            ) : null }
                            </>
                        )}
                        <hr/>
                        <div className='rowBetween'>
                            <div>Data Rekening Vendor</div>
                            <div className='rowCenter mt-2 mb-2'>
                                {/* <Button 
                                size='sm' 
                                onClick={() => this.cekRekven({type: 'upload', data: values})} 
                                className='ml-1' 
                                color='primary'>
                                    <MdUpload size={20}/>
                                </Button> */}
                                <Button 
                                size='sm' 
                                onClick={() => this.cekRekven({type: 'download', data: values})} 
                                className='ml-1' 
                                color='warning'>
                                    <MdDownload size={20}/>
                                </Button>
                            </div>
                        </div>
                        <Table striped bordered hover responsive className={[style.tab]}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>NIK</th>
                                    <th>NPWP</th>
                                    <th>BANK</th>
                                    <th>NO Rekening</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            {dataRekven.length > 0 && dataRekven.map((item, index) => {
                                return (
                                    <>
                                        <tbody>
                                            <td>{index + 1}</td>
                                            <td>{item.nik}</td>
                                            <td>{item.npwp}</td>
                                            <td>{item.bank}</td>
                                            <td>{item.no_rekening}</td>
                                            <td className='rowCenter'>
                                                <Button 
                                                size='sm' 
                                                onClick={() => {this.setState({ detRekven: item }); this.cekRekven({type: 'edit', data: values})}} 
                                                color='info'>
                                                    <MdEditSquare size={20}/>
                                                </Button>
                                                <Button 
                                                size='sm' 
                                                onClick={() => this.confirmDel(this.setState({ detRekven: item }))} 
                                                className='ml-1' 
                                                color='danger'>
                                                    <MdDelete size={20}/>
                                                </Button>
                                            </td>
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
                                <td>
                                    <Button size='sm' onClick={() => this.cekRekven({type: 'add', data: values})} color='success'><MdAddCircle size={20}/></Button>
                                </td>
                            </tbody>
                        </Table>
                        <hr/>
                        <div className={style.addModalDepo}>
                            <text className="col-md-12 mt-4">
                                Kelengkapan Dokumen
                            </text>
                        </div>
                        {dataDoc !== undefined && dataDoc.map(x => {
                            return (
                                <Row className="mt-4 mb-4 ml-1">
                                    {x.path !== null ? (
                                        <Col md={12} lg={12} >
                                            <div className="btnDocIo mb-2" >{x.desc} <text className='txtError'>{x.stat_upload === 0 ? '' : '*'}</text></div>
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
                                                {/* <text className="txtError ml-4">Maximum file upload is 25 Mb</text>
                                                <text className="txtError ml-4">Only excel, pdf, zip, png, jpg and rar files are allowed</text> */}
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col md={12} lg={12} className="colDoc">
                                            <div className="btnDocIo" >{x.desc} <text className='txtError'>{x.stat_upload === 0 ? '' : '*'}</text></div>
                                            {/* <text className="italRed" >{x.stat_upload === 0 ? '*tidak harus upload' : '*harus upload'}</text> */}
                                            <div className="colDoc">
                                                <input
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            </div>
                                            {/* <text className="txtError">Maximum file upload is 25 Mb</text>
                                            <text className="txtError">Only excel, pdf, zip, png, jpg and rar files are allowed</text> */}
                                        </Col>
                                    )}
                                </Row>
                            )
                        })}
                        <Row className="mt-3 mb-4 ml-1">
                            <Col md={12} lg={12} className="colDoc">
                                <text className="txtError" >* Wajib Upload Document</text>
                                <text className="txtError">Maximum file upload is 25 Mb</text>
                                <text className="txtError">Only excel, pdf, zip, png, jpg and rar files are allowed</text>
                            </Col>
                        </Row>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button 
                                className="mr-2" 
                                onClick={errors.nama || (errors.jenis || values.jenis === '')
                                    || ((values.no_npwp.toString().length !== 16 || errors.no_npwp) && values.jenis === 'Badan')
                                    || (values.jenis === 'Orang Pribadi' && (values.no_ktp.toString().length !== 16 || errors.no_ktp))
                                    || errors.alamat || this.state.type_skb === ''
                                    || (this.state.type_skb === 'SKB' && errors.no_skb)
                                    || (this.state.type_skb === 'SKT' && errors.no_skt)
                                    ? () => this.setError('Masih Terdapat Data Yang Belum Terisi..!!')
                                    : ((this.state.type_skb === 'SKT' || this.state.type_skb === 'SKB') && values.datef_skb > values.datel_skb)
                                    ? () => this.setError('Pastikan Periode diisi dengan benar..!!')
                                    : handleSubmit} 
                                color="primary"
                                disabled={
                                    this.state.type_skb === '' ? true
                                    : this.state.type_skb === 'SKT' && 
                                    (values.no_skt === '' || values.datef_skb === '' || values.datel_skb === '') ? true 
                                    : this.state.type_skb === 'SKB' &&
                                    (values.no_skb === '' || values.datef_skb === '' || values.datel_skb === '') ? true 
                                    : (values.nama === '' || (values.no_npwp.length !== 0 && values.no_npwp.length !== 16) || errors.no_npwp) ? true 
                                    : values.jenis === 'Orang Pribadi' && (values.nama === '' || values.no_ktp.length !== 16 || errors.no_ktp) ? true
                                    : false
                                }
                                >
                                    Submit
                                </Button>
                                <Button className="mr-3" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.modalId} size="lg">
                    <ModalHeader>Form Edit Pengajuan Data Vendor</ModalHeader>
                    <Formik
                    initialValues={{
                        nama: idVerven.nama === null ? '' : idVerven.nama,
                        jenis: idVerven.nik === null || idVerven.nik === '' ? "Badan" : "Orang Pribadi",
                        no_npwp: idVerven.npwp === null ? '' : idVerven.npwp,
                        no_ktp: idVerven.nik === null ? '' : idVerven.nik,
                        alamat: idVerven.alamat === null ? '' : idVerven.alamat,
                        datef_skb: idVerven.datef_skb === null ? '' : idVerven.datef_skb,
                        datel_skb: idVerven.datel_skb === null ? '' : idVerven.datel_skb,
                        no_skb: idVerven.no_skb === null ? '' : idVerven.no_skb,
                        no_skt: idVerven.no_skt === null ? '' : idVerven.no_skt
                    }}
                    validationSchema={vendorSchema}
                    onSubmit={(values) => {this.prosesEdit(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Vendor <text className='txtError'>{'*'}</text>
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama"
                                value={values.nama}
                                onBlur={handleBlur("nama")}
                                onChange={handleChange("nama")}
                                />
                                {errors.nama ? (
                                    <text className={style.txtError}>{errors.nama}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jenis Vendor <text className='txtError'>{'*'}</text>
                            </text>
                            <div className="col-md-9">
                                <Input
                                    type= "select" 
                                    value={values.jenis}
                                    onBlur={handleBlur("jenis")}
                                    onChange={handleChange("jenis")}
                                    >
                                        <option value=''>Pilih</option>
                                        <option value="Orang Pribadi">Orang Pribadi</option>
                                        <option value="Badan">Badan</option>
                                </Input>
                                {errors.jenis || values.jenis === '' ? (
                                    <text className={style.txtError}>{errors.jenis}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                No NPWP {values.jenis === 'Badan' && <text className='txtError'>{'*'}</text>}
                            </text>
                            <div className="col-md-9">
                                <Input 
                                    type="name"
                                    name="no_npwp"
                                    value={values.no_npwp}
                                    // .replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6')
                                    onBlur={handleBlur("no_npwp")}
                                    onChange={handleChange("no_npwp")}
                                    minLength={16}
                                    maxLength={16}
                                    className='spaceChar'
                                />
                                {(
                                    (values.no_npwp.toString().length !== 16 || errors.no_npwp) && values.jenis === 'Badan') || 
                                    ((values.no_npwp.toString().length > 0 && values.no_npwp.toString().length < 16) || errors.no_npwp) ? 
                                (
                                    <text className={style.txtError}>must be filled with number & 16 digits characters</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                No KTP {values.jenis === 'Orang Pribadi' && <text className='txtError'>{'*'}</text>}
                            </text>
                            <div className="col-md-9">
                                <Input 
                                    type="name"
                                    name="no_ktp"
                                    value={values.no_ktp}
                                    onBlur={handleBlur("no_ktp")}
                                    onChange={handleChange("no_ktp")}
                                    minLength={16}
                                    maxLength={16}
                                    className='spaceChar'
                                />
                                {values.jenis === 'Orang Pribadi' && (values.no_ktp.toString().length !== 16 || errors.no_ktp)  ? (
                                    <text className={style.txtError}>must be filled with number & 16 digits characters</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Alamat <text className='txtError'>{'*'}</text>
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="textarea" 
                                name="alamat"
                                value={values.alamat}
                                onBlur={handleBlur("alamat")}
                                onChange={handleChange("alamat")}
                                />
                                {errors.alamat ? (
                                    <text className={style.txtError}>{errors.alamat}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Vendor Memiliki SKB / SKT <text className='txtError'>{'*'}</text>
                            </text>
                            <div className="col-md-9">
                                <Input
                                    type= "select" 
                                    // value={values.type_skb}
                                    // onBlur={handleBlur("type_skb")}
                                    // onChange={handleChange("type_skb")}
                                    value={this.state.type_skb}
                                    onChange={(e) => this.selectTipeSkb(e.target.value)}
                                    >
                                        <option value=''>Pilih</option>
                                        <option value="SKT">SKT</option>
                                        <option value="SKB">SKB</option>
                                        <option value="tidak">Tidak</option>
                                </Input>
                                {this.state.type_skb === '' ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        {(this.state.type_skb === 'SKT' || this.state.type_skb === 'SKB') && (
                            <>
                            {this.state.type_skb === 'SKB' && (
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        No SKB <text className='txtError'>{'*'}</text>
                                    </text>
                                    <div className="col-md-9">
                                        <Input 
                                        type="name" 
                                        name="no_skb"
                                        value={values.no_skb}
                                        onBlur={handleBlur("no_skb")}
                                        onChange={handleChange("no_skb")}
                                        />
                                        {errors.no_skb ? (
                                            <text className={style.txtError}>{errors.no_skb}</text>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                            
                            {this.state.type_skb === 'SKT' && (
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        No SKT <text className='txtError'>{'*'}</text>
                                    </text>
                                    <div className="col-md-9">
                                        <Input 
                                        type="name" 
                                        name="no_skt"
                                        value={values.no_skt}
                                        onBlur={handleBlur("no_skt")}
                                        onChange={handleChange("no_skt")}
                                        />
                                        {errors.no_skt ? (
                                            <text className={style.txtError}>{errors.no_skt}</text>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Periode SKB / SKT <text className='txtError'>{'*'}</text>
                                </text>
                                <div className="col-md-9 rowCenter">
                                    <Input
                                    type= "date"
                                    value={moment(values.datef_skb).format('YYYY-MM-DD')}
                                    onBlur={handleBlur("datef_skb")}
                                    onChange={handleChange("datef_skb")}
                                    />
                                    <text className='mr-1 ml-1'>To</text>
                                    <Input
                                    type= "date"
                                    value={moment(values.datel_skb).format('YYYY-MM-DD')}
                                    onBlur={handleBlur("datel_skb")}
                                    onChange={handleChange("datel_skb")}
                                    />
                                </div>
                            </div>
                            {errors.datef_skb || errors.datel_skb ? (
                                <text className={style.txtError}>must be filled</text>
                            ) : values.datef_skb > values.datel_skb ? (
                                <text className={style.txtError}>Pastikan periode diisi dengan benar</text>
                            ) : null }
                            </>
                        )}
                        <hr/>
                        <div className='rowBetween'>
                            <div>Data Rekening Vendor</div>
                            <div className='rowCenter mt-2 mb-2'>
                                {/* <Button 
                                size='sm' 
                                onClick={() => this.cekRekven({type: 'upload', data: values})} 
                                className='ml-1' 
                                color='primary'>
                                    <MdUpload size={20}/>
                                </Button> */}
                                <Button 
                                size='sm' 
                                onClick={() => this.cekRekven({type: 'download', data: values})} 
                                className='ml-1' 
                                color='warning'>
                                    <MdDownload size={20}/>
                                </Button>
                            </div>
                        </div>
                        <Table striped bordered hover responsive className={[style.tab]}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>NIK</th>
                                    <th>NPWP</th>
                                    <th>BANK</th>
                                    <th>NO Rekening</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            {dataRekven.length > 0 && dataRekven.map((item, index) => {
                                return (
                                    <>
                                        <tbody>
                                            <td>{index + 1}</td>
                                            <td>{item.nik}</td>
                                            <td>{item.npwp}</td>
                                            <td>{item.bank}</td>
                                            <td>{item.no_rekening}</td>
                                            <td className='rowCenter'>
                                                <Button 
                                                size='sm' 
                                                onClick={() => {this.setState({ detRekven: item }); this.cekRekven({type: 'edit', data: values})}} 
                                                color='info'>
                                                    <MdEditSquare size={20}/>
                                                </Button>
                                                <Button 
                                                size='sm' 
                                                onClick={() => this.confirmDel(this.setState({ detRekven: item }))} 
                                                className='ml-1' 
                                                color='danger'>
                                                    <MdDelete size={20}/>
                                                </Button>
                                            </td>
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
                                <td>
                                    <Button size='sm' onClick={() => this.cekRekven({type: 'add', data: values})} color='success'><MdAddCircle size={20}/></Button>
                                </td>
                            </tbody>
                        </Table>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button 
                                className="mr-2" 
                                onClick={errors.nama || (errors.jenis || values.jenis === '')
                                || ((values.no_npwp.toString().length !== 16 || errors.no_npwp) && values.jenis === 'Badan')
                                || (values.jenis === 'Orang Pribadi' && (values.no_ktp.toString().length !== 16 || errors.no_ktp))
                                || errors.alamat || this.state.type_skb === ''
                                || (this.state.type_skb === 'SKB' && errors.no_skb)
                                || (this.state.type_skb === 'SKT' && errors.no_skt)
                                ? () => this.setError('Masih Terdapat Data Yang Belum Terisi..!!')
                                : ((this.state.type_skb === 'SKT' || this.state.type_skb === 'SKB') && values.datef_skb > values.datel_skb)
                                ? () => this.setError('Pastikan Periode diisi dengan benar..!!')
                                : handleSubmit} 
                                color="primary"
                                disabled={
                                    this.state.type_skb === '' ? true
                                    : this.state.type_skb === 'SKT' && 
                                    (values.no_skt === '' || values.datef_skb === '' || values.datel_skb === '') ? true 
                                    : this.state.type_skb === 'SKB' &&
                                    (values.no_skb === '' || values.datef_skb === '' || values.datel_skb === '') ? true 
                                    : (values.nama === '' || (values.no_npwp.length !== 0 && values.no_npwp.length !== 16) || errors.no_npwp) ? true 
                                    : values.jenis === 'Orang Pribadi' && (values.nama === '' || values.no_ktp.length !== 16 || errors.no_ktp) ? true
                                    : false
                                }
                                >
                                    Save
                                </Button>
                                <Button className="mr-3" onClick={this.openEdit}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.modalRinci} toggle={this.openModalRinci} className='modalrinci' size="xl">
                    <ModalBody>
                        <div>
                            {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                            {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailVerven.length > 0 ? detailVerven[0].depo.area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailVerven.length > 0 ? detailVerven[0].no_transaksi : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailVerven.length > 0 ? moment(detailVerven[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
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
                                            checked={listMut.length === 0 ? false : listMut.length === detailVerven.length ? true : false}
                                            onChange={() => listMut.length === detailVerven.length ? this.chekRej('all') : this.chekApp('all')}
                                            />
                                            Select
                                        </th>
                                        <th>NO</th>
                                        <th>No ajuan</th>
                                        <th>Nama Vendor</th>
                                        <th>Jenis Vendor</th>
                                        <th>No KTP</th>
                                        <th>No NPWP</th>
                                        <th>Alamat</th>
                                        <th>Vendor Memiliki SKB / SKT</th>
                                        <th>No SKB</th>
                                        <th>No SKT</th>
                                        <th>Periode SKB / SKT</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailVerven.length !== 0 && detailVerven.map(item => {
                                        return (
                                            <tr>
                                                <th>
                                                    <input 
                                                    type='checkbox'
                                                    checked={listMut.find(element => element === item.id) !== undefined ? true : false}
                                                    onChange={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                    />
                                                </th>
                                                <th scope="row">{detailVerven.indexOf(item) + 1}</th>
                                                <th>{item.no_transaksi}</th>
                                                <th>{item.nama}</th>
                                                <th>{item.jenis_vendor !== null && item.jenis_vendor !== '' ? item.jenis_vendor : item.nik === null || item.nik === '' || item.nik === 'TIDAK ADA' ? "Badan" : "Orang Pribadi"}</th>
                                                <th>{item.nik}</th>
                                                <th>{item.npwp}</th>
                                                <th>{item.alamat}</th>
                                                <th>{item.type_skb === null ? 'Tidak' : item.type_skb}</th>
                                                <th>{item.no_skb === null ? '-' : item.no_skb}</th>
                                                <th>{item.no_skt === null ? '-' : item.no_skt}</th>
                                                <th>{item.datef_skb === null ? '-' : `${moment(item.datef_skb).format('DD MMMM YYYY')} - ${moment(item.datef_skb).format('DD MMMM YYYY')}`}</th>
                                                <th>{item.isreject === 1 ? 'reject' : '-'}</th>
                                            </tr>
                                            )
                                        })}
                                </tbody>
                            </Table>
                        </div>
                        <div className='rowBetween'>
                            <div>Data Rekening Vendor</div>
                            <div className='rowCenter mt-2 mb-2'>
                                {/* <Button 
                                size='sm' 
                                onClick={() => this.cekRekven({type: 'upload', data: values})} 
                                className='ml-1' 
                                color='primary'>
                                    <MdUpload size={20}/>
                                </Button> */}
                                {/* <Button 
                                size='sm' 
                                onClick={() => this.cekRekven({type: 'download', data: values})} 
                                className='ml-1' 
                                color='warning'>
                                    <MdDownload size={20}/>
                                </Button> */}
                            </div>
                        </div>
                        <Table striped bordered hover responsive className={[style.tab]}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>NIK</th>
                                    <th>NPWP</th>
                                    <th>BANK</th>
                                    <th>NO Rekening</th>
                                </tr>
                            </thead>
                            {dataRekven.length > 0 && dataRekven.map((item, index) => {
                                return (
                                    <>
                                        <tbody>
                                            <td>{index + 1}</td>
                                            <td>{item.nik}</td>
                                            <td>{item.npwp}</td>
                                            <td>{item.bank}</td>
                                            <td>{item.no_rekening}</td>
                                        </tbody>
                                    </>
                                )
                            })}
                        </Table>
                    </ModalBody>
                    <div className="modalFoot ml-3">
                        <div className="btnFoot">
                            {this.state.filter === 'available' || 
                            (detailVerven[0] !== undefined && 
                            (detailVerven[0].status_transaksi === 0 || 
                            detailVerven[0].status_transaksi === 8)) ? null : (
                                <Button className='mr-2' color="warning"  onClick={() => this.prosesStatEmail(detailVerven)}>Status Email</Button>
                            )}
                            <Button color="primary"  onClick={() => this.openDocCon()}>Dokumen</Button>
                        </div>
                        <div className="btnFoot">
                            {this.state.filter !== 'available' && this.state.filter !== 'revisi' ? (
                                <>
                                    <Button className='' onClick={() => this.openModalRinci()} color='success'>Close</Button>
                                </>
                                
                            ) : (
                                <>
                                    <Button className="mr-2" disabled={this.state.filter === 'revisi' && listMut.length > 0 ? false : this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false} color="danger" onClick={this.prepareReject}>
                                        Reject
                                    </Button>
                                    <Button color="success" disabled={this.state.filter === 'revisi' ? false : this.state.filter !== 'available' ? true : false} onClick={this.cekDataDoc}>
                                        Verif
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.rinciEdit} className='modalrinci' size="xl">
                    <ModalBody>
                        <div>
                            {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                            {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailVerven.length > 0 ? detailVerven[0].depo.area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailVerven.length > 0 ? detailVerven[0].no_transaksi : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailVerven.length > 0 ? moment(detailVerven[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
                            </Row>
                        </div>
                        <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr>
                                        <th>
                                            Opsi
                                        </th>
                                        <th>NO</th>
                                        <th>No ajuan</th>
                                        <th>Nama Vendor</th>
                                        <th>Jenis Vendor</th>
                                        <th>No KTP</th>
                                        <th>No NPWP</th>
                                        <th>Alamat</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailVerven.length !== 0 && detailVerven.map(item => {
                                        return (
                                            <tr>
                                                <th>
                                                    <Button color="info" onClick={() => this.prosesEditId(item)}>Edit</Button>
                                                </th>
                                                <th scope="row">{detailVerven.indexOf(item) + 1}</th>
                                                <th>{item.no_transaksi}</th>
                                                <th>{item.nama}</th>
                                                <th>{item.jenis_vendor !== null && item.jenis_vendor !== '' ? item.jenis_vendor : item.nik === null || item.nik === '' || item.nik === 'TIDAK ADA' ? "Badan" : "Orang Pribadi"}</th>
                                                <th>{item.nik}</th>
                                                <th>{item.npwp}</th>
                                                <th>{item.alamat}</th>
                                                <th>{item.isreject === 1 ? 'reject' : '-'}</th>
                                            </tr>
                                            )
                                        })}
                                </tbody>
                            </Table>
                        </div>
                        <div className='rowBetween'>
                            <div>Data Rekening Vendor</div>
                            <div className='rowCenter mt-2 mb-2'>
                                {/* <Button 
                                size='sm' 
                                onClick={() => this.cekRekven({type: 'upload', data: values})} 
                                className='ml-1' 
                                color='primary'>
                                    <MdUpload size={20}/>
                                </Button> */}
                                {/* <Button 
                                size='sm' 
                                onClick={() => this.cekRekven({type: 'download', data: values})} 
                                className='ml-1' 
                                color='warning'>
                                    <MdDownload size={20}/>
                                </Button> */}
                            </div>
                        </div>
                        <Table striped bordered hover responsive className={[style.tab]}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>NIK</th>
                                    <th>NPWP</th>
                                    <th>BANK</th>
                                    <th>NO Rekening</th>
                                </tr>
                            </thead>
                            {dataRekven.length > 0 && dataRekven.map((item, index) => {
                                return (
                                    <>
                                        <tbody>
                                            <td>{index + 1}</td>
                                            <td>{item.nik}</td>
                                            <td>{item.npwp}</td>
                                            <td>{item.bank}</td>
                                            <td>{item.no_rekening}</td>
                                        </tbody>
                                    </>
                                )
                            })}
                        </Table>
                    </ModalBody>
                    <div className="modalFoot ml-3">
                        <div className="btnFoot">
                            <Button color="primary"  onClick={() => this.openDocCon()}>Dokumen</Button>
                        </div>
                        <div className="btnFoot">
                            <Button className="mr-2" 
                            // disabled={this.state.filter === 'revisi' && listMut.length > 0 ? false : this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false} 
                            color="danger" 
                            onClick={this.getDraftRevisi}>
                                Submit
                            </Button>
                            <Button color="success"  onClick={this.openRinciEdit}>
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
                <Modal size="xl" isOpen={this.state.modalDoc} toggle={this.openModalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen {detailVerven !== undefined && detailVerven.length > 0 && detailVerven[0].no_transaksi}
                </ModalHeader>
                <ModalBody>
                    <Container>
                        {dataDoc !== undefined && dataDoc.map(x => {
                            return (
                                x.path !== null &&
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
                                            {level === '5' 
                                            && detailVerven[0] !== null
                                            && detailVerven[0] !== undefined 
                                            && detailVerven[0].status_reject === 1 
                                            && detailVerven[0].status_transaksi !== 0 
                                            && (
                                                <>
                                                <button className="btnDocIo blue" onClick={() => this.showDokumen(x)} >{x.history}</button>
                                                <div className="colDoc">
                                                    <input
                                                    type="file"
                                                    className='ml-4'
                                                    onClick={() => this.setState({detail: x})}
                                                    onChange={this.onChangeUpload}
                                                    />
                                                    <text className="txtError ml-4">Maximum file upload is 25 Mb</text>
                                                    <text className="txtError ml-4">Only excel, pdf, zip, png, jpg and rar files are allowed</text>
                                                </div>
                                                </>
                                            )}
                                            <div className='mt-3 mb-3'>
                                                {this.state.filter === 'available' ? (
                                                    <div>
                                                        <Button 
                                                        color="success" 
                                                        onClick={() => {this.setState({idDoc: x.id}); this.openAppDoc()}}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button 
                                                        className='ml-1' 
                                                        color="danger" 
                                                        onClick={() => {this.setState({idDoc: x.id}); this.openModalRejDoc()}}
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Button className='ml-1' color='warning' onClick={() => this.docHistory(x)}>history</Button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Button color='warning' onClick={() => this.docHistory(x)}>history</Button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={style.readPdf}>
                                                <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${x.id}`} dataFile={x} />
                                            </div>
                                            
                                            
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
                </ModalFooter>
            </Modal>
                <Modal size="lg" isOpen={this.state.jurnalArea} toggle={this.openJurnalArea}>
                    <ModalBody>
                        <JurnalArea />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="mr-2" color="warning" onClick={() => this.printData('klmfpd')}>
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
                <Modal isOpen={this.props.verven.isLoading || this.props.menu.isLoading || this.props.email.isLoading || this.props.dokumen.isLoading} size="sm">
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
                                    Anda yakin untuk verif     
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                {/* {level === '11' ? (
                                    <Button color="primary" onClick={() => this.verifDataVendor()}>Ya</Button>
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
                                    Anda yakin untuk mengajukan data vendor     
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.getDraftAdd()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalAppDoc}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.appDoc} toggle={this.openAppDoc} centered={true}>
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
                            <Button color="secondary" onClick={this.openAppDoc}>Tidak</Button>
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
                    ) : this.state.confirm === 'add' ? (
                        <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Mengajukan Data Vendor</div>
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
                    ) : this.state.confirm === 'isEdit' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Mengupdate Data</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'resmail' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Kirim Email</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'isApprove' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Verifikasi dan Kirim Email</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'revTrue' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit Revisi Data</div>
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
                    ) : this.state.confirm === 'addFalse' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className={[style.sucUpdate, style.green]}>{messAdd}</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'inputVerif' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update Nilai Yang Diterima</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'verifdoc' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan seluruh dokumen lampiran telah diupload</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'maxUpload' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Upload Dokumen</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Pastikan Size Dokumen Tidak Lebih Dari 25 MB</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'onlyUpload' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Upload Dokumen</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Web Hanya Menerima Tipe Dokumen excel, pdf, zip, png, jpg dan rar </div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'errfill' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Save</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>{this.state.infoError}</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'falseIdent' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Error</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan data vendor telah terisi</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'falseRekven' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan rekening vendor telah terisi</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'dupUpload' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green, style.mb4]}>Gagal Upload</div>
                                <div className={[style.sucUpdate, style.green, style.mb4]}>Terdapat Duplikasi Pada Data Berikut</div>
                                {duplikat.length > 0 ? duplikat.map(item => {
                                    return (
                                        <div className={[style.sucUpdate, style.green, style.mb3]}>{item}</div>
                                    )
                                }) : (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    ) : this.state.confirm === 'sucAddRekven' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menambahkan Data Rekening Vendor</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'editRekven' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Mengupdate Data Rekening Vendor</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'delRekven' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Mendelete Data Rekening Vendor</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejAddRekven' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Data Rekening Vendor</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Data telah terdaftar </div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejEditRekven' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Mengupdate Data Rekening Vendor</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Data telah terdaftar </div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejDelRekven' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Mendelete Data Rekening Vendor</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Server sedang ada masalah</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'upload' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Upload Data Rekening Vendor</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'falseUpload' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Upload</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Pastikan Upload File Menggunakan Template Yang Telah Disediakan</div>
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
            <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                <ModalHeader>Dokumen</ModalHeader>
                <ModalBody>
                    <div className={style.readPdf}>
                        <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} dataFile={fileName} />
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        {this.state.filter === 'available' ? (
                            <div>
                                <Button color="success" onClick={() => this.openAppDoc()}>Approve</Button>
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
                                onClick={() => tipeEmail === 'reject' ? this.rejectVerven(this.state.dataRej) 
                                : tipeEmail === 'verif' ? this.verifDataVendor() 
                                : tipeEmail === 'revisi' ? this.submitRevVen()                                 
                                : this.addVerVendor()} 
                                color="primary"
                            >
                                {tipeEmail === 'reject' ? 'Reject' : tipeEmail === 'verif' ? 'Verif' : 'Submit'} & Send Email
                            </Button>
                            {tipeEmail !== 'reject' && tipeEmail !== 'verif' && tipeEmail !== 'revisi' ? (
                                null
                            ) : (
                                <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                            )}
                            
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
                        {detailVerven.length > 0 && detailVerven[0].history !== null && detailVerven[0].history.split(',').map(item => {
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
                                <Button color="primary" className='mr-2' onClick={() => this.openProsesModalDoc(detailVerven[0])}>Open Pop Up</Button>
                                <Button color="success" className='ml-2' onClick={() => this.openDocNewTab(detailVerven)}>Open New Tab</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.typeTrans} toggle={this.openTypeTrans} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div className='btnDocCon'>
                                <text>
                                    Pilih Tipe Ajuan
                                </text>
                            </div>
                            <div className='btnDocCon mb-4'>
                                <Button color="primary" className='mr-2' onClick={() => this.prepAddVerven('vendor')}>Ajuan Vendor</Button>
                                <Button color="success" className='ml-2' onClick={() => this.openModsync()}>Ajuan Rekening</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal toggle={this.openModsync} isOpen={this.state.openSync} size='lg'>
                    <ModalHeader>Pengecekan Data Vendor</ModalHeader>
                    <Formik
                    initialValues={{
                        ident: ''
                    }}
                    validationSchema={filterSchema}
                    onSubmit={(values) => {this.prosesSync(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                            <Row className="mb-2 rowRinci">
                                <Col md={3}>Nomor Identitas Vendor</Col>
                                <Col md={9} className="colRinci">:  <Input
                                    type="text"
                                    className="inputRinci"
                                    value={values.ident}
                                    onBlur={handleBlur("ident")}
                                    onChange={handleChange("ident")}
                                />
                                </Col>
                            </Row>
                            {errors.ident ? (
                                <text className={style.txtError}>{errors.ident}</text>
                            ) : null}
                            {/* <Row className="mb-2 rowRinci">
                                <Col md={3}>NPWP</Col>
                                <Col md={9} className="colRinci">:  <Input
                                    type="text"
                                    className="inputRinci"
                                    value={values.npwp}
                                    onBlur={handleBlur("npwp")}
                                    onChange={handleChange("npwp")}
                                />
                                </Col>
                            </Row>
                            {errors.npwp ? (
                                <text className={style.txtError}>{errors.npwp}</text>
                            ) : null} */}
                            <hr/>
                            <div className={style.foot}>
                                <div></div>
                                <div>
                                    <Button 
                                    // disabled={}
                                    className="mr-2" onClick={handleSubmit} 
                                    color="primary">
                                        Save
                                    </Button>
                                    <Button className="mr-3" onClick={this.openModsync}>Cancel</Button>
                                </div>
                            </div>
                        </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.modalAddRekven} size="lg">
                    <ModalHeader>Add Data Rekening Vendor</ModalHeader>
                    <Formik
                        initialValues={{
                            nik: this.state.detailVen.no_ktp === null ? '' : this.state.detailVen.no_ktp,
                            npwp: this.state.detailVen.no_npwp === null ? '' : this.state.detailVen.no_npwp,
                            no_rekening: "",
                            tujuan_tf: ""
                        }}
                        validationSchema={rekvenSchema}
                        onSubmit={(values) => { this.addDataRekven(values) }}
                    >
                        {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                            <ModalBody>
                               <Row className="mb-2 rowRinci">
                                    <Col md={3}>NIK</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.nik}
                                        disabled
                                        className="inputRinci1"
                                        onChange={handleChange('nik')}
                                        onBlur={handleBlur('nik')}
                                    />
                                    </Col>
                                </Row>
                                {errors.nik ? (
                                    <text className={style.txtError}>{errors.nik}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>NPWP</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.npwp}
                                        disabled
                                        className="inputRinci1"
                                        onChange={handleChange('npwp')}
                                        onBlur={handleBlur('npwp')}
                                    />
                                    </Col>
                                </Row>
                                {errors.npwp ? (
                                    <text className={style.txtError}>{errors.npwp}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Tujuan Transfer <text className='txtError'>{'*'}</text></Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        disabled={level === '5' || level === '6' ? false : true}
                                        type= "select" 
                                        className="inputRinci"
                                        value={values.tujuan_tf}
                                        onChange={handleChange('tujuan_tf')}
                                        onBlur={handleBlur('tujuan_tf')}
                                        >
                                            <option value=''>Pilih</option>
                                            <option value="rekening">Rekening</option>
                                            <option value="id">ID Pelanggan</option>
                                        </Input>
                                    </Col>
                                </Row>
                                {errors.tujuan_tf ? (
                                    <text className={style.txtError}>{errors.tujuan_tf}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>BANK</Col>
                                    <Col md={9} className="colRinci">:  <Select
                                        isDisabled={values.tujuan_tf === 'rekening' ? false : true}
                                        className="inputRinci2"
                                        options={this.state.bankList}
                                        onChange={this.selectBank}
                                        />
                                    </Col>
                                </Row>
                                {this.state.bank === '' && values.tujuan_tf === 'rekening' ? (
                                    <text className={style.txtError}>must be filled</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>NO REKENING</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.tujuan_tf === 'id' ? 'ID Pelanggan' : values.no_rekening}
                                        className="inputRinci1"
                                        disabled={this.state.digit === 0 || values.tujuan_tf === 'id' ? true : false}
                                        minLength={this.state.digit === null ? 10 : this.state.digit}
                                        maxLength={this.state.digit === null ? 16 : this.state.digit}
                                        onChange={handleChange('no_rekening')}
                                        onBlur={handleBlur('no_rekening')}
                                    />
                                    </Col>
                                </Row>
                                {values.tujuan_tf === 'id' ? (
                                    null
                                ) : this.state.digit !== null && values.no_rekening.length !== this.state.digit ? (
                                    <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                ) : this.state.digit === null && (values.no_rekening.length < 10 || values.no_rekening.length > 16) ? (
                                    <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                ) : null}
                                {values.tujuan_tf === 'id' && (
                                    <text className='green'>Tujuan transfer ID Pelanggan langsung isi di form operasional</text>
                                )}
                                <hr />
                                <div className={style.foot}>
                                    <div></div>
                                    <div>
                                        <Button
                                        className="mr-2"
                                        onClick={handleSubmit} color="primary"
                                        disabled={
                                            (this.state.bank === '' && values.tujuan_tf === 'rekening') ||
                                            (this.state.digit !== null && values.no_rekening.length !== this.state.digit && values.tujuan_tf === 'rekening') ||
                                            (this.state.digit === null && (values.no_rekening.length < 10 || values.no_rekening.length > 16) && values.tujuan_tf === 'rekening')
                                            ? true : false
                                        }
                                        >Save</Button>
                                        <Button className="" onClick={this.openAddRekven}>Cancel</Button>
                                    </div>
                                </div>
                            </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.detModRekven} size="lg">
                    <ModalHeader>Update Data Rekening Vendor</ModalHeader>
                    <Formik
                        initialValues={{
                            nik: this.state.detailVen.no_ktp === null ? '' : this.state.detailVen.no_ktp,
                            npwp: this.state.detailVen.no_npwp === null ? '' : this.state.detailVen.no_npwp,
                            no_rekening: this.state.detRekven.no_rekening,
                            tujuan_tf: this.state.detRekven.tujuan_tf
                        }}
                        validationSchema={rekvenSchema}
                        onSubmit={(values) => { this.updateDataRekven(values) }}
                    >
                        {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                            <ModalBody>
                               <Row className="mb-2 rowRinci">
                                    <Col md={3}>NIK</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.nik}
                                        disabled
                                        className="inputRinci1"
                                        onChange={handleChange('nik')}
                                        onBlur={handleBlur('nik')}
                                    />
                                    </Col>
                                </Row>
                                {errors.nik ? (
                                    <text className={style.txtError}>{errors.nik}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>NPWP</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.npwp}
                                        disabled
                                        className="inputRinci1"
                                        onChange={handleChange('npwp')}
                                        onBlur={handleBlur('npwp')}
                                    />
                                    </Col>
                                </Row>
                                {errors.npwp ? (
                                    <text className={style.txtError}>{errors.npwp}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Tujuan Transfer <text className='txtError'>{'*'}</text></Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        disabled={level === '5' || level === '6' ? false : true}
                                        type= "select" 
                                        className="inputRinci"
                                        value={values.tujuan_tf}
                                        onChange={handleChange('tujuan_tf')}
                                        onBlur={handleBlur('tujuan_tf')}
                                        >
                                            <option value=''>Pilih</option>
                                            <option value="rekening">Rekening</option>
                                            <option value="id">ID Pelanggan</option>
                                        </Input>
                                    </Col>
                                </Row>
                                {errors.tujuan_tf ? (
                                    <text className={style.txtError}>{errors.tujuan_tf}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>BANK</Col>
                                    <Col md={9} className="colRinci">:  <Select
                                        isDisabled={values.tujuan_tf === 'rekening' ? false : true}
                                        className="inputRinci2"
                                        options={this.state.bankList}
                                        onChange={this.selectBank}
                                        value={{label: this.state.bank, value: this.state.digit}}
                                        />
                                    </Col>
                                </Row>
                                {this.state.bank === '' && values.tujuan_tf === 'rekening' ? (
                                    <text className={style.txtError}>must be filled</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>NO REKENING</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.tujuan_tf === 'id' ? 'ID Pelanggan' : values.no_rekening}
                                        className="inputRinci1"
                                        disabled={this.state.digit === 0 || values.tujuan_tf === 'id' ? true : false}
                                        minLength={this.state.digit === null ? 10 : this.state.digit}
                                        maxLength={this.state.digit === null ? 16 : this.state.digit}
                                        onChange={handleChange('no_rekening')}
                                        onBlur={handleBlur('no_rekening')}
                                    />
                                    </Col>
                                </Row>
                                {values.tujuan_tf === 'id' ? (
                                    null
                                ) : this.state.digit !== null && values.no_rekening.length !== this.state.digit ? (
                                    <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                ) : this.state.digit === null && (values.no_rekening.length < 10 || values.no_rekening.length > 16) ? (
                                    <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                ) : null}
                                {values.tujuan_tf === 'id' && (
                                    <text className='green'>Tujuan transfer ID Pelanggan langsung isi di form operasional</text>
                                )}
                                <hr />
                                <div className={style.foot}>
                                    <div></div>
                                    <div>
                                        <Button
                                        className="mr-2"
                                        onClick={handleSubmit} color="primary"
                                        disabled={
                                            (this.state.bank === '' && values.tujuan_tf === 'rekening') ||
                                            (this.state.digit !== null && values.no_rekening.length !== this.state.digit && values.tujuan_tf === 'rekening') ||
                                            (this.state.digit === null && (values.no_rekening.length < 10 || values.no_rekening.length > 16) && values.tujuan_tf === 'rekening')
                                            ? true : false
                                        }
                                        >Save</Button>
                                        <Button className="" onClick={this.openDetRekven}>Cancel</Button>
                                    </div>
                                </div>
                            </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.modUpRekven} >
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
                            <Button className='mr-2' color="primary" disabled={this.state.fileUpload === "" ? true : false} onClick={this.uploadDataRekven}>Upload</Button>
                            <Button onClick={this.openUpRekven}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalDelRekven} toggle={this.confirmDel} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk menghapus data rekening vendor ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.delDataRekven()}>Ya</Button>
                                <Button color="secondary" onClick={this.confirmDel}>Tidak</Button>
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
    email: state.email,
    dokumen: state.dokumen,
    verven: state.verven,
    bank: state.bank,
    vendor: state.vendor,
    menu: state.menu
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
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    showDokumen: dokumen.showDokumen,
    approveDokumen: dokumen.approveDokumen,
    rejectDokumen: dokumen.rejectDokumen,
    updateNilaiVerif: ikk.updateNilaiVerif,
    getAllNotif: notif.getAllNotif,
    addNotif: notif.addNotif,
    getVerven: verven.getVerven,
    addVerven: verven.addVerven,
    submitVerifVerven: verven.submitVerifVerven,
    submitVerifFinance: verven.submitVerifFinance,
    getDetailVerven: verven.getDetailVerven,
    rejectVerven: verven.rejectVerven,
    revisiVerven: verven.revisiVerven,
    getDetailId: verven.getDetailId,
    editVerven: verven.editVerven,
    generateNoVendor: verven.generateNoVendor,
    getDocument: verven.getDocument,
    resetVerven: verven.resetVerven,
    uploadDocVerven: verven.uploadDocVerven,
    getRekven: verven.getRekven,
    uploadRekven: verven.uploadRekven,
    updateRekven: verven.updateRekven,
    deleteRekven: verven.deleteRekven,
    addRekven: verven.addRekven,
    getResmail: email.getResmail,
    getBank: bank.getBank,
    getVendor: vendor.getVendor,
    getSubMenu: menu.getSubMenu
}

export default connect(mapStateToProps, mapDispatchToProps)(IKK)
