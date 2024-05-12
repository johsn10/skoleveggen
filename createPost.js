async function formOnSubmit() {
  const form = document.getElementById("form");
  
  const heading = form.heading.value;
  const content = form.content.value;
  await createPost(heading, content);

  // Stop reload
  return false;
}

async function createPost(heading, content) {
  console.log("Create post with values: " + heading + " and " + content);
  const result = await fetch("https://even-forum.vercel.app/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      heading: heading,
      content: content,
    }),
  });
  console.log(result);
}
