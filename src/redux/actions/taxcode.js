/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getTaxcode: (token) => ({
        type: 'GET_TAXCODE',
        payload: http(token).get(`/taxcode/all`),
    }),
    getAllTaxcode: (token, limit, search, page) => ({
        type: 'GET_ALL',
        payload: http(token).get(`/taxcode/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailTaxcode: (token, id) => ({
        type: 'DETAIL_TAXCODE',
        payload: http(token).get(`/taxcode/detail/${id}`),
    }),
    addTaxcode: (token, data) => ({
        type: 'ADD_TAXCODE',
        payload: http(token).post(`/taxcode/add`, qs.stringify(data))
    }),
    updateTaxcode: (token, data, id) => ({
        type: 'UPDATE_TAXCODE',
        payload: http(token).patch(`/taxcode/update/${id}`, qs.stringify(data))
    }),
    deleteTaxcode: (token, id) => ({
        type: 'DELETE_TAXCODE',
        payload: http(token).delete(`/taxcode/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_TAXCODE',
        payload: http(token).post(`/taxcode/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_TAXCODE',
        payload: http(token).get(`/taxcode/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_TAXCODE',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_TAXCODE'
    })
}
