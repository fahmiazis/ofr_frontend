import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input } from 'reactstrap'
import authAct from '../redux/actions/auth'

const getListArea = () => {
    try {
        return JSON.parse(localStorage.getItem('arc_area') || '[]')
    } catch (err) {
        return []
    }
}

// pilihan area yang sedang diwakili user AR Center
class AreaArc extends Component {
    state = { isLoading: false }

    changeArea = async (kodePlant) => {
        this.setState({ isLoading: true })
        try {
            await this.props.switchArea(kodePlant)
            // data seluruh halaman bergantung pada area aktif
            window.location.reload()
        } catch (err) {
            this.setState({ isLoading: false })
            alert((err.response && err.response.data && err.response.data.message) || 'Gagal ganti area')
        }
    }

    render() {
        if (localStorage.getItem('arc') !== '1') return null
        const listArea = getListArea()
        return (
            <Input
                type="select"
                bsSize="sm"
                className="mr-3"
                style={{ width: 220 }}
                title="Area yang sedang diwakili"
                disabled={this.state.isLoading}
                value={localStorage.getItem('kode') || ''}
                onChange={e => this.changeArea(e.target.value)}
            >
                {listArea.map(item => (
                    <option key={item.kode_plant} value={item.kode_plant}>{item.area} ({item.kode_plant})</option>
                ))}
            </Input>
        )
    }
}

const mapDispatchToProps = {
    switchArea: authAct.switchArea
}

export default connect(null, mapDispatchToProps)(AreaArc)
