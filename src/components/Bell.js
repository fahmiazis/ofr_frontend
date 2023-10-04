import React from 'react'
import {BsBell, BsFillCircleFill} from 'react-icons/bs'
import { Input, Button, UncontrolledDropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody } from 'reactstrap'
import style from '../assets/css/input.module.css'
import {FaBars, FaFileSignature, FaUserCircle} from 'react-icons/fa'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'


export default function Bell({dataNotif, color}) {
    const dispatch = useDispatch()
    const history = useHistory()

    async function goRoute(val) {
        const token = localStorage.getItem('token')
        if (val === 'notif') {
            history.push(`/${val}`)
        } else {
            const data = {
                route: val.routes, 
                type: val.tipe, 
                item: val
            }
            const route = val.routes
            history.push({
                pathname: `/${route}`,
                state: data
            })
        }
    }

  return (
    <UncontrolledDropdown>
        <DropdownToggle nav>
            <div className={style.optionType}>
                <BsBell size={30} className={color === undefined ? 'white' : color} />
                {dataNotif.find(({status}) => status === null) !== undefined ? (
                    <BsFillCircleFill className="red ball" size={10} />
                ) : (
                    <div></div>
                ) }
            </div>
        </DropdownToggle>
        <DropdownMenu right
            modifiers={{
                setMaxHeight: {
                    enabled: true,
                    order: 890,
                    fn: (data) => {
                    return {
                        ...data,
                        styles: {
                        ...data.styles,
                        overflow: 'auto',
                        maxHeight: '600px',
                        },
                    };
                    },
                },
            }}>
            <DropdownItem>
                <div className='allnotif' onClick={() => goRoute('notif')}>
                    See all notifications
                </div>        
            </DropdownItem>
            {dataNotif.length > 0 ? (
                dataNotif.map(item => {
                    return (
                        <DropdownItem 
                            onClick={() => goRoute(item)}
                        >
                            <div className={style.notif}>
                                <FaFileSignature size={90} className="mr-4"/>
                                <Button className="labelBut" color={item.status === null ? "danger" : "success"} size="sm">{item.status === null ? 'unread' : 'read'}</Button>
                                <div>
                                    <div className="textNotif">{item.proses} ({item.tipe})</div>
                                    <div className="textNotif">No transaksi: {item.no_transaksi}</div>
                                    <div>{moment(item.createdAt).format('LLL')}</div>
                                </div>
                            </div>
                            <hr/>
                        </DropdownItem>
                    )
                })
            ) : (
                <DropdownItem>
                    <div className={style.grey}>
                        You don't have any notifications 
                    </div>        
                </DropdownItem>
            )}
        </DropdownMenu>
    </UncontrolledDropdown>
  )
}
