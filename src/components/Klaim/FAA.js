import React, { Component } from 'react'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import TableRincian from './tableRincian'
import moment from 'moment'
import {connect} from 'react-redux'

class FAA extends Component {
  render() {
    const {detailKlaim, ttdKlaim} = this.props.klaim
    return (
        <>
            <div className='tbRinci'>
                <div>
                    {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                    {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailKlaim.length > 0 ? detailKlaim[0].area : ''} className="ml-3"  /></Col>
                    </Row>
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>no ajuan</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailKlaim.length > 0 ? detailKlaim[0].no_transaksi : ''} className="ml-3" /></Col>
                    </Row>
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailKlaim.length > 0 ? moment(detailKlaim[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
                    </Row>
                </div>
                <TableRincian />
                <Table borderless responsive className="tabPreview mt-4">
                <thead>
                    <tr>
                        {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.length > 0 && (
                            <th className="buatPre">Dibuat oleh,</th>
                        )}
                        {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length > 0 && (
                            <th className="buatPre">Diperiksa oleh,</th>
                        )}
                        {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.length > 0 && (
                            <th className="buatPre">Disetujui oleh,</th>
                        )}
                        {ttdKlaim.mengetahui !== undefined && ttdKlaim.mengetahui.length > 0 && (
                            <th className="buatPre">Diketahui oleh,</th>
                        )}
                    </tr>
                </thead>
                <tbody className="tbodyPre">
                    <tr>
                        {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.length > 0 && (
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
                        )}
                        {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length > 0 && (
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
                        )}
                        {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.length > 0 && (
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
                        )}
                        {ttdKlaim.mengetahui !== undefined && ttdKlaim.mengetahui.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {ttdKlaim.mengetahui !== undefined && ttdKlaim.mengetahui.map(item => {
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
                                            {ttdKlaim.mengetahui !== undefined && ttdKlaim.mengetahui.map(item => {
                                                return (
                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                )
                                            })}
                                        </tr>
                                    </tbody>
                            </Table>
                        </td>
                        )}
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
    klaim: state.klaim,
    menu: state.menu,
    reason: state.reason
})

export default connect(mapStateToProps)(FAA)
