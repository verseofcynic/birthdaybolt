/* ============================================================
   Kids Birthday Invitation — JavaScript Engine
   Loads data/invitation.json, merges with defaults, applies
   theme, and dynamically renders the entire invitation.
   No birthday-specific data is hard-coded.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- DOM element references ---------- */
  const $ = (id) => document.getElementById(id);
  const dom = {
    loadingScreen: $("loading-screen"),
    errorScreen: $("error-screen"),
    openingScreen: $("opening-screen"),
    openingEyebrow: $("opening-eyebrow"),
    openingTitle: $("opening-title"),
    openingSubtitle: $("opening-subtitle"),
    openingName: $("opening-name"),
    openingAge: $("opening-age"),
    openBtn: $("open-invitation-btn"),
    openingBalloons: $("opening-balloons"),
    openingConfetti: $("opening-confetti"),
    app: $("invitation-app"),
    floatingDeco: $("floating-decorations"),
    heroBalloons: $("hero-balloons"),
    heroEyebrow: $("hero-eyebrow"),
    heroSubtitleText: $("hero-subtitle-text"),
    heroName: $("hero-name"),
    heroAgeBadge: $("hero-age-badge"),
    heroTurning: $("hero-turning"),
    heroPhotoWrap: $("hero-photo-wrap"),
    messageHeadline: $("message-headline"),
    messageText: $("message-text"),
    countdownGrid: $("countdown-grid"),
    countdownComplete: $("countdown-complete"),
    eventDate: $("event-date"),
    eventTime: $("event-time"),
    eventVenueName: $("event-venue-name"),
    eventVenueAddress: $("event-venue-address"),
    eventMapWrap: $("event-map-wrap"),
    activitiesGrid: $("activities-grid"),
    galleryGrid: $("gallery-grid"),
    rsvpSection: $("rsvp"),
    rsvpTitle: $("rsvp-title"),
    rsvpMessage: $("rsvp-message"),
    rsvpButton: $("rsvp-button"),
    rsvpButtonText: $("rsvp-button-text"),
    footerMessage: $("footer-message"),
    footerMadeWith: $("footer-made-with"),
    musicControl: $("music-control"),
    musicIcon: $("music-icon"),
    lightbox: $("lightbox"),
    lightboxImage: $("lightbox-image"),
    lightboxCaption: $("lightbox-caption"),
    lightboxCounter: $("lightbox-counter"),
    lightboxClose: $("lightbox-close"),
    lightboxPrev: $("lightbox-prev"),
    lightboxNext: $("lightbox-next"),
    confettiCanvas: $("confetti-canvas"),
    faviconLink: $("favicon-link"),
  };

  /* ---------- Default fallback data ---------- */
  const DEFAULTS = {
    invitation: {
      eventType: "birthday",
      title: "You're Invited!",
      subtitle: "A Birthday Celebration",
      theme: "magical",
      language: "en",
      favicon: "assets/icons/favicon.svg",
    },
    child: { name: "", nickname: "", age: null, gender: "", photo: "" },
    birthday: { date: "", displayDate: "", day: "", time: "", endTime: "", timezone: "" },
    venue: { name: "", address: "", mapUrl: "" },
    host: { name: "", phone: "", whatsapp: "" },
    message: { headline: "Come Celebrate With Me!", text: "Join us for a fun-filled celebration!" },
    theme: {
      style: "magical",
      primaryColor: "#7A3E9D",
      secondaryColor: "#F7C948",
      accentColor: "#FF6B81",
      backgroundColor: "#FFF9F0",
      surfaceColor: "#FFFFFF",
      textColor: "#30243A",
      mutedColor: "#756B7A",
    },
    hero: { showConfetti: true, showBalloons: true },
    gallery: [],
    activities: [],
    music: { enabled: false, file: "", loop: true, autoplay: false },
    rsvp: { enabled: false, title: "RSVP", buttonText: "RSVP", whatsappNumber: "", message: "" },
    footer: { message: "Can't wait to celebrate with you!", showMadeWith: false },
  };

  /* ---------- Deep merge defaults with loaded data ---------- */
  function deepMerge(base, override) {
    const out = Array.isArray(base) ? [...base] : { ...base };
    if (override && typeof override === "object" && !Array.isArray(override)) {
      for (const k of Object.keys(override)) {
        if (base[k] && typeof base[k] === "object" && !Array.isArray(base[k]) && override[k] && typeof override[k] === "object") {
          out[k] = deepMerge(base[k], override[k]);
        } else {
          out[k] = override[k];
        }
      }
    }
    return out;
  }

  /* ---------- Apply theme colors as CSS variables ---------- */
  function applyTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primaryColor);
    root.style.setProperty("--secondary", theme.secondaryColor);
    root.style.setProperty("--accent", theme.accentColor);
    root.style.setProperty("--background", theme.backgroundColor);
    root.style.setProperty("--surface", theme.surfaceColor);
    root.style.setProperty("--text", theme.textColor);
    root.style.setProperty("--muted", theme.mutedColor);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", theme.primaryColor);
  }

  /* ---------- Apply SEO / meta tags ---------- */
  function applyMeta(d) {
    const childName = d.child && d.child.name ? d.child.name : "";
    const age = d.child && d.child.age != null ? d.child.age : "";
    const title = childName ? `${childName}'s ${age ? ordinal(age) + " " : ""}Birthday | You're Invited!` : "Birthday Invitation";
    document.title = title;
    const desc = d.message && d.message.text ? d.message.text : `Join us for ${childName}'s birthday celebration!`;
    setMeta("description", desc);
    setMeta("og:title", title);
    setMeta("og:description", desc);
    setMeta("twitter:title", title);
    setMeta("twitter:description", desc);
    const ogImage = d.child && d.child.photo ? d.child.photo : (d.gallery && d.gallery[0] ? d.gallery[0].image : "");
    if (ogImage) { setMeta("og:image", ogImage); setMeta("twitter:image", ogImage); }
    if (d.invitation && d.invitation.language) document.documentElement.lang = d.invitation.language;
    if (d.invitation && d.invitation.favicon && dom.faviconLink) dom.faviconLink.setAttribute("href", d.invitation.favicon);
  }
  function setMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
    if (el) el.setAttribute("content", content);
  }

  /* ---------- Helper: ordinal number (1st, 2nd, 3rd, etc.) ---------- */
  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  /* ---------- Helper: derive date display from ISO if not provided ---------- */
  function deriveDateDisplay(birthday) {
    if (birthday.displayDate && birthday.day) return { display: birthday.displayDate, day: birthday.day };
    if (!birthday.date) return { display: birthday.displayDate || "", day: birthday.day || "" };
    try {
      const dt = new Date(birthday.date + "T00:00:00");
      if (isNaN(dt.getTime())) return { display: birthday.displayDate || "", day: birthday.day || "" };
      const dayName = dt.toLocaleDateString("en-US", { weekday: "long" });
      const fullDate = dt.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
      return { display: fullDate, day: dayName };
    } catch {
      return { display: birthday.displayDate || "", day: birthday.day || "" };
    }
  }

  /* ---------- Helper: safe image with error handling ---------- */
  function createImg(src, alt, cls) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    if (cls) img.className = cls;
    img.loading = "lazy";
    img.addEventListener("error", () => {
      const parent = img.parentElement;
      if (parent) {
        if (parent.classList.contains("gallery-item")) parent.style.display = "none";
        else if (parent.classList.contains("hero-photo-wrap")) {
          parent.innerHTML = "";
          parent.style.background = "var(--secondary)";
          parent.style.display = "flex";
          parent.style.alignItems = "center";
          parent.style.justifyContent = "center";
          parent.style.fontSize = "3rem";
          parent.textContent = "🎈";
        }
      }
    });
    return img;
  }

  /* ---------- Render opening screen ---------- */
  function renderOpeningScreen(d) {
    const inv = d.invitation;
    const child = d.child;

    dom.openingEyebrow.textContent = "A SPECIAL DAY IS COMING…";
    dom.openingTitle.textContent = inv.title || "You're Invited!";
    dom.openingSubtitle.textContent = inv.subtitle ? inv.subtitle.toLowerCase().startsWith("to ") ? inv.subtitle : `to celebrate` : "to celebrate";

    if (child.name) dom.openingName.textContent = child.name.toUpperCase() + "'S";
    const ageText = child.age != null ? `${ordinal(child.age)} BIRTHDAY` : "BIRTHDAY";
    dom.openingAge.textContent = ageText;

    if (d.hero && d.hero.showBalloons) {
      addBalloons(dom.openingBalloons, 8);
    }
  }

  /* ---------- Render hero section ---------- */
  function renderHero(d) {
    const inv = d.invitation;
    const child = d.child;

    dom.heroEyebrow.textContent = inv.title || "You're Invited!";
    dom.heroSubtitleText.textContent = "to celebrate";
    dom.heroName.textContent = child.name || "";
    dom.heroAgeBadge.textContent = child.age != null ? ordinal(child.age) : "";
    dom.heroTurning.textContent = child.age != null ? `turning ${ordinal(child.age)}` : "";

    if (child.photo) {
      dom.heroPhotoWrap.innerHTML = "";
      dom.heroPhotoWrap.append(createImg(child.photo, `${child.name} birthday photo`, ""));
    } else {
      dom.heroPhotoWrap.innerHTML = "";
      dom.heroPhotoWrap.style.background = "var(--secondary)";
      dom.heroPhotoWrap.style.display = "flex";
      dom.heroPhotoWrap.style.alignItems = "center";
      dom.heroPhotoWrap.style.justifyContent = "center";
      dom.heroPhotoWrap.style.fontSize = "3rem";
      dom.heroPhotoWrap.textContent = "🎈";
    }

    if (d.hero && d.hero.showBalloons) {
      addBalloons(dom.heroBalloons, 6);
    }
  }

  /* ---------- Render message section ---------- */
  function renderMessage(d) {
    const msg = d.message;
    if (msg.headline) dom.messageHeadline.textContent = msg.headline;
    if (msg.text) dom.messageText.textContent = msg.text;
  }

  /* ---------- Render countdown ---------- */
  function renderCountdown(d) {
    const bday = d.birthday;
    if (!bday.date) return;

    // Build target datetime string with timezone
    let targetStr = bday.date;
    if (bday.time) {
      const timeMap = { "AM": "AM", "PM": "PM" };
      let timePart = bday.time;
      targetStr = `${bday.date}T${bday.time}`;
      if (bday.timezone) targetStr += bday.timezone;
    } else {
      targetStr = `${bday.date}T00:00:00`;
      if (bday.timezone) targetStr += bday.timezone;
    }

    let target;
    try { target = new Date(targetStr); } catch { return; }
    if (isNaN(target.getTime())) return;

    const units = [
      { id: "cd-days", label: "Days" },
      { id: "cd-hours", label: "Hours" },
      { id: "cd-mins", label: "Minutes" },
      { id: "cd-secs", label: "Seconds" },
    ];
    dom.countdownGrid.innerHTML = "";
    units.forEach((u) => {
      const item = document.createElement("div");
      item.className = "countdown-item";
      const num = document.createElement("span");
      num.className = "countdown-number";
      num.id = u.id;
      num.textContent = "00";
      const lab = document.createElement("span");
      lab.className = "countdown-label";
      lab.textContent = u.label;
      item.append(num, lab);
      dom.countdownGrid.append(item);
    });

    function tick() {
      const now = new Date();
      let diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        dom.countdownGrid.hidden = true;
        dom.countdownComplete.hidden = false;
        if (d.hero && d.hero.showConfetti) launchConfetti(2000);
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      const pad = (n) => String(n).padStart(2, "0");
      const setVal = (id, v) => { const e = $(id); if (e) e.textContent = v; };
      setVal("cd-days", pad(days));
      setVal("cd-hours", pad(hours));
      setVal("cd-mins", pad(mins));
      setVal("cd-secs", pad(secs));
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Render event details ---------- */
  function renderEventDetails(d) {
    const bday = d.birthday;
    const venue = d.venue;
    const dateInfo = deriveDateDisplay(bday);

    if (dateInfo.display) dom.eventDate.textContent = dateInfo.display;
    else dom.eventDate.textContent = bday.displayDate || "";

    if (bday.time) {
      dom.eventTime.textContent = bday.endTime ? `${bday.time} – ${bday.endTime}` : bday.time;
    }

    if (venue.name) dom.eventVenueName.textContent = venue.name;
    if (venue.address) dom.eventVenueAddress.textContent = venue.address;

    if (venue.mapUrl) {
      const btn = document.createElement("a");
      btn.className = "event-map-btn";
      btn.href = venue.mapUrl;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      btn.textContent = "View Location";
      dom.eventMapWrap.innerHTML = "";
      dom.eventMapWrap.append(btn);
    }
  }

  /* ---------- Render activities ---------- */
  function renderActivities(d) {
    if (!d.activities || !d.activities.length) return;
    dom.activitiesGrid.innerHTML = "";
    d.activities.forEach((act) => {
      const card = document.createElement("div");
      card.className = "activity-card reveal";
      const icon = document.createElement("span");
      icon.className = "activity-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = act.icon || "🎈";
      const title = document.createElement("h3");
      title.className = "activity-title";
      title.textContent = act.title || "";
      const desc = document.createElement("p");
      desc.className = "activity-description";
      desc.textContent = act.description || "";
      card.append(icon, title, desc);
      dom.activitiesGrid.append(card);
    });
  }

  /* ---------- Render gallery ---------- */
  function renderGallery(d) {
    if (!d.gallery || !d.gallery.length) return;
    dom.galleryGrid.innerHTML = "";
    d.gallery.forEach((item, i) => {
      const fig = document.createElement("figure");
      fig.className = "gallery-item reveal";
      fig.dataset.index = String(i);
      fig.tabIndex = 0;
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", item.caption || `Photo ${i + 1}`);
      fig.append(createImg(item.image, item.caption || `Photo ${i + 1}`, ""));
      if (item.caption) {
        const cap = document.createElement("figcaption");
        cap.className = "gallery-caption";
        cap.textContent = item.caption;
        fig.append(cap);
      }
      dom.galleryGrid.append(fig);
    });
  }

  /* ---------- Render RSVP ---------- */
  function renderRSVP(d) {
    const rsvp = d.rsvp;
    if (!rsvp || !rsvp.enabled) { dom.rsvpSection.hidden = true; return; }
    dom.rsvpSection.hidden = false;
    dom.rsvpTitle.textContent = rsvp.title || "RSVP";
    dom.rsvpMessage.textContent = rsvp.message || "";
    dom.rsvpButtonText.textContent = rsvp.buttonText || "RSVP";
    if (rsvp.whatsappNumber) {
      const msg = encodeURIComponent(rsvp.message || "");
      dom.rsvpButton.href = `https://wa.me/${rsvp.whatsappNumber}?text=${msg}`;
    }
  }

  /* ---------- Render footer ---------- */
  function renderFooter(d) {
    const f = d.footer;
    if (f.message) dom.footerMessage.textContent = f.message;
    if (f.showMadeWith) dom.footerMadeWith.hidden = false;
  }

  /* ---------- Add CSS balloon decorations ---------- */
  function addBalloons(container, count) {
    if (!container) return;
    const colors = ["var(--primary)", "var(--secondary)", "var(--accent)"];
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "balloon";
      b.style.background = colors[i % colors.length];
      b.style.color = colors[i % colors.length];
      b.style.left = `${Math.random() * 90}%`;
      b.style.top = `${Math.random() * 70}%`;
      b.style.animationDelay = `${Math.random() * 3}s`;
      b.style.opacity = String(0.3 + Math.random() * 0.4);
      b.style.transform = `scale(${0.5 + Math.random() * 0.5})`;
      container.append(b);
    }
  }

  /* ---------- Add floating emoji decorations ---------- */
  function addFloatingDecorations(d) {
    if (!dom.floatingDeco) return;
    const emojis = ["⭐", "🎈", "✨", "🎁", "🌟", "💫", "🎂"];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const e = document.createElement("div");
      e.className = "float-emoji";
      e.textContent = emojis[i % emojis.length];
      e.style.left = `${Math.random() * 95}%`;
      e.style.top = `${Math.random() * 95}%`;
      e.style.animationDelay = `${Math.random() * 4}s`;
      e.style.animationDuration = `${6 + Math.random() * 4}s`;
      dom.floatingDeco.append(e);
    }
  }

  /* ---------- Confetti system (vanilla JS, no library) ---------- */
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimating = false;

  function initConfettiCanvas() {
    const canvas = dom.confettiCanvas;
    if (!canvas) return;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    confettiCtx = canvas.getContext("2d");
  }

  function launchConfetti(duration) {
    if (!confettiCtx) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const colors = [
      getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),
      getComputedStyle(document.documentElement).getPropertyValue("--secondary").trim(),
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(),
      "#FFFFFF",
    ];
    const count = 80;
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: Math.random() * window.innerWidth,
        y: -20,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 1,
      });
    }
    if (!confettiAnimating) animateConfetti(duration || 3000);
  }

  function animateConfetti(duration) {
    confettiAnimating = true;
    const startTime = performance.now();
    function frame(now) {
      const elapsed = now - startTime;
      confettiCtx.clearRect(0, 0, dom.confettiCanvas.width, dom.confettiCanvas.height);
      confettiParticles = confettiParticles.filter((p) => p.y < window.innerHeight + 50 && p.life > 0);
      confettiParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.rotation += p.rotSpeed;
        if (elapsed > (duration || 3000) * 0.6) p.life -= 0.02;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = Math.max(0, p.life);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        confettiCtx.restore();
      });
      if (confettiParticles.length > 0 && elapsed < (duration || 3000) + 2000) {
        requestAnimationFrame(frame);
      } else {
        confettiAnimating = false;
        confettiParticles = [];
        confettiCtx.clearRect(0, 0, dom.confettiCanvas.width, dom.confettiCanvas.height);
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Music system ---------- */
  let audio = null;
  let musicPlaying = false;

  function setupMusic(d) {
    const m = d.music;
    if (!m || !m.enabled || !m.file) { dom.musicControl.hidden = true; return; }
    dom.musicControl.hidden = false;
    audio = new Audio(m.file);
    audio.loop = !!m.loop;
    audio.volume = 0.5;
    audio.addEventListener("error", () => { dom.musicControl.hidden = true; });
    dom.musicControl.addEventListener("click", toggleMusic);
  }

  function toggleMusic() {
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      musicPlaying = false;
      dom.musicControl.classList.remove("playing");
      dom.musicIcon.textContent = "🎵";
      dom.musicControl.setAttribute("aria-label", "Play music");
    } else {
      audio.play().then(() => {
        musicPlaying = true;
        dom.musicControl.classList.add("playing");
        dom.musicIcon.textContent = "🎶";
        dom.musicControl.setAttribute("aria-label", "Pause music");
      }).catch(() => { /* autoplay blocked or file missing */ });
    }
  }

  function startMusicOnOpen() {
    if (!audio) return;
    audio.play().then(() => {
      musicPlaying = true;
      dom.musicControl.classList.add("playing");
      dom.musicIcon.textContent = "🎶";
      dom.musicControl.setAttribute("aria-label", "Pause music");
    }).catch(() => { /* silently ignore */ });
  }

  /* ---------- Lightbox ---------- */
  let lbImages = [];
  let lbCurrent = 0;

  function setupLightbox(d) {
    if (!d.gallery || !d.gallery.length) return;
    lbImages = d.gallery;

    dom.lightboxClose.addEventListener("click", closeLightbox);
    dom.lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); lbNav(-1); });
    dom.lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); lbNav(1); });
    dom.lightbox.addEventListener("click", (e) => { if (e.target === dom.lightbox) closeLightbox(); });

    document.addEventListener("keydown", (e) => {
      if (dom.lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") lbNav(-1);
      else if (e.key === "ArrowRight") lbNav(1);
    });

    document.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery-item");
      if (item) {
        const idx = parseInt(item.dataset.index, 10);
        if (!isNaN(idx)) openLightbox(idx);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.target.classList && e.target.classList.contains("gallery-item") && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        const idx = parseInt(e.target.dataset.index, 10);
        if (!isNaN(idx)) openLightbox(idx);
      }
    });
  }

  function openLightbox(index) {
    lbCurrent = index;
    dom.lightbox.hidden = false;
    requestAnimationFrame(() => dom.lightbox.classList.add("open"));
    document.body.style.overflow = "hidden";
    renderLightbox();
  }
  function closeLightbox() {
    dom.lightbox.classList.remove("open");
    setTimeout(() => { dom.lightbox.hidden = true; }, 350);
    document.body.style.overflow = "";
  }
  function lbNav(dir) {
    lbCurrent = (lbCurrent + dir + lbImages.length) % lbImages.length;
    renderLightbox();
  }
  function renderLightbox() {
    const img = lbImages[lbCurrent];
    dom.lightboxImage.src = img.image;
    dom.lightboxImage.alt = img.caption || `Photo ${lbCurrent + 1}`;
    dom.lightboxCaption.textContent = img.caption || "";
    dom.lightboxCounter.textContent = `${lbCurrent + 1} / ${lbImages.length}`;
  }

  /* ---------- Scroll reveal animations ---------- */
  function setupAnimations(d) {
    if (d.theme && d.theme.style && d.animations && d.animations.revealOnScroll === false) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  /* ---------- Open invitation flow ---------- */
  function openInvitation(d) {
    dom.openingScreen.classList.add("hidden");
    setTimeout(() => {
      dom.openingScreen.hidden = true;
      dom.app.hidden = false;
      requestAnimationFrame(() => {
        dom.app.classList.add("ready");
        setupAnimations(d);
        if (d.hero && d.hero.showConfetti) launchConfetti(2500);
      });
    }, 600);

    if (d.music && d.music.enabled) startMusicOnOpen();
    window.scrollTo(0, 0);
  }

  /* ---------- Main render ---------- */
  function renderInvitation(d) {
    applyTheme(d.theme);
    applyMeta(d);

    renderOpeningScreen(d);
    renderHero(d);
    renderMessage(d);
    renderCountdown(d);
    renderEventDetails(d);
    renderActivities(d);
    renderGallery(d);
    renderRSVP(d);
    renderFooter(d);
    addFloatingDecorations(d);
    setupMusic(d);
    setupLightbox(d);

    dom.openBtn.addEventListener("click", () => openInvitation(d));
  }

  /* ---------- Load invitation data ---------- */
  async function loadInvitation() {
    try {
      const res = await fetch("data/invitation.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();
      data = deepMerge(DEFAULTS, data);
      initConfettiCanvas();
      renderInvitation(data);
      dom.loadingScreen.classList.add("hidden");
      setTimeout(() => { dom.loadingScreen.hidden = true; }, 600);
      dom.openingScreen.hidden = false;
    } catch (err) {
      dom.loadingScreen.hidden = true;
      dom.errorScreen.hidden = false;
    }
  }

  /* ---------- Boot ---------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadInvitation);
  } else {
    loadInvitation();
  }
})();
