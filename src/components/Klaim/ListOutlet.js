import React, { Component } from 'react'
import style from '../../assets/css/input.module.css'
import {Table} from 'reactstrap'
import {connect} from 'react-redux'

class ListOutlet extends Component {
  render() {
    const { klaimOutlet } = this.props.klaim
    return (
        <>
            {klaimOutlet.length > 0 ? (
                <>
                <div className='mt-3 mb-3'>
                    List Outlet
                </div>
                <Table striped bordered hover responsive className={style.tab}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nilai Ajuan</th>
                            <th>Memiliki NPWP</th>
                            <th>Nama NPWP</th>
                            <th>No NPWP</th>
                            <th>Nama KTP</th>
                            <th>No KTP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {klaimOutlet.length !== 0 && klaimOutlet.map(item => {
                            return (
                                <tr>
                                <th>{klaimOutlet.indexOf(item) + 1}</th>
                                <td>{item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                <td>{item.status_npwp === 1 ? 'Ya' : 'Tidak'}</td>
                                <td>{item.nama_npwp}</td>
                                <td>{item.no_npwp}</td>
                                <td>{item.nama_ktp}</td>
                                <td>{item.no_ktp}</td>
                            </tr>
                            )
                        })}
                    </tbody>
                </Table>
                </>
            ) : (
                <div></div>
            )}
        </>
    )
  }
}
const mapStateToProps = state => ({
    klaim: state.klaim
})

export default connect(mapStateToProps)(ListOutlet)
