import React from 'react';
import useAuth from '../useAuth';


export default function Dashboard({ code }) {
    const accessToken = useAuth(code)

    return (
        <div className = 'dash-main'>
            <h1> Hello, this is the dashboard </h1>
            {code}
        </div>
    )

}