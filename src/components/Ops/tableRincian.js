import React, { Component } from 'react'
import {Table} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {connect} from 'react-redux'
import moment from 'moment'

class TableRincian extends Component {
  render() {
    const {detailOps} = this.props.ops
    return (
        <>
        <div className={style.tableDashboard}>
            <Table bordered responsive hover className={style.tab}>
                <thead>
                    <tr className='tbklaim'>
                        <th>NO</th>
                        <th>COST CENTRE</th>
                        <th>NO COA</th>
                        <th>NAMA COA</th>
                        <th>KETERANGAN TAMBAHAN</th>
                        <th>PERIODE</th>
                        <th>NILAI YANG DIAJUKAN</th>
                        <th>BANK</th>
                        <th>NOMOR REKENING</th>
                        <th>ATAS NAMA</th>
                        <th>MEMILIKI NPWP</th>
                        <th>NAMA SESUAI NPWP</th>
                        <th>NOMOR NPWP</th>
                        <th>NAMA SESUAI KTP</th>
                        <th>NOMOR KTP</th>
                        <th>DPP</th>
                        <th>PPN</th>
                        <th>PPh</th>
                        <th>NILAI YANG DIBAYARKAN</th>
                        <th>TANGGAL TRANSFER</th>
                        <th>JENIS PPh</th>
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
                                <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                <th>{item.bank_tujuan}</th>
                                <th>{item.norek_ajuan}</th>
                                <th>{item.nama_tujuan}</th>
                                <th>{item.status_npwp === 0 ? 'Tidak' : 'Ya'}</th>
                                <th>{item.status_npwp === 0 ? '' : item.nama_npwp}</th>
                                <th>{item.status_npwp === 0 ? '' : item.no_npwp}</th>
                                <th>{item.status_npwp === 0 ? item.nama_ktp : ''}</th>
                                <th>{item.status_npwp === 0 ? item.no_ktp : ''}</th>
                                <th>{item.dpp}</th>
                                <th>{item.ppn}</th>
                                <th>{item.nilai_utang}</th>
                                <th>{item.nilai_bayar}</th>
                                <th>{item.tanggal_transfer}</th>
                                <th>{item.jenis_pph}</th>
                            </tr>
                            )
                        })}
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

export default connect(mapStateToProps)(TableRincian)
