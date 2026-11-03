
const scanBtn = document.getElementById("scanBtn");
const emailInput = document.getElementById("email");

const loading = document.getElementById("loading");
const results = document.getElementById("results");
const errorBox = document.getElementById("error");

scanBtn.addEventListener("click", scanEmail);

async function scanEmail() {
    const body = emailInput.value.trim();

    if (!body) {
        errorBox.textContent = "Please enter an email.";
        return;
    }

    loading.hidden = false;
    results.hidden = true;
    errorBox.textContent = "";
    scanBtn.disabled = true;

    try {
        const response = await fetch(
            "http://localhost:5000/api/scan",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ body })
            }
        );

        const data = await response.json();

        console.log("Response:", data);

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Scan failed");
        }

        displayResults(data);

    } catch (error) {
        errorBox.textContent =
            error.message || "Unable to connect to backend.";

    } finally {
        loading.hidden = true;
        scanBtn.disabled = false;
    }
}


function displayResults(data) {

    const prediction = data.prediction || {};

    // 1. Email Classification
    const classification =
        document.getElementById("classification");

    const emailClass = prediction.classification || "Unknown";

    classification.textContent =
        "Email Classification: " + emailClass;

    // 2. Risk
    const risk = document.getElementById("risk");

    const riskValue =
        emailClass === "likely_safe"
            ? "Low Risk"
            : emailClass === "likely_phishing"
            ? "High Risk"
            : "Unknown Risk";

    risk.textContent = "Risk Level: " + riskValue;

    // 3. Extracted URLs
    const urlList = document.getElementById("urlList");

    urlList.replaceChildren();

    const extractedUrls = data.extractedUrls || [];

    if (extractedUrls.length === 0) {

        const li = document.createElement("li");
        li.textContent = "No URLs found.";

        urlList.appendChild(li);

    } else {

        extractedUrls.forEach(url => {

            const li = document.createElement("li");
            li.textContent = url;

            urlList.appendChild(li);
        });
    }

    // 4. Email Model Details
    const emailDetails =
        document.getElementById("emailDetails");

    emailDetails.textContent = JSON.stringify(
        {
            classification: prediction.classification,
            total_urls: prediction.total_urls
        },
        null,
        2
    );

    // 5. URL Analysis
    const urlDetails =
        document.getElementById("urlDetails");

    urlDetails.replaceChildren();

    const urlResults = prediction.results || [];

    if (urlResults.length === 0) {

        urlDetails.textContent = "No URL analysis available.";

    } else {

        urlResults.forEach(item => {

            const card = document.createElement("div");
            card.className = "url-card";

            const heading = document.createElement("h4");

            heading.textContent =
                item.url || "URL Analysis";

            const details = document.createElement("pre");

            details.textContent = JSON.stringify(
                item,
                null,
                2
            );

            card.append(heading, details);

            urlDetails.appendChild(card);
        });
    }

    results.hidden = false;
}
