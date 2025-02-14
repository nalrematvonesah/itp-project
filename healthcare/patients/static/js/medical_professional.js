const API_URL = "http://127.0.0.1:8000/api/medical-professionals/";
const HOSPITAL_API_URL = "http://127.0.0.1:8000/api/hospitals/";
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

async function fetchHospitals() {
    try {
        const response = await fetch(HOSPITAL_API_URL);
        const hospitals = await response.json();
        const hospitalSelect = document.getElementById("hospital");

        if (!hospitalSelect) {
            console.error("Error: Hospital dropdown not found.");
            return;
        }

        hospitalSelect.innerHTML = '<option value="">Select Hospital</option>';  // Reset dropdown

        hospitals.forEach(hospital => {
            const option = document.createElement("option");
            option.value = hospital.id;
            option.textContent = hospital.name;
            hospitalSelect.appendChild(option);
        });

        console.log("Hospitals loaded successfully.");
    } catch (error) {
        console.error("Error fetching hospitals:", error);
    }
}

async function fetchMedicalProfessionals() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const professionalList = document.getElementById("medicalProfessionalList");
        
        if (!professionalList) {
            console.error("Error: Professional list not found.");
            return;
        }

        professionalList.innerHTML = "";

        data.forEach(professional => {
            const hospitalName = professional.hospital_name ? professional.hospital_name : "Unknown Hospital";

            const li = document.createElement("li");
            li.innerHTML = `
                ${professional.first_name} ${professional.last_name} - ${professional.specialization} 
                (Hospital: ${hospitalName})
                <button class="more-btn" onclick="showProfessionalDetails(${professional.id})">More</button>
                <button class="edit-btn" onclick="editMedicalProfessional(${professional.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMedicalProfessional(${professional.id})">Delete</button>
            `;
            professionalList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching professionals:", error);
    }
}

async function addMedicalProfessional(event) {
    event.preventDefault();  // Prevent default form submission

    const csrfToken = await getCSRFToken();
    if (!csrfToken) {
        console.error("CSRF token missing");
        return;
    }

    const newProfessional = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        specialization: document.getElementById("specialization").value,
        contact_number: document.getElementById("contact_number").value,
        hospital: parseInt(document.getElementById("hospital").value)
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            credentials: "include",
            body: JSON.stringify(newProfessional)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to add professional: ${JSON.stringify(responseData)}`);
        }

        console.log("Professional added successfully");
        fetchMedicalProfessionals();
    } catch (error) {
        console.error("Error adding professional:", error);
    }
}

async function editMedicalProfessional(professionalId) {
    const newFirstName = prompt("Enter new first name:");
    const newLastName = prompt("Enter new last name:");
    const newSpecialization = prompt("Enter new specialization:");
    const newContact = prompt("Enter new contact number:");
    const newHospital = prompt("Enter new hospital ID:");

    if (!newFirstName || !newLastName || !newSpecialization || !newContact || !newHospital) return;

    const csrfToken = await getCSRFToken();

    fetch(`${API_URL}${professionalId}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        },
        credentials: "include",
        body: JSON.stringify({
            first_name: newFirstName,
            last_name: newLastName,
            specialization: newSpecialization,
            contact_number: newContact,
            hospital: parseInt(newHospital)
        })
    })
    .then(() => fetchMedicalProfessionals())
    .catch(error => console.error("Error updating professional:", error));
}

async function deleteMedicalProfessional(professionalId) {
    if (!confirm("Are you sure you want to delete this medical professional?")) return;

    const csrfToken = await getCSRFToken();

    fetch(`${API_URL}${professionalId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        },
        credentials: "include"
    })
    .then(() => fetchMedicalProfessionals())
    .catch(error => console.error("Error deleting professional:", error));
}

async function showProfessionalDetails(professionalId) {
    try {
        const response = await fetch(`${API_URL}${professionalId}/`);
        const professional = await response.json();
        alert(`Name: ${professional.first_name} ${professional.last_name}
Specialization: ${professional.specialization}
Contact: ${professional.contact_number}
Hospital: ${professional.hospital_name}`);
    } catch (error) {
        console.error("Error fetching details:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchHospitals();
    fetchMedicalProfessionals();
    document.getElementById("medicalProfessionalForm").addEventListener("submit", addMedicalProfessional);
});
