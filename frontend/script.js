function updateTowns() {

    let district = document.getElementById("district").value;
    let town = document.getElementById("town");

    town.innerHTML = "";

    if (district === "Trivandrum") {

        town.innerHTML += "<option>Kazhakuttam</option>";
        town.innerHTML += "<option>Pattom</option>";
        town.innerHTML += "<option>Neyyattinkara</option>";

    }

    else if (district === "Kollam") {

        town.innerHTML += "<option>Kottarakkara</option>";
        town.innerHTML += "<option>Karunagappally</option>";
        town.innerHTML += "<option>Punalur</option>";

    }

    else if (district === "Kochi") {

        town.innerHTML += "<option>Kakkanad</option>";
        town.innerHTML += "<option>Edappally</option>";
        town.innerHTML += "<option>Aluva</option>";

    }
}
function showVenues() {

    let district = document.getElementById("district").value;
    let venueList = document.getElementById("venue-list");
    let town = document.getElementById("town").value;

    venueList.innerHTML = "";

    if (district === "Trivandrum") {

    if (town === "Kazhakuttam") {

        venueList.innerHTML = `
            <div class="venue-card">
                <h2>Green Palace Auditorium</h2>
                <p>Location: Kazhakuttam</p>
                <p>Capacity: 500</p>

                <a href="venue-details.html">
                    <button>View Details</button>
                </a>
            </div>
        `;
    }

    else if (town === "Pattom") {

        venueList.innerHTML = `
            <div class="venue-card">
                <h2>Royal Convention Center</h2>
                <p>Location: Pattom</p>
                <p>Capacity: 800</p>

                <a href="venue-details.html">
                    <button>View Details</button>
                </a>
            </div>
        `;
    }

    else if (town === "Neyyattinkara") {

        venueList.innerHTML = `
            <div class="venue-card">
                <h2>Techno Event Hall</h2>
                <p>Location: Neyyattinkara</p>
                <p>Capacity: 600</p>

                <a href="venue-details.html">
                    <button>View Details</button>
                </a>
            </div>
        `;
    }
}

  

else if (district === "Kollam") {

    if (town === "Kottarakkara") {

        venueList.innerHTML = `
            <div class="venue-card">
                <h2>Kollam Grand Hall</h2>
                <p>Location: Kottarakkara</p>
                <p>Capacity: 600</p>
                <a href="venue-details.html">
                    <button>View Details</button>
                </a>
            </div>
        `;
    }

    else if (town === "Karunagappally") {

        venueList.innerHTML = `
            <div class="venue-card">
                <h2>Lake View Auditorium</h2>
                <p>Location: Karunagappally</p>
                <p>Capacity: 700</p>
                <a href="venue-details.html">
                    <button>View Details</button>
                </a>
            </div>
        `;
    }

    else if (town === "Punalur") {

        venueList.innerHTML = `
            <div class="venue-card">
                <h2>Punalur Event Center</h2>
                <p>Location: Punalur</p>
                <p>Capacity: 450</p>
                <a href="venue-details.html">
                    <button>View Details</button>
                </a>
            </div>
        `;
    }
}

else if (district === "Kochi") {

    if (town === "Kakkanad") {

        venueList.innerHTML = `
            <div class="venue-card">
                <h2>Kochi Event Hub</h2>
                <p>Location: Kakkanad</p>
                <p>Capacity: 1000</p>
                <a href="venue-details.html">
                    <button>View Details</button>
                </a>
            </div>
        `;
    }

    else if (town === "Edappally") {

        venueList.innerHTML = `
            <div class="venue-card">
                <h2>Marine Drive Convention Center</h2>
                <p>Location: Edappally</p>
                <p>Capacity: 1200</p>
                <a href="venue-details.html">
                    <button>View Details</button>
                </a>
            </div>
        `;
    }

    else if (town === "Aluva") {

        venueList.innerHTML = `
            <div class="venue-card">
                <h2>Aluva Grand Palace</h2>
                <p>Location: Aluva</p>
                <p>Capacity: 850</p>
                <a href="venue-details.html">
                    <button>View Details</button>
                </a>
            </div>
        `;
    }
}

    else {

        venueList.innerHTML = `
            <p>Please select a district.</p>
        `;
    }
}