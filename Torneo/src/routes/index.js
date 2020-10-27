const { Router } = require('express');
const router = Router();
const path = require('path');
//Routes
router.get('/', (req, res) => {
    res.sendfile(path.resolve(__dirname+'/index.html'));
})

router.get('/test', (req, res) => {
    const data = {
        "Tipo": "TEST",
        "Microservicio":"Torneo"
    };
    res.send(data);
})

module.exports = router;