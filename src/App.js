import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import {connect} from "react-redux"
import auth from './redux/actions/auth'

import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import Tespeng from './pages/Pengadaan2'
import EditEksekusi from './pages/EditEksekusi'
import NavStock from './pages/NavStock'
import Sidebar from './components/Sidebar'
import Notif from './pages/Notif'
import TrackingStock from './pages/TrackingStock'
//Klaim
import NavKlaim from './pages/NavKlaim'
import Klaim from './pages/Klaim'
import CartKlaim from './pages/CartKlaim'
import VerifFinanceKlaim from './pages/VerifFinanceKlaim'
import RevisiKlaim from './pages/RevisiKlaim'

//Operasional
import NavOps from './pages/NavOps'
import Operasional from './pages/Operasional'
import CartOps from './pages/CartOps'

//Master
import MasterDepo from './pages/MasterDepo'
import MasterDokumen from './pages/MasterDokumen'
import MasterCoa from './pages/MasterCoa'
import MasterBank from './pages/MasterBank'
import MasterUser from './pages/MasterUser'
import Approve from './pages/Approve'
import MasterMenu from './pages/MasterMenu'
import MasterReason from './pages/MasterReason'

//For Tes
import Tes from './pages/Tes'

class App extends Component {

    componentDidMount(){
        if (localStorage.getItem('token')) {
            this.props.setToken(localStorage.getItem('token'))  
        }
    }

    render() {
        return (
        <BrowserRouter>
            <Switch>
                <Route path='/login' exact component={Login} />
                <Route path='/side' exact component={Sidebar} />
                <Route path='/tes' exact component={Tes} />
                <PrivateRoute path='/' exact>
                    <Home />
                </PrivateRoute>
                <PrivateRoute path='/pengadaan'>
                    <Tespeng />
                </PrivateRoute>
                <PrivateRoute path='/navstock'>
                    <NavStock />
                </PrivateRoute>
                <PrivateRoute path='/editeks'>
                    <EditEksekusi />
                </PrivateRoute>
                <PrivateRoute path='/trackstock'>
                    <TrackingStock />
                </PrivateRoute>
                <PrivateRoute path='/notif'>
                    <Notif />
                </PrivateRoute>

                {/* Klaim */}
                <PrivateRoute path='/navklaim'>
                    <NavKlaim />
                </PrivateRoute>
                <PrivateRoute path='/klaim'>
                    <Klaim />
                </PrivateRoute>
                <PrivateRoute path='/cartklaim'>
                    <CartKlaim />
                </PrivateRoute>
                <PrivateRoute path='/veriffinklm'>
                    <VerifFinanceKlaim />
                </PrivateRoute>
                <PrivateRoute path='/revklm'>
                    <RevisiKlaim />
                </PrivateRoute>

                {/* Operasional */}
                <PrivateRoute path='/navops'>
                    <NavOps />
                </PrivateRoute>
                <PrivateRoute path='/ops'>
                    <Operasional />
                </PrivateRoute>
                <PrivateRoute path='/cartops'>
                    <CartOps />
                </PrivateRoute>

                {/* Master */}
                <PrivateRoute path='/approval'>
                    <Approve />
                </PrivateRoute>
                <PrivateRoute path='/depo'>
                    <MasterDepo />
                </PrivateRoute>
                <PrivateRoute path='/user'>
                    <MasterUser />
                </PrivateRoute>
                <PrivateRoute path='/coa'>
                    <MasterCoa />
                </PrivateRoute>
                <PrivateRoute path='/bank'>
                    <MasterBank />
                </PrivateRoute>
                <PrivateRoute path='/menu'>
                    <MasterMenu />
                </PrivateRoute>
                <PrivateRoute path='/reason'>
                    <MasterReason />
                </PrivateRoute>
                <PrivateRoute path='/dokumen'>
                    <MasterDokumen />
                </PrivateRoute>

            </Switch>
        </BrowserRouter>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})
  
const mapDispatchToProps = {
    setToken: auth.setToken
}
  
export default connect(mapStateToProps, mapDispatchToProps)(App)
