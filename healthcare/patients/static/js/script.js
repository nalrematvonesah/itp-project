const API_URL = "http://127.0.0.1:8000/api/patients/";
const CSRF_URL = "http://127.0.0.1:8000/api/csrf-token/";

// 1️⃣ Fetch CSRF Token
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

// 2️⃣ Fetch Patients
// Function to fetch and display patients
async function fetchPatients() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();  // ✅ Make sure data is defined
        console.log("Fetched patients:", data);  // ✅ Debugging

        const patientList = document.getElementById("patientList");
        patientList.innerHTML = "";  // ✅ Clear previous list

        data.forEach(patient => {  // ✅ Ensure "data" is defined before looping
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


// 3️⃣ Add Patient
document.getElementById("patientForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const csrfToken = await getCSRFToken();  // ✅ Get CSRF token before request

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
            "X-CSRFToken": csrfToken  // ✅ Include CSRF token
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
        fetchPatients();  // ✅ Refresh patient list
    })
    .catch(error => console.error("Error adding patient:", error));
});

// Function to delete a patient
async function deletePatient(patientId) {
    console.log("Deleting patient:", patientId); // ✅ Debugging log

    const csrfToken = await getCSRFToken();  // ✅ Fetch CSRF token before request

    fetch(`${API_URL}${patientId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken  // ✅ Include CSRF token
        },
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => Promise.reject(text));  // ✅ Fix error handling
        }
        console.log("Patient deleted:", patientId);
        return fetchPatients();  // ✅ Refresh patient list
    })
    .catch(error => console.error("Error deleting patient:", error));
}


// 4️⃣ Fetch Patients When Page Loads
fetchPatients();
