// const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    console.log('Reached getAll function');
    //#swagger.tags=['Contacs']
    try {
        const result = await mongodb.getDatabase().db('Contacts').collection('Contacts').find();
        const contacts = await result.toArray();
        console.log('Fetched contacts:', contacts);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json(error.message || 'Some error occurred while fetching contacts.');
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Contacs']
    const contactId = new ObjectId(req.params.id);
    
    try {
        const result = await mongodb.getDatabase().db().collection('Contacts').findOne({ _id: contactId });

        if (!result) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json(error.message || 'Some error occurred while fetching the contact.');
    }
};

const createContact = async (req, res) => {
    //#swagger.tags=['Contacts']
    try {
        // Logging request body for debugging
        console.log('Request Body:', req.body);

        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };

        // Logging contact for debugging
        console.log('Contact:', contact);

        const response = await mongodb.getDatabase().db().collection('Contacts').insertOne(contact);

        // Logging response for debugging
        console.log('Response:', response);

        if (response.acknowledged) {
            res.status(204).send();
        } else {
            // Improved error handling with detailed logging
            console.error('Error: Insert operation not acknowledged');
            res.status(500).json('Some error occurred while updating the user.');
        }
    } catch (error) {
        // Improved error handling with detailed logging
        console.error('Error:', error);
        res.status(500).json(error.message || 'Some error occurred while updating the user.');
    }
};

const updateContact = async (req, res) => {
    //#swagger.tags=['Contacs']
    const contactId = new ObjectId(req.params.id);
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };

    try {
        const response = await mongodb.getDatabase().db().collection('Contacts').replaceOne({ _id: contactId }, contact);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            // Check for the presence of the error property
            const errorMessage = response.error || 'Some error ocurred while updating the user.';
            res.status(500).json(errorMessage);
        }
    } catch (error) {
        // If an exception occurs, log the error and send a 500 response
        console.error('Error updating contact:', error);
        res.status(500).json(error.message || 'Some error ocurred while updating the user.');
    }
};

const deleteContact = async (req, res) => {
    //#swagger.tags=['Contacs']
    const contactId = new ObjectId(req.params.id);

    try {
        const response = await mongodb.getDatabase().db().collection('Contacts').deleteOne({_id: contactId});

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            // If no document was deleted, consider it as not found
            res.status(404).json({ error: 'Contact not found' });
        }
    } catch (error) {
        // If an exception occurs, log the error and send a 500 response
        console.error('Error deleting contact:', error);
        res.status(500).json(error.message || 'Some error occurred while deleting the contact.');
    }
};
module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};

