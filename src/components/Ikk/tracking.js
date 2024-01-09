import React, { Component } from 'react'
import { Container, Collapse, 
    Card, CardBody, Table, Button, Col, Row, Modal, ModalBody} from 'reactstrap'
import ikk from '../../redux/actions/ikk'
import menu from '../../redux/actions/menu'
import reason from '../../redux/actions/reason'
import user from '../../redux/actions/user'
import approve from '../../redux/actions/approve'
import depo from '../../redux/actions/depo'
import auth from '../../redux/actions/auth'
import {connect} from 'react-redux'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineUpload} from 'react-icons/ai'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList, FaFileSignature} from 'react-icons/fa'
import {RiDraftFill} from 'react-icons/ri'
import {MdAssignment, MdPayments} from 'react-icons/md'
import moment from 'moment'

class Tracking extends Component {

    state = {
        collap: false,
        tipeCol: '',
        formDis: false,
        history: false,
        upload: false
    }

    openHistory = () => {
        this.setState({history: !this.state.history})
    }

    showCollap = (val) => {
        if (val === 'close') {
            this.setState({collap: false})
        } else {
            this.setState({collap: false})
            setTimeout(() => {
                this.setState({collap: true, tipeCol: val})
             }, 500)
        }
    }

  render() {
    const {detailIkk} = this.props.ikk
    return (
        <>
        <div>
            <Row className='trackTitle ml-4'>
                <Col>
                    Tracking Pengajuan Ikk
                </Col>
            </Row>
            <Row className='ml-4 trackSub'>
                <Col md={3}>
                    Area
                </Col>
                <Col md={9}>
                : {detailIkk[0] === undefined ? '' : detailIkk[0].area}
                </Col>
            </Row>
            <Row className='ml-4 trackSub'>
                <Col md={3}>
                No Ajuan
                </Col>
                <Col md={9}>
                : {detailIkk[0] === undefined ? '' : detailIkk[0].no_transaksi}
                </Col>
            </Row>
            <Row className='ml-4 trackSub1'>
                <Col md={3}>
                Tanggal Ajuan
                </Col>
                <Col md={9}>
                : {detailIkk[0] === undefined ? '' : moment(detailIkk[0].start_ikk === null ? detailIkk[0].createdAt : detailIkk[0].start_ikk).locale('idn').format('DD MMMM YYYY ')}
                </Col>
            </Row>
            <Row className='mt-2 ml-4 m40'>
                <Col md={12}>
                    <Button onClick={this.openHistory} size='sm' color='success'>History lengkap</Button>
                </Col>
            </Row>
            <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                <div class="step completed">
                    <div class="step-icon-wrap">
                    <button class="step-icon" onClick={() => this.showCollap('Submit')} ><FiSend size={40} className="center1" /></button>
                    </div>
                    <h4 class="step-title">Submit Ikk</h4>
                </div>
                <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 2 ? "step completed" : 'step'} >
                    <div class="step-icon-wrap">
                        <button class="step-icon" onClick={() => this.showCollap('Proses Approval')}><MdAssignment size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Proses Approval</h4>
                </div>
                <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 3 ? "step completed" : 'step'}>
                    <div class="step-icon-wrap">
                        <button class="step-icon" onClick={() => this.showCollap('Verifikasi Finance')}><FiSettings size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Verifikasi Finance</h4>
                </div>
                {/* <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 4 ? "step completed" : 'step'}>
                    <div class="step-icon-wrap">
                        <button class="step-icon" onClick={() => this.showCollap('Verifikasi Tax')}><FiSettings size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Verifikasi Tax</h4>
                </div> */}
                <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 5 ? "step completed" : 'step'}>
                    <div class="step-icon-wrap">
                        <button class="step-icon" onClick={() => this.showCollap('Draft List Ajuan Bayar')}><RiDraftFill size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Draft List Ajuan Bayar</h4>
                </div>
                <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 6 ? "step completed" : 'step'}>
                    <div class="step-icon-wrap">
                        <button class="step-icon" onClick={() => this.showCollap('Approval List Ajuan Bayar')}><MdAssignment size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Approval List Ajuan Bayar</h4>
                </div>
                <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 7 ? "step completed" : 'step'}>
                    <div class="step-icon-wrap">
                        <button class="step-icon" onClick={() => this.showCollap('Pembayaran Ajuan')}><MdPayments size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Pembayaran Ajuan</h4>
                </div>
                <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi === 8 ? "step completed" : 'step'}>
                    <div class="step-icon-wrap">
                        <button class="step-icon"><AiOutlineCheck size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Selesai</h4>
                </div>
            </div>
            <Collapse isOpen={this.state.collap} className="collapBody">
                <Card className="cardCollap">
                    <CardBody>
                        <div className='textCard1'>{this.state.tipeCol}</div>
                        {this.state.tipeCol === 'submit' ? (
                            <div>Tanggal submit : {detailIkk[0] === undefined ? '' : moment(detailIkk[0].start_ikk === null ? detailIkk[0].createdAt : detailIkk[0].start_ikk).locale('idn').format('DD MMMM YYYY ')}</div>
                        ) : (
                            <div></div>
                        )}
                        <div>Rincian Data:</div>
                        <Table striped bordered responsive hover className="tableDis mb-3">
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>COST CENTRE</th>
                                    <th>NO COA</th>
                                    <th>NAMA COA</th>
                                    <th>KETERANGAN TAMBAHAN</th>
                                    <th>PERIODE</th>
                                    <th>NILAI YANG DIAJUKAN</th>
                                    <th>BANK</th>
                                    <th>NOMOR REKENING</th>
                                    <th>ATAS NAMA</th>
                                    <th>MEMILIKI NPWP</th>
                                    <th>NAMA SESUAI NPWP</th>
                                    <th>NOMOR NPWP</th>
                                    <th>PPU</th>
                                    <th>PA</th>
                                    <th>NOMINAL</th>
                                    <th>NILAI YANG DIBAYARKAN</th>
                                    <th>TANGGAL TRANSFER</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailIkk.length !== 0 && detailIkk.map(item => {
                                    return (
                                        <tr>
                                            <th scope="row">{detailIkk.indexOf(item) + 1}</th>
                                            <th>{item.cost_center}</th>
                                            <th>{item.no_coa}</th>
                                            <th>{item.nama_coa}</th>
                                            <th>{item.keterangan}</th>
                                            <th>{moment(item.periode_awal).format('DD/MMMM/YYYY')} - {moment(item.periode_akhir).format('DD/MMMM/YYYY')}</th>
                                            <th>{item.nilai_ajuan === null || item.nilai_ajuan === undefined ? 0 : item.nilai_ajuan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</th>
                                            <th>{item.bank_tujuan}</th>
                                            <th>{item.norek_ajuan}</th>
                                            <th>{item.nama_tujuan}</th>
                                            <th>{item.status_npwp === 0 ? '' : 'Ya'}</th>
                                            <th>{item.status_npwp === 0 ? '' : item.nama_npwp}</th>
                                            <th>{item.status_npwp === 0 ? '' : item.no_npwp}</th>
                                            <th>{item.ppu}</th>
                                            <th>{item.pa}</th>
                                            <th>{item.nominal}</th>
                                            <th>{item.nilai_bayar}</th>
                                            <th>{item.tanggal_transfer}</th>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        {detailIkk[0] === undefined || this.state.tipeCol === 'Submit' ? (
                            <div></div>
                        ) : (
                            <div>
                                <div className="mb-4 mt-2">Tracking {this.state.tipeCol} :</div>
                                {this.state.tipeCol === 'Proses Approval' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        {detailIkk[0] !== undefined && detailIkk[0].appForm.length && detailIkk[0].appForm.slice(0).reverse().map(item => {
                                            return (
                                                <div class={item.status === '1' ? 'step completed' : item.status === '0' ? 'step reject' : 'step'}>
                                                    <div class="step-icon-wrap">
                                                    <button class="step-icon"><FaFileSignature size={30} className="center2" /></button>
                                                    </div>
                                                    <h4 class="step-title">{item.jabatan}</h4>
                                                    <h4 class="step-title">{item.nama}</h4>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : this.state.tipeCol === 'Verifikasi Finance' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 3 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Check Data Ajuan</h4>
                                        </div>
                                        <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 3 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Selesai</h4>
                                        </div>
                                    </div>
                                ) : this.state.tipeCol === 'Verifikasi Tax' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 4 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Check Data Ajuan</h4>
                                        </div>
                                        <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 4 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Selesai</h4>
                                        </div>
                                    </div>
                                ) : this.state.tipeCol === 'Draft List Ajuan Bayar' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 5 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Seleksi Data Ajuan</h4>
                                        </div>
                                        <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 5 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Selesai</h4>
                                        </div>
                                    </div>
                                ) : this.state.tipeCol === 'Pembayaran Ajuan' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 7 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><AiOutlineUpload size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Upload Bukti Bayar</h4>
                                        </div>
                                        <div class={detailIkk[0] === undefined ? 'step' : detailIkk[0].status_transaksi > 7 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Selesai</h4>
                                        </div>
                                    </div>
                                ) : this.state.tipeCol === 'Approval List Ajuan Bayar' && (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        {detailIkk[0] !== undefined && detailIkk[0].appList.length && detailIkk[0].appList.slice(0).reverse().map(item => {
                                            return (
                                                <div class={item.status === '1' ? 'step completed' : item.status === '0' ? 'step reject' : 'step'}>
                                                    <div class="step-icon-wrap">
                                                    <button class="step-icon"><FaFileSignature size={30} className="center2" /></button>
                                                    </div>
                                                    <h4 class="step-title">{item.jabatan}</h4>
                                                    <h4 class="step-title">{item.nama}</h4>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </Collapse>
        </div>
        <Modal isOpen={this.state.history} toggle={this.openHistory}>
            <ModalBody>
                <div className='mb-4'>History Transaksi</div>
                <div className='history'>
                    {detailIkk.length > 0 && detailIkk[0].history.split(',').map(item => {
                        return (
                            item !== null && item !== 'null' && 
                            <Button className='mb-2' color='info'>{item}</Button>
                        )
                    })}
                </div>
            </ModalBody>
        </Modal>
        </>
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

const mapDispatchToProps = {
    logout: auth.logout,
    getNameApprove: approve.getNameApprove,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    getRole: user.getRole,
    getIkk: ikk.getIkk,
    getDetail: ikk.getDetail,
    getApproval: ikk.getApproval,
    getDocIkk: ikk.getDocCart,
    approveIkk: ikk.approveIkk,
    getAllMenu: menu.getAllMenu,
    getReason: reason.getReason,
    rejectIkk: ikk.rejectIkk,
    resetIkk: ikk.resetIkk,
    submitVerif: ikk.submitVerif,
    editVerif: ikk.editVerif
    // notifStock: notif.notifStock
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracking)