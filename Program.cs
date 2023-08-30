using DogWalkingFullStack.Models;
using Microsoft.AspNetCore.Authorization.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
//---------------------------------------------------------------------------------------

//Collections ----------------------------------
List <Walker> walkers = new List<Walker>
{
    new Walker()
    {
        Id = 1,
        Name = "Austin Powers",
        Email = "austinisawesome@groovy.com"
    },
    new Walker()
    {
        Id = 2,
        Name = "Dr. Evil",
        Email = "evilisawesome@groovy.com"
    },
    new Walker()
    {
        Id = 3,
        Name = "Vanessa Kensington",
        Email = "vanessaisawesome@groovy.com"
    },
    new Walker()
    {
        Id = 4,
        Name = "Felicity Shagwell",
        Email = "felicityisawesome@groovy.com"
    },
    new Walker()
    {
        Id = 4,
        Name = "Foxxy Cleopatra",
        Email = "foxxyisawesome@groovy.com"
    },
    new Walker()
    {
        Id = 6,
        Name = "Mini-Me",
        Email = "miniisawesome@groovy.com"
    }
};

List<Dog> dogs = new List<Dog>
{
    new Dog()
    {
        Id = 1,
        Name = "Aussy Pow Pow",
        WalkerId = null,
        CityId = 1
    },
    new Dog()
    {
        Id = 2,
        Name = "Nessy",
        WalkerId = null,
        CityId = 2
    },
    new Dog()
    {
        Id = 3,
        Name = "Shaggy",
        WalkerId = 1,
        CityId = 3
    },
    new Dog()
    {
        Id = 4,
        Name = "Mr. Biggleswoof",
        WalkerId = 2,
        CityId = 4
    },
    new Dog()
    {
        Id = 5,
        Name = "Cleo",
        WalkerId = 3,
        CityId = 1
    },
    new Dog()
    {
        Id = 6,
        Name = "Mini-Mutt",
        WalkerId = 4,
        CityId = 2
    },
    new Dog()
    {
        Id = 7,
        Name = "Fat Bow Wow",
        WalkerId = 5,
        CityId = 3
    },
    new Dog()
    {
        Id = 8,
        Name = "Furry Farbissina",
        WalkerId = 6,
        CityId = 4
    }
};

List<City> cities = new List<City>
{
    new City()
    {
        Id = 1,
        Name = "New York"
    },
    new City()
    {
        Id = 2,
        Name = "Gotham City"
    },
    new City()
    {
        Id = 3,
        Name = "Metropolis"
    },
    new City()
    {
        Id = 4,
        Name = "Wakanda"
    }
};

List <WalkerCity> walkerCities = new List<WalkerCity>
{
    new WalkerCity()
    {Id = 1, WalkerId = 1, CityId = 1},

     new WalkerCity()
    {Id = 1, WalkerId = 1, CityId = 2},

     new WalkerCity()
    {Id = 1, WalkerId = 1, CityId = 3},

     new WalkerCity()
    {Id = 1, WalkerId = 2, CityId = 1},

     new WalkerCity()
    {Id = 1, WalkerId = 2, CityId = 2},

     new WalkerCity()
    {Id = 1, WalkerId = 3, CityId = 3},

     new WalkerCity()
    {Id = 1, WalkerId = 3, CityId = 4},

     new WalkerCity()
    {Id = 1, WalkerId = 4, CityId = 2},

     new WalkerCity()
    {Id = 1, WalkerId = 4, CityId = 3},

     new WalkerCity()
    {Id = 1, WalkerId = 4, CityId = 4},

     new WalkerCity()
    {Id = 1, WalkerId = 5, CityId = 1},

     new WalkerCity()
    {Id = 1, WalkerId = 5, CityId = 2},

     new WalkerCity()
    {Id = 1, WalkerId = 5, CityId = 3},

     new WalkerCity()
    {Id = 1, WalkerId = 6, CityId = 4}

};
//End of Collections ---------------------------

//Endpoints ------------------------------------
app.MapGet("/api/hello", () =>
{
    return new { Message = "Welcome to DeShawn's Dog Walking" };
});

//Walker -----------------------------
app.MapGet("/api/walkers", () => 
{
    return walkers;
});

app.MapGet("/api/walkers/{paramId}", (int paramId) => 
{
    //find object matching the param id 
    Walker foundWalker = walkers.FirstOrDefault(w => w.Id == paramId);

    //check if null; if yes, return error
    if (foundWalker == null)
    {
        return Results.NotFound();
    }
    else //if not null, return okay and return object
    {
        return Results.Ok(foundWalker);
    }
});

//Dog --------------------------------
app.MapGet("/api/dogs", () => 
{
    //Loop over dogs and expand walker and city for each one
    dogs.ForEach(dog => 
    {
        dog.Walker = walkers.FirstOrDefault(w => w.Id == dog.WalkerId);
        dog.City = cities.FirstOrDefault(c => c.Id == dog.CityId);
    });

    return dogs;
});

app.MapGet("/api/dogs/{paramId}", (int paramId) => 
{
    //find object matching the param id 
    Dog foundDog = dogs.FirstOrDefault(d => d.Id == paramId);

    //check if null; if yes, return error
    if (foundDog == null)
    {
        return Results.NotFound();
    }
    else //if not null, return okay and return object
    {
        return Results.Ok(foundDog);
    }
});

app.MapPost("/api/dogs/", (Dog newDog) => 
{
    //create a new Id
    newDog.Id = dogs.Count > 0 ? dogs.Max(d => d.Id) + 1 : 1;
    dogs.Add(newDog);
    return(newDog);
});

//City -------------------------------
app.MapGet("/api/cities", () => 
{
    return cities;
});

app.MapGet("/api/cities/{paramId}", (int paramId) => 
{
    //find object matching the param id 
    City foundCity = cities.FirstOrDefault(c => c.Id == paramId);

    //check if null; if yes, return error
    if (foundCity == null)
    {
        return Results.NotFound();
    }
    else //if not null, return okay and return object
    {
        return Results.Ok(foundCity);
    }
});

//WalkerCity -------------------------
app.MapGet("/api/walkercities", () => 
{
    return walkerCities;
});

//End of Endpoints ------------------------------
app.Run();