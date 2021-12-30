import React, { Component } from 'react';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';


const code = new URLSearchParams(window.location.search).get('code');


export default class Musices extends Component {
    render() {
        return code ? <Dashboard code = {code} /> : <Login />
    }
}