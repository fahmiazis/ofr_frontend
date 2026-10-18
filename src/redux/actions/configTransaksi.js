/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'

export default {
    getConfig: (token, limit, search, page) => ({
        type: 'GET_CONFIG_TRANSAKSI',
        payload: http(token).get(`/configtrans/get?limit=${limit}&search=${encodeURIComponent(search || '')}&page=${page === undefined ? 1 : page}`)
    }),
    nextPage: (token, link) => ({
        type: 'GET_CONFIG_TRANSAKSI',
        payload: http(token).get(`${link}`)
    }),
    getOptions: (token) => ({
        type: 'GET_OPTION_CONFIG_TRANSAKSI',
        payload: http(token).get(`/configtrans/options`)
    }),
    addConfig: (token, data) => ({
        type: 'SAVE_CONFIG_TRANSAKSI',
        payload: http(token).post(`/configtrans/add`, data)
    }),
    updateConfig: (token, id, data) => ({
        type: 'SAVE_CONFIG_TRANSAKSI',
        payload: http(token).patch(`/configtrans/update/${id}`, data)
    }),
    deleteConfig: (token, id) => ({
        type: 'DELETE_CONFIG_TRANSAKSI',
        payload: http(token).delete(`/configtrans/del/${id}`)
    })
}
