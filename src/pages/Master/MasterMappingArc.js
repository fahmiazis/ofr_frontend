import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Badge } from 'reactstrap'
import Select from 'react-select'
import AppLayout from '../../components/AppLayout'
import { PageCard, Toolbar, ToolbarSpacer, FilterField, SearchBox, Pager } from '../../components/ui/Page'
import style from '../../assets/css/input.module.css'
import arcAct from '../../redux/actions/mappingArc'

// .badge-pill global (style.css) dipaksa bulat 36x36, jadi label pakai rounded sendiri
const styleBadge = { borderRadius: '10rem', padding: '0.4em 0.75em', fontSize: '85%' }

const formKosong = {
    isEdit: false,
    username: '',
    areas: []
}

// menu dropdown harus di atas elemen modal lain
const selectStyles = { menu: base => ({ ...base, zIndex: 10 }) }

const labelApprover = { spv_arc: 'SPV ARC', rom_arc: 'ROM ARC' }

const errMessage = (err, def) => (err && err.response && err.response.data && err.response.data.message) || def

class MasterMappingArc extends Component {
    state = {
        limit: 10,
        search: '',
        modalForm: false,
        modalDelete: false,
        modalUpload: false,
        form: formKosong,
        selectDelete: null,
        fileUpload: null,
        hasilUpload: null,
        errorForm: '',
        alert: null,
        tab: 'pic',
        searchSpv: '',
        pilihSpv: [],
        modalSpv: false,
        formSpv: '',
        kolomSpv: 'spv_arc'
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
            await this.props.getMapping(token, limit, search, val.page || 1)
        } catch (err) {
            this.showAlert('danger', errMessage(err, 'Gagal mengambil data mapping'))
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
            isEdit: true,
            username: item.username,
            areas: item.areas.map(x => x.kode_plant)
        } : formKosong
        this.setState({ modalForm: true, form, errorForm: '' })
    }

    closeForm = () => this.setState({ modalForm: false, errorForm: '' })

    changeForm = (data) => this.setState({ form: { ...this.state.form, ...data }, errorForm: '' })

    saveForm = async () => {
        const token = localStorage.getItem('token')
        const { form } = this.state
        if (form.username === '') {
            return this.setState({ errorForm: 'Pilih user AR Central terlebih dahulu' })
        }
        if (form.areas.length === 0) {
            return this.setState({ errorForm: 'Pilih minimal 1 area' })
        }
        try {
            await this.props.saveMapping(token, { username: form.username, areas: form.areas })
            this.setState({ modalForm: false })
            this.showAlert('success', 'Mapping berhasil disimpan')
            this.getData()
        } catch (err) {
            this.setState({ errorForm: errMessage(err, 'Gagal menyimpan mapping') })
        }
    }

    confirmDelete = (item) => this.setState({ modalDelete: true, selectDelete: item })

    deleteData = async () => {
        const token = localStorage.getItem('token')
        const { selectDelete } = this.state
        try {
            await this.props.deleteMapping(token, selectDelete.username)
            this.setState({ modalDelete: false, selectDelete: null })
            this.showAlert('success', 'Mapping berhasil dihapus')
            this.getData()
        } catch (err) {
            this.setState({ modalDelete: false })
            this.showAlert('danger', errMessage(err, 'Gagal menghapus mapping'))
        }
    }

    openUpload = () => this.setState({ modalUpload: true, fileUpload: null, hasilUpload: null, errorForm: '' })

    uploadData = async () => {
        const token = localStorage.getItem('token')
        if (!this.state.fileUpload) {
            return this.setState({ errorForm: 'Pilih file excel terlebih dahulu' })
        }
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        try {
            const res = await this.props.uploadMapping(token, data)
            this.setState({ hasilUpload: res.value.data, errorForm: '' })
            this.getData()
        } catch (err) {
            this.setState({ errorForm: errMessage(err, 'Gagal upload mapping') })
        }
    }

    changeTab = (tab) => {
        const token = localStorage.getItem('token')
        this.setState({ tab, pilihSpv: [] })
        if (tab === 'spv') {
            this.props.getSpv(token).catch(err => this.showAlert('danger', errMessage(err, 'Gagal mengambil data SPV')))
        }
    }

    checkSpv = (kode) => {
        const { pilihSpv } = this.state
        this.setState({ pilihSpv: pilihSpv.includes(kode) ? pilihSpv.filter(x => x !== kode) : [...pilihSpv, kode] })
    }

    openSpv = (kolomSpv) => {
        if (this.state.pilihSpv.length === 0) {
            return this.showAlert('danger', 'Centang minimal 1 area')
        }
        this.setState({ modalSpv: true, formSpv: '', kolomSpv, errorForm: '' })
    }

    saveSpv = async () => {
        const token = localStorage.getItem('token')
        try {
            await this.props.saveSpv(token, { areas: this.state.pilihSpv, kolom: this.state.kolomSpv, nama: this.state.formSpv })
            this.setState({ modalSpv: false, pilihSpv: [] })
            this.showAlert('success', `${labelApprover[this.state.kolomSpv]} berhasil disimpan`)
            this.props.getSpv(token).catch(() => {})
        } catch (err) {
            this.setState({ errorForm: errMessage(err, `Gagal menyimpan ${labelApprover[this.state.kolomSpv]}`) })
        }
    }

    renderSpv = () => {
        const { dataSpv, isLoading } = this.props.mappingArc
        const { pilihSpv, searchSpv } = this.state
        const key = searchSpv.toLowerCase()
        const listSpv = dataSpv.filter(x => key === '' || `${x.kode_plant} ${x.area || ''} ${x.spv_arc || ''} ${x.rom_arc || ''}`.toLowerCase().includes(key))
        const allCheck = listSpv.length > 0 && listSpv.every(x => pilihSpv.includes(x.kode_plant))
        return (
            <>
                <Toolbar>
                    <SearchBox
                        value={searchSpv}
                        onChange={e => this.setState({ searchSpv: e.target.value })}
                        placeholder="Cari kode plant, area, SPV, ROM..."
                    />
                    <ToolbarSpacer />
                    <Button color="primary" className="mr-2" onClick={() => this.openSpv('spv_arc')}>Set SPV ARC ({pilihSpv.length})</Button>
                    <Button color="primary" onClick={() => this.openSpv('rom_arc')}>Set ROM ARC ({pilihSpv.length})</Button>
                </Toolbar>
                <div className={style.tableDashboard} style={{ opacity: isLoading ? 0.5 : 1 }}>
                    <Table bordered responsive hover className={style.tab}>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={allCheck}
                                        onChange={() => this.setState({ pilihSpv: allCheck ? [] : listSpv.map(x => x.kode_plant) })}
                                    />
                                </th>
                                <th>Kode Plant</th>
                                <th>Area</th>
                                <th>Jumlah PIC ARC</th>
                                <th>SPV ARC</th>
                                <th>ROM ARC</th>
                                <th>NOM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listSpv.map(item => (
                                <tr key={item.kode_plant}>
                                    <td>
                                        <input type="checkbox" checked={pilihSpv.includes(item.kode_plant)} onChange={() => this.checkSpv(item.kode_plant)} />
                                    </td>
                                    <td>{item.kode_plant}</td>
                                    <td>{item.area}</td>
                                    <td>{item.jumlah_pic}</td>
                                    <td>{item.spv_arc || <span className="text-danger">Belum diatur</span>}</td>
                                    <td>{item.rom_arc || <span className="text-danger">Belum diatur</span>}</td>
                                    <td>{item.nom}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {listSpv.length === 0 && (
                        <div className={style.spin}>Belum ada area yang di-cover AR Central</div>
                    )}
                </div>
            </>
        )
    }

    renderArea = (item) => {
        const list = item.areas.map(x => x.area || x.kode_plant)
        const tampil = list.slice(0, 3).join(', ')
        return (
            <>
                <Badge color="info" style={styleBadge} className="mr-2">{list.length} Area</Badge>
                <span title={list.join(', ')}>{tampil}{list.length > 3 ? `, +${list.length - 3} lainnya` : ''}</span>
            </>
        )
    }

    render() {
        const { dataMapping, page, optionUser, optionArea, isLoading } = this.props.mappingArc
        const { form, alert, hasilUpload } = this.state
        // user area biasa sudah punya kode plant sendiri, user AR Central tidak
        const listUser = optionUser
            .filter(x => !x.kode_plant || x.username === form.username)
            .map(x => ({ value: x.username, label: `${x.fullname || x.username} (${x.email || x.username})` }))
        const listArea = optionArea.map(x => ({ value: x.kode_plant, label: `${x.area || '-'} (${x.kode_plant})` }))
        const optionApprover = this.state.kolomSpv === 'rom_arc' ? this.props.mappingArc.optionRom : this.props.mappingArc.optionSpv
        const listSpv = optionApprover.map(x => ({ value: x.fullname, label: `${x.fullname} (${x.email || x.username})` }))
        const { tab } = this.state
        const startNo = page.currentPage ? ((page.currentPage - 1) * page.limitPerPage) : 0
        return (
            <>
                <AppLayout>
                    {alert && (
                        <Alert color={alert.color} className="mb-3">{alert.message}</Alert>
                    )}
                    <PageCard
                        title="Mapping AR Central"
                        subtitle="Atur area (master finance) yang dapat diwakili user AR Central saat mengajukan operasional, serta SPV ARC dan ROM ARC tiap area (NOM mengikuti master finance). Jenis transaksi AR Central diatur di menu Konfigurasi Transaksi."
                        actions={tab === 'pic' && (
                            <>
                                <Button color="success" className="mr-2" onClick={this.openUpload}>Upload</Button>
                                <Button color="primary" onClick={() => this.openForm()}>Add</Button>
                            </>
                        )}
                    >
                        <div className="mb-3">
                            <Button color={tab === 'pic' ? 'primary' : 'light'} className="mr-2" onClick={() => this.changeTab('pic')}>PIC ARC</Button>
                            <Button color={tab === 'spv' ? 'primary' : 'light'} onClick={() => this.changeTab('spv')}>Approver per Area</Button>
                        </div>
                        {tab === 'spv' ? this.renderSpv() : (
                        <>
                        <Toolbar>
                            <SearchBox
                                value={this.state.search}
                                onChange={this.onSearch}
                                onKeyPress={this.onSearch}
                                placeholder="Cari nama, email, kode plant, area..."
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
                                        <th>Nama PIC ARC</th>
                                        <th>Email</th>
                                        <th>Username</th>
                                        <th>Area</th>
                                        <th>Opsi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataMapping.map((item, index) => (
                                        <tr key={item.username}>
                                            <td>{startNo + index + 1}</td>
                                            <td>{item.fullname || <span className="text-danger">User tidak ditemukan</span>}</td>
                                            <td>{item.email}</td>
                                            <td>{item.username}</td>
                                            <td>{this.renderArea(item)}</td>
                                            <td className="text-nowrap">
                                                <Button size="sm" color="primary" className="mr-1" onClick={() => this.openForm(item)}>Edit</Button>
                                                <Button size="sm" color="danger" onClick={() => this.confirmDelete(item)}>Hapus</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {dataMapping.length === 0 && (
                                <div className={style.spin}>Belum ada mapping AR Central</div>
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
                        </>
                        )}
                    </PageCard>
                </AppLayout>

                <Modal isOpen={this.state.modalForm} toggle={this.closeForm} size="lg">
                    <ModalHeader toggle={this.closeForm}>{form.isEdit ? 'Edit' : 'Add'} Mapping AR Central</ModalHeader>
                    <ModalBody>
                        {this.state.errorForm !== '' && (
                            <Alert color="danger">{this.state.errorForm}</Alert>
                        )}
                        <div className="mb-3">
                            <label className="font-weight-bold">User AR Central <span className="text-danger">*</span></label>
                            <Select
                                styles={selectStyles}
                                options={listUser}
                                isDisabled={form.isEdit}
                                value={listUser.find(x => x.value === form.username) || null}
                                onChange={e => this.changeForm({ username: e.value })}
                                placeholder="Cari user level area tanpa kode plant..."
                            />
                        </div>
                        <div>
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
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.closeForm}>Batal</Button>
                        <Button color="primary" disabled={isLoading} onClick={this.saveForm}>Simpan</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalUpload} toggle={() => this.setState({ modalUpload: false })} size="lg">
                    <ModalHeader toggle={() => this.setState({ modalUpload: false })}>Upload Mapping AR Central</ModalHeader>
                    <ModalBody>
                        {this.state.errorForm !== '' && (
                            <Alert color="danger">{this.state.errorForm}</Alert>
                        )}
                        <div className="mb-2">
                            Format kolom: <b>KODE PLANT, PROFIT CENTER, AREA, PIC ARC, EMAIL</b>.
                            User dicocokkan berdasarkan email di master user. Mapping yang sudah ada tidak dihapus.
                        </div>
                        <Input
                            type="file"
                            accept=".xls,.xlsx"
                            onChange={e => this.setState({ fileUpload: e.target.files[0], hasilUpload: null, errorForm: '' })}
                        />
                        {hasilUpload && (
                            <div className="mt-3">
                                <Alert color={hasilUpload.gagal.length > 0 ? 'warning' : 'success'}>
                                    {hasilUpload.tambah} mapping ditambahkan, {hasilUpload.lewati} sudah ada, {hasilUpload.gagal.length} gagal.
                                </Alert>
                                {hasilUpload.gagal.length > 0 && (
                                    <Table bordered size="sm" responsive>
                                        <thead>
                                            <tr>
                                                <th>Baris</th>
                                                <th>Kode Plant</th>
                                                <th>PIC ARC</th>
                                                <th>Email</th>
                                                <th>Alasan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {hasilUpload.gagal.map(x => (
                                                <tr key={x.baris}>
                                                    <td>{x.baris}</td>
                                                    <td>{x.kode_plant}</td>
                                                    <td>{x.nama}</td>
                                                    <td>{x.email}</td>
                                                    <td>{x.alasan}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.setState({ modalUpload: false })}>Tutup</Button>
                        <Button color="primary" disabled={isLoading} onClick={this.uploadData}>Upload</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalSpv} toggle={() => this.setState({ modalSpv: false })}>
                    <ModalHeader toggle={() => this.setState({ modalSpv: false })}>Set {labelApprover[this.state.kolomSpv]}</ModalHeader>
                    <ModalBody>
                        {this.state.errorForm !== '' && (
                            <Alert color="danger">{this.state.errorForm}</Alert>
                        )}
                        <div className="mb-2">{this.state.pilihSpv.length} area dipilih</div>
                        <Select
                            styles={selectStyles}
                            isClearable
                            options={listSpv}
                            value={listSpv.find(x => x.value === this.state.formSpv) || null}
                            onChange={e => this.setState({ formSpv: e ? e.value : '' })}
                            placeholder={`Pilih user ${labelApprover[this.state.kolomSpv]} (kosongkan untuk menghapus)...`}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.setState({ modalSpv: false })}>Batal</Button>
                        <Button color="primary" disabled={isLoading} onClick={this.saveSpv}>Simpan</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalDelete} toggle={() => this.setState({ modalDelete: false })} centered>
                    <ModalBody>
                        Hapus semua mapping area untuk <b>{this.state.selectDelete && (this.state.selectDelete.fullname || this.state.selectDelete.username)}</b>?
                        User ini tidak dapat lagi mengajukan atas nama area tersebut.
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
    mappingArc: state.mappingArc
})

const mapDispatchToProps = {
    getMapping: arcAct.getMapping,
    nextPage: arcAct.nextPage,
    getOptions: arcAct.getOptions,
    saveMapping: arcAct.saveMapping,
    uploadMapping: arcAct.uploadMapping,
    deleteMapping: arcAct.deleteMapping,
    getSpv: arcAct.getSpv,
    saveSpv: arcAct.saveSpv
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterMappingArc)
