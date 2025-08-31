function searchProducts() {
  const fileInput = document.getElementById("imageUpload").files[0];
  const urlInput = document.getElementById("imageUrl").value;
  const preview = document.getElementById("preview");
  const results = document.getElementById("results");
  const numResults = document.getElementById("numResults").value;

  results.innerHTML = "Loading...";

  // Show preview
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = `<img src="${e.target.result}" />`;
    };
    reader.readAsDataURL(fileInput);
  } else if (urlInput) {
    preview.innerHTML = `<img src="${urlInput}" />`;
  }

  // Build fetch options
  let fetchOptions;
  if (fileInput) {
    const formData = new FormData();
    formData.append("file", fileInput);
    formData.append("limit", numResults);
    fetchOptions = { method: "POST", body: formData };
  } else if (urlInput) {
    fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlInput, limit: numResults })
    };
  } else {
    results.innerHTML = "Please upload an image or paste a URL.";
    return;
  }

  // Call backend
  fetch("http://localhost:5000/api/search", fetchOptions)
    .then(res => res.json())
    .then(data => {
      results.innerHTML = "";

      if (!data.results || data.results.length === 0) {
        results.innerHTML = "<p>No similar products found.</p>";
        return;
      }

      data.results.forEach(p => {
        results.innerHTML += `
          <div class="product-card">
            <img src="${p.image_url}" alt="${p.name}">
            <div class="info">
              <p class="name">${p.name}</p>
              <p class="category">${p.category}</p>
              <p class="score">Score: ${p.similarity.toFixed(2)}</p>
            </div>
          </div>
        `;
      });
    })
    .catch(err => {
      results.innerHTML = "Error fetching results.";
      console.error(err);
    });
}
