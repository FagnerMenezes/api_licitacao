const Orgao = require('../models/orgaos');

const db = require('../models/db')


exports.fyndAll = async (req, res) => {
    try {
        const orgaos = await Orgao.find().then( (result) =>{
            res.status(200).json(result)
        })
    } catch (err) {
            res.status(404).json({msg:err})
    }
}

exports.fyndByIdOrgao = async (req, res) => {
    try {
        const Orgaos = await Orgao.findById({
                _id: req.params.id
            })
            .then((result) => {
                res.status(200).json(result);
            }).catch((err) => res.status(400).send(err));
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

exports.post = async (req, res) => {
    try {
        try {

            const oldOrgao = await Orgao.find({cnpj:req.body.cnpj}).then((result) => {            
                return result;
            });

            if ( oldOrgao.length > 0 && oldOrgao.cnpj !== '000' ){
                res.status(404).json({msg:'CNPJ possui cadastro'});
                return;
            }else{
                const Orgaos = await Orgao.insertMany(req.body).then((result) => {
                    return result;
                });
                await res.status(201).json(Orgaos);
            }
        } catch (error) {
            res.status(404).json({
                msg: error
            });
        }
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

exports.put = async (req, res) => {

    try {
        const Orgaos = await Orgao.updateOne({
            _id: req.params.id
        }, req.body, {
            upsert: true
        }).then((dados) => {
            return dados
        }).catch((err) => {
            res.status(400).send(err)
        })
        await res.status(200).json(Orgaos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

exports.delete = async (req, res) => {
    try {
        const Orgaos = await Orgao.deleteOne({
            _id: req.params.id
        }).then((dados) => {
            return dados
        }).catch((err) => {
            res.status(400).send(err)
        })
        await res.status(200).json(Orgaos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

//---------------------------
//Controle Endereço
exports.postEnd = async (req, res) => {
    try {

        const query = {
            _id: req.params.orgId
        };

        const updateDocument = {
            $push: {
                "address": req.body
            }
        };
        const Orgaos = await Orgao.updateOne(query, updateDocument).then((result) => {
            return result;
        }).catch((err) => {
            res.status(404).send(err)
        });
        await res.status(201).json(Orgaos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

exports.putEnd = async (req, res) => {

    try {

        const query = {
            _id: req.params.orgId,
            "address._id": req.params.endId
        };

        const updateDocument = {
            $set: {
                "address.$": req.body
            }
        };
        const Orgaos = await Orgao.updateOne(query, updateDocument).then((result) => {
            return result;
        }).catch((err) => {
            res.status(404).send(err)
        });
        await res.status(201).json(Orgaos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

exports.deleteEnd = async (req, res) => {
    try {

        const query = {
            _id: req.params.orgId
        };

        const updateDocument = {
            $pull: {
                address: {
                    _id: req.params.endId
                }
            }
        };
        const Orgaos = await Orgao.updateOne(query, updateDocument).then((result) => {
            return result;
        }).catch((err) => {
            res.status(404).send(err)
        });
        await res.status(201).json(Orgaos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

//Controle Contato
exports.postCotact = async (req, res) => {
    try {

        const query = {
            _id: req.params.org_id
        };

        const updateDocument = {
            $push: {
                "contact": req.body
            }
        };
        const Orgaos = await Orgao.updateOne(query, updateDocument).then((result) => {
            return result;
        }).catch((err) => {
            res.status(404).send(err)
        });
        await res.status(201).json(Orgaos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

exports.putContact = async (req, res) => {

    try {

        const query = {
            _id: req.params.org_id,
            "contact._id": req.body._id
        };
        const updateDocument = {
            $set: {
                "contact.$": req.body
            }
        };
        const Orgaos = await Orgao.updateOne(query, updateDocument).then((result) => {
            return result;
        }).catch((err) => {
            res.status(404).send(err)
        });
        await res.status(201).json(Orgaos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

exports.deleteContact = async (req, res) => {
    try {

        const query = {
            _id: req.params.org_id
        };

        const updateDocument = {
            $pull: {
                contact: {
                    _id: req.params.contact_id
                }
            }
        };
        const Orgaos = await Orgao.updateOne(query, updateDocument).then((result) => {
            return result;
        }).catch((err) => {
            res.status(404).send(err)
        });
        await res.status(201).json(Orgaos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}









