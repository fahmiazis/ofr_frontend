/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getFinance: (token) => ({
        type: 'GET_FINANCE',
        payload: http(token).get(`/finance/all`),
    }),
    getFinRek: (token, tipe) => ({
        type: 'GET_FINREK',
        payload: http(token).get(`/finance/rek?tipe=${tipe}`),
    }),
    getAllFinance: (token, limit, search, page) => ({
        type: 'GET_ALL',
        payload: http(token).get(`/finance/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailFinance: (token, id) => ({
        type: 'DETAIL_FINANCE',
        payload: http(token).get(`/finance/detail/${id}`),
    }),
    addFinance: (token, data) => ({
        type: 'ADD_FINANCE',
        payload: http(token).post(`/finance/add`, qs.stringify(data))
    }),
    updateFinance: (token, data, id) => ({
        type: 'UPDATE_FINANCE',
        payload: http(token).patch(`/finance/update/${id}`, qs.stringify(data))
    }),
    deleteFinance: (token, id) => ({
        type: 'DELETE_FINANCE',
        payload: http(token).delete(`/finance/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_FINANCE',
        payload: http(token).post(`/finance/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_FINANCE',
        payload: http(token).get(`/finance/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_FINANCE',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_FINANCE'
    })
}
