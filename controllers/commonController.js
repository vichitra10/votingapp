const mongoose = require('mongoose');
const { generateContent } = require('../apiservice'); // Adjust path as needed


const generate = async (req, res) => {
    try {

        const prompt = req.body.question;
        const result = await generateContent(prompt);
        res.send({
            "result":result
        })
    }
    catch(err)
    {
      console.log(err);
    }
}

module.exports = {generate};