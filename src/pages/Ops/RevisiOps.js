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
import { CiCirclePlus, CiEdit } from "react-icons/ci";
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
import moment from 'moment'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import menu from '../../redux/actions/menu'
import finance from '../../redux/actions/finance'
import reason from '../../redux/actions/reason'
import notif from '../../redux/actions/notif'
import Pdf from "../../components/Pdf"
import depo from '../../redux/actions/depo'
import {default as axios} from 'axios'
import Select from 'react-select'
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import ops from '../../redux/actions/ops'
import dokumen from '../../redux/actions/dokumen'
import pagu from '../../redux/actions/pagu'
import faktur from '../../redux/actions/faktur'
import vendor from '../../redux/actions/vendor'
import rekening from '../../redux/actions/rekening'
import coa from '../../redux/actions/coa'
import NumberInput from '../../components/NumberInput'
import Email from '../../components/Ops/Email'
import email from '../../redux/actions/email'
import ListBbm from '../../components/Ops/ListBbm'
import readXlsxFile from 'read-excel-file'
import ExcelJS from "exceljs"
import fs from "file-saver"

const {REACT_APP_BACKEND_URL} = process.env
const nonObject = 'Non Object PPh'
const nonPph = 'Non PPh'

const opsSchema = Yup.object().shape({
    keterangan: Yup.string().required("must be filled"),
    periode_awal: Yup.date().required("must be filled"),
    periode_akhir: Yup.date().required('must be filled'),
    nilai_ajuan: Yup.string().required("must be filled"),
    norek_ajuan: Yup.number().required("must be filled"),
    nama_tujuan: Yup.string().required("must be filled"),
    status_npwp: Yup.string().required('must be filled'),
})

const addSchema = Yup.object().shape({
    keterangan: Yup.string().required("must be filled"),
    periode_awal: Yup.date().required("must be filled"),
    periode_akhir: Yup.date().required('must be filled'),
    dpp: Yup.number(),
    ppn: Yup.number(),
    // nilai_ajuan: Yup.string().required("must be filled"),
})

const bbmSchema = Yup.object().shape({
    no_pol: Yup.string().required("must be filled"),
    nominal: Yup.number().required('must be filled'),
    liter: Yup.number().required('must be filled'),
    km: Yup.number().required('must be filled')
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});


class RevisiOps extends Component {
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
            newOps: [],
            totalfpd: 0,
            dataMenu: [],
            listMenu: [],
            bankList: [],
            detail: {},
            bank: '',
            digit: 0,
            docHist: false,
            detailDoc: {},
            docCon: false,
            listOps: [],
            modalDownload: false,
            dataDownload: [],
            no_coa: '',
            nama_coa: '',
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
            showOptions: false,
            tgl_faktur: '',
            isLoading: false,
            typeniknpwp: '',
            type_kasbon: '',
            modalRev: false,
            openDraft: false,
            message: '',
            subject: '',
            tipeSkb: '',
            statBbm: '',
            dataBbm: [],
            detBbm: {},
            modalBbm: false,
            modalAddBbm: false,
            modalDelBbm: false,
            detModBbm: false,
            modUpBbm: false,
            fileUpload: {},
            messUpload: [],
            duplikat: [],
            dataDel: {},
            typeOut: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    openBbm = (val) => {
        this.setState({ modalBbm: !this.state.modalBbm })
    }

    openAddBbm = (val) => {
        this.setState({ modalAddBbm: !this.state.modalAddBbm })
    }

    openDetBbm = () => {
        this.setState({ detModBbm: !this.state.detModBbm })
    }

    openUpBbm = (val) => {
        this.setState({ modUpBbm: !this.state.modUpBbm, fileUpload: '' })
    }

    downloadBbm = () => {
        const { dataBbm } = this.state

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data bbm')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }


        ws.columns = [
            { header: 'No Pol', key: 'c1' },
            { header: 'Besar Pengisisan BBM (Liter)', key: 'c2' },
            { header: 'KM Pengisian', key: 'c3' },
            { header: 'Nominal', key: 'c4' }
        ]

        dataBbm.map((item, index) => {
            return (ws.addRow(
                {
                    c1: item.no_pol,
                    c2: item.liter,
                    c3: item.km,
                    c4: item.nominal
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
                `Data BBM Operasional ${moment().format('DD MMMM YYYY')}.xlsx`
            )
        })
    }


    addDataBbm = async (val) => {
        const { dataBbm, modalEdit } = this.state
        const { idOps } = this.props.ops
        const token = localStorage.getItem('token')
        const data = {
            liter: val.liter,
            km: val.km,
            nominal: val.nominal,
            no_pol: val.no_pol
        }
        if (dataBbm.length > 0) {
            const cek = dataBbm.find(({ no_pol }) => (data.no_pol !== '' && no_pol === data.no_pol))
            if (cek !== undefined) {
                this.setState({ confirm: 'rejAddBbm' })
                this.openConfirm()
            } else {
                if (modalEdit === true) {
                    const send = {
                        id: idOps.id,
                        ...data
                    }
                    await this.props.addBbm(token, send)
                    await this.props.getBbm(token, idOps.id)
                    const { opsBbm } = this.props.ops
                    this.setState({ dataBbm: opsBbm })

                    const valBbm = opsBbm.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.nominal);
                    }, 0)
                    this.setState({nilai_ajuan: valBbm})
                    setTimeout(() => {
                        this.formulaTax()
                    }, 100)

                    await this.editCartOps(idOps)
                    this.setState({ confirm: 'sucAddBbm' })
                    this.openConfirm()
                    this.openAddBbm()
                } else {
                    dataBbm.push(data)
                    this.setState({ dataBbm: dataBbm })
                    
                    const valBbm = dataBbm.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.nominal);
                    }, 0)
                    this.setState({nilai_ajuan: valBbm})
                    setTimeout(() => {
                        this.formulaTax()
                    }, 100)

