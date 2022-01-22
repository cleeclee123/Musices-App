import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const NewsContext = createContext();

export const NewsContextProvider = (props) => {
    const [data, setData] = useState();
    const apiKey = "79d653d84d92462895f8b5869c175115";

    useEffect(() => {
        axios
            .get(
                `http://newsapi.org/v2/everything?q=music&from=2021-12-30&sortBy=publishedAt&apiKey=${apiKey}`
            )
            .then((response) => setData(response.data))
            .catch((error) => console.log(error));
    }, []);

    return (
        <NewsContext.Provider value = {{ data }}>
            {props.children}
        </NewsContext.Provider>
    )
}