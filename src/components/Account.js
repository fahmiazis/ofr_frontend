import React, { Component } from 'react'
import { Input, Button, UncontrolledDropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, Spinner } from 'reactstrap'
import {FaBars, FaFileSignature, FaUserCircle} from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import auth from '../redux/actions/auth'
import user from '../redux/actions/user'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import * as Yup from 'yup'
// import notif from '../redux/actions/notif'
import {VscAccount} from 'react-icons/vsc'
import { useHistory } from 'react-router-dom'
import style from '../assets/css/input.module.css'
const {REACT_APP_BACKEND_URL} = process.env

const changeSchema = Yup.object().shape({
    current_password: Yup.string().required('must be filled'),
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

const userSchema = Yup.object().shape({
    username: Yup.string().required('must be filled'),
    fullname: Yup.string().required('must be filled'),
    email: Yup.string().email().required('must be filled')
});

class Account extends Component {

    state = {
        modalEdit: false,
        modalProf: false,
        relog: false,
        alert: false,
        setting: false,
        modalConfirm: false,
        confirm: '',
        username: '',
        fullname: '',
        email: ''
    }

    editUser = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            new: val.new_password,
            current: val.current_password
        }
        await this.props.changePassword(token, data)
     }

     inputText = (val) => {
        const data = {
            [val.name]: val.value
        }
        this.setState(data)
     }

     editProfile = async (val) => {
        const token = localStorage.getItem("token")
        const {detailUser} = this.props.user
        const id = localStorage.getItem("id")
        const data = {
            username: val.username,
            fullname: val.fullname,
            email: val.email,
            kode_plant: detailUser.kode_plant,
            level: detailUser.level
        }
        await this.props.updateUser(token, id, data)
        const {isUpdate} = this.props.user
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.getProfile()
        }
    }

    uploadGambar = async e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({errMsg: 'Invalid file type. Only image files are allowed.'})
            this.uploadAlert()
        } else {
            const id = localStorage.getItem("id")
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            await this.props.uploadImage(token, id, data)
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.getProfile()
        }
    }

    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    openProfile = () => {
        this.setState({modalProf: !this.state.modalProf})
    }

    async componentDidMount() {
        this.getProfile()
    }

    getProfile = async () => {
        const token = localStorage.getItem("token")
        const id = localStorage.getItem("id")
        await this.props.getDetail(token, id)
        const {detailUser} = this.props.user
        this.setState({username: detailUser.username, fullname: detailUser.fullname, email: detailUser.email})
    }

    componentDidUpdate () {
        const {isChange} = this.props.user
        if (isChange === false) {
            this.setState({confirm: 'errChange', modalConfirm: true})
            this.props.reset()
        }
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    logout = () => {
        this.props.logout()
    }

  render() {
    const level = localStorage.getItem('level')
    const names = localStorage.getItem('fullname')
    const {detailUser} = this.props.user
    const color = this.props.color
    return (
        <>
            <UncontrolledDropdown>
                <DropdownToggle nav className='accName'>
                    {detailUser.image === null ? (
                        <VscAccount size={30} className={color === undefined ? 'mr-2 white' : `mr-2 ${color}`} />
                    ) : (
                        <img className="pictTask mr-2" src={`${REACT_APP_BACKEND_URL}/${detailUser.image}`} alt="profile1" />
                    )}
                    <div className={color === undefined ? 'mr-2 white' : `mr-2 ${color}`}>
                        {level === '1' ? 'Super Admin' : detailUser.fullname}
                    </div>
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem onClick={this.openProfile}>
                        My Profile
                    </DropdownItem>
                    <DropdownItem onClick={this.openModalEdit}>
                        Change Password
                    </DropdownItem>
                    <DropdownItem onClick={() => this.logout()}>
                        <FiLogOut size={15} />
                        <text className="txtMenu2">Logout</text>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
            <Modal isOpen={this.state.modalEdit} toggle={this.openModalEdit}>
                <ModalHeader>Change Password</ModalHeader>
                <Formik
                initialValues={{
                current_password: '',
                confirm_password: '',
                new_password: ''
                }}
                validationSchema={changeSchema}
                onSubmit={(values) => {this.editUser(values)}}
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
                            <Button className="mr-3" onClick={this.openModalEdit} color="danger">Close</Button>
                        </div>
                    </div>
                </ModalBody>
                )}
            </Formik>
        </Modal>
        <Modal toggle={this.openProfile} isOpen={this.state.modalProf} size='xl'>
            <ModalBody>
                <div className="h4">
                    My Profile<span className="h6 text-secondary"><br /> Manage your profile information</span>
                </div>
                <hr />
                <Formik 
                    initialValues={{
                        username: this.state.username,
                        fullname: this.state.fullname,
                        email: this.state.email
                    }}
                    validationSchema={userSchema}
                    onSubmit={(values) => {this.editProfile(values)}}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <div className="row">
                        <div className="col-md-9">
                            <div className='row'>
                                <div className="col-md-2 text-secondary">
                                    <div className="sam d-flex justify-content-end">User Name</div>
                                </div>
                                <div className="for col-md-10">
                                    <Input 
                                        type="name" 
                                        className="form-control" 
                                        name='username'
                                        id="inputEmail3"
                                        // value={this.state.username}
                                        // onChange={e => this.inputText(e.target)}
                                        value={values.username}
                                        onChange={handleChange("username")}
                                        onBlur={handleBlur("username")}
                                        disabled
                                        placeholder="User Name" 
                                    />
                                    {errors.username ? (
                                        <text className={style.txtError}>{errors.username}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-2 text-secondary">
                                    <div className="sam d-flex justify-content-end">Full Name</div>
                                </div>
                                <div className="for col-md-10">
                                    <Input 
                                        type="name" 
                                        className="form-control" 
                                        name='fullname'
                                        id="inputEmail3"
                                        value={values.fullname}
                                        onChange={handleChange("fullname")}
                                        onBlur={handleBlur("fullname")}
                                        placeholder="Full Name" 
                                    />
                                    {errors.fullname ? (
                                        <text className={style.txtError}>{errors.fullname}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2 text-secondary">
                                    <div className="sam d-flex justify-content-end">Email</div>
                                </div>
                                <div className="for col-md-10">
                                    <Input 
                                        type="email" 
                                        className="form-control" 
                                        name='email'
                                        id="inputEmail3"
                                        value={values.email}
                                        onChange={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        placeholder="Email" 
                                    />
                                    {errors.email ? (
                                        <text className={style.txtError}>{errors.email}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2 text-secondary">
                                </div>
                                <div className="for col-md-10">
                                    <button className="save btn btn-danger" onClick={handleSubmit}>Save</button>  
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="colCenter">
                                {detailUser.image === null ? (
                                    <VscAccount size={120} className={'black mb-4'} />
                                ) : (
                                    <img className="pictProf mb-4" src={`${REACT_APP_BACKEND_URL}/${detailUser.image}`} alt="profile1" />
                                )}
                                <Input type="file" onChange={this.uploadGambar}
                                    className="bol btn btn-outline-secondary btn-block text-secondary"
                                >
                                    Select image
                                </Input>
                            </div>
                        </div>
                    </div>
                    )}
                </Formik>
            </ModalBody>
        </Modal>
        <Modal isOpen={this.state.relog}>
            <ModalBody>
                <div className={style.modalApprove}>
                    <div className="relogin">
                        System membutuhkan anda untuk login ulang
                    </div>
                    <div className={style.btnApprove}>
                        <Button color="primary" onClick={this.logout}>Relogin</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
        <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm}>
            <ModalBody>
                {this.state.confirm === 'errChange' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal merubah password, pastikan current password yang anda masukan benar</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'edit' ? (
                    <div className={style.cekUpdate}>
                        <AiFillCheckCircle size={80} className={style.green} />
                        <div className={style.sucUpdate}>Berhasil Memperbarui Data</div>
                    </div>
                    ) : this.state.confirm === 'add' ? (
                        <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Menambahkan Data</div>
                        </div>
                    ) : this.state.confirm === 'del' ? (
                        <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Menghapus Data</div>
                        </div>
                    ) : this.state.confirm === 'upload' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Mengupload Master Data</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'reset' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Mereset Password</div>
                        </div>
                        </div>
                    ) : (
                    <div></div>
                )}
            </ModalBody>
        </Modal>
        <Modal isOpen={this.props.user.isLoading ? true: false} size="sm">
            <ModalBody>
            <div>
                <div className={style.cekUpdate}>
                    <Spinner />
                    <div sucUpdate>Waiting....</div>
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
    notif: state.notif
})

const mapDispatchToProps = {
    updateUser: user.updateUser,
    reset: user.resetError,
    logout: auth.logout,
    // getNotif: notif.getNotif,
    changePassword: user.changePassword,
    getDetail: user.getDetailUser,
    goRoute: auth.goRoute,
    uploadImage: user.uploadImage
    // upNotif: notif.upNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)