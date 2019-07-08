const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

const authors = [
    { id: 1, name: 'Author 1', age: 35, books: [1] },
    { id: 2, name: 'Author 2', age: 42, books: [1, 2, 3] },
    { id: 3, name: 'Author 3', age: 63, books: [2, 3] },
];

const books = [
    { id: 1, title: 'First Book' },
    { id: 2, title: 'Second Book' },
    { id: 3, title: 'Third Book' },
];

const schema = buildSchema(`
   type Author {
       id: Int,
       name: String,
       age: Int,
       books: [Book]
   },
   type Book {
       id: Int,
       title: String,
       pages: Int
   },
   type Query {
       author(id: Int!): Author,
       authors: [Author],
       book(id: Int!): Book,
       books: [Book]
   } 
`);

const resolvers = {
    author: ({ id }) => { return authors.find(author => author.id === id) },
    authors: authors,
    book: ({ id }) => { return books.find(book => book.id === id) },
    books: books
}

const app = express();
app.use('/graphql', express_graphql({
    schema,
    rootValue: resolvers,
    graphiql: true
}));

app.listen(4000, () => console.log('🚀 Runs on localhost:4000/graphql'));