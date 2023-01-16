/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addCart: (token, data) => ({
        type: 'ADD_CART_OPS',
        payload: http(token).post(`/ops/add`, qs.stringify(data))
    }),
    deleteCart: (token, id) => ({
        type: 'DELETE_CART_OPS',
        payload: http(token).delete(`/ops/del/${id}`)
    }),
    getCart: (token) => ({
        type: 'GET_CART_OPS',
        payload: http(token).get(`/ops/cart`),
    }),
    getDocCart: (token, no) => ({
        type: 'GET_DOC_OPS',
        payload: http(token).patch(`/ops/doc`, qs.stringify(no)),
    }),
    UploadDocCart: (token, no, data) => ({
        type: 'UPLOAD_DOC_OPS',
        payload: http(token).post(`/ops/updoc?no=${no}`, data)
    }),
    submitOps: (token) => ({
        type: 'SUBMIT_OPS',
        payload: http(token).patch(`/ops/submit`)
    }),
    getOps: (token) => ({
        type: 'GET_OPS',
        payload: http(token).get(`/ops/get`),
    }),
    getDetail: (token, no) => ({
        type: 'DETAIL_OPS',
        payload: http(token).patch(`/ops/detail`, qs.stringify(no)),
    }),
    getApproval: (token, no) => ({
        type: 'TTD_OPS',
        payload: http(token).patch(`/ops/ttd`, qs.stringify(no))
    }),
    approveOps: (token, no) => ({
        type: 'APPROVE_OPS',
        payload: http(token).patch(`/ops/app`, qs.stringify(no))
    }),
    resetOps: () => ({
        type: 'RESET_OPS'
    })
}