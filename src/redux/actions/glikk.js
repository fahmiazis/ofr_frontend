/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getGlikk: (token, tipe) => ({
        type: 'GET_GLIKK',
        payload: http(token).get(`/glikk/all/${tipe}`),
    }),
    getAllGlikk: (token, limit, search, page) => ({
        type: 'GET_ALLGLIKK',
        payload: http(token).get(`/glikk/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailGlikk: (token, id) => ({
        type: 'DETAIL_GLIKK',
        payload: http(token).get(`/glikk/detail/${id}`),
    }),
    addGlikk: (token, data) => ({
        type: 'ADD_GLIKK',
        payload: http(token).post(`/glikk/add`, qs.stringify(data))
    }),
    updateGlikk: (token, data, id) => ({
        type: 'UPDATE_GLIKK',
        payload: http(token).patch(`/glikk/update/${id}`, qs.stringify(data))
    }),
    deleteGlikk: (token, id) => ({
        type: 'DELETE_GLIKK',
        payload: http(token).delete(`/glikk/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_GLIKK',
        payload: http(token).post(`/glikk/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_GLIKK',
        payload: http(token).get(`/glikk/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_GLIKK',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_GLIKK'
    })
}
