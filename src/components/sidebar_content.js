import React, { useState } from "react";
import PropTypes from "prop-types";
import MaterialTitlePanel from "./material_title_panel";
import { Collapse } from 'reactstrap';
import logo from '../assets/img/logo.png'
import { FaDatabase, FaHome, FaCashRegister, FaHandshake, FaRecycle, FaTasks, FaTicketAlt} from 'react-icons/fa'
import { RiArrowLeftRightFill, RiMoneyDollarCircleFill } from 'react-icons/ri'
import { HiOutlineDocumentText } from 'react-icons/hi'
import {RiBankCardFill} from 'react-icons/ri'
import { SiReason } from 'react-icons/si'
import {FiLogOut, FiUser, FiUsers, FiMail, FiTruck} from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { BsClipboardData, BsHouseDoor, BsFileCheck } from 'react-icons/bs'
import { GiFamilyTree } from 'react-icons/gi'
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from 'react-icons/md'
import { AiOutlineMenu, AiFillDashboard, AiOutlineMail } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import logoutAction from '../redux/actions/auth'
import stile from '../assets/css/input.module.css'

const styles = {
  sidebar: {
    width: 350,
    height: "100%",
    backgroundColor: "#9A1353"
  },
  sidebarLink: {
    display: "block",
    padding: "16px 0px",
    color: "white",
    textDecoration: "none",
    fontSize: "15px"
  },
  divider: {
    margin: "8px 0",
    height: 1,
    backgroundColor: "#9A1353"
  },
  content: {
    // padding: "16px",
    // height: "60%",
    height: "auto",
    backgroundColor: "#9A1353"
  }
};

const SidebarContent = props => {
  const style = props.style
    ? { ...styles.sidebar, ...props.style }
    : styles.sidebar;

  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [openDoc, setOpenDoc] = useState(false);
  const [openSet, setOpenSet] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const modalOpen = () => setOpenDoc(!openDoc)
  const modalSet = () => setOpenSet(!openSet)

  const history = useHistory()

  function goHome(route) {
    history.push(`/${route}`)
  }

  function logout() {
    dispatch(logoutAction.logout())
    history.push('/login')
  }

  const level = localStorage.getItem('level')

  return (
    <MaterialTitlePanel title="" style={style}>
      <div style={styles.content}>
        <div className={stile.divSide}>
          <img src={logo} className={stile.imgSide}/>
        </div>
        <button onClick={() => goHome('')} className={stile.btnSideTop}>
            <FaHome size={20} className="mr-2"/>
            <text className={stile.txtSide}>Home</text>
        </button>
        <button onClick={() => goHome('dashboard')} className={stile.btnSideTop}>
            <AiFillDashboard size={20} className="mr-2"/>
            <text className={stile.txtSide}>Dashboard</text>
        </button>
        {level !== '4' && level !== '14' && (
          <button className={stile.btnSide} onClick={() => goHome('navklaim')}>
            <FaHandshake size={20} className="mr-2" />
            <text className={stile.txtSide}>Klaim</text>
          </button>
        )}
        <button className={stile.btnSide} onClick={() => goHome('navkasbon')}>
          <FaCashRegister size={20} className="mr-2" />
          <text className={stile.txtSide}>Kasbon</text>
        </button>
        <button className={stile.btnSide} onClick={() => goHome('navops')}>
           <FiTruck size={20} className="mr-2" />
            <text className={stile.txtSide}>Operasional</text>
        </button>
        <button className={level === '1' || level === '4' || level === '14' || level === '5' ? stile.btnSide : stile.marginSide} onClick={() => goHome('navikk')} >
            <FaTasks size={20} className="mr-2" />
            <text className={stile.txtSide}>Ikhtisar Kas Kecil</text>
        </button>
        {(level === '4' || level === '14' || level === '5') && (
            <button className={level === '4' || level === '14' ? stile.btnSide : stile.marginSide} onClick={() => goHome('verifven')} >
                <FaTasks size={20} className="mr-2" />
                <text className={stile.txtSide}>Pengajuan Data Vendor</text>
            </button>
        )}
        {level === '1' || level === '4' ? (
          <button className={isOpen === true ? [stile.btnSide1] : [stile.btnSide3]} onClick={toggle}>
            <div>
              <FaDatabase size={20} className="mr-2"/> Master
            </div>
            {/* {isOpen === true ? (
              <MdKeyboardArrowDown size={20} />
            ) : (
              <MdKeyboardArrowLeft size={20} />
            )} */}
          </button>
        ) : (
          <div></div>
        )}
        {level === '4' || level === '14' ? (
          <Collapse isOpen={isOpen} className="ml-4 mb-3">
            
            <button onClick={() => goHome('faktur')} className={stile.btnSide}>
              <BsClipboardData size={20} className="mr-2"/>
              Master Faktur
            </button>
            <button onClick={() => goHome('kpp')} className={stile.btnSide}>
              <BsClipboardData size={20} className="mr-2"/>
              Master Kpp
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
          <Collapse isOpen={isOpen} className="ml-4">
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
              Master Kpp
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
        {/* <button onClick={() => goHome('report')} className={level === '1' ? stile.marginSide : level === '2' ? stile.marginSide : stile.marginSide}>
            <FaFileArchive size={20} className="mr-2"/> Report
        </button> */}
      </div>
    </MaterialTitlePanel>
  );
};

SidebarContent.propTypes = {
  style: PropTypes.object
};

export default SidebarContent;