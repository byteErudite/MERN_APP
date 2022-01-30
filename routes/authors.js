const express = require("express")
const router = express.Router()
const Author = require('../models/author')

// GET method , /author/ route to get all the existing authors with given search param
router.get('/',async (req, resp) => {
    try {
        let searchOptions = {};
        if (req.query.name != null && req.query.name !== '') {
            searchOptions.name = new RegExp(req.query.name, 'i')
        }
        const authors = await Author.find(searchOptions)
        resp.render("authors/index", {
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        resp.redirect("/")
    }
})



router.get('/new', (req, resp) => {
    resp.render("authors/new", {author: new Author()})
})


// POST method , /author/ route to create a new author
router.post('/', async (req, resp) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        resp.redirect('authors')
    } catch {
        resp.render('authors/new', {
            author: author,
            errorMessage: "Error creating author"
        })
    }
})


module.exports = router
