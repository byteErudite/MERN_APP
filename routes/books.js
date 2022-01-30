const express = require("express")
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

const multer = require('multer')
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callBack) => {
        callBack(null, imageMimeTypes.includes(file.mimetype))
    }
})

// Route for getting all books
router.get('/',async (req, resp) => {
    try {
        let query = Book.find();
        if (req.query.title != null && req.query.title !== '') {
            query = query.regex('title', new RegExp(req.query.title, 'i'))
        }
        if (req.query.publishedAfterDate != null && req.query.publishedAfterDate !== '') {
            query = query.gte('publishedDate', req.query.publishedAfterDate)
        }

        if (req.query.publishedBeforeDate != null && req.query.publishedBeforeDate !== '') {
            query = query.lte('publishedDate', req.query.publishedBeforeDate)
        }

        if (req.query.pageCount != null && req.query.pageCount !== '') {
            //console.log("page count : " , req.query.pageCount)
            query = query.gte('pageCount', req.query.pageCount)
        }
        const books = await query.exec()
        resp.render("books/index", {
            books: books,
            searchOptions: req.query
        })
    } catch(err) {
        console.log(err)
        resp.redirect("/")
    }
})


// Route for the new book
router.get('/new', async (req, resp) => {
   renderNewBook(resp, new Book())
})


// Route for creating a new book
router.post('/', upload.single('cover'), async (req, resp) => {
    console.log("upload path : ", uploadPath)
    const filename = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author.trim(),
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: filename
    })
    console.log("the book created is : ",book);
    
    try {
        const newBook = await book.save()
        resp.redirect('books')
    } catch(err) {
        //console.log(err)
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
          }
        renderNewBook(resp, new Book(), true)
    }
})

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
      if (err) console.error(err)
    })
  }

const renderNewBook = async (resp, book, hasError = false) => {
    try {
        const authors = await Author.find({});
        const params = {
            book:book,
            authors:authors
        }
        if (hasError) {
            params.errorMessage = 'Error creating the book'
        }
        resp.render('books/new', params)
    } catch {
        resp.redirect('/books', {
            errorMessage: errorMessage
        })
    }
}


module.exports = router
