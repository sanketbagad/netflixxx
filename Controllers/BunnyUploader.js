import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const bunnyRouter = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

bunnyRouter.post("/", upload.single("file"), async (req, res) => {
    try {
        // get file from request
        const file = req.file;

        if (file) {
            const fileName = uuidv4() + file.originalname;

            // store file in BunnyCDN
            const response = await axios.put(
                `https://storage.bunnycdn.com/plixxx/${fileName}`,
                file.buffer,
                {
                    headers: {
                        "AccessKey": "93a36ca2-a928-43ce-b6a6851c44b9-06d0-4523",
                        "Content-Type": file.mimetype,
                    },
                }
            );

            console.log(response);

            if (response.status === 200) {
                const publicUrl = `https://storage.bunnycdn.com/plixxx/${fileName}`;
                res.status(200).json(publicUrl);
            }
            else if (response.status === 201) {
                const publicUrl = `https://storage.bunnycdn.com/plixxx/${fileName}`;
                res.status(201).json(publicUrl).setHeader('Access-Control-Allow-Origin', 'https://storage.bunnycdn.com, https://plixx.co.in, https://plixx.co.in/bunnycdn, http://localhost:3000, http://localhost:1001, https://www.plixx.co.in, https://www.plixx.co.in/*');
            }     
            else {
                res.status(500).json({error: "Error uploading file"});
            }
        } else {
            res.status(400).json({error: "No file found"});
        }
    } catch (error) {
        console.log(error.stack);
        res.status(500).json({error: error.stack});
    }
});
       



export default bunnyRouter;