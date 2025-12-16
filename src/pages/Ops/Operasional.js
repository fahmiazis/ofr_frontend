/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {VscAccount} from 'react-icons/vsc'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink, DropdownToggle, DropdownMenu, 
    Card, CardBody, Table, ButtonDropdown, Input, Button, Col, DropdownItem,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter, UncontrolledTooltip} from 'reactstrap'
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
import Countdown from 'react-countdown'
import JurnalArea from '../../components/Ops/JurnalArea'
import NumberInput from '../../components/NumberInput'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import ListBbm from '../../components/Ops/ListBbm'
import { BiExpand, BiCollapse } from "react-icons/bi";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import Pdfprint from 'react-to-pdf'
import depo from '../../redux/actions/depo'
import tarif from '../../redux/actions/tarif'
import taxcode from '../../redux/actions/taxcode'
import kliring from '../../redux/actions/kliring'
import Select from 'react-select'
const {REACT_APP_BACKEND_URL, REACT_APP_URL_FULL} = process.env
const userAppArea = ['10', '11', '12', '15', '30']

const options = {
    // default is `save`
    method: 'open',
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    page: {
       // margin is in MM, default is Margin.NONE = 0
       // default is 'A4'
       format: 'letter',
       // default is 'portrait'
       orientation: 'landscape',
    },
    canvas: {
       // default is 'image/jpeg' for better size performance
       mimeType: 'image/png',
       qualityRatio: 1
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break, 
    // so use with caution.
    overrides: {
       // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
       pdf: {
          compress: true
       },
       // see https://html2canvas.hertzen.com/configuration for more options
       canvas: {
          useCORS: true
       }
    },
 }

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

const nilaiSchema = Yup.object().shape({
    nilai_verif: Yup.string()
});


class Ops extends Component {
    componentRef = null;
    
    constructor(props) {
        super(props);
        this.callRef = React.createRef()
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
            time: 'last',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            docHist: false,
            detailDoc: {},
            docCon: false,
            tipeEmail: '',
            dataRej: {},
            jurnalArea: false,
            tipeNilai: 'all',
            modalNilai: false,
            nilai_verif: 0,
            dataZip: [],
            listReject: [],
            statEmail: '',
            modResmail: false,
            idDoc: 0,
            dataColl: [],
            fileName: {},
            filterVendor: []
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    setComponentRef = (ref) => {
        this.componentRef = ref;
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

    checkDoc = (val) => {
        const { dataZip } = this.state
        const {dataDoc} = this.props.ops
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

    collDoc = (val) => {
        const {dataColl} = this.state
        const dataApp = [...dataColl]
        const dataRej = []
        const cek = dataColl.find(x => x === val)
        if (cek !== undefined) {
            console.log('masuk not undefined')
            for (let i = 0; i < dataColl.length; i++) {
                if (dataColl[i] === val) {
                    dataRej.push()
                } else {
                    dataRej.push(dataColl[i])
                }
            }
            this.setState({dataColl: dataRej})
        } else {
            console.log('masuk undefined')
            dataApp.push(val)
            this.setState({dataColl: dataApp})
        }
    }

    downloadDataZip = () => {
        const {dataZip} = this.state
        const {dataDoc} = this.props.ops
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
        const { listReject } = this.state
        const { detailOps } = this.props.ops
        const token = localStorage.getItem('token')
        const level = localStorage.getItem("level")
        const id = localStorage.getItem('id')

        await this.props.getRole(token)
        await this.props.getDetailUser(token, id)
        const { detailUser, dataRole } = this.props.user

        const arrRole = detailUser.detail_role
        const listRole = []
        for (let i = 0; i < arrRole.length + 1; i++) {
            if (detailUser.level === 1) {
                const data = {fullname: 'admin', name: 'admin', level: 1, type: 'all'}
                listRole.push(data)
            } else if (i === arrRole.length) {
                const cek = dataRole.find(item => item.level === detailUser.level)
                if (cek !== undefined) {
                    listRole.push(cek)
                }
            } else {
                const cek = dataRole.find(item => item.level === arrRole[i].id_role)
                if (cek !== undefined) {
                    listRole.push(cek)
                }
            }
        }

        let index = null

        for (let i = 0; i < listRole.length; i++) {
            const app =  detailOps[0].appForm === undefined ? [] :  detailOps[0].appForm
            const cekApp = app.find(item => (item.jabatan === listRole[i].name))
            const find = app.indexOf(cekApp)
            if (find !== -1) {
                if ((app[find].status === null || app[find].status === '0') && (level !== '5' && app[find + 1].status !== undefined && app[find + 1].status === '1')) {
                    index = find
                }
            }
        }

        let temp = ''
        for (let i = 0; i < listReason.length; i++) {
            temp += listReason[i] + '. '
        }
        const data = {
            no: detailOps[0].no_transaksi,
            list: listMut,
            alasan: temp + val.alasan,
            menu: listMenu.toString(),
            type_reject: listReject[0],
            indexApp: index
        }
        await this.props.rejectOps(token, data)
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
        const { pageOps } = this.props.ops
        const token = localStorage.getItem('token')
        await this.props.nextOps(token, pageOps.nextLink)
    }

    prev = async () => {
        const { pageOps } = this.props.ops
        const token = localStorage.getItem('token')
        await this.props.nextOps(token, pageOps.prevLink)
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

    getDetailStock = async (value) => {
        const token = localStorage.getItem("token")
        this.setState({dataItem: value})
        await this.props.getDetailStock(token, value.id)
        this.openModalRinci()
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

    async componentDidMount() {
        const token = localStorage.getItem('token')
        const dataCek = localStorage.getItem('docData')
        const {item, type} = (this.props.location && this.props.location.state) || {}
        const id = localStorage.getItem('id')
        // await this.props.getRole(token)
        // await this.props.getDetailUser(token, id)
        await this.props.getDepo(token, 'all', '', 1)
        await this.props.getTarif(token, 'all', '', 1)
        await this.props.getKliring(token, 'all', '', 1)
        await this.props.getTaxcode(token, 'all', '', 1)
        if (type === 'approve') {
            this.setState({
                time1: moment(item.createdAt).startOf('month').format('YYYY-MM-DD')
            })
            this.getDataOps()
            // this.prosesDetail(item)
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
            this.props.resetOps()
        } else if (isReject === false) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
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
            name: 'Draft Pengajuan Ops'
        }
        this.setState({listMut: []})
        await this.props.getDetail(token, tempno)
        await this.props.getApproval(token, tempno)
        await this.props.getDocOps(token, data)
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
                    jenis: 'ops',
                    tipe: 'revisi',
                    menu: 'Revisi Area (Operasional)'
                }
               
            } else {
                tempno = {
                    ...tempno,
                    jenis: 'ops',
                    tipe: 'approve',
                    menu: 'Pengajuan Operasional (Operasional)'
                }
            }
        } else {
            const tipe = tempApp.length === app.length ? 'full approve' : 'approve'
            const cekMenu = 'Pengajuan Operasional (Operasional)'
            if (val[0].status_reject === 1) {
                tempno = {
                    ...tempno,
                    jenis: 'ops',
                    tipe: 'reject',
                    typeReject: val[0].status_transaksi === 0 ? 'pembatalan' : 'perbaikan',
                    menu: cekMenu
                }
            } else {
                tempno = {
                    ...tempno,
                    jenis: 'ops',
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
            nameTo: draftEmail.to.fullname,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: detailOps[0].no_transaksi,
            tipe: 'ops'
        }
        await this.props.sendEmail(token, tempno)
        this.openModResmail()
        this.setState({confirm: 'resmail'})
        this.openConfirm()
    }

    openModalDok = () => {
        this.setState({opendok: !this.state.opendok})
    }

    printData = (val) => {
        const {detailOps} = this.props.ops
        localStorage.setItem('printData', detailOps[0].no_transaksi)
        const newWindow = window.open(`/${val}`, '_blank', 'noopener,noreferrer')
        if (newWindow) {
            newWindow.opener = null
        }
        // this.props.history.push(`/${val}`)
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

    cekFailDoc = (val) => {
        if (val === 'reject') {
            this.setState({confirm: 'failrejdoc'})
            this.openConfirm()
        } else {
            this.setState({confirm: 'failappdoc'})
            this.openConfirm()
        }
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
        const status = val === 'bayar' || val === 'completed' ? 8 : 2
        const statusAll = 'all'
        const {time1, time2, search, limit, time} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const typeKasbon = 'non kasbon'
        if (val === 'all') {
            const newOps = []
            await this.props.getOps(token, statusAll, 'all', 'all', val, 'approve', 'undefined', cekTime1, cekTime2, typeKasbon, undefined, search, undefined, undefined, 'all', limit, time)
            this.setState({filter: val, newOps: newOps})
        } else {
            const newOps = []
            await this.props.getOps(token, status, 'all', 'all', val, 'approve', 'undefined', cekTime1, cekTime2, typeKasbon, undefined, search, undefined, undefined, 'all', limit, time)
            this.setState({filter: val, newOps: newOps})
        }
    }

    getDataLimit = async (val) => {
        const typeKasbon = 'non kasbon'
        const {time1, time2, filter, search, time} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = filter === 'all' ? 'all' : filter === 'bayar' || filter === 'completed' ? 8: 2
        this.setState({limit: val})
        await this.props.getOps(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, 'approve', 'undefined', cekTime1, cekTime2, typeKasbon, undefined, search, undefined, undefined, 'all', val, time)
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
        const typeKasbon = 'non kasbon'
        const {time1, time2, filter, search, limit, time} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = filter === 'all' ? 'all' : filter === 'bayar' || filter === 'completed' ? 8: 2
        await this.props.getOps(token, filter === 'all' ? 'all' : status, 'all', 'all', filter, 'approve', 'undefined', cekTime1, cekTime2, typeKasbon, undefined, search, undefined, undefined, 'all', limit, time)
    }
    
    cekDataDoc = () => {
        const { dataDoc } = this.props.ops
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
        const id = localStorage.getItem('id')
        await this.props.getRole(token)
        await this.props.getDetailUser(token, id)
        const { detailUser, dataRole } = this.props.user

        const arrRole = detailUser.detail_role
        const listRole = []
        for (let i = 0; i < arrRole.length + 1; i++) {
            if (detailUser.level === 1) {
                const data = {fullname: 'admin', name: 'admin', level: 1, type: 'all'}
                listRole.push(data)
            } else if (i === arrRole.length) {
                const cek = dataRole.find(item => item.level === detailUser.level)
                if (cek !== undefined) {
                    listRole.push(cek)
                }
            } else {
                const cek = dataRole.find(item => item.level === arrRole[i].id_role)
                if (cek !== undefined) {
                    listRole.push(cek)
                }
            }
        }

        const index = []

        for (let i = 0; i < listRole.length; i++) {
            const app =  detailOps[0].appForm === undefined ? [] :  detailOps[0].appForm
            const cekApp = app.find(item => (item.jabatan === listRole[i].name))
            const find = app.indexOf(cekApp)
            if (find !== -1) {
                if ((app[find].status === null || app[find].status === '0') && (level !== '5' && app[find + 1].status !== undefined && app[find + 1].status === '1')) {
                    index.push(find)
                } else if ((app[find].status === null || app[find].status === '0') && (level !== '5' && app[find + 1].status !== undefined && listRole.find(x => x.name === app[find + 1].jabatan))) {
                    index.push(find)
                }
            }
        }

        const tempno = {
            no: detailOps[0].no_transaksi,
            indexApp: index
        }

        await this.props.approveOps(token, tempno)
        this.dataSendEmail()

        // if (level === '12') {
        //     this.getDataOps()
        //     this.setState({confirm: 'isApprove'})
        //     this.openConfirm()
        //     this.openModalApprove()
        //     this.openModalRinci()
        // } else {
        // this.dataSendEmail()
        // }
    }

    dataSendEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { listReject } = this.state
        const { detailOps } = this.props.ops
        const { draftEmail } = this.props.email
        const { message, subject } = this.state
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        const app = detailOps[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipeProses = val === 'reject' && listReject[0] === 'pembatalan' ? 'reject pembatalan' : val === 'reject' && listReject[0] !== 'pembatalan' ? 'reject perbaikan' : tempApp.length === app.length-1 ? 'verifikasi' : 'approve'
        const tipeRoute = val === 'reject' && listReject[0] === 'pembatalan' ? 'ops' : val === 'reject' && listReject[0] !== 'pembatalan' ? 'revops' : tempApp.length === app.length-1 ? 'veriffintax' : 'ops'
        const tipeMenu = tempApp.length === app.length-1 ? 'verifikasi ops' : 'pengajuan ops'
        const tempno = {
            draft: draftEmail,
            nameTo: draftEmail.to.fullname,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: detailOps[0].no_transaksi,
            tipe: 'ops',
            menu: tipeMenu,
            proses: tipeProses,
            route: tipeRoute
        }
        await this.props.sendEmail(token, tempno)
        await this.props.addNotif(token, tempno)
        if (val === 'reject') {
            this.getDataOps()
            this.setState({confirm: 'reject'})
            this.openConfirm()
            this.openDraftEmail()
            this.openModalReject()
            this.openModalRinci()
        } else {
            this.getDataOps()
            this.setState({confirm: 'isApprove'})
            this.openConfirm()
            this.openDraftEmail()
            this.openModalApprove()
            this.openModalRinci()
        }
    }

    prepSendEmail = async () => {
        const { detailOps } = this.props.ops
        const token = localStorage.getItem("token")
        const level = localStorage.getItem("level")
        const app = detailOps[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })

        const id = localStorage.getItem('id')
        await this.props.getRole(token)
        await this.props.getDetailUser(token, id)
        const { detailUser, dataRole } = this.props.user

        const arrRole = detailUser.detail_role
        const listRole = []
        for (let i = 0; i < arrRole.length + 1; i++) {
            if (detailUser.level === 1) {
                const data = {fullname: 'admin', name: 'admin', level: 1, type: 'all'}
                listRole.push(data)
            } else if (i === arrRole.length) {
                const cek = dataRole.find(item => item.level === detailUser.level)
                if (cek !== undefined) {
                    listRole.push(cek)
                }
            } else {
                const cek = dataRole.find(item => item.level === arrRole[i].id_role)
                if (cek !== undefined) {
                    listRole.push(cek)
                }
            }
        }

        const index = []

        for (let i = 0; i < listRole.length; i++) {
            const app =  detailOps[0].appForm === undefined ? [] :  detailOps[0].appForm
            const cekApp = app.find(item => (item.jabatan === listRole[i].name))
            const find = app.indexOf(cekApp)
            console.log(find)
            console.log(app[find])
            if (find !== -1) {
                if ((app[find].status === null || app[find].status === '0') && (level !== '5' && app[find + 1].status !== undefined && app[find + 1].status === '1')) {
                    index.push(find)
                } else if ((app[find].status === null || app[find].status === '0') && (level !== '5' && app[find + 1].status !== undefined && listRole.find(x => x.name === app[find + 1].jabatan))) {
                    index.push(find)
                }
            }
        }

        const getLow = Math.min(...index)

        const tipe = (tempApp.length === app.length-1) || getLow === 0 ? 'full approve' : 'approve'
        const tempno = {
            no: detailOps[0].no_transaksi,
            kode: detailOps[0].kode_plant,
            jenis: 'ops',
            tipe: tipe,
            menu: 'Pengajuan Operasional (Operasional)',
            indexApp: getLow
        }
        await this.props.getDraftEmail(token, tempno)
        this.setState({tipeEmail: 'app'})
        this.openDraftEmail()
    }

    prepReject = async (val) => {
        const { detailOps } = this.props.ops
        const { listReject } = this.state
        const token = localStorage.getItem("token")
        const app = detailOps[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'reject'
        const tempno = {
            no: detailOps[0].no_transaksi,
            kode: detailOps[0].kode_plant,
            jenis: 'ops',
            tipe: tipe,
            typeReject: listReject[0],
            menu: 'Pengajuan Operasional (Operasional)'
        }
        await this.props.getDraftEmail(token, tempno)
        this.setState({tipeEmail: 'reject'})
        this.setState({dataRej: val})
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    goRevisi = (val) => {
        this.props.history.push({
            pathname: `/${val.route}`,
            state: val
        })
    }

    getMessage = (val) => {
        this.setState({message: val.message, subject: val.subject})
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const typeKasbon = 'non kasbon'
        const {time1, time2, filter, limit, time} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const status = filter === 'all' ? 'all' : filter === 'bayar' || filter === 'completed' ? 8 : 2
        if(e.key === 'Enter'){
            await this.props.getOps(token, status, 'all', 'all', filter, 'approve', 'undefined', cekTime1, cekTime2, typeKasbon, undefined, e.target.value, undefined, undefined, 'all', limit, time)
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
        const newWindow = window.open('ops', '_blank', 'noopener,noreferrer')
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
        this.setState({modalDoc: !this.state.modalDoc, dataZip: []})
    }

    approveDoc = async (val) => {
        const token = localStorage.getItem('token')
        const {idDoc} = this.state
        const { detailOps } = this.props.ops
        const tempno = {
            no: detailOps[0].no_transaksi,
            name: 'Draft Pengajuan Ops'
        }
        await this.props.approveDokumen(token, val.id)
        await this.props.getDocOps(token, tempno)
        if (val.type === 'show') {
            this.openModalPdf()
            this.collDoc(val.id)
        } else {
            this.collDoc(val.id)
        }
        // this.setState({confirm: 'isAppDoc'})
        // this.openConfirm()
        // this.openModalAppDoc()
        
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
        const {detailOps} = this.props.ops
        const tempno = {
            no: detailOps[0].no_transaksi,
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

    selTipe = (val) => {
        this.setState({tipeNilai: val})
    }

    openNilaiVerif = () => {
        this.setState({modalNilai: !this.state.modalNilai})
    }

    updateNilai = async (val) => {
        const token = localStorage.getItem('token')
        const {tipeNilai, nilai_verif} = this.state
        const {detailOps} = this.props.ops
        const tempno = {
            no: detailOps[0].no_transaksi
        }
        const data = {
            type: tipeNilai,
            nilai: tipeNilai === 'all' ? nilai_verif : val.nilai_verif,
            id: tipeNilai === 'all' ? detailOps[0].id : val.id,
            no: detailOps[0].no_transaksi
        }
        await this.props.updateNilaiVerif(token, data)
        if (tipeNilai === 'all') {
            await this.props.getDetail(token, tempno)
            this.setState({confirm: 'inputVerif', nilai_verif: 0})
            this.openConfirm()
            this.openNilaiVerif()
            this.getDataOps()
        } else {
            await this.props.getDetail(token, tempno)
            this.setState({confirm: 'inputVerif', nilai_verif: 0})
            this.openConfirm()
            this.openModalEdit()
            this.getDataOps()
        }
        
    }

    updateData = async (val) => {
        const data = {
            [val.target.name]: val.target.value
        }
        console.log(data)
        this.setState(data)
    }

    prosesModalBukti = async () => {
        const token = localStorage.getItem("token")
        const { detailOps } = this.props.ops
        const tempno = {
            no: detailOps[0].no_pembayaran
        }
        await this.props.getDocBayar(token, tempno)
        this.modalBukti()
    }

    modalBukti = () => {
        this.setState({openBukti: !this.state.openBukti})
    }

    selectVendor = (selected) => {
        if (!selected) {
            this.setState({ filterVendor: [] })
            return
        }
        
        const { vendorList } = this.props.ops
        const val = selected.value
        
        if (val === 'all') {
            this.setState({ filterVendor: [] }) // Kosong = show all
        } else {
            const dataFinal = vendorList
                .filter(item => item.nama_vendor === val)
                .map(item => item.no_transaksi)

            this.setState({ filterVendor: dataFinal })
        }
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {listReject, listMut, tipeEmail, listReason, dataMenu, listMenu, detailDoc, filter, dataZip, dataColl, fileName} = this.state
        const { detailDepo, dataDepo } = this.props.depo
        const { dataReason } = this.props.reason
        const { noDis, detailOps, ttdOps, dataDoc, newOps, idOps, docBukti, pageOps, vendorList } = this.props.ops
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
                                <div className={style.titleDashboard}>Pengajuan Operasional</div>
                            </div>
                            
                                <div className={[style.secEmail4]}>
                                    {(level === '5' || level === '6') ? (
                                        <Button onClick={() => this.goProses({route: 'cartops', type: 'non kasbon'})} color="info" size="lg">Create</Button>
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
                                </div>
                           
                            <div className={[style.secEmail4]}>
                                {(level === '5' || level === '6') ? (
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
                                ) : (
                                    <div className={style.searchEmail2}>
                                        <text>vendor:  </text>
                                        <Select
                                            className={style.filter}
                                            options={
                                                vendorList && vendorList.length > 0
                                                ? [
                                                    { value: 'all', label: 'Semua Vendor' },
                                                    ...[...new Set(vendorList.map(v => v.nama_vendor))].map(nama => ({
                                                        value: nama,
                                                        label: nama
                                                    }))
                                                    ]
                                                : [{ value: 'all', label: 'Semua Vendor' }]
                                            }
                                            onChange={this.selectVendor}
                                            placeholder="Pilih Vendor"
                                        />
                                    </div>
                                )}
                                
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
                            </div>
                            <div className={[style.secEmail4]}>
                                <div className='rowCenter'>
                                    <div className='rowCenter'>
                                        <Input className={style.filter3} type="select" value={this.state.time} onChange={e => this.changeTime(e.target.value)}>
                                            <option value="all">Time (All)</option>
                                            <option value="pilih">Periode</option>
                                            <option value="last">Last Update</option>
                                        </Input>
                                    </div>
                                    {this.state.time === 'pilih' || this.state.time === 'last'?  (
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
                                <div className={style.tableDashboard1}>
                                    <Table bordered responsive hover className={[style.tab, newOps.length > 0 && 'tableJurnal1']} id="table-ops">
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
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newOps.length > 0 && 
                                            newOps.filter((item) => {
                                                // Filter status
                                                const statusMatch = (filter !== 'bayar' && filter !== 'completed') 
                                                    || (filter === 'completed' && item.end_ops !== null) 
                                                    || (filter === 'bayar' && item.end_ops === null)
                                                
                                                // Filter vendor (kosong = show all)
                                                const vendorMatch = this.state.filterVendor.length === 0 
                                                    || this.state.filterVendor.includes(item.no_transaksi)
                                                
                                                return statusMatch && vendorMatch
                                            }).map((item, index)=> {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                                        <th>{(index + (((pageOps.currentPage - 1) * pageOps.limitPerPage) + 1))}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{dataDepo.find(e => e.kode_plant === item.kode_plant) !== undefined && dataDepo.find(e => e.kode_plant === item.kode_plant).profit_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{item.keterangan}</th>
                                                        <th>{moment(item.start_ops).format('DD MMMM YYYY')}</th>
                                                        <th>{item.type_kasbon === 'kasbon' ? 'Kasbon' : 'Non Kasbon'}</th>
                                                        <th>{item.history !== null && item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            <Button 
                                                            size='sm' 
                                                            onClick={() => (item.status_reject === 1 && item.status_transaksi !== 0) ? this.goRevisi({route: 'revops', type: 'revisi', item: item}) : this.prosesDetail(item)} 
                                                            className='mb-1 mr-1' 
                                                            color='success'>
                                                                {filter === 'bayar' ? 'Proses' : (item.status_reject === 1 && item.status_transaksi !== 0) ? 'Revisi' : 'Detail'}
                                                            </Button>
                                                            <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {(newOps.length === 0 || (filter === 'completed' && newOps.find(({end_ops}) => end_ops !== null) === undefined) || (filter === 'bayar' && newOps.find(({end_ops}) => end_ops === null) === undefined)) && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={style.tableDashboard1}>
                                    <Table bordered responsive hover className={[style.tab, newOps.length > 0 && 'tableJurnal1']} id="table-ops">
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
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newOps.length > 0 && 
                                            newOps.filter((item) => {
                                                // Filter status
                                                const statusMatch = (filter !== 'bayar' && filter !== 'completed') 
                                                    || (filter === 'completed' && item.end_ops !== null) 
                                                    || (filter === 'bayar' && item.end_ops === null)
                                                
                                                // Filter vendor (kosong = show all)
                                                const vendorMatch = this.state.filterVendor.length === 0 
                                                    || this.state.filterVendor.includes(item.no_transaksi)
                                                
                                                return statusMatch && vendorMatch
                                            }).map((item, index) => {
                                                return (
                                                    <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                                        <th>{(index + (((pageOps.currentPage - 1) * pageOps.limitPerPage) + 1))}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{dataDepo.find(e => e.kode_plant === item.kode_plant) !== undefined && dataDepo.find(e => e.kode_plant === item.kode_plant).profit_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{item.keterangan}</th>
                                                        <th>{moment(item.start_ops).format('DD MMMM YYYY')}</th>
                                                        <th>{item.type_kasbon === 'kasbon' ? 'Kasbon' : 'Non Kasbon'}</th>
                                                        <th>{item.history !== null && item.history.split(',').reverse()[0]}</th>
                                                        <th>
                                                            <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>{filter === 'available' ? 'Proses' : 'Detail'}</Button>
                                                            {level === '1' && (
                                                                <Button size='sm' className='mb-1 mr-1' onClick={() => this.prosesJurnalArea(item)} color='primary'>Jurnal Area</Button>
                                                            )}
                                                            <Button size='sm' className='mb-1' onClick={() => this.prosesTracking(item)} color='warning'>Tracking</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {(newOps.length === 0 || (filter === 'completed' && newOps.find(({end_ops}) => end_ops !== null) === undefined) || (filter === 'bayar' && newOps.find(({end_ops}) => end_ops === null) === undefined)) && (
                                        <div className={style.spin}>
                                            <text className='textInfo' id='king' >Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className={style.infoPageEmail1}>
                                <text>Showing {pageOps.currentPage} of {pageOps.pages === 0 ? 1 : pageOps.pages} pages</text>
                                <div className={style.pageButton}>
                                    <button 
                                        className={style.btnPrev} 
                                        color="info" 
                                        // disabled
                                        disabled={pageOps.prevLink === null ? true : false} 
                                        onClick={this.prev}>Prev
                                    </button>
                                    <button 
                                        className={style.btnPrev} 
                                        color="info" 
                                        // disabled
                                        disabled={pageOps.nextLink === null ? true : false} 
                                        onClick={this.next}>Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </MaterialTitlePanel>
                </Sidebar>

                <Modal size="lg" isOpen={this.state.jurnalArea} toggle={this.openJurnalArea}>
                    <ModalBody>
                        <JurnalArea />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="mr-2" color="warning" onClick={() => this.printData('jurnalops')}>
                            {/* <TableStock /> */}
                            Download
                        </Button>
                        <Button color="success" onClick={this.openJurnalArea}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>

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
                                // value = {detailOps[0].type_nilaiverif === 'all' ? detailOps[0].nilai_verif : }
                                className="ml-3" />
                                <Button className='ml-2' color='primary' disabled={this.state.nilai_verif === 0 || this.state.tipeNilai !== 'all'} onClick={this.updateNilai} >Update</Button>
                            </Col>
                        </Row>
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
                                    {detailOps.length !== 0 && detailOps.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{detailOps.indexOf(item) + 1}</th>
                                                <th>{item.no_transaksi}</th>
                                                <th>{dataDepo.find(e => e.kode_plant === item.kode_plant) !== undefined && dataDepo.find(e => e.kode_plant === item.kode_plant).profit_center}</th>
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
                                                    // value = {detailOps[0].type_nilaiverif === 'all' ? detailOps[0].nilai_verif : }
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
                                id: idOps.id,
                                keterangan: idOps.keterangan || '',
                                periode_awal: idOps.periode_awal || '',
                                periode_akhir: idOps.periode_akhir || '',
                                nilai_ajuan: parseFloat(idOps.nilai_ajuan) || 0,
                                no_transaksi: idOps.no_transaksi || '',
                                nama_tujuan: idOps.nama_tujuan || '',
                                status_npwp: idOps.status_npwp === 0 ? 'Tidak' : idOps.status_npwp === 1 && 'Ya',
                                nama_npwp: idOps.nama_npwp || '',
                                no_coa: idOps.no_coa || '',
                                nama_coa: idOps.nama_coa || '',
                                nama_ktp: idOps.nama_ktp || '',
                                no_surkom: idOps.no_surkom || '',
                                nilai_verif: idOps.nilai_verif || 0,
                                nilai_bayar: idOps.nilai_bayar === null ? parseFloat(idOps.nilai_ajuan) : parseFloat(idOps.nilai_bayar)
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
                                        {values.nilai_verif === '' ? (
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
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].no_transaksi : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailOps.length > 0 ? moment(detailOps[0].start_ops).format('DD MMMM YYYY') : ''} /></Col>
                            </Row>
                        </div>
                        <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr className='tbops'>
                                        <th>
                                            <input  
                                            className='mr-2'
                                            type='checkbox'
                                            checked={listMut.length === 0 ? false : listMut.length === detailOps.length ? true : false}
                                            onChange={() => listMut.length === detailOps.length ? this.chekRej('all') : this.chekApp('all')}
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
                                        <th>NPWP</th>
                                        <th>NAMA SESUAI KTP</th>
                                        <th>NIK</th>
                                        <th>Transaksi Ber PPN</th>
                                        <th>NO FAKTUR</th>
                                        <th>DPP</th>
                                        <th>PPN</th>
                                        <th>PPh</th>
                                        <th>NILAI YANG DIBAYARKAN</th>
                                        <th>NILAI YANG DITERIMA</th>
                                        <th>Vendor Memiliki SKB</th>
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
                                                    <input 
                                                    type='checkbox'
                                                    checked={listMut.find(element => element === item.id) !== undefined ? true : false}
                                                    onChange={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                    />
                                                </th>
                                                <th scope="row">{detailOps.indexOf(item) + 1}</th>
                                                <th>{dataDepo.find(e => e.kode_plant === item.kode_plant) !== undefined && dataDepo.find(e => e.kode_plant === item.kode_plant).profit_center}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.keterangan}</th>
                                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.bank_tujuan}</th>
                                                <th>{item.tujuan_tf === 'ID Pelanggan' ? item.id_pelanggan : item.norek_ajuan}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.status_npwp === 0 ? 'Tidak' : item.status_npwp === 1 ? 'Ya' : '-'}</th>
                                                <th>{item.status_npwp === 1 ? item.nama_npwp : ''}</th>
                                                <th>{item.status_npwp === 1 ? item.no_npwp : ''}</th>
                                                <th>{item.status_npwp === 0 ? item.nama_ktp : ''}</th>
                                                <th>{item.status_npwp === 0 ? item.no_ktp : ''}</th>
                                                <th>{item.type_transaksi}</th>
                                                <th>{item.no_faktur}</th>
                                                <th>{item.dpp !== null && item.dpp !== 0 && item.dpp !== '0' && item.dpp !== '' ? item.dpp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.ppn !== null && item.ppn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>(-){item.nilai_utang !== null && item.nilai_utang.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.nilai_bayar === null ? item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.nilai_verif !== null && item.nilai_verif.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.stat_skb === 'ya' ? 'Ya' : '-'}</th>
                                                <th>{item.tanggal_transfer}</th>
                                                <th>{item.jenis_pph}</th>
                                                <th>{item.isreject === 1 ? 'reject' : '-'}</th>
                                            </tr>
                                            )
                                        })}
                                </tbody>
                            </Table>
                            <ListBbm />
                        </div>
                    </ModalBody>
                    <div className="modalFoot ml-3">
                        <div className="btnFoot">
                            <Button className="mr-2" color="info"  onClick={() => this.prosesModalFpd()}>FPD</Button>
                            <Button className="mr-2" color="warning"  onClick={() => this.openModalFaa()}>FAA</Button>
                            <Button className="mr-2" color="primary"  onClick={() => this.openDocCon()}>Dokumen</Button>
                            {detailOps.length > 0 && detailOps[0].status_transaksi === 8 && (
                                <Button color="success"  onClick={() => this.prosesModalBukti()}>Bukti Bayar</Button>
                            )}
                        </div>
                        <div className="btnFoot">
                            {filter === 'available' || 
                            (detailOps[0] !== undefined && 
                            (detailOps[0].status_transaksi === 0 || 
                            detailOps[0].status_transaksi === 8)) ? null : (
                                <Button className='mr-2' color="warning"  onClick={() => this.prosesStatEmail(detailOps)}>Status Email</Button>
                            )}
                            {this.state.filter !== 'available' && this.state.filter !== 'revisi' ? (
                                <>
                                    {(filter === 'bayar' || filter === 'completed') && level === '5' && (
                                        <Button className="mr-2"  color="danger" onClick={this.openNilaiVerif}>
                                            Input Nilai Diterima
                                        </Button>
                                    )}
                                    {/* <Button className='' onClick={() => this.prosesJurnalArea(detailOps[0])} color='success'>Jurnal</Button> */}
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
                        <div ref={this.callRef} style={{height: 'auto'}}>
                            <FPD 
                                totalfpd={this.state.totalfpd} 
                                // ref={el => (this.componentRef = el)}
                            />
                        </div>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            {/* <Pdfprint targetRef={this.callRef} filename="document.pdf" options={options}>
                                {({ toPdf }) => (
                                    // <button onClick={toPdf} className="button">
                                    //     Download
                                    // </button>
                                    <Button className="mr-2" color="warning" onClick={toPdf}>
                                        Download
                                    </Button>
                                )}
                            </Pdfprint> */}
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
                                <div className='mb-2 mt-3 titStatus'>Pilih alasan :</div>
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
                                {dataMenu.length > 0 && dataMenu.filter(item => item.name === 'Revisi Area').map(item => {
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
                <Modal isOpen={
                    this.props.ops.isLoading || 
                    this.props.menu.isLoading ||
                    this.props.reason.isLoading || 
                    this.props.email.isLoading || 
                    this.props.dokumen.isLoading ||
                    this.props.depo.isLoading || 
                    this.props.kliring.isLoading || 
                    this.props.taxcode.isLoading || 
                    this.props.user.isLoading || 
                    this.props.tarif.isLoading 
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
                    ) : this.state.confirm === 'inputVerif' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update Nilai Yang Diterima</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'resmail' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Kirim Email</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failappdoc' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                                <div className={[style.sucUpdate, style.green]}>Dokumen yang telah tereject tidak bisa diapprove</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failrejdoc' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                                <div className={[style.sucUpdate, style.green]}>Dokumen yang telah terapprove tidak bisa direject</div>
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
                   Kelengkapan Dokumen {detailOps !== undefined && detailOps.length > 0 && detailOps[0].no_transaksi}
                </ModalHeader>
                <ModalBody>
                    <Container>
                        {dataDoc.length > 0 && (
                            <Row className="mt-3 mb-4">
                                <Col md={12} lg={12} className='mb-2' >
                                    <div className="btnDocIo mb-2 ml-4 rowCenter" >
                                        <Input 
                                            type='checkbox'
                                            className='checkSize'
                                            checked={dataZip.length === 0 ? false : dataZip.length === dataDoc.length ? true : false}
                                            onChange={() => dataZip.length > 0 ? this.unCheckDoc('all') : this.checkDoc('all')}
                                        />
                                        <text className='ml-2 fzDoc'>
                                            Ceklis All
                                        </text>
                                    </div>
                                </Col>
                            </Row>
                        )}

                        {dataDoc.length !== 0 && dataDoc.map(x => {
                            return (
                                x.path !== null &&
                                <Row className="mt-3 mb-4">
                                    {x.path !== null && (
                                        <Col md={12} lg={12} className='mb-2' >
                                            <div className="btnDocIo mb-2 ml-4 rowCenter" >
                                                <Input 
                                                    type='checkbox'
                                                    className='checkSize'
                                                    checked={dataZip.find(element => element === x.id) !== undefined ? true : false}
                                                    onChange={dataZip.find(element => element === x.id) === undefined ? () => this.checkDoc(x.id) : () => this.unCheckDoc(x.id)}
                                                />
                                                <text className='ml-2 fzDoc'>
                                                    {x.desc === null ? 'Lampiran' : x.desc}
                                                </text>
                                            </div>

                                            <div className='rowCenter'>
                                                {x.status !== null && x.status !== '1' && x.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                                x.status.split(',').reverse()[0].split(';')[1] === ` status approve` ? <AiOutlineCheck size={25} color="success" /> 
                                                : x.status !== null && x.status !== '1' && x.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                                x.status.split(',').reverse()[0].split(';')[1] === ` status reject` ?  <AiOutlineClose size={25} color="danger" /> 
                                                : (
                                                    <BsCircle size={25} />
                                                )}
                                                <button 
                                                className={`btnDocIo fzDoc ${x.status !== null && x.status !== '1' && x.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                                x.status.split(',').reverse()[0].split(';')[1] === ` status approve` ? 'blue'
                                                : x.status !== null && x.status !== '1' && x.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                                x.status.split(',').reverse()[0].split(';')[1] === ` status reject` ?  'red'
                                                : 'black'}`}
                                                onClick={() => this.showDokumen(x)} >
                                                    {x.history + `${x.status !== null && x.status !== '1' && x.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                                    x.status.split(',').reverse()[0].split(';')[1] === ` status approve` ? ' (APPROVED)' : 
                                                    x.status !== '1' && x.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                                    x.status.split(',').reverse()[0].split(';')[1] === ` status reject` ?  ' (REJECTED)' : ''}`
                                                    }
                                                </button>
                                            </div>
                                            
                                            <div className='mt-3 mb-3'>
                                                {this.state.filter === 'available' ? (
                                                    <div>
                                                        <Button 
                                                        color="success"
                                                        // disabled={x.status !== null && x.status !== '1' && x.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                                        // x.status.split(',').reverse()[0].split(';')[1] === ` status reject` ? true : false}
                                                        onClick={x.status !== null && x.status !== '1' && x.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                                                x.status.split(',').reverse()[0].split(';')[1] === ` status reject` 
                                                                ? () => this.cekFailDoc('approve') 
                                                                : () => {this.setState({idDoc: x.id}); this.approveDoc({type: 'direct', id: x.id})}}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button 
                                                        className='ml-1' 
                                                        color="danger" 
                                                        onClick={x.status !== null && x.status !== '1' && x.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                                                x.status.split(',').reverse()[0].split(';')[1] === ` status approve` 
                                                                ? () => this.cekFailDoc('reject') 
                                                                : () => {this.setState({idDoc: x.id}); this.openModalRejDoc()}}
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
                                            <div className='rowCenter borderGen'>
                                                <div id={`tool${x.id}`}>
                                                    {dataColl.find(e => e === x.id) !== undefined ? (
                                                        <div className='rowCenter'>
                                                            <MdKeyboardArrowRight size={45} className='selfStart' onClick={() => this.collDoc(x.id)} />
                                                            <text>{x.history === null ? 'Lampiran' : x.history}</text>
                                                        </div>
                                                    ) : (
                                                        <div className='rowCenter'>
                                                            <MdKeyboardArrowDown size={45} className='selfStart' onClick={() => this.collDoc(x.id)} />
                                                            <text>{x.history === null ? 'Lampiran' : x.history}</text>
                                                        </div>
                                                    )}
                                                </div>
                                                <UncontrolledTooltip
                                                    placement="top"
                                                    target={`tool${x.id}`}
                                                >
                                                        {dataColl.find(e => e === x.id) !== undefined ? `Expand` : `Collapse`}
                                                </UncontrolledTooltip>
                                            </div>
                                            <div className='colCenter borderGen'>
                                                {dataColl.find(e => e === x.id) === undefined ? (
                                                    <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${x.id}`} dataFile={x} />
                                                ) : (
                                                    <div></div>
                                                )}
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
                                    ) 
                                    // : (
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
                                    //     null
                                    // )
                                    }
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
                        <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} dataFile={this.state.fileName}/>
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        {this.state.filter === 'available' ? (
                            <div>
                                <Button 
                                color="success" 
                                // onClick={() => this.approveDoc({type: 'show', id: this.state.idDoc})}
                                onClick={fileName.status !== undefined && fileName.status !== null && fileName.status !== '1' && fileName.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                    fileName.status.split(',').reverse()[0].split(';')[1] === ` status reject` 
                                    ? () => this.cekFailDoc('approve') 
                                    : () => {this.setState({idDoc: fileName.id}); this.approveDoc({type: 'show', id: this.state.idDoc})}}
                                >   
                                    Approve
                                </Button>
                                <Button 
                                className='ml-1' 
                                color="danger" 
                                // onClick={() => this.openModalRejDoc()}
                                onClick={fileName.status !== undefined && fileName.status !== null && fileName.status !== '1' && fileName.status.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                    fileName.status.split(',').reverse()[0].split(';')[1] === ` status approve` 
                                    ? () => this.cekFailDoc('reject') 
                                    : () => this.openModalRejDoc()}
                                >
                                    Reject
                                </Button>
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
                                onClick={() => tipeEmail === 'reject' ? this.rejectOps(this.state.dataRej) : this.approveDataOps()}
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
                                <Button color="primary" onClick={() => this.approveDoc({type: 'show', id: this.state.idDoc})}>Ya</Button>
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
    user: state.user,
    notif: state.notif,
    ops: state.ops,
    menu: state.menu,
    reason: state.reason,
    dokumen: state.dokumen,
    email: state.email,
    depo: state.depo,
    tarif: state.tarif,
    kliring: state.kliring,
    taxcode: state.taxcode
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNameApprove: approve.getNameApprove,
    getDetailDepo: depo.getDetailDepo,
    getRole: user.getRole,
    getOps: ops.getOps,
    getDetail: ops.getDetail,
    getApproval: ops.getApproval,
    getDocOps: ops.getDocCart,
    approveOps: ops.approveOps,
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
    getDetailId: ops.getDetailId,
    updateNilaiVerif: ops.updateNilaiVerif,
    addNotif: notif.addNotif,
    getResmail: email.getResmail,
    getDocBayar: ops.getDocBayar,
    nextOps: ops.nextOps,
    getDepo: depo.getDepo,
    getTarif: tarif.getAllTarif,
    getKliring: kliring.getAllKliring,
    getTaxcode: taxcode.getAllTaxcode,
    getDetailUser: user.getDetailUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Ops)
