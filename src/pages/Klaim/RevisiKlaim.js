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
import bank from '../../redux/actions/bank'
import coa from '../../redux/actions/coa'
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
import Select from 'react-select'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import klaim from '../../redux/actions/klaim'
import finance from '../../redux/actions/finance'
import dokumen from '../../redux/actions/dokumen'
import Email from '../../components/Klaim/Email'
import email from '../../redux/actions/email'
import readXlsxFile from 'read-excel-file'
import ExcelJS from "exceljs"
import fs from "file-saver"
import NumberInput from '../../components/NumberInput'
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import ListOutlet from '../../components/Klaim/ListOutlet'
const {REACT_APP_BACKEND_URL} = process.env

const outletSchema = Yup.object().shape({
    nilai_ajuan: Yup.string().required("must be filled"),
    status_npwp: Yup.string().required('must be filled'),
    no_ktp: Yup.number(),
    no_npwp: Yup.number()
})

const klaimSchema = Yup.object().shape({
    keterangan: Yup.string().required("must be filled"),
    periode_awal: Yup.date().required("must be filled"),
    periode_akhir: Yup.date().required('must be filled'),
    // nilai_ajuan: Yup.string().required("must be filled"),
    // status_npwp: Yup.string().required('must be filled'),
    no_surkom: Yup.string().required("must be filled"),
    nama_program: Yup.string().required("must be filled"),
    dn_area: Yup.string().required("must be filled"),
    // no_ktp: Yup.number(),
    // no_npwp: Yup.number()
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});


class RevisiKlaim extends Component {
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
            options: [],
            bankList: [],
            no_coa: '',
            nama_coa: '',
            detail: {},
            bank: '',
            digit: 0,
            rekList: [],
            norek: '',
            tiperek: '',
            tujuan_tf: '',
            openDraft: false,
            message: '',
            subject: '',
            isLoading: false,
            dataDelete: '',
            dataOutlet: [],
            detOutlet: {},
            modalOutlet: false,
            modalAddOutlet: false,
            modalDelOutlet: false,
            detModOutlet: false,
            modUpOutlet: false,
            fileUpload: {},
            messUpload: [],
            duplikat: [],
            dataDel: {},
            typeOut: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    openOutlet = (val) => {
        this.setState({ modalOutlet: !this.state.modalOutlet })
    }

    openAddOutlet = (val) => {
        this.setState({ modalAddOutlet: !this.state.modalAddOutlet })
    }

    openDetOutlet = () => {
        this.setState({ detModOutlet: !this.state.detModOutlet })
    }

    openUpOutlet = (val) => {
        this.setState({ modUpOutlet: !this.state.modUpOutlet, fileUpload: '' })
    }

    onChangeHandler = e => {
        const { size, type } = e.target.files[0]
        if (size >= 5120000) {
            this.setState({ errMsg: "Maximum upload size 5 MB" })
            this.openConfirm()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel') {
            this.setState({ errMsg: 'Invalid file type. Only excel files are allowed.' })
            this.openConfirm()
        } else {
            this.setState({ fileUpload: e.target.files[0] })
        }
    }

    openKlaimOutlet = async () => {
        const token = localStorage.getItem("token")
        const { idKlaim } = this.props.klaim
        await this.props.getOutlet(token, idKlaim.id)
        const { klaimOutlet } = this.props.klaim
        this.setState({ dataOutlet: klaimOutlet })
        this.openOutlet()
    }

