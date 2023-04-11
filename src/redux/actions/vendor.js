/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getVendor: (token, tipe) => ({
        type: 'GET_VENDOR',
        payload: http(token).get(`/vendor/all/${tipe}`),
    }),
    getAllVendor: (token, limit, search, page) => ({
        type: 'GET_ALL',
        payload: http(token).get(`/vendor/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailVendor: (token, id) => ({
        type: 'DETAIL_VENDOR',
        payload: http(token).get(`/vendor/detail/${id}`),
    }),
    addVendor: (token, data) => ({
        type: 'ADD_VENDOR',
        payload: http(token).post(`/vendor/add`, qs.stringify(data))
    }),
    updateVendor: (token, data, id) => ({
        type: 'UPDATE_VENDOR',
        payload: http(token).patch(`/vendor/update/${id}`, qs.stringify(data))
    }),
    deleteVendor: (token, id) => ({
        type: 'DELETE_VENDOR',
        payload: http(token).delete(`/vendor/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_VENDOR',
        payload: http(token).post(`/vendor/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_VENDOR',
        payload: http(token).get(`/vendor/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_VENDOR',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_VENDOR'
    })
}
