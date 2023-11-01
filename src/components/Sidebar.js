import React, { Component, useState } from 'react'
import logo from '../assets/img/logo.png'
import { Collapse } from 'reactstrap';
import {AiFillHome} from 'react-icons/ai'
import { FaDatabase, FaTicketAlt, FaHome, FaCashRegister, FaCartPlus, FaRecycle, FaTasks, FaHandshake} from 'react-icons/fa'
import { RiArrowLeftRightFill, RiMoneyDollarCircleFill } from 'react-icons/ri'
import { HiOutlineDocumentText } from 'react-icons/hi'
import {RiBankCardFill} from 'react-icons/ri'
import {FiLogOut, FiUser, FiUsers, FiMail, FiSettings, FiTruck} from 'react-icons/fi'
import { SiReason } from 'react-icons/si'
import { BsClipboardData, BsHouseDoor, BsFileCheck } from 'react-icons/bs'
import { GiFamilyTree } from 'react-icons/gi'
import { MdKeyboardArrowLeft, MdOutlineDomainVerification } from 'react-icons/md'
import { AiFillSetting, AiOutlineClockCircle, AiOutlineMail, AiOutlineMenu, AiFillDashboard } from 'react-icons/ai'
import { GrDocumentVerified } from 'react-icons/gr'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import logoutAction from '../redux/actions/auth'
import stile from '../assets/css/input.module.css'

