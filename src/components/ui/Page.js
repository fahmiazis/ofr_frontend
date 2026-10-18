import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import s from '../../assets/css/page.module.css'

// Kerangka standar halaman data:
// <PageCard title actions>
//   <Toolbar> <SearchBox/> <FilterField label>...</FilterField> </Toolbar>
//   <div className={style.tableDashboard}> <Table/> </div>
//   <Pager/>
// </PageCard>

export const PageCard = ({ title, subtitle, actions, children, className }) => (
    <div className={`${s.pageCard} ${className || ''}`}>
        {(title || actions) && (
            <div className={s.pageHeader}>
                <div className={s.pageHeading}>
                    {title && <h1 className={s.pageTitle}>{title}</h1>}
                    {subtitle && <div className={s.pageSubtitle}>{subtitle}</div>}
                </div>
                {actions && <div className={s.pageActions}>{actions}</div>}
            </div>
        )}
        {children}
    </div>
)

// baris filter; children berupa FilterField / SearchBox / ToolbarSpacer
export const Toolbar = ({ children, className }) => (
    <div className={`${s.toolbar} ${className || ''}`}>{children}</div>
)

// pemisah teks di antara dua input tanggal (mis. "s/d")
export const RangeSep = ({ children = 's/d' }) => <span className={s.rangeSep}>{children}</span>

// dorong item setelahnya ke sisi kanan toolbar
export const ToolbarSpacer = () => <div className={s.spacer} />

// satu baris di dalam Toolbar, untuk toolbar bertingkat (baris search lalu baris filter)
export const ToolbarRow = ({ children }) => <div className={s.toolbarRow}>{children}</div>

// field dalam grid kolom rata (mis. search, status, vendor di bawah filter periode)
export const ToolbarGrid = ({ children }) => <div className={s.toolbarGrid}>{children}</div>

export const FilterField = ({ label, children, wide, auto, narrow, className }) => (
    <div className={`${s.field} ${wide ? s.fieldWide : ''} ${auto ? s.fieldAuto : ''} ${narrow ? s.fieldNarrow : ''} ${className || ''}`}>
        {label && <label className={s.fieldLabel}>{label}</label>}
        <div className={s.fieldControl}>{children}</div>
    </div>
)

// input pencarian dengan ikon; props diteruskan ke <input> (value, onChange, onKeyPress, dll)
export const SearchBox = ({ label = 'Search', placeholder = 'Cari data...', className, ...props }) => (
    <div className={`${s.field} ${s.fieldWide} ${s.searchField} ${className || ''}`}>
        {label && <label className={s.fieldLabel}>{label}</label>}
        <div className={s.searchBox}>
            <FaSearch className={s.searchIcon} size={14} />
            <input type="text" className={`form-control ${s.searchInput}`} placeholder={placeholder} {...props} />
        </div>
    </div>
)

// footer tabel: info halaman + tombol prev/next
export const Pager = ({ current, pages, onPrev, onNext, prevDisabled, nextDisabled, children }) => (
    <div className={s.pager}>
        <div className={s.pagerInfo}>
            {children || <>Halaman <b>{current || 1}</b> dari <b>{pages || 1}</b></>}
        </div>
        <div className={s.pagerButtons}>
            <button type="button" className={s.pagerBtn} disabled={prevDisabled} onClick={onPrev}>
                <FiChevronLeft size={16} /> Prev
            </button>
            <button type="button" className={s.pagerBtn} disabled={nextDisabled} onClick={onNext}>
                Next <FiChevronRight size={16} />
            </button>
        </div>
    </div>
)
