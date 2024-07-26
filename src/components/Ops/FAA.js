import React, { Component } from 'react'
import {  Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import TableRincian from './tableRincian'
import ops from '../../redux/actions/ops'
import moment from 'moment'
import {connect} from 'react-redux'
import ExcelJS from "exceljs";
import fs from "file-saver";

class FAA extends Component {

    state = {
        totalfpd: 0,
        totDpp: 0,
        totPpn: 0,
        totPph: 0,
        totPay: 0,
        arrTes: "e printing on mobile browsers should work, printing within a WebView",
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
            let totDpp = 0
            let totPpn = 0
            let totPph = 0
            let totPay = 0
            for (let i = 0; i < detailOps.length; i++) {
                total += parseInt(detailOps[i].nilai_ajuan)
                totDpp += parseInt(detailOps[i].dpp)
                totPpn += parseInt(detailOps[i].ppn)
                totPph += parseInt(detailOps[i].nilai_utang)
                totPay += parseInt(detailOps[i].nilai_bayar)
            }
            this.setState({
                totalfpd: total,
                totDpp: totDpp,
                totPpn: totPpn,
                totPph: totPph,
                totPay: totPay
            })
            this.downloadForm()
        } else {
            const {detailOps} = this.props.ops
            let total = 0
            let totDpp = 0
            let totPpn = 0
            let totPph = 0
            let totPay = 0
            for (let i = 0; i < detailOps.length; i++) {
                total += parseInt(detailOps[i].nilai_ajuan)
                totDpp += detailOps[i].dpp === null || detailOps[i].dpp === undefined ? 0 : parseInt(detailOps[i].dpp)
                totPpn += detailOps[i].ppn === null || detailOps[i].ppn === undefined ? 0 : parseInt(detailOps[i].ppn)
                totPph += detailOps[i].nilai_utang === null || detailOps[i].nilai_utang === undefined ? 0 : parseInt(detailOps[i].nilai_utang)
                totPay += detailOps[i].nilai_bayar === null || detailOps[i].nilai_bayar === undefined ? 0 : parseInt(detailOps[i].nilai_bayar)
            }
            this.setState({
                totalfpd: total,
                totDpp: totDpp,
                totPpn: totPpn,
                totPph: totPph,
                totPay: totPay
            })
        }
    }

    downloadForm = () => {
        const { detailOps, ttdOps } = this.props.ops
        const { totalfpd, totDpp, totPpn, totPph, totPay } = this.state
        
        const alpha = Array.from(Array(26)).map((e, i) => i + 65)
        const alphabet = alpha.map((x) => String.fromCharCode(x))
        const str = 'D'
        const str2 = 'H'
        const str3 = 'L'

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('form ajuan area', {
            pageSetup: { orientation:'landscape', paperSize: 8 }
        })
        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        const fontStyle = {
            size: 16
        }

        ws.addRow(['', 'FORM AJUAN AREA'])
        ws.addRow()
        ws.addRow(['', 'CABANG / AREA / DEPO', `: ${detailOps.length > 0 ? detailOps[0].area : ''}`])
        ws.addRow(['', 'NO AJUAN', `: ${detailOps.length > 0 ? detailOps[0].no_transaksi : ''}`])
        ws.addRow(['', 'TANGGAL AJUAN', `: ${detailOps.length > 0 ? moment(detailOps[0].start_ops).format('DD MMMM YYYY') : ''}`])

        const dataRow = []

        detailOps.map((item, index) => { 
            return (
                dataRow.push([
                    index + 1,
                    item.cost_center,
                    item.no_coa,
                    item.nama_coa,
                    item.sub_coa,
                    item.keterangan,
                    item.periode_awal === null ? '' : `${moment(item.periode_awal).format('DD MMMM YYYY')} - ${moment(item.periode_akhir).format('DD MMMM YYYY')}`,
                    item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    item.bank_tujuan,
                    item.tujuan_tf === 'ID Pelanggan' ? item.id_pelanggan : item.norek_ajuan,
                    item.nama_tujuan,
                    item.status_npwp === 1 ? 'Ya' : "Tidak",
                    item.status_npwp === 1 ? item.nama_npwp : '',
                    item.status_npwp === 1 ? item.no_npwp : '',
                    item.status_npwp === 0 ? item.nama_ktp : '',
                    item.status_npwp === 0 ? item.no_ktp : '',
                    item.dpp !== null && item.dpp !== 0 && item.dpp !== '0' && item.dpp !== '' ? item.dpp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    item.ppn === null || item.ppn === undefined ? 0 : item.ppn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    item.nilai_utang === null || item.nilai_utang === undefined ? 0 : item.nilai_utang.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    item.jenis_pph,
                    item.nilai_bayar  === null || item.nilai_bayar === undefined ? 0 : item.nilai_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    item.tanggal_transfer === null ? '-' : moment(item.tanggal_transfer).format('DD MMMM YYYY')
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
                {name: 'SUB COA'},
                {name: 'KETERANGAN TAMBAHAN'},
                {name: 'PERIODE'},
                {name: 'NILAI YANG DIAJUKAN'},
                {name: 'BANK'},
                {name: 'NOMOR REKENING'},
                {name: 'ATAS NAMA'},
                {name: 'MEMILIKI NPWP'},
                {name: 'NAMA NPWP'},
                {name: 'NOMOR NPWP'},
                {name: 'NAMA KTP'},
                {name: 'NOMOR KTP'},
                {name: 'DPP'},
                {name: 'PPN'},
                {name: 'PPh'},
                {name: 'JENIS PPh'},
                {name: 'NILAI YANG DIBAYARKAN'},
                {name: 'TANGGAL TRANSFER'}
            ],
            rows: dataRow,
          });

        ws.columns.forEach((column, index) => {
            const lengths = column.values.map(v => v.toString().length)
            const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
            if (index === 0) {    
                column.width = maxLength + (maxLength * 0.5) + 2
            } else if (ws.columns.length - 1 === index || ws.columns.length - 2 === index) {
                column.width = maxLength + (maxLength * 0.5) + 15
            } else {
                column.width = maxLength + (maxLength * 0.5) + 5
            }
            // column.width = maxLength + 5
        })

        const totRow = 9 + dataRow.length
        
        ws.mergeCells(`A${totRow}`, `G${totRow}`)
        ws.getCell(`A${totRow}`).value = 'Total'

        ws.getCell(`A${totRow}`).alignment = { 
            horizontal:'center', 
            wrapText: true, 
            vertical: 'middle'
        }

        ws.getCell(`A${totRow}`).border = { 
            ...borderStyles
        }

        ws.getCell(`H${totRow}`).value = totalfpd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        ws.getCell(`Q${totRow}`).value = totDpp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        ws.getCell(`R${totRow}`).value = totPpn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        ws.getCell(`S${totRow}`).value = totPph.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        ws.getCell(`U${totRow}`).value = totPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")


        ws.getCell(`H${totRow}`).border = { 
            ...borderStyles
        }
        ws.getCell(`Q${totRow}`).border = { 
            ...borderStyles
        }
        ws.getCell(`R${totRow}`).border = { 
            ...borderStyles
        }
        ws.getCell(`S${totRow}`).border = { 
            ...borderStyles
        }
        ws.getCell(`U${totRow}`).border = { 
            ...borderStyles
        }

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
        ws.getCell(`${cekRow31}${sumRow}`).value = 'Diketahui oleh,'
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

        ws.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                cell.font = fontStyle
            })
        })

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Form Ajuan Area Operasional  ${detailOps.length > 0 ? detailOps[0].no_transaksi : ''} ${moment().format('DD MMMM YYYY')}.xlsx`
            );
        });
        localStorage.removeItem('printData')
    }

  render() {
    const {detailOps, ttdOps} = this.props.ops
    return (
        <>
            <div className='tbRinci'>
                <div>
                    {/* <div className="stockTitle">form ajuan area (claim)</div> */}
                    {/* <div className="ptStock">pt. pinus merah abadi</div> */}
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>cabang / area / depo</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].area : ''} className="ml-3"  /></Col>
                    </Row>
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>no ajuan</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailOps.length > 0 ? detailOps[0].no_transaksi : ''} className="ml-3" /></Col>
                    </Row>
                    <Row className="ptStock inputStock">
                        <Col md={3} xl={3} sm={3}>tanggal ajuan</Col>
                        <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailOps.length > 0 ? moment(detailOps[0].start_ops).format('DD MMMM YYYY') : ''} /></Col>
                    </Row>
                </div>
                <TableRincian />
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
                        {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.length > 0 && (
                            <th className="buatPre">Diketahui oleh,</th>
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
                    {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.length > 0 && (
                        <td className="restTable">
                            <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.map(item => {
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
                                            {ttdOps.mengetahui !== undefined && ttdOps.mengetahui.map(item => {
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

export default connect(mapStateToProps, mapDispatchToProps)(FAA)
