const express = require("express");
const Provider = require ("../models/provider");

const router = express.Router();

//route for a new provider
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.address ||
            !request.body.description ||
            !request.body.number ||
            !request.body.comment ||
            !request.body.IsActive
        ) {
            return response.status(400).send({
                message: 'send all required fields : name ,address,description, ...',
            });
        }

        const newProvider = {
            name: request.body.name,
            address: request.body.address,
            description: request.body.description,
            number: request.body.number,
            comment: request.body.comment,
            IsActive: request.body.IsActi, // Typo here, should be IsActive
        }
        const provider = await Provider.create(newProvider);
        return response.status(201).send(provider);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message }); // Fixing typo here as well
    }
});
//Route for get all providers from database
router.get('/' , async (request ,response) =>{
    try {
        const providers = await Provider.find({});
        return response.status(200).json({
            count: providers.length,
            data: providers
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
});


//Route for get all providers from database
router.get('/:id' , async (request ,response) =>{
    try {
        const {id} =request.params;
        const provider = await Provider.findById(id);
        return response.status(200).json(provider);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
});


//route to update a provider
router.put('/:id',async (request ,response ) => {
    try {
        if (
            !request.body.name ||
            !request.body.address ||
            !request.body.description ||
            !request.body.number ||
            !request.body.comment ||
            !request.body.IsActive
        ) {
            return response.status(400).send({
                message: 'send all required fields : name ,address,description, ...',
            });
        }

const {id} = request.params;
const result = await Provider.findByIdAndUpdate(id ,request.body);
if (!result) {
    return response.status(404).json({messsage :'provider not found '});
}
return response.status(200).send({message:'provider updated succesfully'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
})

//rout for delet a provider
router.delete('/:id',async (request ,response ) => {
    try {
        const {id} = request.params;

        const result = await Provider.findByIdAndDelete(id ,request.body);
        if (!result) {
            return response.status(404).json({messsage :'provider not found '});
        }
        return response.status(200).send({message:'provider deleted succesfully'});
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
});

module.exports = router;
