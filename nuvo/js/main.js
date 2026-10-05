// Número da loja: código do país + DDD + número, só dígitos.
const WHATSAPP = "5581996969619";

const wa = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
document.querySelectorAll("#zap, #zap2").forEach((a) => {
  a.href = wa("Olá! Vim pelo site da Óticas Nuvo.");
  a.target = "_blank";
  a.rel = "noopener";
});
document.getElementById("ano").textContent = new Date().getFullYear();

// Abas
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
  if (focus) tab.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => selectTab(t));
  t.addEventListener("keydown", (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (k) { e.preventDefault(); selectTab(tabs[(i + k + tabs.length) % tabs.length], true); }
    if (e.key === "Home") { e.preventDefault(); selectTab(tabs[0], true); }
    if (e.key === "End") { e.preventDefault(); selectTab(tabs[tabs.length - 1], true); }
  });
});

// Menu: links com data-tab abrem a aba correspondente
const menu = document.getElementById("menu");
const burger = document.querySelector(".burger");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
menu.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    const t = document.getElementById("t-" + a.dataset.tab);
    if (t) selectTab(t);
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  });
});

// Formulário -> WhatsApp
const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = form.nome;
  if (!nome.value.trim()) {
    nome.classList.add("touched");
    nome.classList.remove("shake");
    void nome.offsetWidth;
    nome.classList.add("shake");
    nome.focus();
    return;
  }
  const msg = `Olá! Me chamo ${nome.value.trim()}. Quero agendar: ${form.servico.value}.` +
    (form.quando.value.trim() ? ` Melhor horário: ${form.quando.value.trim()}.` : "");
  window.open(wa(msg), "_blank", "noopener");
});
form.nome.addEventListener("animationend", () => form.nome.classList.remove("shake"));

// Animações (respeita prefers-reduced-motion)
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // Reveal ao rolar, com pequeno atraso entre irmãos
  const targets = [];
  document.querySelectorAll(".cols, .steps, .why, .faq, .contact-grid").forEach((g) => {
    [...g.children].forEach((el, i) => {
      el.dataset.delay = i * 90;
      targets.push(el);
    });
  });
  document.querySelectorAll(".sec .head, .about > div").forEach((el) => targets.push(el));
  targets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.style.transitionDelay = (el.dataset.delay || 0) + "ms";
      el.classList.add("in");
      el.addEventListener("transitionend", () => (el.style.transitionDelay = ""), { once: true });
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  targets.forEach((el) => io.observe(el));

  // Sombra no header quando a página rola
  const top = document.querySelector(".top");
  addEventListener("scroll", () => top.classList.toggle("scrolled", scrollY > 8), { passive: true });

  // Tilt 3D na tabela de optometria
  const chart = document.querySelector(".chart");
  chart.addEventListener("mousemove", (e) => {
    const r = chart.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    chart.style.transform = `perspective(700px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
  });
  chart.addEventListener("mouseleave", () => (chart.style.transform = ""));
}

// Carrossel de clientes: rotação lenta e contínua (loop infinito, sempre ativo)
const carTrack = document.querySelector(".car-track");
if (carTrack) {
  carTrack.classList.add("marquee");
  carTrack.removeAttribute("tabindex");
  [...carTrack.children].forEach((li) => {
    const clone = li.cloneNode(true);
    clone.classList.add("clone");
    clone.setAttribute("aria-hidden", "true");
    carTrack.appendChild(clone);
  });
}
