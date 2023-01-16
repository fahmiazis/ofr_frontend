import React, { Component, useState } from 'react'
import logo from '../assets/img/logo.png'
import { Collapse } from 'reactstrap';
import {AiFillHome} from 'react-icons/ai'
import { FaDatabase, FaHome, FaFileArchive, FaCartPlus, FaRecycle, FaTasks, FaHandshake} from 'react-icons/fa'
import { RiArrowLeftRightFill, RiMoneyDollarCircleFill } from 'react-icons/ri'
import { HiOutlineDocumentText } from 'react-icons/hi'
import {RiBankCardFill} from 'react-icons/ri'
import {FiLogOut, FiUser, FiUsers, FiMail, FiSettings, FiTruck} from 'react-icons/fi'
import { SiReason } from 'react-icons/si'
import { BsClipboardData, BsHouseDoor, BsFileCheck } from 'react-icons/bs'
import { GiFamilyTree } from 'react-icons/gi'
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from 'react-icons/md'
import { AiFillSetting, AiOutlineClockCircle, AiOutlineUnlock, AiOutlineMenu } from 'react-icons/ai'
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
                <button className="menuSides" onClick={() => goHome('navklaim')}>
                    <FaHandshake size={20} className="iconSide" />
                    <text className="txtMenu">Klaim</text>
                </button>
                <button className="menuSides" onClick={() => goHome('navops')}>
                    <FiTruck size={20} className="iconSide" />
                    <text className="txtMenu">Operasional</text>
                </button>
                <button className="menuSides" onClick={() => goHome('navikk')}>
                    <FaTasks size={20} className="iconSide" />
                    <text className="txtMenu">Ikhtisar Kas Kecil</text>
                </button>
                {level === '1' || level === 1 ? (
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
                <Collapse isOpen={isOpen} className="ml-5 mt-3">
                {/* <button onClick={() => goHome('alasan')} className={stile.btnSide}>
                    <RiFileUnknowLine size={20} className="mr-2"/>
                    Master Alasan
                </button> */}
                <button onClick={() => goHome('depo')} className={stile.btnSide}>
                    <BsHouseDoor size={20} className="mr-2"/>
                    Master Depo
                </button>
                <button onClick={() => goHome('user')} className={stile.btnSide}>
                    <FiUser size={20} className="mr-2"/>
                    Master User
                </button>
                <button onClick={() => goHome('bank')} className={stile.btnSide}>
                    <RiBankCardFill size={20} className="mr-2"/>
                    Master Bank
                </button>
                <button onClick={() => goHome('menu')} className={stile.btnSide}>
                    <AiOutlineMenu size={20} className="mr-2"/>
                    Master Menu
                </button>
                <button onClick={() => goHome('reason')} className={stile.btnSide}>
                    <SiReason size={20} className="mr-2"/>
                    Master Alasan
                </button>
                <button onClick={() => goHome('dokumen')} className={stile.btnSide}>
                    <HiOutlineDocumentText size={20} className="mr-2"/>
                    Master Dokumen
                </button>
                <button onClick={() => goHome('coa')} className={stile.btnSide}>
                    <BsClipboardData size={20} className="mr-2"/>
                    Master COA
                </button>
                </Collapse>
                {/* <button className="menuSides" onClick={goReport}>
                    <FaFileArchive size={20} className="iconSide" />
                    <text className="txtMenu">Report</text>
                </button> */}
            </div>
        </div>
    )
}

export default Sidebar
