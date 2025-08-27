document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".vn-card[data-audio]");
  const aksesJam = 22; // jam akses default

  cards.forEach(card => {
    const date = card.getAttribute("data-date");  
    const audioSrc = card.getAttribute("data-audio"); 
    const countdownEl = card.querySelector(".countdown");
    const btn = card.querySelector(".play-btn");

    // Tambahin elemen player (seek + time)
    const controls = document.createElement("div");
    controls.classList.add("vn-controls");
    controls.innerHTML = `
      <input type="range" class="seek-bar" value="0" step="1">
      <div class="time-display">0:00 / 0:00</div>
    `;
    card.appendChild(controls);

    const seekBar = controls.querySelector(".seek-bar");
    const timeDisplay = controls.querySelector(".time-display");

    // Buat audio player khusus per card
    const player = new Audio(audioSrc);

    // Countdown logic
    const targetTime = new Date(date + "T" + String(aksesJam).padStart(2, "0") + ":00:00");

    function updateCountdown() {
      const now = new Date();
      const diff = targetTime - now;

      if (diff <= 0) {
        countdownEl.innerHTML = "✅ Sudah waktunya!";
        btn.disabled = false;
        btn.innerText = "▶️ Putar VN";
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        countdownEl.innerHTML = `⏳ ${h} jam ${m} menit ${s} detik`;
      }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Tombol play/pause
    btn.addEventListener("click", () => {
      if (player.paused) {
        player.play();
        btn.innerText = "⏸️ Pause";
      } else {
        player.pause();
        btn.innerText = "▶️ Putar VN";
      }
    });

    // Pas metadata siap, set max seek bar
    player.addEventListener("loadedmetadata", () => {
      seekBar.max = player.duration;
      updateTimeDisplay();
    });

    // Update waktu + seek bar
    player.addEventListener("timeupdate", () => {
      seekBar.value = player.currentTime;
      updateTimeDisplay();
    });

    // Seek manual
    seekBar.addEventListener("input", () => {
      player.currentTime = seekBar.value;
    });

    // Reset setelah selesai
    player.addEventListener("ended", () => {
      btn.innerText = "▶️ Putar VN";
    });

    // Format waktu
    function updateTimeDisplay() {
      const formatTime = (sec) => {
        if (isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
      };
      timeDisplay.textContent =
        `${formatTime(player.currentTime)} / ${formatTime(player.duration)}`;
    }
  });

  // Modal foto
  const modalImage = document.getElementById("modalImage");
  document.querySelectorAll(".preview-img").forEach(img => {
    img.addEventListener("click", () => {
      const src = img.getAttribute("data-src");
      modalImage.setAttribute("src", src);
    });
  });
});


