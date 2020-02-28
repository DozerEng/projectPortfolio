const mongoose = require("mongoose");

const OtherProject = require("../models/otherProjects");

exports.otherProjects_get_all = (req, res, next) => {
    OtherProject.find()
        .select("name _id mainImage secondImage thirdImage forthImage title shortDescription longDescription") //filters for fields in brackets
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                otherprojects: docs.map(doc => {
                    return {
                        name: doc.name,
                        title: doc.title,
                        mainImage: doc.mainImage,
                        secondImage: doc.secondImage,
                        thirdImage: doc.thirdImage,
                        forthImage: doc.forthImage,
                        _id: doc._id,
                        shortDescription: doc.shortDescription,
                        longDescription: doc.longDescription,
                        request: {
                            type: "GET",
                            url: "http://localhost:9000/otherprojects/" + doc._id //creates link for client to responde to otherproject, set to premanent url
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

exports.otherprojects_create_otherproject = (req, res, next) => {
    console.log(req.file);
    const otherproject = new OtherProject({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        title: req.body.title,
        mainImage: req.file.path,
        shortDescription: req.body.shortDescription,
        longDescription: req.body.longDescription
    });
    otherproject
        .save() //method for storing to mongo db
        .then(result => {
            console.log(result); 
            res.status(201).json({  //response to client
                message: 'Successfully added otherproject',
                createdOtherProject: {
                    name: result.name,
                    title: result.title,
                    mainImage: result.mainImage,
                    shortDescription: result.shortDescription,
                    longDescription: result.longDescription,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:9000/otherprojects/" + result._id
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

exports.otherprojects_get_otherproject = (req, res, next) => {
    const id = req.params.otherprojectId;
    OtherProject.findById(id) //mongoDB find by id from DB
        .select("name _id projectImage title shortDescription longDescription")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    otherproject: doc,
                    request: {
                        type: "GET",
                        description: "Get all otherprojects",
                        url: "http://localhost:9000/otherprojects"
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for otherproject ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.otherprojects_update_otherproject = (req, res, next) => {
    const id = req.params.otherprojectId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;    //creates array of fields to be updated
    }
    OtherProject.update({ _id: id }, { $set: updateOps }) //updates fields that were available
    .exec()
    .then(result => {
        res.status(200).json({
            message: "OtherProject updated",
            request: {
                type: "GET",
                url: "http://localhost:9000/otherprojects/" + id
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

exports.otherprojects_delete_otherproject = (req, res, next) => {
    const id = req.params.otherprojectId;
    OtherProject.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "OtherProject delete",
            request: {
                type: "POST",
                url: "http://localhost:9000/otherprojects/",
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

