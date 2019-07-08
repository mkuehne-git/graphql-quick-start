# graphql-quick-start

This is a very simple node demo for `graphQL` using a variant of the author/books example.

The demo contains three apps:

- `app.js` contains _queries_ for authors, books, author by id, and book by id
- `app1.js` adding lazy resolver for `Author.books`
- `app2.js` adding _mutation_ to create a new author and add a book to an author

## Getting Started

1. Copy all the files to your local machine.
2. Open a terminal and `cd` into the target folder of your copy
3. Run `npm install`
4. Edit the file `package.json` and change the `"main"` property to `app.js`, `app1.js` or `app2.js`
5. Run `npm start`
6. Open browser at (http://localhost:4000/graphql)
7. Enter query like

```graphql
{
  authors {
    id
    name
    books {
      title
    }
  }
}
```

## Authors

- **Martin Kühne** - [graphql-quick-start](https://github.com/mkuehne-git/graphql-quick-start)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/mkuehne-git/graphql-quick-start/blob/master/LICENSE) file for details