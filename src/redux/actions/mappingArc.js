/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'

export default {
    getMapping: (token, limit, search, page) => ({
        type: 'GET_MAPPING_ARC',
        payload: http(token).get(`/arc/get?limit=${limit}&search=${encodeURIComponent(search || '')}&page=${page === undefined ? 1 : page}`)
    }),
    nextPage: (token, link) => ({
        type: 'GET_MAPPING_ARC',
        payload: http(token).get(`${link}`)
    }),
    getOptions: (token) => ({
        type: 'GET_OPTION_MAPPING_ARC',
        payload: http(token).get(`/arc/options`)
    }),
    saveMapping: (token, data) => ({
        type: 'SAVE_MAPPING_ARC',
        payload: http(token).post(`/arc/save`, data)
    }),
    uploadMapping: (token, data) => ({
        type: 'SAVE_MAPPING_ARC',
        payload: http(token).post(`/arc/master`, data)
    }),
    getSpv: (token) => ({
        type: 'GET_SPV_ARC',
        payload: http(token).get(`/arc/spv`)
    }),
    saveSpv: (token, data) => ({
        type: 'SAVE_MAPPING_ARC',
        payload: http(token).patch(`/arc/spv`, data)
    }),
    deleteMapping: (token, username) => ({
        type: 'DELETE_MAPPING_ARC',
        payload: http(token).delete(`/arc/del/${encodeURIComponent(username)}`)
    })
}
