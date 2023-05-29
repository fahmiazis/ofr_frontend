import React, { Component } from 'react'
import style from '../../assets/css/input.module.css'
import {connect} from 'react-redux'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import moment from 'moment'

class FPD extends Component {

    state = {
        totalfpd: 0
    }

    componentDidMount() {
        const {detailIkk} = this.props.ikk
        let total = 0
        for (let i = 0; i < detailIkk.length; i++) {
            total += parseInt(detailIkk[i].nilai_ajuan)
        }
        this.setState({totalfpd: total})
    }

  render() {
    const {detailIkk, ttdIkk} = this.props.ikk
    const totalfpd = this.props.totalfpd || this.state.totalfpd
    return (
      <>
        <div className='tbRinci'>
            <div>
                <div className="fpdTit">FORM PERMINTAAN DANA</div>
                <div className='fpdTit'>cabang/depo : {detailIkk.length > 0 ? detailIkk[0].area : ''}</div>
                <div className='fpdTit'>no : {detailIkk.length > 0 ? detailIkk[0].no_transaksi : ''}</div>
            </div>
            <div className={style.tableDashboard}>
                <Row>
                    <Col md={2} className='upper'>
                        <div className='liner2'>no</div>
                    </Col>
                    <Col md={8} className='upper'>
                        <div className='line'>keperluan / <br />keterangan</div>
                    </Col>
                    <Col md={2} className='upper'>
                        <div className='liner'>rupiah</div>
                    </Col>
                </Row>
                {detailIkk.length !== 0 && detailIkk.map(item => {
                    return (
                        <Row className='mt-4'>
                            <Col md={2} className='upper'>
                                <div className='line'>{detailIkk.indexOf(item) + 1}</div>
                            </Col>
                            <Col md={8} className='upper'>
                                <div className='line2'>{item.keterangan}</div>
                                <div className='line mt-1'>NO REK {item.bank_tujuan} {item.norek_ajuan}</div>
                            </Col>
                            <Col md={2} className='upper'>
                                <div className='line'>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                            </Col>
                        </Row>
                    )
                })}
                <Row className='mt-4'>
                    <Col md={2} className='upper'>
                    </Col>
                    <Col md={8} className='upper'>
                        <div className='line'>Total</div>
                    </Col>
                    <Col md={2} className='upper'>
                        <div className='line'>
                            {totalfpd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </div>
                    </Col>
                </Row>
            </div>
            <div className='bold'>{detailIkk.length > 0 ? detailIkk[0].area : ''}, {moment(detailIkk.length > 0 ? moment(detailIkk[0].updatedAt).format('DD MMMM YYYY') : '').format('DD MMMM YYYY')}</div>
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
                                        {ttdIkk.pembuat !== undefined && ttdIkk.pembuat.map(item => {
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
                                    {ttdIkk.pembuat !== undefined && ttdIkk.pembuat.map(item => {
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
                                        {ttdIkk.pemeriksa !== undefined && ttdIkk.pemeriksa.length === 0 ? (
                                            <th className="headPre">
                                                <div className="mb-2">-</div>
                                                <div>-</div>
                                            </th>
                                        ) : ttdIkk.pemeriksa !== undefined && ttdIkk.pemeriksa.map(item => {
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
                                        {ttdIkk.pemeriksa !== undefined && ttdIkk.pemeriksa.length === 0 ? (
                                            <td className="footPre">-</td>
                                        ) : ttdIkk.pemeriksa !== undefined && ttdIkk.pemeriksa.map(item => {
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
                                        {ttdIkk.penyetuju !== undefined && ttdIkk.penyetuju.map(item => {
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
                                        {ttdIkk.penyetuju !== undefined && ttdIkk.penyetuju.map(item => {
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
        </div>
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
    reason: state.reason
})

export default connect(mapStateToProps)(FPD)
