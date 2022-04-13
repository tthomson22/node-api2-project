// implement your posts router here
const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();

router.get('/', (req, res) => {
    Posts.find(req.query)
        .then(post => {
            res.json(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if(post){
                res.json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})

router.post('/', (req, res) => {
    let { title, contents } = req.body

    if(!title || !contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Posts.insert({ title, contents })
            .then(({ id }) =>{
                return Posts.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            })
        }
})

router.put('/:id', (req, res) => {
    const { title, contents } = req.body;
    if(!title || !contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Posts.findById(req.params.id)
            .then(post => {
                if(!post){
                    res.status(404).json({ message: "The post with the specified ID does not exist" })
                } else {
                    return Posts.update(req.params.id, req.body)
                }
            })
            .then(id => {
                if(id){
                    return Posts.findById(req.params.id)
                }
            })
            .then(post => {
                if(post){
                    res.status(200).json(post)
                }
            })
            
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: "The post information could not be modified" })
            })
    }
})

router.delete('/:id', async (req, res) =>{
    try{
        const post = await Posts.findById(req.params.id)
        if(post){
            await Posts.remove(req.params.id)
            res.json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }

    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "The post information could not be removed" })
    }

})

module.exports = router;