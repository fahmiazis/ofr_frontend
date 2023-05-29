/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getKpp: (token) => ({
        type: 'GET_KPP',
        payload: http(token).get(`/kpp/all`),
    }),
    getAllKpp: (token, limit, search, page) => ({
        type: 'GET_ALL_KPP',
        payload: http(token).get(`/kpp/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailKpp: (token, id) => ({
        type: 'DETAIL_KPP',
        payload: http(token).get(`/kpp/detail/${id}`)
    }),
    addKpp: (token, data) => ({
        type: 'ADD_KPP',
        payload: http(token).post(`/kpp/add`, qs.stringify(data))
    }),
    updateKpp: (token, data, id) => ({
        type: 'UPDATE_KPP',
        payload: http(token).patch(`/kpp/update/${id}`, qs.stringify(data))
    }),
    deleteKpp: (token, id) => ({
        type: 'DELETE_KPP',
        payload: http(token).delete(`/kpp/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_KPP',
        payload: http(token).post(`/kpp/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_KPP',
        payload: http(token).get(`/kpp/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_KPP',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_KPP'
    })
}
