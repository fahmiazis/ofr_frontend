import React, { Component } from 'react'
import { Collapse } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import logo from '../assets/img/logo.png'
import styleLayout from '../assets/css/layout.module.css'
import { FaBars, FaDatabase, FaTicketAlt, FaCashRegister, FaTasks, FaHandshake } from 'react-icons/fa'
import { BsFillHouseDoorFill, BsClipboardData } from 'react-icons/bs'
import { AiOutlineMail, AiOutlineMenu } from 'react-icons/ai'
import { RiBankCardFill } from 'react-icons/ri'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { FiUser, FiTruck, FiSliders } from 'react-icons/fi'
import { SiReason } from 'react-icons/si'
import { MdOutlineDomainVerification, MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md'
import Bell from './Bell'
import Account from './Account'
import AreaArc from './AreaArc'

const accessVendor = [4, 14, 8, 7, 17, 2, 9, 1, 5, 6]

// daftar submenu master per level
const masterMenu = {
    '102': [
        { route: 'faktur', label: 'Master Faktur', icon: BsClipboardData },
        { route: 'shelfaktur', label: 'Data Faktur E-Invoice', icon: BsClipboardData },
        { route: 'kpp', label: 'Master KPP', icon: BsClipboardData },
        { route: 'taxcode', label: 'Master Taxcode', icon: BsClipboardData },
        { route: 'tarif', label: 'Master Tarif', icon: FaTicketAlt },
        { route: 'configtrans', label: 'Konfigurasi Transaksi', icon: FiSliders },
        { route: 'vendor', label: 'Master Vendor', icon: BsClipboardData },
    ],
    '101': [
        { route: 'bank', label: 'Master Bank', icon: RiBankCardFill },
        { route: 'finance', label: 'Master Finance', icon: BsClipboardData },
        { route: 'kliring', label: 'Master Kliring', icon: RiBankCardFill },
        { route: 'reservoir', label: 'Reservoir', icon: BsClipboardData },
    ],
    '103': [
        { route: 'coa', label: 'Master COA Klaim', icon: BsClipboardData },
        { route: 'picklaim', label: 'Master PIC Klaim', icon: FiUser },
        { route: 'spvklaim', label: 'Master SPV Klaim', icon: FiUser },
    ],
    '1': [
        { route: 'approval', label: 'Setting Approval', icon: BsClipboardData },
        { route: 'reason', label: 'Master Alasan Reject', icon: SiReason },
        { route: 'bank', label: 'Master Bank', icon: RiBankCardFill },
        { route: 'coa', label: 'Master COA Klaim', icon: BsClipboardData },
        { route: 'dokumen', label: 'Master Dokumen', icon: HiOutlineDocumentText },
        { route: 'email', label: 'Master Email', icon: AiOutlineMail },
        { route: 'faktur', label: 'Master Faktur', icon: BsClipboardData },
        { route: 'shelfaktur', label: 'Data Faktur E-Invoice', icon: BsClipboardData },
        { route: 'finance', label: 'Master Finance', icon: BsClipboardData },
        { route: 'glikk', label: 'Master GL Kas Kecil', icon: BsClipboardData },
        { route: 'kliring', label: 'Master Kliring', icon: RiBankCardFill },
        { route: 'kpp', label: 'Master KPP', icon: BsClipboardData },
        { route: 'menu', label: 'Master Menu', icon: AiOutlineMenu },
        { route: 'picklaim', label: 'Master PIC Klaim', icon: FiUser },
        { route: 'rekening', label: 'Master Rekening', icon: RiBankCardFill },
        { route: 'spvklaim', label: 'Master SPV Klaim', icon: FiUser },
        { route: 'scylla', label: 'Master Scylla', icon: BsClipboardData },
        { route: 'role', label: 'Master Role', icon: FiUser },
        { route: 'taxcode', label: 'Master Taxcode', icon: BsClipboardData },
        { route: 'tarif', label: 'Master Tarif', icon: FaTicketAlt },
        { route: 'configtrans', label: 'Konfigurasi Transaksi', icon: FiSliders },
        { route: 'arc', label: 'Mapping AR Center', icon: FiUser },
        { route: 'user', label: 'Master User', icon: FiUser },
        { route: 'vendor', label: 'Master Vendor', icon: BsClipboardData },
        { route: 'reservoir', label: 'Reservoir', icon: BsClipboardData },
    ],
}

class NewNavbar extends Component {
    state = {
        isPinned: false, // klik logo untuk mengunci sidebar tetap terbuka
        isHover: false,
        mobileSidebarVisible: false,
        isMobile: window.innerWidth <= 768,
        openMaster: false,
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
        this.notifySidebar()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.isPinned !== this.state.isPinned) {
            this.notifySidebar()
        }
    }

    isCollapsed = (state) => !state.isPinned && !state.isHover

    // konten hanya bergeser saat sidebar dikunci, saat hover sidebar melayang di atas konten
    notifySidebar = () => {
        if (this.props.handleSidebar) {
            this.props.handleSidebar(!this.state.isPinned)
        }
    }

    handleResize = () => {
        this.setState({ isMobile: window.innerWidth <= 768 })
    }

    hoverSidebar = (val) => {
        if (this.state.isMobile) return
        this.setState({ isHover: val, openMaster: val ? this.state.openMaster : this.state.isPinned && this.state.openMaster })
    }

    clickLogo = () => {
        if (this.state.isMobile) {
            this.toggleMobileSidebar()
        } else {
            this.setState({ isPinned: !this.state.isPinned })
        }
    }

    toggleMobileSidebar = () => {
        this.setState({ mobileSidebarVisible: !this.state.mobileSidebarVisible })
    }

    toggleMaster = () => {
        this.setState({ openMaster: !this.state.openMaster })
    }

    goRoute = (route) => {
        this.setState({ mobileSidebarVisible: false })
        if (this.props.handleRoute) {
            this.props.handleRoute(route)
        } else {
            this.props.history.push(`/${route}`)
        }
    }

    renderLink = (item, showLabel, isActive) => {
        const Icon = item.icon
        return (
            <div
                key={item.route}
                className={`${styleLayout.menuLink} ${isActive ? styleLayout.menuActive : ''}`}
                onClick={() => this.goRoute(item.route)}
                title={item.label}
            >
                <Icon className={styleLayout.icon} size={20} />
                {showLabel && <span className={styleLayout.menuText}>{item.label}</span>}
            </div>
        )
    }

    render() {
        const level = localStorage.getItem('level')
        const { mobileSidebarVisible, isMobile, openMaster } = this.state
        const collapsed = this.isCollapsed(this.state) && !isMobile
        const showLabel = !collapsed
        const pathname = (this.props.location && this.props.location.pathname) || '/'
        const current = pathname.replace(/^\//, '').split('/')[0]

        // user AR Center hanya mengajukan operasional atas nama area
        // SPV AR Center (level 53) hanya approve ajuan operasional AR Center
        const isArc = localStorage.getItem('arc') === '1' || level === '53'
        const mainMenu = isArc ? [
            { route: '', label: 'Home', icon: BsFillHouseDoorFill },
            { route: 'navops', label: 'Operasional', icon: FiTruck },
        ] : [
            { route: '', label: 'Home', icon: BsFillHouseDoorFill },
            ...(level !== '4' && level !== '14' ? [{ route: 'navklaim', label: 'Klaim', icon: FaHandshake }] : []),
            { route: 'navkasbon', label: 'Kasbon', icon: FaCashRegister },
            { route: 'navops', label: 'Operasional', icon: FiTruck },
            { route: 'navikk', label: 'Ikhtisar Kas Kecil', icon: FaTasks },
            ...(accessVendor.find(x => x === parseInt(level)) ? [{ route: 'verifven', label: 'Pengajuan Data Vendor', icon: MdOutlineDomainVerification }] : []),
        ]
        const listMaster = masterMenu[level] || []

        return (
            <>
                {isMobile && mobileSidebarVisible && (
                    <div className={styleLayout.overlay} onClick={this.toggleMobileSidebar} />
                )}
                <div
                    className={`${styleLayout.sidebar} ${collapsed ? styleLayout.collapsed : ''} ${mobileSidebarVisible && isMobile ? styleLayout.mobileVisible : ''}`}
                    onMouseEnter={() => this.hoverSidebar(true)}
                    onMouseLeave={() => this.hoverSidebar(false)}
                >
                    <div className={styleLayout.logoContainer} onClick={this.clickLogo} title={this.state.isPinned ? 'Lepas kunci sidebar' : 'Kunci sidebar'}>
                        <img src={logo} alt="Logo" className={styleLayout.logo} />
                    </div>

                    <div className={styleLayout.menuItems}>
                        {mainMenu.map(item => this.renderLink(item, showLabel, current === item.route))}

                        {listMaster.length > 0 && (
                            <>
                                <div className={styleLayout.menuLink} onClick={this.toggleMaster} title="Master">
                                    <FaDatabase className={styleLayout.icon} size={20} />
                                    {showLabel && (
                                        <>
                                            <span className={styleLayout.menuText}>Master</span>
                                            {openMaster ? (
                                                <MdKeyboardArrowDown className={styleLayout.arrow} size={20} />
                                            ) : (
                                                <MdKeyboardArrowRight className={styleLayout.arrow} size={20} />
                                            )}
                                        </>
                                    )}
                                </div>
                                <Collapse isOpen={openMaster && showLabel} className={styleLayout.subMenu}>
                                    {listMaster.map(item => this.renderLink(item, showLabel, current === item.route))}
                                </Collapse>
                            </>
                        )}
                    </div>
                </div>
                <div className={`${styleLayout.navbar} ${this.state.isPinned && !isMobile ? styleLayout.navbarPinned : ''}`}>
                    <div className={styleLayout.burgerIcon} onClick={this.toggleMobileSidebar}>
                        <FaBars />
                    </div>
                    <div className={styleLayout.navTitle}>
                        <div className={styleLayout.marquee}>
                            <span>WEB OFR - OPERATIONAL FUND REQUEST</span>
                        </div>
                    </div>
                    <div className={styleLayout.navIcons}>
                        <AreaArc />
                        <Bell color={'white'} />
                        <Account color={'white'} />
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(NewNavbar)
