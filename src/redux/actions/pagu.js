/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getPagu: (token, tipe) => ({
        type: 'GET_PAGU',
        payload: http(token).get(`/pagu/all`),
    }),
    getAllPagu: (token, limit, search, page) => ({
        type: 'GET_ALL_PAGU',
        payload: http(token).get(`/pagu/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailPagu: (token, id) => ({
        type: 'DETAIL_PAGU',
        payload: http(token).get(`/pagu/detail/${id}`),
    }),
    addPagu: (token, data) => ({
        type: 'ADD_PAGU',
        payload: http(token).post(`/pagu/add`, qs.stringify(data))
    }),
    updatePagu: (token, data, id) => ({
        type: 'UPDATE_PAGU',
        payload: http(token).patch(`/pagu/update/${id}`, qs.stringify(data))
    }),
    deletePagu: (token, id) => ({
        type: 'DELETE_PAGU',
        payload: http(token).delete(`/pagu/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_PAGU',
        payload: http(token).post(`/pagu/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_PAGU',
        payload: http(token).get(`/pagu/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_PAGU',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_PAGU'
    })
}
