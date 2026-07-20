// ==========================================================
// Brain Tumor Classification System
// script.js
// ==========================================================

// ----------------------------------------------------------
// Theme
// ----------------------------------------------------------

const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.remove("dark");
    themeToggle.checked = false;
    themeLabel.textContent = "☀️ Light";

} else {

    document.body.classList.add("dark");
    themeToggle.checked = true;
    themeLabel.textContent = "🌙 Dark";

}

themeToggle.addEventListener("change", () => {

    if (themeToggle.checked) {

        document.body.classList.add("dark");
        themeLabel.textContent = "🌙 Dark";
        localStorage.setItem("theme", "dark");

    } else {

        document.body.classList.remove("dark");
        themeLabel.textContent = "☀️ Light";
        localStorage.setItem("theme", "light");

    }

});


// ----------------------------------------------------------
// Elements
// ----------------------------------------------------------

const uploadForm = document.getElementById("uploadForm");

const imageInput = document.getElementById("imageInput");

const browseButton = document.getElementById("browseButton");

const dropArea = document.getElementById("drop-area");

const previewImage = document.getElementById("previewImage");

const predictButton = document.getElementById("predictButton");

const clearButton = document.getElementById("clearButton");

const statusBox = document.getElementById("status");

const predictionText = document.querySelector("#prediction h3");

const confidenceText = document.querySelector("#confidence h3");

const confidenceBar = document.getElementById("confidenceBar");


// ----------------------------------------------------------
// Browse
// ----------------------------------------------------------

browseButton.addEventListener("click", () => {

    imageInput.click();

});


// ----------------------------------------------------------
// Image Selection
// ----------------------------------------------------------

imageInput.addEventListener("change", () => {

    if (imageInput.files.length === 0)
        return;

    loadPreview(imageInput.files[0]);

});


// ----------------------------------------------------------
// Drag & Drop
// ----------------------------------------------------------

["dragenter", "dragover"].forEach(eventName => {

    dropArea.addEventListener(eventName, e => {

        e.preventDefault();

        dropArea.style.borderColor = "#22c55e";

    });

});

["dragleave", "drop"].forEach(eventName => {

    dropArea.addEventListener(eventName, e => {

        e.preventDefault();

        dropArea.style.borderColor = "";

    });

});

dropArea.addEventListener("drop", e => {

    const files = e.dataTransfer.files;

    if (files.length === 0)
        return;

    imageInput.files = files;

    loadPreview(files[0]);

});


// ----------------------------------------------------------
// Preview
// ----------------------------------------------------------

function loadPreview(file) {

    if (!file.type.startsWith("image/")) {

        alert("Please upload a valid image.");

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;

        previewImage.style.display = "block";

    };

    reader.readAsDataURL(file);

    predictButton.disabled = false;

    resetPrediction();

}


// ----------------------------------------------------------
// Clear
// ----------------------------------------------------------

clearButton.addEventListener("click", () => {

    uploadForm.reset();

    previewImage.src = "";

    previewImage.style.display = "none";

    predictButton.disabled = true;

    resetPrediction();

});


// ----------------------------------------------------------
// Reset Result
// ----------------------------------------------------------

function resetPrediction() {

    statusBox.innerHTML = "Waiting for MRI image...";

    predictionText.innerHTML = "--";

    confidenceText.innerHTML = "-- %";

    confidenceBar.style.width = "0%";

}


// ----------------------------------------------------------
// AJAX Prediction
// ----------------------------------------------------------

uploadForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    if (imageInput.files.length === 0)
        return;

    const formData = new FormData();

    formData.append("image", imageInput.files[0]);

    statusBox.innerHTML = "🔄 Analyzing MRI...";

    predictButton.disabled = true;

    predictButton.innerHTML = "Analyzing...";

    try {

        const response = await fetch("/predict", {

            method: "POST",

            body: formData

        });

        const result = await response.json();

        if (result.success) {

            statusBox.innerHTML = "✅ Analysis Complete";

            predictionText.innerHTML = result.prediction;

            confidenceText.innerHTML = result.confidence + " %";

            confidenceBar.style.width = result.confidence + "%";

        }

        else {

            alert(result.message);

            resetPrediction();

        }

    }

    catch (error) {

        console.error(error);

        alert("Prediction failed.");

        resetPrediction();

    }

    predictButton.disabled = false;

    predictButton.innerHTML = "Analyze MRI";

});