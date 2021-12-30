import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    useEffect(() => {
        axios.post("http://localhost:3001/musices", {
            code,
        })
        .then(res => {
            //console.log(res.data);

            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);

            window.history.pushState({}, null, "/");
        }).catch(() => {
            window.location = '/musices'
        })
    }, [code]);

    useEffect(() => {
        axios.post("http://localhost:3001/refresh", {
            refreshToken,
        })
        .then(res => {
            //console.log(res.data);

            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);

            window.history.pushState({}, null, "/");
        }).catch(() => {
            window.location = '/musices'
        })
    }, [refreshToken, expiresIn]);

    return accessToken;
}