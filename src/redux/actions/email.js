/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getEmail: (token, limit, search, page) => ({
        type: 'GET_EMAIL',
        payload: http(token).get(`/email/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`),
    }),
    getAllEmail: (token) => ({
        type: 'GET_ALL_EMAIL',
        payload: http(token).get(`/email/all`)
    }),
    getDetailEmail: (token, id) => ({
        type: 'DETAIL_EMAIL',
        payload: http(token).get(`/email/detail/${id}`)
    }),
    addEmail: (token, data) => ({
        type: 'ADD_EMAIL',
        payload: http(token).post(`/email/add`, qs.stringify(data))
    }),
    getDraftEmail: (token, data) => ({
        type: 'DRAFT_EMAIL',
        payload: http(token).patch(`/email/draft`, data)
    }),
    getDraftAjuan: (token, data) => ({
        type: 'AJUAN_EMAIL',
        payload: http(token).patch(`/email/drajuan`, data)
    }),
    sendEmail: (token, data) => ({
        type: 'SEND_EMAIL',
        payload: http(token).patch(`/email/send`, data)
    }),
    updateEmail: (token, data, id) => ({
        type: 'UPDATE_EMAIL',
        payload: http(token).patch(`/email/update/${id}`, qs.stringify(data))
    }),
    deleteEmail: (token, id) => ({
        type: 'DELETE_EMAIL',
        payload: http(token).delete(`/email/del/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_EMAIL',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_EMAIL'
    })
}
