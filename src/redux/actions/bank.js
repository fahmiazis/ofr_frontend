/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getBank: (token) => ({
        type: 'GET_BANK',
        payload: http(token).get(`/bank/all`),
    }),
    getAllBank: (token, limit, search, page) => ({
        type: 'GET_ALL',
        payload: http(token).get(`/bank/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailBank: (token, id) => ({
        type: 'DETAIL_BANK',
        payload: http(token).get(`/bank/detail/${id}`)
    }),
    addBank: (token, data) => ({
        type: 'ADD_BANK',
        payload: http(token).post(`/bank/add`, qs.stringify(data))
    }),
    updateBank: (token, data, id) => ({
        type: 'UPDATE_BANK',
        payload: http(token).patch(`/bank/update/${id}`, qs.stringify(data))
    }),
    deleteBank: (token, id) => ({
        type: 'DELETE_BANK',
        payload: http(token).delete(`/bank/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_BANK',
        payload: http(token).post(`/bank/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_BANK',
        payload: http(token).get(`/bank/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_BANK',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_BANK'
    })
}
