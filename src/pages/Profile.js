import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'

export default class Profile extends Component {
  render() {
    return (
      <>
        <div>
            <div className="h4">
                My Profile<span className="h6 text-secondary"><br /> Manage your profile information</span>
            </div>
            <hr />
            <div className="row">
                <div className="col-md-2 text-secondary">
                    <div className="sam d-flex justify-content-end">Name</div>
                    <div className="sam d-flex justify-content-end">Email</div>
                    <div className="sam d-flex justify-content-end">Phone number</div>
                    <div className="sam d-flex justify-content-end">Gender</div>
                    <div className="sam d-flex justify-content-end">Date of birth</div>
                </div>
                <div className="col-md-7">
                    <div className="for col-md-10">
                        <Input type="email" className="form-control" id="inputEmail3" placeholder="Name" />
                    </div>
                    <div className="for col-md-10">
                        <Input type="email" className="form-control" id="inputEmail3" placeholder="Email" />
                    </div>
                    <div className="fore col-md-10">
                        <Input type="email" className="form-control" id="inputEmail3" placeholder="+62" />
                    </div>
                    <div className="fore row">
                        <div className="col-md-4">
                            <div className="ping form-check">
                                <Input className="form-check-input" type="radio" name="gridRadios" value="option1" checked />
                                <label className="form-check-label text-secondary" for="gridRadios1">
                                Laki-laki
                                </label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <Input className="form-check-input" type="radio" name="gridRadios" value="option1" checked />
                                <label className="form-check-label text-secondary" for="gridRadios1">
                                Perempuan
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="fore row  no-gutters">
                            <div className="apin col-md-3">
                                <div className="form-group">
                                    <select id="inputState" className="form-control">
                                    <option selected>1</option>
                                    <option>...</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pin col-md-3">
                                <div className="form-group">
                                    <select id="inputState" className="form-control">
                                    <option selected>Januari</option>
                                    <option>...</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pin col-md-3">
                                <div className="form-group">
                                    <select id="inputState" className="form-control">
                                    <option selected>1994</option>
                                    <option>...</option>
                                    </select>
                                </div>
                            </div>
                    </div>
                    <button className="save btn btn-danger">Save</button>   
                </div>
                <div className="col-md-3">
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-10">
                            <div className="">
                                <img className="mage" src="./assets/img/profile1.png" alt="profile1" /><br /><br />
                                <button className="bol btn btn-outline-secondary btn-block text-secondary">Select image</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </>
    )
  }
}
