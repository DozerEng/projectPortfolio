const mongoose = require("mongoose");

const Print = require("../models/prints");

exports.prints_get_all = (req, res, next) => {
    Print.find()
        .select("name _id mainImage title description") //filters for fields in brackets
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                prints: docs.map(doc => {
                    return {
                        name: doc.name,
                        title: doc.title,
                        mainImage: doc.mainImage,
                        _id: doc._id,
                        description: doc.description,
                        request: {
                            type: "GET",
                            url: "http://localhost:9000/prints/" + doc._id //creates link for client to responde to print, set to premanent url
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.prints_create_print = (req, res, next) => {
    console.log(req.file);
    const print = new Print({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        title: req.body.title,
        mainImage: req.file.path,
        description: req.body.description
    });
    print
        .save() //method for storing to mongo db
        .then(result => {
            console.log(result); 
            res.status(201).json({  //response to client
                message: 'Successfully added print',
                createdPrint: {
                    name: result.name,
                    title: result.title,
                    mainImage: result.mainImage,
                    description: result.description,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:9000/prints/" + result._id
                    }
                }
            });
        }) 
        .catch(err => {
            console.log(err); 
            res.status(500).json({
                error: err
            });
        });
}

exports.prints_get_print = (req, res, next) => {
    const id = req.params.printId;
    Print.findById(id) //mongoDB find by id from DB
        .select("name _id mainImage title description")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    print: doc,
                    request: {
                        type: "GET",
                        description: "Get all prints",
                        url: "http://localhost:9000/prints"
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for print ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.prints_update_print = (req, res, next) => {
    const id = req.params.printId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;    //creates array of fields to be updated
    }
    Print.update({ _id: id }, { $set: updateOps }) //updates fields that were available
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Print updated",
            request: {
                type: "GET",
                url: "http://localhost:9000/prints/" + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.prints_delete_print = (req, res, next) => {
    const id = req.params.printId;
    Print.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Print delete",
            request: {
                type: "POST",
                url: "http://localhost:9000/prints/",
                body: { name: "String", currentState: "Number"}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

