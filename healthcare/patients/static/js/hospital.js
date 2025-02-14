const API_URL = "http://127.0.0.1:8000/api/hospitals/";
const CSRF_URL = "http://127.0.0.1:8000/api/csrf-token/";

async function getCSRFToken() {
    try {
        const response = await fetch(CSRF_URL, { credentials: "include" });
        const data = await response.json();
        return data.csrfToken;
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
    }
}

async function fetchHospitals() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const hospitalList = document.getElementById("hospitalList");
        hospitalList.innerHTML = "";

        data.forEach(hospital => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${hospital.name} - ${hospital.location} - Capacity: ${hospital.capacity} - Phone: ${hospital.phone_number} 
                <button class="more-btn" onclick="showHospitalDetails(${hospital.id})">More</button>
                <button class="edit-btn" onclick="editHospital(${hospital.id})">Edit</button>
                <button class="delete-btn" onclick="deleteHospital(${hospital.id})">Delete</button>
            `;
        
            hospitalList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching hospitals:", error);
    }
}

async function addHospital(event) {
    event.preventDefault(); 

    const csrfToken = await getCSRFToken();
    if (!csrfToken) {
        console.error("CSRF token missing");
        return;
    }

    const newHospital = {
        name: document.getElementById("name").value,
        location: document.getElementById("location").value,
        capacity: parseInt(document.getElementById("capacity").value),
        contact_number: document.getElementById("contact_number").value
    };

    console.log("Sending data:", newHospital); 

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            credentials: "include",
            body: JSON.stringify(newHospital)
        });

        const responseData = await response.json();
        console.log("Server response:", responseData);  

        if (!response.ok) {
            throw new Error(`Failed to add hospital: ${JSON.stringify(responseData)}`);
        }

        console.log("Hospital added successfully");
        fetchHospitals();
    } catch (error) {
        console.error("Error adding hospital:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("hospitalForm").addEventListener("submit", addHospital);
});


async function deleteHospital(hospitalId) {
    if (!confirm("Are you sure you want to delete this hospital?")) return;

    const csrfToken = await getCSRFToken();

    fetch(`${API_URL}${hospitalId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        },
        credentials: "include"
    })
    .then(() => fetchHospitals())
    .catch(error => console.error("Error deleting hospital:", error));
}

async function showHospitalDetails(hospitalId) {
    try {
        const response = await fetch(`${API_URL}${hospitalId}/`);
        const hospital = await response.json();
        alert(`Name: ${hospital.name}\nLocation: ${hospital.location}\nCapacity: ${hospital.capacity}\nPhone: ${hospital.contact_number}`);
    } catch (error) {
        console.error("Error fetching hospital details:", error);
    }
}

async function editHospital(hospitalId) {
    const newName = prompt("Enter new hospital name:");
    const newLocation = prompt("Enter new location:");
    const newCapacity = prompt("Enter new capacity:");
    const newPhone = prompt("Enter new phone number:");

    if (!newName || !newLocation || !newCapacity || !newPhone) return;

    const csrfToken = await getCSRFToken();

    fetch(`${API_URL}${hospitalId}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        },
        credentials: "include",
        body: JSON.stringify({
            name: newName,
            location: newLocation,
            capacity: parseInt(newCapacity),
            contact_number: newPhone
        })
    })
    .then(() => fetchHospitals())
    .catch(error => console.error("Error updating hospital:", error));
}


fetchHospitals();
