gsap.registerPlugin(ScrollTrigger);
const loader = document.querySelector(".loader");

window.addEventListener("DOMContentLoaded", () => {
  const headerLogo = document.querySelector(".header .header__logo");
  const headerLinks = document.querySelectorAll(".header .menu-item");
  const headerBtn = document.querySelector(".header .btn.variant-white");
  const headerArr = [headerLogo, ...headerLinks, headerBtn];

  gsap.fromTo(loader, { opacity: 1 }, { opacity: 0, duration: 2 });
  headerArr.forEach((item) => {
    gsap.fromTo(
      item,
      { scale: 0.9, opacity: 0, ease: "none" },
      { scale: 1, opacity: 1, delay: 0.8, duration: 0.3, ease: "none" }
    );
  });

  const fadeElements = document.querySelectorAll("[data-animation=fade]");
  fadeElements.forEach((el) => {
    gsap.set(el, { opacity: 0 });
    gsap.to(el, {
      opacity: 1,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start: "top center",
        end: "bottom center",
        once: true,
      },
    });
  });
});

// Function to open the link after a delay
let isLinkOpening = false;
function openLink(href) {
  isLinkOpening = true;

  if (isLinkOpening) {
    // Fade out the current content
    gsap.to(loader, {
      opacity: 1,
      duration: 2,
      onComplete: () => {
        // After fade-out, navigate to the new page
        window.location.href = href;

        // Fade in the new content
        gsap.fromTo(
          loader,
          { opacity: 1 },
          {
            opacity: 0,
            duration: 2,
            onComplete: () => {
              isLinkOpening = false;
            },
          }
        );
      },
    });
  }
}

// header
const header = document.querySelector(".header");
if (header) {
  const header = document.querySelector(".header");
  const menu = header.querySelector(".header__menu");
  const services = header.querySelector(".menu-item-has-children");
  const servicesSubMenu = services.querySelector(".sub-menu");
  const menuBtn = header.querySelector(".menu-btn");
  const menuCloseBtn = header.querySelector(".header__menu-close");
  const menuBg = header.querySelector(".header__menu-bg");
  const links = header.querySelectorAll("a");

  window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", window.scrollY > 0);
  });

  menuBtn.addEventListener("click", () => {
    menu.classList.add("active");
    document.body.classList.add("overflow-hidden");
  });

  menuCloseBtn.addEventListener("click", () => {
    menu.classList.remove("active");
    document.body.classList.remove("overflow-hidden");
  });

  menuBg.addEventListener("click", () => {
    menu.classList.remove("active");
    document.body.classList.remove("overflow-hidden");
  });

  if (window.innerWidth > 1024) {
    const div = document.createElement("div");
    div.classList.add("icon");
    div.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m12 15l-5-5h10z"/></svg>';
    services.appendChild(div);

    services.addEventListener("mouseenter", () => {
      servicesSubMenu.style.display = "flex";
      setTimeout(() => {
        servicesSubMenu.style.opacity = 1;
        servicesSubMenu.style.transform = "translate(-50%, 0px)";
      }, 300);
    });

    services.addEventListener("mouseleave", () => {
      servicesSubMenu.style.opacity = 0;
      servicesSubMenu.style.transform = "translate(-50%, 10px)";
      setTimeout(() => {
        servicesSubMenu.style.display = "none";
      }, 300);
    });
  } else {
    const div = document.createElement("div");
    div.classList.add("space");
    div.addEventListener("click", () => {
      servicesSubMenu.classList.toggle("active");
    });
    services.appendChild(div);
  }

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openLink(link.href);
    });
  });
}

// Helper function to parse dataset options
const parseOption = (
  data,
  key,
  defaultValue = false,
  parseType = "boolean"
) => {
  const value = data[key];
  if (parseType === "boolean")
    return value !== undefined ? value === "true" : defaultValue;
  if (parseType === "number")
    return value !== undefined ? parseFloat(value) : defaultValue;
  if (parseType === "string") return value !== undefined ? value : defaultValue;
  return defaultValue;
};

// modal
const modal = {
  el: document.querySelector(".modal"),
  blocks: document.querySelectorAll(".modal__content"),
  open: function (name, animation = true) {
    const target = this.el.querySelector(`[data-root=${name}]`);

    this.el.classList.add("active");
    this.el.style.display = "flex";
    target.style.display = "flex";

    if (animation) {
      setTimeout(() => {
        target.style.opacity = 1;
        target.style.transform = "scale(1)";
      }, 50);
    } else {
      target.style.opacity = 1;
      target.style.transform = "scale(1)";
    }
  },
  close: function (name, parent = true) {
    if (!name) {
      this.blocks.forEach((block) => {
        block.style.opacity = 0;
        block.style.transform = "scale(0.85)";

        setTimeout(() => {
          block.style.display = "none";
        }, 350);
      });
    } else {
      const target = this.el.querySelector(`[data-root=${name}]`);
      target.style.opacity = 0;
      target.style.transform = "scale(0.85)";

      if (!parent) {
        target.style.display = "none";
      } else {
        setTimeout(() => {
          target.style.display = "none";
        }, 350);
      }
    }

    if (parent) {
      setTimeout(() => {
        this.el.classList.remove("active");
        this.el.style.display = "none";
      }, 350);
    }
  },
};

