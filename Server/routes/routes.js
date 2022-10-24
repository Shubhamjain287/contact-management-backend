const express = require('express');
const router = express.Router();

// Connecting to Database 
const connectDB = require('../database/connection');
connectDB();

const verify = require('../controller/verify');
const { homeRoute, register, login, contacts, about, addContact, editContact, logOut, deleteContact } = require('../controller');

router.get('/' , homeRoute);
router.post('/register' , register);
router.post('/signin', login);
router.get('/about', verify ,about);
router.get('/contacts', verify ,contacts);
router.post('/addcontacts', verify , addContact);
router.patch('/editcontact/:id',verify,editContact);
router.delete('/deletecontact/:id',verify,deleteContact);
router.get('/logout',logOut);

module.exports = router;