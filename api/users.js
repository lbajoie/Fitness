


const express = require("express");
const router = express.Router();
//import {BASE_URL} from './index.js'
// POST /api/users/register
// const registerUser = async () => {
//     try {
//         const response = await fetch(
//             `${BASE_URL}/users/register`, {
//                 method : "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     user: {
//                     username: '',
//                     password: ''
//                     }
//                 })
//             });
//             const result = await response.json();
//             console.log(result)
//             return result
//         } catch (error) {
//             alert(error)
//         }
//     }
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
