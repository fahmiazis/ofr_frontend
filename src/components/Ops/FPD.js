import React, { Component } from 'react'
import style from '../../assets/css/input.module.css'
import ops from '../../redux/actions/ops'
import {connect} from 'react-redux'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import moment from 'moment'
import ExcelJS from "exceljs";
import fs from "file-saver";

class FPD extends Component {

    state = {
        totalfpd: 0
    }

    async componentDidMount() {
        const dataCek = localStorage.getItem('printData')
        if (dataCek !== undefined && dataCek !== null) {
            const token = localStorage.getItem("token")
            const tempno = {
                no: dataCek
            }
            await this.props.getDetail(token, tempno)
            await this.props.getApproval(token, tempno)

            const {detailOps} = this.props.ops
            let total = 0
            for (let i = 0; i < detailOps.length; i++) {
                total += parseInt(detailOps[i].nilai_ajuan)
            }
            this.setState({totalfpd: total})
            localStorage.removeItem('printData')
        } else {
            const {detailOps} = this.props.ops
            let total = 0
            for (let i = 0; i < detailOps.length; i++) {
                total += parseInt(detailOps[i].nilai_ajuan)
            }
            this.setState({totalfpd: total})
        }
    }

    downloadForm = () => {
        const { detailOps, ttdOps } = this.props.ops
        
        const alpha = Array.from(Array(26)).map((e, i) => i + 65)
        const alphabet = alpha.map((x) => String.fromCharCode(x))
        const str = 'D'
        const str2 = 'H'
        const str3 = 'L'

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('form list ajuan bayar')
        const borderStyles = {
            top: {style:'thick'},
            left: {style:'thick'},
            bottom: {style:'thick'},
            right: {style:'thick'}
        }

        ws.addRow(['', 'FORM PERMINTAAN DANA'])
        ws.addRow(['', 'CABANG/DEPO :', `: ${detailOps.length > 0 ? detailOps[0].area : ''}`])
        ws.addRow(['', 'NO', `: ${detailOps.length > 0 ? detailOps[0].no_transaksi : ''}`])

        const dataRow = []

        detailOps.map((item, index) => { 
            return (
                dataRow.push([
                    index + 1, 
                    item.cost_center, 
                    item.no_coa, 
                    item.nama_coa, 
                    item.keterangan, 
                    `${moment(item.periode_awal).format('DD/MMMM/YYYY')} - ${moment(item.periode_akhir).format('DD/MMMM/YYYY')}`, 
                    item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 
                    item.bank_tujuan,
                    item.norek_ajuan,
                    item.nama_tujuan,
                    item.ppu,
                    item.pa,
                    item.nominal,
                    item.nilai_bayar,
                    moment(item.tanggal_transfer).format('DD/MMMM/YYYY')
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
                {name: 'COST CENTRE'},
                {name: 'NO COA'},
                {name: 'NAMA COA'},
                {name: 'KETERANGAN TAMBAHAN'},
                {name: 'PERIODE'},
                {name: 'NILAI YANG DIAJUKAN'},
                {name: 'BANK'},
                {name: 'NOMOR REKENING'},
                {name: 'ATAS NAMA'},
                {name: 'PPU'},
                {name: 'PA'},
                {name: 'NOMINAL VERIFIKASI'},
                {name: 'NILAI YANG DIBAYARKAN'},
                {name: 'TANGGAL TRANSFER'}
            ],
            rows: dataRow,
        })

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

        ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
                ws.getCell(`B${headRow}`).value = item.nama === null 
                ? `\n\n - \n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
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
        const cekRow11 = 'D'
        const cekRow12 = ttdOps.pemeriksa.length > 1 ? 'G' : 'E'
        ws.mergeCells(`${cekRow11}${sumRow}`, `${cekRow12}${sumRow}`)
        ws.getCell(`${cekRow11}${sumRow}`).value = 'Diperiksa oleh,'
        ws.getCell(`${cekRow11}${sumRow}`).alignment = { horizontal:'center'}

        ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map((item, index) => {
            if (ttdOps.pemeriksa.length > 1) {
                const startRow = alphabet[alphabet.indexOf(alphabet.find(item => item === str.toUpperCase())) + (2 * index)]
                const endRow = alphabet[alphabet.indexOf(alphabet.find(item => item === str.toUpperCase())) + ((2 * index) + 1)]
                
                // console.log(alphabet.indexOf(alphabet.find(item => item === str.toUpperCase())))
                // console.log(`${startRow}${headRow}`, `${endRow}${botRow} Quenn`)

                ws.mergeCells(`${startRow}${headRow}`, `${endRow}${botRow}`)
                ws.getCell(`${startRow}${headRow}`).value = item.nama === null 
                ? `\n\n - \n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
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
                ws.mergeCells(`D${headRow}`, `E${botRow}`)
                ws.getCell(`D${headRow}`).value = item.nama === null 
                ? `\n\n - \n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
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
        const cekRow21 = ttdOps.pemeriksa.length > 1 ? 'H' : 'F'
        const cekRow22 = ttdOps.pemeriksa.length > 1 ? 'K' : 'G'
        ws.mergeCells(`${cekRow21}${sumRow}`, `${cekRow22}${sumRow}`)
        ws.getCell(`${cekRow21}${sumRow}`).value = 'Disetujui oleh,'
        ws.getCell(`${cekRow21}${sumRow}`).alignment = { horizontal:'center'}

        ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map((item, index) => {
            if (ttdOps.penyetuju.length > 1) {
                const startRow = alphabet[alphabet.indexOf(alphabet.find(item => item === str2.toUpperCase())) + (2 * index)]
                const endRow = alphabet[alphabet.indexOf(alphabet.find(item => item === str2.toUpperCase())) + ((2 * index) + 1)]
                
                // console.log(alphabet.indexOf(alphabet.find(item => item === str2.toUpperCase())))
                // console.log(`${startRow}${headRow}`, `${endRow}${botRow} King`)

                ws.mergeCells(`${startRow}${headRow}`, `${endRow}${botRow}`)
                ws.getCell(`${startRow}${headRow}`).value = item.nama === null 
                ? `\n\n - \n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
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
                ws.mergeCells(`${cekRow21}${headRow}`, `${cekRow22}${botRow}`)
                ws.getCell(`${cekRow21}${headRow}`).value = item.nama === null 
                ? `\n\n - \n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === '0' 
                ? `\nReject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `\nApprove (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${item.nama} \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
                
                ws.getCell(`${cekRow21}${headRow}`).alignment = { 
                    horizontal:'center', 
                    wrapText: true, 
                    vertical: 'middle', 
                    ...borderStyles
                }
            }
        })

        // Approval Mengetahui
        const cekRow31 = ttdOps.penyetuju.length > 1 ? 'L' : 'H'
        const cekRow32 = ttdOps.penyetuju.length > 1 ? 'O' : 'I'
        ws.mergeCells(`${cekRow31}${sumRow}`, `${cekRow32}${sumRow}`)
        ws.getCell(`${cekRow31}${sumRow}`).value = 'Disetujui oleh,'
        ws.getCell(`${cekRow31}${sumRow}`).alignment = { horizontal:'center'}

        ttdOps.mengetahui !== undefined && ttdOps.mengetahui.map((item, index) => {
            if (ttdOps.mengetahui.length > 1) {
                const startRow = alphabet[alphabet.indexOf(alphabet.find(item => item === str3.toUpperCase())) + (2 * index)]
                const endRow = alphabet[alphabet.indexOf(alphabet.find(item => item === str3.toUpperCase())) + ((2 * index) + 1)]
                
                // console.log(alphabet.indexOf(alphabet.find(item => item === str3.toUpperCase())))
                // console.log(`${startRow}${headRow}`, `${endRow}${botRow} King`)

                ws.mergeCells(`${startRow}${headRow}`, `${endRow}${botRow}`)
                ws.getCell(`${startRow}${headRow}`).value = item.nama === null 
                ? `\n\n - \n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
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
                ws.mergeCells(`${cekRow31}${headRow}`, `${cekRow32}${botRow}`)
                ws.getCell(`${cekRow31}${headRow}`).value = item.nama === null 
                ? `\n\n - \n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === '0' 
                ? `\nReject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `\nApprove (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${item.nama} \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
                
                ws.getCell(`${cekRow31}${headRow}`).alignment = { 
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
              `Form Permintaan Dana Operasional  ${detailOps.length > 0 ? detailOps[0].no_transaksi : ''} ${moment().format('DD MMMM YYYY')}.xlsx`
            );
        });
        localStorage.removeItem('printData')
    }

  render() {
    const {detailOps, ttdOps} = this.props.ops
    const totalfpd = this.props.totalfpd || this.state.totalfpd
    return (
      <>
        <div className='tbRinci'>
            <div>
                <div className="fpdTit">FORM PERMINTAAN DANA</div>
                <div className='fpdTit'>cabang/depo : {detailOps.length > 0 ? detailOps[0].area : ''}</div>
                <div className='fpdTit'>no : {detailOps.length > 0 ? detailOps[0].no_transaksi : ''}</div>
            </div>
            <div className={style.tableDashboard}>
                <Row>
                    <Col md={2} className='upper'>
                        <div className='liner2'>no</div>
                    </Col>
                    <Col md={8} className='upper'>
                        <div className='line'>keperluan / <br />keterangan</div>
                    </Col>
                    <Col md={2} className='upper'>
                        <div className='liner'>rupiah</div>
                    </Col>
                </Row>
                {detailOps.length !== 0 && detailOps.map(item => {
                    return (
                        <Row className='mt-4'>
                            <Col md={2} className='upper'>
                                <div className='line'>{detailOps.indexOf(item) + 1}</div>
                            </Col>
                            <Col md={8} className='upper'>
                                <div className='line2'>{item.keterangan}</div>
                                <div className='line mt-1'>NO REK {item.bank_tujuan} {item.norek_ajuan}</div>
                            </Col>
                            <Col md={2} className='upper'>
                                <div className='line'>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                            </Col>
                        </Row>
                    )
                })}
                <Row className='mt-4'>
                    <Col md={2} className='upper'>
                    </Col>
                    <Col md={8} className='upper'>
                        <div className='line'>Total</div>
                    </Col>
                    <Col md={2} className='upper'>
                        <div className='line'>
                            {totalfpd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </div>
                    </Col>
                </Row>
            </div>
            <div className='bold'>{detailOps.length > 0 ? detailOps[0].area : ''}, {moment(detailOps.length > 0 ? moment(detailOps[0].updatedAt).format('DD MMMM YYYY') : '').format('DD MMMM YYYY')}</div>
            <Table borderless responsive className="tabPreview mt-4">
                <thead>
                    <tr>
                        {ttdOps.pembuat !== undefined && ttdOps.pembuat.length > 0 && (
                            <th className="buatPre">Dibuat oleh,</th>
                        )}
                        {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length > 0 && (
                            <th className="buatPre">Diperiksa oleh,</th>
                        )}
                        {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.length > 0 && (
                            <th className="buatPre">Disetujui oleh,</th>
                        )}
                    </tr>
                </thead>
                <tbody className="tbodyPre">
                    <tr>
                    {ttdOps.pembuat !== undefined && ttdOps.pembuat.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                <thead>
                                    <tr>
                                        {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
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
                                    {ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
                                        return (
                                            <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                        )
                                    })}
                                    </tr>
                                </tbody>
                            </Table>
                        </td>
                    )}
                    {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                <thead>
                                    <tr>
                                        {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                            <th className="headPre">
                                                <div className="mb-2">-</div>
                                                <div>-</div>
                                            </th>
                                        ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
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
                                        {ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.length === 0 ? (
                                            <td className="footPre">-</td>
                                        ) : ttdOps.pemeriksa !== undefined && ttdOps.pemeriksa.map(item => {
                                            return (
                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                            )
                                        })}
                                    </tr>
                                </tbody>
                            </Table>
                        </td>
                    )}
                    {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                <thead>
                                    <tr>
                                        {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
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
                                        {ttdOps.penyetuju !== undefined && ttdOps.penyetuju.map(item => {
                                            return (
                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                            )
                                        })}
                                    </tr>
                                </tbody>
                            </Table>
                        </td>
                    )}
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
    getApproval: ops.getApproval,
}

export default connect(mapStateToProps, mapDispatchToProps)(FPD)
