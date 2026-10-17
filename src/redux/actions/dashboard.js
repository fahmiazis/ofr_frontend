/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'

export default {
    // periode: { months: 6 } atau { year: 2025 }
    getStatusTransaksi: (token, periode = {}) => ({
        type: 'GET_STATUS_DASHBOARD',
        payload: http(token).get(`/dashboard/status?${periode.year ? `year=${periode.year}` : `months=${periode.months || 6}`}`)
    }),
}
