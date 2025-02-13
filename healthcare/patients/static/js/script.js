const API_URL = "http://127.0.0.1:8000/api/patients/";
const CSRF_URL = "http://127.0.0.1:8000/api/csrf-token/";


async function getCSRFToken() {
    try {
        const response = await fetch(CSRF_URL, { credentials: "include" });
        const data = await response.json();
        console.log("CSRF Token received:", data.csrfToken);
        return data.csrfToken;
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
    }
}


async function fetchPatients() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();  
        console.log("Fetched patients:", data);  

        const patientList = document.getElementById("patientList");
        patientList.innerHTML = ""; 

        data.forEach(patient => {  
            const li = document.createElement("li");
            li.innerHTML = `
                ${patient.first_name} ${patient.last_name} (Age: ${patient.age})
                <button class="delete-btn" onclick="deletePatient(${patient.id})">Delete</button>
            `;
            patientList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching patients:", error);
    }
}


document.getElementById("patientForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const csrfToken = await getCSRFToken(); 

    const newPatient = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        age: parseInt(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        contact_number: document.getElementById("contact_number").value,
        address: document.getElementById("address").value,
        medical_history: document.getElementById("medical_history").value
    };

    console.log("Sending data:", newPatient);

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken  
        },
        credentials: "include",
        body: JSON.stringify(newPatient)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    })
    .then(data => {
        console.log("Patient added:", data);
        fetchPatients(); 
    })
    .catch(error => console.error("Error adding patient:", error));
});

// Function to delete a patient
async function deletePatient(patientId) {
    console.log("Deleting patient:", patientId); 
    const csrfToken = await getCSRFToken();  

    fetch(`${API_URL}${patientId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken  
        },
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => Promise.reject(text));  
        }
        console.log("Patient deleted:", patientId);
        return fetchPatients();  
    })
    .catch(error => console.error("Error deleting patient:", error));
}


fetchPatients();
