import React, { Component } from 'react'
import {Table, Input} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {connect} from 'react-redux'
import moment from 'moment'
import {Formik} from 'formik'

class EmailVerven extends Component {

    state = {
        message: '',
        subject: ''
    }

    onEnter = (val) => {
        const data = {
            [val.name]: val.value
        }
        this.setState(data)
        setTimeout(() => {
            const {message, subject} = this.state
            this.props.handleData({message: message, subject: subject})
         }, 500)
    }

    componentDidMount() {
        const { draftEmail } = this.props.email
        const {detailVerven} = this.props.verven
        const cek = draftEmail.result
        const no = detailVerven[0].no_transaksi
        const message = cek === undefined ? '' : cek.message
        const subject = cek === undefined ? '' : `${cek.type === 'submit' ? '' : cek.type} ${cek.menu} NO ${no}`
        this.setState({message: message, subject: subject})
        this.props.handleData({message: message, subject: subject})
    }

  render() {
    const {detailVerven} = this.props.verven
    const { draftEmail } = this.props.email
    const statMail = this.props.statMail || ''
    const {dataResmail} = this.props.email
    return (
        <>
        <Formik
        initialValues={{
            message: draftEmail.result === undefined ? '' : draftEmail.result.message
        }}
        // validationSchema={emailSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
            <>
            {statMail === 'resend' && (
                <>
                <div className='addModalMenu'>
                    <text className="col-md-3">
                        Status
                    </text>
                    <div className="col-md-9">
                        Terkirim
                    </div>
                </div>
                <div className='addModalMenu'>
                    <text className="col-md-3">
                        Jumlah terkirim
                    </text>
                    <div className="col-md-9">
                        {dataResmail !== null && dataResmail.status !== undefined ? dataResmail.status : 1}
                    </div>
                </div>
                <hr />
                </>
            )}
            <div className='addModalMenu'>
                <text className="col-md-3">
                    To
                </text>
                <div className="col-md-9 listcek">
                    {draftEmail.to.length === undefined ? (
                        <div className='listcek mr-2'>
                            <Input
                            type="checkbox" 
                            name="access"
                            checked
                            className='ml-1'
                            // onChange={listTo.find(element => element === item.name) === undefined ? () => this.checkToApp(item.name) : () => this.checkToRej(item.name)}
                            />
                            <text className='ml-4'>{`${draftEmail.to.role.name}: ${draftEmail.to.fullname}`}</text>
                        </div>
                    ) : draftEmail.to.length > 0 && draftEmail.to.map(item => {
                        return (
                            <div className='listcek mr-2'>
                                <Input
                                type="checkbox" 
                                name="access"
                                checked
                                className='ml-1'
                                // onChange={listTo.find(element => element === item.name) === undefined ? () => this.checkToApp(item.name) : () => this.checkToRej(item.name)}
                                />
                                <text className='ml-4'>{`${item.role.name}: ${item.fullname}`}</text>
                            </div>
                        )
                    }
                    )}
                    
                </div>
            </div>
            <div className='addModalMenu'>
                <text className="col-md-3">
                    Cc
                </text>
                <div className="col-md-9 listcek">
                    {draftEmail.cc.length !== 0 && draftEmail.cc.map(item => {
                        return (
                            <div className='listcek mr-2'>
                                <Input 
                                type="checkbox"
                                name="access"
                                checked
                                className='ml-1'
                                // onChange={listCc.find(element => element === item.name) === undefined ? () => this.checkApp(item.name) : () => this.checkRej(item.name)}
                                />
                                <text className='ml-4'>{`${item.role.name}: ${item.fullname}`}</text>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={style.addModalDepo}>
                <text className="col-md-3">
                    Subject
                </text>
                <div className="col-md-9">
                    <Input 
                    type='textarea'
                    name="subject"
                    value={this.state.subject}
                    onChange={e => this.onEnter(e.target)}
                    // onBlur={handleBlur("subject")}
                    // onChange={handleChange("subject")}
                    />
                    {errors.subject ? (
                        <text className={style.txtError}>{errors.subject}</text>
                    ) : null}
                </div>
            </div>
            <div className={style.addModalDepo}>
                <text className="col-md-3">
                    Message
                </text>
                <div className="col-md-9">
                    <Input 
                    type='textarea'
                    name="message"
                    value={this.state.message}
                    onChange={e => this.onEnter(e.target)}
                    // onBlur={handleBlur("message")}
                    // onChange={handleChange("message")}
                    />
                    {errors.message ? (
                        <text className={style.txtError}>{errors.message}</text>
                    ) : null}
                </div>
            </div>
            <div className={style.tableDashboard}>
                <Table bordered responsive hover className={style.tab}>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>No ajuan</th>
                            <th>Nama Vendor</th>
                            <th>No KTP</th>
                            <th>No NPWP</th>
                            <th>Alamat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailVerven.length !== 0 && detailVerven.map(item => {
                            return (
                                <tr>
                                    <th scope="row">{detailVerven.indexOf(item) + 1}</th>
                                    <th>{item.no_transaksi}</th>
                                    <th>{item.nama}</th>
                                    <th>{item.nik}</th>
                                    <th>{item.npwp}</th>
                                    <th>{item.alamat}</th>
                                </tr>
                                )
                            })}
                    </tbody>
                </Table>
            </div>
            <hr/>
            </>
            )}
        </Formik>
        </>
    )
  }
}

const mapStateToProps = state => ({
    approve: state.approve,
    depo: state.depo,
    user: state.user,
    notif: state.notif,
    ikk: state.ikk,
    menu: state.menu,
    reason: state.reason,
    email: state.email,
    verven: state.verven
})

export default connect(mapStateToProps)(EmailVerven)
