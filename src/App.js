import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import {connect} from "react-redux"
import auth from './redux/actions/auth'

import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import Notif from './pages/Notif'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

//Klaim
import NavKlaim from './pages/Klaim/NavKlaim'
import Klaim from './pages/Klaim/Klaim'
import CartKlaim from './pages/Klaim/CartKlaim'
import VerifFinanceKlaim from './pages/Klaim/VerifFinanceKlaim'
import RevisiKlaim from './pages/Klaim/RevisiKlaim'
import ReportKlaim from './pages/Klaim/ReportKlaim'
import AjuanBayarKlaim from './pages/Klaim/AjuanBayarKlaim'
import KlaimFaa from './components/Klaim/FAA'
import KlaimFpd from './components/Klaim/FPD'

//Operasional
import NavOps from './pages/Ops/NavOps'
import Operasional from './pages/Ops/Operasional'
import CartOps from './pages/Ops/CartOps'
import VerifFinanceTax from './pages/Ops/VerifFinanceTax'
import AjuanBayarOps from './pages/Ops/AjuanBayarOps'
import ReportOps from './pages/Ops/ReportOps'
import RevisiOps from './pages/Ops/RevisiOps'
import OpsFaa from './components/Ops/FAA'
import OpsFpd from './components/Ops/FPD'
import ReportTaxOps from './pages/Ops/ReportTax'

//Ikk
import NavIkk from './pages/IKK/NavIkk'
import Ikk from './pages/IKK/Ikk'
import CartIkk from './pages/IKK/CartIkk'
import RevisiIkk from './pages/IKK/RevisiIkk'
import VerifFinanceIkk from './pages/IKK/VerifFinanceIkk'
import AjuanBayarIkk from './pages/IKK/AjuanBayarIkk'
import ReportIkk from './pages/IKK/ReportIkk'
import IkkFaa from './components/Ikk/formikk'
import IkkFpd from './components/Ikk/FPD'
import ReportTaxIkk from './pages/IKK/ReportTax'

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
import MasterTarif from './pages/Master/MasterTarif'
import MasterPagu from './pages/Master/MasterPagu'
import MasterEmail from './pages/Master/MasterEmail'
import MasterVendor from './pages/Master/MasterVendor'
import MasterFaktur from './pages/Master/MasterFaktur'
import MasterKpp from './pages/Master/MasterKpp'

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
                <PrivateRoute path='/profile'>
                    <Profile />
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
                <PrivateRoute path='/listklm'>
                    <AjuanBayarKlaim />
                </PrivateRoute>
                <PrivateRoute path='/klmfaa'>
                    <KlaimFaa/>
                </PrivateRoute>
                <PrivateRoute path='/klmfpd'>
                    <KlaimFpd/>
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
                <PrivateRoute path='/veriffintax'>
                    <VerifFinanceTax />
                </PrivateRoute>
                <PrivateRoute path='/listops'>
                    <AjuanBayarOps />
                </PrivateRoute>
                <PrivateRoute path='/revops'>
                    <RevisiOps/>
                </PrivateRoute>
                <PrivateRoute path='/repops'>
                    <ReportOps/>
                </PrivateRoute>
                <PrivateRoute path='/reptaxops'>
                    <ReportTaxOps/>
                </PrivateRoute>
                <PrivateRoute path='/opsfaa'>
                    <OpsFaa/>
                </PrivateRoute>
                <PrivateRoute path='/opsfpd'>
                    <OpsFpd/>
                </PrivateRoute>

                {/* IKK */}
                <PrivateRoute path='/navikk'>
                    <NavIkk />
                </PrivateRoute>
                <PrivateRoute path='/ikk'>
                    <Ikk />
                </PrivateRoute>
                <PrivateRoute path='/cartikk'>
                    <CartIkk />
                </PrivateRoute>
                <PrivateRoute path='/revikk'>
                    <RevisiIkk />
                </PrivateRoute>
                <PrivateRoute path='/veriffinikk'>
                    <VerifFinanceIkk />
                </PrivateRoute>
                <PrivateRoute path='/listikk'>
                    <AjuanBayarIkk />
                </PrivateRoute>
                <PrivateRoute path='/repikk'>
                    <ReportIkk/>
                </PrivateRoute>
                <PrivateRoute path='/reptaxikk'>
                    <ReportTaxIkk/>
                </PrivateRoute>
                <PrivateRoute path='/ikkfaa'>
                    <IkkFaa/>
                </PrivateRoute>
                <PrivateRoute path='/ikkfpd'>
                    <IkkFpd/>
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
                <PrivateRoute path='/tarif'>
                    <MasterTarif />
                </PrivateRoute>
                <PrivateRoute path='/pagu'>
                    <MasterPagu />
                </PrivateRoute>
                <PrivateRoute path='/email'>
                    <MasterEmail />
                </PrivateRoute>
                <PrivateRoute path='/vendor'>
                    <MasterVendor />
                </PrivateRoute>
                <PrivateRoute path='/faktur'>
                    <MasterFaktur />
                </PrivateRoute>
                <PrivateRoute path='/kpp'>
                    <MasterKpp />
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
