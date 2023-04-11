import React, { Component } from 'react'
import style from '../../assets/css/input.module.css'
import {connect} from 'react-redux'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import moment from 'moment'

class FPD extends Component {
  render() {
    const {detailKlaim, ttdKlaim} = this.props.klaim
    const totalfpd = this.props.totalfpd
    return (
      <>
        <div>
            <div className="fpdTit">FORM PERMINTAAN DANA</div>
            <div className='fpdTit'>cabang/depo : {detailKlaim.length > 0 ? detailKlaim[0].area : ''}</div>
            <div className='fpdTit'>no : {detailKlaim.length > 0 ? detailKlaim[0].no_transaksi : ''}</div>
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
            {detailKlaim.length !== 0 && detailKlaim.map(item => {
                return (
                    <Row className='mt-4'>
                        <Col md={1} className='upper'>
                            <div className='line'>{detailKlaim.indexOf(item) + 1}</div>
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
                        {totalfpd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </div>
                </Col>
            </Row>
        </div>
        <div className='bold'>{detailKlaim.length > 0 ? detailKlaim[0].area : ''}, {moment(detailKlaim.length > 0 ? moment(detailKlaim[0].updatedAt).format('DD MMMM YYYY') : '').format('DD MMMM YYYY')}</div>
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
                                    {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.map(item => {
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
                                {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.map(item => {
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
                                    {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length === 0 ? (
                                        <th className="headPre">
                                            <div className="mb-2">-</div>
                                            <div>-</div>
                                        </th>
                                    ) : ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.map(item => {
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
                                    {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length === 0 ? (
                                        <td className="footPre">-</td>
                                    ) : ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.map(item => {
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
                                    {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.map(item => {
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
                                    {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.map(item => {
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
      </>
    )
  }
}
const mapStateToProps = state => ({
    approve: state.approve,
    depo: state.depo,
    user: state.user,
    notif: state.notif,
    klaim: state.klaim,
    menu: state.menu,
    reason: state.reason
})

export default connect(mapStateToProps)(FPD)
