import React from 'react'
import { Input } from 'reactstrap'

export const getListArea = () => {
    try {
        return JSON.parse(localStorage.getItem('arc_area') || '[]')
    } catch (err) {
        return []
    }
}

export const isUserArc = () => localStorage.getItem('arc') === '1'

// filter area list ajuan user AR Central (hanya untuk melihat), withAll = ada opsi seluruh area
const AreaArc = ({ value, onChange, className, withAll }) => {
    if (!isUserArc()) return null
    return (
        <Input
            type="select"
            className={className}
            value={value}
            onChange={e => onChange(e.target.value)}
        >
            {withAll && <option value="all">All</option>}
            {getListArea().map(item => (
                <option key={item.kode_plant} value={item.kode_plant}>{item.area} ({item.kode_plant})</option>
            ))}
        </Input>
    )
}

export default AreaArc
