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
import vendor from '../../redux/actions/vendor'
import {BsCircle} from 'react-icons/bs'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList} from 'react-icons/fa'
import Sidebar from "../../components/Header";
import { AiOutlineFileExcel, AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import style from '../../assets/css/input.module.css'
import placeholder from  "../../assets/img/placeholder.png"
import user from '../../redux/actions/user'
import ops from '../../redux/actions/ops'
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
import faktur from '../../redux/actions/faktur'
import {default as axios} from 'axios'
import { CiCirclePlus, CiEdit } from "react-icons/ci";
// import TableStock from '../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import dokumen from '../../redux/actions/dokumen'
import NavBar from '../../components/NavBar'
import email from '../../redux/actions/email'
import Email from '../../components/Ops/Email'
import NumberInput from '../../components/NumberInput'
import readXlsxFile from 'read-excel-file'
import ExcelJS from "exceljs"
import fs from "file-saver"
import { MdUpload, MdDownload, MdEditSquare, MdAddCircle, MdDelete } from "react-icons/md";
import Countdown from 'react-countdown'

const {REACT_APP_BACKEND_URL} = process.env
const nonObject = 'Non Object PPh'
const nonPph = 'Non PPh'
const telkom = '010000131093000'

const addSchema = Yup.object().shape({
    keterangan: Yup.string().required("must be filled"),
    periode_awal: Yup.date().required("must be filled"),
    periode_akhir: Yup.date().required('must be filled'),
    dpp: Yup.number(),
    ppn: Yup.number(),
    id_pelanggan: Yup.number(),
    // nilai_ajuan: Yup.string().required("must be filled"),
})

const bbmSchema = Yup.object().shape({
    no_pol: Yup.string().required("must be filled"),
    nominal: Yup.number().required('must be filled'),
    liter: Yup.number().required('must be filled'),
    km: Yup.number().required('must be filled'),
    date_bbm: Yup.date().required('must be filled'),
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});


class CartOps extends Component {
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
            fakturList: [{value: '', label: '-Pilih-'}],
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
            type_kasbon: '',
            modalDelete: false,
            dataDelete: '',
            showOptions: false,
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
            typeOut: '',
            type_po: '',
            infoError: ''
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
            { header: 'Nominal', key: 'c4' },
            { header: 'Tgl Pengisian BBM', key: 'c5' }
        ]

        dataBbm.map((item, index) => {
            return (ws.addRow(
                {
                    c1: item.no_pol,
                    c2: item.liter,
                    c3: item.km,
                    c4: item.nominal,
                    c5: item.date_bbm
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
            no_pol: val.no_pol,
            date_bbm: val.date_bbm
        }
        if (dataBbm.length > 0) {
            // const cek = dataBbm.find(({ no_pol }) => (data.no_pol !== '' && no_pol === data.no_pol))
            const cek = dataBbm.find((item) => (data.no_pol !== '' && item.no_pol === data.no_pol && parseFloat(item.km) === parseFloat(data.km)))
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
            no_pol: val.no_pol,
            date_bbm: val.date_bbm
        }
        const dataUp = []
        if (dataBbm.length > 0) {
            for (let i = 0; i < dataBbm.length; i++) {
                const dataCek = JSON.stringify(dataBbm[i])
                if (JSON.stringify(detBbm) === dataCek) {
                    // const cek = dataBbm.find(({ no_pol }) => (data.no_pol !== '' && no_pol === data.no_pol && no_pol !== detBbm.no_pol))
                    const cek = dataBbm.find((item) => (data.no_pol !== '' && item.no_pol === data.no_pol && parseFloat(item.km) === parseFloat(data.km)))
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
            no_pol: val.no_pol,
            date_bbm: val.date_bbm
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
            'Nominal',
            'Tgl Pengisian BBM',
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
                const noid = `no pol: ${dataOps[0]}~km:${dataOps[2]}~tgl pengisian:${dataOps[4]}`
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
                        date_bbm: dataOps[4],
                    }

                    const noPol = dataOps[0]
                    const liter = dataOps[1]
                    const km = dataOps[2]
                    const nominal = dataOps[3]
                    const dateBbm = dataOps[4]

                    const dataNominal = nominal === null || (nominal.toString().split('').filter((item) => item !== '.' && item !== ',' && isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Nominal Diisi dengan Sesuai' }
                        : null
                    const dataLiter = liter === null || (liter.toString().split('').filter((item) => item !== '.' && item !== ',' && isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Data Liter Diisi dengan Sesuai' }
                        : null
                    const dataKm = km === null || (km.toString().split('').filter((item) => item !== '.' && item !== ',' && isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Data KM Diisi dengan Sesuai' }
                        : null
                    const cekDate = dateBbm === null || dateBbm === '' || dateBbm.length === 0
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: `Pastikan Tgl Pengisian Bbm Diisi dengan Sesuai` }
                        : null
                    const cekNopol = noPol === null || noPol === '' || noPol.length === 0
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: `Pastikan No Pol Diisi dengan Sesuai` }
                        : null

                    if (dataLiter !== null || dataKm !== null || dataNominal !== null || cekDate !== null || cekNopol !== null) {
                        const mesTemp = [dataLiter, dataKm, dataNominal, cekDate, cekNopol]
                        dataCek.push(mesTemp)
                    } else {
                        // const cek = dataBbm.find(({ no_pol }) => (data.no_pol !== '' && no_pol === data.no_pol))
                        const cek = dataBbm.find((item) => (data.no_pol !== '' && item.no_pol === data.no_pol && parseFloat(item.km) === parseFloat(data.km)))
                        console.log(cek)
                        if (cek !== undefined) {
                            console.log('masuk not undefined BBM')
                            cek.liter = data.liter
                            cek.nominal = data.nominal
                        } else {
                            console.log('masuk undefined BBM')
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
                        console.log(comb)
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
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel') {
            this.setState({ errMsg: 'Invalid file type. Only excel files are allowed.' })
            this.uploadAlert()
        } else {
            this.setState({ fileUpload: e.target.files[0] })
        }
    }

    setError = (val) => {
        this.setState({infoError: val, confirm: 'errfill'})
        setTimeout(() => {
            this.openConfirm()
        }, 100)
    }

    onChangeUpload = e => {
        const {size, type, name} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        const tipe = name.split('.')[name.split('.').length - 1]
        if (size > 25000000) {
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
            const { noops } = this.props.ops
            const { detail } = this.state
            const tempno = {
                no: noops
            }
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocOps(token, noops, detail.id, data)
            // this.props.uploadDocOps(token, tempno, data)
        }
    }

    openModalFaa = () => {
        this.setState({modalFaa: !this.state.modalFaa})
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
        this.getDataOps()
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
        // dataVendor.map(item => {
        //     return (
        //         item.no_npwp === 'TIDAK ADA' && item.no_ktp !== 'TIDAK ADA' ?
        //             listNik.push({value: item.id, label: item.no_ktp}) 
        //         : item.no_ktp === 'TIDAK ADA' && item.no_npwp !== 'TIDAK ADA' ?
        //             listNpwp.push({value: item.id, label: item.no_npwp}) 
        //         : listNpwp.push({value: item.id, label: item.no_npwp}) && listNik.push({value: item.id, label: item.no_ktp}) 
        //     )
        // })
        this.setState({
            options: temp, 
            bankList: bank, 
            transList: trans, 
            listNik: listNik, 
            listNpwp: listNpwp
        })
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
        const type = localStorage.getItem('tipeKasbon')
        const token = localStorage.getItem("token")
        this.setState({type_kasbon: type})
        await this.props.getCoa(token, type === 'kasbon' ? 'kasbon' :'ops')
        await this.props.getBank(token)
        // await this.props.getVendor(token)
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
        const {dataCart, noops} = this.props.ops
        const token = localStorage.getItem("token")
        const tipe = 'approve'
        const tempno = {
            no: noops,
            kode: dataCart[0].kode_plant,
            jenis: 'ops',
            tipe: tipe,
            menu: 'Pengajuan Operasional (Operasional)'
        }
        const data = {
            no: noops
        }
        await this.props.getApproval(token, data)
        await this.props.getDetail(token, data)
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    cekDok = async () => {
        const { dataDoc } = this.props.ops
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
        const type = localStorage.getItem('tipeKasbon')
        const tipeKasbon = type === 'kasbon' ? 'kasbon' :'ops'
        const { noops } = this.props.ops
        const { draftEmail } = this.props.email
        const { message, subject } = this.state
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        const tempno = {
            no: noops
        }
        const data = {
            draft: draftEmail,
            nameTo: draftEmail.to.fullname,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: noops,
            tipe: tipeKasbon,
            menu: `pengajuan ${tipeKasbon}`,
            proses: 'approve',
            route: tipeKasbon
        }
        await this.props.sendEmail(token, data)
        await this.props.submitOpsFinal(token, tempno)
        await this.props.addNotif(token, data)
        await this.props.getCart(token, type)
        this.openModalDoc()
        this.modalSubmitPre()
        this.openDraftEmail()
        this.openConfirm(this.setState({confirm: 'submit'}))
    }

    componentDidUpdate() {
        const { isAdd, isUpload, isEdit, isUpdateBbm, isUploadBbm, isAddBbm, isDelBbm } = this.props.ops
        const type = localStorage.getItem('tipeKasbon')
        const token = localStorage.getItem("token")
        if (isAdd === false) {
            this.openConfirm(this.setState({confirm: 'rejCart'}))
            this.props.resetOps()
        } else if (isUpload === true) {
            const { noops } = this.props.ops
            const tempno = {
                no: noops,
                name: 'Draft Pengajuan Operasional'
            }
            this.props.getDocOps(token, tempno)
            this.props.resetOps()
        } else if (isEdit === true) {
            this.props.getCart(token, type)
            this.setState({confirm: 'editcart'})
            this.openConfirm()
            this.props.resetOps()
            // this.setState({modalEdit: false})
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

    submitOps = async (val) => {
        const token = localStorage.getItem("token")
        const {listMut, type_kasbon} = this.state
        const data = {
            list: listMut,
            tipe: type_kasbon
        }
        this.openModalConfirm()
        await this.props.submitOps(token, data)
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

    openConfirm = (val) => {
        if (val === false) {
            this.setState({modalConfirm: false})
        } else {
            this.setState({modalConfirm: true})
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

    getDataCart = async (value) => {
        const token = localStorage.getItem("token")
        const type = localStorage.getItem('tipeKasbon')
        await this.props.getCart(token, type)
        // await this.props.getPagu(token)
        this.prepareSelect()
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataOps = async (value) => {
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
        const {dataCart} = this.props.ops
        if (listMut.length > 0) {
            const temp = []
            for (let i = 0; i < listMut.length; i++) {
                const dataCek = dataCart.find(item => item.id === listMut[i])
                if (temp.find(item => item.no_coa === dataCek.no_coa)) {
                    temp.push(dataCek)
                } else if (i === 0) {
                    temp.push(dataCek)
                }
            }
            if (temp.length === listMut.length) {
                this.modalSubmitPre()
            } else {
                this.openConfirm(this.setState({confirm: 'failSubCoa'}))
            }
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


    deleteCart = async (val) => {
        const token = localStorage.getItem("token")
        const {dataDelete} = this.state
        const type = localStorage.getItem('tipeKasbon')
        await this.props.deleteCart(token, dataDelete)
        await this.props.getCart(token, type)
        this.setState({confirm: 'delCart'})
        this.openConfirm()
        this.openModalDelete()
    }

    cekAdd = (val) => {
        const { type_kasbon, nilai_ajuan } = this.state
        const nilaiAjuan = parseFloat(nilai_ajuan)
        const nilaiPo = parseFloat(val.nilai_po)
        const nilaiPr = parseFloat(val.nilai_pr)
        const cek = nilaiAjuan === nilaiPo && nilaiAjuan === nilaiPr ? true : false
        if (type_kasbon === 'kasbon' && this.state.type_po !== 'po') {
            this.addCartOps(val)
        } else if (type_kasbon === 'kasbon' && this.state.type_po === 'po' && cek === false) {
            this.setState({confirm: 'failAdd'})
            this.openConfirm()
        } else {
            this.addCartOps(val)
        }
    }
    

    addCartOps = async (val) => {
        const token = localStorage.getItem("token")
        const type = localStorage.getItem('tipeKasbon')
        const {detFinance} = this.props.finance
        const { dataBbm } = this.state

        const { dataTrans, nilai_buku, nilai_ajuan, nilai_utang, tgl_faktur,
            nilai_vendor, tipeVendor, tipePpn, nilai_dpp, nilai_ppn, typeniknpwp, type_kasbon,
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
            status_npwp: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? 2 :status_npwp === 'Tidak' ? 0 : status_npwp === 'Ya' ? 1 : 2,
            nama_npwp: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : status_npwp === 'Ya' ? nama : '',
            no_npwp: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : status_npwp === 'Ya' ? noNpwp : '',
            nama_ktp: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : status_npwp === 'Tidak' ? nama : '',
            no_ktp: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : status_npwp === 'Tidak' ? noNik : '',
            periode: '',
            nama_vendor: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : nama,
            alamat_vendor: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : alamat,
            penanggung_pajak: tipeVendor,
            type_transaksi: tipePpn,
            no_faktur: tipePpn === 'Ya' ? dataSelFaktur.no_faktur : '',
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
            type_po: this.state.type_po,
            no_po: val.no_po,
            nilai_po: val.nilai_po,
            nilai_pr: val.nilai_pr,
            stat_skb: this.state.jenisVendor === nonObject ? '' : this.state.tipeSkb,
            stat_bbm: this.state.statBbm,
            km: this.state.statBbm === 'ya' ? val.km : '',
            liter: this.state.statBbm === 'ya' ? val.liter : '',
            no_pol: this.state.statBbm === 'ya' ? val.no_pol : '',
            id_pelanggan: val.id_pelanggan
        }
        if (this.state.statBbm === 'ya' && dataBbm.length === 0) {
            this.setState({ confirm: 'nullBbm' })
            this.openConfirm()
        } else {
            if (this.state.statBbm === 'ya') {
                await this.props.addCart(token, data, dataTrans.id)
            
                const { dataAdd } = this.props.ops
                const send = {
                    id: dataAdd.id,
                    list: dataBbm
                }
                await this.props.uploadBbm(token, send)
    
                this.openModalAdd()
                this.props.getCart(token, type)
                this.openConfirm(this.setState({confirm: 'addcart'}))
            } else {
                await this.props.addCart(token, data, dataTrans.id)
                this.openModalAdd()
                this.props.getCart(token, type)
                this.openConfirm(this.setState({confirm: 'addcart'}))
            }
            
        }
    }

    cekEdit = (val) => {
        const { type_kasbon, nilai_ajuan } = this.state
        const nilaiAjuan = parseFloat(nilai_ajuan)
        const nilaiPo = parseFloat(val.nilai_po)
        const nilaiPr = parseFloat(val.nilai_pr)
        const cek = nilaiAjuan === nilaiPo && nilaiAjuan === nilaiPr ? true : false
        if (type_kasbon === 'kasbon' && this.state.type_po !== 'po') {
            this.editCartOps(val)
        } else if (type_kasbon === 'kasbon' && this.state.type_po === 'po' && cek === false) {
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
            status_npwp: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? 2 : status_npwp === 'Tidak' ? 0 : status_npwp === 'Ya' ? 1 : 2,
            nama_npwp: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : status_npwp === 'Tidak' ? '' : status_npwp === 'Ya' ? nama : '',
            no_npwp: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : status_npwp === 'Tidak' ? '' : status_npwp === 'Ya' ? noNpwp : '',
            nama_ktp: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : status_npwp === 'Tidak' ? nama : status_npwp === 'Ya' ? '' : '',
            no_ktp: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : status_npwp === 'Tidak' ? noNik : status_npwp === 'Ya' ? '' : '',
            periode: '',
            nama_vendor: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : nama,
            alamat_vendor: (this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : alamat,
            penanggung_pajak: tipeVendor,
            type_transaksi: tipePpn,
            no_faktur: tipePpn === 'Ya' ? dataSelFaktur.no_faktur : '',
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
            type_po: this.state.type_po,
            no_po: val.no_po,
            nilai_po: val.nilai_po,
            nilai_pr: val.nilai_pr,
            stat_skb: this.state.jenisVendor === nonObject ? '' : this.state.tipeSkb,
            stat_bbm: this.state.statBbm,
            km: this.state.statBbm === 'ya' ? val.km : '',
            liter: this.state.statBbm === 'ya' ? val.liter : '',
            no_pol: this.state.statBbm === 'ya' ? val.no_pol : '',
            id_pelanggan: val.id_pelanggan
        }
        if (this.state.statBbm === 'ya' && dataBbm.length === 0 && typeOut !== 'delout') {
            this.setState({ confirm: 'nullBbm' })
            this.openConfirm()
        } else {
            await this.props.editOps(token, idOps.id, dataTrans.id, data)
            this.setState({ typeOut: '' })
            // this.openEdit()
        }
    }

    prosesModalFpd = () => {
        const {dataCart} = this.props.ops
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
            tipeSkb: '',
            statBbm: '',
            dataBbm: []
        })
        this.openModalAdd()
    }

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailId(token, val)
        await this.props.getFinRek(token)
        await this.props.getDetailFinance(token)
        await this.props.getBbm(token, val)
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
            tgl_faktur: idOps.tgl_faktur,
            dataSelFaktur: { no_faktur: idOps.no_faktur },
            tipeSkb: idOps.stat_skb,
            statBbm: idOps.stat_bbm
        })

        const { opsBbm } = this.props.ops
        this.setState({ dataBbm: opsBbm })
        
        const cekNpwp = idOps.no_npwp === '' || idOps.no_npwp === null ? null : idOps.no_npwp

        this.selectCoa({value: idOps.no_coa, label: `${idOps.no_coa} ~ ${idOps.nama_coa}`})
        // this.prepNikNpwp(cekNpwp)
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
        const { noops } = this.props.ops
        const tempno = {
            no: noops,
            name: 'Draft Pengajuan Operasional'
        }
        await this.props.getDocOps(token, tempno)
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
        this.setState({
            jenisVendor: val, 
            status_npwp: val === 'Badan' ? 'Ya' : val === nonObject ? nonObject : status_npwp
        })
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
        const cekVal = val === 'Bank Mandiri' ? 'BANK MANDIRI' : val
        const data = dataBank.find(({name}) => name === cekVal)
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
                const date1 = moment(item.tgl_faktur).format('M')
                const date2 = moment().format('M')
                const diffTime = Math.abs(date2 - date1)
                const diffMonth = Math.floor(diffTime)
                return (
                    // diffMonth < 90 &&
                    (diffMonth <= 3 || item.force === 1) && item.status === null && temp.push({value: item.id, label: `${item.no_faktur}~${item.nama}`})
                )
            })
            this.setState({fakturList: temp})
        }
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
                setTimeout(() => {
                    this.formulaTax()
                }, 100)
            } else {
                const {dataFaktur} = this.props.faktur
                const temp = [
                    {value: '', label: '-Pilih-'}
                ]
                this.setState({dataList: data, tipeSkb: tipeSkb, nama: data.nama, alamat: data.alamat, noNpwp: data.no_npwp, noNik: data.no_ktp, fakturList: temp, typeniknpwp: 'auto'})
                setTimeout(() => {
                    this.formulaTax()
                }, 100)
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
        const { nomCoa } = this.props.coa
        const { jenisVendor, dataTrans } = this.state
        const statNpwp = this.state.status_npwp
        const cekStat = statNpwp === 'Ya' ? 'NPWP' : statNpwp === 'Tidak' ? 'NIK' : 'No Need NPWP/NIK'
        if (e.value === '') {
            this.setState()
        } else {
            let temp = {}
            let jenis = ''
            const cek = nomCoa.find(({id}) => id === e.value)
            if (cek.type_transaksi === nonObject) {
                temp = cek
                jenis = nonObject
                const cekBbm = temp.jenis_transaksi.split(' ').filter(item => item.toLowerCase() === 'bbm').length > 0 ? 'ya' : 'tidak'
                const cekIndi = temp.jenis_transaksi === 'Pembayaran Tagihan Internet (Indihome)' ? 'ya' : 'tidak'
                this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis, statBbm: cekBbm, type_po: temp.po.toLowerCase()})
                if (cekIndi === 'ya') {
                    this.selectAuto()
                } else {
                    setTimeout(() => {
                        this.formulaTax()
                     }, 100)
                }
            } else if (jenisVendor === '' || jenisVendor === nonObject) {
                temp = cek
                jenis = ''
                const cekBbm = temp.jenis_transaksi.split(' ').filter(item => item.toLowerCase() === 'bbm').length > 0 ? 'ya' : 'tidak'
                const cekIndi = temp.jenis_transaksi === 'Pembayaran Tagihan Internet (Indihome)' ? 'ya' : 'tidak'
                this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis, statBbm: cekBbm, type_po: temp.po.toLowerCase()})
                if (cekIndi === 'ya') {
                    this.selectAuto()
                } else {
                    setTimeout(() => {
                        this.formulaTax()
                     }, 100)
                }
            } else {
                const selectCoa = nomCoa.find(({type_transaksi, jenis_transaksi}) => 
                                    type_transaksi === jenisVendor && 
                                    jenis_transaksi === dataTrans.jenis_transaksi)
                const selectCoaFin = nomCoa.find(({type_transaksi, jenis_transaksi, status_npwp}) => 
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
                    const cekBbm = temp.jenis_transaksi.split(' ').filter(item => item.toLowerCase() === 'bbm').length > 0 ? 'ya' : 'tidak'
                    const cekIndi = temp.jenis_transaksi === 'Pembayaran Tagihan Internet (Indihome)' ? 'ya' : 'tidak'
                    this.setState({idTrans: e.value, jenisTrans: e.label, dataTrans: temp, jenisVendor: jenis, statBbm: cekBbm, type_po: temp.po.toLowerCase()})
                    if (cekIndi === 'ya') {
                        this.selectAuto()
                    } else {
                        setTimeout(() => {
                            this.formulaTax()
                         }, 100)
                    }
                }
            }
        }
        
    }

    selectAuto = async () => {
        const token = localStorage.getItem("token")
        const sendData = {
            noIdent: `${telkom}`
        }
        this.setState({status_npwp: "Ya", jenisVendor: 'Badan', tipeVendor: 'PMA'})
        this.setState({dataSelFaktur: { no_faktur: '' }, tgl_faktur: ''})
        this.setState({tipePpn: "Tidak", nilai_dpp: 0, nilai_ppn: 0})

        await this.props.getVendor(token, sendData)

        const { dataVendor } = this.props.vendor
        this.selectNikNpwp({val: {value: dataVendor[0].id}, type: 'npwp'})
    }

    cekTrans = () => {
        const { nomCoa } = this.props.coa
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
            const selectOp = nomCoa.find(({type_transaksi, jenis_transaksi, status_npwp}) => 
                                type_transaksi === 'Orang Pribadi'
                                && jenis_transaksi === trans
                                && status_npwp === cekStat)

            const selectBadan = nomCoa.find(({type_transaksi, jenis_transaksi, status_npwp}) => 
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
            const selectCoa = nomCoa.find(({type_transaksi, jenis_transaksi, status_npwp}) => 
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
        this.setState({
            norek: e.label.split('~')[0], 
            tiperek: e.value, 
            bank: e.label.split('~')[2] !== undefined && e.label.split('~')[2] !== null ? e.label.split('~')[2] : 'Bank Mandiri',
            digit: e.label.split('~')[0].length
        })
    }

    selectTujuan = (val) => {
        if (val === 'PMA') {
            this.setState({tujuan_tf: val, bank: '', digit: 13})
        } else {
            this.setState({tujuan_tf: val, bank: '', digit: 0})
        }
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
            this.setState({tipePpn: val, nilai_dpp: 0, nilai_ppn: 0})
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

    selectFaktur = async (val) => {
        const idVal = val.value
        const {dataFaktur} = this.props.faktur
        console.log(`select faktur ${idVal}`)
        const data = dataFaktur.find(({id}) => id === idVal)
        if (data === undefined) {
            console.log()
        } else {
            const nilai_ajuan = parseFloat(data.jumlah_dpp.replace(/[^a-z0-9-]/g, '')) + parseFloat(data.jumlah_ppn.replace(/[^a-z0-9-]/g, ''))
            this.setState({ 
                dataSelFaktur: data, 
                nilai_ajuan: nilai_ajuan, 
                nilai_dpp: data.jumlah_dpp.replace(/[^a-z0-9-]/g, ''),
                nilai_ppn: data.jumlah_ppn.replace(/[^a-z0-9-]/g, ''),
                tgl_faktur: data.tgl_faktur
            })
            setTimeout(() => {
                this.formulaTax()
            }, 100)
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
                const date1 = moment(item.tgl_faktur).format('M')
                const date2 = moment().format('M')
                const diffTime = Math.abs(date2 - date1)
                const diffMonth = Math.floor(diffTime)
                console.log(diffMonth)
                return (
                    (diffMonth <= 3 || item.force === 1) && item.status === null && temp.push({value: item.id, label: `${item.no_faktur}~${item.nama}`})
                )
            })
            console.log(temp)
            this.setState({fakturList: temp, showOptions : true})
        // }
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
            this.setState({ showOptions : false })
            console.log('Option lenght is short {} {}', val, val.length)
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
        if( val.length === 16 ) {
            this.getDataVendor(val)
        } else {
            this.setState({ showOptions : false })
            console.log('Option lenght is short {} {}', val, val.length)
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
                    listNik.push({value: item.id, label: `${item.no_ktp}~${item.nama}`}) 
                : item.no_ktp === 'TIDAK ADA' && item.no_npwp !== 'TIDAK ADA' ?
                    listNpwp.push({value: item.id, label: `${item.no_npwp}~${item.nama}`}) 
                : listNpwp.push({value: item.id, label: `${item.no_npwp}~${item.nama}`}) && listNik.push({value: item.id, label: `${item.no_ktp}~${item.nama}`}) 
            )
        })
        this.setState({listNik: listNik, listNpwp: listNpwp, showOptions : true})
    }

    prosesDelete = (val) => {
        this.setState({dataDelete: val})
        this.openModalDelete()
    }

    openModalDelete = () => {
        this.setState({modalDelete: !this.state.modalDelete})
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
        const { nomCoa } = this.props.coa
        const {dataTrans, nilai_ajuan, tipeVendor, tipePpn, nilai_dpp, nilai_ppn, type_kasbon, tipeSkb} = this.state
        const nilai = nilai_ajuan
        const valAdm = 2500
        const tipe = tipeVendor
        console.log(dataTrans)
        if (dataTrans.jenis_pph === undefined) {

        } else {
            const selectCoa = nomCoa.find(({type_transaksi, jenis_transaksi}) => 
                                    type_transaksi === dataTrans.type_transaksi && 
                                    jenis_transaksi === dataTrans.jenis_transaksi)
            const selectCoaFin = nomCoa.find((item) => 
                                item.type_transaksi === dataTrans.type_transaksi 
                                && item.jenis_transaksi === dataTrans.jenis_transaksi
                                && item.status_npwp === dataTrans.status_npwp 
                                && (nilai > parseFloat(item.min_nominal === null || item.min_nominal === '' || item.min_nominal === undefined ? 0 : item.min_nominal) 
                                    && nilai <= parseFloat(item.max_nominal === null || item.max_nominal === '' || item.max_nominal === undefined ? nilai : item.max_nominal)
                                    )
                                )
            if (selectCoa === undefined && selectCoaFin === undefined) {
                // this.openConfirm(this.setState({confirm: 'failJenisTrans'}))
                // this.setState({idTrans: '', jenisTrans: '', dataTrans: {}, jenisVendor: ''})
                console.log('masuk undefined formula tax')
            } else {
                console.log('masuk not undefined formula tax')
                const temp = selectCoaFin === undefined ? selectCoa : selectCoa === undefined ? dataTrans: selectCoaFin
                console.log(temp)
                const cekIndi = temp.jenis_transaksi === 'Pembayaran Tagihan Internet (Indihome)' ? 'ya' : 'tidak'
                const plusVal = cekIndi === 'ya' ? valAdm : 0
                if (temp.jenis_pph === 'Non PPh' || temp.jenis_pph === undefined) {
                    this.setState({nilai_ajuan: nilai, nilai_utang: 0, nilai_buku: nilai, nilai_vendor: Math.round(parseFloat(nilai) + plusVal), tipeVendor: tipe})
                } else {
                    const tarifPph = tipeSkb === 'SKB' ? '0%' : tipeSkb === 'SKT' ? '0.005%' : temp.tarif_pph
                    const grossup = tipeSkb === 'SKB' ? '1%' : tipeSkb === 'SKT' ? '1%' : temp.dpp_grossup
                    if (tipePpn === 'Ya' && type_kasbon !== 'kasbon') {
                    // if (tipePpn === 'Ya') {
                        if (tipe === 'PMA' && (tipeSkb !== 'SKT' && tipeSkb !== 'SKB')) {
                            const nilai_buku = nilai_dpp
                            const nilai_utang = Math.round(parseFloat(nilai_buku) * parseFloat(tarifPph))
                            // const nilai_vendor = Math.round((parseFloat(nilai_buku) + parseFloat(nilai_ppn)) - parseFloat(nilai_utang))
                            const nilai_vendor = Math.round(parseFloat(nilai) + plusVal)
                            this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                        } else if (tipe === 'Vendor' || (tipeSkb === 'SKT' || tipeSkb === 'SKB')) {
                            const nilai_buku = nilai_dpp
                            const nilai_utang = Math.round(parseFloat(nilai_buku) * parseFloat(tarifPph))
                            // const nilai_vendor = Math.round((parseFloat(nilai_buku) + parseFloat(nilai_ppn)) - parseFloat(nilai_utang))
                            const nilai_vendor = Math.round((parseFloat(nilai) - parseFloat(nilai_utang)) + plusVal)
                            this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                        }
                    } else {
                        if (tipe === 'PMA' && (tipeSkb !== 'SKT' && tipeSkb !== 'SKB')) {
                            const nilai_buku = Math.round(parseFloat(nilai) / parseFloat(grossup))
                            const nilai_utang = Math.round(parseFloat(nilai_buku) * parseFloat(tarifPph))
                            const nilai_vendor = Math.round(parseFloat(nilai) + plusVal)
                            this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                        } else if (tipe === 'Vendor' || (tipeSkb === 'SKT' || tipeSkb === 'SKB')) {
                            const nilai_buku = nilai
                            const nilai_utang = Math.round(parseFloat(nilai_buku) * parseFloat(tarifPph))
                            const nilai_vendor = Math.round((parseFloat(nilai) - parseFloat(nilai_utang)) + plusVal)
                            this.setState({nilai_ajuan: nilai, nilai_utang: nilai_utang, nilai_buku: nilai_buku, nilai_vendor: nilai_vendor, tipeVendor: tipe})
                        }
                    }
                }
                this.setState({dataTrans: temp})
            }
        }
    }

    modalStatus = () => {
        this.setState({openStatus: !this.state.openStatus})
    }

    chekApp = (val) => {
        const { listMut, nominal } = this.state
        const {dataCart} = this.props.ops
        if (val === 'all') {
            const data = []
            let temp = parseFloat(nominal)
            for (let i = 0; i < dataCart.length; i++) {
                temp += parseFloat(dataCart[i].nilai_ajuan)
                data.push(dataCart[i].id)
            }
            this.setState({listMut: data, nominal: temp}) 
        } else {
            let temp = parseFloat(nominal) + parseFloat(val.nilai_ajuan)
            listMut.push(val.id) 
            this.setState({listMut: listMut, nominal: temp})
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
        const {dataRinci, duplikat, dataBbm, detBbm, messUpload, dataItem, listMut, dataTrans, type_kasbon, showOptions, statBbm} = this.state
        const {dataCart, dataDoc, depoCart, idOps} = this.props.ops
        const { detFinance } = this.props.finance
        const {listGl, glLisIn, glListrik} = this.props.coa
        // const pages = this.props.finance.page

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
                                <div className={style.titleDashboard}>Draft Pengajuan {type_kasbon === 'kasbon' ? 'Kasbon' : 'Operasional'}</div>
                            </div>
                            <div className='pagu'>
                                <div className={style.secPaguOps}>
                                    <Button className='mr-2 mb-2' onClick={this.prosesOpenAdd} color="info" size="lg">Add</Button>
                                    <Button className='mb-2' onClick={this.prosesSubmitPre} color="success" size="lg">Submit</Button>
                                </div>
                                {/* <div className='rowGeneral divPagu'>
                                    <div className="uppercase mr-1">Nilai Pagu :</div> 
                                    <div className="ml-1">{(parseFloat(dataPagu.pagu) - this.state.nominal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                                </div> */}
                            </div>
                            <div className={style.tableDashboard1}>
                                <Table bordered responsive hover className={[style.tab, dataCart.length > 0 && 'tableJurnal1']}>
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
                                            <th>JENIS TRANSAKSI</th>
                                            <th>KETERANGAN TAMBAHAN</th>
                                            <th>PERIODE</th>
                                            <th>NILAI YANG DIAJUKAN</th>
                                            <th>ATAS NAMA</th>
                                            <th>TIPE KASBON</th>
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
                                                <th>{item.sub_coa}</th>
                                                <th>{item.keterangan}</th>
                                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                                <th>{item.nama_tujuan}</th>
                                                <th>{item.type_kasbon === 'kasbon' ? 'Kasbon' : 'Non Kasbon'}</th>
                                                <th>
                                                    <Button onClick={() => this.prosesOpenEdit(item.id)} className='mb-1 mr-1' color='success'><MdEditSquare size={25}/></Button>
                                                    <Button onClick={() => this.prosesDelete(item.id)} color='danger'><MdDelete size={25}/></Button>
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
                <Modal className='modalrinci' isOpen={this.state.modalAdd} size="xl">
                    <ModalHeader>
                        Tambah Ajuan Operasional {type_kasbon}
                    </ModalHeader>
                    <ModalBody>
                            <Formik
                            initialValues = {{
                                keterangan: '',
                                periode_awal: '',
                                periode_akhir: '',
                                nilai_ajuan: '',
                                norek_ajuan: '',
                                nama_tujuan: '',
                                status_npwp: '',
                                nama_npwp: '',
                                no_npwp: '',
                                no_ktp: '',
                                nama_ktp: '',
                                nama_vendor: '',
                                alamat_vendor: '',
                                penanggung_pajak: '',
                                type_transaksi: '',
                                no_faktur: '',
                                dpp: 0,
                                ppn: 0,
                                tgl_tagihanbayar: '',
                                type_po: '',
                                no_po: '',
                                nilai_po: 0,
                                nilai_pr: 0,
                                id_pelanggan: '',
                                biaya_adm: 2500
                            }}
                            validationSchema = {addSchema}
                            onSubmit={(values) => {this.cekAdd(values)}}
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
                                                <Col md={3}>GL Name <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">: 
                                                    <Select
                                                        className="inputRinci2"
                                                        options={this.state.options}
                                                        // value={{value: this.state.no_coa, label: this.state.nama_coa}}
                                                        onChange={this.selectCoa}
                                                    />
                                                </Col>
                                            </Row>
                                            {/* {this.state.no_coa === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Jenis Transaksi <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.jenisTrans === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}

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
                                            
                                            {type_kasbon === 'kasbon' && (
                                                <>
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>Tipe PO</Col>
                                                        <Col md={9} className="colRinci">: 
                                                            <Input
                                                                type= "select" 
                                                                className="inputRinci"
                                                                // disabled={this.state.idTrans === '' ? true : false}
                                                                disabled
                                                                value={this.state.type_po}
                                                                // onBlur={handleBlur('type_po')}
                                                                // onChange={handleChange('type_po')}
                                                                >
                                                                    <option value=''>Pilih</option>
                                                                    <option value="po">PO</option>
                                                                    <option value="non po">Non PO</option>
                                                            </Input>
                                                        </Col>
                                                    </Row>
                                                    {/* {this.state.type_po === '' ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null} */}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>
                                                            No PO
                                                            {this.state.type_po === 'po' ? (
                                                                <text className='txtError'>{'*'}</text>
                                                            ) : null}
                                                        </Col>
                                                        <Col md={9} className="colRinci">:  <Input
                                                            type= "text" 
                                                            disabled={this.state.type_po === 'po' ? false : true}
                                                            className="inputRinci"
                                                            value={values.no_po}
                                                            onBlur={handleBlur("no_po")}
                                                            onChange={handleChange('no_po')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {/* {this.state.type_po === 'po' && values.no_po === '' ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null} */}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>
                                                            Nilai PO
                                                            {this.state.type_po === 'po' ? (
                                                                <text className='txtError'>{'*'}</text>
                                                            ) : null}
                                                        </Col>
                                                        <Col md={9} className="colRinci">:
                                                            <NumberInput
                                                                disabled={this.state.type_po === 'po' ? false : true}
                                                                className="inputRinci1"
                                                                value={values.nilai_po}
                                                                onValueChange={val => setFieldValue("nilai_po", val.floatValue)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {/* {this.state.type_po === 'po' && values.nilai_po === 0 ? (
                                                        <div className='txtError'>must be filled</div>
                                                    ) : null} */}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>
                                                            Nilai PR
                                                            {this.state.type_po === 'po' ? (
                                                                <text className='txtError'>{'*'}</text>
                                                            ) : null}
                                                        </Col>
                                                        <Col md={9} className="colRinci">:
                                                            <NumberInput
                                                                disabled={this.state.type_po === 'po' ? false : true}
                                                                className="inputRinci1"
                                                                value={values.nilai_pr}
                                                                onValueChange={val => setFieldValue("nilai_pr", val.floatValue)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {/* {this.state.type_po === 'po' && values.nilai_pr === 0 ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null} */}
                                                </>
                                            )}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Jenis Vendor <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.jenisVendor === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
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
                                            <Row className="rowRinci">
                                                <Col md={3}>NPWP {this.state.status_npwp === 'Ya' && <text className='txtError'>{'*'}</text>}</Col>
                                                <Col md={9} className="colRinci">:  
                                                    {/* <Input
                                                    disabled={this.state.status_npwp === 'Ya' ? false : true}
                                                    type= "text" 
                                                    minLength={16}
                                                    maxLength={16}
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
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}></Col>
                                                <Col md={9}>
                                                    <div className='ml-3'>
                                                        {(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : this.state.status_npwp === 'Ya' ? 'Please enter 16 digits character' : ''}
                                                    </div>
                                                </Col>
                                            </Row>
                                            {this.state.status_npwp === 'Ya' && this.state.typeniknpwp === 'manual' && (this.state.noNpwp.length < 16 || this.state.noNpwp.length > 16) ? (
                                                <text className={style.txtError}>must be filled with 16 digits characters</text>
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
                                            <Row className="rowRinci">
                                                <Col md={3}>NIK {this.state.status_npwp === 'Tidak' && <text className='txtError'>{'*'}</text>}</Col>
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
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}></Col>
                                                <Col md={9}>
                                                    <div className="ml-3">
                                                        {(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : this.state.status_npwp === 'Tidak' ? "Please enter 16 digits characters" : ''}
                                                    </div>
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
                                                <Col md={3}>Transaksi Ber PPN <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.tipePpn === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="rowRinci">
                                                <Col md={3}>No Faktur Pajak</Col>
                                                <Col md={9} className="colRinci">:  
                                                    <Select
                                                        className="inputRinci2"
                                                        isDisabled={type_kasbon === 'kasbon' ? true : this.state.tipePpn === "Ya" ? false : true}
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
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}></Col>
                                                <Col md={9}>
                                                    <div className='ml-3'>
                                                        {type_kasbon === 'kasbon' ? '' : this.state.tipePpn === 'Please enter character' ? false : ''}
                                                    </div>
                                                </Col>
                                            </Row>
                                            {/* {errors.no_faktur ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
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
                                                <Col md={3}>Penanggung Pajak <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.tipeVendor === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Yang Diajukan <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <NumberInput
                                                    disabled={
                                                        statBbm === 'ya' ? true
                                                        :type_kasbon === 'kasbon' && this.state.idTrans !== '' ? false
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
                                            {/* {(this.state.nilai_ajuan === 0 || this.state.nilai_ajuan === undefined) && this.state.tipePpn === "Tidak" ? (
                                                <text className={style.txtError}>must be filled with number</text>
                                            ) : null} */}
                                            {this.state.jenisTrans.split('~').find((item) => item === ' Pembayaran Tagihan Internet (Indihome)') !== undefined  && (
                                                <Row className="mb-2 rowRinci">
                                                    <Col md={3}>Biaya Admin</Col>
                                                    <Col md={9} className="colRinci">:  <NumberInput
                                                        disabled
                                                        className="inputRinci1"
                                                        value={values.biaya_adm}
                                                        />
                                                    </Col>
                                                </Row>
                                            )}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Vendor Memiliki SKB / SKT <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.jenisVendor !== nonObject && this.state.tipeSkb === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
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
                                                <Col md={3}>Tgl Invoice <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "date" 
                                                    className="inputRinci"
                                                    value={values.tgl_tagihanbayar}
                                                    onBlur={handleBlur("tgl_tagihanbayar")}
                                                    onChange={handleChange("tgl_tagihanbayar")}
                                                    />
                                                </Col>
                                            </Row>
                                            {/* {errors.tgl_tagihanbayar ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Keterangan Tambahan<text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
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
                                                <Col md={3}>Periode <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {errors.periode_awal || errors.periode_akhir ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : values.periode_awal > values.periode_akhir ? (
                                                <text className={style.txtError}>Pastikan periode diisi dengan benar</text>
                                            ) : null } */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Tujuan Transfer <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled={level === '5' || level === '6' ? false : true}
                                                    type= "select" 
                                                    className="inputRinci"
                                                    value={this.state.tujuan_tf}
                                                    onChange={e => this.selectTujuan(e.target.value)}
                                                    >
                                                        <option value=''>Pilih</option>
                                                        {this.state.jenisTrans.split('~').find((item) => item === ' Pembayaran Tagihan Internet (Indihome)') !== undefined ? (
                                                            null
                                                        ) : (
                                                            <>
                                                                <option value="PMA">PMA</option>
                                                                <option value="Vendor">Vendor</option>
                                                            </>
                                                        )}
                                                        {glLisIn.find((e) => e === parseInt(this.state.no_coa)) !== undefined && 
                                                            <option value="ID Pelanggan">ID Pelanggan</option>
                                                        }
                                                    </Input>
                                                </Col>
                                            </Row>
                                            {/* {this.state.tujuan_tf === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Atas Nama <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {values.nama_tujuan === '' && this.state.tujuan_tf !== 'PMA' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            {this.state.tujuan_tf === 'ID Pelanggan' ? (
                                                <>
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>ID Pelanggan <text className='txtError'>{'*'}</text></Col>
                                                        <Col md={9} className="colRinci">:  <Input
                                                            type= "text" 
                                                            className="inputRinci"
                                                            value={values.id_pelanggan}
                                                            onBlur={handleBlur("id_pelanggan")}
                                                            onChange={handleChange("id_pelanggan")}
                                                            minLength={glListrik.find((e) => e === parseInt(this.state.no_coa)) !== undefined && 12}
                                                            maxLength={glListrik.find((e) => e === parseInt(this.state.no_coa)) !== undefined && 12}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {glListrik.find((e) => e === parseInt(this.state.no_coa)) !== undefined && values.id_pelanggan.toString().length !== 12 ? (
                                                        <text className={style.txtError}>must be filled with 12 digits characters</text>
                                                    ) : null}
                                                </>
                                            ) : (
                                                <>
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>Bank <text className='txtError'>{'*'}</text></Col>
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
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Row className="mt-5 mb-2">
                                    <Col md={12} lg={12} className="colDoc">
                                        <text className="txtError" >* Kolom Wajib Diisi</text>
                                    </Col>
                                </Row>
                                {statBbm === 'ya' && this.state.idTrans !== '' && dataBbm.length > 0 &&
                                    <>
                                        <div className='mt-3 mb-3'>
                                            List Data BBM <text className='txtError'>{'*'}</text>
                                        </div>
                                        <Table striped bordered hover responsive className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>No Pol</th>
                                                    <th>Besar Pengisisan BBM (Liter)</th>
                                                    <th>KM Pengisian</th>
                                                    <th>Nominal</th>
                                                    <th>Tgl Pengisian BBM</th>
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
                                                            <td>{moment(item.date_bbm).format('DD MMMM YYYY')}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </>
                                }
                                {statBbm === 'ya' && this.state.idTrans !== '' ? (
                                    <div className='row justify-content-md-center mt-4 mb-4'>
                                        <div className='mainRinci2' onClick={this.openBbm}>
                                            <CiCirclePlus size={70} className='mb-2 secondary' color='secondary' />
                                            <div className='secondary'>Tambah Data BBM <text className='txtError'>{'*'}</text></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='row justify-content-md-center mt-4 mb-4'>
                                    </div>
                                )}
                                <div className="modalFoot mt-4">
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
                                            : this.state.tujuan_tf === 'ID Pelanggan' && (values.id_pelanggan === '' || values.nama_tujuan === '') ? true
                                            : this.state.tipePpn === "Tidak" && (this.state.nilai_ajuan === 0 || this.state.nilai_ajuan === undefined) ? true
                                            : this.state.jenisVendor !== nonObject && this.state.tipeSkb === '' ? true
                                            // : statBbm === 'ya' && (values.no_pol === '' || values.km === 0 || values.liter === 0) ? true 
                                            // : statBbm === 'ya' && (values.no_pol === null || values.km === null || values.liter === null) ? true 
                                            : false } 
                                            color="primary" 
                                            onClick={this.state.no_coa === '' || this.state.jenisTrans === ''
                                            || ((type_kasbon === 'kasbon' && this.state.type_po === 'po') && (values.no_po === '' || values.nilai_po === 0 || values.nilai_pr === 0)) 
                                            || this.state.jenisVendor === '' || errors.nama_vendor || errors.alamat_vendor 
                                            || this.state.tipePpn === '' || errors.no_faktur || this.state.tipeVendor === '' 
                                            || ((this.state.nilai_ajuan === 0 || this.state.nilai_ajuan === undefined) && this.state.tipePpn === "Tidak") 
                                            || (this.state.jenisVendor !== nonObject && this.state.tipeSkb === '') 
                                            || errors.tgl_tagihanbayar || errors.keterangan
                                            || (this.state.tujuan_tf === 'ID Pelanggan' && (values.id_pelanggan === '' || errors.id_pelanggan))
                                            || (this.state.bank === '' && this.state.tujuan_tf !== 'ID Pelanggan') || (values.nama_tujuan === '' && this.state.tujuan_tf !== 'PMA') 
                                            ? () => this.setError('Masih Terdapat Data Yang Belum Terisi..!!') 
                                            : values.periode_awal > values.periode_akhir ? () => this.setError('Pastikan Periode diisi dengan benar..!!')
                                            : handleSubmit
                                            }>
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
                <Modal isOpen={this.state.modalEdit} className='modalrinci' size="xl">
                    <ModalHeader>
                        Edit Ajuan Operasional
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
                                nilai_pr: idOps.nilai_pr || 0,
                                liter: idOps.liter || 0,
                                km: idOps.km || 0,
                                no_pol: idOps.no_pol || '',
                                id_pelanggan: idOps.id_pelanggan || '',
                                biaya_adm: 2500
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
                                                <Col md={3}>GL Name<text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">: 
                                                    <Select
                                                        className="inputRinci2"
                                                        options={this.state.options}
                                                        onChange={this.selectCoa}
                                                        value={{value: this.state.no_coa, label: this.state.nama_coa}}
                                                    />
                                                </Col>
                                            </Row>
                                            {/* {this.state.no_coa === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Jenis Transaksi <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.jenisTrans === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
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
                                            {type_kasbon === 'kasbon' && (
                                                <>
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>Tipe PO</Col>
                                                        <Col md={9} className="colRinci">: 
                                                            <Input
                                                                type= "select" 
                                                                className="inputRinci"
                                                                disabled={this.state.idTrans === '' ? true : false}
                                                                value={this.state.type_po}
                                                                // onBlur={handleBlur('type_po')}
                                                                // onChange={handleChange('type_po')}
                                                                >
                                                                    <option value=''>Pilih</option>
                                                                    <option value="po">PO</option>
                                                                    <option value="non po">Non PO</option>
                                                            </Input>
                                                        </Col>
                                                    </Row>
                                                    {/* {this.state.type_po === '' ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null} */}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>
                                                            No PO
                                                            {this.state.type_po === 'po' ? (
                                                                <text className='txtError'>{'*'}</text>
                                                            ) : null}
                                                        </Col>
                                                        <Col md={9} className="colRinci">:  <Input
                                                            type= "text" 
                                                            disabled={this.state.type_po === 'po' ? false : true}
                                                            className="inputRinci"
                                                            value={values.no_po}
                                                            onBlur={handleBlur("no_po")}
                                                            onChange={handleChange('no_po')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {/* {this.state.type_po === 'po' && values.no_po === '' ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null} */}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>
                                                            Nilai PO
                                                            {this.state.type_po === 'po' ? (
                                                                <text className='txtError'>{'*'}</text>
                                                            ) : null}
                                                        </Col>
                                                        <Col md={9} className="colRinci">:
                                                            <NumberInput
                                                                disabled={this.state.type_po === 'po' ? false : true}
                                                                className="inputRinci1"
                                                                value={values.nilai_po}
                                                                onValueChange={val => setFieldValue("nilai_po", val.floatValue)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {/* {this.state.type_po === 'po' && values.nilai_po === 0 ? (
                                                        <div className='txtError'>must be filled</div>
                                                    ) : null} */}
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>
                                                            Nilai PR
                                                            {this.state.type_po === 'po' ? (
                                                                <text className='txtError'>{'*'}</text>
                                                            ) : null}
                                                        </Col>
                                                        <Col md={9} className="colRinci">:
                                                            <NumberInput
                                                                disabled={this.state.type_po === 'po' ? false : true}
                                                                className="inputRinci1"
                                                                value={values.nilai_pr}
                                                                onValueChange={val => setFieldValue("nilai_pr", val.floatValue)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {/* {this.state.type_po === 'po' && values.nilai_pr === 0 ? (
                                                        <text className={style.txtError}>must be filled</text>
                                                    ) : null} */}
                                                </>
                                            )}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Jenis Vendor <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.jenisVendor === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
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
                                            <Row className="rowRinci">
                                                <Col md={3}>NPWP {this.state.status_npwp === 'Ya' && <text className='txtError'>{'*'}</text>}</Col>
                                                <Col md={9} className="colRinci">:  
                                                    {/* <Input
                                                    disabled={this.state.status_npwp === 'Ya' ? false : true}
                                                    type= "text" 
                                                    minLength={16}
                                                    maxLength={16}
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
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}></Col>
                                                <Col md={9}>
                                                    <div className='ml-3'>
                                                        {(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : this.state.status_npwp === 'Ya' ? 'Please enter 16 digits character' : ''}
                                                    </div>
                                                </Col>
                                            </Row>
                                            {this.state.status_npwp === 'Ya' && this.state.typeniknpwp === 'manual' && this.state.noNpwp.length < 16 && this.state.noNpwp.length > 16  ? (
                                                <text className={style.txtError}>must be filled with 16 digits characters</text>
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
                                            <Row className="rowRinci">
                                                <Col md={3}>NIK {this.state.status_npwp === 'Tidak' && <text className='txtError'>{'*'}</text>}</Col>
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
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}></Col>
                                                <Col md={9}>
                                                    <div className="ml-3">
                                                        {(this.state.idTrans === ''  || this.state.jenisVendor === nonObject) ? '' : this.state.status_npwp === 'Tidak' ? "Please enter 16 digits characters" : ''}
                                                    </div>
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
                                                <Col md={3}>Transaksi Ber PPN <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.tipePpn === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No Faktur Pajak</Col>
                                                <Col md={9} className="colRinci">:  
                                                    <Select
                                                        className="inputRinci2"
                                                        isDisabled={type_kasbon === 'kasbon' ? true : this.state.tipePpn === "Ya" ? false : true}
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
                                            {/* {errors.no_faktur ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
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
                                                <Col md={3}>Penanggung Pajak <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {this.state.tipeVendor === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Yang Diajukan <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {(this.state.nilai_ajuan === 0 || this.state.nilai_ajuan === undefined) && this.state.tipePpn === "Tidak" ? (
                                                <text className={style.txtError}>must be filled with number</text>
                                            ) : null} */}
                                            {this.state.jenisTrans.split('~').find((item) => item === ' Pembayaran Tagihan Internet (Indihome)') !== undefined  && (
                                                <Row className="mb-2 rowRinci">
                                                    <Col md={3}>Biaya Admin</Col>
                                                    <Col md={9} className="colRinci">:  <NumberInput
                                                        disabled
                                                        className="inputRinci1"
                                                        value={values.biaya_adm}
                                                        />
                                                    </Col>
                                                </Row>
                                            )}
                                            <Row className="mb-2 rowRinci">
                                            <Col md={3}>Vendor Memiliki SKB / SKT <text className='txtError'>{'*'}</text></Col>
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
                                                <Col md={3}>Tgl Invoice <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "date" 
                                                    className="inputRinci"
                                                    value={moment(values.tgl_tagihanbayar).format('YYYY-MM-DD')}
                                                    onBlur={handleBlur("tgl_tagihanbayar")}
                                                    onChange={handleChange("tgl_tagihanbayar")}
                                                    />
                                                </Col>
                                            </Row>
                                            {/* {errors.tgl_tagihanbayar ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Keterangan Tambahan<text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type= "text" 
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
                                                <Col md={3}>Periode <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {errors.periode_awal || errors.periode_akhir ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : values.periode_awal > values.periode_akhir ? (
                                                <text className={style.txtError}>Pastikan periode diisi dengan benar</text>
                                            ) : null } */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Tujuan Transfer <text className='txtError'>{'*'}</text></Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    disabled={level === '5' || level === '6' ? false : true}
                                                    type= "select" 
                                                    className="inputRinci"
                                                    value={this.state.tujuan_tf}
                                                    onChange={e => this.selectTujuan(e.target.value)}
                                                    >
                                                        <option value=''>Pilih</option>
                                                        {this.state.jenisTrans.split('~').find((item) => item === ' Pembayaran Tagihan Internet (Indihome)') !== undefined ? (
                                                            null
                                                        ) : (
                                                            <>
                                                                <option value="PMA">PMA</option>
                                                                <option value="Vendor">Vendor</option>
                                                            </>
                                                        )}
                                                        {glLisIn.find((e) => e === parseInt(this.state.no_coa)) !== undefined && 
                                                            <option value="ID Pelanggan">ID Pelanggan</option>
                                                        }
                                                    </Input>
                                                </Col>
                                            </Row>
                                            {/* {this.state.tujuan_tf === '' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Atas Nama <text className='txtError'>{'*'}</text></Col>
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
                                            {/* {values.nama_tujuan === '' && this.state.tujuan_tf !== 'PMA' ? (
                                                <text className={style.txtError}>must be filled</text>
                                            ) : null} */}
                                            {this.state.tujuan_tf === 'ID Pelanggan' ? (
                                                <>
                                                    <Row className="mb-2 rowRinci">
                                                        <Col md={3}>ID Pelanggan <text className='txtError'>{'*'}</text></Col>
                                                        <Col md={9} className="colRinci">:  <Input
                                                            type= "text" 
                                                            className="inputRinci"
                                                            value={values.id_pelanggan}
                                                            onBlur={handleBlur("id_pelanggan")}
                                                            onChange={handleChange("id_pelanggan")}
                                                            minLength={glListrik.find((e) => e === parseInt(this.state.no_coa)) !== undefined && 12}
                                                            maxLength={glListrik.find((e) => e === parseInt(this.state.no_coa)) !== undefined && 12}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {glListrik.find((e) => e === parseInt(this.state.no_coa)) !== undefined && values.id_pelanggan.toString().length !== 12 ? (
                                                        <text className={style.txtError}>must be filled with 12 digits characters</text>
                                                    ) : null}
                                                </>
                                            ) : (
                                                <>
                                                <Row className="mb-2 rowRinci">
                                                    <Col md={3}>Bank <text className='txtError'>{'*'}</text></Col>
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
                                            </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Row className="mt-5 mb-2">
                                    <Col md={12} lg={12} className="colDoc">
                                        <text className="txtError" >* Kolom Wajib Diisi</text>
                                    </Col>
                                </Row>
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
                                                    <th>Tgl Pengisian BBM</th>
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
                                                            <td>{moment(item.date_bbm).format('DD MMMM YYYY')}</td>
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
                                            <div className='secondary'>Tambah Data BBM <text className='txtError'>{'*'}</text></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='row justify-content-md-center mt-4 mb-4'>
                                    </div>
                                )}
                                <div className="modalFoot mt-4">
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
                                            : this.state.tujuan_tf === 'ID Pelanggan' && (values.id_pelanggan === '' || values.nama_tujuan === '') ? true
                                            : this.state.jenisVendor !== nonObject && this.state.tipeSkb === '' ? true
                                            : this.state.tipePpn === "Tidak" && (this.state.nilai_ajuan === 0 || this.state.nilai_ajuan === undefined) ? true
                                            // : statBbm === 'ya' && (values.no_pol === null || values.km === null || values.liter === null) ? true
                                            // : statBbm === 'ya' && (values.no_pol === '' || values.km === 0 || values.liter === 0) ? true 
                                            : false } 
                                            color="primary" 
                                            onClick={this.state.no_coa === '' || this.state.jenisTrans === ''
                                            || ((type_kasbon === 'kasbon' && this.state.type_po === 'po') && (values.no_po === '' || values.nilai_po === 0 || values.nilai_pr === 0)) 
                                            || this.state.jenisVendor === '' || errors.nama_vendor || errors.alamat_vendor 
                                            || this.state.tipePpn === '' || errors.no_faktur || this.state.tipeVendor === '' 
                                            || ((this.state.nilai_ajuan === 0 || this.state.nilai_ajuan === undefined) && this.state.tipePpn === "Tidak") 
                                            || (this.state.jenisVendor !== nonObject && this.state.tipeSkb === '') 
                                            || errors.tgl_tagihanbayar || errors.keterangan
                                            || (this.state.tujuan_tf === 'ID Pelanggan' && (values.id_pelanggan === '' || errors.id_pelanggan))
                                            || (this.state.bank === '' && this.state.tujuan_tf !== 'ID Pelanggan') || (values.nama_tujuan === '' && this.state.tujuan_tf !== 'PMA') 
                                            ? () => this.setError('Masih Terdapat Data Yang Belum Terisi..!!') 
                                            : values.periode_awal > values.periode_akhir ? () => this.setError('Pastikan Periode diisi dengan benar..!!')
                                            : handleSubmit
                                            }>
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
                            <Button color="primary" size="lg" className="mr-2" onClick={this.openUpBbm} ><MdUpload size={20}/></Button>
                            <Button color="warning" size="lg" className="mr-2" onClick={this.downloadBbm} ><MdDownload size={20}/></Button>
                        </div>
                        <Table striped bordered hover responsive className={style.tab}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>No Pol</th>
                                    <th>Besar Pengisisan BBM (Liter)</th>
                                    <th>KM Pengisian</th>
                                    <th>Nominal</th>
                                    <th>Tgl Pengisian BBM</th>
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
                                            <td>{moment(item.date_bbm).format('DD MMMM YYYY')}</td>
                                            <td>
                                                {/* {this.state.modalEdit === true ? (
                                                    <Button color="danger" className="mr-4" onClick={() => this.confirmDel(this.setState({dataDel: item}))}>Delete</Button>
                                                ) : (
                                                <> */}
                                                <Button color="info" className="mr-2" onClick={() => this.openDetBbm(this.setState({detBbm: item}))}><MdEditSquare size={20}/></Button>
                                                <Button color="danger"  onClick={() => this.confirmDel(this.setState({dataDel: item}))}><MdDelete size={20}/></Button>
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
                                    <td>
                                        <Button color="success" size="lg" onClick={this.openAddBbm} ><MdAddCircle size={23}/></Button>
                                    </td>
                                </tr>
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
                        no_pol: '',
                        date_bbm: ''
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
                        <Row className="mb-2 rowRinci">
                            <Col md={3}>Tgl Pengisian BBM</Col>
                            <Col md={9} className="colRinci">:  <Input
                                type='date'
                                value={values.date_bbm}
                                className="inputRinci1"
                                onChange={handleChange('date_bbm')}
                                onBlur={handleBlur('date_bbm')}
                            />
                            </Col>
                        </Row>
                        {errors.date_bbm ? (
                            <text className={style.txtError}>{errors.date_bbm}</text>
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
                        no_pol: detBbm.no_pol,
                        date_bbm: detBbm.date_bmm
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
                        <Row className="mb-2 rowRinci">
                            <Col md={3}>Tgl Pengisian BBM</Col>
                            <Col md={9} className="colRinci">:  <Input
                                type='date'
                                value={values.date_bbm}
                                className="inputRinci1"
                                onChange={handleChange('date_bbm')}
                                onBlur={handleBlur('date_bbm')}
                            />
                            </Col>
                        </Row>
                        {errors.date_bbm ? (
                            <text className={style.txtError}>{errors.date_bbm}</text>
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
                                    Anda yakin untuk menghapus data bbm ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.delDataBbm()}>Ya</Button>
                                <Button color="secondary" onClick={this.confirmDel}>Tidak</Button>
                            </div>
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
                    // || this.props.faktur.isLoading 
                    // || this.props.vendor.isLoading
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
                                    Apakah anda yakin ingin submit pengajuan ops ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.submitOps()}>Ya</Button>
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
                                                    <th>{item.keterangan}</th>
                                                    <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                                    <th>{item.nilai_ajuan}</th>
                                                    <th>{item.bank_tujuan}</th>
                                                    <th>{item.norek_ajuan}</th>
                                                    <th>{item.nama_tujuan}</th>
                                                    <th>{item.status_npwp === 0 ? 'Tidak' : item.status_npwp === 1 ? 'Ya' : ''}</th>
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
                            <text className="italRed">*Pastikan Data Diatas Merupakan Data Yang Ingin Anda Submit </text>
                            {/* <Button className="mr-2" color="info"  onClick={() => this.prosesModalFpd()}>FPD</Button>
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
                    <ModalBody>
                        <div className='mb-3'>
                            <div className='titleOps'>
                                <div>
                                    <div className="uppercase">pt. pinus merah abadi</div>
                                    <div className="uppercase">cabang / depo : {dataCart.length > 0 ? dataCart[0].area : ''}</div>
                                </div>
                                <div className='secOps'>
                                    <div className="uppercase mr-1">nomor ops :</div> 
                                    <div className="uppercase numOps ml-1">{dataCart.length > 0 ? dataCart[0].no_transaksi : ''}</div>
                                </div>
                            </div>
                            <div className='subOps'>
                                <div className='uppercase'>operasional</div>
                                <div>Tanggal : {dataCart.length > 0 &&  dataCart[0].start_ops !== null ? moment(dataCart[0].start_ops).format('DD MMMM YYYY') : ''}</div>
                            </div>
                        </div>
                        <div>
                            <Table bordered responsive hover 
                                className={style.tabops}
                            >
                                <thead>
                                    <tr>
                                        <th className='tbklaim'>NO</th>
                                        <th className='tbklaim'>NO COA</th>
                                        <th className='tbklaim'>NAMA COA</th>
                                        <th className='tbklaim'>KETERANGAN</th>
                                        <th className='tbklaim'>NAMA</th>
                                        <th className='tbklaim'>JUMLAH</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataCart.length !== 0 && dataCart.map(item => {
                                        return (
                                            listMut.find(element => element === item.id) !== undefined ? (
                                            <tr>
                                                <th scope="row">{dataCart.indexOf(item) + 1}</th>
                                                <th>{item.no_coa}</th>
                                                <th>{item.nama_coa}</th>
                                                <th>{item.sub_coa}</th>
                                                <th>{item.nama_npwp === null || item.nama_npwp === '' ? item.nama_ktp : item.nama_npwp}</th>
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
                                            <div className='line2'>{item.keterangan}</div>
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
                    {/* <Countdown renderer={this.rendererTime} date={Date.now() + 3000} /> */}
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
                    ) : this.state.confirm === 'delCart' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menghapus Data</div>
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
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan seluruh dokumen lampiran telah diupload</div>
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
                    ) : this.state.confirm === 'failEdit' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Edit Data</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan nilai ajuan, nilai PO, dan nilai PR memiliki nilai yang sama</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failAdd' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Add Data</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan nilai ajuan, nilai PO, dan nilai PR memiliki nilai yang sama</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failChek' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Memilih Data</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan nilai ajuan data yang dipilih tidak melewati nilai pagu</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failSubChek' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className={[style.sucUpdate, style.green]}>Pilih data Operasional yang ingin diajukan terlebih dahulu</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'failSubCoa' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className='mb-1'>.</div>
                                <div className={[style.sucUpdate, style.green, 'mt-3']}>Pastikan jenis COA yang diajukan sama</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejCart' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Data</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan seluruh kolom data telah terisi</div>
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
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Data telah terdaftar </div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejEditBbm' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Mengupdate Data BBM</div>
                                <div className={[style.sucUpdate, style.green, 'mt-2']}>Data telah terdaftar </div>
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
                    ) 
                    // : this.state.confirm === 'failSubChek' ? (
                    //     <div>
                    //         <div className={style.cekUpdate}>
                    //             <AiOutlineClose size={80} className={style.red} />
                    //             <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                    //             <div className={[style.sucUpdate, style.green]}>Pastikan Data BBM Telah Ditambahkan</div>
                    //         </div>
                    //     </div>
                    // ) 
                    : this.state.confirm === 'falseUpload' ? (
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
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                                {/* <text className="txtError ml-4">Maximum file upload is 25 Mb</text>
                                                <text className="txtError ml-4">Only excel, pdf, zip, png, jpg and rar files are allowed</text> */}
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col md={12} lg={12} className="colDoc">
                                            <text className="btnDocIo" >{x.desc} <text className='txtError'>{x.stat_upload === 0 ? '' : '*'}</text></text>
                                            {/* <text className="italRed" >{x.stat_upload === 0 ? '*tidak wajib upload' : '*wajib upload'}</text> */}
                                            <div className="colDoc">
                                                <input
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            </div>
                                            
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
            <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                <ModalHeader>Dokumen</ModalHeader>
                <ModalBody>
                    <div className={style.readPdf}>
                        <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} dataFile={this.state.fileName}/>
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
    ops: state.ops,
    bank: state.bank,
    pagu: state.pagu,
    faktur: state.faktur,
    finance: state.finance,
    dokumen: state.dokumen,
    vendor: state.vendor,
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
    addCart: ops.addCart,
    getCart: ops.getCart,
    deleteCart: ops.deleteCart,
    resetOps: ops.resetOps,
    submitOps: ops.submitOps,
    getDocOps: ops.getDocCart,
    uploadDocOps: ops.uploadDocCart,
    getBank: bank.getBank,
    submitOpsFinal: ops.submitOpsFinal,
    getApproval: ops.getApproval,
    getFinRek: finance.getFinRek,
    getPagu: pagu.getPagu,
    showDokumen: dokumen.showDokumen,
    getVendor: vendor.getVendor,
    getFaktur: faktur.getFaktur,
    resetEmail: email.resetError,
    getDraftEmail: email.getDraftEmail,
    sendEmail: email.sendEmail,
    getDetail: ops.getDetail,
    getDetailId: ops.getDetailId,
    editOps: ops.editOps,
    addNotif: notif.addNotif,
    uploadBbm: ops.uploadBbm,
    updateBbm: ops.updateBbm,
    addBbm: ops.addBbm,
    getBbm: ops.getBbm,
    deleteBbm: ops.deleteBbm
}

export default connect(mapStateToProps, mapDispatchToProps)(CartOps)
