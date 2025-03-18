const userDiv = document.getElementById('userDetails');
const USER_ID = +localStorage.getItem('userID');

// fetch current user and display all properties
async function displayUserDetails(){
    let user;
    try { // Handle potential errors
        user = await fetch(`https://jsonplaceholder.typicode.com/users/${USER_ID}`)
            .then((res) => {
                if(!res.ok){
                    throw new Error(`Response error! Status: ${res.status}`);
                }
                return res.json();
            });
    }catch (error){
        console.error('Failed to fetch user: ', error);
        userDiv.innerText = 'Error loading user. Please try again later.';
        return; // exit function if fetch failed
    }

    userDiv.innerHTML = '';
    renderUserDetails(user, userDiv);

    await addPostsButtons();
}

// recursively divides complex properties into simple and displays them via paragraphs with proper indentation
function renderUserDetails(data, targetElement, prefix = ''){
    for (const key in data){
        if (typeof data[key] === 'object' && data[key] !== null){
            // create block for complex object with key
            const complexDiv = document.createElement('div');
            complexDiv.innerText = `${prefix}${key}: `;
            targetElement.appendChild(complexDiv);

            // recursive call to display complex properties with increased indentation
            renderUserDetails(data[key], complexDiv, `${prefix}  `);
        }else{
            // display simple properties in paragraph element
            const p = document.createElement('p');
            p.innerText = `${prefix}${key}: ${data[key]}`;
            targetElement.appendChild(p);
        }
    }
}

const postsSection = document.getElementById('postsDiv');
const POSTS_PER_ROW = 5;

async function addPostsButtons(){
    let posts;
    try { // Handle potential errors
        posts = await fetch(`https://jsonplaceholder.typicode.com/users/${USER_ID}/posts`)
            .then((res) => {
                if(!res.ok){
                    throw new Error(`Response error! Status: ${res.status}`);
                }
                return res.json();
            });
    }catch (error){
        console.error('Failed to fetch posts: ', error);
        postsSection.innerText = 'Error loading posts. Please try again later.';
        return; // exit function if fetch failed
    }

    const postsButton = document.createElement('button');
    postsButton.innerText = 'posts of current user';
    userDiv.appendChild(postsButton);

    postsButton.onclick = async function (){
        postsSection.innerHTML = '';
        let currentRow = document.createElement('div');

        posts.forEach((post, index) => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('postDiv');

            const postTitleP = document.createElement('p');
            postTitleP.innerText = post.title;

            const postDetailsBtn = document.createElement('a');
            postDetailsBtn.innerText = `post-details${index + 1}`;
            postDetailsBtn.href = 'post-details.html';
            postDetailsBtn.classList.add('postDetailsBtn');
            postDetailsBtn.dataset.postId = post.id;

            postDiv.append(postTitleP, postDetailsBtn);
            currentRow.appendChild(postDiv);

            // append row when it`s full or last post
            if((index + 1) % POSTS_PER_ROW === 0 || index === posts.length - 1){
                postsSection.appendChild(currentRow);
                currentRow = document.createElement('div');
            }
        });
        await handlePostsButtons();
    }
}

async function handlePostsButtons(){

    const postDetailsButtons = document.querySelectorAll('.postDetailsBtn');
    postDetailsButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            localStorage.setItem('postID', event.target.dataset.postId);
        });
    });
}

displayUserDetails();