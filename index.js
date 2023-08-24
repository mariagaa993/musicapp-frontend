let card = document.getElementById("card-template");
let dataMovie = [];

const getMovies = (data) => {
    const userId = localStorage.getItem("userId");
    data.map(movie => {
        dataMovie.push(movie);
        const favoriteKey = `favorite-${userId}-${movie.id}`;
        card.innerHTML += `
            <div class="card" style="width: 12rem; margin-bottom:50px">
                <img src="https://image.tmdb.org/t/p/w342/${movie.backdrop_path}" class="card-img-top" alt=${movie.title}>
                <div class="card-body p-2">
                    <h5 style="font-size:18px" class="card-title">${movie.title}</h5>
                    <p class="card-text mb-0">Language: ${movie.original_language}</p>
                    <p class="card-text">Popularity: ${movie.popularity}</p>  
                </div>
                <footer class="p-2">
                    <button style="width:100%;" onclick="saveFavoriteMovie(${movie.id}, this)" 
                        class="btn btn-primary prueba" id="button-${movie.id}">
                        Add Favorite <i class="fa-solid fa-heart"></i></button>
                </footer>  
            </div>`;

        if (localStorage.getItem(favoriteKey)) {
            const button = document.getElementById(`button-${movie.id}`);
            if (button) {
                button.disabled = true;
                button.innerHTML = `Added <i class="fa-solid fa-heart" style="color:red"></i>`;
            }
        }
    });
}

function clearMovies() {
    const cardContainer = document.getElementById('card-template');
    cardContainer.innerHTML = ''; 
}

const saveFavoriteMovie = (id, button) => {
    const userId = localStorage.getItem("userId"); 
    let movieObj;

    dataMovie.map(movie => {
        if(movie.id === id) {
            movieObj = movie;
        }
    })

    fetch("https://musicapp-production-73f6.up.railway.app/api/favoriteMovies/save", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(movieObj)
    })
    .then(res => res.json())
	.then(data => {
        if(data.description === "OK") {
            alert("Added to your favorites successfully");

            const favoriteKey = `favorite-${userId}-${id}`;

            button.disabled = true;
            button.innerHTML = `Added <i class="fa-solid fa-heart" style="color:red"></i>`;
            localStorage.setItem(favoriteKey, 'true');

        } else {
            alert("Ops! There was a problem. Please try again later!")
        }
    }).catch(e => {
        alert("Ops! There was a problem. Please try again later!")
    })
}

const getFavoriteMovies = (data) => {
    data.map(movie => {
        card.innerHTML += `
            <div class="card" style="width: 12rem; margin-bottom:50px">
                <img src="https://image.tmdb.org/t/p/w342/${movie.backdrop_path}" class="card-img-top" alt=${movie.title}>
                <div class="card-body p-2">
                    <h5 style="font-size:18px" class="card-title">${movie.title}</h5>
                    <p class="card-text mb-0">Language: ${movie.original_language}</p>
                    <p class="card-text">Popularity: ${movie.popularity}</p>  
                </div>
                <footer class="p-2">
                    <button style="width:100%;" onclick="deleteFavoriteMovie(${movie.id}, this)" class="btn btn-primary">Delete Favorite</button>
                </footer>  
            </div>`
    });
}

const deleteFavoriteMovie = (id) => {
    const userId = localStorage.getItem("userId");
    const favoriteKey = `favorite-${userId}-${id}`;

    fetch(`https://musicapp-production-73f6.up.railway.app/api/favoriteMovies/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(res => res)
	.then(data => {
        if(data.ok) {
            alert("Removed successfully")
            localStorage.removeItem(favoriteKey);
            window.location.reload()
        } else {
            alert("Ops! There was a problem. Please try again later!")
        }
    }).catch(e => {
        alert("Ops! There was a problem. Please try again later!")
    })
}

const register = (fullname, email, password) => {
    const data = {
        fullName: fullname,
        email: email,
        password: password
    };
  
    fetch("https://musicapp-production-73f6.up.railway.app/api/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        if(data.token) {
            localStorage.setItem("name", data.fullName);
            localStorage.setItem("token", data.token);
            window.location.href = "home.html"   
        } else {
            alert("There is already an account with that email")
        }
    }).catch(e => {
        alert("Ops! There was a problem. Please try again later!")
    })
}

const login = (email, password) => {
    const data = {
        email: email,
        password: password
    };
  
    fetch("https://musicapp-production-73f6.up.railway.app/api/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        if(data.token) {
            localStorage.setItem("userId", data.id);
            localStorage.setItem("name", data.fullName);
            localStorage.setItem("token", data.token)
            window.location.href = "home.html"    
        } else {
            alert("Ops! There was a problem. Please try again later!")
        }
    }).catch(e => {
        alert("Invalid Credentials")
    })
}
