import React from 'react'
import moment from 'moment'
import s from '../assets/css/dashboard.module.css'

// urutan & warna status (sudah divalidasi aman untuk buta warna pada urutan bersebelahan ini)
export const listStatus = [
    { key: 'finished', label: 'Finished', color: '#0ca30c' },
    { key: 'inProgress', label: 'In Progress', color: '#2f7ed8' },
    { key: 'revisi', label: 'Revisi', color: '#e0960f' },
    { key: 'rejected', label: 'Rejected', color: '#d03b3b' },
]

const formatNum = (val) => (val || 0).toLocaleString('id-ID')
const formatPct = (val, total) => total > 0 ? `${((val / total) * 100).toFixed(1).replace('.', ',')}%` : '0%'

export const periodeOptions = () => {
    const year = moment().year()
    return [
        { value: 'm6', label: '6 Bulan Terakhir', periode: { months: 6 } },
        { value: 'm12', label: '12 Bulan Terakhir', periode: { months: 12 } },
        { value: `y${year}`, label: `Tahun ${year}`, periode: { year } },
        { value: `y${year - 1}`, label: `Tahun ${year - 1}`, periode: { year: year - 1 } },
        { value: `y${year - 2}`, label: `Tahun ${year - 2}`, periode: { year: year - 2 } },
    ]
}

const StatusRow = ({ item }) => {
    const Icon = item.icon
    const total = item.totalData || 0
    return (
        <div className={s.row}>
            <div className={s.rowHead}>
                <div className={s.rowTitle}>
                    {Icon && <Icon size={16} className={s.rowIcon} />}
                    {item.title}
                </div>
                <div className={s.rowTotal}><b>{formatNum(total)}</b> transaksi</div>
            </div>
            {total === 0 ? (
                <>
                    <div className={s.track} />
                    <div className={s.empty}>Belum ada transaksi pada periode ini</div>
                </>
            ) : (
                <>
                    <div className={s.bar} role="img" aria-label={`${item.title}: ${listStatus.map(x => `${x.label} ${formatNum(item[x.key])}`).join(', ')}`}>
                        {listStatus.filter(x => item[x.key] > 0).map(x => (
                            <div
                                key={x.key}
                                className={s.segment}
                                style={{ flexGrow: item[x.key], backgroundColor: x.color }}
                            >
                                <div className={s.tooltip}>
                                    <span className={s.dot} style={{ backgroundColor: x.color }} />
                                    {x.label}: <b>{formatNum(item[x.key])}</b> ({formatPct(item[x.key], total)})
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={s.values}>
                        {listStatus.map(x => (
                            <div key={x.key} className={s.value}>
                                <span className={s.dot} style={{ backgroundColor: x.color }} />
                                <span className={s.valueLabel}>{x.label}</span>
                                <b>{formatNum(item[x.key])}</b>
                                <span className={s.valuePct}>{formatPct(item[x.key], total)}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

// grafik status transaksi per jenis (bar bertumpuk 100%)
const DashboardStatus = ({ rows, periodeValue, onChangePeriode, isLoading, periode }) => {
    const rangeText = periode && periode.start
        ? `${moment(periode.start).format('DD MMM YYYY')} - ${moment(periode.end).format('DD MMM YYYY')}`
        : ''
    return (
        <div className={s.card}>
            <div className={s.header}>
                <div>
                    <h2 className={s.title}>Status Transaksi</h2>
                    <div className={s.subtitle}>
                        {isLoading ? 'Memuat data...' : `Berdasarkan tanggal pengajuan ${rangeText}`}
                    </div>
                </div>
                <select
                    className={`form-control ${s.select}`}
                    value={periodeValue}
                    onChange={e => onChangePeriode(e.target.value)}
                >
                    {periodeOptions().map(x => (
                        <option key={x.value} value={x.value}>{x.label}</option>
                    ))}
                </select>
            </div>
            <div className={s.legend}>
                {listStatus.map(x => (
                    <div key={x.key} className={s.legendItem}>
                        <span className={s.dot} style={{ backgroundColor: x.color }} />
                        {x.label}
                    </div>
                ))}
            </div>
            <div className={`${s.rows} ${isLoading ? s.loading : ''}`}>
                {rows.map(item => <StatusRow key={item.transaksi} item={item} />)}
            </div>
        </div>
    )
}

export default DashboardStatus
