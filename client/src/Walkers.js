import { getWalkers, getDogs, getCities, putWalkerCities, putWalker, putDog, deleteWalker } from "./apiManager";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Walkers() {
    const [walkers, setWalkers] = useState([])
    const [dogs, setDogs] = useState([])
    const [cities, setCities] = useState([])
    const [chosenWalker, setChosenWalker] = useState(null)
    const [walkerDetailsSection, setWalkerDetailsSection] = useState(null)
    const [walkerDogs, setWalkerDogs] = useState([])
    const [filteredWalkers, setFilteredWalkers] = useState([])
    const [editWalker, setEditWalker] = useState(false)
    const [addDog, setAddDog] = useState(false)
    const [walkerCitiesSection, setWalkerCitiesSection] = useState(null)
    const [selectedCities, setSelectedCities] = useState([])
    const [walkerDogsSection, setWalkerDogsSection] = useState(null)
    const [walkerInfoSection, setWalkerInfoSection] = useState('')
    const [assignedDogDetailsSection, setAssignedDogDetailsSection] = useState(null)
    

    useEffect(() => {
        getWalkers()
            .then(setWalkers)

        getDogs()
            .then(setDogs)

        getCities()
            .then(setCities)
    },[]
    )

    useEffect(() => {
        if (walkers.length) {
            setFilteredWalkers(walkers)
        }
    },[walkers]
    )

    //Chosen Walker Use Effects -----------------------------
    useEffect(() => {
        if (chosenWalker) {
            setSelectedCities(chosenWalker.cities)

            setAddDog(false)
            setAssignedDogDetailsSection(null)
        }
    }, [chosenWalker]
    )

    useEffect(() => {
        
        if (dogs.length && chosenWalker) {
            const matchingDogs = dogs.filter(dog => {
                return dog.walkerId === chosenWalker.id
            })

            setWalkerDogs(matchingDogs)
        }
    },[chosenWalker, dogs]
    )

    // ----------------------------------------------------

    //Walker Cities Section Toggle
    useEffect(() => {
        if (chosenWalker && selectedCities.length) {
            if (editWalker) {
                setWalkerInfoSection(
                    <>
                    <div className="walker-name-input-container">
                        <label htmlFor="name">Name:</label>
                        <input className="walker-name-input"
                            required
                            placeholder="Walker Name"
                            type="text"
                            value={chosenWalker.name}
                            onChange={(event) => {
                                const copy = {...chosenWalker}
                                copy.name = event.target.value
                                setChosenWalker(copy)
                            }}
                        />
                    </div>
                    <div className="walker-email-input-container">
                        <label htmlFor="email">Email:</label>
                        <input className="walker-email-input"
                            required
                            placeholder="Walker Email"
                            type="text"
                            value={chosenWalker.email}
                            onChange={(event) => {
                                const copy = {...chosenWalker}
                                copy.email = event.target.value
                                setChosenWalker(copy)
                            }}
                        />
                    </div>
                    </>
                )

                setWalkerCitiesSection(
                    <div className="update-cities-container">
                        {
                            //return city name with checkbox for each city
                            cities.map(city => {
                                return <div key={`selectableCity--${city.id}`} className="selectable-city">
                                    <input className="city-checkbox"
                                        type="checkbox"
                                        value={city.id}
                                        checked={selectedCities.find(selectedCity => selectedCity.id === city.id) ? true : false}
                                        onChange={(event) => {
                                            console.log(event.target.checked)
                                            if (event.target.checked) {
                                                setSelectedCities([...selectedCities, city])
                                            } else {
                                                setSelectedCities(selectedCities.filter(selectedCity => selectedCity.id !== city.id))
                                            }
                                        }}
                                    />
                                    <p>{city.name}</p>
                                </div>
                            })
                        }
                        <button className="update-walker-button"
                            onClick={(event) => {
                                event.preventDefault();
                                handleUpdateWalker(chosenWalker, selectedCities)
                            }}
                        >Update Walker</button>
                    </div> 
                )
            } else {
                setWalkerInfoSection(
                    <>
                        <p className="walker-detail walker-name">{chosenWalker.name}</p>
                        <p className="walker-detail walker-email">{chosenWalker.email}</p>
                    </>
                )

                setWalkerCitiesSection(
                    chosenWalker.cities.map(cityObj => {
                        return <li key={`walkerCity--${cityObj.id}`} className="cities-per-walker-list-item">{cityObj.name}</li>
                    })
                )
            }
        }
    },[chosenWalker, editWalker, selectedCities])

    //send walker and walker cities, and refresh state 
    const handleUpdateWalker = (chosenWalker) => {   
        const chosenWalkerCopy = {...chosenWalker} 
        chosenWalkerCopy.cities = [...selectedCities]

        putWalkerCities(chosenWalkerCopy.id, chosenWalkerCopy)

        putWalker(chosenWalkerCopy.id, chosenWalkerCopy)
            .then(getWalkers)
            .then(setWalkers)
        
        setChosenWalker(null)

    }

    //Walker Dogs Section Toggle
    useEffect(() => {
        if (chosenWalker && walkerDogs) {
            if (addDog) {
                //filter dogs down to only those available in the walker's cities
                const walkerCitiesDogs = dogs.filter(dog => {
                    //loop over walker's cities to find the dog where it's cityId matches the city.id
                    const dogInCity = chosenWalker.cities.find(city => city.id === dog.cityId)
                    //if it matches, return the dog
                    if (dogInCity && !dog.walkerId) {
                        return dog
                    }
                })

                setWalkerDogsSection(
                    <>
                        <p className="walker-detail dog-detail-dogs">Current Available Dogs:</p>
                        <div className="update-cities-container">
                            {
                                walkerCitiesDogs.length 
                                ?
                                    //return each dog name with checkbox
                                    walkerCitiesDogs.map(dog => {
                                        return <Link key={`selectableDog--${dog.id}`} className="selectable-dog"
                                            onClick={(event) => {
                                                event.preventDefault()
                                                handleAddDog(dog, chosenWalker)                                        
                                            }}
                                        >{dog.name}</Link>
                                    }) 

                                : <p>None</p>
                            }
                        </div>
                    </>
                )
            } else {
                setWalkerDogsSection(
                    <>
                        <p className="walker-detail dog-detail-dogs">Current Dogs Assigned:</p>
                        <ul className="walker-detail-list dogs-per-walker-list"></ul>
                        {
                        walkerDogs.map(walkerDog => {
                            return <li key={`walkerDog--${walkerDog.id}`} className="dogs-per-walker-list-item">{walkerDog.name}</li>
                        })
                        }
                    </>
                )
            }
        }
    },[chosenWalker, addDog, walkerDogs]
    )

    //add dog and show details
    const handleAddDog = (dog, chosenWalker) => {
        const newDog = {...dog}
        newDog.walkerId = chosenWalker.id

        putDog(dog.id, newDog)
            .then(getDogs)
            .then(setDogs)

        setAssignedDogDetailsSection(
            <>
                <p className="walker-detail dog-detail-dogs">New Assigned Dog:</p>
                <div key={`dogDetails--${dog.id}`} className="dogDetails">
                    <p>{dog.name}</p>
                    <p>Lives in {dog.city.name}</p>
                    <p>Currently Assigned to {chosenWalker.name}</p>
                </div>
            </>
        )

        setAddDog(false)
    }

    //Entire Walker Details Refresher
    useEffect(() => {
        if (chosenWalker && walkerCitiesSection && walkerDogsSection) {
            setWalkerDetailsSection(
                <section className="walker-details-section">
                    <div className="walker-info-section">
                        {walkerInfoSection}
                    </div>
                    <p className="walker-detail dog-detail-city">Current Cities:</p>
                    <ul className="walker-detail-list cities-per-walker-list">
                        {walkerCitiesSection}
                    </ul>
                    <section className="walker-dogs-section">
                        {walkerDogsSection}
                    </section>
                {/* Buttons Row */}
                    <div className="walker-buttons-row">
                        <button className="button remove-walker-button"
                            onClick={(event) => {
                                event.preventDefault();
                                setChosenWalker(null)
                                deleteWalker(chosenWalker.id)
                                    .then(getWalkers)
                                    .then(setWalkers)
                                    .then(getDogs)
                                    .then(setDogs)
                                
                            }}
                        >Remove Walker</button>
                        <button className="button edit-walker-button"
                            onClick={event => {
                                setEditWalker(!editWalker)
                                console.log("Edit Cities Clicked")
                            }}
                        >Edit Walker</button>
                        <button className="button add-dog-button"
                            onClick={event => {
                                setAddDog(!addDog)
                                console.log("Edit Dogs Clicked")
                            }}
                        >Add Dog</button>
                    </div>
                </section>
            )
        } else {
            setWalkerDetailsSection(null)
        }
    }, [chosenWalker, walkerCitiesSection, walkerDogsSection]
    )

    return  <div className="walkers-container">
        
        <section className="walkers-list-container">
            <p className="subtitle walkers-subtitle">Walkers</p>
            <select className="walkers-filter-dropdown"
                onChange={(event) => {
                    if (event.target.value) {
                        const selectedCity = cities.find(city => city.id === parseInt(event.target.value))
                        //filter walkers down to walkers that have selectedCity in walker.cities
                        const walkersByCity = walkers.filter(walker => {
                            const foundCity = walker.cities.find(city => city.name === selectedCity.name)

                            if (foundCity) {
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
                    cities.map(city => <option key={`cityOption--${city.id}`} value={city.id}>{city.name}</option>)
                } 
            </select>
            <div className="walker-list-and-details-container">
                <div className="list main-walker-list">
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
                </div>
                {walkerDetailsSection}
            </div>
        </section>
        <section className="assigned-dog-details">
            {assignedDogDetailsSection}
        </section>
    </div>
}