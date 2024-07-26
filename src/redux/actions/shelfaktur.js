/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getShelfaktur: (token, limit, search, page) => ({
        type: 'GET_SHELFAKTUR',
        payload: http(token).get(`/faktur/shelfaktur?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    syncFaktur: (token, type, faktur, date1, date2) => ({
        type: 'SYNC_FAKTUR',
        payload: http(token).get(`/faktur/sync?type=${type}&faktur=${faktur}&date1=${date1}&date2=${date2}`),
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_SHELFAKTUR',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_SHELFAKTUR'
    })
}
