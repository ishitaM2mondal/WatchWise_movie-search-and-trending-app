import React from "react";

// const person ={
//     name: 'Ishita',
//     age:24,
//     location: 'Habra'
// }
// const { name, age, location } = person;
const Search = ({ searchTerm, setSearchTerm }) =>{
    return(
        <div className="search">
            <div>
                <input className="search-bar"
                    type="text"
                    placeholder="Search through thousands of movies"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
        </div>
    )
}
export default Search;