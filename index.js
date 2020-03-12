const express = require('express');

const server = express('express');

const db = require('./data/db');

server.listen(4000, () => {
  console.log(' === server listening on port 4000 === ');
})

server.use(express.json());

server.get("/users", (req, res) => {
  db.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The users information could not be retrieved."  })
      })
});

server.get("/users/:id", (req, res) => {
  const id = req.params.id
  db.findById(id)
      .then(user => {
        if (user) {
          res.status(200).json({ user })
        } else {
           res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
      })
      .catch(err => {
         res.status(500).json({ errorMessage: "The users information could not be retrieved."  })
      })
  
})

server.post("/users", (req, res) => {
  const newUser = {
    name: req.body.name,
    bio: req.body.bio
  } 

  db.insert(newUser)
      .then((user) => {
        if (newUser.name && newUser.bio) {
          res.status(201).json( user )
        } else {           
           res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        }
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
     })
})

server.delete("/users/:id", (req, res) => {
  const id = req.params.id
  db.remove(id)
      .then(deletedUser => {
        if(deletedUser) {
          res.status(204).end()
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The user could not be removed" })
     })
})

server.put("/users/:id", (req, res) => {
  const id = req.params.id
  const userInfo = {
    name: req.body.name,
    bio: req.body.bio
  } 
  
  db.update(id, userInfo)
      .then(user => {
        if (userInfo.name && userInfo.bio) {
          res.status(200).json( { user })
        } else {            
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        }
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The user information could not be modified." })
     })
})