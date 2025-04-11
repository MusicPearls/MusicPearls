const express = require('express');
const router = express.Router();
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Storage } = require("@google-cloud/storage");

const NODE_ENV = process.env.NODE_ENV || "development";
const BUCKET_NAME = process.env.GCP_BUCKET_NAME;

// loads process.env.GOOGLE_APPLICATION_CREDENTIALS automatically
const storage = new Storage();

async function fetchLocal(fileName) {
    const filePath = path.join(__dirname, './server-data', fileName);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
}

async function fetchCloudStorage(fileName) {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(fileName);
    const [content] = await file.download();
    return JSON.parse(content.toString());
}

async function fetchData(fileName) {
    return NODE_ENV === "development"
        ? fetchLocal(fileName)
        : fetchCloudStorage(fileName);
}

module.exports = {
    fetchData,
};