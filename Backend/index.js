import express from "express";
import randomstring from "randomstring";
import validator from "validator";
import {getShortUrl, getLongUrl, setLongToShort} from './db_config.js';
import cors from 'cors';

const app = express();

app.use(express.json())

// Handling CORS
app.use(cors())

// Middleware to check if URL is valid. We can add more middlewares for request length, rate limit, etc.
app.use('/shorten', (req, res, next) => {
    if (!validator.isURL(req.body.long_url)) {
        return res.status(400).json({"error": "Invalid URL"});
    }
    next();
})

// Function to generate short url -> Contacts dynamo DB
const generate_short_url = async (long_url) => {
    let short_url = await getShortUrl(long_url);
    if (short_url) return short_url;
    else {
        while (short_url == null) {
            short_url = randomstring.generate(7);
            let long_url = await getLongUrl(short_url);
            if (long_url) short_url = null;
        }
        setLongToShort(long_url, short_url);
        return short_url;
    }
}

// Shorten API. Request contains long_url and response the short_url
app.post('/shorten', async (req,res) => {
    console.log(req.body);
    let long_url = req.body.long_url;
    let short_url = await generate_short_url(long_url);
    res.status(200).send({"short_url": "bit.ly/" + short_url});
})

// Unshorten API. Request contains short_url and response the long_url
app.post('/retrieveLongURL', async (req,res) => {
    let short_url = req.body.short_url;
    console.log(short_url);
    if (!short_url) res.status(400).send("URL Not Found");
    short_url = short_url.substr(14);
    console.log(short_url);
    let longURL = await getLongUrl(short_url);
    console.log(longURL);
    if (longURL === "" || longURL === null || longURL === undefined) {
        res.status(400).send("URL Not Found");
    } else {
        res.status(200).send({"url": longURL});
    }
})

// Error Handling Middleware
app.use((err, req, res, next) => {
    // Handle errors and send appropriate responses
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});


// Port connectivity and start listening
const port = 3005;
app.listen(port, () => {
    console.log("Listening now");
})

