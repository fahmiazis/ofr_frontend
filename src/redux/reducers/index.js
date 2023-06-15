import {combineReducers} from 'redux'
import { persistReducer } from "redux-persist";

import auth from './auth'
//master
import user from './user'
import approve from './approve'
import depo from './depo'
import coa from './coa'
import bank from './bank'
import menu from './menu'
import reason from './reason'
import dokumen from './dokumen'
import rekening from './rekening'
import tarif from './tarif'
import pagu from './pagu'
import email from './email'
import vendor from './vendor'
import kliring from './kliring'
import faktur from './faktur'
import kpp from './kpp'
import finance from './finance'
//transaksi
import klaim from './klaim'
import ikk from './ikk'
import ops from './ops'

export default combineReducers({
  auth,
  user,
  approve,
  depo,
  coa,
  bank,
  klaim,
  menu,
  ops,
  reason,
  dokumen,
  rekening,
  ikk,
  tarif,
  pagu,
  email,
  vendor,
  faktur,
  kpp,
  kliring,
  finance
})
