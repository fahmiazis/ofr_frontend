/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getCoa: (token, tipe) => ({
        type: 'GET_COA',
        payload: http(token).get(`/coa/all/${tipe}`),
    }),
    getAllCoa: (token, limit, search, page) => ({
        type: 'GET_ALL',
        payload: http(token).get(`/coa/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailCoa: (token, id) => ({
        type: 'DETAIL_COA',
        payload: http(token).get(`/coa/detail/${id}`),
    }),
    addCoa: (token, data) => ({
        type: 'ADD_COA',
        payload: http(token).post(`/coa/add`, qs.stringify(data))
    }),
    updateCoa: (token, data, id) => ({
        type: 'UPDATE_COA',
        payload: http(token).patch(`/coa/update/${id}`, qs.stringify(data))
    }),
    deleteCoa: (token, id) => ({
        type: 'DELETE_COA',
        payload: http(token).delete(`/coa/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_COA',
        payload: http(token).post(`/coa/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_COA',
        payload: http(token).get(`/coa/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_COA',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_COA'
    })
}