function Sidebar(props) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    function goHome(route) {
        history.push(`/${route}`)
    }

    function logout() {
        dispatch(logoutAction.logout())
        history.push('/login')
    }
    const level = localStorage.getItem('level')

    return (
        <div className="sideBar">
            <div>
                <div className="secLogo">
                    <img src={logo} className="logoHome" />
                </div>
                <button className="menuSides" onClick={() => goHome('')}>
                    <AiFillHome size={20} className="iconSide" />
                    <text className="txtMenu">Home</text>
                </button>
                <button className="menuSides" onClick={() => goHome('dashboard')}>
                    <AiFillDashboard size={20} className="iconSide" />
                    <text className="txtMenu">Dashboard</text>
                </button>
                {level !== '4' && level !== '14' && (
                    <button className="menuSides" onClick={() => goHome('navklaim')}>
                        <FaHandshake size={20} className="iconSide" />
                        <text className="txtMenu">Klaim</text>
                    </button>
                )}
                <button className="menuSides" onClick={() => goHome('navkasbon')}>
                    <FaCashRegister size={20} className="iconSide" />
                    <text className="txtMenu">Kasbon</text>
                </button>
                <button className="menuSides" onClick={() => goHome('navops')}>
                    <FiTruck size={20} className="iconSide" />
                    <text className="txtMenu">Operasional</text>
                </button>
                <button className="menuSides" onClick={() => goHome('navikk')}>
                    <FaTasks size={20} className="iconSide" />
                    <text className="txtMenu">Ikhtisar Kas Kecil</text>
                </button>
                {(level === '4' || level === '14' || level === '5') && (
                    <button className="menuSides" onClick={() => goHome('verifven')}>
                        <MdOutlineDomainVerification size={20} className="iconSide" />
                        <text className="txtMenu">Pengajuan Data Vendor</text>
                    </button>
                )}
                {level === '1' || level === '4' || level === '14' ? (
                    <button className={stile.btnSide2} onClick={toggle}>
                        <FaDatabase size={20} className="mr-3"/>
                        Master
                        {/* {isOpen === true ? (
                        <MdKeyboardArrowDown size={20} className='arbtn' />
                        ) : (
                        <MdKeyboardArrowLeft size={20} className='arbtn' />
                        )} */}
                    </button>
                ) : (
                    <div></div>
                )}
                {level === '4' || level === '14' ? (
                    <Collapse isOpen={isOpen} className="ml-5 mt-3">
                        <button onClick={() => goHome('faktur')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Master Faktur
                        </button>
                        <button onClick={() => goHome('kpp')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Master KPP
                        </button>
                        <button onClick={() => goHome('taxcode')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Master Taxcode
                        </button>
                        <button onClick={() => goHome('vendor')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Master Vendor
                        </button>
                        <button onClick={() => goHome('tarif')} className={stile.btnSide}>
                            <FaTicketAlt size={20} className="mr-2"/>
                            Master VerifTax
                        </button>
                    </Collapse>
                ) : level === '1' && (
                    <Collapse isOpen={isOpen} className="ml-5 mt-3">
                        <button onClick={() => goHome('approval')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Setting Approval
                        </button>
                        <button onClick={() => goHome('reason')} className={stile.btnSide}>
                            <SiReason size={20} className="mr-2"/>
                            Master Alasan Reject
                        </button>
                        {/* <button onClick={() => goHome('depo')} className={stile.btnSide}>
                            <BsHouseDoor size={20} className="mr-2"/>
                            Master Area
                        </button> */}
                        <button onClick={() => goHome('bank')} className={stile.btnSide}>
                            <RiBankCardFill size={20} className="mr-2"/>
                            Master Bank
                        </button>
                        <button onClick={() => goHome('coa')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Master COA Klaim
                        </button>
                        <button onClick={() => goHome('dokumen')} className={stile.btnSide}>
                            <HiOutlineDocumentText size={20} className="mr-2"/>
                            Master Dokumen
                        </button>
                        <button onClick={() => goHome('email')} className={stile.btnSide}>
                            <AiOutlineMail size={20} className="mr-2"/>
                            Master Email
                        </button>
                        <button onClick={() => goHome('faktur')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Master Faktur
                        </button>
                        <button onClick={() => goHome('finance')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Master Finance
                        </button>
                        <button onClick={() => goHome('kliring')} className={stile.btnSide}>
                            <RiBankCardFill size={20} className="mr-2"/>
                            Master Kliring
                        </button>
                        <button onClick={() => goHome('kpp')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Master KPP
                        </button>
                        <button onClick={() => goHome('menu')} className={stile.btnSide}>
                            <AiOutlineMenu size={20} className="mr-2"/>
                            Master Menu
                        </button>
                        {/* <button onClick={() => goHome('pagu')} className={stile.btnSide}>
                            <RiBankCardFill size={20} className="mr-2"/>
                            Master Pagu
                        </button> */}
                        <button onClick={() => goHome('picklaim')} className={stile.btnSide}>
                            <FiUser size={20} className="mr-2"/>
                            Master PIC Klaim
                        </button>
                        {/* <button onClick={() => goHome('rekening')} className={stile.btnSide}>
                            <RiBankCardFill size={20} className="mr-2"/>
                            Master Rekening
                        </button> */}
                        <button onClick={() => goHome('spvklaim')} className={stile.btnSide}>
                            <FiUser size={20} className="mr-2"/>
                            Master SPV Klaim
                        </button>
                        <button onClick={() => goHome('taxcode')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Master Taxcode
                        </button>
                        <button onClick={() => goHome('user')} className={stile.btnSide}>
                            <FiUser size={20} className="mr-2"/>
                            Master User
                        </button>
                        <button onClick={() => goHome('vendor')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Master Vendor
                        </button>
                        <button onClick={() => goHome('tarif')} className={stile.btnSide}>
                            <FaTicketAlt size={20} className="mr-2"/>
                            Master VerifTax
                        </button>
                        
                        <button onClick={() => goHome('reservoir')} className={stile.btnSide}>
                            <BsClipboardData size={20} className="mr-2"/>
                            Reservoir
                        </button>
                    </Collapse>
                )}
                {/* <button className="menuSides" onClick={goReport}>
                    <FaFileArchive size={20} className="iconSide" />
                    <text className="txtMenu">Report</text>
                </button> */}
            </div>
        </div>
    )
}

export default Sidebar