    downloadOutlet = () => {
        const { dataOutlet } = this.state

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data klaim')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }


        ws.columns = [
            { header: 'Nilai Ajuan', key: 'c1' },
            { header: 'Memiliki NPWP', key: 'c2' },
            { header: 'Nama NPWP', key: 'c3' },
            { header: 'No NPWP', key: 'c4' },
            { header: 'Nama KTP', key: 'c5' },
            { header: 'No KTP', key: 'c6' }
        ]

        dataOutlet.map((item, index) => {
            return (ws.addRow(
                {
                    c1: item.nilai_ajuan,
                    c2: item.status_npwp === 1 ? 'Ya' : 'Tidak',
                    c3: item.nama_npwp,
                    c4: item.no_npwp,
                    c5: item.nama_ktp,
                    c6: item.no_ktp
                }
            )
            )
        })

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
                `Data Outlet Klaim ${moment().format('DD MMMM YYYY')}.xlsx`
            )
        })
    }


    addDataOutlet = async (val) => {
        const { dataOutlet, modalEdit } = this.state
        const { idKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        const data = {
            nilai_ajuan: val.nilai_ajuan,
            status_npwp: val.status_npwp === 'Tidak' ? 0 : val.status_npwp === 'Ya' ? 1 : null,
            nama_npwp: val.status_npwp === 'Ya' ? val.nama_npwp : '',
            no_npwp: val.status_npwp === 'Ya' ? val.no_npwp : '',
            nama_ktp: val.status_npwp === 'Tidak' ? val.nama_ktp : '',
            no_ktp: val.status_npwp === 'Tidak' ? val.no_ktp : '',
        }
        if (dataOutlet.length > 0) {
            const cek = dataOutlet.find(({ no_ktp, no_npwp }) => (data.no_ktp !== '' && no_ktp === data.no_ktp) || (data.no_npwp !== '' && no_npwp === data.no_npwp))
            if (cek !== undefined) {
                this.setState({ confirm: 'rejAddOutlet' })
                this.openConfirm()
            } else {
                if (modalEdit === true) {
                    const send = {
                        id: idKlaim.id,
                        ...data
                    }
                    await this.props.addOutlet(token, send)
                    await this.props.getOutlet(token, idKlaim.id)
                    const { klaimOutlet } = this.props.klaim
                    this.setState({ dataOutlet: klaimOutlet })
                    await this.editCartKlaim(idKlaim)
                    this.setState({ confirm: 'sucAddOutlet' })
                    this.openConfirm()
                    this.openAddOutlet()
                } else {
                    dataOutlet.push(data)
                    this.setState({ dataOutlet: dataOutlet })
                    this.setState({ confirm: 'sucAddOutlet' })
                    this.openConfirm()
                    this.openAddOutlet()
                }
            }
        } else {
            if (modalEdit === true) {
                const send = {
                    id: idKlaim.id,
                    ...data
                }
                await this.props.addOutlet(token, send)
                await this.props.getOutlet(token, idKlaim.id)
                const { klaimOutlet } = this.props.klaim
                this.setState({ dataOutlet: klaimOutlet })
                await this.editCartKlaim(idKlaim)
                this.setState({ confirm: 'sucAddOutlet' })
                this.openConfirm()
                this.openAddOutlet()
            } else {
                dataOutlet.push(data)
                this.setState({ dataOutlet: dataOutlet })
                this.setState({ confirm: 'sucAddOutlet' })
                this.openConfirm()
                this.openAddOutlet()
            }
        }
    }

    editDataOutlet = async (val) => {
        const { dataOutlet, detOutlet, modalEdit } = this.state
        const { idKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        const data = {
            nilai_ajuan: val.nilai_ajuan,
            status_npwp: val.status_npwp === 'Tidak' ? 0 : val.status_npwp === 'Ya' ? 1 : null,
            nama_npwp: val.status_npwp === 'Ya' ? val.nama_npwp : '',
            no_npwp: val.status_npwp === 'Ya' ? val.no_npwp : '',
            nama_ktp: val.status_npwp === 'Tidak' ? val.nama_ktp : '',
            no_ktp: val.status_npwp === 'Tidak' ? val.no_ktp : '',
        }
        const dataUp = []
        if (dataOutlet.length > 0) {
            for (let i = 0; i < dataOutlet.length; i++) {
                const dataCek = JSON.stringify(dataOutlet[i])
                if (JSON.stringify(detOutlet) === dataCek) {
                    const cek = dataOutlet.find(({ no_ktp, no_npwp }) => (data.no_ktp !== '' && no_ktp === data.no_ktp && no_ktp !== detOutlet.no_ktp) || (data.no_npwp !== '' && no_npwp === data.no_npwp && no_npwp !== detOutlet.no_npwp))
                    if (cek !== undefined) {
                        console.log()
                    } else {
                        dataUp.push(data)
                    }
                } else {
                    dataUp.push(dataOutlet[i])
                }
            }
            if (dataUp.length === dataOutlet.length) {
                if (modalEdit === true) {
                    const send = {
                        id: idKlaim.id,
                        idOutlet: detOutlet.id,
                        ...data
                    }
                    await this.props.updateOutlet(token, send)
                    await this.props.getOutlet(token, idKlaim.id)
                    const { klaimOutlet } = this.props.klaim
                    this.setState({ dataOutlet: klaimOutlet })
                    await this.editCartKlaim(idKlaim)
                    this.setState({ confirm: 'editOutlet' })
                    this.openConfirm()
                    this.openDetOutlet()
                } else {
                    this.setState({ dataOutlet: dataUp })
                    this.setState({ confirm: 'editOutlet' })
                    this.openConfirm()
                    this.openDetOutlet()
                }
            } else {
                this.setState({ confirm: 'rejEditOutlet' })
                this.openConfirm()
            }
        }
    }

    delDataOutlet = async () => {
        const { dataOutlet, dataDel, modalEdit } = this.state
        const { idKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        const data = []
        for (let i = 0; i < dataOutlet.length; i++) {
            const dataCek = JSON.stringify(dataOutlet[i])
            if (JSON.stringify(dataDel) === dataCek) {
                if (modalEdit === true && dataDel.id !== undefined) {
                    await this.props.deleteOutlet(token, dataDel.id)
                } else {
                    console.log('delete')
                }
            } else {
                data.push(dataOutlet[i])
            }
        }
        if (modalEdit === true && dataDel.id !== undefined) {
            this.confirmDel()
            this.setState({ dataOutlet: data })
            this.setState({ typeOut: 'delout' })
            await this.editCartKlaim(idKlaim)
            this.setState({ confirm: 'delOutlet' })
            this.openConfirm()
        } else {
            this.confirmDel()
            this.setState({ dataOutlet: data })
            this.setState({ confirm: 'delOutlet' })
            this.openConfirm()
        }
    }

    confirmDel = () => {
        this.setState({ modalDelOutlet: !this.state.modalDelOutlet })
    }

    setDetOutlet = (val) => {
        const { dataOutlet } = this.state
        const data = {
            nilai_ajuan: val.nilai_ajuan,
            status_npwp: val.status_npwp,
            nama_npwp: val.nama_npwp,
            no_npwp: val.no_npwp,
            nama_ktp: val.nama_ktp,
            no_ktp: val.no_ktp
        }
        dataOutlet.push(data)
        this.setState({ dataOutlet: dataOutlet })
    }

    uploadDataOutlet = async (val) => {
        const { dataOutlet, fileUpload, modalEdit } = this.state
        const { idKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        const dataTemp = []
        const rows = await readXlsxFile(fileUpload)
        const dataCek = []
        const count = []
        const parcek = [
            'Nilai Ajuan',
            'Memiliki NPWP',
            'Nama NPWP',
            'No NPWP',
            'Nama KTP',
            'No KTP'
        ]
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
                const dataKlaim = rows[i]
                const noid = dataKlaim[1] === 'Tidak' ? dataKlaim[5] : dataKlaim[1] === 'Ya' ? dataKlaim[3] : i
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
                this.openUpOutlet()
                this.setState({ confirm: 'dupUpload', duplikat: result })
                this.openConfirm()
            } else {
                for (let i = 0; i < rows.length; i++) {
                    const dataKlaim = rows[i]
                    const data = {
                        nilai_ajuan: dataKlaim[0],
                        status_npwp: dataKlaim[1] === 'Tidak' ? 0 : dataKlaim[1] === 'Ya' ? 1 : null,
                        nama_npwp: dataKlaim[1] === 'Ya' ? dataKlaim[2] : '',
                        no_npwp: dataKlaim[1] === 'Ya' ? dataKlaim[3] : '',
                        nama_ktp: dataKlaim[1] === 'Tidak' ? dataKlaim[4] : '',
                        no_ktp: dataKlaim[1] === 'Tidak' ? dataKlaim[5] : ''
                    }

                    const nominal = dataKlaim[0]
                    const statId = dataKlaim[1]
                    const noid = dataKlaim[1] === 'Tidak' ? dataKlaim[5] : dataKlaim[1] === 'Ya' ? dataKlaim[3] : ''
                    const nameid = dataKlaim[1] === 'Tidak' ? dataKlaim[4] : dataKlaim[1] === 'Ya' ? dataKlaim[2] : ''
                    const cekno = dataKlaim[1] === 'Tidak' ? 16 : dataKlaim[1] === 'Ya' ? 15 : 100
                    const parno = dataKlaim[1] === 'Tidak' ? 'No KTP' : dataKlaim[1] === 'Ya' ? 'No NPWP' : ''
                    const parname = dataKlaim[1] === 'Tidak' ? 'Nama KTP' : dataKlaim[1] === 'Ya' ? 'Nama NPWP' : ''


                    const dataNominal = nominal === null || (nominal.toString().split('').filter((item) => isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Nominal Diisi dengan Sesuai' }
                        : null
                    const dataStat = statId !== 'Ya' && statId !== 'Tidak'
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Status NPWP Diisi dengan Sesuai' }
                        : null
                    const dataNo = noid === null || (noid.toString().length !== cekno ||
                        (noid.toString().split('').filter((item) => isNaN(parseFloat(item))).length > 0)) || noid === ''
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: `Pastikan ${parno} Diisi dengan Sesuai` }
                        : null
                    const dataName = nameid === null || nameid === '' || nameid.length === 0
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: `Pastikan ${parname} Diisi dengan Sesuai` }
                        : null

                    if (dataStat !== null || dataNo !== null || dataNominal !== null || dataName !== null) {
                        const mesTemp = [dataStat, dataNo, dataNominal, dataName]
                        dataCek.push(mesTemp)
                    } else {
                        const cek = dataOutlet.find(({ no_ktp, no_npwp }) => (data.no_ktp !== '' && no_ktp === data.no_ktp) || (data.no_npwp !== '' && no_npwp === data.no_npwp))
                        if (cek !== undefined) {
                            cek.nilai_ajuan = data.nilai_ajuan
                            cek.nama_npwp = data.nama_npwp
                            cek.no_ktp = data.no_ktp
                        } else {
                            dataTemp.push(data)
                        }
                    }

                }
                console.log(dataCek)
                console.log(dataTemp)
                if (dataCek.length > 0 || rows.length === 0) {
                    console.log('masuk failed king')

                    this.setState({ messUpload: dataCek })
                    this.openUpOutlet()
                    this.setState({ confirm: 'failUpload' })
                    this.openConfirm()
                } else {
                    console.log('masuk success king')
                    if (modalEdit === true) {
                        const comb = [...dataOutlet, ...dataTemp]
                        const send = {
                            id: idKlaim.id,
                            list: comb
                        }
                        await this.props.uploadOutlet(token, send)
                        await this.props.getOutlet(token, idKlaim.id)
                        const { klaimOutlet } = this.props.klaim
                        this.setState({ dataOutlet: klaimOutlet })
                        this.openUpOutlet()
                        await this.editCartKlaim(idKlaim)
                        this.setState({ confirm: 'upload' })
                        this.openConfirm()
                    } else {
                        const comb = [...dataOutlet, ...dataTemp]
                        this.setState({ dataOutlet: comb })
                        this.openUpOutlet()
                        this.setState({ confirm: 'upload' })
                        this.openConfirm()
                    }
                }
            }
        } else {
            this.openUpOutlet()
            this.setState({ confirm: 'falseUpload' })
            this.openConfirm()
        }
    }

    submitStock = async () => {
        const token = localStorage.getItem('token')
        await this.props.submitStock(token)
        this.getDataCart()
    }

    onChangeUpload = e => {
        const {size, type, name} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        const tipe = name.split('.')[name.split('.').length - 1]
        if (size >= 25000000) {
            this.setState({errMsg: "Maximum upload size 25 MB", confirm: 'maxUpload'})
            this.openConfirm()
        } else if (
            tipe !== 'rar' && tipe !== 'pdf' && tipe !== 'xls' && tipe !== 'xlsx' &&
            tipe !== 'jpg' && tipe !== 'png' && tipe !== 'zip' && tipe !== '7z' &&
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
            const { detailKlaim } = this.props.klaim
            const { detail } = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocKlaim(token, detailKlaim[0].no_transaksi, detail.id, data)
            // this.props.uploadDocKlaim(token, tempno, data)
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
            menu: listMenu.toString()
        }
        await this.props.rejectKlaim(token, data)
        this.getDataKlaim()
        this.setState({confirm: 'reject'})
        this.openConfirm()
        this.openModalReject()
        this.openModalRinci()
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

    checkSubmitRev = () => {
        const { detailKlaim } = this.props.klaim
        const temp = []
        detailKlaim.map(item => {
            return (
                item.isreject === 1 && temp.push(item)
            )
        })
        // if (temp.length > 0) {
        //     this.setState({confirm: 'rejSubmit'})
        //     this.openConfirm()
        // } else {
            this.openModalApprove()
        // }
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

    async componentDidMount() {
        // const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        await this.props.getCoa(token, 'klaim')
        await this.props.getBank(token)
        this.getDataKlaim()
    }

    componentDidUpdate() {
        const token = localStorage.getItem("token")
        const { isUpload, isApprove, isReject, isUploadOut,
            isUpdateOut, isAddOut, isDelOut } = this.props.klaim
        if (isApprove === false) {
            this.setState({confirm: 'rejApprove'})
            this.openConfirm()
            this.openModalApprove()
            this.openModalRinci()
            this.props.resetKlaim()
        } else if (isUpload === true) {
            const { detailKlaim } = this.props.klaim
            const tempno = {
                no: detailKlaim[0].no_transaksi,
                name: 'Draft Pengajuan Klaim'
            }
            this.props.getDocKlaim(token, tempno)
            this.props.resetKlaim()
        } else if (isReject === false) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
            this.openModalReject()
            this.openModalRinci()
            this.props.resetKlaim()
        } else if (isUploadOut === false) {
            this.setState({ confirm: 'falseUpload' })
            this.openConfirm()
            this.props.resetKlaim()
        } else if (isUpdateOut === false) {
            this.setState({ confirm: 'rejEditOutlet' })
            this.openConfirm()
            this.props.resetKlaim()
        } else if (isAddOut === false) {
            this.setState({ confirm: 'rejAddOutlet' })
            this.openConfirm()
            this.props.resetKlaim()
        } else if (isDelOut === false) {
            this.setState({ confirm: 'rejDelOutlet' })
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

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailId(token, val)
        await this.props.getFinRek(token)
        await this.props.getDetailFinance(token)
        await this.props.getOutlet(token, val)
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
        })

        this.selectCoa({ value: idKlaim.no_coa, label: idKlaim.nama_coa })
        this.selectTujuan(idKlaim.tujuan_tf)
        this.prepBank(idKlaim.bank_tujuan)

        const { klaimOutlet } = this.props.klaim
        this.setState({ dataOutlet: klaimOutlet })

        setTimeout(() => {
            this.setState({ isLoading: false })
            this.openModalEdit()
        }, 1000)
    }
    

    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    selectCoa = (e) => {
        this.setState({ no_coa: e.value, nama_coa: e.label })
    }

    selectBank = (e) => {
        this.setState({ bank: e.label, digit: e.value })
    }

    prepBank = (val) => {
        const { dataBank } = this.props.bank
        const data = dataBank.find(({ bank }) => bank === val)
        if (data === undefined) {
            this.setState()
        } else {
            this.setState({ bank: data.name, digit: data.digit })
        }
    }

    selectRek = (e) => {
        this.setState({ norek: e.label.split('~')[0], tiperek: e.value })
    }

    selectTujuan = (val) => {
        if (val === 'PMA') {
            this.setState({ tujuan_tf: val, bank: 'Bank Mandiri', digit: 13 })
        } else {
            this.setState({ tujuan_tf: val, bank: '', digit: 0 })
        }
    }

    getDataKlaim = async (value) => {
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        const menu = level === '5' ? 'Revisi Area' : level === '2' ? "Revisi Finance" : level === '3' && 'Revisi Klaim'
        await this.props.getKlaim(token, 'all', 1, menu, 'all', 'revisi')
        this.setState({limit: value === undefined ? 10 : value.limit})
        // this.changeFilter('available')
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
        await this.props.getDetail(token, tempno)
        await this.props.getApproval(token, tempno)
        this.openModalRinci()
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

    changeFilter = (val) => {
        const {dataKlaim, noDis} = this.props.klaim
        const newKlaim = []
        for (let i = 0; i < noDis.length; i++) {
            const index = dataKlaim.indexOf(dataKlaim.find(({no_transaksi}) => no_transaksi === noDis[i]))
            newKlaim.push(dataKlaim[index])
        }
        this.setState({filter: val, newKlaim: newKlaim})
    }

    prosesSubmitPre = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAssetAll(token, 1000, '', 1, 'asset')
        this.modalSubmitPre()
    }

    approveDataKlaim = async () => {
        const { detailKlaim } = this.props.klaim
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailKlaim[0].no_transaksi
        }
        await this.props.approveKlaim(token, tempno)
        this.getDataKlaim()
        this.setState({confirm: 'isApprove'})
        this.openConfirm()
        this.openModalApprove()
        this.openModalRinci()
    }

    prosesSubmitRevisi = async () => {
        const {detailKlaim} = this.props.klaim
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailKlaim[0].no_transaksi
        }
        await this.props.submitRevisi(token, tempno)
        this.dataSendEmail('approve')
    }

    dataSendEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { detailKlaim } = this.props.klaim
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
            no: detailKlaim[0].no_transaksi,
            tipe: 'klaim',
            menu: 'pengajuan klaim',
            proses: 'revisi',
            route: 'klaim'
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
        const token = localStorage.getItem("token")
        const app = detailKlaim[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'revisi'
        const tempno = {
            no: detailKlaim[0].no_transaksi,
            kode: detailKlaim[0].kode_plant,
            jenis: 'klaim',
            tipe: tipe,
            menu: 'Revisi Area (Klaim)'
        }
        await this.props.getDraftEmail(token, tempno)
        this.setState({tipeEmail: 'app'})
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    getMessage = (val) => {
        this.setState({message: val.message, subject: val.subject})
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem("token")
        if(e.key === 'Enter'){
            await this.props.getAssetAll(token, 10, e.target.value, 1)
        }
    }

    editCartKlaim = async (val) => {
        const token = localStorage.getItem("token")
        const {idKlaim} = this.props.klaim
        const { detFinance } = this.props.finance
        const { dataOutlet, typeOut } = this.state

        if (dataOutlet.length === 0 && typeOut !== 'delout') {
            this.setState({ confirm: 'nullOutlet' })
            this.openConfirm()
        } else {
            const data = {
                no_coa: this.state.no_coa,
                keterangan: val.keterangan,
                periode_awal: val.periode_awal,
                periode_akhir: val.periode_akhir,
                nilai_ajuan: dataOutlet.length > 0 ? dataOutlet.reduce((accumulator, object) => {
                    return accumulator + parseFloat(object.nilai_ajuan);
                }, 0) : 0,
                bank_tujuan: this.state.bank,
                norek_ajuan: this.state.tujuan_tf === "PMA" ? this.state.norek : val.norek_ajuan,
                nama_tujuan: this.state.tujuan_tf === 'PMA' ? `PMA-${detFinance.area}` : val.nama_tujuan,
                tujuan_tf: this.state.tujuan_tf,
                tiperek: this.state.tiperek,
                // status_npwp: val.status_npwp === 'Tidak' ? 0 : val.status_npwp === 'Ya' ? 1 : null,
                // nama_npwp: val.status_npwp === 'Ya' ? val.nama_npwp : '',
                // no_npwp: val.status_npwp === 'Ya' ? val.no_npwp : '',
                // nama_ktp: val.status_npwp === 'Tidak' ? val.nama_ktp : '',
                // no_ktp: val.status_npwp === 'Tidak' ? val.no_ktp : '',
                periode: '',
                no_surkom: val.no_surkom,
                nama_program: val.nama_program,
                dn_area: val.dn_area
            }
            const tempno = {
                no: idKlaim.no_transaksi,
                id: idKlaim.id
            }
            await this.props.editKlaim(token, idKlaim.id, data)
            await this.props.appRevisi(token, tempno)
            await this.props.getDetail(token, tempno)
            this.openConfirm(this.setState({confirm: 'editcart'}))
            // this.openModalEdit()
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

    getAppKlaim = async (val) => {
        const token = localStorage.getItem("token")
        const tempno = {
            no: val.no_transaksi
        }
        await this.props.getApproval(token, tempno)
    }

    selectBank = (e) => {
        this.setState({bank: e.label, digit: e.value})
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
        this.setState({modalDoc: !this.state.modalDoc})
    }

    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
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

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataRinci, duplikat, dataOutlet, detOutlet, messUpload, listReason, dataMenu, listMenu} = this.state
        const { detFinance } = this.props.finance
        const { dataReason } = this.props.reason
        const { noDis, detailKlaim, ttdKlaim, newKlaim, dataDoc, idKlaim } = this.props.klaim
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
                                <div className={style.titleDashboard}>Revisi Klaim</div>
                            </div>
                            <div className={style.secEmail3}>
                            </div>
                            <div className={[style.secEmail4]}>
                                {/* <div className={style.searchEmail2}>
                                    <text>Filter:  </text>
                                    <Input className={style.filter} type="select" value={this.state.filter} onChange={e => this.changeFilter(e.target.value)}>
                                        <option value="all">All</option>
                                        <option value="reject">Reject</option>
                                        <option value="available">Available Approve</option>
                                        <option value="revisi">Available Reapprove (Revisi)</option>
                                    </Input>
                                </div> */}
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
                            {level === '5' ? (
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab} id="table-klaim">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>NO.AJUAN</th>
                                                <th>COST CENTRE</th>
                                                <th>AREA</th>
                                                <th>NO.COA</th>
                                                <th>NAMA COA</th>
                                                <th>KETERANGAN TAMBAHAN</th>
                                                <th>PERIODE</th>
                                                <th>STATUS</th>
                                                <th>ALASAN</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newKlaim.map(item => {
                                                return (
                                                    <tr>
                                                        <th>{newKlaim.indexOf(item) + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.cost_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{item.keterangan}</th>
                                                        <th>{moment(item.periode_awal).format('MMMM YYYY') === moment(item.periode_akhir).format('MMMM YYYY') ? moment(item.periode_awal).format('MMMM YYYY') : moment(item.periode_awal).format('MMMM YYYY') - moment(item.periode_akhir).format('MMMM YYYY')}</th>
                                                        <th>{item.status_reject !== null && item.status_reject !== 0 ? item.history.split(',').reverse()[0] : item.status_transaksi === 2 ? 'Proses Approval' : ''}</th>
                                                        <th>{item.reason}</th>
                                                        <th>
                                                            <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>Proses</Button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            ) : (
                                noDis.length === 0 ? (
                                    <div></div>
                                ) : (
                                    <div className={style.tableDashboard}>
                                        <Table bordered responsive hover className={style.tab} id="table-klaim">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>NO.AJUAN</th>
                                                    <th>COST CENTRE</th>
                                                    <th>AREA</th>
                                                    <th>NO.COA</th>
                                                    <th>NAMA COA</th>
                                                    <th>KETERANGAN TAMBAHAN</th>
                                                    <th>PERIODE</th>
                                                    <th>STATUS</th>
                                                    <th>ALASAN</th>
                                                    <th>OPSI</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newKlaim.map(item => {
                                                    return (
                                                        <tr>
                                                            <th>{newKlaim.indexOf(item) + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>{item.cost_center}</th>
                                                            <th>{item.area}</th>
                                                            <th>{item.no_coa}</th>
                                                            <th>{item.nama_coa}</th>
                                                            <th>{item.keterangan}</th>
                                                            <th>{moment(item.periode_awal).format('MMMM YYYY') === moment(item.periode_akhir).format('MMMM YYYY') ? moment(item.periode_awal).format('MMMM YYYY') : moment(item.periode_awal).format('MMMM YYYY') - moment(item.periode_akhir).format('MMMM YYYY')}</th>
                                                            <th>{item.status_reject !== null && item.status_reject !== 0 ? item.history.split(',').reverse()[0] : item.status_transaksi === 2 ? 'Proses Approval' : ''}</th>
                                                            <th>{item.reason}</th>
                                                            <th>
                                                                <Button size='sm' onClick={() => this.prosesDetail(item)} className='mb-1 mr-1' color='success'>Proses</Button>
                                                            </th>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                )
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
                <Modal isOpen={this.props.bank.isLoading
                    || this.props.coa.isLoading
                    || this.props.user.isLoading
                    || this.props.dokumen.isLoading
                    || this.props.notif.isLoading
                    || this.props.approve.isLoading
                    || this.props.finance.isLoading
                    || this.props.klaim.isLoading
                    || this.props.email.isLoading
                    || this.state.isLoading} size="sm">
                    <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
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
                                        <th>Status</th>
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
                                                <th>
                                                    {item.isreject === 1 || item.isreject === 0 ? 
                                                    <>
                                                        {item.isreject === 1 ? 'Perlu Diperbaiki' : 'Telah diperbaiki'}
                                                        <Button className='mt-2' color="info" size='sm' onClick={() => this.prosesOpenEdit(item.id)}>Update</Button>
                                                    </>
                                                    :'-'}
                                                </th>
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
                            {/* <Button className="mr-2" disabled={this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false} color="danger" onClick={this.prepareReject}>
                                Reject
                            </Button> */}
                            <Button color="success" disabled={this.state.filter !== 'available' ? true : false} onClick={this.checkSubmitRev}>
                                Submit Revisi
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
                            validationSchema = {klaimSchema}
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
                                                        value={{ value: this.state.no_coa, label: this.state.nama_coa }}
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
                                                    type="text"
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
                                                    type="text"
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
                                                    type="text"
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
                                                    type="text"
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
                                                    type="text"
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
                                                    type="text"
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
                                                        type="date"
                                                        className="inputRinci"
                                                        value={moment(values.periode_awal).format('YYYY-MM-DD')}
                                                        onBlur={handleBlur("periode_awal")}
                                                        onChange={handleChange("periode_awal")}
                                                    />
                                                    <text className='mr-1 ml-1'>To</text>
                                                    <Input
                                                        type="date"
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
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Yang Diajukan</Col>
                                                <Col md={9} className="colRinci">:  <NumberInput
                                                    value={dataOutlet.length > 0 ? dataOutlet.reduce((accumulator, object) => {
                                                        return accumulator + parseFloat(object.nilai_ajuan);
                                                    }, 0) : 0}
                                                    disabled
                                                    className="inputRinci1"
                                                    onValueChange={val => setFieldValue("nilai_ajuan", val.floatValue)}
                                                />
                                                </Col>
                                            </Row>
                                            {/* {errors.nilai_ajuan ? (
                                            <text className={style.txtError}>{errors.nilai_ajuan}</text>
                                        ) : null} */}
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
                                            {this.state.tujuan_tf === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
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
                                                            value={{ label: this.state.norek, value: this.state.tiperek }}
                                                        />
                                                    ) : (
                                                        <Input
                                                            type="text"
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
                                            {this.state.digit !== null && values.norek_ajuan.length !== this.state.digit && this.state.tujuan_tf !== 'PMA' ? (
                                                <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                            ) : this.state.digit === null && (values.norek_ajuan.length < 10 || values.norek_ajuan.length > 16) && this.state.tujuan_tf !== 'PMA' ? (
                                                <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                            ) : this.state.tujuan_tf === 'PMA' && this.state.norek.length !== this.state.digit ? (
                                                <text className={style.txtError}>must be filled with {this.state.digit} digits characters</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Atas Nama</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled={this.state.tujuan_tf === '' || this.state.tujuan_tf === 'PMA' ? true : false}
                                                    type="text"
                                                    className="inputRinci"
                                                    value={this.state.tujuan_tf === 'PMA' ? `PMA-${detFinance.area}` : values.nama_tujuan}
                                                    onBlur={handleBlur("nama_tujuan")}
                                                    onChange={handleChange("nama_tujuan")}
                                                />
                                                </Col>
                                            </Row>
                                            {values.nama_tujuan === '' && this.state.tujuan_tf !== 'PMA' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            {dataOutlet.length > 0 &&
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
                                            <div className='row justify-content-md-center mb-4'>
                                                <div className='mainRinci2' onClick={this.openKlaimOutlet}>
                                                    <CiCirclePlus size={70} className='mb-2 secondary' color='secondary' />
                                                    <div className='secondary'>Tambah Outlet</div>
                                                </div>
                                            </div>
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
                                    <div className="modalFoot mt-3">
                                        <div></div>
                                        <div className='btnfoot'>
                                            <Button 
                                                className="mr-3" 
                                                size="md" 
                                                disabled={this.state.no_coa === '' ? true 
                                                : values.status_npwp === 'Ya' && (values.nama_npwp === '' || values.no_npwp === '' ) ? true 
                                                : values.status_npwp === 'Tidak' && (values.nama_ktp === '' || values.no_ktp === '' ) ? true 
                                                : values.norek_ajuan.length < this.state.digit ? true 
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
                <Modal size="xl" toggle={this.openOutlet} isOpen={this.state.modalOutlet}>
                    <ModalHeader>
                        List Outlet
                    </ModalHeader>
                    <ModalBody>
                        <div className='rowCenter mb-3'>
                            <Button color="success" size="lg" className="mr-2" onClick={this.openAddOutlet} >Add</Button>
                            <Button color="primary" size="lg" className="mr-2" onClick={this.openUpOutlet} >Upload</Button>
                            <Button color="warning" size="lg" className="mr-2" onClick={this.downloadOutlet} >Download</Button>
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
                                    <th>Action</th>
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
                                            <td>
                                                {/* {this.state.modalEdit === true ? (
                                                <Button color="danger" className="mr-4" onClick={() => this.confirmDel(this.setState({dataDel: item}))}>Delete</Button>
                                            ) : (
                                            <> */}
                                                <Button color="danger" className="mr-2" onClick={() => this.confirmDel(this.setState({ dataDel: item }))}>Delete</Button>
                                                <Button color="info" onClick={() => this.openDetOutlet(this.setState({ detOutlet: item }))}>Update</Button>
                                                {/* </>
                                            )} */}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalAddOutlet} size="lg">
                    <ModalHeader>Add Data Outlet</ModalHeader>
                    <Formik
                        initialValues={{
                            nilai_ajuan: 0,
                            status_npwp: "",
                            nama_npwp: "",
                            nama_ktp: "",
                            no_ktp: "",
                            no_npwp: ""
                        }}
                        validationSchema={outletSchema}
                        onSubmit={(values) => { this.addDataOutlet(values) }}
                    >
                        {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                            <ModalBody>
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
                                    <Col md={3}>Memiliki NPWP</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        disabled={level === '5' || level === '6' ? false : true}
                                        type="select"
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
                                        type="text"
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
                                        type="text"
                                        minLength={15}
                                        maxLength={15}
                                        className="inputRinci"
                                        value={values.status_npwp === 'Ya' ? values.no_npwp : ''}
                                        onBlur={handleBlur("no_npwp")}
                                        onChange={handleChange("no_npwp")}
                                    />
                                    </Col>
                                </Row>
                                {values.status_npwp === 'Ya' && values.no_npwp.length !== 15 ? (
                                    <text className={style.txtError}>must be filled with 15 digits characters</text>
                                ) : values.status_npwp === 'Ya' && errors.no_npwp ? (
                                    <text className={style.txtError}>{errors.no_npwp}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Nama Sesuai KTP</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        disabled={values.status_npwp === 'Tidak' ? false : true}
                                        type="text"
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
                                        type="text"
                                        className="inputRinci"
                                        minLength={16}
                                        maxLength={16}
                                        value={values.status_npwp === 'Tidak' ? values.no_ktp : ''}
                                        onBlur={handleBlur("no_ktp")}
                                        onChange={handleChange("no_ktp")}
                                    />
                                    </Col>
                                </Row>
                                {values.status_npwp === 'Tidak' && values.no_ktp.length !== 16 ? (
                                    <text className={style.txtError}>must be filled with 16 digits characters</text>
                                ) : values.status_npwp === 'Tidak' && errors.no_ktp ? (
                                    <text className={style.txtError}>{errors.no_ktp}</text>
                                ) : null}
                                <hr />
                                <div className={style.foot}>
                                    <div></div>
                                    <div>
                                        <Button
                                            className="mr-2"
                                            onClick={handleSubmit} color="primary"
                                            disabled={
                                                values.status_npwp === 'Ya' && (values.nama_npwp === '' || values.no_npwp.length !== 15 || errors.no_npwp) ? true
                                                    : values.status_npwp === 'Tidak' && (values.nama_ktp === '' || values.no_ktp.length !== 16 || errors.no_ktp) ? true
                                                        : false}
                                        >Save</Button>
                                        <Button className="" onClick={this.openAddOutlet}>Cancel</Button>
                                    </div>
                                </div>
                            </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.detModOutlet} size="lg">
                    <ModalHeader>Update Data Outlet</ModalHeader>
                    <Formik
                        initialValues={{
                            nilai_ajuan: detOutlet.nilai_ajuan,
                            status_npwp: detOutlet.status_npwp === 1 ? 'Ya' : 'Tidak',
                            nama_npwp: detOutlet.nama_npwp,
                            nama_ktp: detOutlet.nama_ktp,
                            no_ktp: detOutlet.no_ktp,
                            no_npwp: detOutlet.no_npwp
                        }}
                        validationSchema={outletSchema}
                        onSubmit={(values) => { this.editDataOutlet(values) }}
                    >
                        {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                            <ModalBody>
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
                                    <Col md={3}>Memiliki NPWP</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        disabled={level === '5' || level === '6' ? false : true}
                                        type="select"
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
                                        type="text"
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
                                        type="text"
                                        minLength={15}
                                        maxLength={15}
                                        className="inputRinci"
                                        value={values.status_npwp === 'Ya' ? values.no_npwp : ''}
                                        onBlur={handleBlur("no_npwp")}
                                        onChange={handleChange("no_npwp")}
                                    />
                                    </Col>
                                </Row>
                                {values.status_npwp === 'Ya' && values.no_npwp.length !== 15 ? (
                                    <text className={style.txtError}>must be filled with 15 digits characters</text>
                                ) : values.status_npwp === 'Ya' && errors.no_npwp ? (
                                    <text className={style.txtError}>{errors.no_npwp}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Nama Sesuai KTP</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        disabled={values.status_npwp === 'Tidak' ? false : true}
                                        type="text"
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
                                        type="text"
                                        className="inputRinci"
                                        minLength={16}
                                        maxLength={16}
                                        value={values.status_npwp === 'Tidak' ? values.no_ktp : ''}
                                        onBlur={handleBlur("no_ktp")}
                                        onChange={handleChange("no_ktp")}
                                    />
                                    </Col>
                                </Row>
                                {values.status_npwp === 'Tidak' && values.no_ktp.length !== 16 ? (
                                    <text className={style.txtError}>must be filled with 16 digits characters</text>
                                ) : values.status_npwp === 'Tidak' && errors.no_ktp ? (
                                    <text className={style.txtError}>{errors.no_ktp}</text>
                                ) : null}
                                <hr />
                                <div className={style.foot}>
                                    <div></div>
                                    <div>
                                        <Button
                                            className="mr-2"
                                            onClick={handleSubmit} color="primary"
                                            disabled={
                                                values.status_npwp === 'Ya' && (values.nama_npwp === '' || values.no_npwp.length !== 15 || errors.no_npwp) ? true
                                                    : values.status_npwp === 'Tidak' && (values.nama_ktp === '' || values.no_ktp.length !== 16 || errors.no_ktp) ? true
                                                        : false}
                                        >Save</Button>
                                        <Button className="" onClick={this.openDetOutlet}>Cancel</Button>
                                    </div>
                                </div>
                            </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.modUpOutlet} >
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
                            <Button className='mr-2' color="primary" disabled={this.state.fileUpload === "" ? true : false} onClick={this.uploadDataOutlet}>Upload</Button>
                            <Button onClick={this.openUpOutlet}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalDelOutlet} toggle={this.confirmDel} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk delete outlet ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.delDataOutlet()}>Ya</Button>
                                <Button color="secondary" onClick={this.confirmDel}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
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
                <Modal isOpen={this.state.openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectKlaim(values)}}
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
                                    <Button color="primary" disabled={(values.alasan === '.' || values.alasan === '') && listReason.length === 0 ? true : false} onClick={handleSubmit}>Submit</Button>
                                    <Button className='ml-2' color="secondary" onClick={this.openModalReject}>Close</Button>
                                </div>
                            </div>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApprove} toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk submit revisi     
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
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
                    ) : this.state.confirm === 'rejSubmit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal submit revisi, pastikan semua data reject telah diupdate</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'isApprove' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'editcart' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menyimpan Perubahan Data</div>
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
                    ): this.state.confirm === 'submit' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit Revisi</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'sucAddOutlet' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menambahkan Outlet</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'editOutlet' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Mengupdate Outlet</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'delOutlet' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Mendelete Outlet</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejAddOutlet' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Outlet</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>No NPWP atau No KTP telah terdaftar </div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejEditOutlet' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Mengupdate Outlet</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>No NPWP atau No KTP telah terdaftar </div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejDelOutlet' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Mendelete Outlet</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Server sedang ada masalah</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'upload' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Upload Data Outlet</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'nullOutlet' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Menyimpan Data</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Pastikan Data Outlet telah diisi</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failUpload' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green, style.mb4]}>Gagal Upload</div>

                                {messUpload.length > 0 ? messUpload.map(item => {
                                    return (
                                        item.map(x => {
                                            return (
                                                x !== null &&
                                                <div className={[style.sucUpdate, style.green, style.mb3]}>{`${x.mess} Pada ${x.no_transaksi}`}</div>
                                            )
                                        })
                                    )
                                }) : (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    ) : this.state.confirm === 'dupUpload' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green, style.mb4]}>Gagal Upload</div>
                                <div className={[style.sucUpdate, style.green, style.mb4]}>Terdapat Duplikasi pada no identitas berikut</div>
                                {duplikat.length > 0 ? duplikat.map(item => {
                                    return (
                                        <div className={[style.sucUpdate, style.green, style.mb3]}>{item}</div>
                                    )
                                }) : (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    ) : this.state.confirm === 'failSubChek' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className={[style.sucUpdate, style.green]}>Input Data Klaim Terlebih Dahulu dan Pastikan Data Outlet Telah Ditambahkan</div>
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
                                            {level === '5' && (
                                                <div className="colDoc">
                                                    <input
                                                    type="file"
                                                    className='ml-4'
                                                    onClick={() => this.setState({detail: x})}
                                                    onChange={this.onChangeUpload}
                                                    />
                                                    <text className="txtError ml-4">Maximum file upload is 25 Mb</text>
                                                </div>
                                            )}
                                            
                                        </Col>
                                    ) : (
                                        <Col md={12} lg={12} className="colDoc">
                                            <text className="btnDocIo" >{x.desc}</text>
                                            {level === '5' && (
                                                <>
                                                    <div className="colDoc">
                                                        <input
                                                        type="file"
                                                        onClick={() => this.setState({detail: x})}
                                                        onChange={this.onChangeUpload}
                                                        />
                                                    </div>
                                                    <text className="txtError">Maximum file upload is 25 Mb</text>
                                                </>
                                            )}
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
                                onClick={() => this.prosesSubmitRevisi()}
                                color="primary"
                            >
                                Submit & Send Email
                            </Button>
                            <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
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
    klaim: state.klaim,
    menu: state.menu,
    reason: state.reason,
    bank: state.bank,
    dokumen: state.dokumen,
    email: state.email,
    finance: state.finance,
    notif: state.notif,
    coa: state.coa,
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNameApprove: approve.getNameApprove,
    getDetailFinance: finance.getDetailFinance,
    getDepo: depo.getDepo,
    getCoa: coa.getCoa,
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
    uploadDocKlaim: klaim.UploadDocCart,
    editKlaim: klaim.editKlaim,
    appRevisi: klaim.appRevisi,
    getBank: bank.getBank,
    submitRevisi: klaim.submitRevisi,
    showDokumen: dokumen.showDokumen,
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    addNotif: notif.addNotif,
    uploadOutlet: klaim.uploadOutlet,
    updateOutlet: klaim.updateOutlet,
    addOutlet: klaim.addOutlet,
    getOutlet: klaim.getOutlet,
    deleteOutlet: klaim.deleteOutlet,
    getDetailId: klaim.getDetailId,
    getFinRek: finance.getFinRek,
}

export default connect(mapStateToProps, mapDispatchToProps)(RevisiKlaim)
