import React, { Component } from 'react'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import TableRincian from './tableRincian'
import moment from 'moment'
import {connect} from 'react-redux'

class FAA extends Component {
  render() {
    const {detailOps, ttdOps} = this.props.ops
    return (
        <>
            <div className='tbRinci'>
                <div>
                    {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                    {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].area : ''} className="ml-3"  /></Col>
                    </Row>
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>no ajuan</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].no_transaksi : ''} className="ml-3" /></Col>
                    </Row>
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailOps.length > 0 ? moment(detailOps[0].updatedAt).format('DD MMMM YYYY') : ''} /></Col>
                    </Row>
                </div>
                <TableRincian />
                <Table borderless responsive className="tabPreview mt-4">
                <thead>
                    <tr>
                        {ttdOps.pembuat !== undefined && ttdOps.pembuat.length > 0 && (
                            <th className="buatPre">Dibuat oleh,</th>
                        )}
                        {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length > 0 && (
                            <th className="buatPre">Diperiksa oleh,</th>
                        )}
                        {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.length > 0 && (
                            <th className="buatPre">Disetujui oleh,</th>
                        )}
                        {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.length > 0 && (
                            <th className="buatPre">Diketahui oleh,</th>
                        )}
                    </tr>
                </thead>
                <tbody className="tbodyPre">
                    <tr>
                    {ttdOps.pembuat !== undefined && ttdOps.pembuat.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
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
                                        {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
                                            return (
                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                            )
                                        })}
                                        </tr>
                                    </tbody>
                            </Table>
                        </td>
                    )}
                    {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                                <th className="headPre">
                                                    <div className="mb-2">-</div>
                                                    <div>-</div>
                                                </th>
                                            ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
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
                                            {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                                <td className="footPre">-</td>
                                            ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
                                                return (
                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                )
                                            })}
                                        </tr>
                                    </tbody>
                            </Table>
                        </td>
                    )}
                    {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
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
                                            {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
                                                return (
                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                )
                                            })}
                                        </tr>
                                    </tbody>
                            </Table>
                        </td>
                    )}
                    {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.map(item => {
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
                                            {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.map(item => {
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
    ops: state.ops,
    menu: state.menu,
    reason: state.reason
})

export default connect(mapStateToProps)(FAA)
