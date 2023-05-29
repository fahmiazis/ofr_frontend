import React, { Component } from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../redux/actions/auth'
import {connect} from 'react-redux'
import { Input, Container, Form, Alert, Modal, ModalBody, Spinner } from 'reactstrap'
import logo from '../assets/img/logo.png'
import style from '../assets/css/input.module.css'
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
            { isLogin === false ? (
                <Alert color="danger" className={style.alertWrong}>
                    username or password invalid !
                </Alert>
            ): (
                <div></div>
            )}
            <Formik
                initialValues={{ username: '', password: '', cost_center: ''}}
                validationSchema={loginSchema}
                onSubmit={(values, { resetForm }) => {this.login(values); resetForm({ values: '' })}}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <Form className={style.bodyLogin}>
                    <div className={style.imgLogin}>
                        <img src={logo} alt='logo' className={style.imgBig} />
                    </div>
                        <div className={style.form}>
                            <div className={style.textLogin}>Please login with your account</div>
                            <div>
                                <input 
                                className={style.input1}
                                placeholder='Username'
                                type='name' 
                                onChange= {handleChange('username')}
                                onBlur= {handleBlur('username')}
                                value={values.username}
                                />
                            </div>
                            {errors.username ? (
                                <text className={style.txtError}>{errors.username}</text>
                            ) : null}
                            {(values.username === 'P000' || values.username === 'p000') && (
                                <>
                                    <div>
                                        <input 
                                        className={style.input2}
                                        placeholder='Cost Center'
                                        type='text' 
                                        onChange= {handleChange('cost_center')}
                                        onBlur= {handleBlur('cost_center')}
                                        value={values.cost_center}
                                        />
                                    </div>
                                    {values.cost_center === '' ? (
                                        <text className={style.txtError}>must be filled</text>
                                    ) : null}
                                </>
                            )}
                            <div>
                                <input
                                className={style.input2}
                                placeholder='Password'
                                type='password'
                                onChange= {handleChange('password')}
                                onBlur= {handleBlur('password')}
                                value={values.password}
                                />
                            </div>
                            {errors.password ? (
                                <text className={style.txtError}>{errors.password}</text>
                            ) : null}
                            <button disabled={(values.username === 'p000' || values.username === 'P000') && values.cost_center === '' ? true : false} onClick={handleSubmit} className={style.button}>LOGIN</button>
                        </div>
                        <div className='icon mt-4'><AiOutlineCopyrightCircle size={18} className="mr-3" />OFR-PMA 2022</div>
                </Form>
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