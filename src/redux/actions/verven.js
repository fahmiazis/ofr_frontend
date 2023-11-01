/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addVerven: (token, data) => ({
        type: 'ADD_VERVEN',
        payload: http(token).post(`/verven/add`, qs.stringify(data))
    }),
    // deleteCart: (token, id) => ({
    //     type: 'DELETE_CART',
    //     payload: http(token).delete(`/verven/del/${id}`)
    // }),
    getVerven: (token, status, reject, menu, type, category, data, time1, time2, search) => ({
        type: 'GET_VERVEN',
        payload: http(token).get(`/verven/get?status=${status}&reject=${reject}&menu=${menu}&type=${type}&category=${category}&data=${data}&time1=${time1}&time2=${time2}&search=${search === undefined ? '' : search}`),
    }),
    submitVerifVerven: (token, data) => ({
        type: 'VERIF_VERVEN',
        payload: http(token).patch(`/verven/verif`, data)
    }),
    getDetailVerven: (token, data) => ({
        type: 'DETAIL_VERVEN',
        payload: http(token).patch(`/verven/detail`, data)
    }),
    getDetailId: (token, id) => ({
        type: 'VERVEN_ID',
        payload: http(token).get(`/verven/detid/${id}`)
    }),
    rejectVerven: (token, data) => ({
        type: 'REJECT_VERVEN',
        payload: http(token).patch(`/verven/reject`, data)
    }),
    revisiVerven: (token, data) => ({
        type: 'REVISI_VERVEN',
        payload: http(token).patch(`/verven/revisi`, data)
    }),
    editVerven: (token, id, data) => ({
        type: 'EDIT_VERVEN',
        payload: http(token).patch(`/verven/edit/${id}`, data)
    }),
    getDocument: (token, data) => ({
        type: 'DOC_VERVEN',
        payload: http(token).patch(`/verven/doc`, data)
    }),
    generateNoVendor: (token) => ({
        type: 'GENNO_VERVEN',
        payload: http(token).get(`/verven/novdr`)
    }),
    uploadDocVerven: (token, no, id, data) => ({
        type: 'UPLOAD_DOCVERVEN',
        payload: http(token).post(`/verven/updoc?no=${no}&id=${id}`, data)
    }),
    resetVerven: () => ({
        type: 'RESET_VERVEN'
    })
}