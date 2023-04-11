/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    showDokumen: (token, id, no) => ({
        type: 'SHOW',
        payload: http(token).get(`/show/doc/${id}?no=${no}`)
    }),
    addDokumen: (token, data) => ({
        type: 'ADD_DOKUMEN',
        payload: http(token).post(`/document/add`, qs.stringify(data))
    }),
    updateDokumen: (token, id, data) => ({
        type: 'UPDATE_DOKUMEN',
        payload: http(token).patch(`/document/update/${id}`, qs.stringify(data)),
    }),
    getDokumen: (token, limit, search, page) => ({
        type: 'GET_DOKUMEN',
        payload: http(token).get(`/document/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/document/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_DOKUMEN',
        payload: http(token).get(`/document/export`)
    }),
    getDetailDokumen: (token, id) => ({
        type: 'GET_DETAIL_DOKUMEN',
        payload: http(token).get(`/document/detail/${id}`)
    }),
    deleteDokumen: (token, id) => ({
        type: 'DELETE_DOKUMEN',
        payload: http(token).delete(`/document/delete/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_DOKUMEN',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}
