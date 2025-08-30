// function searchProducts() {
//   const fileInput = document.getElementById("imageUpload").files[0];
//   const urlInput = document.getElementById("imageUrl").value;
//   const preview = document.getElementById("preview");
//   const results = document.getElementById("results");

//   results.innerHTML = "Loading...";

//   if (fileInput) {
//     const reader = new FileReader();
//     reader.onload = function(e) {
//       preview.innerHTML = `<img src="${e.target.result}" />`;
//     };
//     reader.readAsDataURL(fileInput);
//   } else if (urlInput) {
//     preview.innerHTML = `<img src="${urlInput}" />`;
//   }

//   // Call backend (to be implemented)
//   fetch("http://localhost:5000/api/search", {
//     method: "POST",
//     body: fileInput ? fileInput : JSON.stringify({ url: urlInput }),
//     headers: fileInput ? {} : { "Content-Type": "application/json" }
//   })
//   .then(res => res.json())
//   .then(data => {
//     results.innerHTML = "";
//     data.results.forEach(p => {
//       results.innerHTML += `
//         <div class="product-card">
//           <img src="${p.image_url}" />
//           <h4>${p.name}</h4>
//           <p>${p.category}</p>
//           <p>Score: ${p.similarity.toFixed(2)}</p>
//         </div>
//       `;
//     });
//   })
//   .catch(err => {
//     results.innerHTML = "Error fetching results.";
//     console.error(err);
//   });
// }


function searchProducts() {
  const fileInput = document.getElementById("imageUpload").files[0];
  const urlInput = document.getElementById("imageUrl").value;
  const preview = document.getElementById("preview");
  const results = document.getElementById("results");

  results.innerHTML = "Loading...";

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
    fetchOptions = { method: "POST", body: formData };
  } else if (urlInput) {
    fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlInput })
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
            <img src="${p.image_url}" />
            <h4>${p.name}</h4>
            <p>${p.category}</p>
            <p>Score: ${p.similarity.toFixed(2)}</p>
          </div>
        `;
      });
    })
    .catch(err => {
      results.innerHTML = "Error fetching results.";
      console.error(err);
    });
}
