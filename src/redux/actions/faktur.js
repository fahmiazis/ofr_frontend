/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getFaktur: (token, data) => ({
        type: 'GET_FAKTUR',
        payload: http(token).patch(`/faktur/all`, qs.stringify(data)),
    }),
    getAllFaktur: (token, limit, search, page) => ({
        type: 'GET_ALL',
        payload: http(token).get(`/faktur/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailFaktur: (token, id) => ({
        type: 'DETAIL_FAKTUR',
        payload: http(token).get(`/faktur/detail/${id}`),
    }),
    addFaktur: (token, data) => ({
        type: 'ADD_FAKTUR',
        payload: http(token).post(`/faktur/add`, qs.stringify(data))
    }),
    updateFaktur: (token, data, id) => ({
        type: 'UPDATE_FAKTUR',
        payload: http(token).patch(`/faktur/update/${id}`, qs.stringify(data))
    }),
    deleteFaktur: (token, id) => ({
        type: 'DELETE_FAKTUR',
        payload: http(token).delete(`/faktur/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_FAKTUR',
        payload: http(token).post(`/faktur/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_FAKTUR',
        payload: http(token).get(`/faktur/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_FAKTUR',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_FAKTUR'
    })
}
