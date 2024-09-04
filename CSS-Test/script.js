async function fetchImages() {
  try {
    const response = await fetch("https://picsum.photos/v2/list?limit=30");
    const images = await response.json();

    const container = document.getElementById("image-container");

    images.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.download_url;
      img.className = "image-size";
      img.style.width = `${(image.width / image.height) * 150}px`;
      container.appendChild(img);
    });
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

fetchImages();
