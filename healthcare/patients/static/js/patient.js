const API_URL = "http://127.0.0.1:8000/api/patients/";
const CSRF_URL = "http://127.0.0.1:8000/api/csrf-token/";

async function getCSRFToken() {
    try {
        const response = await fetch(CSRF_URL, { credentials: "include" });
        const data = await response.json();
        return data.csrfToken;
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
        return null;
    }
}

async function fetchPatients() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const patientList = document.getElementById("patientList");

        if (!patientList) {
            console.error("Error: Patient list not found.");
            return;
        }

        patientList.innerHTML = "";

        data.forEach(patient => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${patient.first_name} ${patient.last_name} - Age: ${patient.age} 
                <button class="more-btn" onclick="showPatientDetails(${patient.id})">More</button>
                <button class="edit-btn" onclick="editPatient(${patient.id})">Edit</button>
                <button class="delete-btn" onclick="deletePatient(${patient.id})">Delete</button>
            `;
            patientList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching patients:", error);
    }
}

async function addPatient(event) {
    event.preventDefault();

    const csrfToken = await getCSRFToken();
    if (!csrfToken) {
        console.error("CSRF token missing");
        return;
    }

    const newPatient = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        age: parseInt(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        contact_number: document.getElementById("contact_number").value,
        address: document.getElementById("address").value,
        medical_history: document.getElementById("medical_history").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            credentials: "include",
            body: JSON.stringify(newPatient)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to add patient: ${JSON.stringify(responseData)}`);
        }

        console.log("Patient added successfully");
        fetchPatients();
    } catch (error) {
        console.error("Error adding patient:", error);
    }
}

async function editPatient(patientId) {
    const newFirstName = prompt("Enter new first name:");
    const newLastName = prompt("Enter new last name:");
    const newAge = prompt("Enter new age:");
    const newGender = prompt("Enter new gender:");
    const newContact = prompt("Enter new contact number:");
    const newAddress = prompt("Enter new address:");
    const newMedicalHistory = prompt("Enter new medical history:");

    if (!newFirstName || !newLastName || !newAge || !newGender || !newContact || !newAddress || !newMedicalHistory) return;

    const csrfToken = await getCSRFToken();

    fetch(`${API_URL}${patientId}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        },
        credentials: "include",
        body: JSON.stringify({
            first_name: newFirstName,
            last_name: newLastName,
            age: parseInt(newAge),
            gender: newGender,
            contact_number: newContact,
            address: newAddress,
            medical_history: newMedicalHistory
        })
    })
    .then(() => fetchPatients())
    .catch(error => console.error("Error updating patient:", error));
}

async function deletePatient(patientId) {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    const csrfToken = await getCSRFToken();

    fetch(`${API_URL}${patientId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        },
        credentials: "include"
    })
    .then(() => fetchPatients())
    .catch(error => console.error("Error deleting patient:", error));
}

async function showPatientDetails(patientId) {
    try {
        const response = await fetch(`${API_URL}${patientId}/`);
        const patient = await response.json();
        alert(`Name: ${patient.first_name} ${patient.last_name}
Age: ${patient.age}
Gender: ${patient.gender}
Contact: ${patient.contact_number}
Address: ${patient.address}
Medical History: ${patient.medical_history}`);
    } catch (error) {
        console.error("Error fetching details:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchPatients();
    document.getElementById("patientForm").addEventListener("submit", addPatient);
});
