const express = require('express');
const express_graphql = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');

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
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        pages: { type: GraphQLInt }
    }
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'All details about an author',
    fields: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author, { }, context, info) => {
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
            args: { id: { type: GraphQLInt } },
            resolve: (parent, { id }, context, info) => {
                console.log('Resolve author...');
                return authors.find(a => a.id === id);
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve: () => {
                console.log("Resolve all authors");
                return authors;
            }
        }
    }

});

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Change data.',
    fields: {
        createAuthor: {
            type: AuthorType,
            description: 'Creates a new author.',
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Name of the author to create.'
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt),
                    description: 'The age of the author.'
                }
            },
            resolve: (parent, { name, age }, context, info) => {
                console.log('Create author...');
                const author = {
                    id: authors.length + 1, name, age,
                    books: []
                };
                authors.push(author);

                return author;
            }
        },
        addBook: {
            type: AuthorType,
            description: 'Add existing book to author.',
            args: {
                authorId: {
                    type: new GraphQLNonNull(GraphQLInt),
                    description: 'Id of author.'
                },
                bookId: {
                    type: new GraphQLNonNull(GraphQLInt),
                    description: 'Id of book to add.'
                }
            },
            resolve: (parent, { authorId, bookId }, context, info) => {
                console.log(`addBook authorId: ${authorId}, bookId: ${bookId}`)
                const author = authors.find(a => a.id === authorId);
                if (!author) {
                    throw new Error(`Author with id: ${authorId} not found.`);
                }
                if (author.books.indexOf(bookId) >= 0) {
                    throw new Error(`Book with id: ${bookId} is already assigned to author with id: ${authorId}.`);
                }
                author.books.push(bookId);

                return author;
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
});

const app = express();
app.use('/graphql', express_graphql({
    schema,
    // rootValue: resolvers,
    graphiql: true
}));

app.listen(4000, () => console.log('🚀 Listen on localhost:4000/graphql'));