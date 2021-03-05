const fetch = require('node-fetch');
require("dotenv").config();

const allMoviesQuery = `query {
    AllMovies {
      id
      image {
        url
      }
      content
      title
      createdAt
      tags
    }
  }
  `;

/**
 * GraphQL API call
 * @param {string} query - graphQL query 
 * @returns {Promise} - API json response
 */
async function getReviewsFromApi(query) {

    const apiUrl = process.env.API_URL;
    const apiKey = process.env.API_KEY;

    const json = await fetch(apiUrl, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        "body": JSON.stringify({query: query})
        })
        .then(response => response.json())
        .then(json => json.data)
        .catch(err => console.error(err));
    
    return json.AllMovies;
}

/**
 * Create object with reviews classified by tag
 * @param {Array} reviews - List of reviews
 * @returns {Object} - Key: tag, value: array of reviews containing this tag
 */
function getTagList(reviews) {

  let tagList = {};

  for (const review of reviews) {    
    for (const tag of review.tags) {

      if (tag in tagList) {        
        tagList[tag].push(review);
      } else {
        tagList[tag] = [review];
      }
    }
  }

  return tagList;
};

/**
 * Gets data accessible for templates
 * @returns {Object} - list of reviews and list of tags
 */
module.exports = async function getReviews() {
  const reviews = await getReviewsFromApi(allMoviesQuery);

  const tagList = getTagList(reviews);
  
  const result = {
    list: reviews,
    tagList: tagList,
  };

  return result
}
