import React, { Component } from 'react'
import style from '../../assets/css/input.module.css'
import {connect} from 'react-redux'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import moment from 'moment'

class JurnalArea extends Component {

    state = {
        totalfpd: 0,
        jurnal: [1, 2],
        jurnalPPh: [1, 2, 3],
        jurnalFull: [1, 2, 3, 4]
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
    const {jurnal, jurnalPPh, jurnalFull} = this.state

    return (
      <div>
        <div className='ml-2 titJurnal'>Jurnal Area</div>
        <Table bordered responsive hover>
            <thead>
                <tr>
                    <th>{detailIkk.length > 0 ? detailIkk[0].depo.status_area : ''}</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Dr</th>
                    <th>Cr</th>
                </tr>
            </thead>
            <tbody>
                {detailIkk.length > 0 && detailIkk.map(item => {
                    return (
                        (item.jenis_pph === 'Non PPh' || item.jenis_pph === null) && item.type_transaksi !== 'Ya' ? (
                            jurnal.map((e, index) => {
                                return (
                                <tr>
                                    <th>{index === 0 ? item.nama_coa : ''}</th>
                                    <th>{index === 1 ? 'Kas Kecil' : ''}</th>
                                    <th></th>
                                    <th></th>
                                    <th>{index === 0 ? item.nilai_ajuan : ''}</th>
                                    <th>{index === 1 ? item.nilai_ajuan : ''}</th>
                                </tr>
                                )
                            })
                        ) : item.jenis_pph !== 'Non PPh' && item.type_transaksi !== 'Ya' ? (
                            jurnalPPh.map((e, index) => {
                                return (
                                <tr>
                                    <th>{index === 0 ? item.nama_coa : ''}</th>
                                    <th>{index === 1 ? `Utang ${item.jenis_pph}` : index === 2 ? 'Kas Kecil' : ''}</th>
                                    <th></th>
                                    <th></th>
                                    <th>{index === 0 ? item.nilai_ajuan : ''}</th>
                                    <th>{index === 1 ? item.nilai_utang : index === 2 ? item.nilai_bayar: ''}</th>
                                </tr>
                                )
                            })
                        ) : item.jenis_pph !== 'Non PPh' && item.type_transaksi === 'Ya' && (
                            jurnalFull.map((e, index) => {
                                return (
                                <tr>
                                    <th>{index === 0 ? item.nama_coa : index === 1 ? 'PPN Masukan Non Dagang' : ''}</th>
                                    <th>{index === 2 ? `Utang ${item.jenis_pph}` : index === 3 ? 'Kas Kecil' : ''}</th>
                                    <th></th>
                                    <th></th>
                                    <th>{index === 0 ? item.dpp : index === 1 ? item.ppn : ''}</th>
                                    <th>{index === 2 ? item.nilai_utang : index === 3 ? item.nilai_bayar : ''}</th>
                                </tr>
                                )
                            })
                        )
                    )
                })}
                
            </tbody>
        </Table>
      </div>
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

export default connect(mapStateToProps)(JurnalArea)