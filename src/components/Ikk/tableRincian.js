import React, { Component } from 'react'
import {Table} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {connect} from 'react-redux'
import moment from 'moment'

class TableRincian extends Component {
  render() {
    const {detailIkk} = this.props.ikk
    return (
        <>
        <div>
            <Table bordered responsive hover 
                className='tabikk' size='sm'
            >
                <thead>
                    <tr>
                        <th className='tbikk' rowSpan={2}>NO</th>
                        <th className='tbikk' rowSpan={2}>NO. BPKK</th>
                        <th className='tbikk' rowSpan={2} colSpan={2}>URAIAN</th>
                        <th className='tbikk' rowSpan={2}>KETERANGAN</th>
                        <th colSpan={2}>USER</th>
                        <th className='tbikk' rowSpan={2}>JUMLAH</th>
                    </tr>
                    <tr>
                        <th>NAMA</th>
                        <th>JABATAN</th>
                    </tr>
                </thead>
                <tbody>
                    {detailIkk.length !== 0 && detailIkk.map(item => {
                        return (
                            <tr>
                                <th scope="row">{detailIkk.indexOf(item) + 1}</th>
                                <th>{item.no_bpkk}</th>
                                <th>{item.no_coa}</th>
                                <th>{item.nama_coa}</th>
                                <th>{item.sub_coa}</th>
                                <th>{item.nama_npwp === null || item.nama_npwp === '' ? item.nama_ktp : item.nama_npwp}</th>
                                <th>{item.user_jabatan}</th>
                                <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
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
    ikk: state.ikk,
    menu: state.menu,
    reason: state.reason
})

export default connect(mapStateToProps)(TableRincian)
