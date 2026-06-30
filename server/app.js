const express = require('express');
const app = express();
const port = 3000;

app.get('/api/health',(req,res) =>{
  res.json({ status : 'I am working fine' });
});

app.listen(port, () =>{
  console.log(`Server is runining on port ${port}`);
});