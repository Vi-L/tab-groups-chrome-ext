document.addEventListener("DOMContentLoaded", event => {

  const paragraphs = document.querySelectorAll("p")
  let readingTime = 0

  // visible in the webpage's devtools console

  paragraphs.forEach(p => {
    const wordCount = p.innerText.split(/\s+/).length
    readingTime += wordCount / 2
  })
  //console.log("reading time:", readingTime, "sec")

  // visible in the webpage's DOM
  // const p = document.createElement("p");
  // document.body.prepend(p);
  // p.classList.add("cookie");
  // p.textContent = `Estimated Reading Time: ${readingTime / 60} minutes, ${readingTime % 60} seconds`;
});

