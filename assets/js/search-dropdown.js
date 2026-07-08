document.addEventListener("DOMContentLoaded", async () => {

    const trigger = document.querySelector(".search-trigger");
    const panel = document.querySelector(".search-panel");
    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");

    if (!trigger || !panel || !input || !results) return;

    let posts = [];

    try {
        const res = await fetch("/index.json");
        posts = await res.json();
    } catch (e) {
        console.error("Không tải được index.json", e);
    }

    trigger.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        panel.classList.toggle("active");

        if (panel.classList.contains("active")) {
            setTimeout(() => input.focus(), 100);
        }
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-dropdown")) {
            panel.classList.remove("active");
        }
    });

    input.addEventListener("input", () => {

        const keyword = input.value.trim().toLowerCase();

        if (!keyword) {
            results.innerHTML = "";
            return;
        }

        const matched = posts.filter(post =>
            (post.title || "").toLowerCase().includes(keyword) ||
            (post.summary || "").toLowerCase().includes(keyword) ||
            (post.content || "").toLowerCase().includes(keyword)
        );

        results.innerHTML = matched.slice(0,5).map(post => `
            <a class="search-result" href="${post.permalink}">
                <div class="search-result-title">${post.title}</div>
                <div class="search-result-desc">
                    ${(post.summary || "").replace(/<[^>]+>/g,"").substring(0,80)}...
                </div>
            </a>
        `).join("");

    });

});