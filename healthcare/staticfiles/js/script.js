const API_URL = "http://127.0.0.1:8000/api/patients/";


function fetchPatients() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
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
        })
        .catch(error => console.error("Error fetching patients:", error));
}

document.getElementById("patientForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const newPatient = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        contact_number: document.getElementById("contact_number").value,
        address: document.getElementById("address").value,
        medical_history: document.getElementById("medical_history").value
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Patient added:", data);
        fetchPatients();  // Refresh the list
    })
    .catch(error => console.error("Error adding patient:", error));
});


function deletePatient(patientId) {
    fetch(`${API_URL}${patientId}/`, {
        method: "DELETE"
    })
    .then(() => {
        console.log("Patient deleted:", patientId);
        fetchPatients();  
    })
    .catch(error => console.error("Error deleting patient:", error));
}


fetchPatients();
