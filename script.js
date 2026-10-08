(() => {
  "use strict";

  const loader = document.getElementById("loader");
  const app = document.getElementById("app");
  const percent = document.getElementById("loadPercent");
  const loadBar = document.getElementById("loadBar");
  const loadState = document.getElementById("loadState");
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const paperStorm = document.getElementById("paperStorm");
  const navigationLinks = document.querySelectorAll("[data-target]");
  const form = document.getElementById("applicationForm");
  const feedback = document.getElementById("formFeedback");
  const personnelDialog = document.getElementById("personnelPaper");
  const paperRole = document.getElementById("paperTitle");
  const paperUsername = document.getElementById("paperUsername");
  const paperProfile = document.getElementById("paperProfile");
  const paperProfileUrl = document.getElementById("paperProfileUrl");

  const personnelRecords = {
    berke: { role: "BİRİM ŞEFİ", username: "Berke_9801", profile: "https://www.roblox.com/tr/users/3491754780/profile" },
    sadecetanjiro: { role: "SAHA ŞEFİ", username: "Sadecetanjiro47", profile: "https://www.roblox.com/tr/users/2982005726/profile" },
    benpaigo: { role: "SAHA ŞEFİ", username: "Benpaigo", profile: "https://www.roblox.com/tr/users/4663981444/profile" },
  };

  let audioContext;
  let currentProgress = 0;

  const systemStatuses = {
    active: { label: "AKTİF", color: "#a9d887" },
    inactive: { label: "İNAKTİF", color: "#d27569" },
    maintenance: { label: "BAKIMDA", color: "#ffcc66" },
  };

  function syncSystemStatus() {
    document.querySelectorAll(".status-card[data-status]").forEach((card) => {
      const status = systemStatuses[card.dataset.status] || systemStatuses.active;
      const statusText = card.querySelector("#statusText");
      if (!statusText) return;

      statusText.innerHTML = `<i aria-hidden="true"></i> ${status.label}`;
      statusText.style.color = status.color;
      const indicator = statusText.querySelector("i");
      indicator.style.backgroundColor = status.color;
      indicator.style.boxShadow = `0 0 9px ${status.color}`;
    });
  }

  function finishLoading() {
    loadState.textContent = "Yükleniyor..";
    loadState.style.color = "var(--cyan)";

    window.setTimeout(() => {
      loader.classList.add("is-leaving");
      app.classList.add("is-ready");
      app.setAttribute("aria-hidden", "false");
      document.body.classList.remove("is-loading");
      window.setTimeout(() => loader.remove(), 900);
    }, 640);
  }

  function startLoader() {
    const timer = window.setInterval(() => {
      const remaining = 100 - currentProgress;
      const step = currentProgress < 72 ? Math.ceil(Math.random() * 6) : Math.max(1, Math.ceil(remaining / 6));
      currentProgress = Math.min(100, currentProgress + step);
      percent.textContent = `${String(currentProgress).padStart(3, "0")}%`;
      loadBar.style.width = `${currentProgress}%`;

      if (currentProgress >= 100) {
        window.clearInterval(timer);
        finishLoading();
      }
    }, 88);
  }

  function isCompactLayout() {
    return window.matchMedia("(max-width: 880px)").matches;
  }

  function closeMobileMenu() {
    sidebar.classList.remove("is-mobile-open");
    mobileMenu?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function toggleMobileMenu() {
    const nextState = !sidebar.classList.contains("is-mobile-open");
    sidebar.classList.toggle("is-mobile-open", nextState);
    mobileMenu?.setAttribute("aria-expanded", String(nextState));
    document.body.style.overflow = nextState ? "hidden" : "";
  }

  function toggleSidebar() {
    if (isCompactLayout()) {
      toggleMobileMenu();
      return;
    }

    const isCollapsed = document.body.classList.toggle("sidebar-collapsed");
    menuToggle?.setAttribute("aria-expanded", String(!isCollapsed));
    menuToggle?.setAttribute("aria-label", isCollapsed ? "Menüyü genişlet" : "Menüyü daralt");
  }

  function playPaperSound() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;

    audioContext ||= new AudioCtor();
    if (audioContext.state === "suspended") audioContext.resume();

    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    const oscillator = audioContext.createOscillator();
    const filter = audioContext.createBiquadFilter();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(920, now);
    oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.11);
    filter.type = "highpass";
    filter.frequency.value = 420;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.016);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    oscillator.connect(filter).connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.16);
  }

  function makePaperStorm() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    paperStorm.replaceChildren();
    const compact = isCompactLayout();
    const amount = compact ? 24 : 36;

    for (let index = 0; index < amount; index += 1) {
      const paper = document.createElement("span");
      paper.className = "paper";
      const width = (compact ? 96 : 120) + Math.random() * (compact ? 65 : 105);
      const height = (compact ? 128 : 150) + Math.random() * (compact ? 88 : 115);
      paper.style.setProperty("--x", `${Math.random() * 96}vw`);
      paper.style.setProperty("--y", `${-8 - Math.random() * 38}vh`);
      paper.style.setProperty("--w", `${width.toFixed(0)}px`);
      paper.style.setProperty("--h", `${height.toFixed(0)}px`);
      paper.style.setProperty("--drift", `${Math.round(-48 + Math.random() * 96)}px`);
      paper.style.setProperty("--rotate", `${Math.round(-75 + Math.random() * 150)}deg`);
      paper.style.setProperty("--land", `${Math.round(-15 + Math.random() * 30)}deg`);
      paper.style.setProperty("--duration", `${(1.25 + Math.random() * 0.7).toFixed(2)}s`);
      paper.style.setProperty("--delay", `${(Math.random() * 0.32).toFixed(2)}s`);
      paperStorm.appendChild(paper);
    }

    window.setTimeout(() => paperStorm.replaceChildren(), 2350);
  }

  function openPersonnelPaper(memberId) {
    const record = personnelRecords[memberId];
    if (!record || !personnelDialog) return;

    paperRole.textContent = record.role;
    paperUsername.textContent = record.username;
    paperProfile.href = record.profile;
    paperProfileUrl.textContent = record.profile.replace(/^https:\/\//, "");
    personnelDialog.showModal();
  }

  function navigateTo(targetId, shouldAnimate = true) {
    const target = document.getElementById(targetId);
    if (!target) return;

    document.querySelectorAll(".menu__item").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.target === targetId);
    });

    if (shouldAnimate) {
      makePaperStorm();
      playPaperSound();
    }

    if (isCompactLayout()) closeMobileMenu();

    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, shouldAnimate ? 140 : 0);
  }

  navigationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.dataset.target;
      if (!targetId) return;
      event.preventDefault();
      navigateTo(targetId);
    });
  });

  menuToggle?.addEventListener("click", toggleSidebar);
  mobileMenu?.addEventListener("click", toggleMobileMenu);

  document.querySelectorAll(".personnel-open").forEach((button) => {
    button.addEventListener("click", () => openPersonnelPaper(button.dataset.member));
  });

  personnelDialog?.querySelector(".personnel-paper__close")?.addEventListener("click", () => personnelDialog.close());
  personnelDialog?.addEventListener("click", (event) => {
    if (event.target === personnelDialog) personnelDialog.close();
  });

  document.addEventListener("click", (event) => {
    if (!isCompactLayout() || !sidebar.classList.contains("is-mobile-open")) return;
    const clickedSidebar = sidebar.contains(event.target);
    const clickedButton = mobileMenu?.contains(event.target);
    if (!clickedSidebar && !clickedButton) closeMobileMenu();
  });

  window.addEventListener("resize", () => {
    if (!isCompactLayout()) closeMobileMenu();
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px" },
  );

  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    feedback.className = "form-feedback";

    if (!form.checkValidity()) {
      form.reportValidity();
      feedback.textContent = "Eksik ya da geçersiz alanları tamamla.";
      feedback.classList.add("is-error");
      return;
    }

    const submitButton = form.querySelector(".form-submit");
    submitButton.disabled = true;
    submitButton.querySelector("span").textContent = "Discord'a iletiliyor...";

    try {
      const answers = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Başvuru şu anda iletilemedi. Lütfen daha sonra tekrar dene.");

      feedback.textContent = "Başvurun başvuru Discord kanalına başarıyla iletildi.";
      feedback.classList.add("is-success");
      form.reset();
    } catch (error) {
      feedback.textContent = error instanceof Error ? error.message : "Bağlantı kurulamadı. Lütfen daha sonra tekrar dene.";
      feedback.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      submitButton.querySelector("span").textContent = "Discord'a Başvuruyu Gönder";
    }
  });

  syncSystemStatus();
  startLoader();
})();
