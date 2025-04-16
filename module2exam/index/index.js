const wrapperDiv = document.getElementById('usersWrap');
const usersUrl = new URL('https://jsonplaceholder.typicode.com/users');

// build userWrap block with all users
async function buildUsersDiv() {
    let users;
    try { // Handle potential errors
        users = await fetch(usersUrl)
            .then((res) => {
                if(!res.ok){
                    throw new Error(`Response error! Status: ${res.status}`);
                }
                return res.json();
            });
    }catch (error){
        console.error('Failed to fetch users: ', error);
        wrapperDiv.innerText = 'Error loading users. Please try again later.';
        return; // exit function if fetch failed
    }

    let rowDiv = null;
    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        const userDiv = document.createElement('div');
        userDiv.classList.add('userDiv');

        const userIdP = document.createElement('p');
        userIdP.innerText = `ID: ${user.id}`;

        const userNameP = document.createElement('p');
        userNameP.innerText = `Name: ${user.name}`;

        const userDetailsBtn = document.createElement('a');
        userDetailsBtn.classList.add('userDetailsBtn');
        userDetailsBtn.href = '../user-details/user-details.html';
        userDetailsBtn.innerText = `USER${user.id}-DETAILS`;
        userDetailsBtn.dataset.userId = user.id; // add userID for event handling

        userDiv.append(userIdP, userNameP, userDetailsBtn);

        const ROW_SIZE = 2;
        if(i % ROW_SIZE === 0){ // create new row for every odd-indexed user(2 users per row)
            rowDiv = document.createElement('div');
            rowDiv.style.display = 'flex';
        }
        rowDiv.appendChild(userDiv);
        if(i % ROW_SIZE === 1 || i === users.length - 1){ // add row into DOM only when it`s full or last user
            wrapperDiv.appendChild(rowDiv);
        }
    }
    await handleBtnEvents();
}

//add events to all buttons
async function handleBtnEvents() {

    const userDetailsButtons = document.querySelectorAll('.userDetailsBtn');
    userDetailsButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            localStorage.setItem('userID', event.target.dataset.userId);
        });
    });
}

buildUsersDiv();