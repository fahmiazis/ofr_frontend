import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import {connect} from "react-redux"
import auth from '../redux/actions/auth'
import moment from 'moment'
const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
  // "beforeunload"
]

let timer

class PrivateRoute extends Component {

  state = {
    timer: undefined
  }

  logoutUser = () => {
    this.props.logout()
  } 

  handleLogoutTimer = () => {
    timer = setTimeout(() => {
      this.resetTimer()
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, this.resetTimer)
      })
      this.logoutAction()
    }, 1000 * 60 * 30)
  }
  
  resetTimer = () => {
    if (timer) clearTimeout(timer)
  }

  logoutAction = () => {
    localStorage.clear()
    window.location.pathname = "/login"
  }
  
  componentDidUpdate() {
    Object.values(events).forEach((item) => {
      if (item === "beforeunload") {
        // localStorage.clear()
      } else {
        window.addEventListener(item, () => {
          this.resetTimer()
          this.handleLogoutTimer()
        })
      }
    })
  }

  render () {
    return (
      <Route render={
        (props) => {
          const childWithProps = React.Children.map(this.props.children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, props)
            }
            return child
          })
          if (localStorage.getItem('token')) {
            return childWithProps
          } else {
            return <Redirect to={{ pathname: '/login' }} />
          }
        }
      }
      />
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
})

const mapDispatchToProps = {
  logout: auth.logout,
  setToken: auth.setToken,
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)
