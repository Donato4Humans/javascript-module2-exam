const postDetailsDiv = document.getElementById('postDetailsDiv');

const POST_ID = localStorage.getItem('postID');
const postsUrl = new URL(`https://jsonplaceholder.typicode.com/posts/`);
postsUrl.pathname += POST_ID;

// fetch post and display all it`s properties
async function buildPostDetails(){
    let post;
    try { // Handle potential errors
        post = await fetch(postsUrl)
            .then((res) => {
                if(!res.ok){
                    throw new Error(`Response error! Status: ${res.status}`);
                }
                return res.json();
            });
    }catch (error){
        console.error('Failed to fetch post: ', error);
        postDetailsDiv.innerText = 'Error loading post. Please try again later.';
        return; // exit function if fetch failed
    }

    for (const item in post) {
        const postFieldP = document.createElement('p');
        postFieldP.innerText = `${item}: ${post[item]}`;
        postDetailsDiv.appendChild(postFieldP);
    }

    await displayComments();
}

const commentsDiv = document.getElementById('commentsDiv');
// fetch comments and display them
async function displayComments(){
    let comments;
    try { // Handle potential errors
        const commentsUrl = new URL(postsUrl + `/comments`);
        comments = await fetch(commentsUrl)
            .then((res) => {
                if(!res.ok){
                    throw new Error(`Response error! Status: ${res.status}`);
                }
                return res.json();
            });
    }catch (error){
        console.error('Failed to fetch comments: ', error);
        commentsDiv.innerText = 'Error loading comments. Please try again later.';
        return; // exit function if fetch failed
    }

    commentsDiv.innerHTML = '';
    const COMMENTS_PER_ROW = 4;
    let currentRow = document.createElement('div');

    comments.forEach((comment, index) => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('commentDiv');

        // fill all comment properties
        for (const field in comment) {
            const commentFieldP = document.createElement('p');
            commentFieldP.innerText = `${field}: ${comment[field]}`;
            commentDiv.appendChild(commentFieldP);
        }
        currentRow.appendChild(commentDiv); // add comment into row container

        //append row when it`s full or last comment
        if((index + 1) % COMMENTS_PER_ROW === 0 || index === comments.length - 1){
            commentsDiv.appendChild(currentRow);
            currentRow = document.createElement('div');
        }
    });
}

buildPostDetails();