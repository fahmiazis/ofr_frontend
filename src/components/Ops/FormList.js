import React, { Component } from 'react'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import ops from '../../redux/actions/ops'
import moment from 'moment'
import {connect} from 'react-redux'
import style from '../../assets/css/input.module.css'
import ExcelJS from "exceljs";
import fs from "file-saver";

class FormList extends Component {

    async componentDidMount() {
        const download = localStorage.getItem('download')
        if (download !== null && download !== undefined) {
            const token = localStorage.getItem("token")
            const draftno = {
                no: download,
                tipe: 'ajuan bayar'
            }
            await this.props.getDetail(token, draftno)
            await this.props.getApprovalList(token, draftno)
            this.downloadForm()
        }
    }

    downloadForm = () => {
        const { detailOps, ttdOpsList } = this.props.ops
        
        const alpha = Array.from(Array(26)).map((e, i) => i + 65)
        const alphabet = alpha.map((x) => String.fromCharCode(x))
        const str = 'd'
        const str2 = 'h'

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('form list ajuan bayar')
        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        ws.addRow(['', 'DAFTAR PENGIRIMAN DANA KE CABANG'])
        ws.addRow()
        ws.addRow(['', 'NO. TRANSAKSI', `: ${detailOps.length > 0 ? detailOps[0].no_pembayaran : ''}`])
        ws.addRow(['', 'TANGGAL TRANSAKSI', `: ${detailOps.length > 0 ? moment(detailOps[0].tanggal_transfer).format('DD MMMM YYYY') : ''}`])
        ws.addRow(['', 'SUMBER REKENING', ': 1300015005005 / PT PINUS MERAH ABADI'])
        ws.addRow(['', 'NAMA BANK', ': BANK MANDIRI - BINA CITRA BANDUNG'])

        const dataRow = []

        detailOps.map((item, index) => { 
            return (
                dataRow.push([
                    index + 1, 
                    item.no_transaksi, 
                    item.area, 
                    item.depo.profit_center, 
                    item.bank_tujuan, 
                    item.tujuan_tf === 'ID Pelanggan' ? item.id_pelanggan : item.norek_ajuan, 
                    item.nama_tujuan, 
                    item.dpp !== null && item.dpp !== 0 && item.dpp !== '0' && item.dpp !== '' ? item.dpp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    item.ppn !== null && item.ppn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    item.nilai_utang !== null && `(-) ${item.nilai_utang.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
                    item.nilai_bayar === null || item.nilai_bayar === undefined ? 0 : item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 
                    item.keterangan,
                    '-',
                    item.depo.channel
                ])
            )
        })

        ws.addTable({
            name: 'MyTable',
            ref: 'A8',
            headerRow: true,
            // totalsRow: true,
            style: {
            //   theme: 'TableStyleDark3',
              showRowStripes: true,
            },
            columns: [
                {name: 'NO'},
                {name: 'No FPD'},
                {name: 'Cabang'},
                {name: 'COST CENTRE'},
                {name: 'Nama Bank'},
                {name: 'No Rekening'},
                {name: 'Atas Nama'},
                {name: 'DPP'},
                {name: 'PPN'},
                {name: 'PPh'},
                {name: 'Total Bayar'},
                {name: 'Keterangan'},
                {name: 'No PO'},
                {name: 'Area'}
            ],
            rows: dataRow,
          });

        ws.columns.forEach((column, index) => {
            const lengths = column.values.map(v => v.toString().length)
            const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
            if (index === 0) {    
                column.width = maxLength
            } else if (ws.columns.length - 1 === index || ws.columns.length - 2 === index) {
                column.width = maxLength + 15
            } else {
                column.width = maxLength + 5
            }
        })

        ws.addRow([
            '', 
            'TOTAL', 
            '', 
            '', 
            '', 
            '', 
            '', 
            '', 
            '', 
            '', 
            detailOps.reduce((accumulator, object) => {
                return accumulator + parseInt(object.nilai_bayar);
            }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 
            '', 
            '', 
            ''
            ]
        )
        
        ws.addRow()
        const sumRow = 11 + dataRow.length
        const headRow = 1 + sumRow
        const mainRow = 3 + sumRow
        const footRow = 5 + sumRow
        const botRow = 7 + sumRow
        console.log(sumRow)

        // Approval Dibuat
        ws.mergeCells(`B${sumRow}`, `C${sumRow}`)
        ws.getCell(`B${sumRow}`).value = 'Dibuat oleh,'
        ws.getCell(`B${sumRow}`).alignment = { horizontal:'center'}

        ws.mergeCells(`B${headRow}`, `C${botRow}`)
        // ws.mergeCells(`B${mainRow}`, `C${footRow - 1}`)
        // ws.mergeCells(`B${footRow}`, `C${botRow + 1}`)

        ttdOpsList.pembuat !== undefined && ttdOpsList.pembuat.map(item => {
                ws.getCell(`B${headRow}`).value = item.nama === null 
                ? `- \n\n\n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === '0' 
                ? `\nReject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `\nApprove (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${item.nama} \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
        })

        ws.getCell(`B${headRow}`).alignment = { 
            horizontal:'center', 
            wrapText: true, 
            vertical: 'middle', 
            ...borderStyles
        }

        // Approval Diketahui

        ws.mergeCells(`D${sumRow}`, `G${sumRow}`)
        ws.getCell(`D${sumRow}`).value = 'Diketahui oleh,'
        ws.getCell(`D${sumRow}`).alignment = { horizontal:'center'}

        ttdOpsList.mengetahui !== undefined && ttdOpsList.mengetahui.map((item, index) => {
                if (ttdOpsList.mengetahui.length > 1) {
                const startRow = alphabet[alphabet.indexOf(alphabet.find(item => item === str.toUpperCase())) + (2 * index)]
                const endRow = alphabet[alphabet.indexOf(alphabet.find(item => item === str.toUpperCase())) + ((2 * index) + 1)]
                
                console.log(alphabet.indexOf(alphabet.find(item => item === str.toUpperCase())))
                console.log(`${startRow}${headRow}`, `${endRow}${botRow} Quenn`)

                ws.mergeCells(`${startRow}${headRow}`, `${endRow}${botRow}`)
                ws.getCell(`${startRow}${headRow}`).value = item.nama === null 
                ? `- \n\n\n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === '0' 
                ? `\nReject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `\nApprove (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${item.nama} \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`

                ws.getCell(`${startRow}${headRow}`).alignment = { 
                    horizontal:'center', 
                    wrapText: true, 
                    vertical: 'middle', 
                    ...borderStyles
                }
            } else {
                ws.mergeCells(`D${headRow}`, `G${botRow}`)
                ws.getCell(`D${headRow}`).value = item.nama === null 
                ? `- \n\n\n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === '0' 
                ? `\nReject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `\nApprove (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${item.nama} \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
                
                ws.getCell(`D${headRow}`).alignment = { 
                    horizontal:'center', 
                    wrapText: true, 
                    vertical: 'middle', 
                    ...borderStyles
                }
            }
        })


        // Approval Disetujui
        ws.mergeCells(`H${sumRow}`, `K${sumRow}`)
        ws.getCell(`H${sumRow}`).value = 'Disetujui oleh,'
        ws.getCell(`H${sumRow}`).alignment = { horizontal:'center'}

        ttdOpsList.penyetuju !== undefined && ttdOpsList.penyetuju.map((item, index) => {
            if (ttdOpsList.penyetuju.length > 1) {
                const startRow = alphabet[alphabet.indexOf(alphabet.find(item => item === str2.toUpperCase())) + (2 * index)]
                const endRow = alphabet[alphabet.indexOf(alphabet.find(item => item === str2.toUpperCase())) + ((2 * index) + 1)]
                
                console.log(alphabet.indexOf(alphabet.find(item => item === str2.toUpperCase())))
                console.log(`${startRow}${headRow}`, `${endRow}${botRow} King`)

                ws.mergeCells(`${startRow}${headRow}`, `${endRow}${botRow}`)
                ws.getCell(`${startRow}${headRow}`).value = item.nama === null 
                ? `- \n\n\n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === '0' 
                ? `\nReject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `\nApprove (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${item.nama} \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`

                ws.getCell(`${startRow}${headRow}`).alignment = { 
                    horizontal:'center', 
                    wrapText: true, 
                    vertical: 'middle', 
                    ...borderStyles
                }
            } else {
                ws.mergeCells(`H${headRow}`, `K${botRow}`)
                ws.getCell(`H${headRow}`).value = item.nama === null 
                ? `- \n\n\n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === '0' 
                ? `\nReject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `\nApprove (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${item.nama} \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
                
                ws.getCell(`H${headRow}`).alignment = { 
                    horizontal:'center', 
                    wrapText: true, 
                    vertical: 'middle', 
                    ...borderStyles
                }
            }
        })

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Form Ajuan Bayar Operasional ${moment().format('DD MMMM YYYY')}.xlsx`
            );
        });
        localStorage.removeItem('download')
    }

  render() {
    const { noDis, detailOps, ttdOps, ttdOpsList, dataDoc, newOps } = this.props.ops
    return (
      <>
        <div className='mr-4 ml-4 mt-4 mb-4'>
            <div>
                <div className="stockTitle">DAFTAR PENGIRIMAN DANA KE CABANG</div>
                <Row className="ptStock inputStock">
                    <Col md={3} xl={3} sm={3}>No Transaksi</Col>
                    <Col md={6} xl={6} sm={6} className="inputStock">:<Input 
                    name='no_transfer'
                    value={detailOps.length > 0 ? detailOps[0].no_pembayaran : ''}
                    disabled
                    className="ml-3" /></Col>
                </Row>
                <Row className="ptStock inputStock">
                    <Col md={3} xl={3} sm={3}>tanggal transaksi</Col>
                    <Col md={6} xl={6} sm={6} className="inputStock">:<Input 
                        name='tgl_transfer'
                        value={detailOps.length > 0 ? moment(detailOps[0].tanggal_transfer).format('DD MMMM YYYY') : ''}
                        disabled
                        className="ml-3" /></Col>
                </Row>
                <Row className="ptStock inputStock">
                    <Col md={3} xl={3} sm={3}>sumber rekening</Col>
                    <Col md={6} xl={6} sm={6} className="inputStock">:<Input disabled className="ml-3" value="1300015005005 / PT PINUS MERAH ABADI" /></Col>
                </Row>
                <Row className="ptStock inputStock">
                    <Col md={3} xl={3} sm={3}>nama bank</Col>
                    <Col md={6} xl={6} sm={6} className="inputStock">:<Input disabled className="ml-3" value="BANK MANDIRI - BINA CITRA BANDUNG" /></Col>
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
                            <th>DPP</th>
                            <th>PPN</th>
                            <th>PPh</th>
                            <th>Total Bayar</th>
                            <th>Keterangan</th>
                            <th>No PO</th>
                            <th>Area</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailOps.length !== 0 && detailOps.map(item => {
                            return (
                                <tr>
                                    <th scope="row">{detailOps.indexOf(item) + 1}</th>
                                    <th>{item.no_transaksi}</th>
                                    <th>{item.area}</th>
                                    <th>{item.cost_center}</th>
                                    <th>{item.bank_tujuan}</th>
                                    <th>{item.tujuan_tf === 'ID Pelanggan' ? item.id_pelanggan : item.norek_ajuan}</th>
                                    <th>{item.nama_tujuan}</th>
                                    <th>{item.dpp !== null && item.dpp !== 0 && item.dpp !== '0' && item.dpp !== '' ? item.dpp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                    <th>{item.ppn !== null && item.ppn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                    <th>(-) {item.nilai_utang !== null && item.nilai_utang.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                    <th>{item.nilai_bayar === null || item.nilai_bayar === undefined ? 0 : item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                    <th>{item.keterangan}</th>
                                    <th>-</th>
                                    <th>{item.depo.channel}</th>
                                </tr>
                            )
                        })}
                        {detailOps.length > 0 && (
                            <tr>
                                <th className='total' colSpan={10}>Total</th>
                                <th>
                                    {detailOps.reduce((accumulator, object) => {
                                        return accumulator + parseInt(object.nilai_bayar);
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
                                            {ttdOpsList.pembuat !== undefined && ttdOpsList.pembuat.map(item => {
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
                                        {ttdOpsList.pembuat !== undefined && ttdOpsList.pembuat.map(item => {
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
                                            {ttdOpsList.mengetahui !== undefined && ttdOpsList.mengetahui.map(item => {
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
                                            {ttdOpsList.mengetahui !== undefined && ttdOpsList.mengetahui.map(item => {
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
                                            {ttdOpsList.penyetuju !== undefined && ttdOpsList.penyetuju.map(item => {
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
                                            {ttdOpsList.penyetuju !== undefined && ttdOpsList.penyetuju.map(item => {
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
    ops: state.ops,
    menu: state.menu,
    reason: state.reason
})

const mapDispatchToProps = {
    getDetail: ops.getDetail,
    getApprovalList: ops.getApprovalList,
}

export default connect(mapStateToProps, mapDispatchToProps)(FormList)
