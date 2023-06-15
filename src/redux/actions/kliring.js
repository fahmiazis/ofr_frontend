/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getKliring: (token) => ({
        type: 'GET_KLIRING',
        payload: http(token).get(`/kliring/all`),
    }),
    getAllKliring: (token, limit, search, page) => ({
        type: 'GET_ALL',
        payload: http(token).get(`/kliring/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailKliring: (token, id) => ({
        type: 'DETAIL_KLIRING',
        payload: http(token).get(`/kliring/detail/${id}`),
    }),
    addKliring: (token, data) => ({
        type: 'ADD_KLIRING',
        payload: http(token).post(`/kliring/add`, qs.stringify(data))
    }),
    updateKliring: (token, data, id) => ({
        type: 'UPDATE_KLIRING',
        payload: http(token).patch(`/kliring/update/${id}`, qs.stringify(data))
    }),
    deleteKliring: (token, id) => ({
        type: 'DELETE_KLIRING',
        payload: http(token).delete(`/kliring/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_KLIRING',
        payload: http(token).post(`/kliring/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_KLIRING',
        payload: http(token).get(`/kliring/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_KLIRING',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_KLIRING'
    })
}
