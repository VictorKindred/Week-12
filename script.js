$(document).ready(function () {
  // Function to fetch and display patient list
  function displayPatientList() {
    $.ajax({
      //Make requests to the server without reloading page
      url: "http://localhost:3000/patients",
      type: "GET", //Retrieve data
      success: function (patients) {
        $("#patientTableBody").empty(); // Clear existing table rows
        patients.forEach(function (patient) {
          //append, add patients to the table
          $("#patientTableBody").append(`
                        <tr>
                            <td>${patient.fullName}</td>
                            <td>${patient.dob}</td>
                            <td>${patient.appointmentTime}</td>
                            <td>${patient.reasonForVisit}</td>
                            <td>
                                <button class="btn btn-info btn-sm edit-btn" data-id="${patient.id}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${patient.id}">Delete</button>
                            </td>
                        </tr>
                    `);
        });
      },
      error: function (xhr, status, error) {
        console.error("Error fetching patient list:", error);
      },
    });
  }

  // Display initial patient list on page load
  displayPatientList();

  // Form submit
  $("#addPatientForm").on("submit", function (event) {
    // Prevent default form submission
    event.preventDefault();

    // Collect data from form
    var fullName = $("#fullName").val();
    var dob = $("#dob").val();
    var appointmentTime = $("#appointmentTime").val();
    var reasonForVisit = $("#reasonForVisit").val();
    var patientId = $("#patientId").val(); // Get patient ID from hidden input field

    // Create patient object
    var patientData = {
      fullName: fullName,
      dob: dob,
      appointmentTime: appointmentTime,
      reasonForVisit: reasonForVisit,
    };

    // Determine whether it's an add or update operation based on patient ID presence
    var requestType = patientId ? "PUT" : "POST";
    var requestUrl = patientId
      ? "http://localhost:3000/patients/" + patientId
      : "http://localhost:3000/patients";

    // Send AJAX request to add/update patient
    $.ajax({
      url: requestUrl,
      type: requestType,
      contentType: "application/json",
      data: JSON.stringify(patientData),
      success: function (response) {
        console.log(
          "Patient " + (patientId ? "updated" : "added") + ":",
          response
        );
        // Clear form fields
        $("#fullName").val("");
        $("#dob").val("");
        $("#appointmentTime").val("");
        $("#reasonForVisit").val("");
        // Refresh patient list
        displayPatientList();
        // Clear patient ID from hidden input field
        $("#patientId").val("");
      },
      error: function (xhr, status, error) {
        console.error(
          "Error " + (patientId ? "updating" : "adding") + " patient:",
          error
        );
      },
    });
  });

  // Edit button
  $("#patientTableBody").on("click", ".edit-btn", function () {
    var patientId = $(this).data("id");
    // Fetch patient information by ID
    $.ajax({
      url: "http://localhost:3000/patients/" + patientId,
      type: "GET",
      success: function (patient) {
        $("#fullName").val(patient.fullName);
        $("#dob").val(patient.dob);
        $("#appointmentTime").val(patient.appointmentTime);
        $("#reasonForVisit").val(patient.reasonForVisit);
        $("#patientId").val(patientId);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching patient information:", error);
      },
    });
  });

  // Delete
  $("#patientTableBody").on("click", ".delete-btn", function () {
    var patientId = $(this).data("id");
    $.ajax({
      url: "http://localhost:3000/patients/" + patientId,
      type: "DELETE",

      success: function (response) {
        console.log("Patient deleted:", response);
        // Refresh patient list
        displayPatientList();
      },
      error: function (xhr, status, error) {
        console.error("Error deleting patient:", error);
      },
    });
  });
});
