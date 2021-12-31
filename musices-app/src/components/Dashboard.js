import React from 'react';
import useAuth from '../useAuth';
import Creds from './HelperDB/Creds';
import { Credentials } from './HelperDB/Creds';
import Detail from './HelperDB/Detail';
import Dropdown from './HelperDB/Dropdown';
import Listbox from './HelperDB/Listbox';
import axios from 'axios';



export default function Dashboard({ code }) {
    const accessToken = useAuth(code)

    return (
        <div className = 'dash-main'>
            <h1> Hello, this is the dashboard </h1>
            {code}
        </div>
    )
}