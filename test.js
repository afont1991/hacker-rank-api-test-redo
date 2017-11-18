import superagent from 'superagent';

function makeRequest(searchString, page){
  return new Promise((resolve, reject) => {
    var requestPage = '';
    if(page){
      requestPage = `&page=${page}`;
    }
    var url = `https://jsonmock.hackerrank.com/api/movies/search/?Title=${searchString}${requestPage}`
    console.log(url);
    superagent
      .get(url)
      .end(function(err, response){
        if(err){
          return reject(err)
        } else {
          return resolve(response.body)
        }
      });
  });
}

function movieSearch(subString){
  //initial request
  var titles = [];
  var pages = 0;
  var requestPromisesArray = []
  makeRequest(subString).then((response)=>{
    response.data.forEach((movie) => {
      titles.push(movie.Title);
    });
    for (var i = 1; i < response.total_pages; i++) {
      var pageNum = i + i;
      requestPromisesArray.push(
        makeRequest(subString, pageNum).then((response)=>{
          response.data.forEach((movie) => {
            titles.push(movie.Title);
          });
        })
      );
    };
    return Promise.all(requestPromisesArray);
  }).then(()=>{
    titles.sort();
    console.log(titles)
  }).catch((err)=>{
    console.log(err)
  })
}

movieSearch('spiderman');
