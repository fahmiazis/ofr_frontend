import React, { Component } from 'react'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import TableRincian from './tableRincian'
import klaim from '../../redux/actions/klaim'
import moment from 'moment'
import {connect} from 'react-redux'
import ExcelJS from "exceljs";
import fs from "file-saver";

class FAA extends Component {

    async componentDidMount() {
        const dataCek = localStorage.getItem('printData')
        if (dataCek !== undefined && dataCek !== null) {
            const token = localStorage.getItem("token")
            const tempno = {
                no: dataCek
            }
            await this.props.getDetail(token, tempno)
            await this.props.getApproval(token, tempno)

            const {detailKlaim} = this.props.klaim
            let total = 0
            for (let i = 0; i < detailKlaim.length; i++) {
                total += parseInt(detailKlaim[i].nilai_ajuan)
            }
            this.setState({totalfpd: total})
            this.downloadForm()
        } else {
            const {detailKlaim} = this.props.klaim
            let total = 0
            for (let i = 0; i < detailKlaim.length; i++) {
                total += parseInt(detailKlaim[i].nilai_ajuan)
            }
            this.setState({totalfpd: total})
        }
    }

    downloadForm = () => {
        const { detailKlaim, ttdKlaim } = this.props.klaim
        
        const alpha = Array.from(Array(26)).map((e, i) => i + 65)
        const alphabet = alpha.map((x) => String.fromCharCode(x))
        const str = 'D'
        const str2 = 'H'
        const str3 = 'L'

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('form ajuan bayar')
        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        ws.addRow(['', 'FORM AJUAN AREA'])
        ws.addRow()
        ws.addRow(['', 'CABANG / AREA / DEPO', `: ${detailKlaim.length > 0 ? detailKlaim[0].area : ''}`])
        ws.addRow(['', 'NO AJUAN', `: ${detailKlaim.length > 0 ? detailKlaim[0].no_transaksi : ''}`])
        ws.addRow(['', 'TANGGAL AJUAN', `: ${detailKlaim.length > 0 ? moment(detailKlaim[0].start_klaim).format('DD MMMM YYYY') : ''}`])

        const dataRow = []

        detailKlaim.map((item, index) => { 
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

        ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.map(item => {
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
        const cekRow12 = ttdKlaim.pemeriksa.length > 1 ? 'G' : 'E'
        ws.mergeCells(`${cekRow11}${sumRow}`, `${cekRow12}${sumRow}`)
        ws.getCell(`${cekRow11}${sumRow}`).value = 'Diperiksa oleh,'
        ws.getCell(`${cekRow11}${sumRow}`).alignment = { horizontal:'center'}

        ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.map((item, index) => {
            if (ttdKlaim.pemeriksa.length > 1) {
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
        const cekRow21 = ttdKlaim.pemeriksa.length > 1 ? 'H' : 'F'
        const cekRow22 = ttdKlaim.pemeriksa.length > 1 ? 'K' : 'G'
        ws.mergeCells(`${cekRow21}${sumRow}`, `${cekRow22}${sumRow}`)
        ws.getCell(`${cekRow21}${sumRow}`).value = 'Disetujui oleh,'
        ws.getCell(`${cekRow21}${sumRow}`).alignment = { horizontal:'center'}

        ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.map((item, index) => {
            if (ttdKlaim.penyetuju.length > 1) {
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
        const cekRow31 = ttdKlaim.penyetuju.length > 1 ? 'L' : 'H'
        const cekRow32 = ttdKlaim.penyetuju.length > 1 ? 'O' : 'I'
        ws.mergeCells(`${cekRow31}${sumRow}`, `${cekRow32}${sumRow}`)
        ws.getCell(`${cekRow31}${sumRow}`).value = 'Disetujui oleh,'
        ws.getCell(`${cekRow31}${sumRow}`).alignment = { horizontal:'center'}

        ttdKlaim.mengetahui !== undefined && ttdKlaim.mengetahui.map((item, index) => {
            if (ttdKlaim.mengetahui.length > 1) {
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
              `Form Ajuan Area Klaim  ${detailKlaim.length > 0 ? detailKlaim[0].no_transaksi : ''} ${moment().format('DD MMMM YYYY')}.xlsx`
            );
        });
        localStorage.removeItem('printData')
    }
    
  render() {
    const {detailKlaim, ttdKlaim} = this.props.klaim
    return (
        <>
            <div className='tbRinci'>
                <div>
                    {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                    {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailKlaim.length > 0 ? detailKlaim[0].area : ''} className="ml-3"  /></Col>
                    </Row>
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>no ajuan</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailKlaim.length > 0 ? detailKlaim[0].no_transaksi : ''} className="ml-3" /></Col>
                    </Row>
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailKlaim.length > 0 ? moment(detailKlaim[0].start_klaim).format('DD MMMM YYYY') : ''} /></Col>
                    </Row>
                </div>
                <TableRincian />
                <Table borderless responsive className="tabPreview mt-4">
                <thead>
                    <tr>
                        {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.length > 0 && (
                            <th className="buatPre">Dibuat oleh,</th>
                        )}
                        {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length > 0 && (
                            <th className="buatPre">Diperiksa oleh,</th>
                        )}
                        {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.length > 0 && (
                            <th className="buatPre">Disetujui oleh,</th>
                        )}
                        {ttdKlaim.mengetahui !== undefined && ttdKlaim.mengetahui.length > 0 && (
                            <th className="buatPre">Diketahui oleh,</th>
                        )}
                    </tr>
                </thead>
                <tbody className="tbodyPre">
                    <tr>
                        {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.map(item => {
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
                                        {ttdKlaim.pembuat !== undefined && ttdKlaim.pembuat.map(item => {
                                            return (
                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                            )
                                        })}
                                        </tr>
                                    </tbody>
                            </Table>
                        </td>
                        )}
                        {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length === 0 ? (
                                                <th className="headPre">
                                                    <div className="mb-2">-</div>
                                                    <div>-</div>
                                                </th>
                                            ) : ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.map(item => {
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
                                            {ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.length === 0 ? (
                                                <td className="footPre">-</td>
                                            ) : ttdKlaim.pemeriksa !== undefined && ttdKlaim.pemeriksa.map(item => {
                                                return (
                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                )
                                            })}
                                        </tr>
                                    </tbody>
                            </Table>
                        </td>
                        )}
                        {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.map(item => {
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
                                            {ttdKlaim.penyetuju !== undefined && ttdKlaim.penyetuju.map(item => {
                                                return (
                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                )
                                            })}
                                        </tr>
                                    </tbody>
                            </Table>
                        </td>
                        )}
                        {ttdKlaim.mengetahui !== undefined && ttdKlaim.mengetahui.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {ttdKlaim.mengetahui !== undefined && ttdKlaim.mengetahui.map(item => {
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
                                            {ttdKlaim.mengetahui !== undefined && ttdKlaim.mengetahui.map(item => {
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
    klaim: state.klaim,
    menu: state.menu,
    reason: state.reason
})

const mapDispatchToProps = {
    getDetail: klaim.getDetail,
    getApproval: klaim.getApproval,
}


export default connect(mapStateToProps, mapDispatchToProps)(FAA)
