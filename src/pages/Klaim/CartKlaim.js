/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { VscAccount } from 'react-icons/vsc'
import {
    Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter
} from 'reactstrap'
import approve from '../../redux/actions/approve'
import coa from '../../redux/actions/coa'
import { BsCircle } from 'react-icons/bs'
import { FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList } from 'react-icons/fa'
import Sidebar from "../../components/Header";
import { AiOutlineFileExcel, AiOutlineCheck, AiOutlineClose, AiFillCheckCircle } from 'react-icons/ai'
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import style from '../../assets/css/input.module.css'
import placeholder from "../../assets/img/placeholder.png"
import user from '../../redux/actions/user'
import klaim from '../../redux/actions/klaim'
import bank from '../../redux/actions/bank'
import finance from '../../redux/actions/finance'
import { connect } from 'react-redux'
import moment from 'moment'
import { Formik } from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import Select from 'react-select'
import notif from '../../redux/actions/notif'
import Pdf from "../../components/Pdf"
import depo from '../../redux/actions/depo'
import { default as axios } from 'axios'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import dokumen from '../../redux/actions/dokumen'
import email from '../../redux/actions/email'
import Email from '../../components/Klaim/Email'
import NumberInput from '../../components/NumberInput'
import Countdown from 'react-countdown'
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import readXlsxFile from 'read-excel-file'
import ExcelJS from "exceljs"
import fs from "file-saver"
import { MdUpload, MdDownload, MdEditSquare, MdAddCircle, MdDelete } from "react-icons/md";
const { REACT_APP_BACKEND_URL } = process.env

const klaimSchema = Yup.object().shape({
    keterangan: Yup.string().required("must be filled"),
    periode_awal: Yup.date().required("must be filled"),
    periode_akhir: Yup.date().required('must be filled'),
    // nilai_ajuan: Yup.string().required("must be filled"),
    // status_npwp: Yup.string().required('must be filled'),
    no_surkom: Yup.string().required("must be filled"),
    nama_program: Yup.string().required("must be filled"),
    dn_area: Yup.string().required("must be filled"),
    no_faktur: Yup.number()
    // no_ktp: Yup.number(),
    // no_npwp: Yup.number()
})

const outletSchema = Yup.object().shape({
    nilai_ajuan: Yup.string().required("must be filled"),
    status_npwp: Yup.string().required('must be filled'),
    no_ktp: Yup.number(),
    no_npwp: Yup.number(),
    keterangan: Yup.string()
})

