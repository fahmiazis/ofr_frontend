import React, { Component } from 'react'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import TableRincian from './tableRincian'
import moment from 'moment'
import {connect} from 'react-redux'
import 'moment/locale/id'
moment.locale('id')

class FAA extends Component {

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
                <div className='mb-3'>
                    <div className='titleIkk'>
                        <div>
                            <div className="uppercase">pt. pinus merah abadi</div>
                            <div className="uppercase">cabang / depo : {detailIkk.length > 0 ? detailIkk[0].area : ''}</div>
                        </div>
                        <div className='secIkk'>
                            <div className="uppercase mr-1">nomor ikk :</div> 
                            <div className="uppercase numIkk ml-1">{detailIkk.length > 0 ? detailIkk[0].no_transaksi : ''}</div>
                        </div>
                    </div>
                    <div className='subIkk'>
                        <div className='uppercase'>ikhtisar kas kecil</div>
                        <div>Tanggal : {detailIkk.length > 0 ? moment(detailIkk[0].start_ikk).format('DD MMMM YYYY') : ''}</div>
                    </div>
                </div>
                <TableRincian />
                <Table bordered className='midFIkk'>
                    <tbody>
                        <tr>
                            <th>
                                <div>DIISI KEMBALI DENGAN :</div>
                                <div className='pl-3'>
                                    <Row >
                                        <Col className='rowGeneral'>
                                        <Input type='checkbox' /> TUNAI 
                                        </Col>
                                        <Col>-</Col>
                                    </Row>
                                    <Row>
                                        <Col className='rowGeneral'>
                                        <Input type='checkbox' /> CEK/BG/TRANSFER
                                        </Col>
                                        <Col>-</Col>
                                    </Row>
                                    <Row>
                                        <Col>NO.</Col>
                                        <Col>-</Col>
                                    </Row>
                                    <Row>
                                        <Col>TANGGAL</Col>
                                        <Col>-</Col>
                                    </Row>
                                    <Row>
                                        <Col>BANK</Col>
                                        <Col>-</Col>
                                    </Row>
                                    <Row>
                                        <Col>NO BBK</Col>
                                        <Col>-</Col>
                                    </Row>
                                </div>
                            </th>
                            <th>
                                <br />
                                <Row>
                                    <Col>
                                        PENGELUARAN 
                                    </Col>
                                    <Col>(A)</Col>
                                    <Col>{totalfpd === null || totalfpd === undefined ? 0 : totalfpd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        SALDO AWAL
                                    </Col>
                                    <Col>(B)</Col>
                                    <Col>-</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        PENGISIAN KEMBALI
                                    </Col>
                                    <Col>(C)</Col>
                                    <Col>-</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        SALDO AKHIR
                                    </Col>
                                    <Col>(D) = (B)+(C)-(A)</Col>
                                    <Col>-</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        KAS BON
                                    </Col>
                                    <Col>(E)</Col>
                                    <Col>-</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        SALDO AKHIR TUNAI
                                    </Col>
                                    <Col>(F) = (D)-(E)</Col>
                                    <Col>-</Col>
                                </Row>
                            </th>
                        </tr>
                    </tbody>
                </Table>
                <Table className="tabPreview">
                    <thead>
                        <tr>
                            <th className="buatPreIkk">Disetujui oleh,</th>
                            <th className="buatPreIkk">Dibuat oleh,</th>
                        </tr>
                    </thead>
                    <tbody className="tbodyPre">
                        <tr>
                            <td className="restTable">
                                <Table bordered responsive className="divPre">
                                        <thead>
                                            <tr>
                                                {ttdIkk.pemeriksa !== undefined && ttdIkk.pemeriksa.length === 0 ? (
                                                    <th className="headPreIkk">
                                                        <div className="mb-2">-</div>
                                                        <div>-</div>
                                                    </th>
                                                ) : ttdIkk.pemeriksa !== undefined && ttdIkk.pemeriksa.map(item => {
                                                    return (
                                                        <th className="headPreIkk">
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
                                                    <td className="footPreIkk">-</td>
                                                ) : ttdIkk.pemeriksa !== undefined && ttdIkk.pemeriksa.map(item => {
                                                    return (
                                                        <td className="footPreIkk">{item.jabatan === null ? "-" : item.jabatan}</td>
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
                                                {ttdIkk.pembuat !== undefined && ttdIkk.pembuat.map(item => {
                                                    return (
                                                        <th className="headPreIkk">
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
                                                    <td className="footPreIkk">{item.jabatan === null ? "-" : item.jabatan}</td>
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

export default connect(mapStateToProps)(FAA)
