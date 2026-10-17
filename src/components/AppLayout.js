import React, { Component } from 'react'
import NewNavbar from './NewNavbar'
import styleLayout from '../assets/css/layout.module.css'

// penanda untuk MaterialTitlePanel bahwa halaman sudah dibungkus layout baru,
// sehingga header lama (contentHeader) tidak perlu dirender lagi
export const LayoutContext = React.createContext(false)

class AppLayout extends Component {
    state = {
        collapsed: true
    }

    handleSidebar = (val) => {
        this.setState({ collapsed: val })
    }

    render() {
        const { children, legacy, className } = this.props
        const { collapsed } = this.state
        return (
            <LayoutContext.Provider value={true}>
                <div className={styleLayout.app}>
                    <NewNavbar handleSidebar={this.handleSidebar} handleRoute={this.props.handleRoute} />
                    <div className={`${styleLayout.mainContent} ${collapsed ? styleLayout.collapsedContent : ''} ${legacy ? styleLayout.legacyContent : ''} ${className || ''}`}>
                        {children}
                    </div>
                </div>
            </LayoutContext.Provider>
        )
    }
}

export default AppLayout
