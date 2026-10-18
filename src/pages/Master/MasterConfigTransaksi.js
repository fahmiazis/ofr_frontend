import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Badge } from 'reactstrap'
import Select from 'react-select'
import AppLayout from '../../components/AppLayout'
import { PageCard, Toolbar, ToolbarSpacer, FilterField, SearchBox, Pager } from '../../components/ui/Page'
import style from '../../assets/css/input.module.css'
import configAct from '../../redux/actions/configTransaksi'

const formKosong = {
    id: null,
    jenis_transaksi: '',
    tipe_akses: 'all',
    areas: [],
    keterangan: ''
}

// daftar GL unik (account + name) per jenis transaksi
const listGl = (tarif = []) => {
    const list = []
    tarif.forEach(x => {
        if (!list.find(y => y.gl_account === x.gl_account && y.system === x.system)) {
            list.push({ gl_account: x.gl_account, gl_name: x.gl_name, system: x.system })
        }
    })
    return list
}

// react-select: cari berdasarkan jenis transaksi, GL account, atau GL name
const filterJenis = (option, input) => {
    if (!input) return true
    const key = input.toLowerCase()
    const tarif = (option.data && option.data.tarif) || []
    return option.label.toLowerCase().includes(key) ||
        tarif.some(x => `${x.gl_account || ''} ${x.gl_name || ''}`.toLowerCase().includes(key))
}

const formatJenis = (option, { context }) => (
    <div>
        <div>{option.label}</div>
        {context === 'menu' && (
            <small className="text-muted">
                {listGl(option.tarif).map(x => `${x.gl_account} - ${x.gl_name || '-'}`).join(', ')}
            </small>
        )}
    </div>
)

// menu dropdown harus di atas radio/checkbox custom-control (z-index 1)
const selectStyles = { menu: base => ({ ...base, zIndex: 10 }) }

const errMessage = (err, def) => (err && err.response && err.response.data && err.response.data.message) || def

class MasterConfigTransaksi extends Component {
    state = {
        limit: 10,
        search: '',
        modalForm: false,
        modalDelete: false,
        form: formKosong,
        selectDelete: null,
        errorForm: '',
        alert: null
    }

    componentDidMount() {
        const token = localStorage.getItem('token')
        this.getData()
        this.props.getOptions(token).catch(() => {})
    }

    getData = async (val = {}) => {
        const token = localStorage.getItem('token')
        const limit = val.limit || this.state.limit
        const search = val.search !== undefined ? val.search : this.state.search
        try {
            await this.props.getConfig(token, limit, search, val.page || 1)
        } catch (err) {
            this.showAlert('danger', errMessage(err, 'Gagal mengambil data konfigurasi'))
        }
    }

    showAlert = (color, message) => {
        this.setState({ alert: { color, message } })
        setTimeout(() => this.setState({ alert: null }), 4000)
    }

    onSearch = (e) => {
        this.setState({ search: e.target.value })
        if (e.key === 'Enter') {
            this.getData({ search: e.target.value })
        }
    }

    changeLimit = (val) => {
        const limit = val === 'all' ? 'all' : parseInt(val)
        this.setState({ limit })
        this.getData({ limit })
    }

    goPage = async (link) => {
        const token = localStorage.getItem('token')
        if (link) await this.props.nextPage(token, link)
    }

    openForm = (item) => {
        const form = item ? {
            id: item.id,
            jenis_transaksi: item.jenis_transaksi,
            tipe_akses: item.tipe_akses,
            areas: (item.area || []).map(x => x.kode_plant),
            keterangan: item.keterangan || ''
        } : formKosong
        this.setState({ modalForm: true, form, errorForm: '' })
    }

    closeForm = () => this.setState({ modalForm: false, errorForm: '' })

    changeForm = (data) => this.setState({ form: { ...this.state.form, ...data }, errorForm: '' })

    saveForm = async () => {
        const token = localStorage.getItem('token')
        const { form } = this.state
        if (form.jenis_transaksi === '') {
            return this.setState({ errorForm: 'Pilih jenis transaksi terlebih dahulu' })
        }
        if (form.tipe_akses === 'area' && form.areas.length === 0) {
            return this.setState({ errorForm: 'Pilih minimal 1 area' })
        }
        const data = {
            jenis_transaksi: form.jenis_transaksi,
            tipe_akses: form.tipe_akses,
            areas: form.tipe_akses === 'area' ? form.areas : [],
            keterangan: form.keterangan
        }
        try {
            if (form.id) {
                await this.props.updateConfig(token, form.id, data)
            } else {
                await this.props.addConfig(token, data)
            }
            this.setState({ modalForm: false })
            this.showAlert('success', form.id ? 'Konfigurasi berhasil diubah' : 'Konfigurasi berhasil ditambahkan')
            this.getData()
        } catch (err) {
            this.setState({ errorForm: errMessage(err, 'Gagal menyimpan konfigurasi') })
        }
    }

