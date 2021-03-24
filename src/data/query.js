module.exports = allMoviesQuery = `query {
    AllMovies {
      id
      image {
        url
      }
      content {
        html
      }
      title
      createdAt
      tags
    }
  }
  `;