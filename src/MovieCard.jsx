
import React from 'react';


const MovieCard = ({ movie }) => {
    const { title, vote_average, poster_path, release_date, original_language, searchTerm } = movie;
    return(
    <li className="movie-card">
        <img src={poster_path ? `https://image.tmdb.org/t/p/w200/${poster_path}`:'/image/placeholder.jpg'} />

        <div className="mt-4">
            <h3>{title || searchTerm || 'Untitled'}</h3>
            <div className="content">
                <div className="ratings">
                    <span>⭐</span>
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>
                <span>.</span>
                <p className="lang">{original_language}</p>
                <span>.</span>
                <p className="year">
                    {release_date ? release_date.split('-')[0] : 'N/A'}
                </p>
            </div>
        </div>
    </li>
    )
};
export default MovieCard;
