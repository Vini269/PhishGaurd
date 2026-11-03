const express=  require('express')
const extractUrls = require('../utils/extractUrls.js')
const predictUrls  = require('../services/mlServices.js')

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { subject = "", body = "" } = req.body || {};

        if (
            typeof subject !== "string" ||
            typeof body !== "string" ||
            (!subject.trim() && !body.trim())
        ) {
            return res.status(400).json({
                error: "Email content is required."
            });
        }

        if (subject.length > 1000 || body.length > 50000) {
            return res.status(413).json({
                error: "Email content is too large."
            });
        }

        const urls = extractUrls(`${subject}\n${body}`);

        if (urls.length === 0) {
            return res.json({
                success: true,
                extractedUrls: [],
                prediction: {
                    classification: "no_urls_found",
                    total_urls: 0,
                    results: []
                }
            });
        }

        const prediction = await predictUrls(urls);

        console.log("Prediction :", prediction);

        return res.json({
            success: true,
            extractedUrls: urls,
            prediction
        });

    } catch (error) {
        console.error(error.message);

        return res.status(502).json({
            error: "URL detection service unavailable."
        });
    }
});

module.exports = router
