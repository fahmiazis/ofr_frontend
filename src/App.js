import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import {connect} from "react-redux"
import auth from './redux/actions/auth'

import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import Notif from './pages/Notif'
import Dashboard from './pages/Dashboard'
//Klaim
import NavKlaim from './pages/Klaim/NavKlaim'
import Klaim from './pages/Klaim/Klaim'
import CartKlaim from './pages/Klaim/CartKlaim'
import VerifFinanceKlaim from './pages/Klaim/VerifFinanceKlaim'
import RevisiKlaim from './pages/Klaim/RevisiKlaim'
import ReportKlaim from './pages/Klaim/ReportKlaim'
import AjuanBayarKlaim from './pages/Klaim/AjuanBayarKlaim'

//Operasional
import NavOps from './pages/Operasional/NavOps'
import Operasional from './pages/Operasional/Operasional'
import CartOps from './pages/Operasional/CartOps'

//Master
import MasterDepo from './pages/Master/MasterDepo'
import MasterDokumen from './pages/Master/MasterDokumen'
import MasterCoa from './pages/Master/MasterCoa'
import MasterBank from './pages/Master/MasterBank'
import MasterUser from './pages/Master/MasterUser'
import Approve from './pages/Master/Approve'
import MasterMenu from './pages/Master/MasterMenu'
import MasterReason from './pages/Master/MasterReason'
import MasterRekening from './pages/Master/MasterRekening'

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
                <Route path='/tes' exact component={Tes} />
                <PrivateRoute path='/' exact>
                    <Home />
                </PrivateRoute>
                <PrivateRoute path='/dashboard'>
                    <Dashboard />
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
                <PrivateRoute path='/repklm'>
                    <ReportKlaim />
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
                <PrivateRoute path='/rekening'>
                    <MasterRekening />
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
