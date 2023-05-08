/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addCart: (token, data, id) => ({
        type: 'ADD_CART',
        payload: http(token).post(`/ops/add/${id}`, qs.stringify(data))
    }),
    deleteCart: (token, id) => ({
        type: 'DELETE_CART',
        payload: http(token).delete(`/ops/del/${id}`)
    }),
    getCart: (token) => ({
        type: 'GET_CART',
        payload: http(token).get(`/ops/cart`),
    }),
    getDocCart: (token, no) => ({
        type: 'GET_DOC',
        payload: http(token).patch(`/ops/doc`, qs.stringify(no)),
    }),
    getDocDraft: (token, name) => ({
        type: 'GET_DOCDRAFT',
        payload: http(token).patch(`/ops/docdraft/${name}`),
    }),
    uploadDocCart: (token, no, id, data) => ({
        type: 'UPLOAD_DOC',
        payload: http(token).post(`/ops/updoc?no=${no}&id=${id}`, data)
    }),
    submitOps: (token) => ({
        type: 'SUBMIT_OPS',
        payload: http(token).patch(`/ops/submit`)
    }),
    submitOpsFinal: (token, no) => ({
        type: 'SUBMIT_OPSFINAL',
        payload: http(token).patch(`/ops/subfinops`, qs.stringify(no))
    }),
    getOps: (token, status, reject, menu, type, category, data) => ({
        type: 'GET_OPS',
        payload: http(token).get(`/ops/get?status=${status}&reject=${reject}&menu=${menu}&type=${type}&category=${category}&data=${data}`),
    }),
    getDetail: (token, no) => ({
        type: 'DETAIL_OPS',
        payload: http(token).patch(`/ops/detail`, qs.stringify(no)),
    }),
    getApproval: (token, no) => ({
        type: 'TTD_OPS',
        payload: http(token).patch(`/ops/ttd`, qs.stringify(no))
    }),
    getApprovalList: (token, no) => ({
        type: 'TTDLIST_OPS',
        payload: http(token).patch(`/ops/ttdlist`, qs.stringify(no))
    }),
    approveOps: (token, no) => ({
        type: 'APPROVE_OPS',
        payload: http(token).patch(`/ops/app`, qs.stringify(no))
    }),
    rejectOps: (token, data) => ({
        type: 'REJECT_OPS',
        payload: http(token).patch(`/ops/reject`, data)
    }),
    appRevisi: (token, no) => ({
        type: 'APP_REVISI',
        payload: http(token).patch(`/ops/apprev`, qs.stringify(no))
    }),
    editOps: (token, id, data) => ({
        type: 'EDIT_OPS',
        payload: http(token).patch(`/ops/update/${id}`, qs.stringify(data))
    }),
    editVerif: (token, id, data) => ({
        type: 'EDIT_VERIF',
        payload: http(token).patch(`/ops/editvrf/${id}`, qs.stringify(data))
    }),
    submitRevisi: (token, data) => ({
        type: 'SUBMIT_REVISI',
        payload: http(token).patch(`/ops/subrev`, qs.stringify(data))
    }),
    submitVerif: (token, data) => ({
        type: 'SUBMIT_VERIF',
        payload: http(token).patch(`/ops/verif`, qs.stringify(data))
    }),
    submitAjuanBayar: (token, data) => ({
        type: 'SUBMIT_BAYAR',
        payload: http(token).patch(`/ops/subbayar`, data)
    }),
    approveListOps: (token, no) => ({
        type: 'APPROVELIST_OPS',
        payload: http(token).patch(`/ops/applist`, qs.stringify(no))
    }),
    rejectListOps: (token, data) => ({
        type: 'REJECTLIST_OPS',
        payload: http(token).patch(`/ops/rejectlist`, data)
    }),
    getReport: (token, status, reject, menu) => ({
        type: 'REPORT_OPS',
        payload: http(token).get(`/ops/report?status=${status}&reject=${reject}&menu=${menu}`),
    }),
    resetOps: () => ({
        type: 'RESET_OPS'
    })
}