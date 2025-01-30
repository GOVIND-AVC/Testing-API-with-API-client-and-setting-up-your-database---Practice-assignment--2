const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const port = 3000;
const app = express();
app.use(bodyParser.json());

const datapath = path.join(__dirname, 'data.json');


const readdata = () => {
  const data = fs.readFileSync(datapath, 'utf-8');
  return JSON.parse(data);
}


const writedata = (data) => {
  fs.writeFileSync(datapath, JSON.stringify(data, null, 2));
}

app.post('/books',(req,res)=>{
  const newbook = req.body;
  const books=readdata();
  books.push(newbook);
  writedata(books);
  res.status(201).json(newbook);
})

app.get('/books',(req,res)=>{
  const books=readdata();
  res.json(books);
})

app.get('/books/:id',(req,res)=>{
  const books =  readdata()
  const book = books.find(b=>b.book_id ===  req.params.id);
  if(book){
    res.json(book);
  }
  else{
    res.status(404).json({message:'book not found'})
  }
})


app.put('/books/:id',(req,res)=>{
  const books = readdata();
  const index = books.findIndex(b=>b.book_id===req.params.id);
  if(index!==-1){
    const updatedBook = { ...books[index], ...req.body};
    books[index] = updatedBook;
    writedata(books);
    res.json(updatedBook)
}
else{
  res.status(404).json({message:'book not found'})}
})


app.delete('/books/:id', (req, res) => {
  const books = readdata();
  const index = books.findIndex(b => b.book_id === req.params.id);
  if (index !== -1) {
    books.splice(index, 1);
    writedata(books);
    res.json({ message: 'Book deleted' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
