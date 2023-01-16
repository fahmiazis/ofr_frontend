/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getReason: (token) => ({
        type: 'GET_REASON',
        payload: http(token).get(`/reason/all`),
    }),
    getAllReason: (token, limit, search, page) => ({
        type: 'GET_ALL',
        payload: http(token).get(`/reason/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailReason: (token, id) => ({
        type: 'DETAIL_REASON',
        payload: http(token).get(`/reason/detail/${id}`)
    }),
    addReason: (token, data) => ({
        type: 'ADD_REASON',
        payload: http(token).post(`/reason/add`, qs.stringify(data))
    }),
    updateReason: (token, data, id) => ({
        type: 'UPDATE_REASON',
        payload: http(token).patch(`/reason/update/${id}`, qs.stringify(data))
    }),
    deleteReason: (token, id) => ({
        type: 'DELETE_REASON',
        payload: http(token).delete(`/reason/del/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_REASON',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_REASON'
    })
}
