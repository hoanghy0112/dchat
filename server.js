const Gun = require('gun');
const express = require('express')

const app = express()

app.use(Gun.serve);

const server = app.listen(8765);

Gun({ file: 'db/data', web: server });