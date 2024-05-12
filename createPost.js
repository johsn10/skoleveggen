async function formOnSubmit() {
  const form = document.getElementById("form");
  
  const heading = form.heading.value;
  const content = form.content.value;
  
  if (heading=="" || content=="") {
    alert("Mangler innhold")
    return
  }
  
  await createPost(heading, content);
  // Stopp reload
  return false;
}

async function createPost(heading, content) {
  console.log("Opprett innlegg med verdiene: " + heading + " og " + content);
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
