const express = require('express');
const express_graphql = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString, GraphQLNonNullm } = require('graphql');

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

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'All details about a book',
    fields: {
        id: {
            type: GraphQLInt
        },
        title: {
            type: GraphQLString
        },
        pages: {
            type: GraphQLInt
        }
    }
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'All details about an author',
    fields: {
        id: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author, {}, context, info) => {
                console.log('Resolve books for author ...');
                return author.books.map(bookId => books.find(book => book.id === bookId));
            }            
        }
    }
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Entry',
    fields: {
        author: {
            type: AuthorType,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, {id}, context, info) => {
                console.log('Resolve author...');
                return authors.find(a => a.id === id);
            }
        }
    }

});

const schema = new GraphQLSchema({
    query: QueryType
});

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