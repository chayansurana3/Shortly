const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.post('/', async (req, res) =>{
    try {
        const url = req.body.url;
        const response = await fetch('https://cleanuri.com/api/v1/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${encodeURIComponent(url)}`,
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.log("Error: ", error);
        res.status(400).json({message: 'Error, url cannot be shortened', error: error});
    }
});

app.listen(PORT, () => console.log("Server running"));