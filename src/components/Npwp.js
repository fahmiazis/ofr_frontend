import React, { Component } from 'react'

export default class Npwp extends Component {
    state = {
        value: ""
      };

      render(val) {
        return (
            typeof val === 'string' && val.replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6')
        )
      }
}
