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

//DELETE

export const deleteDog = async (dogId) => {
    return await fetch(`api/dogs/${dogId}`, { method: "DELETE" })
}