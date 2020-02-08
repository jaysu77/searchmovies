$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    let types= $('#SearchType').val();
    let searchBydata= $('#searchBydata').val();
    let searchByYear=searchBydata.substring(0, 4);
    getMovies(searchText,types,searchByYear);
    e.preventDefault();
  });
});

function getMovies(searchText,types,searchByYear){
  axios.get('http://www.omdbapi.com?apikey=ea27422b&type='+types+'&s='+searchText+'&y='+searchByYear)
    .then((response) => {
      console.log(response);
      let movies = response.data.Search;
      let notFound=response.data.Error;

      let output = '';
      if(movies === undefined){
        $('#moviesnotFound').html(notFound);
      }
      else{
        $('#moviesnotFound').html("");
      $.each(movies, (index, movie) => {
        output += `
        <div class="col-md-3">
           <div class="card">
              <img class="img-card" src="${movie.Poster}" alt="${movie.Title}">
              <div class="card-content">
              <h4 class="card-title">${movie.Title}</div>
              <div class="card-button">
              <a onclick="movieSelected('${movie.imdbID}')" class="custom-btn btn btn-primary" href="#">Movie Details</a>
              </div>
              </div>
           </div>
        </div>
        `;
      });
    }
      $('#movies').html(output);

    })
    .catch((err) => {

      console.log(err);
    });
}

function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovie(){
  let movieId = sessionStorage.getItem('movieId');

  axios.get('http://www.omdbapi.com?apikey=ea27422b&i='+movieId)
    .then((response) => {
      console.log(response);
      let movie = response.data;

      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}
