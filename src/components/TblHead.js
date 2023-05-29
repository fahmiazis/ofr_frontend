import React, { Component } from 'react'
import {Table} from 'reactstrap'
import style from '../assets/css/input.module.css'

export default class TblHead extends Component {
  render() {
    const tagBody = this.props.tagBody
    return (
        <Table bordered responsive hover className={style.tab} id="table-klaim">
            <thead>
                <tr>
                    <th>No</th>
                    <th>NO.AJUAN</th>
                    <th>COST CENTRE</th>
                    <th>AREA</th>
                    <th>NO.COA</th>
                    <th>NAMA COA</th>
                    <th>KETERANGAN TAMBAHAN</th>
                    <th>TGL AJUAN</th>
                    <th>STATUS</th>
                    <th>OPSI</th>
                </tr>
            </thead>
            {tagBody}
        </Table>
    )
  }
}
