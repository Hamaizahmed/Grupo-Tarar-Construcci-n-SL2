(() => {
  "use strict";

  const LANG_KEY = "gt-lang";
  const state = { lang: localStorage.getItem(LANG_KEY) === "en" ? "en" : "es" };

  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menu-toggle");
  const toTop = document.querySelector(".to-top");
  const form = document.getElementById("quote-form");
  const formStatus = document.getElementById("form-status");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");

  function textFor(element) {
    return element.getAttribute(`data-${state.lang}`) || element.getAttribute("data-es") || "";
  }

  function applyLanguage() {
    document.documentElement.lang = state.lang;
    localStorage.setItem(LANG_KEY, state.lang);

    document.querySelectorAll("[data-es][data-en]").forEach((element) => {
      element.textContent = textFor(element);
    });

    document.querySelectorAll("[data-language-option]").forEach((element) => {
      element.classList.toggle("active", element.dataset.languageOption === state.lang);
    });

    document.querySelectorAll("[data-placeholder-es][data-placeholder-en]").forEach((element) => {
      element.placeholder = element.getAttribute(`data-placeholder-${state.lang}`) || "";
    });

    document.querySelector('meta[name="description"]').setAttribute(
      "content",
      state.lang === "es"
        ? "Grupo Tarar Construcción SL: Pladur, Cinta, Pintura y Baldosa en Lleida. Solicita presupuesto."
        : "Grupo Tarar Construcción SL: plasterboard, finishing, painting and tiling in Lleida. Request a quote."
    );

    document.title = state.lang === "es"
      ? "Grupo Tarar Construcción SL | Construcción en Lleida"
      : "Grupo Tarar Construcción SL | Construction in Lleida";

    closeMenu();
  }

  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lang = state.lang === "es" ? "en" : "es";
      applyLanguage();
    });
  });

  function closeMenu() {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", () => {
    const opening = !nav.classList.contains("open");
    nav.classList.toggle("open", opening);
    document.body.classList.toggle("menu-open", opening);
    menuToggle.setAttribute("aria-expanded", String(opening));
  });

  document.querySelectorAll(".nav-link, .mini-cta").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
    toTop.classList.toggle("show", window.scrollY > 700);
  }, { passive: true });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sectionTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === id);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

  sectionTargets.forEach((section) => navObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  document.querySelectorAll(".choice-row").forEach((row) => {
    row.addEventListener("click", () => {
      document.querySelectorAll(".choice-row").forEach((item) => item.classList.remove("active"));
      row.classList.add("active");
    });
  });

  function openLightbox(card) {
    const image = card.querySelector("img");
    if (!image) return;
    lightboxImage.src = card.dataset.image || image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "";
    lightboxCaption.textContent = state.lang === "en" ? card.dataset.enCaption : card.dataset.esCaption;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains("open")) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lightboxImage.removeAttribute("src");
  }

  document.querySelectorAll("[data-image]").forEach((card) => {
    card.addEventListener("click", () => openLightbox(card));
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const service = String(data.get("service") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !service || !message) {
      formStatus.textContent = state.lang === "en"
        ? "Please complete the required fields."
        : "Completa los campos obligatorios.";
      return;
    }

    const subject = state.lang === "en"
      ? `Quote enquiry · ${service} · ${name}`
      : `Solicitud de presupuesto · ${service} · ${name}`;

    const body = state.lang === "en"
      ? [
          "Hello Grupo Tarar Construcción SL,",
          "",
          "I would like to request information / a quote.",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone || "Not provided"}`,
          `Service: ${service}`,
          "",
          "Project details:",
          message
        ].join("\n")
      : [
          "Hola Grupo Tarar Construcción SL,",
          "",
          "Me gustaría solicitar información / un presupuesto.",
          "",
          `Nombre: ${name}`,
          `Email: ${email}`,
          `Teléfono: ${phone || "No indicado"}`,
          `Servicio: ${service}`,
          "",
          "Detalles del proyecto:",
          message
        ].join("\n");

    formStatus.textContent = state.lang === "en"
      ? "Opening Gmail..."
      : "Abriendo Gmail...";

    const to = "info@grupotararconstruccion.com";
    const encodedTo = encodeURIComponent(to);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    // Open the Gmail app on mobile when possible. If Gmail cannot be opened,
    // fall back to Gmail's web composer rather than the device's Mail app.
    const gmailWebUrl =
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}` +
      `&su=${encodedSubject}&body=${encodedBody}`;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isIOS) {
      // En iPhone mostramos una ventana propia con un botón "Abrir Gmail".
      // El toque en ese botón es una acción directa del usuario, lo que da a iOS
      // la mejor oportunidad de abrir la app Gmail mediante su esquema de URL.
      const gmailAppUrl =
        `googlegmail:///co?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;

      const overlay = document.createElement("div");
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.innerHTML = `
        <div style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;">
          <div style="width:min(420px,100%);background:#fff;border-radius:18px;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,.25);font-family:inherit;text-align:center;">
            <div style="font-size:18px;font-weight:700;margin-bottom:10px;">Abre Gmail</div>
            <div style="font-size:15px;line-height:1.45;margin-bottom:20px;color:#555;">Pulsa el botón para abrir Gmail y preparar el correo con los datos de tu consulta.</div>
            <button type="button" data-open-gmail style="width:100%;padding:13px 16px;border:0;border-radius:10px;background:#111;color:#fff;font-size:16px;font-weight:600;cursor:pointer;">Abrir Gmail</button>
            <button type="button" data-close-gmail style="margin-top:10px;padding:10px 16px;border:0;background:transparent;color:#555;font-size:14px;cursor:pointer;">Cancelar</button>
          </div>
        </div>`;

      document.body.appendChild(overlay);

      const openButton = overlay.querySelector("[data-open-gmail]");
      const closeButton = overlay.querySelector("[data-close-gmail]");

      openButton.addEventListener("click", () => {
        window.location.href = gmailAppUrl;

        // Si iOS no tiene Gmail instalada o bloquea el esquema, dejamos
        // una alternativa visible en lugar de enviar al Mail de Apple.
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            overlay.querySelector("div > div").innerHTML = `
              <div style="font-size:18px;font-weight:700;margin-bottom:10px;">Gmail no se ha abierto</div>
              <div style="font-size:15px;line-height:1.45;margin-bottom:20px;color:#555;">Comprueba que tienes instalada la app Gmail. También puedes abrir Gmail desde su app y crear el correo manualmente.</div>
              <button type="button" data-close-gmail style="width:100%;padding:13px 16px;border:0;border-radius:10px;background:#111;color:#fff;font-size:16px;font-weight:600;cursor:pointer;">Cerrar</button>`;
            overlay.querySelector("[data-close-gmail]").addEventListener("click", () => overlay.remove());
          }
        }, 1500);
      });

      closeButton.addEventListener("click", () => overlay.remove());
    } else if (isAndroid) {
      // Explicitly target the Gmail Android package.
      const gmailIntent =
        `intent://${to}?subject=${encodedSubject}&body=${encodedBody}` +
        `#Intent;scheme=mailto;package=com.google.android.gm;end`;

      let fallbackTriggered = false;
      const fallback = () => {
        if (fallbackTriggered) return;
        fallbackTriggered = true;
        window.location.href = gmailWebUrl;
      };

      window.location.href = gmailIntent;
      setTimeout(fallback, 1200);
    } else {
      window.open(gmailWebUrl, "_blank", "noopener,noreferrer");
    }
  });

  applyLanguage();
})();
