/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
// src/redux/actions/auth.js
import http from '../../helpers/http'
import qs from 'qs'

const getToken = () => localStorage.getItem('token')

export default {
  login: (data) => ({
    type: 'AUTH_USER',
    payload: http().post(`/auth/login`, qs.stringify({
      ...data,
      device_info: navigator.userAgent
    }))
  }),

  refreshToken: () => ({
    type: 'REFRESH_TOKEN',
    payload: http().post(`/auth/refresh`, {
      refresh_token: localStorage.getItem('refresh_token')
    })
  }),

  logout: () => {
    http().post('/auth/logout', {
      refresh_token: localStorage.getItem('refresh_token')
    }).catch(() => {})
    return { type: 'LOGOUT' }
  },

  logoutAll: () => {
    http().post('/auth/logout-all').catch(() => {})
    return { type: 'LOGOUT' }
  },

  setToken: (token) => ({
    type: 'SET_TOKEN',
    payload: { token }
  }),

  resetError: () => ({ type: 'RESET' }),
  goRoute: () => ({ type: 'ROUTE' })
}