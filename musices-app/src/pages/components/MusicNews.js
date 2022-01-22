import React from 'react';
import './MusicNews.css';

const NewsCard = ({ title, description, url, urlToImage }) => {
    return (
        <div className = 'news-card-main'>
            <img className = 'news-card-image' src = {urlToImage} alt = "Image" />
            <h3 className = 'news-card-title'>
                <a href = {url}> {title} </a>
            </h3>
            <p className = 'news-card-des'>
                {description}
            </p>
        </div>
    )
}

export default NewsCard;