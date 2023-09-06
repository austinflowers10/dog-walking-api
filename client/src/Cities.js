import { getCities, postNewCity } from "./apiManager";
import { useState,useEffect } from "react";

export default function Cities() {
    const [cities, setCities] = useState([])
    const [newCityName, setNewCityName] = useState('')

    useEffect(() => {
        getCities()
            .then(setCities)
    }, []
    )

    const handleAddCity = (event) => {
        event.preventDefault()
        
        const newCity = {
            name: newCityName
        }
        
        postNewCity(newCity)
            .then(getCities)
            .then(setCities)
    }
    
    return <div className="cities-container">
        <p className="subtitle cities-subtitle">Cities</p>
        <div className="add-city-section">
            <label htmlFor="city">Add City:</label>
            <input className="add-city-input"
                required 
                type="text"
                placeholder="New City"
                value={newCityName}
                onChange={(event) => {
                    setNewCityName(event.target.value)
                }}
            />
            <button className="button city-button"
                type="submit"
                onClick={handleAddCity}
            >Submit</button>
        </div>
        <div className="list cities-list">
            {
                cities.map((city) => {
                    return <p key={`city--${city.id}`} className="list-item list-item-city">{city.name}</p>
                })
            }
        </div>
    </div>
}