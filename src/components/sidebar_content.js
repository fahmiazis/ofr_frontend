import React, { useState } from "react";
import PropTypes from "prop-types";
import MaterialTitlePanel from "./material_title_panel";
import { Collapse } from 'reactstrap';
import logo from '../assets/img/logo.png'
import { FaDatabase, FaHome, FaFileArchive, FaCartPlus, FaRecycle, FaTasks, } from 'react-icons/fa'
import { RiArrowLeftRightFill, RiMoneyDollarCircleFill } from 'react-icons/ri'
import { HiOutlineDocumentText } from 'react-icons/hi'
import {RiBankCardFill} from 'react-icons/ri'
import { SiReason } from 'react-icons/si'
import {FiLogOut, FiUser, FiUsers, FiMail} from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { BsClipboardData, BsHouseDoor, BsFileCheck } from 'react-icons/bs'
import { GiFamilyTree } from 'react-icons/gi'
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from 'react-icons/md'
import { AiOutlineMenu, AiFillDashboard } from 'react-icons/ai'
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
        <button className={stile.btnSide} onClick={() => goHome('navklaim')}>
          <FaCartPlus size={20} className="mr-2" />
          <text className={stile.txtSide}>Klaim</text>
        </button>
        <button className={stile.btnSide} onClick={() => goHome('navops')}>
            <FaRecycle size={20} className="mr-2" />
            <text className={stile.txtSide}>Operasional</text>
        </button>
        <button className={level === '1' ? stile.btnSide : stile.marginSide} onClick={() => goHome('navikk')} >
            <FaTasks size={20} className="mr-2" />
            <text className={stile.txtSide}>Ikhtisar Kas Kecil</text>
        </button>
        {level === '1' ? (
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
        <Collapse isOpen={isOpen} className="ml-4">
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
          <button onClick={() => goHome('rekening')} className={stile.btnSide}>
            <RiBankCardFill size={20} className="mr-2"/>
            Master Rekening
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