const fakturklSchema = Yup.object().shape({
    no_faktur: Yup.number().required(),
    date_faktur: Yup.date().required('must be filled'),
    value: Yup.number().required(),
    keterangan: Yup.string()
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
            dataDelete: '',
            dataOutlet: [],
            detOutlet: {},
            modalOutlet: false,
            modalAddOutlet: false,
            modalDelOutlet: false,
            detModOutlet: false,
            modUpOutlet: false,
            dataFakturKl: [],
            detFakturKl: {},
            modalFakturKl: false,
            modalAddFakturKl: false,
            modalDelFakturKl: false,
            detModFakturKl: false,
            modUpFakturKl: false,
            fileUpload: {},
            messUpload: [],
            duplikat: [],
            dataDel: {},
            typeOut: '',
            nilai_ajuan: 0,
            infoError: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    onEnterVal = (val) => {
        this.setState({nilai_ajuan: val})
    }

    openConfirm = (val) => {
        if (val === false) {
            this.setState({ modalConfirm: false })
        } else {
            this.setState({ modalConfirm: true })
            // setTimeout(() => {
            //     this.setState({modalConfirm: false})
            //  }, 3000)
        }
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
            { header: 'No KTP', key: 'c6' },
            { header: 'Keterangan', key: 'c7' }
        ]

        dataOutlet.map((item, index) => {
            return (ws.addRow(
                {
                    c1: item.nilai_ajuan,
                    c2: item.status_npwp === 1 ? 'Ya' : 'Tidak',
                    c3: item.nama_npwp,
                    c4: item.no_npwp,
                    c5: item.nama_ktp,
                    c6: item.no_ktp,
                    c7: item.keterangan
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
            keterangan: val.keterangan
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
                    this.openOutlet()
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
                this.openOutlet()
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
            keterangan: val.keterangan
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
            no_ktp: val.no_ktp,
            keterangan: val.keterangan
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
            'No KTP',
            'Keterangan'
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
                        no_ktp: dataKlaim[1] === 'Tidak' ? dataKlaim[5] : '',
                        keterangan: dataKlaim[6]
                    }

                    const nominal = dataKlaim[0]
                    const statId = dataKlaim[1]
                    const noid = dataKlaim[1] === 'Tidak' ? dataKlaim[5] : dataKlaim[1] === 'Ya' ? dataKlaim[3] : ''
                    const nameid = dataKlaim[1] === 'Tidak' ? dataKlaim[4] : dataKlaim[1] === 'Ya' ? dataKlaim[2] : ''
                    const cekno = dataKlaim[1] === 'Tidak' ? 16 : dataKlaim[1] === 'Ya' ? 16 : 100
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

    rendererTime = ({ hours, minutes, seconds, completed }) => {
        return <span>{seconds}</span>
    }

    submitStock = async () => {
        const token = localStorage.getItem('token')
        await this.props.submitStock(token)
        this.getDataCart()
    }

    setError = (val) => {
        this.setState({infoError: val, confirm: 'errfill'})
        setTimeout(() => {
            this.openConfirm()
        }, 100)
    }

    onChangeUpload = e => {
        const {size, type, name} = e.target.files[0]
        this.setState({ fileUpload: e.target.files[0] })
        const tipe = name.split('.')[name.split('.').length - 1]
        if (size >= 25000000) {
            this.setState({ errMsg: "Maximum upload size 25 MB", confirm: 'maxUpload' })
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

    openAddFakturKl = (val) => {
        this.setState({ modalAddFakturKl: !this.state.modalAddFakturKl })
    }

    openDetFakturKl = () => {
        this.setState({ detModFakturKl: !this.state.detModFakturKl })
    }

    openUpFakturKl = (val) => {
        this.setState({ modUpFakturKl: !this.state.modUpFakturKl, fileUpload: '' })
    }

    openKlaimFakturKl = async () => {
        const token = localStorage.getItem("token")
        const { idKlaim } = this.props.klaim
        await this.props.getFakturKl(token, idKlaim.id)
        const { klaimFaktur } = this.props.klaim
        this.setState({ dataFakturKl: klaimFaktur })
        this.openFakturKl()
    }

    downloadFakturKl = () => {
        const { dataFakturKl } = this.state

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
            { header: 'No Faktur', key: 'c1' },
            { header: 'Tgl Faktur', key: 'c2' },
            { header: 'Value', key: 'c3' },
            { header: 'Keterangan', key: 'c4' }
        ]

        dataFakturKl.map((item, index) => {
            return (ws.addRow(
                {
                    c1: item.no_faktur,
                    c2: item.date_faktur,
                    c3: item.val,
                    c4: item.keterangan,
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
                `Data Faktur Klaim ${moment().format('DD MMMM YYYY')}.xlsx`
            )
        })
    }


    addDataFakturKl = async (val) => {
        const { dataFakturKl, modalEdit } = this.state
        const { idKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        const data = {
            no_faktur: val.no_faktur,
            date_faktur: val.date_faktur,
            val: val.value,
            keterangan: val.keterangan
        }
        if (dataFakturKl.length > 0) {
            const cek = dataFakturKl.find((item) => (data.no_faktur !== '' && item.no_faktur.toString() === data.no_faktur.toString()))
            if (cek !== undefined) {
                this.setState({ confirm: 'rejAddFakturKl' })
                this.openConfirm()
            } else {
                if (modalEdit === true) {
                    const send = {
                        id: idKlaim.id,
                        ...data
                    }
                    await this.props.addFakturKl(token, send)
                    await this.props.getFakturKl(token, idKlaim.id)
                    const { klaimFaktur } = this.props.klaim
                    this.setState({ dataFakturKl: klaimFaktur })
                    await this.editCartKlaim(idKlaim)
                    this.setState({ confirm: 'sucAddFakturKl' })
                    this.openConfirm()
                    this.openAddFakturKl()
                } else {
                    dataFakturKl.push(data)
                    this.setState({ dataFakturKl: dataFakturKl })
                    this.setState({ confirm: 'sucAddFakturKl' })
                    this.openConfirm()
                    this.openAddFakturKl()
                }
            }
        } else {
            if (modalEdit === true) {
                const send = {
                    id: idKlaim.id,
                    ...data
                }
                await this.props.addFakturKl(token, send)
                await this.props.getFakturKl(token, idKlaim.id)
                const { klaimFaktur } = this.props.klaim
                this.setState({ dataFakturKl: klaimFaktur })
                await this.editCartKlaim(idKlaim)
                this.setState({ confirm: 'sucAddFakturKl' })
                this.openConfirm()
                this.openAddFakturKl()
            } else {
                dataFakturKl.push(data)
                this.setState({ dataFakturKl: dataFakturKl })
                this.setState({ confirm: 'sucAddFakturKl' })
                this.openConfirm()
                this.openAddFakturKl()
            }
        }
    }

    editDataFakturKl = async (val) => {
        const { dataFakturKl, detFakturKl, modalEdit } = this.state
        const { idKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        const data = {
            no_faktur: val.no_faktur,
            date_faktur: val.date_faktur,
            val: val.value,
            keterangan: val.keterangan
        }
        const dataUp = []
        if (dataFakturKl.length > 0) {
            for (let i = 0; i < dataFakturKl.length; i++) {
                const dataCek = JSON.stringify(dataFakturKl[i])
                if (JSON.stringify(detFakturKl) === dataCek) {
                    const cek = dataFakturKl.find((item) => (data.no_faktur !== '' && item.no_faktur.toString() === data.no_faktur.toString() && item.no_faktur.toString() !== detFakturKl.no_faktur.toString()))
                    if (cek !== undefined) {
                        console.log()
                    } else {
                        dataUp.push(data)
                    }
                } else {
                    dataUp.push(dataFakturKl[i])
                }
            }
            if (dataUp.length === dataFakturKl.length) {
                if (modalEdit === true) {
                    const send = {
                        id: idKlaim.id,
                        idFaktur: detFakturKl.id,
                        ...data
                    }
                    await this.props.updateFakturKl(token, send)
                    await this.props.getFakturKl(token, idKlaim.id)
                    const { klaimFaktur } = this.props.klaim
                    this.setState({ dataFakturKl: klaimFaktur })
                    await this.editCartKlaim(idKlaim)
                    this.setState({ confirm: 'editFakturKl' })
                    this.openConfirm()
                    this.openDetFakturKl()
                } else {
                    this.setState({ dataFakturKl: dataUp })
                    this.setState({ confirm: 'editFakturKl' })
                    this.openConfirm()
                    this.openDetFakturKl()
                }
            } else {
                this.setState({ confirm: 'rejEditFakturKl' })
                this.openConfirm()
            }
        }
    }

    delDataFakturKl = async () => {
        const { dataFakturKl, dataDel, modalEdit } = this.state
        const { idKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        const data = []
        for (let i = 0; i < dataFakturKl.length; i++) {
            const dataCek = JSON.stringify(dataFakturKl[i])
            if (JSON.stringify(dataDel) === dataCek) {
                if (modalEdit === true && dataDel.id !== undefined) {
                    await this.props.deleteFakturKl(token, dataDel.id)
                } else {
                    console.log('delete')
                }
            } else {
                data.push(dataFakturKl[i])
            }
        }
        if (modalEdit === true && dataDel.id !== undefined) {
            this.confirmDelFakturKl()
            this.setState({ dataFakturKl: data })
            this.setState({ typeOut: 'delout' })
            await this.editCartKlaim(idKlaim)
            this.setState({ confirm: 'delFakturKl' })
            this.openConfirm()
        } else {
            this.confirmDelFakturKl()
            this.setState({ dataFakturKl: data })
            this.setState({ confirm: 'delFakturKl' })
            this.openConfirm()
        }
    }

    confirmDelFakturKl = () => {
        this.setState({ modalDelFakturKl: !this.state.modalDelFakturKl })
    }

    setDetFakturKl = (val) => {
        const { dataFakturKl } = this.state
        const data = {
            no_faktur: val.no_faktur,
            date_faktur: val.date_faktur,
            val: val.value,
            keterangan: val.keterangan,
        }
        dataFakturKl.push(data)
        this.setState({ dataFakturKl: dataFakturKl })
    }

    uploadDataFakturKl = async (val) => {
        const { dataFakturKl, fileUpload, modalEdit } = this.state
        const { idKlaim } = this.props.klaim
        const token = localStorage.getItem('token')
        const dataTemp = []
        const rows = await readXlsxFile(fileUpload)
        const dataCek = []
        const count = []
        const parcek = [
            'No Faktur',
            'Tgl Faktur',
            'Value',
            'Keterangan'
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
                const noid = dataKlaim[0]
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
                this.openUpFakturKl()
                this.setState({ confirm: 'dupUploadFakturKl', duplikat: result })
                this.openConfirm()
            } else {
                for (let i = 0; i < rows.length; i++) {
                    const dataKlaim = rows[i]
                    console.log(moment(dataKlaim[1]).format('DD-MM-YYYY'))
                    const data = {
                        no_faktur: dataKlaim[0],
                        date_faktur: moment(dataKlaim[1]),
                        val: dataKlaim[2],
                        keterangan: dataKlaim[3]
                    }

                    const noFaktur = dataKlaim[0]
                    const dateFaktur = dataKlaim[1]
                    const value = dataKlaim[2]

                    const cekValue = value === null || (value.toString().split('').filter((item) => isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Value Diisi dengan Sesuai' }
                        : null
                    const cekFaktur = noFaktur === null || (noFaktur.toString().split('').filter((item) => isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan No Faktur Diisi dengan Sesuai' }
                        : null
                    const cekDate = dateFaktur === null || dateFaktur === '' || dateFaktur.length === 0
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: `Pastikan Tgl Faktur Diisi dengan Sesuai` }
                        : null

                    if (cekDate !== null || cekValue !== null || cekFaktur !== null) {
                        const mesTemp = [cekDate, cekValue, cekFaktur]
                        dataCek.push(mesTemp)
                    } else {
                        const cek = dataFakturKl.find((item) => (data.no_faktur !== '' && item.no_faktur.toString() === data.no_faktur.toString()))
                        if (cek !== undefined) {
                            cek.no_faktur = data.no_faktur
                            cek.date_faktur = data.date_faktur
                            cek.val = data.val
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
                    this.openUpFakturKl()
                    this.setState({ confirm: 'failUpload' })
                    this.openConfirm()
                } else {
                    console.log('masuk success king')
                    console.log(dataFakturKl)
                    console.log(dataTemp)
                    if (modalEdit === true) {
                        const comb = [...dataFakturKl, ...dataTemp]
                        const send = {
                            id: idKlaim.id,
                            list: comb
                        }
                        await this.props.uploadFakturKl(token, send)
                        await this.props.getFakturKl(token, idKlaim.id)
                        const { klaimFaktur } = this.props.klaim
                        this.setState({ dataFakturKl: klaimFaktur })
                        this.openUpFakturKl()
                        await this.editCartKlaim(idKlaim)
                        this.setState({ confirm: 'uploadFakturKl' })
                        this.openConfirm()
                    } else {
                        const comb = [...dataFakturKl, ...dataTemp]
                        this.setState({ dataFakturKl: comb })
                        this.openUpFakturKl()
                        this.setState({ confirm: 'uploadFakturKl' })
                        this.openConfirm()
                    }
                }
            }
        } else {
            this.openUpFakturKl()
            this.setState({ confirm: 'falseUpload' })
            this.openConfirm()
        }
    }


    openModalFaa = () => {
        this.setState({ modalFaa: !this.state.modalFaa })
    }

    uploadPicture = e => {
        const { size, type } = e.target.files[0]
        this.setState({ fileUpload: e.target.files[0] })
        if (size >= 20000000) {
            this.setState({ errMsg: "Maximum upload size 25 MB" })
            this.openConfirm()
        } else if (type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({ errMsg: 'Invalid file type. Only image files are allowed.' })
            this.openConfirm()
        } else {
            const { dataRinci } = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadPicture(token, dataRinci.no_asset, data)
        }
    }

    uploadGambar = e => {
        const { size, type } = e.target.files[0]
        this.setState({ fileUpload: e.target.files[0] })
        if (size >= 20000000) {
            this.setState({ errMsg: "Maximum upload size 25 MB" })
            this.openConfirm()
        } else if (type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({ errMsg: 'Invalid file type. Only image files are allowed.' })
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

    approveStock = async () => {
        const { dataItem } = this.state
        const token = localStorage.getItem('token')
        await this.props.approveStock(token, dataItem.no_stock)
        await this.props.getApproveStock(token, dataItem.no_stock, dataItem.kode_plant.split('').length === 4 ? 'stock opname' : 'stock opname HO')
        await this.props.notifStock(token, dataItem.no_stock, 'approve', 'HO', null, null)
    }

    rejectStock = async (value) => {
        const { dataItem, listMut } = this.state
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
        this.setState({ dropApp: !this.state.dropApp })
    }

    openModalConfirm = () => {
        this.setState({ openConfirm: !this.state.openConfirm })
    }

    openModalPreview = () => {
        this.setState({ modalPreview: !this.state.modalPreview })
    }

    openModalReject = () => {
        this.setState({ openReject: !this.state.openReject })
    }

    openModalApprove = () => {
        this.setState({ openApprove: !this.state.openApprove })
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
        this.setState({ modalRinci: !this.state.modalRinci })
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
        this.setState({ dataItem: value })
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
            { value: '', label: '-Pilih-' }
        ]
        const bank = [
            { value: '', label: '-Pilih-' }
        ]
        dataCoa.map(item => {
            return (
                temp.push({ value: item.no_coa, label: item.nama_subcoa })
            )
        })
        dataBank.map(item => {
            return (
                bank.push({ value: item.digit, label: item.name })
            )
        })
        this.setState({ options: temp, bankList: bank })
    }

    showAlert = () => {
        this.setState({ alert: true })

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
        this.setState({ openDraft: !this.state.openDraft })
    }

    getMessage = (val) => {
        this.setState({ message: val.message, subject: val.subject })
        console.log(val)
    }

    prepSendEmail = async () => {
        const { dataCart, noklaim } = this.props.klaim
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
            this.openConfirm(this.setState({ confirm: 'verifdoc' }))
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
            nameTo: draftEmail.to.fullname,
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
        this.openConfirm(this.setState({ confirm: 'submit' }))
    }

    componentDidUpdate() {
        const { isAdd, isUpload, isEdit, isUploadOut,
            isUpdateOut, isAddOut, isDelOut } = this.props.klaim
        const token = localStorage.getItem("token")
        if (isAdd === false) {
            this.openConfirm(this.setState({ confirm: 'rejCart' }))
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
            this.openConfirm(this.setState({ confirm: 'editcart' }))
            this.props.resetKlaim()
            this.setState({modalEdit: false, dataFakturKl: []})
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
                this.setState({ stat: detailAsset.grouping })
                if (detailAsset.kondisi === null && detailAsset.status_fisik === null) {
                    await this.props.getStatus(token, '', '', 'true')
                    this.modalStatus()
                } else {
                    await this.props.getStatus(token, detailAsset.status_fisik === null ? '' : detailAsset.status_fisik, detailAsset.kondisi === null ? '' : detailAsset.kondisi, 'true')
                    const { dataStatus } = this.props.stock
                    if (dataStatus.length === 0) {
                        this.modalStatus()
                    } else {
                        this.setState({ noAsset: val.no_asset, dropOp: !this.state.dropOp })
                    }
                }
            } else {
                await this.props.getStatus(token, '', '', 'true')
                this.modalStatus()
            }
        } else {
            this.setState({ dropOp: !this.state.dropOp })
        }
    }

    openModalEdit = () => {
        if (this.state.modalEdit === true) {
            this.setState({dataFakturKl: []})
            this.setState({ modalEdit: !this.state.modalEdit })
        } else {
            this.setState({ modalEdit: !this.state.modalEdit })
        }
    }

    getDataCart = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.getCart(token)
        this.prepareSelect()
        this.setState({ limit: value === undefined ? 10 : value.limit })
    }

    getDataKlaim = async (value) => {
        // const token = localStorage.getItem("token")
        // await this.props.getStockAll(token)
        // await this.props.getRole(token)
        this.setState({ limit: value === undefined ? 10 : value.limit })
        this.changeFilter('available')
    }

    getDataList = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 400, '', 1)
        await this.props.getStockAll(token)
    }

    openModalUpload = () => {
        this.setState({ modalUpload: !this.state.modalUpload })
    }

    openModalDok = () => {
        this.setState({ opendok: !this.state.opendok })
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
        this.setState({ modalSubmit: !this.state.modalSubmit })
    }

    openSum = () => {
        this.setState({ modalSum: !this.state.modalSum })
    }

    modalSubmitPre = () => {
        this.setState({ submitPre: !this.state.submitPre })
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
        this.setState({ filter: val, newStock: dataStock })
    }

    prosesSubmitPre = async () => {
        const { dataCart } = this.props.klaim
        if (dataCart.length > 0 && parseFloat(dataCart[0].nilai_ajuan) !== 0) {
            this.modalSubmitPre()
        } else {
            this.openConfirm(this.setState({ confirm: 'failSubChek' }))
        }

    }

    onSearch = async (e) => {
        this.setState({ search: e.target.value })
        const token = localStorage.getItem("token")
        if (e.key === 'Enter') {
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
            this.setState({ stat: val.target, })
            await this.props.getDetailAsset(token, val.item.no_asset)
            this.openProsesModalDoc()
        } else {
            await this.props.updateAsset(token, val.item.id, data)
            this.getDataCart()
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

    changeView = (val) => {
        this.setState({ view: val })
        if (val === 'list') {
            this.getDataList()
        } else {
            this.getDataKlaim()
        }
    }


    deleteCart = async (val) => {
        const token = localStorage.getItem("token")
        const { dataDelete } = this.state
        await this.props.deleteCart(token, dataDelete)
        await this.props.getCart(token)
        this.setState({ confirm: 'delCart' })
        this.openConfirm()
        this.openModalDelete()
    }

    prosesDelete = (val) => {
        this.setState({ dataDelete: val })
        this.openModalDelete()
    }

    openModalDelete = () => {
        this.setState({ modalDelete: !this.state.modalDelete })
    }

    addCartKlaim = async (val) => {
        const token = localStorage.getItem("token")
        const { detFinance } = this.props.finance
        const { dataOutlet, dataFakturKl } = this.state

        if (dataOutlet.length === 0 && this.state.tujuan_tf === 'Outlet') {
            this.setState({ confirm: 'nullOutlet' })
            this.openConfirm()
        } else {
            const data = {
                no_coa: this.state.no_coa,
                keterangan: val.keterangan,
                periode_awal: val.periode_awal,
                periode_akhir: val.periode_akhir,
                nilai_ajuan: this.state.tujuan_tf === 'Outlet' ? (dataOutlet.length > 0 ? dataOutlet.reduce((accumulator, object) => {
                    return accumulator + parseFloat(object.nilai_ajuan);
                }, 0) : 0) : this.state.nilai_ajuan,
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
                dn_area: val.dn_area,
                no_faktur: val.no_faktur
            }
            await this.props.addCart(token, data)

            if (this.state.tujuan_tf === 'Outlet') {
                const { dataAdd } = this.props.klaim
                const send = {
                    id: dataAdd.id,
                    list: dataOutlet
                }

                const sendFaktur = {
                    id: dataAdd.id,
                    list: dataFakturKl
                }
    
                await this.props.uploadOutlet(token, send)
                if (dataFakturKl.length > 0) {
                    await this.props.uploadFakturKl(token, sendFaktur)
    
                    this.openModalAdd()
                    this.props.getCart(token)
                    this.openConfirm(this.setState({ confirm: 'addcart' }))
                } else {
                    this.openModalAdd()
                    this.props.getCart(token)
                    this.openConfirm(this.setState({ confirm: 'addcart' }))
                }
            } else if (dataFakturKl.length > 0) {
                const { dataAdd } = this.props.klaim
                const send = {
                    id: dataAdd.id,
                    list: dataFakturKl
                }

                await this.props.uploadFakturKl(token, send)

                this.openModalAdd()
                this.props.getCart(token)
                this.openConfirm(this.setState({ confirm: 'addcart' }))
            } else {
                this.openModalAdd()
                this.props.getCart(token)
                this.openConfirm(this.setState({ confirm: 'addcart' }))
            }
        }
    }

    editCartKlaim = async (val) => {
        const token = localStorage.getItem("token")
        const { detFinance } = this.props.finance
        const { dataOutlet, typeOut } = this.state

        if (dataOutlet.length === 0 && typeOut !== 'delout' && this.state.tujuan_tf === 'Outlet') {
            this.setState({ confirm: 'nullOutlet' })
            this.openConfirm()
        } else {
            const data = {
                no_coa: this.state.no_coa,
                keterangan: val.keterangan,
                periode_awal: val.periode_awal,
                periode_akhir: val.periode_akhir,
                nilai_ajuan: this.state.tujuan_tf === 'Outlet' ? (dataOutlet.length > 0 ? dataOutlet.reduce((accumulator, object) => {
                    return accumulator + parseFloat(object.nilai_ajuan);
                }, 0) : 0) : this.state.nilai_ajuan,
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
                dn_area: val.dn_area,
                no_faktur: val.no_faktur
            }
            const { idKlaim } = this.props.klaim
            await this.props.editKlaim(token, idKlaim.id, data)
            this.setState({ typeOut: '' })
        }
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
                this.setState({ idTab: null })
                this.getDataCart()
            } else {
                this.setState({ idTab: value.item.id })
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
        this.setState({ fisik: fisik, kondisi: kondisi })
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
        const { detailAsset } = this.props.asset
        await this.props.updateAsset(token, detailAsset.id, data)
        this.getDataCart()
    }

    openModalFpd = () => {
        this.setState({ modalFpd: !this.state.modalFpd })
    }

    listStatus = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getDetailAsset(token, val)
        const { detailAsset } = this.props.asset
        if (detailAsset !== undefined) {
            this.setState({ stat: detailAsset.grouping })
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
        const { dataCart } = this.props.klaim
        if (dataCart.length > 0) {
            this.openConfirm(this.setState({ confirm: 'rejCartAdd' }))
        } else {
            await this.props.getFinRek(token)
            await this.props.getDetailFinance(token)
            const { dataRek } = this.props.finance
            const cekRek = dataRek[0].rek !== undefined && dataRek[0].rek.length > 0 ? dataRek[0].rek : []
            const spending = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening Spending Card') !== undefined ? cekRek.find(item => item.type === 'Rekening Spending Card').no_rekening : dataRek[0].rek_spending
            const zba = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening ZBA') !== undefined ? cekRek.find(item => item.type === 'Rekening ZBA').no_rekening : dataRek[0].rek_zba
            const bankcoll = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening Bank Coll') !== undefined ? cekRek.find(item => item.type === 'Rekening Bank Coll').no_rekening : dataRek[0].rek_bankcoll
            
            const bankSpending = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening Spending Card') !== undefined ? cekRek.find(item => item.type === 'Rekening Spending Card').bank : 'Bank Mandiri'
            const bankZba = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening ZBA') !== undefined ? cekRek.find(item => item.type === 'Rekening ZBA').bank : 'Bank Mandiri'
            const bankBankcoll = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening Bank Coll') !== undefined ? cekRek.find(item => item.type === 'Rekening Bank Coll').bank : 'Bank Mandiri'
            
            const temp = [
                {label: '-Pilih-', value: ''},
                spending !== '0' ? {label: `${spending}~Rekening Spending Card~${bankSpending}`, value: 'Rekening Spending Card'} : {value: '', label: ''},
                zba !== '0' ? {label: `${zba}~Rekening ZBA~${bankZba}`, value: 'Rekening ZBA'} : {value: '', label: ''},
                bankcoll !== '0' ? {label: `${bankcoll}~Rekening Bank Coll~${bankBankcoll}`, value: 'Rekening Bank Coll'} : {value: '', label: ''}
            ]
            this.setState({ rekList: temp })
            this.openModalAdd()
        }
    }

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailId(token, val)
        await this.props.getFinRek(token)
        await this.props.getDetailFinance(token)
        await this.props.getOutlet(token, val)
        await this.props.getFakturKl(token, val)
        const { dataRek } = this.props.finance
        const cekRek = dataRek[0].rek !== undefined && dataRek[0].rek.length > 0 ? dataRek[0].rek : []
        const spending = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening Spending Card') !== undefined ? cekRek.find(item => item.type === 'Rekening Spending Card').no_rekening : dataRek[0].rek_spending
        const zba = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening ZBA') !== undefined ? cekRek.find(item => item.type === 'Rekening ZBA').no_rekening : dataRek[0].rek_zba
        const bankcoll = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening Bank Coll') !== undefined ? cekRek.find(item => item.type === 'Rekening Bank Coll').no_rekening : dataRek[0].rek_bankcoll
        
        const bankSpending = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening Spending Card') !== undefined ? cekRek.find(item => item.type === 'Rekening Spending Card').bank : 'Bank Mandiri'
        const bankZba = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening ZBA') !== undefined ? cekRek.find(item => item.type === 'Rekening ZBA').bank : 'Bank Mandiri'
        const bankBankcoll = cekRek.length > 0 && cekRek.find(item => item.type === 'Rekening Bank Coll') !== undefined ? cekRek.find(item => item.type === 'Rekening Bank Coll').bank : 'Bank Mandiri'
        
        const temp = [
            {label: '-Pilih-', value: ''},
            spending !== '0' ? {label: `${spending}~Rekening Spending Card~${bankSpending}`, value: 'Rekening Spending Card'} : {value: '', label: ''},
            zba !== '0' ? {label: `${zba}~Rekening ZBA~${bankZba}`, value: 'Rekening ZBA'} : {value: '', label: ''},
            bankcoll !== '0' ? {label: `${bankcoll}~Rekening Bank Coll~${bankBankcoll}`, value: 'Rekening Bank Coll'} : {value: '', label: ''}
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
        this.setState({ dataOutlet: klaimOutlet,  dataFakturKl: klaimFaktur})

        setTimeout(() => {
            this.setState({ isLoading: false })
            this.openModalEdit()
        }, 1000)
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.showDokumen(token, value.id)
        this.setState({ date: value.updatedAt, idDoc: value.id, fileName: value })
        const { isShow } = this.props.dokumen
        if (isShow) {
            this.openModalPdf()
        }
    }

    goRoute(val) {
        this.props.history.push(`/${val}`)
    }

    openModalPdf = () => {
        this.setState({ openPdf: !this.state.openPdf })
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
        this.setState({ modalDoc: !this.state.modalDoc })
    }

    openModalAdd = () => {
        this.setState({ no_coa: '', nama_coa: '', bank: '', digit: 0, norek: '', tiperek: '', tujuan_tf: '', dataOutlet: [] })
        this.setState({ modalAdd: !this.state.modalAdd })
    }

    selectCoa = (e) => {
        this.setState({ no_coa: e.value, nama_coa: e.label })
    }

    selectBank = (e) => {
        this.setState({ bank: e.label, digit: e.value })
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

    selectRek = (e) => {
        this.setState({
            norek: e.label.split('~')[0], 
            tiperek: e.value, 
            bank: e.label.split('~')[2] !== undefined && e.label.split('~')[2] !== null ? e.label.split('~')[2] : 'Bank Mandiri',
            digit: e.label.split('~')[0].length
        })
    }

    selectTujuan = (val) => {
        if (val === 'PMA') {
            this.setState({ tujuan_tf: val, bank: '', digit: 13 })
        } else {
            this.setState({ tujuan_tf: val, bank: '', digit: 0 })
        }
    }

    modalStatus = () => {
        this.setState({ openStatus: !this.state.openStatus })
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
        this.setState({ listMut: data })
    }

    chekRej = (val) => {
        const { listMut } = this.state
        listMut.push(val)
        this.setState({ listMut: listMut })
    }

    prosesDetail = async (req, res) => {
        const token = localStorage.getItem("token")
    }

    openModalStock = () => {
        this.setState({ modalStock: !this.state.modalStock })
    }

    dropDown = () => {
        this.setState({ drop: !this.state.drop })
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const { dataRinci, duplikat, dataOutlet, detOutlet, messUpload, dataItem, listMut, drop, dataFakturKl, detFakturKl } = this.state
        const { dataCart, dataDoc, idKlaim } = this.props.klaim
        const { detFinance } = this.props.finance
        // const pages = this.props.finance.page

        const contentHeader = (
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
                                                            <Button onClick={() => this.prosesOpenEdit(item.id)} className='mb-1 mr-1' color='success'><MdEditSquare size={25}/></Button>
                                                            <Button onClick={() => this.prosesDelete(item.id)} color='danger'><MdDelete size={25}/></Button>
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
                <Modal isOpen={this.state.modalAdd} size="xl">
                    <ModalHeader>
                        Tambah Ajuan Klaim
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <Formik
                                initialValues={{
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
                                    dn_area: '',
                                    no_faktur: ''
                                }}
                                validationSchema={klaimSchema}
                                onSubmit={(values) => { this.addCartKlaim(values) }}
                            >
                                {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                                    <div className="rightRinci2">
                                        <div>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>COA <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:
                                                    <Select
                                                        className="inputRinci2"
                                                        options={this.state.options}
                                                        onChange={this.selectCoa}
                                                    />
                                                </Col>
                                            </Row>
                                            {/* {this.state.no_coa === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No COA <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.no_coa === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nama COA <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled
                                                    type="text"
                                                    className="inputRinci"
                                                    value={this.state.nama_coa}
                                                />
                                                </Col>
                                            </Row>
                                            {/* {this.state.no_coa === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No Surkom <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type="text"
                                                    className="inputRinci"
                                                    value={values.no_surkom}
                                                    onBlur={handleBlur("no_surkom")}
                                                    onChange={handleChange("no_surkom")}
                                                />
                                                </Col>
                                            </Row>
                                            {/* {errors.no_surkom ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nama Program <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type="text"
                                                    className="inputRinci"
                                                    value={values.nama_program}
                                                    onBlur={handleBlur("nama_program")}
                                                    onChange={handleChange("nama_program")}
                                                />
                                                </Col>
                                            </Row>
                                            {/* {errors.nama_program ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>DN Area <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type="text"
                                                    className="inputRinci"
                                                    value={values.dn_area}
                                                    onBlur={handleBlur("dn_area")}
                                                    onChange={handleChange("dn_area")}
                                                />
                                                </Col>
                                            </Row>
                                            {/* {errors.dn_area ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
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
                                                            <Button size='sm' onClick={this.openUpFakturKl} className='ml-1' color='primary'><MdUpload size={20}/></Button>
                                                            <Button size='sm' onClick={this.downloadFakturKl} className='ml-1' color='warning'><MdDownload size={20}/></Button>
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
                                                                <th>Action</th>
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
                                                                        <td className='rowCenter'>
                                                                            <Button size='sm' onClick={() => this.openDetFakturKl(this.setState({ detFakturKl: item }))} color='info'><MdEditSquare size={20}/></Button>
                                                                            <Button size='sm' onClick={() => this.confirmDelFakturKl(this.setState({ dataDel: item }))} className='ml-1' color='danger'><MdDelete size={20}/></Button>
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
                                                                <Button size='sm' onClick={this.openAddFakturKl} color='success'><MdAddCircle size={20}/></Button>
                                                            </td>
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                            {/* {errors.no_faktur ? (
                                                <text className={style.txtError}>{errors.no_faktur}</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Keterangan <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type="text"
                                                    className="inputRinci"
                                                    value={values.keterangan}
                                                    onBlur={handleBlur("keterangan")}
                                                    onChange={handleChange("keterangan")}
                                                />
                                                </Col>
                                            </Row>
                                            {/* {errors.keterangan ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Periode <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:
                                                    <Input
                                                        type="date"
                                                        className="inputRinci"
                                                        value={values.periode_awal}
                                                        onBlur={handleBlur("periode_awal")}
                                                        onChange={handleChange("periode_awal")}
                                                    />
                                                    <text className='mr-1 ml-1'>To</text>
                                                    <Input
                                                        type="date"
                                                        className="inputRinci"
                                                        value={values.periode_akhir}
                                                        onBlur={handleBlur("periode_akhir")}
                                                        onChange={handleChange("periode_akhir")}
                                                    />
                                                </Col>
                                            </Row>
                                            {/* {errors.periode_awal || errors.periode_akhir ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : values.periode_awal > values.periode_akhir ? (
                                                <text className={style.txtError}>Pastikan periode diisi dengan benar</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Yang Diajukan <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <NumberInput
                                                    value={this.state.tujuan_tf === 'Outlet' ? (dataOutlet.length > 0 ? dataOutlet.reduce((accumulator, object) => {
                                                        return accumulator + parseFloat(object.nilai_ajuan);
                                                    }, 0) : 0) : this.state.nilai_ajuan}
                                                    disabled={this.state.tujuan_tf === 'Outlet' ? true : false}
                                                    className="inputRinci1"
                                                    onValueChange={val => this.onEnterVal(val.floatValue)}
                                                    // onValueChange={val => setFieldValue("nilai_ajuan", val.floatValue)}
                                                />
                                                </Col>
                                            </Row>
                                            {/* {errors.nilai_ajuan ? (
                                            <text className={style.txtError}>{errors.nilai_ajuan}</text>
                                        ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Tujuan Transfer <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.tujuan_tf === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Bank <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.bank === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nomor Rekening <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:
                                                    {this.state.tujuan_tf === 'PMA' ? (
                                                        <Select
                                                            className="inputRinci2"
                                                            options={this.state.rekList}
                                                            onChange={this.selectRek}
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
                                                <Col md={3}>Atas Nama <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {values.nama_tujuan === '' && this.state.tujuan_tf !== 'PMA' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
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
                                            ) 
                                            ? (
                                                <div className='row justify-content-md-center mb-4'>
                                                    <div className='mainRinci2' onClick={this.openOutlet}>
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
                                                minLength={16}
                                                maxLength={16}
                                                className="inputRinci"
                                                value={values.status_npwp === 'Ya' ? values.no_npwp : ''}
                                                onBlur={handleBlur("no_npwp")}
                                                onChange={handleChange("no_npwp")}
                                                />
                                            </Col>
                                        </Row>
                                        {values.status_npwp === 'Ya' && values.no_npwp.length < 16  ? (
                                            <text className={style.txtError}>must be filled with 16 digits characters</text>
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
                                        <Row className="mt-5 mb-2">
                                            <Col md={12} lg={12} className="colDoc">
                                                <text className="txtError" >* Kolom Wajib Diisi</text>
                                            </Col>
                                        </Row>
                                        </div>
                                        <div className="modalFoot mt-3">
                                            <div></div>
                                            <div className='btnfoot'>
                                                <Button
                                                    className="mr-3"
                                                    size="md"
                                                    disabled={
                                                        this.state.no_coa === '' ? true
                                                        : values.status_npwp === 'Ya' && (values.nama_npwp === '' || values.no_npwp.length !== 16 || errors.no_npwp) ? true
                                                        : values.status_npwp === 'Tidak' && (values.nama_ktp === '' || values.no_ktp.length !== 16 || errors.no_ktp) ? true
                                                        // : values.norek_ajuan.length < this.state.digit ? true 
                                                        : this.state.tujuan_tf === '' ? true
                                                        : false
                                                    }
                                                    color="primary"
                                                    onClick={
                                                        this.state.no_coa === '' || errors.no_surkom || errors.nama_program ||
                                                        errors.dn_area || errors.keterangan || errors.periode_awal || errors.periode_akhir ||
                                                        errors.nilai_ajuan || this.state.tujuan_tf === '' || this.state.bank === '' ||
                                                        (values.nama_tujuan === '' && this.state.tujuan_tf !== 'PMA') ?
                                                        () => this.setError('Masih Terdapat Data Yang Belum Terisi..!!') : 
                                                        values.periode_awal > values.periode_akhir ?  () => this.setError('Pastikan Periode diisi dengan benar..!!')
                                                        : handleSubmit
                                                    }
                                                >
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
                <Modal size="xl" toggle={this.openOutlet} isOpen={this.state.modalOutlet}>
                    <ModalHeader>
                        List Outlet
                    </ModalHeader>
                    <ModalBody>
                        <div className='rowCenter mb-3'>
                            <Button color="primary" size="lg" className="mr-2" onClick={this.openUpOutlet} ><MdUpload size={20}/></Button>
                            <Button color="warning" size="lg" className="mr-2" onClick={this.downloadOutlet} ><MdDownload size={20}/></Button>
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
                                    <th>Keterangan</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataOutlet.length > 0 && dataOutlet.map(item => {
                                    return (
                                        <tr>
                                            <th>{dataOutlet.indexOf(item) + 1}</th>
                                            <td>{item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.status_npwp === 1 ? 'Ya' : 'Tidak'}</td>
                                            <td>{item.nama_npwp}</td>
                                            <td>{item.no_npwp}</td>
                                            <td>{item.nama_ktp}</td>
                                            <td>{item.no_ktp}</td>
                                            <td>{item.keterangan}</td>
                                            <td className='rowCenter'>
                                                {/* {this.state.modalEdit === true ? (
                                                <Button color="danger" className="mr-4" onClick={() => this.confirmDel(this.setState({dataDel: item}))}>Delete</Button>
                                            ) : (
                                            <> */}
                                                <Button color="info" className="mr-2" onClick={() => this.openDetOutlet(this.setState({ detOutlet: item }))}><MdEditSquare size={20}/></Button>
                                                <Button color="danger" onClick={() => this.confirmDel(this.setState({ dataDel: item }))}><MdDelete size={20}/></Button>
                                                {/* </>
                                            )} */}
                                            </td>
                                        </tr>
                                    )
                                })}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <Button color="success" size="lg" className="mr-2" onClick={this.openAddOutlet} ><MdAddCircle size={20}/></Button>
                                    </td>
                                </tr>
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
                            no_npwp: "",
                            keterangan: ""
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
                                        minLength={16}
                                        maxLength={16}
                                        className="inputRinci"
                                        value={values.status_npwp === 'Ya' ? values.no_npwp : ''}
                                        onBlur={handleBlur("no_npwp")}
                                        onChange={handleChange("no_npwp")}
                                    />
                                    </Col>
                                </Row>
                                {values.status_npwp === 'Ya' && values.no_npwp.length !== 16 ? (
                                    <text className={style.txtError}>must be filled with 16 digits characters</text>
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
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Keterangan</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.keterangan}
                                        className="inputRinci1"
                                        onChange={handleChange('keterangan')}
                                        onBlur={handleBlur('keterangan')}
                                    />
                                    </Col>
                                </Row>
                                {errors.keterangan ? (
                                    <text className={style.txtError}>{errors.keterangan}</text>
                                ) : null}
                                <hr />
                                <div className={style.foot}>
                                    <div></div>
                                    <div>
                                        <Button
                                            className="mr-2"
                                            onClick={handleSubmit} 
                                            color="primary"
                                            disabled={
                                                values.status_npwp === 'Ya' && (values.nama_npwp === '' || values.no_npwp.length !== 16 || errors.no_npwp) ? true
                                                : values.status_npwp === 'Tidak' && (values.nama_ktp === '' || values.no_ktp.length !== 16 || errors.no_ktp) ? true
                                                : false
                                            }
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
                            no_npwp: detOutlet.no_npwp,
                            keterangan: detOutlet.keterangan
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
                                        minLength={16}
                                        maxLength={16}
                                        className="inputRinci"
                                        value={values.status_npwp === 'Ya' ? values.no_npwp : ''}
                                        onBlur={handleBlur("no_npwp")}
                                        onChange={handleChange("no_npwp")}
                                    />
                                    </Col>
                                </Row>
                                {values.status_npwp === 'Ya' && values.no_npwp.length !== 16 ? (
                                    <text className={style.txtError}>must be filled with 16 digits characters</text>
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
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Keterangan</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.keterangan}
                                        className="inputRinci1"
                                        onChange={handleChange('keterangan')}
                                        onBlur={handleBlur('keterangan')}
                                    />
                                    </Col>
                                </Row>
                                {errors.keterangan ? (
                                    <text className={style.txtError}>{errors.keterangan}</text>
                                ) : null}
                                <hr />
                                <div className={style.foot}>
                                    <div></div>
                                    <div>
                                        <Button
                                            className="mr-2"
                                            onClick={handleSubmit} color="primary"
                                            disabled={
                                                values.status_npwp === 'Ya' && (values.nama_npwp === '' || values.no_npwp.length !== 16 || errors.no_npwp) ? true
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
                <Modal isOpen={this.state.modalAddFakturKl} size="lg">
                    <ModalHeader>Add Data Faktur Klaim</ModalHeader>
                    <Formik
                        initialValues={{
                            no_faktur: "",
                            tgl_faktur: "",
                            value: "",
                            keterangan: ""
                        }}
                        validationSchema={fakturklSchema}
                        onSubmit={(values) => { this.addDataFakturKl(values) }}
                    >
                        {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                            <ModalBody>
                               <Row className="mb-2 rowRinci">
                                    <Col md={3}>No Faktur</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.no_faktur}
                                        className="inputRinci1"
                                        onChange={handleChange('no_faktur')}
                                        onBlur={handleBlur('no_faktur')}
                                    />
                                    </Col>
                                </Row>
                                {errors.no_faktur ? (
                                    <text className={style.txtError}>{errors.no_faktur}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Tgl Faktur</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        type='date'
                                        value={values.date_faktur}
                                        className="inputRinci1"
                                        onChange={handleChange('date_faktur')}
                                        onBlur={handleBlur('date_faktur')}
                                    />
                                    </Col>
                                </Row>
                                {errors.date_faktur ? (
                                    <text className={style.txtError}>{errors.date_faktur}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Value</Col>
                                    <Col md={9} className="colRinci">:  <NumberInput
                                        value={values.value}
                                        className="inputRinci1"
                                        onValueChange={val => setFieldValue("value", val.floatValue)}
                                    />
                                    </Col>
                                </Row>
                                {errors.value ? (
                                    <text className={style.txtError}>{errors.value}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Keterangan</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.keterangan}
                                        className="inputRinci1"
                                        onChange={handleChange('keterangan')}
                                        onBlur={handleBlur('keterangan')}
                                    />
                                    </Col>
                                </Row>
                                {errors.keterangan ? (
                                    <text className={style.txtError}>{errors.keterangan}</text>
                                ) : null}
                                <hr />
                                <div className={style.foot}>
                                    <div></div>
                                    <div>
                                        <Button
                                            className="mr-2"
                                            onClick={handleSubmit} color="primary"
                                            disabled={values.value <= 0 || values.value === '' ? true : false}
                                        >Save</Button>
                                        <Button className="" onClick={this.openAddFakturKl}>Cancel</Button>
                                    </div>
                                </div>
                            </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.detModFakturKl} size="lg">
                    <ModalHeader>Update Data Faktur Klaim</ModalHeader>
                    <Formik
                        initialValues={{
                            no_faktur: detFakturKl.no_faktur,
                            date_faktur: detFakturKl.date_faktur,
                            value: detFakturKl.val,
                            keterangan: detFakturKl.keterangan,
                        }}
                        validationSchema={fakturklSchema}
                        onSubmit={(values) => { this.editDataFakturKl(values) }}
                    >
                        {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                            <ModalBody>
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>No Faktur</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.no_faktur}
                                        className="inputRinci1"
                                        onChange={handleChange('no_faktur')}
                                        onBlur={handleBlur('no_faktur')}
                                    />
                                    </Col>
                                </Row>
                                {errors.no_faktur ? (
                                    <text className={style.txtError}>{errors.no_faktur}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Tgl Faktur</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        type='date'
                                        value={moment(values.date_faktur).format('YYYY-MM-DD')}
                                        className="inputRinci1"
                                        onChange={handleChange('date_faktur')}
                                        onBlur={handleBlur('date_faktur')}
                                    />
                                    </Col>
                                </Row>
                                {errors.date_faktur ? (
                                    <text className={style.txtError}>{errors.date_faktur}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Value</Col>
                                    <Col md={9} className="colRinci">:  <NumberInput
                                        value={values.value}
                                        className="inputRinci1"
                                        onValueChange={val => setFieldValue("value", val.floatValue)}
                                    />
                                    </Col>
                                </Row>
                                {errors.value ? (
                                    <text className={style.txtError}>{errors.value}</text>
                                ) : null}
                                <Row className="mb-2 rowRinci">
                                    <Col md={3}>Keterangan</Col>
                                    <Col md={9} className="colRinci">:  <Input
                                        value={values.keterangan}
                                        className="inputRinci1"
                                        onChange={handleChange('keterangan')}
                                        onBlur={handleBlur('keterangan')}
                                    />
                                    </Col>
                                </Row>
                                {errors.keterangan ? (
                                    <text className={style.txtError}>{errors.keterangan}</text>
                                ) : null}
                                <hr />
                                <div className={style.foot}>
                                    <div></div>
                                    <div>
                                        <Button
                                            className="mr-2"
                                            onClick={handleSubmit} color="primary"
                                            disabled={values.value <= 0 || values.value === '' ? true : false}
                                        >Save</Button>
                                        <Button className="" onClick={this.openDetFakturKl}>Cancel</Button>
                                    </div>
                                </div>
                            </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.modUpFakturKl} >
                    <ModalHeader>Upload Data Faktur Klaim</ModalHeader>
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
                            <Button className='mr-2' color="primary" disabled={this.state.fileUpload === "" ? true : false} onClick={this.uploadDataFakturKl}>Upload</Button>
                            <Button onClick={this.openUpFakturKl}>Cancel</Button>
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
                <Modal isOpen={this.state.modalEdit} size="xl">
                    <ModalHeader>
                        Edit Ajuan Klaim
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <Formik
                                initialValues={{
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
                                    dn_area: idKlaim.dn_area || '',
                                    no_faktur: idKlaim.no_faktur || ''
                                }}
                                validationSchema={klaimSchema}
                                onSubmit={(values) => { this.editCartKlaim(values) }}
                            >
                                {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                                    <div className="rightRinci2">
                                        <div>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>COA <text className='txtError'>{'*'}</text></Col>
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
                                                <Col md={3}>No COA <text className='txtError'>{'*'}</text></Col>
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
                                                <Col md={3}>Nama COA <text className='txtError'>{'*'}</text></Col>
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
                                                <Col md={3}>No Surkom <text className='txtError'>{'*'}</text></Col>
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
                                                <Col md={3}>Nama Program <text className='txtError'>{'*'}</text></Col>
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
                                                <Col md={3}>DN Area <text className='txtError'>{'*'}</text></Col>
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
                                                            <Button size='sm' onClick={this.openUpFakturKl} className='ml-1' color='primary'><MdUpload size={20}/></Button>
                                                            <Button size='sm' onClick={this.downloadFakturKl} className='ml-1' color='warning'><MdDownload size={20}/></Button>
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
                                                                <th>Action</th>
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
                                                                        <td>
                                                                            <div className='rowCenter'>
                                                                                <Button size='sm' onClick={() => this.openDetFakturKl(this.setState({ detFakturKl: item }))} color='info'><MdEditSquare size={20}/></Button>
                                                                                <Button size='sm' onClick={() => this.confirmDelFakturKl(this.setState({ dataDel: item }))} className='ml-1' color='danger'><MdDelete size={20}/></Button>
                                                                            </div>
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
                                                                <Button size='sm' onClick={this.openAddFakturKl} color='success'><MdAddCircle size={20}/></Button>
                                                            </td>
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                            {/* {errors.no_faktur ? (
                                                <text className={style.txtError}>{errors.no_faktur}</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Keterangan <text className='txtError'>{'*'}</text></Col>
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
                                                <Col md={3}>Periode <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {errors.periode_awal || errors.periode_akhir ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : values.periode_awal > values.periode_akhir ? (
                                                <text className={style.txtError}>Pastikan periode diisi dengan benar</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Yang Diajukan <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <NumberInput
                                                    value={this.state.tujuan_tf === 'Outlet' ? (dataOutlet.length > 0 ? dataOutlet.reduce((accumulator, object) => {
                                                        return accumulator + parseFloat(object.nilai_ajuan);
                                                    }, 0) : 0) : this.state.nilai_ajuan}
                                                    disabled={this.state.tujuan_tf === 'Outlet' ? true : false}
                                                    className="inputRinci1"
                                                    onValueChange={val => this.onEnterVal(val.floatValue)}
                                                />
                                                </Col>
                                            </Row>
                                            {/* {errors.nilai_ajuan ? (
                                            <text className={style.txtError}>{errors.nilai_ajuan}</text>
                                        ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Tujuan Transfer <text className='txtError'>{'*'}</text></Col>
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
                                                <Col md={3}>Bank <text className='txtError'>{'*'}</text></Col>
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
                                            {this.state.bank === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nomor Rekening <text className='txtError'>{'*'}</text></Col>
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
                                                <Col md={3}>Atas Nama <text className='txtError'>{'*'}</text></Col>
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
                                                minLength={16}
                                                maxLength={16}
                                                className="inputRinci"
                                                value={values.status_npwp === 'Ya' ? values.no_npwp : ''}
                                                onBlur={handleBlur("no_npwp")}
                                                onChange={handleChange("no_npwp")}
                                                />
                                            </Col>
                                        </Row>
                                        {values.status_npwp === 'Ya' && values.no_npwp.length < 16  ? (
                                            <text className={style.txtError}>must be filled with 16 digits characters</text>
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
                                        <Row className="mt-5 mb-2">
                                            <Col md={12} lg={12} className="colDoc">
                                                <text className="txtError" >* Kolom Wajib Diisi</text>
                                            </Col>
                                        </Row>
                                        </div>
                                        <div className="modalFoot mt-3">
                                            <div></div>
                                            <div className='btnfoot'>
                                                <Button
                                                    className="mr-3"
                                                    size="md"
                                                    disabled={this.state.no_coa === '' ? true
                                                        // : values.status_npwp === 'Ya' && (values.nama_npwp === '' || values.no_npwp.length !== 16 || errors.no_npwp) ? true 
                                                        // : values.status_npwp === 'Tidak' && (values.nama_ktp === '' || values.no_ktp.length !== 16 || errors.no_ktp) ? true 
                                                        // : values.norek_ajuan.length < this.state.digit ? true 
                                                        : this.state.tujuan_tf === '' ? true
                                                        : false}
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
                                    Anda yakin untuk menghapus data ajuan ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.deleteCart()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalDelete}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalRinci} className='modalrinci' toggle={this.openModalRinci} size="xl">
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
                        <Button color="primary" onClick={() => this.openPreview(dataItem)}>Preview</Button>
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
                            onSubmit={(values) => { this.rejectStock(values) }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
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
                <Modal isOpen={this.state.modalDelOutlet} toggle={this.confirmDel} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk menghapus outlet ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.delDataOutlet()}>Ya</Button>
                                <Button color="secondary" onClick={this.confirmDel}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalDelFakturKl} toggle={this.confirmDelFakturKl} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk menghapus faktur klaim ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.delDataFakturKl()}>Ya</Button>
                                <Button color="secondary" onClick={this.confirmDelFakturKl}>Tidak</Button>
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
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={dataCart.length > 0 ? dataCart[0].area : ''} className="ml-3" /></Col>
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
                            <text className="italRed">*Pastikan Data Diatas Merupakan Data Yang Ingin Anda Submit </text>
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
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={dataCart.length > 0 ? dataCart[0].area : ''} className="ml-3" /></Col>
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
                        <Email handleData={this.getMessage} />
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
                        {/* <Countdown renderer={this.rendererTime} date={Date.now() + 3000} /> */}
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
                        ) : this.state.confirm === 'reject' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Reject</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejApprove' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'verifdoc' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Submit Klaim</div>
                                    <div className={[style.sucUpdate, style.green]}>Pastikan seluruh dokumen lampiran telah diupload</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejCart' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Data</div>
                                    <div className={[style.sucUpdate, style.green]}>{this.props.klaim.alertMsg}</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejCartAdd' ? (
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
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Menghapus Outlet</div>
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
                                    <div className={[style.sucUpdate, style.green]}>Gagal Menghapus Outlet</div>
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
                        ) : this.state.confirm === 'sucAddFakturKl' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Menambahkan Faktur Klaim</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'editFakturKl' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Mengupdate Faktur Klaim</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'delFakturKl' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Menghapus Faktur Klaim</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejAddFakturKl' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Faktur Klaim</div>
                                    <div className={[style.sucUpdate, style.green, 'mt-2']}>No Faktur telah terdaftar </div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejEditFakturKl' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Mengupdate Faktur Klaim</div>
                                    <div className={[style.sucUpdate, style.green, 'mt-2']}>No Faktur telah terdaftar </div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejDelFakturKl' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Menghapus Faktur Klaim</div>
                                    <div className={[style.sucUpdate, style.green, 'mt-2']}>Server sedang ada masalah</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'uploadFakturKl' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={style.sucUpdate}>Berhasil Upload Data Faktur</div>
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
                        ) : this.state.confirm === 'dupUploadFakturKl' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green, style.mb4]}>Gagal Upload</div>
                                    <div className={[style.sucUpdate, style.green, style.mb4]}>Terdapat Duplikasi pada no faktur berikut</div>
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
                        ) : this.state.confirm === 'errfill' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Save</div>
                                    <div className={[style.sucUpdate, style.green, 'mt-2']}>{this.state.infoError}</div>
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
                                                        onClick={() => this.setState({ detail: x })}
                                                        onChange={this.onChangeUpload}
                                                    />
                                                    {/* <text className="txtError ml-4">Maximum file upload is 25 Mb</text>
                                                    <text className="txtError ml-4">Only excel, pdf, zip, png, jpg and rar files are allowed</text> */}
                                                </div>
                                            </Col>
                                        ) : (
                                            <Col md={12} lg={12} className="colDoc">
                                                <text className="btnDocIo" >{x.desc} <text className='txtError'>{x.stat_upload === 0 ? '' : '*'}</text></text>
                                                {/* <text className="italRed" >{x.stat_upload === 0 ? '*tidak harus upload' : '*harus upload'}</text> */}
                                                <div className="colDoc">
                                                    <input
                                                        type="file"
                                                        onClick={() => this.setState({ detail: x })}
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
                            <Row className="mt-3 mb-4">
                                <Col md={12} lg={12} className="colDoc">
                                    <text className="txtError" >* Wajib Upload Document</text>
                                    <text className="txtError">Maximum file upload is 25 Mb</text>
                                    <text className="txtError">Only excel, pdf, zip, png, jpg and rar files are allowed</text>
                                </Col>
                            </Row>
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
                <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true} >
                    <ModalHeader>Dokumen</ModalHeader>
                    <ModalBody>
                        <div className={style.readPdf}>
                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} dataFile={this.state.fileName} />
                        </div>
                        <hr />
                        <div className={style.foot}>
                            <div>
                                <Button color="success" onClick={() => this.downloadData()}>Download</Button>
                            </div>
                            <Button color="primary" onClick={() => this.setState({ openPdf: false })}>Close</Button>
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
    getDetailFinance: finance.getDetailFinance,
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
    addNotif: notif.addNotif,
    uploadOutlet: klaim.uploadOutlet,
    updateOutlet: klaim.updateOutlet,
    addOutlet: klaim.addOutlet,
    getOutlet: klaim.getOutlet,
    deleteOutlet: klaim.deleteOutlet,
    uploadFakturKl: klaim.uploadFakturKl,
    updateFakturKl: klaim.updateFakturKl,
    addFakturKl: klaim.addFakturKl,
    getFakturKl: klaim.getFakturKl,
    deleteFakturKl: klaim.deleteFakturKl
}

export default connect(mapStateToProps, mapDispatchToProps)(CartKlaim)
