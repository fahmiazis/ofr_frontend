/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getRek: (token, tipe) => ({
        type: 'GET_REKENING',
        payload: http(token).get(`/rekening/all?tipe=${tipe}`),
    }),
    getAllRek: (token, limit, search, page) => ({
        type: 'GET_ALL_REKENING',
        payload: http(token).get(`/rekening/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailRek: (token, id) => ({
        type: 'DETAIL_REKENING',
        payload: http(token).get(`/rekening/detail/${id}`)
    }),
    addRek: (token, data) => ({
        type: 'ADD_REKENING',
        payload: http(token).post(`/rekening/add`, qs.stringify(data))
    }),
    updateRek: (token, data, id) => ({
        type: 'UPDATE_REKENING',
        payload: http(token).patch(`/rekening/update/${id}`, qs.stringify(data))
    }),
    deleteRek: (token, id) => ({
        type: 'DELETE_REKENING',
        payload: http(token).delete(`/rekening/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_REKENING',
        payload: http(token).post(`/rekening/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_REKENING',
        payload: http(token).get(`/rekening/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_REKENING',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_REKENING'
    })
}
