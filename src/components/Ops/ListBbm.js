import React, { Component } from 'react'
import style from '../../assets/css/input.module.css'
import {Table} from 'reactstrap'
import {connect} from 'react-redux'

class ListBbm extends Component {
  render() {
    const { detailOps } = this.props.ops
    return (
        <>
            {detailOps.length !== 0 && detailOps.map(item => {
                return (
                item.bbm !== undefined && item.bbm !== null && item.bbm.length !== 0 &&
                <>
                    <div className='mt-3 mb-3'>
                        List BBM Row Data {detailOps.indexOf(item) + 1}
                    </div>
                    <Table striped bordered hover responsive className={style.tab}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No Pol</th>
                                <th>Besar Pengisisan BBM (Liter)</th>
                                <th>KM Pengisian</th>
                                <th>Nominal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.bbm !== undefined && item.bbm !== null && item.bbm.length !== 0 && item.bbm.map(x => {
                                return (
                                    <tr>
                                        <th>{item.bbm.indexOf(x) + 1}</th>
                                        <td>{x.no_pol}</td>
                                        <td>{x.liter}</td>
                                        <td>{x.km}</td>
                                        <td>{x.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </>
                )
            })}
        </>
    )
  }
}
const mapStateToProps = state => ({
    ops: state.ops
})

export default connect(mapStateToProps)(ListBbm)
