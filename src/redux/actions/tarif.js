/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getTarif: (token) => ({
        type: 'GET_TARIF',
        payload: http(token).get(`/tarif/all`),
    }),
    getAllTarif: (token, limit, search, page) => ({
        type: 'GET_ALL_TARIF',
        payload: http(token).get(`/tarif/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailTarif: (token, id) => ({
        type: 'DETAIL_TARIF',
        payload: http(token).get(`/tarif/detail/${id}`)
    }),
    addTarif: (token, data) => ({
        type: 'ADD_TARIF',
        payload: http(token).post(`/tarif/add`, qs.stringify(data))
    }),
    updateTarif: (token, data, id) => ({
        type: 'UPDATE_TARIF',
        payload: http(token).patch(`/tarif/update/${id}`, qs.stringify(data))
    }),
    deleteTarif: (token, id) => ({
        type: 'DELETE_TARIF',
        payload: http(token).delete(`/tarif/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_TARIF',
        payload: http(token).post(`/tarif/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_TARIF',
        payload: http(token).get(`/tarif/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_TARIF',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_TARIF'
    })
}
