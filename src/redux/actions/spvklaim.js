/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getSpvklaim: (token) => ({
        type: 'GET_SPVKLAIM',
        payload: http(token).get(`/spvklaim/all`),
    }),
    getAllSpvklaim: (token, limit, search, page) => ({
        type: 'GET_ALL_SPVKLAIM',
        payload: http(token).get(`/spvklaim/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailSpvklaim: (token, id) => ({
        type: 'DETAIL_SPVKLAIM',
        payload: http(token).get(`/spvklaim/detail/${id}`),
    }),
    addSpvklaim: (token, data) => ({
        type: 'ADD_SPVKLAIM',
        payload: http(token).post(`/spvklaim/add`, qs.stringify(data))
    }),
    updateSpvklaim: (token, data, id) => ({
        type: 'UPDATE_SPVKLAIM',
        payload: http(token).patch(`/spvklaim/update/${id}`, qs.stringify(data))
    }),
    deleteSpvklaim: (token, id) => ({
        type: 'DELETE_SPVKLAIM',
        payload: http(token).delete(`/spvklaim/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_SPVKLAIM',
        payload: http(token).post(`/spvklaim/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_SPVKLAIM',
        payload: http(token).get(`/spvklaim/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_SPVKLAIM',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_SPVKLAIM'
    })
}
