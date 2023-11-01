/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getPicklaim: (token) => ({
        type: 'GET_PICKLAIM',
        payload: http(token).get(`/picklaim/all`),
    }),
    getAllPicklaim: (token, limit, search, page) => ({
        type: 'GET_ALL_PICKLAIM',
        payload: http(token).get(`/picklaim/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailPicklaim: (token, id) => ({
        type: 'DETAIL_PICKLAIM',
        payload: http(token).get(`/picklaim/detail/${id}`),
    }),
    addPicklaim: (token, data) => ({
        type: 'ADD_PICKLAIM',
        payload: http(token).post(`/picklaim/add`, qs.stringify(data))
    }),
    updatePicklaim: (token, data, id) => ({
        type: 'UPDATE_PICKLAIM',
        payload: http(token).patch(`/picklaim/update/${id}`, qs.stringify(data))
    }),
    deletePicklaim: (token, id) => ({
        type: 'DELETE_PICKLAIM',
        payload: http(token).delete(`/picklaim/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_PICKLAIM',
        payload: http(token).post(`/picklaim/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_PICKLAIM',
        payload: http(token).get(`/picklaim/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_PICKLAIM',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_PICKLAIM'
    })
}
