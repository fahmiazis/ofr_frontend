import React, { Component } from 'react'
import style from '../../assets/css/input.module.css'
import {connect} from 'react-redux'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import moment from 'moment'
const cek21 = 'PPh Pasal 21'
const cek23 = 'PPh Pasal 23'
const cek4a2 = 'PPh Pasal 4(2)'

class JurnalArea extends Component {

    state = {
        totalfpd: 0,
        jurnal2: [1, 2],
        jurnal3: [1, 2, 3],
        jurnal4: [1, 2, 3, 4]
    }

    componentDidMount() {
        const {detailOps} = this.props.ops
        let total = 0
        for (let i = 0; i < detailOps.length; i++) {
            total += parseInt(detailOps[i].nilai_buku)
        }
        this.setState({totalfpd: total})
    }

  render() {
    const {detailOps, ttdOps} = this.props.ops
    const {jurnal2, jurnal3, jurnal4} = this.state
    const {dataPphSc, dataPph} = this.props.coa
    const system = detailOps.length > 0 && detailOps[0].depo.type_live === 'NON LIVE SAP (SCYLLA)' ? 'SCYLAA' : 'SAP'
    const glkk = detailOps.length > 0 && detailOps[0].depo !== null && detailOps[0].depo.glikk !== null ? detailOps[0].depo.glikk.gl_account : ''

    return (
      <div>
        <div className='ml-2'>Jurnal Area</div>
        {detailOps.length > 0 && detailOps.map(item => {
            return (
                <Table className='titJurnal' bordered responsive hover>
                    <thead>
                        <tr>
                            <th colSpan={5}>
                                {`${system} - `}
                                {(item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi !== 'Ya' ? 'Non PPh - Non PPN' 
                                : item.jenis_pph !== 'Non PPh' && item.type_transaksi !== 'Ya' ? 'PPh - Non PPN'
                                : item.jenis_pph === 'Non PPh' && item.type_transaksi === 'Ya' ? 'PPN - Non PPh'
                                : item.jenis_pph !== 'Non PPh' && item.type_transaksi === 'Ya' ? 'PPH - PPN' : ''
                                }
                            </th>
                        </tr>
                        <tr>
                            <th>No Gl</th>
                            <th>Nama Gl</th>
                            <th>Db</th>
                            <th>Cr</th>
                            <th>Keterangan Transaksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi !== 'Ya' ? (
                                jurnal2.map((e, index) => {
                                    return (
                                    <tr>
                                        <th>{index === 0 ? item.no_coa : glkk}</th>
                                        <th>{index === 0 ? item.nama_coa : 'Kas Kecil'}</th>
                                        <th>{index === 0 ? item.nilai_buku !== null && item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}</th>
                                        <th>{index === 1 ? item.nilai_buku !== null && item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}</th>
                                        <th>{index === 0 ? item.sub_coa : ''}</th>
                                    </tr>
                                    )
                                })
                            ) : item.jenis_pph !== 'Non PPh' && item.type_transaksi !== 'Ya' ? (
                                jurnal3.map((e, index) => {
                                    return (
                                    <tr>
                                        <th>
                                            {index === 0 ? item.no_coa : index === 1 && system === 'SAP' ? 
                                            (item.jenis_pph === cek21 ? dataPph.pph21 :
                                            item.jenis_pph === cek23 ? dataPph.pph23 :
                                            item.jenis_pph === cek4a2 && dataPph.pph4a2) : index === 1 && system !== 'SAP' ? 
                                            (item.jenis_pph === cek21 ? dataPphSc.pph21 :
                                            item.jenis_pph === cek23 ? dataPphSc.pph23 :
                                            item.jenis_pph === cek4a2 && dataPphSc.pph4a2) : glkk}
                                        </th>
                                        <th>{index === 0 ? item.nama_coa : index === 1 ? `Utang ${item.jenis_pph}` : index === 2 ? 'Kas Kecil' : ''}</th>
                                        <th>{index === 0 ? item.nilai_buku !== null && item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}</th>
                                        <th>{index === 1 ? item.nilai_utang !== null && item.nilai_utang.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : index === 2 ? item.nilai_bayar !== null && item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."): ''}</th>
                                        <th>{index === 0 || index === 1? item.sub_coa : ''}</th>
                                    </tr>
                                    )
                                })
                            ) : item.jenis_pph === 'Non PPh' && item.type_transaksi === 'Ya' ? (
                                jurnal3.map((e, index) => {
                                    return (
                                    <tr>
                                        <th>
                                            {index === 0 ? item.no_coa : index === 1 ? dataPph.ppn : glkk}
                                        </th>
                                        <th>{index === 0 ? item.nama_coa : index === 1 ? 'PPN Masukan Non Dagang' : index === 2 ? 'Kas Kecil' : ''}</th>
                                        <th>{index === 0 ? item.dpp !== null && item.dpp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : index === 1 ? item.ppn !== null && item.ppn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}</th>
                                        <th>{index === 2 ? item.nilai_bayar !== null && item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}</th>
                                        <th>{index === 0 || index === 1 ? item.sub_coa : ''}</th>
                                    </tr>
                                    )
                                })
                            ) : item.jenis_pph !== 'Non PPh' && item.type_transaksi === 'Ya' && (
                                jurnal4.map((e, index) => {
                                    return (
                                    <tr>
                                        <th>
                                            {index === 0 ? item.no_coa : index === 1 ? dataPph.ppn : index === 2 && system === 'SAP' ? 
                                            (item.jenis_pph === cek21 ? dataPph.pph21 :
                                            item.jenis_pph === cek23 ? dataPph.pph23 :
                                            item.jenis_pph === cek4a2 && dataPph.pph4a2) : index === 2 && system !== 'SAP' ? 
                                            (item.jenis_pph === cek21 ? dataPphSc.pph21 :
                                            item.jenis_pph === cek23 ? dataPphSc.pph23 :
                                            item.jenis_pph === cek4a2 && dataPphSc.pph4a2) : glkk}
                                        </th>
                                        <th>{index === 0 ? item.nama_coa : index === 1 ? 'PPN Masukan Non Dagang' : index === 2 ? `Utang ${item.jenis_pph}` : index === 3 ? 'Kas Kecil' : ''}</th>
                                        <th>{index === 0 ? item.dpp !== null && item.dpp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : index === 1 ? item.ppn !== null && item.ppn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}</th>
                                        <th>{index === 2 ? item.nilai_utang !== null && item.nilai_utang.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : index === 3 ? item.nilai_bayar !== null && item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}</th>
                                        <th>{index === 0 || index === 1 || index === 2 ? item.sub_coa : ''}</th>
                                    </tr>
                                    )
                                })
                            )
                        }
                    </tbody>
                </Table>
                )
            })}
      </div>
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
    coa: state.coa
})

export default connect(mapStateToProps)(JurnalArea)