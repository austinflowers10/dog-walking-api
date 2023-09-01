import { getWalkers, getDogs, getCities, getWalkerCities } from "./apiManager";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Walkers() {
    const [walkers, setWalkers] = useState([])
    const [dogs, setDogs] = useState([])
    const [cities, setCities] = useState([])
    const [walkerCities, setWalkerCities] = useState([])
    const [chosenWalker, setChosenWalker] = useState(null)
    const [walkerDetailsSection, setWalkerDetailsSection] = useState(null)
    const [walkerDogs, setWalkerDogs] = useState([])
    const [walkerCityObjects, setWalkerCityObjects] = useState([])
    const [filteredWalkers, setFilteredWalkers] = useState([])
    const [editCities, setEditCities] = useState(false)
    const [editDogs, setEditDogs] = useState(false)
    const [walkerCitiesSection, setWalkerCitiesSection] = useState(null)
    const [selectedCities, setSelectedCities] = useState([])
    const [walkerDogsSection, setWalkerDogsSection] = useState(null)
    const [selectedDogs, setSelectedDogs] = useState([])
    

    useEffect(() => {
        getWalkers()
            .then(setWalkers)

        getDogs()
            .then(setDogs)

        getCities()
            .then(setCities)

        getWalkerCities()
            .then(setWalkerCities)
    },[]
    )

    //Should only run once since walkers is never being modified
    useEffect(() => {
        if (walkers.length) {
            setFilteredWalkers(walkers)
        }
    },[walkers]
    )

    //Chosen Walker Use Effects -----------------------------
    useEffect(() => {
        if (chosenWalker && walkerCities.length) {
            const matchingWalkerCities = walkerCities.filter(walkerCity => {
                return walkerCity.walkerId === chosenWalker.id
            })

            const matchingWalkerCityObjects = matchingWalkerCities.map(walkerCity => { 
                return cities.find(city => city.id === walkerCity.cityId)
            })

            setWalkerCityObjects(matchingWalkerCityObjects)

            setSelectedCities(matchingWalkerCityObjects)

            setEditDogs(false)
            setEditCities(false)
        }
    }, [chosenWalker, walkerCities]
    )

    useEffect(() => {
        
        if (dogs.length && chosenWalker) {
            const matchingDogs = dogs.filter(dog => {
                return dog.walkerId === chosenWalker.id
            })

            setWalkerDogs(matchingDogs)

            setSelectedDogs(matchingDogs)
        }
    },[chosenWalker, dogs]
    )

    // ----------------------------------------------------

    //Walker Cities Section Toggle
    useEffect(() => {
        if (walkerCityObjects) {
            if (editCities) {
                setWalkerCitiesSection(
                    <div className="update-cities-container">
                        {
                            //return city name with checkbox for each city
                            cities.map(city => {
                                return <div key={`selectableCity--${city.id}`} className="selectable-city">
                                    <input className="city-checkbox"
                                        type="checkbox"
                                        value={city.id}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                setSelectedCities([...selectedCities, city])
                                            } else {
                                                setSelectedCities(selectedCities.filter(city => city.id !== parseInt(event.target.value)))
                                            }
                                        }}
                                    />
                                    <p>{city.name}</p>
                                </div>
                            })
                        }
                        <button className="update-walker-cities-button"
                            // onClick={handleUpdateWalkerCities}
                        >Update Cities</button>
                    </div> 
                )
            } else {
                setWalkerCitiesSection(
                    walkerCityObjects.map(cityObj => {
                        return <li key={`walkerCity--${cityObj.id}`} className="cities-per-walker-list-item">{cityObj.name}</li>
                    })
                )
            }
        }
    },[editCities, walkerCityObjects])

    //Walker Dogs Section Toggle
    useEffect(() => {
        if (walkerDogs) {
            if (editDogs) {
                //filter dogs down to only those available in the same city
                const sameCityDogs = dogs.filter(dog => dog.cityId === chosenWalker.cityId)
                const availableSameCityDogs = sameCityDogs.filter(dog => !dog.walker)
                const selectableDogsInWalkerCity = [...walkerDogs, availableSameCityDogs]

                setWalkerDogsSection(
                    <div className="update-cities-container">
                        {
                            //return each dog name with checkbox
                            selectableDogsInWalkerCity.map(dog => {
                                return <div key={`selectableDog--${dog.id}`} className="selectable-dog">
                                    <input className="dog-checkbox"
                                        type="checkbox"
                                        value={dog.id}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                setSelectedDogs([...selectedDogs, dog])
                                            } else {
                                                setSelectedDogs(selectedDogs.filter(dog => dog.id !== parseInt(event.target.value)))
                                            }
                                        }}
                                    />
                                    <p>{dog.name}</p>
                                </div>
                            }) 
                        }
                        <button className="update-walker-dogs-button"
                            // onClick={handleUpdateWalkerDogs}
                        >Update Dogs</button>
                    </div>
                )
            } else {
                setWalkerDogsSection(
                    walkerDogs.map(walkerDog => {
                        return <li key={`walkerDog--${walkerDog.id}`} className="dogs-per-walker-list-item">{walkerDog.name}</li>
                    })
                )
            }
        }
    },[editDogs, walkerDogs]
    )

    //Entire Walker Details Refresher
    useEffect(() => {
        if (chosenWalker && walkerCitiesSection && walkerDogsSection) {
            setWalkerDetailsSection(
                <section className="walker-details-section">
                    <p className="walker-detail dog-detail-name">{chosenWalker.name}</p>
                    <p className="walker-detail dog-detail-city">Current Cities:</p>
                    <ul className="walker-detail-list cities-per-walker-list">
                        {walkerCitiesSection}
                    </ul>
                    <p className="walker-detail dog-detail-dogs">Current Dogs Assigned:</p>
                    <ul className="walker-detail-list dogs-per-walker-list">
                        {walkerDogsSection}
                    </ul>
                {/* Buttons Row */}
                    <div className="walker-buttons-row">
                        <button className="button remove-walker-button"
                            // onClick={(event) => {
                            //     deleteDog(chosenDog.id)
                            //         .then(getDogs)
                            //         .then(setDogs)
                            //     setDogDetailsSection(null)
                            // }}
                        >Remove Walker</button>
                        <button className="button edit-walker-button"
                            onClick={event => {
                                setEditCities(!editCities)
                                console.log("Edit Cities Clicked")
                            }}
                        >Edit Cities</button>
                        <button className="button add-dog-button"
                            onClick={event => {
                                setEditDogs(!editDogs)
                                console.log("Edit Dogs Clicked")
                            }}
                        >Edit Dogs</button>
                    </div>
                </section>
            )
        } else {
            setWalkerDetailsSection(null)
        }
    }, [chosenWalker, walkerCitiesSection, walkerDogsSection]
    )

    return  <div className="walkers-container">
        {/* No header needed */}
        <section className="walkers-list-container">
            <p className="subtitle walkers-subtitle">Walkers</p>
            <select className="walkers-filter-dropdown"
                onChange={(event) => {
                    if (event.target.value) {
                        const parsedEventValue = parseInt(event.target.value)
                        const selectedCity = cities.find(city => city.id === parsedEventValue)
                        const filteredWalkerCities = walkerCities.filter(joinedObj => joinedObj.cityId === selectedCity.id)
                        const walkersByCity = walkers.filter(walker => {
                            const foundWalker = filteredWalkerCities.find(joinedObj => joinedObj.walkerId === walker.id)
                            if (foundWalker) {
                                return walker
                            }
                        })

                        setFilteredWalkers(walkersByCity)
                    } else {
                        setFilteredWalkers(walkers)
                    }
                }}
            >
                <option value=''>Filter</option>
                {
                    cities.map(city => <option value={city.id}>{city.name}</option>)
                } 
            </select>
            <div className="walker-list-and-details-container">
                <ul className="list main-walker-list">
                    {
                        //map out list of walker names as links
                        filteredWalkers.length
                        ?
                        filteredWalkers.map((walker) => {
                            return <Link key={`walker--${walker.id}`} className="list-item list-item-walker" onClick={
                                (event) => {
                                    setChosenWalker(walker)
                                }}>{walker.name}</Link>
                        })
                        : ''
                    }
                </ul>
                {walkerDetailsSection}
            </div>
        </section>
    </div>
}