                    this.setState({ confirm: 'sucAddBbm' })
                    this.openConfirm()
                    this.openAddBbm()
                }
            }
        } else {
            if (modalEdit === true) {
                const send = {
                    id: idOps.id,
                    ...data
                }
                await this.props.addBbm(token, send)
                await this.props.getBbm(token, idOps.id)
                const { opsBbm } = this.props.ops
                this.setState({ dataBbm: opsBbm })

                const valBbm = opsBbm.reduce((accumulator, object) => {
                    return accumulator + parseFloat(object.nominal);
                }, 0)
                this.setState({nilai_ajuan: valBbm})
                setTimeout(() => {
                    this.formulaTax()
                }, 100)

                await this.editCartOps(idOps)
                this.setState({ confirm: 'sucAddBbm' })
                this.openConfirm()
                this.openAddBbm()
            } else {
                dataBbm.push(data)
                this.setState({ dataBbm: dataBbm })

                const valBbm = dataBbm.reduce((accumulator, object) => {
                    return accumulator + parseFloat(object.nominal);
                }, 0)
                this.setState({nilai_ajuan: valBbm})
                setTimeout(() => {
                    this.formulaTax()
                }, 100)

                this.setState({ confirm: 'sucAddBbm' })
                this.openConfirm()
                this.openAddBbm()
            }
        }
    }

    editDataBbm = async (val) => {
        const { dataBbm, detBbm, modalEdit } = this.state
        const { idOps } = this.props.ops
        const token = localStorage.getItem('token')
        const data = {
            liter: val.liter,
            km: val.km,
            nominal: val.nominal,
            no_pol: val.no_pol
        }
        const dataUp = []
        if (dataBbm.length > 0) {
            for (let i = 0; i < dataBbm.length; i++) {
                const dataCek = JSON.stringify(dataBbm[i])
                if (JSON.stringify(detBbm) === dataCek) {
                    const cek = dataBbm.find(({ no_pol }) => (data.no_pol !== '' && no_pol === data.no_pol && no_pol !== detBbm.no_pol))
                    if (cek !== undefined) {
                        console.log()
                    } else {
                        dataUp.push(data)
                    }
                } else {
                    dataUp.push(dataBbm[i])
                }
            }
            if (dataUp.length === dataBbm.length) {
                if (modalEdit === true) {
                    const send = {
                        id: idOps.id,
                        idBbm: detBbm.id,
                        ...data
                    }
                    await this.props.updateBbm(token, send)
                    await this.props.getBbm(token, idOps.id)
                    const { opsBbm } = this.props.ops
                    this.setState({ dataBbm: opsBbm })

                    const valBbm = opsBbm.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.nominal);
                    }, 0)
                    this.setState({nilai_ajuan: valBbm})
                    setTimeout(() => {
                        this.formulaTax()
                    }, 100)

                    await this.editCartOps(idOps)
                    this.setState({ confirm: 'editBbm' })
                    this.openConfirm()
                    this.openDetBbm()
                } else {
                    this.setState({ dataBbm: dataUp })

                    const valBbm = dataUp.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.nominal);
                    }, 0)
                    this.setState({nilai_ajuan: valBbm})
                    setTimeout(() => {
                        this.formulaTax()
                    }, 100)

                    this.setState({ confirm: 'editBbm' })
                    this.openConfirm()
                    this.openDetBbm()
                }
            } else {
                this.setState({ confirm: 'rejEditBbm' })
                this.openConfirm()
            }
        }
    }

    delDataBbm = async () => {
        const { dataBbm, dataDel, modalEdit } = this.state
        const { idOps } = this.props.ops
        const token = localStorage.getItem('token')
        const data = []
        for (let i = 0; i < dataBbm.length; i++) {
            const dataCek = JSON.stringify(dataBbm[i])
            if (JSON.stringify(dataDel) === dataCek) {
                if (modalEdit === true && dataDel.id !== undefined) {
                    await this.props.deleteBbm(token, dataDel.id)
                } else {
                    console.log('delete')
                }
            } else {
                data.push(dataBbm[i])
            }
        }
        if (modalEdit === true && dataDel.id !== undefined) {
            this.confirmDel()
            this.setState({ dataBbm: data, typeOut: 'delout' })

            const valBbm = data.reduce((accumulator, object) => {
                return accumulator + parseFloat(object.nominal);
            }, 0)
            this.setState({nilai_ajuan: valBbm})
            setTimeout(() => {
                this.formulaTax()
            }, 100)

            await this.editCartOps(idOps)
            this.setState({ confirm: 'delBbm' })
            this.openConfirm()
        } else {
            this.confirmDel()
            this.setState({ dataBbm: data })

            const valBbm = data.reduce((accumulator, object) => {
                return accumulator + parseFloat(object.nominal);
            }, 0)
            this.setState({nilai_ajuan: valBbm})
            setTimeout(() => {
                this.formulaTax()
            }, 100)

            this.setState({ confirm: 'delBbm' })
            this.openConfirm()
        }
    }

    confirmDel = () => {
        this.setState({ modalDelBbm: !this.state.modalDelBbm })
    }

    setDetBbm = (val) => {
        const { dataBbm } = this.state
        const data = {
            liter: val.liter,
            km: val.km,
            nominal: val.nominal,
            no_pol: val.no_pol
        }
        dataBbm.push(data)
        this.setState({ dataBbm: dataBbm })
    }

    uploadDataBbm = async (val) => {
        const { dataBbm, fileUpload, modalEdit } = this.state
        const { idOps } = this.props.ops
        const token = localStorage.getItem('token')
        const dataTemp = []
        const rows = await readXlsxFile(fileUpload)
        const dataCek = []
        const count = []
        const parcek = [
            'No Pol',
            'Besar Pengisisan BBM (Liter)',
            'KM Pengisian',
            'Nominal'
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
                const dataOps = rows[i]
                const noid = dataOps[0]
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
                this.openUpBbm()
                this.setState({ confirm: 'dupUpload', duplikat: result })
                this.openConfirm()
            } else {
                for (let i = 0; i < rows.length; i++) {
                    const dataOps = rows[i]
                    const data = {
                        no_pol: dataOps[0],
                        liter: dataOps[1] ,
                        km: dataOps[2],
                        nominal: dataOps[3],
                    }

                    const nominal = dataOps[3]
                    const liter = dataOps[1]
                    const km = dataOps[2]

                    const dataNominal = nominal === null || (nominal.toString().split('').filter((item) => isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Nominal Diisi dengan Sesuai' }
                        : null
                    const dataLiter = liter === null || (liter.toString().split('').filter((item) => isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Data Liter Diisi dengan Sesuai' }
                        : null
                    const dataKm = km === null || (km.toString().split('').filter((item) => isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Data KM Diisi dengan Sesuai' }
                        : null

                    if (dataLiter !== null || dataKm !== null || dataNominal !== null) {
                        const mesTemp = [dataLiter, dataKm, dataNominal]
                        dataCek.push(mesTemp)
                    } else {
                        const cek = dataBbm.find(({ no_pol }) => (data.no_pol !== '' && no_pol === data.no_pol))
                        if (cek !== undefined) {
                            cek.liter = data.liter
                            cek.km = data.km
                            cek.nominal = data.nominal
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
                    this.openUpBbm()
                    this.setState({ confirm: 'failUpload' })
                    this.openConfirm()
                } else {
                    console.log('masuk success king')
                    if (modalEdit === true) {
                        const comb = [...dataBbm, ...dataTemp]
                        const send = {
                            id: idOps.id,
                            list: comb
                        }
                        await this.props.uploadBbm(token, send)
                        await this.props.getBbm(token, idOps.id)
                        const { opsBbm } = this.props.ops
                        this.setState({ dataBbm: opsBbm })
                       
                        const valBbm = opsBbm.reduce((accumulator, object) => {
                            return accumulator + parseFloat(object.nominal);
                        }, 0)
                        this.setState({nilai_ajuan: valBbm})
                        setTimeout(() => {
                            this.formulaTax()
                        }, 100)
                        
                        this.openUpBbm()
                        await this.editCartOps(idOps)
                        this.setState({ confirm: 'upload' })
                        this.openConfirm()
                    } else {
                        const comb = [...dataBbm, ...dataTemp]
                        this.setState({ dataBbm: comb })
                        
                        const valBbm = comb.reduce((accumulator, object) => {
                            return accumulator + parseFloat(object.nominal);
                        }, 0)
                        this.setState({nilai_ajuan: valBbm})
                        setTimeout(() => {
                            this.formulaTax()
                        }, 100)

                        this.openUpBbm()
                        this.setState({ confirm: 'upload' })
                        this.openConfirm()
                    }
                }
            }
        } else {
            this.openUpBbm()
            this.setState({ confirm: 'falseUpload' })
            this.openConfirm()
        }
    }

    openOpsBbm = async () => {
        const token = localStorage.getItem("token")
        const { idOps } = this.props.ops
        await this.props.getBbm(token, idOps.id)
        const { opsBbm } = this.props.ops
        this.setState({ dataBbm: opsBbm })
        this.openBbm()
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
            const { detailOps } = this.props.ops
            const { detail } = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocOps(token, detailOps[0].no_transaksi, detail.id, data)
            // this.props.uploadDocOps(token, tempno, data)
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

    rejectOps = async (val) => {
        const {listMut, listReason, listMenu} = this.state
        const { detailOps } = this.props.ops
        const token = localStorage.getItem('token')
        const tempno = {
            no: detailOps[0].no_transaksi
        }
        let temp = ''
        for (let i = 0; i < listReason.length; i++) {
            temp += listReason[i] + '. '
        }
        const data = {
            no: detailOps[0].no_transaksi,
            list: listMut,
            alasan: temp + val.alasan,
            menu: listMenu.toString()
        }
        await this.props.rejectOps(token, data)
        this.getDataOps()
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

    checkSubmitRev = () => {
        const { detailOps } = this.props.ops
        const temp = []
        detailOps.map(item => {
            return (
                item.isreject === 1 && temp.push(item)
            )
        })
        if (temp.length > 0) {
            this.setState({confirm: 'rejSubmit'})
            this.openConfirm()
        } else {
            this.openModalApprove()
        }
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
        // const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const type = localStorage.getItem('tipeKasbon')
        await this.props.getCoa(token, type === 'kasbon' ? 'kasbon' :'ops')
        await this.props.getBank(token)
        await this.props.getVendor(token)
        this.getDataOps()
    }

    componentDidUpdate() {
        const { isApprove, isUpload, isReject, isUpdateBbm, isUploadBbm, isAddBbm, isDelBbm } = this.props.ops
        const token = localStorage.getItem("token")
        if (isApprove === false) {
            this.setState({confirm: 'rejApprove'})
            this.openConfirm()
            this.openModalApprove()
            this.openModalRinci()
            this.props.resetOps()
        } else if (isUpload === true) {
            const { detailOps } = this.props.ops
            const tempno = {
                no: detailOps[0].no_transaksi,
                name: 'Draft Pengajuan Operasional'
            }
            this.props.getDocOps(token, tempno)
            this.props.resetOps()
        } else if (isReject === false) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
            this.openModalReject()
            this.openModalRinci()
            this.props.resetOps()
        } else if (isUploadBbm === false) {
            this.setState({ confirm: 'falseUpload' })
            this.openConfirm()
            this.props.resetOps()
        } else if (isUpdateBbm === false) {
            this.setState({ confirm: 'rejEditBbm' })
            this.openConfirm()
            this.props.resetOps()
        } else if (isAddBbm === false) {
            this.setState({ confirm: 'rejAddBbm' })
            this.openConfirm()
            this.props.resetOps()
        } else if (isDelBbm === false) {
            this.setState({ confirm: 'rejDelBbm' })
            this.openConfirm()
            this.props.resetOps()
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
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        const menu = level === '5' ? 'Revisi Area' : level === '2' ? "Revisi Finance" : level === '3' && 'Revisi Tax'
        this.prepareSelect()
        await this.props.getOps(token, 'all', 1, menu, 'all', 'revisi')
        this.setState({limit: value === undefined ? 10 : value.limit})
        // this.changeFilter('available')
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
        const {dataOps, noDis} = this.props.ops
        const newOps = []
        for (let i = 0; i < noDis.length; i++) {
            const index = dataOps.indexOf(dataOps.find(({no_transaksi}) => no_transaksi === noDis[i]))
            newOps.push(dataOps[index])
        }
        this.setState({filter: val, newOps: newOps})
    }

    prosesSubmitPre = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAssetAll(token, 1000, '', 1, 'asset')
        this.modalSubmitPre()
    }

    approveDataOps = async () => {
        const { detailOps } = this.props.ops
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailOps[0].no_transaksi
        }
        await this.props.approveOps(token, tempno)
        
    }

    prosesSubmitRevisi = async () => {
        const {detailOps} = this.props.ops
        const token = localStorage.getItem("token")
        const tempno = {
            no: detailOps[0].no_transaksi
        }
        await this.props.submitRevisi(token, tempno)
        this.dataSendEmail('approve')
    }

    dataSendEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { detailOps } = this.props.ops
        const { draftEmail } = this.props.email
        const { message, subject } = this.state
        const typeKasbon = detailOps.find(({type_kasbon}) => type_kasbon === 'kasbon') !== undefined ? 'kasbon' : 'ops'
        const statusTrans = detailOps[0].status_transaksi === 2 ? 'pengajuan' : 'verifikasi'
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
            no: detailOps[0].no_transaksi,
            tipe: `${typeKasbon}`,
            menu: `${statusTrans} ${typeKasbon}`,
            proses: 'revisi',
            route: `${typeKasbon}`
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
            this.setState({confirm: 'submit'})
            this.openConfirm()
            this.openDraftEmail()
            this.openModalApprove()
            this.openModalRinci()
        }
    }

    prepSendEmail = async () => {
        const { detailOps } = this.props.ops
        const token = localStorage.getItem("token")
        const app = detailOps[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === '1' && tempApp.push(item)
            )
        })
        const tipe = 'revisi'
        const tempno = {
            no: detailOps[0].no_transaksi,
            kode: detailOps[0].kode_plant,
            jenis: 'ops',
            tipe: tipe,
            menu: 'Revisi Area (Operasional)'
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

    prosesEditOps = async (val) => {
        const token = localStorage.getItem("token")
        const {dataRinci} = this.state
        const data = {
            no_coa: dataRinci.no_coa,
            keterangan: val.keterangan,
            periode_awal: val.periode_awal,
            periode_akhir: val.periode_akhir,
            nilai_ajuan: val.nilai_ajuan,
            bank_tujuan: this.state.bank,
            norek_ajuan: val.norek_ajuan,
            nama_tujuan: val.nama_tujuan,
            status_npwp: val.status_npwp === 'Tidak' ? 0 : 1,
            nama_npwp: val.status_npwp === 'Tidak' ? '' : val.nama_npwp,
            no_npwp: val.status_npwp === 'Tidak' ? '' : val.no_npwp,
            nama_ktp: val.status_npwp === 'Tidak' ? val.nama_ktp : '',
            no_ktp: val.status_npwp === 'Tidak' ? val.no_ktp : '',
            periode: ''
        }
        const tempno = {
            no: dataRinci.no_transaksi,
            id: dataRinci.id
        }
        await this.props.editOps(token, dataRinci.id, data)
        await this.props.appRevisi(token, tempno)
        await this.props.getDetail(token, tempno)
        this.openModalEdit()
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
            name: 'Draft Pengajuan Ops'
        }
        await this.props.getDocOps(token, tempno)
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
        await this.props.getAllMenu(token, 'reject')
        await this.props.getReason(token)
        const dataMenu = this.props.menu.dataAll
        const data = []
        dataMenu.map(item => {
            return (item.kode_menu === 'Ops' && data.push(item))
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

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailId(token, val)
        await this.props.getFinRek(token)
        await this.props.getDetailFinance(token)
        await this.props.getBbm(token, val)
        const { dataRek } = this.props.finance
        const spending = dataRek[0].rek_spending
        const zba = dataRek[0].rek_zba
        const bankcol = dataRek[0].rek_bankcol
        const temp = [
            {label: '-Pilih-', value: ''},
            spending !== '0' ? {label: `${spending}~Rekening Spending Card`, value: 'Rekening Spending Card'} : {value: '', label: ''},
            zba !== '0' ? {label: `${zba}~Rekening ZBA`, value: 'Rekening ZBA'} : {value: '', label: ''},
            bankcol !== '0' ? {label: `${bankcol}~Rekening Bank Coll`, value: 'Rekening Bank Coll'} : {value: '', label: ''}
        ]

        const {idOps} = this.props.ops

        this.setState({
            isLoading: true,
            rekList: temp,
            nama: idOps.nama_vendor, 
            alamat: idOps.alamat_vendor, 
            noNpwp: idOps.no_npwp, 
            noNik: idOps.no_ktp,
            norek: idOps.norek_ajuan,
            tiperek: idOps.tiperek,
            nilai_dpp: idOps.dpp,
            nilai_ppn: idOps.ppn,
            nilai_ajuan: idOps.nilai_ajuan,
            nilai_buku: idOps.nilai_buku,
            nilai_utang: idOps.nilai_utang,
            nilai_vendor: idOps.nilai_vendor,
            nilai_bayar: idOps.nilai_vendor,
            jenis_pph: idOps.jenis_pph,
            tipePpn: idOps.type_transaksi,
            tipeVendor: idOps.penanggung_pajak,
            status_npwp: idOps.status_npwp === 0 ? 'Tidak' : idOps.status_npwp === 1 ? 'Ya' : nonObject,
            dataSelFaktur: { no_faktur: idOps.no_faktur },
            type_kasbon: idOps.type_kasbon,
            tipeSkb: idOps.stat_skb,
            statBbm: idOps.stat_bbm
        })

        const { opsBbm } = this.props.ops
        this.setState({ dataBbm: opsBbm })

        const cekNpwp = idOps.no_npwp === '' || idOps.no_npwp === null ? null : idOps.no_npwp

        this.selectCoa({value: idOps.no_coa, label: `${idOps.no_coa} ~ ${idOps.nama_coa}`})
        this.prepNikNpwp(cekNpwp)
        this.selectTujuan(idOps.tujuan_tf)
        this.prepBank(idOps.bank_tujuan)
        
        setTimeout(() => {
            this.prepFaktur(idOps.no_faktur)
         }, 500)
        setTimeout(() => {
            this.cekTrans()
         }, 300)
         setTimeout(() => {
            this.setState({isLoading: false})
            this.openEdit()
         }, 1000)
    }

    openEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
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

    selectSkb = async (val) => {
        this.setState({tipeSkb: val})
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
                    diffDays < 90 && item.status === null && temp.push({value: item.id, label: `${item.no_faktur}~${item.nama}`})
                )
            })
            this.setState({fakturList: temp})
        }
    }

    selectTujuan = (val) => {
        if (val === 'PMA') {
            this.setState({tujuan_tf: val, bank: 'Bank Mandiri', digit: 13})
        } else {
            this.setState({tujuan_tf: val, bank: '', digit: 0})
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

    prepFaktur = (val) => {
        const {dataFaktur} = this.props.faktur
        const data = dataFaktur.find(({no_faktur}) => no_faktur === val)
        console.log({dataFaktur, val})
        if (data === undefined) {
            console.log('masuk prep faktur')
        } else {
            const nilai_ajuan = parseFloat(data.jumlah_dpp) + parseFloat(data.jumlah_ppn)
            this.setState({dataSelFaktur: data, nilai_ajuan: nilai_ajuan, nilai_dpp: data.jumlah_dpp, nilai_ppn: data.jumlah_ppn, tgl_faktur: data.tgl_faktur})
            setTimeout(() => {
                this.formulaTax()
             }, 500)
        }
    }

    cekTrans = () => {
        const { allCoa } = this.props.coa
        const {idOps} = this.props.ops
        const pph = idOps.jenis_pph
        const statNpwp = idOps.status_npwp
        const npwp = idOps.no_npwp === '' || idOps.no_npwp === null ? null : idOps.no_npwp
        const cekPph = pph === 'Non PPh' || pph === '' || pph === null ? 'Non PPh' : pph
        const trans = idOps.sub_coa
        const vendor = cekPph === 'Non PPh' ? nonObject : idOps.jenis_vendor !== null && idOps.jenis_vendor !== '' ? idOps.jenis_vendor : null
        const cekStat = cekPph === 'Non PPh' ? 'No Need NPWP/NIK' : statNpwp === 1 && npwp !== null ? 'NPWP' : 'NIK'
        const nilaiBuku = idOps.nilai_buku
        const nilaiUtang = idOps.nilai_utang
        // console.log({idOps, stat_npwp: idOps.status_npwp, npwp: idOps.no_npwp, nik: idOps.no_ktp})
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
            console.log(allCoa)
            console.log(selectCoa, vendor, trans, cekStat)
            this.selectTrans({value: selectCoa.id, label: `${selectCoa.gl_account} ~ ${selectCoa.jenis_transaksi}`})
            setTimeout(() => {
                this.selectJenis(selectCoa.type_transaksi)
            }, 300)    
        }
    }

    selectJenis = async (val) => {
        const {idTrans, jenisTrans, status_npwp} = this.state
        this.setState({jenisVendor: val, status_npwp: val === 'Badan' ? 'Ya' : status_npwp})
        setTimeout(() => {
            this.selectTrans({value: idTrans, label: jenisTrans})
         }, 100)
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
                this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis})
                this.formulaTax()
            } else if (jenisVendor === '' || jenisVendor === nonObject) {
                temp = cek
                jenis = ''
                this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis})
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
                    this.setState({idTrans: '', jenisTrans: '', dataTrans: {}, jenisVendor: ''})
                } else {
                    console.log('masuk not undefined')
                    temp = selectCoaFin === undefined ? selectCoa : selectCoaFin
                    jenis = jenisVendor === nonObject ? '' : jenisVendor
                    this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis})
                    this.formulaTax()
                }
            }
        }
        
    }

    formulaTax = (val, type) => {
        const {dataTrans, nilai_ajuan, tipeVendor, tipePpn, nilai_dpp, nilai_ppn, type_kasbon, tipeSkb} = this.state
        const nilai = nilai_ajuan
        const tipe = tipeVendor
        console.log(dataTrans)
        if (dataTrans.jenis_pph === 'Non PPh' || dataTrans.jenis_pph === undefined) {
            this.setState({nilai_ajuan: nilai, nilai_utang: 0, nilai_buku: nilai, nilai_vendor: nilai, tipeVendor: tipe})
        } else {
            const tarifPph = tipeSkb === 'SKB' ? '0%' : tipeSkb === 'SKT' ? '0.05%' : dataTrans.tarif_pph
            const grossup = tipeSkb === 'SKB' ? '1%' : tipeSkb === 'SKT' ? '1%' : dataTrans.dpp_grossup
            if (tipePpn === 'Ya' && type_kasbon !== 'kasbon') {
                if (tipe === 'PMA') {
                    const nilai_buku = nilai_dpp
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(tarifPph))
                    const nilai_vendor = Math.ceil((parseFloat(nilai_buku) + parseFloat(nilai_ppn)) - parseFloat(nilai_utang))
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                } else if (tipe === 'Vendor') {
                    const nilai_buku = nilai_dpp
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(tarifPph))
                    const nilai_vendor = Math.ceil((parseFloat(nilai_buku) + parseFloat(nilai_ppn)) - parseFloat(nilai_utang))
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                }
            } else {
                if (tipe === 'PMA') {
                    const nilai_buku = Math.ceil(parseFloat(nilai) / parseFloat(grossup))
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(tarifPph))
                    const nilai_vendor = nilai
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                } else if (tipe === 'Vendor') {
                    const nilai_buku = nilai
                    const nilai_utang = Math.ceil(parseFloat(nilai_buku) * parseFloat(tarifPph))
                    const nilai_vendor = Math.ceil(parseFloat(nilai) - parseFloat(nilai_utang))
                    this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                }
            }
        }
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

    selectTypePpn = async (val) => {
        if (val === 'Ya') {
            this.setState({tipePpn: val, tipeVendor: "Vendor"})
            setTimeout(() => {
                this.formulaTax()
            }, 200)
        } else {
            this.setState({dataSelFaktur: { no_faktur: '' }, tgl_faktur: ''})
            this.setState({tipePpn: val, nilai_dpp: 0, nilai_ppn: 0})
            setTimeout(() => {
                this.formulaTax()
            }, 200)
        }
    }

    cekEdit = (val) => {
        const { type_kasbon, nilai_ajuan } = this.state
        const nilaiAjuan = parseFloat(nilai_ajuan)
        const nilaiPo = parseFloat(val.nilai_po)
        const nilaiPr = parseFloat(val.nilai_pr)
        const cek = nilaiAjuan === nilaiPo && nilaiAjuan === nilaiPr ? true : false
        if (type_kasbon === 'kasbon' && val.type_po !== 'po') {
            this.editCartOps(val)
        } else if (type_kasbon === 'kasbon' && val.type_po === 'po' && cek === false) {
            this.setState({confirm: 'failEdit'})
            this.openConfirm()
        } else {
            this.editCartOps(val)
        }
    }

    editCartOps = async (val) => {
        const token = localStorage.getItem("token")
        const {idOps} = this.props.ops
        const {detFinance} = this.props.finance
        const { dataBbm, typeOut } = this.state
        
        const { dataTrans, nilai_buku, nilai_ajuan, nilai_utang, tgl_faktur, type_kasbon,
            nilai_vendor, tipeVendor, tipePpn, nilai_dpp, nilai_ppn, typeniknpwp,
            dataSelFaktur, noNpwp, noNik, nama, alamat, status_npwp } = this.state
        
        const data = {
            no_coa: this.state.no_coa,
            keterangan: val.keterangan,
            periode_awal: val.periode_awal,
            periode_akhir: val.periode_akhir,
            bank_tujuan: this.state.bank,
            norek_ajuan: this.state.tujuan_tf === "PMA" ? this.state.norek : val.norek_ajuan,
            nama_tujuan: this.state.tujuan_tf === 'PMA' ? `PMA-${detFinance.area}` : val.nama_tujuan,
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
            jenis_pph: this.state.jenisVendor === nonObject ? nonPph : this.state.tipeSkb === 'SKB' ? nonPph : this.state.tipeSkb === 'SKT' ? 'PPh Pasal 4(2)' : dataTrans.jenis_pph,
            tgl_faktur: tgl_faktur,
            typeniknpwp: typeniknpwp,
            type_kasbon: type_kasbon === 'kasbon' ? 'kasbon' : null,
            type_po: val.type_po,
            no_po: val.no_po,
            nilai_po: val.nilai_po,
            nilai_pr: val.nilai_pr,
            stat_skb: this.state.jenisVendor === nonObject ? '' : this.state.tipeSkb,
            stat_bbm: this.state.statBbm,
            km:  '',
            liter: '',
            no_pol: ''
        }
        const tempno = {
            no: idOps.no_transaksi,
            id: idOps.id
        }
        if (this.state.statBbm === 'ya' && dataBbm.length === 0 && typeOut !== 'delout') {
            this.setState({ confirm: 'nullBbm' })
            this.openConfirm()
        } else {
            await this.props.editOps(token, idOps.id, dataTrans.id, data )
            await this.props.appRevisi(token, tempno)
            this.setState({confirm: 'editcart'})
            this.openConfirm()
            await this.props.getDetail(token, tempno)
            // this.openEdit()
        }
    }

    onEnterVal = (val) => {
        this.setState({nilai_ajuan: val})
        setTimeout(() => {
            this.formulaTax()
         }, 200)
    }

    selectTipe = async (val) => {
        this.setState({tipeVendor: val})
        setTimeout(() => {
            this.formulaTax()
        }, 200)
    }

    selectNpwp = async (val) => {
        const {idTrans, jenisTrans} = this.state
        this.setState({status_npwp: val})
        setTimeout(() => {
            this.selectTrans({value: idTrans, label: jenisTrans})
         }, 100)
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
            this.getDataVendor(val)
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
            this.getDataVendor(val)
        } else {
            this.setState(
                { showOptions : false },
                console.log('Option lenght is short {} {}', val, val.length)
            )
        }
    }

    getDataVendor = async (val) => {
        const token = localStorage.getItem("token")
        const sendData = {
            noIdent: `${val}`
        }
        await this.props.getVendor(token, sendData)

        const { dataVendor } = this.props.vendor
        const listNpwp = [
            {value: '', label: '-Pilih-'}
        ]
        const listNik = [
            {value: '', label: '-Pilih-'}
        ]
        dataVendor.map(item => {
            return (
                item.no_npwp === 'TIDAK ADA' && item.no_ktp !== 'TIDAK ADA' ?
                    listNik.push({value: item.id, label: item.no_ktp}) 
                : item.no_ktp === 'TIDAK ADA' && item.no_npwp !== 'TIDAK ADA' ?
                    listNpwp.push({value: item.id, label: item.no_npwp}) 
                : listNpwp.push({value: item.id, label: item.no_npwp}) && listNik.push({value: item.id, label: item.no_ktp}) 
            )
        })
        this.setState({listNik: listNik, listNpwp: listNpwp, showOptions : true})
    }

    inputFaktur = (val) => {
        // const {dataSelFaktur} = this.state
        // const data = {
        //     no_faktur: val
        // }
        // const cek = dataSelFaktur.no_faktur.split('')
        // if (cek.length > 1 && val === '') {
        //     this.setState({dataSelFaktur: dataSelFaktur})
        // } else {
        //     this.setState({dataSelFaktur: data})
        // }
        if(val.length >= 16) {
            this.getDataFaktur(val)
        } else {
            console.log(`king ${val}`)
            this.setState({showOptions : false })
        }
    }

    getDataFaktur = async (val) => {
        const token = localStorage.getItem("token")
        const { noNpwp } = this.state
        // if (noNpwp === undefined || noNpwp === '') {
        //     console.log('npwp kosong')
        // } else {
            const sendData = {
                npwp: `${noNpwp}`,
                noFaktur: `${val}`
            }
            await this.props.getFaktur(token, sendData)
    
            const {dataFaktur} = this.props.faktur
            const temp = [
                {value: '', label: '-Pilih-'}
            ]
            dataFaktur.map(item => {
                const date1 = new Date(item.tgl_faktur)
                const date2 = new Date()
                const diffTime = Math.abs(date2 - date1)
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                console.log(diffDays)
                return (
                    diffDays < 90 && item.status === null && temp.push({value: item.id, label: `${item.no_faktur}~${item.nama}`})
                )
            })
            this.setState({fakturList: temp, showOptions : true})
        // }
    }


    selectNikNpwp = async (e) => {
        const { dataVendor } = this.props.vendor
        const idVal = e.val.value
        const data = dataVendor.find(({id}) => id === idVal)
        if (data === undefined) {
            console.log()
        } else {
            const tipeSkb = data.type_skb === null || data.type_skb === '' ? 'tidak' 
            : data.type_skb !== 'tidak' && moment(data.datel_skb).format('DD/MM/YYYY') < moment().format('DD/MM/YYYY') ? 'tidak' 
            : data.type_skb

            if (data.no_npwp === 'TIDAK ADA' || data.no_npwp === '' || data.no_npwp === null) {
                this.setState({dataList: data, tipeSkb: tipeSkb, nama: data.nama, alamat: data.alamat, noNpwp: data.no_npwp, noNik: data.no_ktp, typeniknpwp: 'auto'})
                this.formulaTax()
            } else {
                const {dataFaktur} = this.props.faktur
                const temp = [
                    {value: '', label: '-Pilih-'}
                ]
                this.setState({dataList: data, tipeSkb: tipeSkb, nama: data.nama, alamat: data.alamat, noNpwp: data.no_npwp, noNik: data.no_ktp, fakturList: temp, typeniknpwp: 'auto'})
                this.formulaTax()
            }
        }
    }

    inputAlamat = (val) => {
        this.setState({alamat: val})
    }

    selectFaktur = async (val) => {
        const idVal = val.value
        const {dataFaktur} = this.props.faktur
        console.log(`select faktur ${idVal}`)
        const data = dataFaktur.find(({id}) => id === idVal)
        if (data === undefined) {
            console.log()
        } else {
            const nilai_ajuan = parseFloat(data.jumlah_dpp) + parseFloat(data.jumlah_ppn)
            this.setState({ dataSelFaktur: data, nilai_ajuan: nilai_ajuan, nilai_dpp: data.jumlah_dpp, nilai_ppn: data.jumlah_ppn, tgl_faktur: data.tgl_faktur})
            setTimeout(() => {
                this.formulaTax()
            }, 100)
        }
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


    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {showOptions, type_kasbon, duplikat, dataBbm, detBbm, messUpload, statBbm, dataTrans, listReason, dataMenu, listMenu} = this.state
        const { detFinance } = this.props.finance
        const { dataReason } = this.props.reason
        const { noDis, detailOps, ttdOps, newOps, dataDoc, idOps } = this.props.ops
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
                                <div className={style.titleDashboard}>Revisi Operasional (Kasbon / Non Kasbon)</div>
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
                                                <th>TGL AJUAN</th>
                                                <th>STATUS</th>
                                                <th>ALASAN</th>
                                                <th>TIPE KASBON</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newOps.map(item => {
                                                return (
                                                    <tr>
                                                        <th>{newOps.indexOf(item) + 1}</th>
                                                        <th>{item.no_transaksi}</th>
                                                        <th>{item.cost_center}</th>
                                                        <th>{item.area}</th>
                                                        <th>{item.no_coa}</th>
                                                        <th>{item.nama_coa}</th>
                                                        <th>{item.keterangan}</th>
                                                        <th>{moment(item.start_ops).format('DD MMMM YYYY')}</th>
                                                        <th>{item.status_reject !== null && item.status_reject !== 0 ? item.history.split(',').reverse()[0] : item.status_transaksi === 2 ? 'Proses Approval' : ''}</th>
                                                        <th>{item.reason}</th>
                                                        <th>{item.type_kasbon === 'kasbon' ? 'Kasbon' : 'Non Kasbon'}</th>
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
                                                    <th>TGL AJUAN</th>
                                                    <th>STATUS</th>
                                                    <th>ALASAN</th>
                                                    <th>TIPE KASBON</th>
                                                    <th>OPSI</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newOps.map(item => {
                                                    return (
                                                        <tr>
                                                            <th>{newOps.indexOf(item) + 1}</th>
                                                            <th>{item.no_transaksi}</th>
                                                            <th>{item.cost_center}</th>
                                                            <th>{item.area}</th>
                                                            <th>{item.no_coa}</th>
                                                            <th>{item.nama_coa}</th>
                                                            <th>{item.keterangan}</th>
                                                            <th>{moment(item.start_ops).format('DD MMMM YYYY')}</th>
                                                            <th>{item.status_reject !== null && item.status_reject !== 0 ? item.history.split(',').reverse()[0] : item.status_transaksi === 2 ? 'Proses Approval' : ''}</th>
                                                            <th>{item.reason}</th>
                                                            <th>{item.type_kasbon === 'kasbon' ? 'Kasbon' : 'Non Kasbon'}</th>
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
                <Modal isOpen={
                    this.props.ops.isLoading 
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
                    || this.props.vendor.isLoading} size="sm">
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
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].no_transaksi : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailOps.length > 0 ? moment(detailOps[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
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
                                        <th>DPP</th>
                                        <th>PPN</th>
                                        <th>PPh</th>
                                        <th>NILAI YANG DIBAYARKAN</th>
                                        <th>TANGGAL TRANSFER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailOps.length !== 0 && detailOps.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{detailOps.indexOf(item) + 1}</th>
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
                                                <th>{item.dpp}</th>
                                                <th>{item.ppn}</th>
                                                <th>{item.nilai_utang}</th>
                                                <th>{item.nilai_bayar}</th>
                                                <th>-</th>
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
                            <Button color="primary"  onClick={() => this.openProsesModalDoc(detailOps[0])}>Dokumen</Button>
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
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>no ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].no_transaksi : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailOps.length > 0 ? moment(detailOps[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
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
                                        <th>DPP</th>
                                        <th>PPN</th>
                                        <th>PPh</th>
                                        <th>NILAI YANG DIBAYARKAN</th>
                                        <th>TANGGAL TRANSFER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailOps.length !== 0 && detailOps.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{detailOps.indexOf(item) + 1}</th>
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
                                                    {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
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
                                                {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
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
                                                    {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                                        <th className="headPre">
                                                            <div className="mb-2">-</div>
                                                            <div>-</div>
                                                        </th>
                                                    ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
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
                                                    {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                                        <td className="footPre">-</td>
                                                    ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
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
                                                    {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
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
                                                    {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
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
                                                    {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.map(item => {
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
                                                    {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.map(item => {
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
                            <div className='fpdTit'>cabang/depo : {detailOps.length > 0 ? detailOps[0].area : ''}</div>
                            <div className='fpdTit'>no : {detailOps.length > 0 ? detailOps[0].no_transaksi : ''}</div>
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
                            {detailOps.length !== 0 && detailOps.map(item => {
                                return (
                                    <Row className='mt-4'>
                                        <Col md={1} className='upper'>
                                            <div className='line'>{detailOps.indexOf(item) + 1}</div>
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
                        <div className='bold'>{detailOps.length > 0 ? detailOps[0].area : ''}, {moment(detailOps.length > 0 ? moment(detailOps[0].updatedAt).format('DD MMMM YYYY') : '').format('DD MMMM YYYY')}</div>
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
                                                    {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
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
                                                {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
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
                                                    {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                                        <th className="headPre">
                                                            <div className="mb-2">-</div>
                                                            <div>-</div>
                                                        </th>
                                                    ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
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
                                                    {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                                        <td className="footPre">-</td>
                                                    ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
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
                                                    {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
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
                                                    {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
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
                    onSubmit={(values) => {this.rejectOps(values)}}
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
                    ) : this.state.confirm === 'editcart' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menyimpan Perubahan Data</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failEdit' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Edit Data</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan nilai ajuan, nilai PO, dan nilai PR memiliki nilai yang sama</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejSubmit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal submit revisi, pastikan semua data reject telah diperbaiki</div>
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
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit Revisi</div>
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
                    ) : this.state.confirm === 'sucAddBbm' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menambahkan Data BBM</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'editBbm' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Mengupdate Data BBM</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'delBbm' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Mendelete Data BBM</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejAddBbm' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Data BBM</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>No Pol telah terdaftar </div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejEditBbm' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Mengupdate Data BBM</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>No Pol telah terdaftar </div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejDelBbm' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Mendelete Data BBM</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Server sedang ada masalah</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'upload' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Upload Data BBM</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'nullBbm' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Menyimpan Data</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Pastikan Data BBM telah diisi</div>
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
                                <div className={[style.sucUpdate, style.green, style.mb4]}>Terdapat Duplikasi pada no pol berikut</div>
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
                                <div className={[style.sucUpdate, style.green]}>Pastikan Data BBM Telah Ditambahkan</div>
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
            <Modal isOpen={this.state.modalEdit} className='modalrinci' size="xl">
                    <ModalHeader>
                        Edit Data Ajuan
                    </ModalHeader>
                    <ModalBody>
                            <Formik
                            initialValues = {{
                                keterangan: idOps.keterangan || '',
                                periode_awal: idOps.periode_awal || '',
                                periode_akhir: idOps.periode_akhir || '',
                                nilai_ajuan: idOps.nilai_ajuan || '',
                                norek_ajuan: idOps.norek_ajuan || '',
                                nama_tujuan: idOps.nama_tujuan || '',
                                status_npwp: idOps.status_npwp || '',
                                nama_npwp: idOps.nama_npwp || '',
                                no_npwp: idOps.no_npwp || '',
                                no_ktp: idOps.no_ktp || '',
                                nama_ktp: idOps.nama_ktp || '',
                                nama_vendor: idOps.nama_vendor || '',
                                alamat_vendor: idOps.alamat_vendor || '',
                                penanggung_pajak: idOps.penanggung_pajak || '',
                                type_transaksi: idOps.type_transaksi || '',
                                no_faktur: idOps.no_faktur || '',
                                dpp: idOps.dpp || 0,
                                ppn: idOps.ppn || 0,
                                tgl_tagihanbayar: idOps.tgl_tagihanbayar || '',
                                type_po: idOps.type_po || '',
                                no_po: idOps.no_po || '',
                                nilai_po: idOps.nilai_po || 0,
                                nilai_pr: idOps.nilai_pr || 0
                            }}
                            validationSchema = {addSchema}
                            onSubmit={(values) => {this.cekEdit(values)}}
                            >
                            {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
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
                                                    value={detFinance.area}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Profit center</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled
                                                    type= "text" 
                                                    className="inputRinci"
                                                    value={detFinance.profit_center}
                                                    />
                                                </Col>
                                            </Row>
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
                                            {/* {statBbm === 'ya' && this.state.idTrans !== '' && (
                                                <>
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>No Pol</Col>
                                                        <Col md={9} className="colRinci">:  <Input
                                                            type= "text" 
                                                            className="inputRinci"
                                                            value={values.no_pol}
                                                            onBlur={handleBlur("no_pol")}
                                                            onChange={handleChange('no_pol')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {values.no_pol === '' || values.no_pol === null ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>Besar Pengisisan BBM (Liter)</Col>
                                                        <Col md={9} className="colRinci">: 
                                                            <NumberInput
                                                                // isDisabled={this.state.jenisVendor === '' ? true : false}
                                                                className="inputRinci1"
                                                                value={values.liter}
                                                                // placeholder={this.state.jenisTrans}
                                                                onValueChange={val => setFieldValue("liter", val.floatValue)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {values.liter === 0 || values.liter === null ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>KM Pengisian</Col>
                                                        <Col md={9} className="colRinci">: 
                                                            <NumberInput
                                                                className="inputRinci1"
                                                                value={values.km}
                                                                // placeholder={this.state.jenisTrans}
                                                                onValueChange={val => setFieldValue("km", val.floatValue)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {values.km === 0 || values.km === null ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null}
                                                </>
                                            )} */}
                                            {idOps.type_kasbon === 'kasbon' && (
                                                <>
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>Tipe PO</Col>
                                                        <Col md={9} className="colRinci">: 
                                                            <Input
                                                                type= "select" 
                                                                className="inputRinci"
                                                                disabled={this.state.idTrans === '' ? true : false}
                                                                value={values.type_po}
                                                                onBlur={handleBlur('type_po')}
                                                                onChange={handleChange('type_po')}
                                                                >
                                                                    <option value=''>Pilih</option>
                                                                    <option value="po">PO</option>
                                                                    <option value="non po">Non PO</option>
                                                            </Input>
                                                        </Col>
                                                    </Row>
                                                    {values.type_po === '' ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>No PO</Col>
                                                        <Col md={9} className="colRinci">:  <Input
                                                            type= "text" 
                                                            disabled={values.type_po === 'po' ? false : true}
                                                            className="inputRinci"
                                                            value={values.no_po}
                                                            onBlur={handleBlur("no_po")}
                                                            onChange={handleChange('no_po')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {values.type_po === 'po' && values.no_po === '' ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>Nilai PO</Col>
                                                        <Col md={9} className="colRinci">:
                                                            <NumberInput
                                                                disabled={values.type_po === 'po' ? false : true}
                                                                className="inputRinci1"
                                                                value={values.nilai_po}
                                                                onValueChange={val => setFieldValue("nilai_po", val.floatValue)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {values.type_po === 'po' && values.nilai_po === 0 ? (
                                                        <div className='txtError'>must be filled</div>
                                                    ) : null}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>Nilai PR</Col>
                                                        <Col md={9} className="colRinci">:
                                                            <NumberInput
                                                                disabled={values.type_po === 'po' ? false : true}
                                                                className="inputRinci1"
                                                                value={values.nilai_pr}
                                                                onValueChange={val => setFieldValue("nilai_pr", val.floatValue)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {values.type_po === 'po' && values.nilai_pr === 0 ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null}
                                                </>
                                            )}
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
                                                        this.state.idTrans === '' ? true 
                                                        : this.state.jenisVendor === nonObject && listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? false
                                                        : this.state.jenisVendor === nonObject ? true
                                                        : this.state.jenisVendor === 'Badan' ? true 
                                                        : false
                                                    }
                                                    type= "select" 
                                                    className="inputRinci"
                                                    value={(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? nonObject : this.state.status_npwp}
                                                    onChange={e => this.selectNpwp(e.target.value)}
                                                    >
                                                        <option value=''>Pilih</option>
                                                        <option value="Ya">Ya</option>
                                                        <option value="Tidak">Tidak</option>
                                                        {(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) && (
                                                            <option value={nonObject}>{nonObject}</option>
                                                        )}
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
                                                        isDisabled={(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? true : this.state.status_npwp === 'Ya' ? false : true}
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
                                                        value={(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? { value: '', label: '' } : this.state.status_npwp === 'Ya' ? {value: this.state.noNpwp, label: this.state.noNpwp} : { value: '', label: '' }}
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
                                                        isDisabled={(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? true : this.state.status_npwp === 'Tidak' ? false : true}
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
                                                        value={(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? { value: '', label: '' } : this.state.status_npwp === 'Tidak' ? {value: this.state.noNik, label: this.state.noNik} : { value: '', label: '' }}
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
                                                    value={(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? nonObject : this.state.nama}
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
                                                    type= "text" 
                                                    className="inputRinci"
                                                    // disabled={
                                                    //     this.state.jenisVendor === nonObject && listGl.find((e) => e === parseInt(this.state.no_coa)) !== undefined ? false
                                                    //     : this.state.jenisVendor === nonObject ? true
                                                    //     : false
                                                    // }
                                                    disabled
                                                    value={(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? nonObject : this.state.alamat}
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
                                                        isDisabled={idOps.type_kasbon === 'kasbon' ? true : this.state.tipePpn === "Ya" ? false : true}
                                                        options={showOptions ? this.state.fakturList : [{value: '', label: '-Pilih-'}]}
                                                        onChange={e => this.selectFaktur(e)}
                                                        onInputChange={e => this.inputFaktur(e)}
                                                        isSearchable
                                                        components={
                                                            {
                                                              DropdownIndicator: () => null,
                                                            }
                                                        }
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
                                                        statBbm === 'ya' ? true
                                                        : type_kasbon === 'kasbon' && this.state.idTrans !== '' ? false
                                                        : this.state.idTrans === '' ? true 
                                                        : this.state.tipePpn === "Ya" || this.state.tipePpn === "" ? true
                                                        : false
                                                    }
                                                    className="inputRinci1"
                                                    value={this.state.nilai_ajuan}
                                                    onValueChange={val => this.onEnterVal(val.floatValue)}
                                                />
                                                </Col>
                                            </Row>
                                            {(this.state.nilai_ajuan === 0 || this.state.nilai_ajuan === undefined) && this.state.tipePpn === "Tidak" ? (
                                                <text className={style.txtError}>must be filled with number</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                            <Col md={3}>Vendor Memiliki SKB / SKT</Col>
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
                                                disabled
                                                // disabled={this.state.idTrans === '' ? true : false}
                                                // value={values.penanggung_pajak}
                                                // onBlur={handleBlur("penanggung_pajak")}
                                                onChange={e => {this.selectSkb(e.target.value)}}
                                                >
                                                    <option value=''>Pilih</option>
                                                    <option value="SKB">SKB</option>
                                                    <option value="SKT">SKT</option>
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
                                                    value={this.state.jenisVendor === nonObject ? nonPph
                                                    : this.state.tipeSkb === 'SKB' ? nonPph 
                                                    : this.state.tipeSkb === 'SKT' ? 'PPh Pasal 4(2)' 
                                                    : dataTrans.jenis_pph}
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
                                                        <option value="Outlest">Outlest</option>
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
                                                    value={this.state.tujuan_tf === 'PMA' ? `PMA-${detFinance.area}` : values.nama_tujuan}
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
                                        </div>
                                    </div>
                                </div>
                                {statBbm === 'ya' && this.state.idTrans !== '' && dataBbm.length > 0 &&
                                    <>
                                        <div className='mt-3 mb-3'>
                                            List Data BBM
                                        </div>
                                        <Table striped bordered hover responsive className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>No Pol</th>
                                                    <th>Besar Pengisisan BBM (Liter)</th>
                                                    <th>KM Pengisian</th>
                                                    <th>Nominal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataBbm.length !== 0 && dataBbm.map(item => {
                                                    return (
                                                        <tr>
                                                            <th>{dataBbm.indexOf(item) + 1}</th>
                                                            <td>{item.no_pol}</td>
                                                            <td>{item.liter}</td>
                                                            <td>{item.km}</td>
                                                            <td>{item.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </>
                                }
                                {statBbm === 'ya' && this.state.idTrans !== '' ? (
                                    <div className='row justify-content-md-center mt-4 mb-4'>
                                        <div className='mainRinci2' onClick={this.openOpsBbm}>
                                            <CiCirclePlus size={70} className='mb-2 secondary' color='secondary' />
                                            <div className='secondary'>Tambah Data BBM</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='row justify-content-md-center mt-4 mb-4'>
                                    </div>
                                )}
                                <div className="modalFoot mt-4">
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
                                            : this.state.jenisVendor !== nonObject && this.state.tipeSkb === '' ? true
                                            : this.state.tipePpn === "Tidak" && (this.state.nilai_ajuan === 0 || this.state.nilai_ajuan === undefined) ? true
                                            : false } 
                                            color="primary" 
                                            onClick={handleSubmit}>
                                            Save
                                        </Button>
                                        <Button className="" size="md" color="secondary" onClick={() => this.openEdit()}>Close</Button>
                                    </div>
                                </div>
                            </>
                            )}
                            </Formik>
                    </ModalBody>
                </Modal>
                <Modal size="xl" toggle={this.openBbm} isOpen={this.state.modalBbm}>
                    <ModalHeader>
                        List Data BBM
                    </ModalHeader>
                    <ModalBody>
                        <div className='rowCenter mb-3'>
                            <Button color="success" size="lg" className="mr-2" onClick={this.openAddBbm} >Add</Button>
                            <Button color="primary" size="lg" className="mr-2" onClick={this.openUpBbm} >Upload</Button>
                            <Button color="warning" size="lg" className="mr-2" onClick={this.downloadBbm} >Download</Button>
                        </div>
                        <Table striped bordered hover responsive className={style.tab}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>No Pol</th>
                                    <th>Besar Pengisisan BBM (Liter)</th>
                                    <th>KM Pengisian</th>
                                    <th>Nominal</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataBbm.length !== 0 && dataBbm.map(item => {
                                    return (
                                        <tr>
                                        <th>{dataBbm.indexOf(item) + 1}</th>
                                        <td>{item.no_pol}</td>
                                        <td>{item.liter}</td>
                                        <td>{item.km}</td>
                                        <td>{item.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                        <td>
                                            {/* {this.state.modalEdit === true ? (
                                                <Button color="danger" className="mr-4" onClick={() => this.confirmDel(this.setState({dataDel: item}))}>Delete</Button>
                                            ) : (
                                            <> */}
                                            <Button color="danger" className="mr-2" onClick={() => this.confirmDel(this.setState({dataDel: item}))}>Delete</Button>
                                            <Button color="info" onClick={() => this.openDetBbm(this.setState({detBbm: item}))}>Update</Button>
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
                <Modal isOpen={this.state.modalAddBbm} size="lg">
                    <ModalHeader>Add Data Bbm</ModalHeader>
                    <Formik
                    initialValues={{
                        liter: 0,
                        km: 0,
                        nominal: 0,
                        no_pol: ''
                    }}
                    validationSchema={bbmSchema}
                    onSubmit={(values) => {this.addDataBbm(values)}}
                    >
                    {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <Row className="mb-2 rowRinci">
                            <Col md={3}>No Pol</Col>
                            <Col md={9} className="colRinci">:  <Input
                                type= "text" 
                                className="inputRinci"
                                value={values.no_pol}
                                onBlur={handleBlur("no_pol")}
                                onChange={handleChange('no_pol')}
                                />
                            </Col>
                        </Row>
                        {values.no_pol === '' || values.no_pol === null || values.no_pol === undefined ? (
                            <text className={style.txtError}>must be filled</text>
                        ) : null}
                        <Row className="mb-2 rowRinci">
                            <Col md={3}>Besar Pengisisan BBM (Liter)</Col>
                            <Col md={9} className="colRinci">: 
                                <NumberInput
                                    // isDisabled={this.state.jenisVendor === '' ? true : false}
                                    className="inputRinci1"
                                    value={values.liter}
                                    // placeholder={this.state.jenisTrans}
                                    onValueChange={val => setFieldValue("liter", val.floatValue)}
                                />
                            </Col>
                        </Row>
                        {values.liter === 0 || values.liter === undefined ? (
                            <text className={style.txtError}>must be filled</text>
                        ) : null}
                        <Row className="mb-2 rowRinci">
                            <Col md={3}>KM Pengisian</Col>
                            <Col md={9} className="colRinci">: 
                                <NumberInput
                                    className="inputRinci1"
                                    value={values.km}
                                    // placeholder={this.state.jenisTrans}
                                    onValueChange={val => setFieldValue("km", val.floatValue)}
                                />
                            </Col>
                        </Row>
                        {values.km === 0 || values.km === undefined ? (
                            <text className={style.txtError}>must be filled</text>
                        ) : null}
                        <Row className="mb-2 rowRinci">
                            <Col md={3}>Nominal</Col>
                            <Col md={9} className="colRinci">: 
                                <NumberInput
                                    className="inputRinci1"
                                    value={values.nominal}
                                    // placeholder={this.state.jenisTrans}
                                    onValueChange={val => setFieldValue("nominal", val.floatValue)}
                                />
                            </Col>
                        </Row>
                        {values.nominal === 0 || values.nominal === undefined ? (
                            <text className={style.txtError}>must be filled</text>
                        ) : null}
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button 
                                className="mr-2" 
                                onClick={handleSubmit} color="primary"
                                disabled={
                                    (values.no_pol === undefined || values.km === undefined || values.liter === undefined || values.nominal === undefined) ? true
                                    : (values.no_pol === '' || values.km === 0 || values.liter === 0 || values.nominal === 0) ? true 
                                : false} 
                                >Save</Button>
                                <Button className="" onClick={this.openAddBbm}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.detModBbm} size="lg">
                    <ModalHeader>Update Data Bbm</ModalHeader>
                    <Formik
                    initialValues={{
                        liter: detBbm.liter,
                        km: detBbm.km,
                        nominal: detBbm.nominal,
                        no_pol: detBbm.no_pol
                    }}
                    validationSchema={bbmSchema}
                    onSubmit={(values) => {this.editDataBbm(values)}}
                    >
                    {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <Row className="mb-2 rowRinci">
                            <Col md={3}>No Pol</Col>
                            <Col md={9} className="colRinci">:  <Input
                                type= "text" 
                                className="inputRinci"
                                value={values.no_pol}
                                onBlur={handleBlur("no_pol")}
                                onChange={handleChange('no_pol')}
                                />
                            </Col>
                        </Row>
                        {values.no_pol === '' || values.no_pol === null || values.no_pol === undefined ? (
                            <text className={style.txtError}>must be filled</text>
                        ) : null}
                        <Row className="mb-2 rowRinci">
                            <Col md={3}>Besar Pengisisan BBM (Liter)</Col>
                            <Col md={9} className="colRinci">: 
                                <NumberInput
                                    // isDisabled={this.state.jenisVendor === '' ? true : false}
                                    className="inputRinci1"
                                    value={values.liter}
                                    // placeholder={this.state.jenisTrans}
                                    onValueChange={val => setFieldValue("liter", val.floatValue)}
                                />
                            </Col>
                        </Row>
                        {values.liter === 0 || values.liter === undefined ? (
                            <text className={style.txtError}>must be filled</text>
                        ) : null}
                        <Row className="mb-2 rowRinci">
                            <Col md={3}>KM Pengisian</Col>
                            <Col md={9} className="colRinci">: 
                                <NumberInput
                                    className="inputRinci1"
                                    value={values.km}
                                    // placeholder={this.state.jenisTrans}
                                    onValueChange={val => setFieldValue("km", val.floatValue)}
                                />
                            </Col>
                        </Row>
                        {values.km === 0 || values.km === undefined ? (
                            <text className={style.txtError}>must be filled</text>
                        ) : null}
                        <Row className="mb-2 rowRinci">
                            <Col md={3}>Nominal</Col>
                            <Col md={9} className="colRinci">: 
                                <NumberInput
                                    className="inputRinci1"
                                    value={values.nominal}
                                    // placeholder={this.state.jenisTrans}
                                    onValueChange={val => setFieldValue("nominal", val.floatValue)}
                                />
                            </Col>
                        </Row>
                        {values.nominal === 0 || values.nominal === undefined ? (
                            <text className={style.txtError}>must be filled</text>
                        ) : null}
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button 
                                className="mr-2" 
                                onClick={handleSubmit} color="primary"
                                disabled={
                                    (values.no_pol === undefined || values.km === undefined || values.liter === undefined || values.nominal === undefined) ? true
                                    : (values.no_pol === '' || values.km === 0 || values.liter === 0 || values.nominal === 0) ? true 
                                    : false }
                                >Save</Button>
                                <Button className="" onClick={this.openDetBbm}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.modUpBbm} >
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
                            <Button className='mr-2' color="primary" disabled={this.state.fileUpload === "" ? true : false} onClick={this.uploadDataBbm}>Upload</Button>
                            <Button onClick={this.openUpBbm}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalDelBbm} toggle={this.confirmDel} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk delete data bbm ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.delDataBbm()}>Ya</Button>
                                <Button color="secondary" onClick={this.confirmDel}>Tidak</Button>
                            </div>
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
    ops: state.ops,
    menu: state.menu,
    notif: state.notif,
    reason: state.reason,
    dokumen: state.dokumen,
    email: state.email,
    vendor: state.vendor,
    bank: state.bank,
    pagu: state.pagu,
    faktur: state.faktur,
    rekening: state.rekening,
    coa: state.coa,
    finance: state.finance,
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNameApprove: approve.getNameApprove,
    getDetailFinance: finance.getDetailFinance,
    getDepo: depo.getDepo,
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
    uploadDocOps: ops.uploadDocCart,
    editOps: ops.editOps,
    appRevisi: ops.appRevisi,
    submitRevisi: ops.submitRevisi,
    showDokumen: dokumen.showDokumen,
    getPagu: pagu.getPagu,
    getVendor: vendor.getVendor,
    getFaktur: faktur.getFaktur,
    getBank: bank.getBank,
    getDetailId: ops.getDetailId,
    getCoa: coa.getCoa,
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    getFinRek: finance.getFinRek,
    addNotif: notif.addNotif,
    uploadBbm: ops.uploadBbm,
    updateBbm: ops.updateBbm,
    addBbm: ops.addBbm,
    getBbm: ops.getBbm,
    deleteBbm: ops.deleteBbm
}

export default connect(mapStateToProps, mapDispatchToProps)(RevisiOps)
