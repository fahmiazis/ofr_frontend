import {combineReducers} from 'redux'
import { persistReducer } from "redux-persist";

import auth from './auth'
import user from './user'
import approve from './approve'
import depo from './depo'
import coa from './coa'
import bank from './bank'
import menu from './menu'
import reason from './reason'
import dokumen from './dokumen'
import rekening from './rekening'
import klaim from './klaim'
import operasional from './operasional'

export default combineReducers({
  auth,
  user,
  approve,
  depo,
  coa,
  bank,
  klaim,
  menu,
  operasional,
  reason,
  dokumen,
  rekening
})
