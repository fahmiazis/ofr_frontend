/* eslint-disable import/no-anonymous-default-export */
// src/redux/reducers/auth.js
const authState = {
  isLogin: null,
  isRegister: false,
  token: '',
  isLoading: false,
  isError: false,
  alertMsg: '',
  level: 0,
  isRoute: false,
  listRoute: [
    { route: 'approval', level: [1] },
    { route: 'depo', level: [1] },
    { route: 'user', level: [1] },
    { route: 'coa', level: [1, 103] },
    { route: 'bank', level: [1, 101] },
    { route: 'menu', level: [1] },
    { route: 'reason', level: [1] },
    { route: 'dokumen', level: [1] },
    { route: 'rekening', level: [1] },
    { route: 'tarif', level: [1, 102] },
    { route: 'pagu', level: [1] },
    { route: 'email', level: [1] },
    { route: 'vendor', level: [1, 102] },
    { route: 'faktur', level: [1, 102] },
    { route: 'shelfaktur', level: [1, 102] },
    { route: 'kpp', level: [1, 102] },
    { route: 'kliring', level: [1, 101] },
    { route: 'finance', level: [1, 101] },
    { route: 'picklaim', level: [1, 103] },
    { route: 'spvklaim', level: [1, 103] },
    { route: 'role', level: [1] },
    { route: 'reservoir', level: [1, 101] },
    { route: 'taxcode', level: [1, 102] },
    { route: 'glikk', level: [1] },
    { route: 'scylla', level: [1] },
    { route: 'verifven', level: [4, 14, 8, 7, 17, 2, 9, 1, 5, 6] }
  ]
}

export default (state = authState, action) => {
  switch (action.type) {

    case 'AUTH_USER_PENDING': {
      return { ...state, isLoading: true, alertMsg: 'Login in ....' }
    }

    case 'AUTH_USER_FULFILLED': {
      const { user, access_token, refresh_token } = action.payload.data

      // simpan ke localStorage
      localStorage.setItem('token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('level', user.level)
      localStorage.setItem('name', user.username)
      localStorage.setItem('fullname', user.fullname)
      localStorage.setItem('email', user.email)
      localStorage.setItem('kode', user.kode_plant)
      localStorage.setItem('id', user.id)
      localStorage.setItem('role', user.role)

      return {
        ...state,
        level: user.level,
        isLogin: true,
        isError: false,
        isLoading: false,
        token: access_token,
        alertMsg: 'Login Successfully'
      }
    }

    case 'AUTH_USER_REJECTED': {
      return { ...state, isLoading: false, isLogin: false, alertMsg: 'Login Failed' }
    }

    // ── refresh token ────────────────────────────────────────────────────────
    case 'REFRESH_TOKEN_FULFILLED': {
      const { access_token, refresh_token } = action.payload.data

      localStorage.setItem('token', access_token)
      localStorage.setItem('refresh_token', refresh_token) // rotasi

      return { ...state, token: access_token, isLogin: true }
    }

    case 'REFRESH_TOKEN_REJECTED': {
      // refresh token expired → paksa logout
      localStorage.clear()
      return { ...authState, isLogin: false }
    }

    case 'SET_TOKEN': {
      return { ...state, token: action.payload.token, isLogin: true }
    }

    case 'LOGOUT': {
      localStorage.clear()
      return { ...authState }
    }

    case 'RESET': {
      return { ...state, isLogin: null, isRoute: false }
    }

    case 'ROUTE': {
      return { ...state, isRoute: true }
    }

    default:
      return state
  }
}