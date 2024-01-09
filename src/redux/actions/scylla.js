/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addScylla: (token, data) => ({
        type: 'ADD_SCYLLA',
        payload: http(token).post(`/scylla/add`, qs.stringify(data))
    }),
    updateScylla: (token, id, data) => ({
        type: 'UPDATE_SCYLLA',
        payload: http(token).patch(`/scylla/update/${id}`, qs.stringify(data)),
    }),
    getScylla: (token, limit, search, page) => ({
        type: 'GET_SCYLLA',
        payload: http(token).get(`/scylla/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER_SCYLLA',
        payload: http(token).post(`/scylla/master`, data)
    }),
    getDetailScylla: (token, id) => ({
        type: 'GET_DETAIL_SCYLLA',
        payload: http(token).get(`/scylla/detail/${id}`)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_SCYLLA',
        payload: http(token).get(`/scylla/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_SCYLLA',
        payload: http(token).get(`${link}`)
    }),
    deleteScylla: (token, id) => ({
        type: 'DELETE_SCYLLA',
        payload: http(token).delete(`/scylla/delete/${id}`)
    }),
    resetError: () => ({
        type: 'RESET_SCYLLA'
    })
}