    confirmDelete = (item) => this.setState({ modalDelete: true, selectDelete: item })

    deleteData = async () => {
        const token = localStorage.getItem('token')
        const { selectDelete } = this.state
        try {
            await this.props.deleteConfig(token, selectDelete.id)
            this.setState({ modalDelete: false, selectDelete: null })
            this.showAlert('success', 'Konfigurasi berhasil dihapus')
            this.getData()
        } catch (err) {
            this.setState({ modalDelete: false })
            this.showAlert('danger', errMessage(err, 'Gagal menghapus konfigurasi'))
        }
    }

    renderAkses = (item) => {
        if (item.tipe_akses !== 'area') {
            return <Badge color="success" pill>Semua Area</Badge>
        }
        const list = (item.area || []).map(x => (x.finance && x.finance.area) || x.kode_plant)
        const tampil = list.slice(0, 3).join(', ')
        return (
            <>
                <Badge color="warning" pill className="mr-2">{list.length} Area</Badge>
                <span title={list.join(', ')}>{tampil}{list.length > 3 ? `, +${list.length - 3} lainnya` : ''}</span>
            </>
        )
    }

    render() {
        const { dataConfig, page, optionJenis, optionArea, isLoading } = this.props.configTransaksi
        const { form, alert } = this.state
        const listJenis = optionJenis.map(x => ({ value: x.jenis_transaksi, label: x.jenis_transaksi, tarif: x.tarif }))
        const listArea = optionArea.map(x => ({ value: x.kode_plant, label: `${x.area || '-'} (${x.kode_plant})` }))
        const jenisPilih = listJenis.find(x => x.value === form.jenis_transaksi)
        const startNo = page.currentPage ? ((page.currentPage - 1) * page.limitPerPage) : 0
        return (
            <>
                <AppLayout>
                    {alert && (
                        <Alert color={alert.color} className="mb-3">{alert.message}</Alert>
                    )}
                    <PageCard
                        title="Konfigurasi Transaksi"
                        subtitle="Atur jenis transaksi (master tarif) yang boleh diajukan semua area atau hanya area tertentu. Jenis transaksi yang belum dikonfigurasi dapat diajukan oleh semua area, kecuali area yang dicentang 'Hanya Konfigurasi' di Master Finance."
                        actions={<Button color="primary" onClick={() => this.openForm()}>Add</Button>}
                    >
                        <Toolbar>
                            <SearchBox
                                value={this.state.search}
                                onChange={this.onSearch}
                                onKeyPress={this.onSearch}
                                placeholder="Cari jenis transaksi, GL account, GL name..."
                            />
                            <ToolbarSpacer />
                            <FilterField label="Show entries">
                                <Input type="select" value={this.state.limit} onChange={e => this.changeLimit(e.target.value)}>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                    <option value="all">All</option>
                                </Input>
                            </FilterField>
                        </Toolbar>
                        <div className={style.tableDashboard} style={{ opacity: isLoading ? 0.5 : 1 }}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Jenis Transaksi</th>
                                        <th>GL Account</th>
                                        <th>GL Name</th>
                                        <th>Akses Area</th>
                                        <th>Keterangan</th>
                                        <th>Opsi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataConfig.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{startNo + index + 1}</td>
                                            <td>{item.jenis_transaksi}</td>
                                            <td className="text-nowrap">
                                                {listGl(item.tarif).map(x => (
                                                    <div key={`${x.gl_account}${x.system}`}>{x.gl_account} <small className="text-muted">({x.system})</small></div>
                                                ))}
                                            </td>
                                            <td>
                                                {listGl(item.tarif).map(x => (
                                                    <div key={`${x.gl_account}${x.system}`}>{x.gl_name || '-'}</div>
                                                ))}
                                            </td>
                                            <td>{this.renderAkses(item)}</td>
                                            <td>{item.keterangan}</td>
                                            <td className="text-nowrap">
                                                <Button size="sm" color="primary" className="mr-1" onClick={() => this.openForm(item)}>Edit</Button>
                                                <Button size="sm" color="danger" onClick={() => this.confirmDelete(item)}>Hapus</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {dataConfig.length === 0 && (
                                <div className={style.spin}>Belum ada konfigurasi transaksi</div>
                            )}
                        </div>
                        <Pager
                            current={page.currentPage}
                            pages={page.pages}
                            onPrev={() => this.goPage(page.prevLink)}
                            onNext={() => this.goPage(page.nextLink)}
                            prevDisabled={!page.prevLink}
                            nextDisabled={!page.nextLink}
                        />
                    </PageCard>
                </AppLayout>

                <Modal isOpen={this.state.modalForm} toggle={this.closeForm} size="lg">
                    <ModalHeader toggle={this.closeForm}>{form.id ? 'Edit' : 'Add'} Konfigurasi Transaksi</ModalHeader>
                    <ModalBody>
                        {this.state.errorForm !== '' && (
                            <Alert color="danger">{this.state.errorForm}</Alert>
                        )}
                        <div className="mb-3">
                            <label className="font-weight-bold">Jenis Transaksi <span className="text-danger">*</span></label>
                            <Select
                                styles={selectStyles}
                                options={listJenis}
                                value={jenisPilih || null}
                                onChange={e => this.changeForm({ jenis_transaksi: e.value })}
                                filterOption={filterJenis}
                                formatOptionLabel={formatJenis}
                                placeholder="Cari jenis transaksi, GL account, atau GL name..."
                            />
                            {jenisPilih && (
                                <small className="text-muted">GL: {listGl(jenisPilih.tarif).map(x => `${x.gl_account} - ${x.gl_name || '-'} (${x.system})`).join(', ')}</small>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="font-weight-bold d-block">Akses Pengajuan <span className="text-danger">*</span></label>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input
                                    type="radio"
                                    id="aksesAll"
                                    className="custom-control-input"
                                    checked={form.tipe_akses === 'all'}
                                    onChange={() => this.changeForm({ tipe_akses: 'all' })}
                                />
                                <label className="custom-control-label" htmlFor="aksesAll">Semua area</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input
                                    type="radio"
                                    id="aksesArea"
                                    className="custom-control-input"
                                    checked={form.tipe_akses === 'area'}
                                    onChange={() => this.changeForm({ tipe_akses: 'area' })}
                                />
                                <label className="custom-control-label" htmlFor="aksesArea">Hanya area tertentu</label>
                            </div>
                        </div>
                        {form.tipe_akses === 'area' && (
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <label className="font-weight-bold mb-0">
                                        Area (master finance) <span className="text-danger">*</span>
                                        <span className="text-muted font-weight-normal ml-2">{form.areas.length} dipilih</span>
                                    </label>
                                    {form.areas.length > 0 && (
                                        <Button size="sm" color="link" className="p-0" onClick={() => this.changeForm({ areas: [] })}>Kosongkan</Button>
                                    )}
                                </div>
                                <Select
                                    styles={selectStyles}
                                    isMulti
                                    closeMenuOnSelect={false}
                                    options={listArea}
                                    value={listArea.filter(x => form.areas.includes(x.value))}
                                    onChange={e => this.changeForm({ areas: (e || []).map(x => x.value) })}
                                    placeholder="Cari dan pilih area..."
                                />
                            </div>
                        )}
                        <div>
                            <label className="font-weight-bold">Keterangan</label>
                            <Input
                                type="textarea"
                                rows={2}
                                value={form.keterangan}
                                onChange={e => this.changeForm({ keterangan: e.target.value })}
                                placeholder="Opsional"
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.closeForm}>Batal</Button>
                        <Button color="primary" disabled={isLoading} onClick={this.saveForm}>Simpan</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalDelete} toggle={() => this.setState({ modalDelete: false })} centered>
                    <ModalBody>
                        Hapus konfigurasi <b>{this.state.selectDelete && this.state.selectDelete.jenis_transaksi}</b>?
                        Setelah dihapus, jenis transaksi ini dapat diajukan oleh semua area.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.setState({ modalDelete: false })}>Batal</Button>
                        <Button color="danger" disabled={isLoading} onClick={this.deleteData}>Hapus</Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    configTransaksi: state.configTransaksi
})

const mapDispatchToProps = {
    getConfig: configAct.getConfig,
    nextPage: configAct.nextPage,
    getOptions: configAct.getOptions,
    addConfig: configAct.addConfig,
    updateConfig: configAct.updateConfig,
    deleteConfig: configAct.deleteConfig
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterConfigTransaksi)
