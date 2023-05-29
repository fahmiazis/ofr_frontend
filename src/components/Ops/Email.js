import React, { Component } from 'react'
import {Table, Input} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {connect} from 'react-redux'
import moment from 'moment'
import {Formik} from 'formik'

class TableRincian extends Component {

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
        const {detailOps} = this.props.ops
        const cek = draftEmail.result
        const message = cek === undefined ? '' : cek.message
        const subject = cek === undefined ? '' : `${cek.type} ${cek.menu} NO ${detailOps[0].no_transaksi}`
        this.setState({message: message, subject: subject})
        this.props.handleData({message: message, subject: subject})
    }

  render() {
    const {detailOps} = this.props.ops
    const { draftEmail } = this.props.email
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
            <div className='addModalMenu'>
                <text className="col-md-3">
                    To
                </text>
                <div className="col-md-9 listcek">
                        <div className='listcek mr-2'>
                            <Input
                            type="checkbox" 
                            name="access"
                            checked
                            className='ml-1'
                            // onChange={listTo.find(element => element === item.name) === undefined ? () => this.checkToApp(item.name) : () => this.checkToRej(item.name)}
                            />
                            <text className='ml-4'>{`${draftEmail.to.role.name}: ${draftEmail.to.username}`}</text>
                        </div>
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
                                <text className='ml-4'>{`${item.role.name}: ${item.username}`}</text>
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
                        <tr className='tbikk'>
                            <th>NO</th>
                            <th>COST CENTRE</th>
                            <th>NO COA</th>
                            <th>NAMA COA</th>
                            <th>KETERANGAN TAMBAHAN</th>
                            <th>TGL AJUAN</th>
                            <th>NILAI YANG DIAJUKAN</th>
                            <th>BANK</th>
                            <th>NOMOR REKENING</th>
                            <th>ATAS NAMA</th>
                            <th>MEMILIKI NPWP</th>
                            <th>NAMA SESUAI NPWP</th>
                            <th>NOMOR NPWP</th>
                            <th>NILAI YANG DIBAYARKAN</th>
                            <th>TANGGAL TRANSFER</th>
                            <th>Status</th>
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
                                    <th>{moment(item.start_ops).format('DD/MMMM/YYYY')}</th>
                                    <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                    <th>{item.bank_tujuan}</th>
                                    <th>{item.norek_ajuan}</th>
                                    <th>{item.nama_tujuan}</th>
                                    <th>{item.status_npwp === 0 ? '' : 'Ya'}</th>
                                    <th>{item.status_npwp === 0 ? '' : item.nama_npwp}</th>
                                    <th>{item.status_npwp === 0 ? '' : item.no_npwp}</th>
                                    <th>{item.nilai_bayar}</th>
                                    <th>{item.tanggal_transfer}</th>
                                    <th>{item.isreject === 1 ? 'reject' : '-'}</th>
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
    ops: state.ops,
    menu: state.menu,
    reason: state.reason,
    email: state.email
})

export default connect(mapStateToProps)(TableRincian)
