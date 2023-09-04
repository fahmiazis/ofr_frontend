import React, { Component } from 'react'
import style from '../../assets/css/input.module.css'
import {connect} from 'react-redux'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import moment from 'moment'

class JurnalArea extends Component {

    state = {
        totalfpd: 0,
        jurnal: [1, 2, 3, 4, 5],
        jurnalPPh: [1, 2, 3],
        jurnalFull: [1, 2, 3, 4]
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
    const {jurnal, jurnalPPh, jurnalFull} = this.state

    return (
      <div>
        <div className='ml-2 titJurnal'>Jurnal Area</div>
        <Table bordered responsive hover>
            <thead>
                <tr>
                    <th>PIC</th>
                    <th>KETERANGAN</th>
                    <th>DEBET / KREDIT</th>
                    <th>NAMA GL</th>
                    <th>PROFIT CENTER</th>
                    <th>D</th>
                    <th>K</th>
                </tr>
            </thead>
            <tbody>
                {detailOps.length > 0 && detailOps.map(item => {
                    return (
                        jurnal.map((e, index) => {
                            return (
                            <tr>
                                <th>{index === 0 || index === 3 ? 'AREA' : ''}</th>
                                <th>{index === 0 || index === 3 ? 'Cabang/Depo/CP terima uang dari Bank Ops HO' : ''}</th>
                                <th>{index === 0 || index === 3 ? 'DEBET' : index === 1 || index === 4 ? 'KREDIT' : ''}</th>
                                <th>{index === 0 || index === 4 ? 'ATM Spending Card' : index === 1 || index === 3 ? 'Kasbon Area' : ''}</th>
                                <th>{index === 0 || index === 3 ? 'AREA' : index === 1 || index === 4 ? 'AREA' : ''}</th>
                                <th>{index === 0 || index === 3 ? item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}</th>
                                <th>{index === 1 || index === 4 ? item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}</th>
                            </tr>
                            )
                        })
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
    ops: state.ops,
    menu: state.menu,
    reason: state.reason
})

export default connect(mapStateToProps)(JurnalArea)