const modalTriggers = document.querySelectorAll("[data-modal]");
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const name = trigger.dataset.modal;
    if (name !== "close") {
      modal.open(name);
    } else {
      modal.close(null, true);
    }
  });
});

// Initialize the carousel
const carouselTriggers = document.querySelectorAll(".carousel");
carouselTriggers.forEach((trigger) => {
  const container = trigger.querySelector(".f-carousel");
  const thumbs = trigger.querySelector(".f-thumbs");

  // Ensure the main container exists
  if (!container) {
    console.warn("Carousel container not found for:", trigger);
    return;
  }

  // Initialize the main swiper (Carousel)
  const swiper = new Carousel(container, {
    adaptiveHeight: parseOption(
      container.dataset,
      "adaptiveHeight",
      false,
      "boolean"
    ),
    center: parseOption(container.dataset, "center", false, "boolean"),
    direction: parseOption(
      container.dataset,
      "direction",
      "horizontal",
      "string"
    ),
    infinite: parseOption(container.dataset, "infinite", false, "boolean"),
    initialSlide: parseOption(container.dataset, "initialSlide", 0, "number"),
    transition: parseOption(container.dataset, "transition", "slide", "string"),
    // plugins
    Dots: parseOption(container.dataset, "dots", false, "boolean"),
    Navigation: parseOption(container.dataset, "navigation", false, "boolean"),
    Panzoom: {
      touch: parseOption(container.dataset, "touch", true, "boolean"),
    },
  });

  // Initialize the thumbnail swiper (Carousel) if thumbs are available
  if (thumbs) {
    const thumbSwiper = new Carousel(thumbs, {
      classes: {
        container: "f-carousel__thumbs",
        slide: "f-thumbs__slide",
        track: "f-thumbs__track",
        viewport: "f-thumbs__viewport",
      },
      infinite: parseOption(thumbs.dataset, "infinite", false, "boolean"),
      transition: parseOption(thumbs.dataset, "transition", "slide", "string"),
      // plugins
      Dots: false, // Set to false by default for thumbs
      Navigation: parseOption(thumbs.dataset, "navigation", false, "boolean"),
      Panzoom: {
        touch: parseOption(thumbs.dataset, "touch", true, "boolean"),
      },
      Sync: { target: swiper }, // Sync thumbs with the main swiper
    });
  }
});

// Initialize the fancybox
const fancyboxTriggers = Array.from(
  document.querySelectorAll("[data-fancybox]")
).filter((trigger) => trigger.dataset.fancybox);
if (fancyboxTriggers) {
  const fancyboxInstances = [];
  fancyboxTriggers.forEach((trigger) => {
    const name = trigger.dataset.fancybox;
    if (fancyboxInstances.includes(name)) {
      return; // Skip if already bound
    }
    // Add the name to the `fancyboxInstances` list
    fancyboxInstances.push(name);
  });
  fancyboxInstances.forEach((name) => {
    Fancybox.bind(`[data-fancybox="${name}"]`, {
      Images: { Panzoom: { maxScale: 3 } },
    });
  });
}

// phone mask
const phoneMasks = document.querySelectorAll("input[name='phone']");
phoneMasks.forEach((input) => {
  let keyCode;
  function mask(event) {
    event.keyCode && (keyCode = event.keyCode);
    let pos = this.selectionStart;
    if (pos < 3) event.preventDefault();
    let matrix = "+7 (___) ___-__-__",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, ""),
      newValue = matrix.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
      });
    i = newValue.indexOf("_");
    if (i != -1) {
      i < 5 && (i = 3);
      newValue = newValue.slice(0, i);
    }
    let reg = matrix
      .substr(0, this.value.length)
      .replace(/_+/g, function (a) {
        return "\\d{1," + a.length + "}";
      })
      .replace(/[+()]/g, "\\$&");
    reg = new RegExp("^" + reg + "$");
    if (
      !reg.test(this.value) ||
      this.value.length < 5 ||
      (keyCode > 47 && keyCode < 58)
    )
      this.value = newValue;
    if (event.type == "blur" && this.value.length < 5) this.value = "";

    if (this.value.length == 18 || this.value.length == 0) {
      input.dataset.numbervalid = "true";
    } else {
      input.dataset.numbervalid = "false";
    }
  }

  input.addEventListener("input", mask, false);
  input.addEventListener("focus", mask, false);
  input.addEventListener("blur", mask, false);
  input.addEventListener("keydown", mask, false);
});

function successSend() {
  const modalEl = document.querySelector(".modal");
  if (modalEl.classList.contains("active")) {
    modal.close("form", false);
    modal.open("success", false);
  } else {
    modal.open("success");
  }

  setTimeout(() => {
    modal.close("success");
  }, 3000);
}

const forms = document.querySelectorAll("form");
forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successSend();
  });
});
