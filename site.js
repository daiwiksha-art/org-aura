(() => {
  const galleryGrid = document.getElementById("galleryGrid");
  const blogList = document.getElementById("blogList");

  const adminPassword = document.getElementById("adminPassword");
  const adminGalleryForm = document.getElementById("adminGalleryForm");
  const adminBlogForm = document.getElementById("adminBlogForm");
  const adminStatus = document.getElementById("adminStatus");

  const parallaxSections = document.querySelectorAll(".parallax");
  if (parallaxSections.length) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      parallaxSections.forEach((section, index) => {
        const depth = 0.08 + index * 0.02;
        section.style.backgroundPositionY = `${-scrolled * depth}px`;
      });
    });
  }

  function setStatus(message, isError = false) {
    if (!adminStatus) return;
    adminStatus.textContent = `Status: ${message}`;
    adminStatus.style.color = isError ? "#b00020" : "#0f6a43";
  }

  async function loadGallery() {
    if (!galleryGrid) return;
    try {
      const response = await fetch("/api/gallery");
      const items = await response.json();
      if (!Array.isArray(items) || items.length === 0) {
        galleryGrid.innerHTML = "<p>No gallery images available yet.</p>";
        return;
      }
      galleryGrid.innerHTML = items
        .map(
          (item) =>
            `<article class="card"><img src="${item.imageUrl}" alt="Gallery image" loading="lazy" /></article>`
        )
        .join("");
    } catch (_error) {
      galleryGrid.innerHTML = "<p>Unable to load gallery right now.</p>";
    }
  }

  function formatDate(rawDate) {
    const date = new Date(rawDate);
    return Number.isNaN(date.getTime()) ? rawDate : date.toLocaleDateString();
  }

  async function loadBlogs() {
    if (!blogList) return;
    try {
      const response = await fetch("/api/blogs");
      const items = await response.json();
      if (!Array.isArray(items) || items.length === 0) {
        blogList.innerHTML = "<p>No blog posts yet.</p>";
        return;
      }
      blogList.innerHTML = items
        .map((item) => {
          const imageMarkup = item.imageUrl
            ? `<p><img src="${item.imageUrl}" alt="${item.title}" loading="lazy" style="max-width:100%;border-radius:14px;" /></p>`
            : "";
          return `
            <article class="card">
              <h3>${item.title}</h3>
              <p><strong>${formatDate(item.date)}</strong></p>
              ${imageMarkup}
              <p>${item.content}</p>
            </article>
          `;
        })
        .join("");
    } catch (_error) {
      blogList.innerHTML = "<p>Unable to load blog posts right now.</p>";
    }
  }

  if (adminGalleryForm) {
    adminGalleryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const password = adminPassword ? adminPassword.value.trim() : "";
      const imagesInput = document.getElementById("adminGalleryImages");
      const files = imagesInput ? imagesInput.files : null;
      if (!password) {
        setStatus("Admin password is required.", true);
        return;
      }
      if (!files || !files.length) {
        setStatus("Select at least one image.", true);
        return;
      }

      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("images", file));

      try {
        const response = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "x-admin-password": password },
          body: formData,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Upload failed.");
        setStatus("Gallery images uploaded successfully.");
        adminGalleryForm.reset();
      } catch (error) {
        setStatus(error.message || "Gallery upload failed.", true);
      }
    });
  }

  if (adminBlogForm) {
    adminBlogForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const password = adminPassword ? adminPassword.value.trim() : "";
      const title = document.getElementById("adminBlogTitle").value.trim();
      const date = document.getElementById("adminBlogDate").value;
      const content = document.getElementById("adminBlogContent").value.trim();
      const imageFile = document.getElementById("adminBlogImage").files[0];
      if (!password) {
        setStatus("Admin password is required.", true);
        return;
      }
      if (!title || !date || !content) {
        setStatus("Title, date, and content are required.", true);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      try {
        const response = await fetch("/api/admin/blogs", {
          method: "POST",
          headers: { "x-admin-password": password },
          body: formData,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Publish failed.");
        setStatus("Blog post published successfully.");
        adminBlogForm.reset();
      } catch (error) {
        setStatus(error.message || "Blog publish failed.", true);
      }
    });
  }

  loadGallery();
  loadBlogs();
})();
