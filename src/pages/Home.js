/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import auth from '../redux/actions/auth'
import { Input, Button, Modal, ModalHeader, ModalBody, Alert, 
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Dropdown, Row } from 'reactstrap'
import {connect} from 'react-redux'
import placeholder from  "../assets/img/placeholder.png"
import stockPicture from '../assets/img/stock.svg'
import {Formik} from 'formik'
import user from '../redux/actions/user'
// import notif from '../redux/actions/notif'
import * as Yup from 'yup'
import {VscAccount} from 'react-icons/vsc'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import style from '../assets/css/input.module.css'
import moment from 'moment'
import {BsFillCircleFill, BsBell, BsGearWideConnected} from 'react-icons/bs'
import {GiNotebook} from 'react-icons/gi'
import {GrMoney} from 'react-icons/gr'
import {MdBalance} from 'react-icons/md'
import { FaFileSignature, FaHandshake, FaCashRegister } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import Bell from '../components/Bell'
import Account from '../components/Account'

const userEditSchema = Yup.object().shape({
    fullname: Yup.string().required('must be filled'),
    email: Yup.string().email().required('must be filled')
});

const changeSchema = Yup.object().shape({
    current_password: Yup.string().required('must be filled'),
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class Home extends Component {

    state = {
        modalEdit: false,
        relog: false,
        alert: false,
        setting: false,
        modalChange: false,
        dataNull: []
    }

    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    showAlert = () => {
        this.setState({alert: true})
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    settingUser = () => {
        this.setState({setting: !this.state.setting})
    }

    relogin = () => {
        this.props.logout()
        this.props.history.push('/login')
    }

    goPengadaan = () => {
        this.props.history.push('/navtick')
    }

    goRoute = (route) => {
        this.props.history.push(`/${route}`)
    }

    goNotif = async (val) => {
        const token = localStorage.getItem('token')
        if (val === 'notif') {
            localStorage.setItem('route', val)
            this.props.history.push(`/${val}`)
        } else {
            await this.props.upNotif(token, val.id)
            await this.props.getNotif(token)
            const ket = val.keterangan
            const jenis = (val.jenis === '' || val.jenis === null) && val.no_proses.split('')[0] === 'O' ? 'Stock Opname' : val.jenis
            const route = ket === 'tax' || ket === 'finance' || ket === 'tax and finance' ? 'taxfin' : ket === 'eksekusi' && jenis === 'disposal' ? 'eksdis' : jenis === 'disposal' && ket === 'pengajuan' ? 'disposal' : jenis === 'mutasi' && ket === 'pengajuan' ? 'mutasi' : jenis === 'Stock Opname' && ket === 'pengajuan' ? 'stock' : jenis === 'disposal' ? 'navdis' : jenis === 'mutasi' ? 'navmut' : jenis === 'Stock Opname' && 'navstock' 
            localStorage.setItem('route', route)
            this.props.history.push(`/${route}`)
        }
    }

    editUser = async (values,id) => {
        const token = localStorage.getItem("token")
        const names = localStorage.getItem('name')
        const data = {
            username: names,
            fullname: values.fullname,
            email: values.email
        }
        await this.props.updateUser(token, id, data)
    }
    
    editPass = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            new: val.new_password,
            current: val.current_password
        }
        await this.props.changePassword(token, data)
     }

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
        const { data } = this.props.notif
        const dataNull = []
        const dataRead = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].status === null) {
                dataNull.push(data[i])
            } else {
                dataRead.push(data[i])
            }
        }
        this.setState({ dataNull: dataNull })
    }

    componentDidUpdate() {
        const {isUpdate, isError, isChange} = this.props.user
        if (isUpdate) {
            this.openModalEdit()
            this.setState({relog: true})
            this.props.reset()
        } else if (isError) {
            this.showAlert()
            this.props.reset()
        } else if (isChange) {
            this.openModalChange()
            this.setState({relog: true})
            this.props.reset()
        }
    }

    componentDidMount() {
        const email = localStorage.getItem('email')
        const fullname = localStorage.getItem('fullname')
        const id = localStorage.getItem('id')
        const level = localStorage.getItem('level')
        // this.getNotif()
        if (email === 'null' || email === '' || fullname === 'null' || fullname === '') {
            if (id !== null && level !== '5') {
                this.openModalEdit()
            } else if (level === '5') {
                console.log('5')
            } else {
                this.relogin()
            }
        } else if (id === null) {
            this.relogin()
        }
    }

    openModalChange = () => {
        this.setState({modalChange: !this.state.modalChange})
    }

    logout = () => {
        this.props.logout()
        this.props.history.push('/login')
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const email = localStorage.getItem('email')
        const fullname = localStorage.getItem('fullname')
        const {dataNull} = this.state
        const id = localStorage.getItem('id')
        const { alertM, alertMsg } = this.props.user
        // const dataNotif = this.props.notif.data
        const dataNotif = []
        return (
            <>
            <div className="bodyHome">
                <div className="leftHome">
                    <Sidebar />
                </div>
                <div className="rightHome">
                    <div className="bodyAkun">
                        <div></div>
                        <div className="akun">
                            <Bell dataNotif={dataNotif} color={"black"}/>
                            <Account color={"black"}/>
                        </div>
                    </div>
                    <div className='mainHome'>
                        <div className="titHome">Welcome to web finance</div>
                        <div className="txtChoose">Please select an option</div>
                        <div className="mainBody">
                            {level === '4' || level === '14' ? null : (
                                <button className="cardHome1" onClick={() => this.goRoute('navklaim')}>
                                    <FaHandshake size={220} className="picHome" />
                                    <div className="titCard">
                                        Klaim
                                    </div>
                                </button>
                            )}
                            <button className="cardHome2" onClick={() => this.goRoute('navops')}>
                                <BsGearWideConnected size={220} className="picHome" />
                                <div className="titCard">
                                    Operasional
                                </div>
                            </button>
                            <button className="cardHome2" onClick={() => this.goRoute('navikk')}>
                                <GiNotebook color='danger' size={220} className="picHome" />
                                <div className="titCard">
                                    Ikhtisar Kas Kecil
                                </div>
                            </button>
                            <button className="cardHome1" onClick={() => this.goRoute('navkasbon')}>
                                <FaCashRegister color='danger' size={220} className="picHome" />
                                <div className="titCard">
                                    Kasbon
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={this.state.modalEdit}>
                <ModalHeader>Lengkapi nama lengkap dan email terlebih dahulu</ModalHeader>
                <Formik
                initialValues={{
                fullname: fullname === 'null' ? null : fullname,
                email: email === 'null' ? null : email
                }}
                validationSchema={userEditSchema}
                onSubmit={(values) => {this.editUser(values, id)}}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <ModalBody>
                    <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertMsg}</div>
                        <div>{alertM}</div>
                    </Alert>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Fullname
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="name" 
                            name="fullname"
                            value={values.fullname}
                            onBlur={handleBlur("fullname")}
                            onChange={handleChange("fullname")}
                            />
                            {errors.fullname ? (
                                <text className={style.txtError}>{errors.fullname}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Email
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="name" 
                            name="email"
                            value={values.email}
                            onBlur={handleBlur("email")}
                            onChange={handleChange("email")}
                            />
                            {errors.email ? (
                                <text className={style.txtError}>{errors.email}</text>
                            ) : null}
                        </div>
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                            <Button className="mr-3" onClick={this.relogin} color="danger">Logout</Button>
                        </div>
                    </div>
                </ModalBody>
                    )}
                </Formik>
            </Modal>
            <Modal isOpen={this.state.modalChange} toggle={this.openModalChange}>
                <ModalHeader>Change Password</ModalHeader>
                <Formik
                initialValues={{
                current_password: '',
                confirm_password: '',
                new_password: ''
                }}
                validationSchema={changeSchema}
                onSubmit={(values) => {this.editPass(values)}}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <ModalBody>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertMsg}</div>
                        <div>{alertM}</div>
                    </Alert> */}
                    <div className={style.addModalDepo}>
                        <text className="col-md-4">
                            Current password
                        </text>
                        <div className="col-md-8">
                            <Input 
                            type='password' 
                            name="current_password"
                            value={values.current_password}
                            onBlur={handleBlur("current_password")}
                            onChange={handleChange("current_password")}
                            />
                            {errors.current_password ? (
                                <text className={style.txtError}>{errors.current_password}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-4">
                            New password
                        </text>
                        <div className="col-md-8">
                            <Input 
                            type='password' 
                            name="new_password"
                            value={values.new_password}
                            onBlur={handleBlur("new_password")}
                            onChange={handleChange("new_password")}
                            />
                            {errors.new_password ? (
                                <text className={style.txtError}>{errors.new_password}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-4">
                            Confirm password
                        </text>
                        <div className="col-md-8">
                            <Input 
                            type='password' 
                            name="confirm_password"
                            value={values.confirm_password}
                            onBlur={handleBlur("confirm_password")}
                            onChange={handleChange("confirm_password")}
                            />
                            {values.confirm_password !== values.new_password ? (
                                <text className={style.txtError}>Password do not match</text>
                            ) : null}
                        </div>
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                            <Button className="mr-3" onClick={this.openModalChange} color="danger">Close</Button>
                        </div>
                    </div>
                </ModalBody>
                    )}
                </Formik>
            </Modal>
            <Modal>
                <ModalBody>
                    
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.relog}>
                <ModalBody>
                    <div className={style.modalApprove}>
                        <div className="relogin">
                            System membutuhkan anda untuk login ulang
                        </div>
                        <div className={style.btnApprove}>
                            <Button color="primary" onClick={this.relogin}>Relogin</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    // notif: state.notif
})

const mapDispatchToProps = {
    updateUser: user.updateUser,
    reset: user.resetError,
    logout: auth.logout,
    changePassword: user.changePassword,
    // getNotif: notif.getNotif,
    // upNotif: notif.upNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
