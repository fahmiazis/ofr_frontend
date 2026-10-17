import React, { Component } from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../redux/actions/auth'
import {connect} from 'react-redux'
import { Form, Alert, Modal, ModalBody, Spinner } from 'reactstrap'
import logo from '../assets/img/logo.png'
import illustration from '../assets/img/login-ofr.svg'
import style from '../assets/css/input.module.css'
import styleLogin from '../assets/css/login.module.css'
import { AiOutlineCopyrightCircle } from "react-icons/ai"

const loginSchema = Yup.object().shape({
    username: Yup.string().required('must be filled'),
    password: Yup.string().required('must be filled')
});

class Login extends Component {

    login = async (values) => {
        await this.props.login(values)
        const {isLogin} = this.props.auth
        if (isLogin) {
            this.props.history.push('/')
        }
    }

    state = {
        cost_center: ''
    }

    componentDidUpdate() {
        const {isLogin} = this.props.auth
        if (isLogin === true) {
            this.props.history.push('/')
            this.props.resetError()
        } else if (isLogin === false) {
            setTimeout(() => {
                this.props.resetError()
             }, 2000)
        }
    }

    // componentDidMount(){
    //     if (localStorage.getItem('token')) {
    //         this.props.setToken(localStorage.getItem('token'))
    //         this.props.history.push('/')  
    //     }
    // }

    render() {
        const {isLogin} = this.props.auth
        return (
            <>
            <Formik
                initialValues={{ username: '', password: '', cost_center: ''}}
                validationSchema={loginSchema}
                onSubmit={(values, { resetForm }) => {this.login(values); resetForm({ values: '' })}}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <div className={styleLogin.loginPage}>
                    <div className={styleLogin.loginCard}>
                        <div className={styleLogin.illustration}>
                            <div>
                                <div className={styleLogin.illuTitle}>Operational Fund Request</div>
                                <div className={styleLogin.illuDesc}>Pengajuan dana operasional, klaim, kasbon, dan kas kecil dalam satu aplikasi.</div>
                            </div>
                            <img src={illustration} alt='ilustrasi ajuan dana operasional' className={styleLogin.illuImage} />
                        </div>
                        <Form className={styleLogin.formSide}>
                            <img src={logo} alt='logo' className={styleLogin.logo} />
                            <div className={styleLogin.formTitle}>Selamat Datang</div>
                            <div className={styleLogin.formSubtitle}>Please login with your account</div>
                            { isLogin === false && (
                                <Alert color="danger" className={styleLogin.alert}>
                                    username or password invalid !
                                </Alert>
                            )}
                            <div className={styleLogin.field}>
                                <label className={styleLogin.label}>Username</label>
                                <input 
                                className={styleLogin.input}
                                placeholder='Masukkan username'
                                type='name' 
                                onChange= {handleChange('username')}
                                onBlur= {handleBlur('username')}
                                value={values.username}
                                />
                                {errors.username ? (
                                    <text className={styleLogin.error}>{errors.username}</text>
                                ) : null}
                            </div>
                            {(values.username === 'P000' || values.username === 'p000') && (
                                <div className={styleLogin.field}>
                                    <label className={styleLogin.label}>Cost Center</label>
                                    <input 
                                    className={styleLogin.input}
                                    placeholder='Masukkan cost center'
                                    type='text' 
                                    onChange= {handleChange('cost_center')}
                                    onBlur= {handleBlur('cost_center')}
                                    value={values.cost_center}
                                    />
                                    {values.cost_center === '' ? (
                                        <text className={styleLogin.error}>must be filled</text>
                                    ) : null}
                                </div>
                            )}
                            <div className={styleLogin.field}>
                                <label className={styleLogin.label}>Password</label>
                                <input
                                className={styleLogin.input}
                                placeholder='Masukkan password'
                                type='password'
                                onChange= {handleChange('password')}
                                onBlur= {handleBlur('password')}
                                value={values.password}
                                />
                                {errors.password ? (
                                    <text className={styleLogin.error}>{errors.password}</text>
                                ) : null}
                            </div>
                            <button type='submit' disabled={(values.username === 'p000' || values.username === 'P000') && values.cost_center === '' ? true : false} onClick={handleSubmit} className={styleLogin.button}>LOGIN</button>
                            <div className={styleLogin.copyright}><AiOutlineCopyrightCircle size={16} className="mr-2" />OFR-PMA 2022</div>
                        </Form>
                    </div>
                </div>
                )}
                </Formik>
                <Modal isOpen={this.props.auth.isLoading ? true: false} size="sm">
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
    auth: state.auth
})

const mapDispatchToProps = {
    login: auth.login,
    setToken: auth.setToken,
    resetError: auth.resetError
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)