import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDogs, deleteDog } from "./apiManager";

export default function DogDetailsComponent() {
    const {dogId} = useParams()
    const [chosenDog, setChosenDog] = useState(null)
    const [dogs, setDogs] = useState([])
    const navigate = useNavigate()
    
    useEffect(()=> {
        getDogs()
            .then(setDogs)
    },[]
    )   

    useEffect(() => {
        const foundDog = dogs.find(dog => dog.id === parseInt(dogId))
        setChosenDog(foundDog)
    },[dogs]
    )

    if (chosenDog) {
        return <section className="dog-details-section">
            <p className="dog-detail dog-detail-name">{chosenDog.name}</p>
            <p className="dog-detail dog-detail-city">Lives in {chosenDog.city.name}</p>
            <p className="dog-detail dog-detail-walker">
            {
                chosenDog.walkerId && chosenDog.walker
                ? `Currently assigned to be walked by ${chosenDog.walker.name}`
                : `Currently unassigned`
            }
            </p>
            <button className="button remove-dog-button"
                onClick={(event) => {
                    deleteDog(chosenDog.id)
                        .then(() => {
                            navigate("/")
                        })
                }}
            >Remove Dog</button>
        </section>
    }
}