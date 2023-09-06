//GET

export const getGreeting = async () => {
  const res = await fetch("/api/hello");
  return res.json();
}

export const getWalkers = async () => {
  const res = await fetch("/api/walkers");
  return res.json();
}

export const getDogs = async () => {
  const res = await fetch("/api/dogs");
  return res.json();
}

export const getCities = async () => {
  const res = await fetch("/api/cities");
  return res.json();
}

export const getWalkerCities = async () => {
  const res = await fetch("/api/walkercities");
  return res.json();
}

//End of GET

//POST
export const postNewDog = async (newDogObj) => {
    const res = await fetch("api/dogs", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(newDogObj)
    });
    return res.json()
}

export const postNewCity = async (newCityObj) => {
    const res = await fetch("/api/cities", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(newCityObj)
    });
    return res.json()
}
//End of POST

//DELETE

export const deleteDog = async (dogId) => {
    return await fetch(`api/dogs/${dogId}`, { method: "DELETE" })
}

export const deleteWalker = async (walkerId) => {
    return await fetch(`api/walkers/${walkerId}`, { method: "DELETE"})
}

//End of DELETE

//PUT

//update Dog to change assigned walker
export const putDog = async(dogId, dogToSend) => {
    return await fetch(`api/dogs/${dogId}`, {
        method: "PUT",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(dogToSend)
    })
}

//update Walker 
export const putWalker = async(walkerId, walkerToSend) => {
    return await fetch(`api/walkers/${walkerId}`, {
        method: "PUT",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(walkerToSend)
    })
}

//update WalkerCities to change where a walker walks 
export const putWalkerCities = async(walkerId, walkerToSend) => {
    return await fetch(`api/walkerCities/${walkerId}`,{
        method: "PUT",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(walkerToSend)
    })
}


//End of PUT