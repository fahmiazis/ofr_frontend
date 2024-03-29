/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getNotif: (token, limit, search, page) => ({
        type: 'GET_NOTIF',
        payload: http(token).get(`/notif/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`),
    }),
    getAllNotif: (token, tipe) => ({
        type: 'GET_ALL_NOTIF',
        payload: http(token).get(`/notif/all?tipe=${tipe}`)
    }),
    addNotif: (token, data) => ({
        type: 'ADD_NOTIF',
        payload: http(token).post(`/notif/add`, data)
    }),
    readNotif: (token, id) => ({
        type: 'READ_NOTIF',
        payload: http(token).patch(`/notif/read/${id}`)
    }),
    deleteNotif: (token, id) => ({
        type: 'DELETE_NOTIF',
        payload: http(token).delete(`/notif/del/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_NOTIF',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_NOTIF'
    })
}
