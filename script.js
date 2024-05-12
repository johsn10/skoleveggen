async function createPostsInHtml() {
  var postsDiv = document.getElementById("posts");

  const posts = await getPosts();

  for (const i in posts) {
    const heading = posts[i].heading;
    const content = posts[i].content;
    const id = posts[i].id;

    const postDiv = await assemblePostDiv(heading, content, id);

    postsDiv.appendChild(postDiv);
  }
}

async function assemblePostDiv(headingStr, contentStr, postId) {
  // Opprett emne div-en
  const heading = document.createElement("h3");
  const headingTextNode = document.createTextNode(headingStr);
  heading.appendChild(headingTextNode);

  // Oprett innholds div-en
  const content = document.createElement("p");
  const contentTextNode = document.createTextNode(contentStr);
  content.appendChild(contentTextNode);

  // Opprett stemme knapper
  const upvoteTextNode = document.createTextNode("👍");
  const upvoteButton = document.createElement("button");
  upvoteButton.appendChild(upvoteTextNode);
  upvoteButton.id = postId;
  upvoteButton.class = "upvote"
  upvoteButton.onclick = onVote;

  const downvoteTextNode = document.createTextNode("👎");
  const downvoteButton = document.createElement("button");
  downvoteButton.appendChild(downvoteTextNode);
  downvoteButton.id = postId;
  downvoteButton.class = "downvote";
  downvoteButton.onclick = onVote;

  // Opprett voteScore
  const voteScore = await getVoteScore(postId);
  console.log(voteScore);
  const voteScoreTextNode = document.createTextNode(`Karma: ${voteScore}`);
  const voteScoreElement = document.createElement("p");
  voteScoreElement.appendChild(voteScoreTextNode);

  // Samle inni postDiv
  const postDiv = document.createElement("div");
  postDiv.appendChild(heading);
  postDiv.appendChild(content);

  postDiv.appendChild(upvoteButton);
  postDiv.appendChild(downvoteButton);
  postDiv.classList.add("postDiv");
  postDiv.appendChild(voteScoreElement);

  return postDiv;
}

async function onVote(event) {
  const id = event.target.id;
  const isUpvote = event.target.class == "upvote";
  
  if (!originalVote(id)) {
    alert("Du har allerede stemt på dette innlegget")
    return;
  } else {
    addVoteCookie(id);
  }

  const response = await fetch(`https://even-forum.vercel.app/api/votes/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      isUpvote: isUpvote,
    })
  });
  location.reload()
}

async function getPosts() {
  const response = await fetch("https://even-forum.vercel.app/api/posts");
  const posts = await response.json();
  return posts;
}

async function getVoteScore(postId) {
  const response = await fetch(`https://even-forum.vercel.app/api/votes/${postId}`);
  const responseJson = await response.json();
  const voteScore = responseJson.voteScore;
  return voteScore;
}

function addVoteCookie(postId) {
  document.cookie = `${postId}=true; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
}

function originalVote(postId) {
  const votes = document.cookie.split(";");
  for (const i in votes) {
    const voteId = votes[i].split("=")[0].trim();
    if (voteId == postId) {
      return false;
    }
  }
  return true;
}

window.onload = createPostsInHtml;