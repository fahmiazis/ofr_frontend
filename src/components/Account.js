import React, { Component } from 'react'
import { Input, Button, UncontrolledDropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody } from 'reactstrap'
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
import style from '../assets/css/input.module.css'

const changeSchema = Yup.object().shape({
    current_password: Yup.string().required('must be filled'),
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class Account extends Component {

    state = {
        modalEdit: false,
        relog: false,
        alert: false,
        setting: false,
        modalConfirm: false,
        confirm: ''
    }

    editUser = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            new: val.new_password,
            current: val.current_password
        }
        await this.props.changePassword(token, data)
     }

     openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
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
    const color = this.props.color
    return (
        <>
            <UncontrolledDropdown>
                <DropdownToggle nav className='accName'>
                    <VscAccount size={30} className={color === undefined ? 'mr-2 white' : `mr-2 ${color}`} />
                    <div className={color === undefined ? 'mr-2 white' : `mr-2 ${color}`}>
                        {level === '1' ? 'Super Admin' : names}
                    </div>
                </DropdownToggle>
                <DropdownMenu right>
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
                ) : (
                    <div></div>
                )}
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
    goRoute: auth.goRoute,
    // upNotif: notif.upNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)