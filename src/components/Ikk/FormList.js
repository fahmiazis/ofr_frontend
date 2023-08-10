import React, { Component } from 'react'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import moment from 'moment'
import {connect} from 'react-redux'
import style from '../../assets/css/input.module.css'

class FormList extends Component {
  render() {
    const { noDis, detailIkk, ttdIkk, ttdIkkList, dataDoc, newIkk } = this.props.ikk
    return (
      <>
        <div className='mr-4 ml-4 mt-4 mb-4'>
            <div>
                <div className="stockTitle">DAFTAR PENGIRIMAN DANA KE CABANG</div>
                <Row className="ptStock inputStock">
                    <Col md={3} xl={3} sm={3}>No Transaksi</Col>
                    <Col md={4} xl={4} sm={4} className="inputStock">:<Input 
                    name='no_transfer'
                    value={detailIkk.length > 0 ? detailIkk[0].no_pembayaran : ''}
                    disabled
                    className="ml-3" /></Col>
                </Row>
                <Row className="ptStock inputStock">
                    <Col md={3} xl={3} sm={3}>tanggal transaksi</Col>
                    <Col md={4} xl={4} sm={4} className="inputStock">:<Input 
                        name='tgl_transfer'
                        value={detailIkk.length > 0 ? moment(detailIkk[0].tanggal_transfer).format('DD MMMM YYYY') : ''}
                        disabled
                        className="ml-3" /></Col>
                </Row>
                <Row className="ptStock inputStock">
                    <Col md={3} xl={3} sm={3}>sumber rekening</Col>
                    <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value="1300015005005 / PT PINUS MERAH ABADI" /></Col>
                </Row>
                <Row className="ptStock inputStock">
                    <Col md={3} xl={3} sm={3}>nama bank</Col>
                    <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value="BANK MANDIRI  BINA CITRA  BANDUNG" /></Col>
                </Row>
            </div>
            <div className={style.tableDashboard}>
                <Table bordered responsive hover className={style.tab} id="table-to-xls">
                    <thead>
                        <tr className='tbklaim'>
                            <th>NO</th>
                            <th>No FPD</th>
                            <th>Cabang</th>
                            <th>COST CENTRE</th>
                            <th>Nama Bank</th>
                            <th>No Rekening</th>
                            <th>Atas Nama</th>
                            <th>Nominal</th>
                            <th>Keterangan</th>
                            <th>No PO</th>
                            <th>Area</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailIkk.length !== 0 && detailIkk.map(item => {
                            return (
                                <tr>
                                    <th scope="row">{detailIkk.indexOf(item) + 1}</th>
                                    <th>{item.no_transaksi}</th>
                                    <th>{item.area}</th>
                                    <th>{item.cost_center}</th>
                                    <th>{item.bank_tujuan}</th>
                                    <th>{item.norek_ajuan}</th>
                                    <th>{item.nama_tujuan}</th>
                                    <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                    <th>{item.keterangan}</th>
                                    <th>-</th>
                                    <th>{item.depo.channel}</th>
                                </tr>
                            )
                        })}
                        {detailIkk.length > 0 && (
                            <tr>
                                <th className='total' colSpan={7}>Total</th>
                                <th>
                                    {detailIkk.reduce((accumulator, object) => {
                                        return accumulator + parseInt(object.nilai_ajuan);
                                    }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                </th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <Table borderless responsive className="tabPreview mt-4 mb-4">
                <thead>
                    <tr>
                        <th className="buatPre">Dibuat oleh,</th>
                        <th className="buatPre">Diketahui oleh,</th>
                        <th className="buatPre">Disetujui oleh,</th>
                    </tr>
                </thead>
                <tbody className="tbodyPre">
                    <tr>
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {ttdIkkList.pembuat !== undefined && ttdIkkList.pembuat.map(item => {
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
                                        {ttdIkkList.pembuat !== undefined && ttdIkkList.pembuat.map(item => {
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
                                            {ttdIkkList.mengetahui !== undefined && ttdIkkList.mengetahui.map(item => {
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
                                            {ttdIkkList.mengetahui !== undefined && ttdIkkList.mengetahui.map(item => {
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
                                            {ttdIkkList.penyetuju !== undefined && ttdIkkList.penyetuju.map(item => {
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
                                            {ttdIkkList.penyetuju !== undefined && ttdIkkList.penyetuju.map(item => {
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

export default connect(mapStateToProps)(FormList)
