/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getReservoir: (token) => ({
        type: 'GET_RESERVOIR',
        payload: http(token).get(`/reservoir/all`),
    }),
    getAllReservoir: (token, limit, search, page) => ({
        type: 'GET_ALL_RESERVOIR',
        payload: http(token).get(`/reservoir/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailReservoir: (token, id) => ({
        type: 'DETAIL_RESERVOIR',
        payload: http(token).get(`/reservoir/detail/${id}`)
    }),
    genTransReservoir: (token, data) => ({
        type: 'GENTRANS_RESERVOIR',
        payload: http(token).patch(`/reservoir/gentrans`)
    }),
    genPembReservoir: (token, data, id) => ({
        type: 'GENPEMB_RESERVOIR',
        payload: http(token).patch(`/reservoir/genpemb`)
    }),
    deleteReservoir: (token, id) => ({
        type: 'DELETE_RESERVOIR',
        payload: http(token).delete(`/reservoir/del/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_RESERVOIR',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_RESERVOIR'
    })
}
