import { useEffect, useState } from "react";
import { getDogs, postNewDog } from "./apiManager"

export const AddDogFormHtml = ({ citiesProp, setDogsProp, setDogFormSectionProp }) => {
    const [newDog, setNewDog] = useState({
        name: "",
        walkerId: null,
        cityId: ""
    })

    return <section className="dog-form-section">
        <p className="subtitle add-dog-subtitle">Add Dog</p>
        
        <form className="form add-dog-form" 
            onSubmit={(event) => {
                event.preventDefault()
                postNewDog(newDog)
                    .then(getDogs)
                    .then(setDogsProp)
                setDogFormSectionProp(null)
                document.querySelector(".add-dog-button").style.visibility = "visible"
            }}>
        {/* Name */}
            <fieldset className="dog-name-field">
                <label htmlFor="name">Name:</label>
                <input
                    required autoFocus
                    type="text"
                    className="input-general"
                    placeholder="New Dog Name"
                    value={newDog.name}
                    onChange={
                        (event) => {
                            const copy = {...newDog}
                            copy.name = event.target.value
                            setNewDog(copy)
                        }
                    } />
            </fieldset>

        {/* CityId */}
            <fieldset className="dog-cityId-field">
                <label htmlFor="cityId">City:</label>
                <select
                    required 
                    className="input-general"
                    onChange={
                        (event) => {
                            const copy = {...newDog}
                            copy.cityId = parseInt(event.target.value)
                            setNewDog(copy)
                        }
                    }>
                    <option value = "">Select Dog City</option>
                    {
                        citiesProp.map(city => {
                            return <option value={city.id}>{city.name}</option> 
                        })
                    }
                </select>
            </fieldset>
            <button className="button new-dog-cancel-button" type="button"
                onClick={(event) => {
                    document.querySelector(".add-dog-button").style.visibility = "visible"
                    setDogFormSectionProp(null)
                    document.querySelector(".dog-form-section").style.visibility = "hidden"  
                }}
            >Cancel</button>
            <button className="button submit-new-dog" type="submit">Submit New Dog</button>
        </form>
    </section>
}