const Gun = require('gun');
const express = require('express')

const app = express()

app.use(Gun.serve);

const server = app.listen(80);

Gun({ file: 'db/data', web: server });