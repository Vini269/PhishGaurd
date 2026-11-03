
const ML_API_URL =
    process.env.ML_API_URL || "http://127.0.0.1:8000";

async function predictUrls(urls) {

    const response = await fetch(
        `${ML_API_URL}/predict`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ urls })
        }
    );

    if (!response.ok) {
        throw new Error("ML API request failed");
    }

    return await response.json();
}
module.exports = predictUrls;