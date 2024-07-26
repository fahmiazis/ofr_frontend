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
        totalfpd: 0,
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
            for (let i = 0; i < detailOps.length; i++) {
                total += parseInt(detailOps[i].nilai_ajuan)
            }
            this.setState({totalfpd: total})
            // localStorage.removeItem('printData')
            this.downloadForm()
        } else {
            const {detailOps} = this.props.ops
            let total = 0
            for (let i = 0; i < detailOps.length; i++) {
                total += parseInt(detailOps[i].nilai_ajuan)
            }
            this.setState({totalfpd: total})
        }
    }

    downloadForm1 = () => {
        window.print()
        localStorage.removeItem('printData')
    }

    downloadForm = () => {
        const { detailOps, ttdOps } = this.props.ops
        const totalfpd = this.props.totalfpd || this.state.totalfpd
        
        const alpha = Array.from(Array(26)).map((e, i) => i + 65)
        const alphabet = alpha.map((x) => String.fromCharCode(x))
        const str = 'F'
        const str2 = 'J'
        const str3 = 'L'

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('fpd')
        const borderStyles = {
            top: {style: 'medium'},
            left: {style: 'medium'},
            bottom: {style: 'medium'},
            right: {style: 'medium'}
        }

        const alignStyle = {
            horizontal:'center',
            wrapText: true,
            vertical: 'middle'
        }

        ws.mergeCells(`B1`, `M3`)
        ws.getCell(`B1`).value = `FORM PERMINTAAN DANA \n CABANG/DEPO : ${detailOps.length > 0 ? detailOps[0].area : ''} \n NO : ${detailOps.length > 0 ? detailOps[0].no_transaksi : ''}`
        ws.getCell(`B1`).alignment = { 
            ...alignStyle
        }

        ws.mergeCells(`B5`, `C6`)
        ws.getCell(`B5`).value = 'NO'

        ws.mergeCells(`E5`, `J6`)
        ws.getCell(`E5`).value = 'KEPERLUAN / \n KETERANGAN'

        ws.mergeCells(`L5`, `M6`)
        ws.getCell(`L5`).value = 'RUPIAH'

        ws.getCell(`B5`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`B5`).border = { 
            ...borderStyles
        }

        ws.getCell(`E5`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`E5`).border = {
            ...borderStyles
        }

        ws.getCell(`L5`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`L5`).border = {
            ...borderStyles
        }

        const startRow = 9

        detailOps.map((item, index) => { 
            const gapRow = startRow + (index * 5)
            
            ws.mergeCells(`B${gapRow}`, `C${gapRow + 1}`)
            ws.getCell(`B${gapRow}`).value = `${index + 1}`

            ws.mergeCells(`E${gapRow}`, `J${gapRow + 1}`)
            ws.getCell(`E${gapRow}`).value = `${item.keterangan}`

            ws.mergeCells(`E${gapRow + 3}`, `J${gapRow + 3}`)
            ws.getCell(`E${gapRow + 3}`).value = `NO REK ${item.bank_tujuan} ${item.tujuan_tf === 'ID Pelanggan' ? item.id_pelanggan : item.norek_ajuan}`

            ws.mergeCells(`L${gapRow}`, `M${gapRow + 1}`)
            ws.getCell(`L${gapRow}`).value = `${item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`

            ws.getCell(`B${gapRow}`).alignment = { 
                ...alignStyle
            }
            ws.getCell(`B${gapRow}`).border = {
                ...borderStyles
            }

            ws.getCell(`E${gapRow}`).alignment = { 
                ...alignStyle
            }
            ws.getCell(`E${gapRow}`).border = {
                ...borderStyles
            }

            ws.getCell(`E${gapRow + 3}`).alignment = { 
                ...alignStyle
            }
            ws.getCell(`E${gapRow + 3}`).border = {
                ...borderStyles
            }

            ws.getCell(`L${gapRow}`).alignment = { 
                ...alignStyle
            }
            ws.getCell(`L${gapRow}`).border = {
                ...borderStyles
            }
        })
        
        const totRow = startRow + (detailOps.length * 5) + 1

        ws.mergeCells(`E${totRow}`, `J${totRow}`)
        ws.getCell(`E${totRow}`).value = 'TOTAL'
        ws.getCell(`E${totRow}`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`E${totRow}`).border = {
            ...borderStyles
        }

        ws.mergeCells(`L${totRow}`, `M${totRow}`)
        ws.getCell(`L${totRow}`).value = `${totalfpd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
        ws.getCell(`L${totRow}`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`L${totRow}`).border = { 
            ...borderStyles
        }

        const dateRow = totRow + 3
        ws.mergeCells(`B${dateRow}`, `E${dateRow}`)
        ws.getCell(`B${dateRow}`).value = `${detailOps.length > 0 ? detailOps[0].area : ''}, ${moment(detailOps.length > 0 ? moment(detailOps[0].updatedAt).format('DD MMMM YYYY') : '').format('DD MMMM YYYY')}`
        ws.getCell(`B${dateRow}`).alignment = { 
            ...alignStyle
        }

        ws.addRow()
        const sumRow = dateRow + 2
        const headRow = 1 + sumRow
        const mainRow = 3 + sumRow
        const footRow = 5 + sumRow
        const botRow = 7 + sumRow
        console.log(sumRow)

        // Approval Dibuat
        ws.mergeCells(`B${sumRow}`, `E${sumRow}`)
        ws.getCell(`B${sumRow}`).value = 'Dibuat oleh,'
        ws.getCell(`B${sumRow}`).alignment = { horizontal:'center'}

        ws.mergeCells(`B${headRow}`, `E${botRow}`)

        ttdOps.pembuat !== undefined && ttdOps.pembuat.map(item => {
                ws.getCell(`B${headRow}`).value = item.nama === null 
                ? `\n\n - \n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === '0' 
                ? `\nReject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `\nApprove (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${item.nama} \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
        })

        ws.getCell(`B${headRow}`).alignment = { 
            ...alignStyle,
            ...borderStyles
        }

        // Approval Diketahui
        const cekRow11 = 'F'
        const cekRow12 = ttdOps.pemeriksa.length > 1 ? 'I' : 'I'
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
                    ...alignStyle,
                    ...borderStyles
                }
            } else {
                ws.mergeCells(`F${headRow}`, `I${botRow}`)
                ws.getCell(`F${headRow}`).value = item.nama === null 
                ? `\n\n - \n\n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === '0' 
                ? `\nReject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `\nApprove (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${item.nama} \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
                
                ws.getCell(`F${headRow}`).alignment = { 
                    ...alignStyle,
                    ...borderStyles
                }
            }
        })


        // Approval Disetujui
        const cekRow21 = ttdOps.pemeriksa.length > 1 ? 'J' : 'J'
        const cekRow22 = ttdOps.pemeriksa.length > 1 ? 'M' : 'M'
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
                    ...alignStyle,
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
                    ...alignStyle,
                    ...borderStyles
                }
            }
        })

        // const borderStyle = {
        //     style: 'medium'
        // }

        // for (let i = 1; i <= botRow + 1; i++) {
        //     const leftBorderCell = ws.getCell(i, 1);
        //     const rightBorderCell = ws.getCell(i, 14);
        //     leftBorderCell.border = {
        //         ...leftBorderCell.border,
        //         left: borderStyle
        //     };
        //     rightBorderCell.border = {
        //         ...rightBorderCell.border,
        //         right: borderStyle
        //     };
        // }
    
        // for (let i = 1; i <= 14; i++) {
        //     const topBorderCell = ws.getCell(1, i);
        //     const bottomBorderCell = ws.getCell(botRow + 1, i);
        //     topBorderCell.border = {
        //         ...topBorderCell.border,
        //         top: borderStyle
        //     };
        //     bottomBorderCell.border = {
        //         ...bottomBorderCell.border,
        //         bottom: borderStyle
        //     };
        // }

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Form Permintaan Dana Operasional ${detailOps.length > 0 ? detailOps[0].no_transaksi : ''} ${moment().format('DD MMMM YYYY')}.xlsx`
            );
        });
        localStorage.removeItem('printData')
    }

    createOuterBorder = (worksheet, start = {row: 1, col: 1}, end = {row: 1, col: 1}, borderWidth = 'medium') => {

        const borderStyles = {
            style: 'medium'
        };
        for (let i = start.row; i <= end.row; i++) {
            const leftBorderCell = worksheet.getCell(i, start.col);
            const rightBorderCell = worksheet.getCell(i, end.col);
            leftBorderCell.border = {
                ...leftBorderCell.border,
                left: borderStyles
            };
            rightBorderCell.border = {
                ...rightBorderCell.border,
                right: borderStyles
            };
        }
    
        for (let i = start.col; i <= end.col; i++) {
            const topBorderCell = worksheet.getCell(start.row, i);
            const bottomBorderCell = worksheet.getCell(end.row, i);
            topBorderCell.border = {
                ...topBorderCell.border,
                top: borderStyles
            };
            bottomBorderCell.border = {
                ...bottomBorderCell.border,
                bottom: borderStyles
            };
        }
    };

  render() {
    const {arrTes} = this.state
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
                {detailOps.length !== 0 && detailOps.map((item, index) => {
                    return (
                        <Row className='mt-4'>
                            <Col md={2} className='upper'>
                                <div className='line'>{index + 1}</div>
                            </Col>
                            <Col md={8} className='upper'>
                                <div className='line2'>{item.keterangan}</div>
                                <div className='line mt-1'>NO REK {item.bank_tujuan} {item.tujuan_tf === 'ID Pelanggan' ? item.id_pelanggan : item.norek_ajuan}</div>
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
