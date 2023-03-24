import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import storage from "../config/firebaseStorage.js";

const uploadRouter = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

uploadRouter.post("/", upload.single("file"), async (req, res) => {
    try {
        // get file from request
        const file = req.file;

        if (file) {
            const fileName = uuidv4() + file.originalname;

            const blob = storage.file(fileName);

            const blobStream = blob.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: file.mimetype,
                },
            });

            blobStream.on("error", (error) => {
                res.status(500).json({error: error.message});
            });

            blobStream.on("finish", () => {
                const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${fileName}?alt=media`;
                res.status(200).json(publicUrl);
            });

            blobStream.end(file.buffer);
        } else {
            res.status(400).json({error: "No file found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.stack});
    }
});

export default uploadRouter;