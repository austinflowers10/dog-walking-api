import { getGreeting, getDogs, getCities } from "./apiManager";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddDogFormHtml } from "./AddDogForm";

export default function Home() {
    const [greeting, setGreeting] = useState({
        message: "Not Connected to the API",
    });
    const [dogs, setDogs] = useState([])
    const [cities, setCities] = useState([])
    const [chosenDog, setChosenDog] = useState(null)
    const [dogDetailsSection, setDogDetailsSection] = useState(null)
    const [dogFormSection, setDogFormSection] = useState(null)

    useEffect(() => {
        getGreeting()
            .then(setGreeting)
            .catch(() => {
                console.log("API not connected");
            })

        getDogs()
            .then(setDogs)

        getCities()
            .then(setCities)

    }, []);

    useEffect(() => {
        if (chosenDog) {
            setDogDetailsSection(
                <section className="dog-details-section">
                    <p className="dog-detail dog-detail-name">{chosenDog.name}</p>
                    <p className="dog-detail dog-detail-city">Lives in {chosenDog.city.name}</p>
                    <p className="dog-detail dog-detail-walker">
                    {
                        chosenDog.walkerId && chosenDog.walker
                        ? `Currently assigned to be walked by ${chosenDog.walker.name}`
                        : `Currently unassigned`
                    }
                    </p>
                </section>
            )
        } else {
            setDogDetailsSection(null)
        }
    }, [chosenDog]
    )

    return <div className="home-container">
        <p className="header greeting-header">{greeting.message}</p>
        <section className="dogs-list-container">
            <p className="subtitle dogs-subtitle">Dogs</p>
            <div className="dogs-list-and-details-container">
                <ul className="list main-dogs-list">
                    {
                        //map out list of dog names as links
                        dogs.length
                        ?
                        dogs.map((dog) => {
                            return <Link key={`dog--${dog.id}`} className="list-item list-item-dog" onClick={
                                (event) => {
                                    setChosenDog(dog)
                                }}>{dog.name}</Link>
                        })
                        : ''
                    }
                </ul>
                {dogDetailsSection}
            </div>
            <button className="button add-dog-button"
                onClick={event => {
                    document.querySelector(".add-dog-button").style.visibility = "hidden"
                    setDogFormSection(
                        <AddDogFormHtml 
                            citiesProp={cities} 
                            setDogsProp={setDogs} 
                            setDogFormSectionProp={setDogFormSection}
                        />)
                }}
            >Add Dog</button>
        </section>
        {dogFormSection}
    </div>
}


