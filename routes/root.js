const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'public', 'file 1.html'))
})
router.get('/new-page(.html)?', (req, resp) => {
    resp.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});
router.get('/oldpage(.html)?', (req, resp) => {
    resp.redirect('/new-page');
});
router.get('/*', (req, resp) => {
    resp.status(404).sendFile(path.join(__dirname, '..', 'views', '404.html'))
})

module.exports = router;