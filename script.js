$(document).ready(function () {
  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: "ease-out",
    once: true,
    offset: 100,
  });

  // Smooth scroll for navigation links
  $('a[href^="#"]').on("click", function (e) {
    const target = $(this).attr("href");
    if (target.length > 1) {
      e.preventDefault();
      $("html, body").animate(
        {
          scrollTop: $(target).offset().top - 70,
        },
        800
      );

      // Update active nav link
      $(".nav-link").removeClass("active");
      $(`.nav-link[href="${target}"]`).addClass("active");

      // Close mobile menu
      $(".navbar-collapse").collapse("hide");
    }
  });

  // Active nav link on scroll
  $(window).on("scroll", function () {
    let scrollPos = $(window).scrollTop() + 100;

    $("section").each(function () {
      const sectionTop = $(this).offset().top;
      const sectionBottom = sectionTop + $(this).outerHeight();
      const sectionId = $(this).attr("id");

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        $(".nav-link").removeClass("active");
        $(`.nav-link[href="#${sectionId}"]`).addClass("active");
      }
    });
  });

  // Gallery lightbox
  $(".gallery-item").on("click", function () {
    const imgSrc = $(this).find("img").attr("src");
    const caption = $(this).find(".gallery-overlay h5").text();

    const lightbox = $("<div>")
      .addClass(
        "position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      )
      .css({
        background: "rgba(0,0,0,0.95)",
        "z-index": 9999,
        cursor: "pointer",
      })
      .fadeIn(300);

    const img = $("<img>").attr("src", imgSrc).addClass("rounded-3").css({
      "max-width": "90%",
      "max-height": "80vh",
      "box-shadow": "0 10px 50px rgba(0,0,0,0.5)",
    });

    const captionText = $("<div>")
      .text(caption)
      .addClass("text-white text-center mt-3")
      .css("font-size", "1.25rem");

    const closeBtn = $("<button>")
      .html('<i class="fas fa-times"></i>')
      .addClass("btn btn-light rounded-circle position-absolute")
      .css({
        top: "2rem",
        right: "2rem",
        width: "50px",
        height: "50px",
      });

    lightbox.append(closeBtn, img, captionText);
    $("body").append(lightbox).css("overflow", "hidden");

    lightbox.on("click", function () {
      $(this).fadeOut(300, function () {
        $(this).remove();
        $("body").css("overflow", "");
      });
    });
  });

  // Contact form submission
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    const $btn = $(this).find('button[type="submit"]');
    const originalText = $btn.html();

    $btn
      .html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...')
      .prop("disabled", true);

    setTimeout(function () {
      $btn
        .html('<i class="fas fa-check me-2"></i>Message Sent!')
        .removeClass("btn-primary")
        .addClass("btn-success");

      $("#contactForm")[0].reset();

      showNotification("Success! We'll get back to you soon.", "success");

      setTimeout(function () {
        $btn
          .html(originalText)
          .addClass("btn-primary")
          .removeClass("btn-success")
          .prop("disabled", false);
      }, 3000);
    }, 2000);
  });

  // Notification function
  function showNotification(message, type) {
    const notification = $("<div>")
      .addClass(`alert alert-${type} alert-dismissible fade show shadow-lg`)
      .css({
        position: "fixed",
        top: "100px",
        right: "20px",
        "z-index": 9999,
        "min-width": "300px",
      })
      .html(
        `
                <i class="fas fa-${
                  type === "success" ? "check-circle" : "info-circle"
                } me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `
      )
      .hide()
      .fadeIn(300);

    $("body").append(notification);

    setTimeout(function () {
      notification.fadeOut(300, function () {
        $(this).remove();
      });
    }, 4000);
  }

  // Number counter animation
  function animateNumber($element) {
    const finalValue = $element.text();
    const isPercentage = finalValue.includes("%");
    const isPlusSign = finalValue.includes("+");
    const numericValue = parseInt(finalValue.replace(/\D/g, ""));

    $({ counter: 0 }).animate(
      { counter: numericValue },
      {
        duration: 2000,
        easing: "swing",
        step: function () {
          $element.text(
            Math.floor(this.counter) +
              (isPlusSign ? "+" : "") +
              (isPercentage ? "%" : "")
          );
        },
        complete: function () {
          $element.text(
            numericValue + (isPlusSign ? "+" : "") + (isPercentage ? "%" : "")
          );
        },
      }
    );
  }

  // Trigger number animation when visible
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !$(entry.target).data("animated")) {
          animateNumber($(entry.target));
          $(entry.target).data("animated", true);
        }
      });
    },
    { threshold: 0.5 }
  );

  $(".display-4").each(function () {
    if ($(this).text().match(/\d/)) {
      observer.observe(this);
    }
  });

  // Scroll progress indicator
  const $progressBar = $("<div>").css({
    position: "fixed",
    top: 0,
    left: 0,
    height: "4px",
    background: "linear-gradient(90deg, #EE9B00, #005F73)",
    "z-index": 10000,
    width: "0",
    transition: "width 0.1s",
  });

  $("body").prepend($progressBar);

  $(window).on("scroll", function () {
    const winHeight = $(window).height();
    const docHeight = $(document).height();
    const scrollTop = $(window).scrollTop();
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

    $progressBar.css("width", scrollPercent + "%");
  });

  // Button ripple effect
  $(".btn").on("click", function (e) {
    const $button = $(this);
    const $ripple = $('<span class="ripple"></span>');

    const x = e.pageX - $button.offset().left;
    const y = e.pageY - $button.offset().top;

    $ripple.css({
      position: "absolute",
      "border-radius": "50%",
      background: "rgba(255,255,255,0.6)",
      width: "100px",
      height: "100px",
      left: x - 50 + "px",
      top: y - 50 + "px",
      "pointer-events": "none",
      animation: "ripple 0.6s",
    });

    $button
      .css({
        position: "relative",
        overflow: "hidden",
      })
      .append($ripple);

    setTimeout(function () {
      $ripple.remove();
    }, 600);
  });

  // Add ripple animation
  $("<style>")
    .text(
      `
            @keyframes ripple {
                from {
                    opacity: 1;
                    transform: scale(0);
                }
                to {
                    opacity: 0;
                    transform: scale(4);
                }
            }
        `
    )
    .appendTo("head");

  // Auto-close accordion and scroll
  $(".accordion-button").on("click", function () {
    const $button = $(this);
    setTimeout(function () {
      if (!$button.hasClass("collapsed")) {
        $("html, body").animate(
          {
            scrollTop: $button.offset().top - 100,
          },
          300
        );
      }
    }, 350);
  });

  // Form validation enhancement
  $("input, textarea, select").on("blur", function () {
    const $input = $(this);
    if ($input.prop("required") && !$input.val()) {
      $input.addClass("is-invalid").removeClass("is-valid");
    } else if ($input.val()) {
      $input.addClass("is-valid").removeClass("is-invalid");
    }
  });

  $("input, textarea, select").on("input", function () {
    const $input = $(this);
    if ($input.hasClass("is-invalid") && $input.val()) {
      $input.removeClass("is-invalid").addClass("is-valid");
    }
  });

  // Set first nav link as active on load
  $(".nav-link").first().addClass("active");

  /* HERO SLIDER */
  let currentIndex = 0;
  const slides = $(".hero-slide");
  const totalSlides = slides.length;
  const intervalTime = 6000;

  function showSlide(index) {
    slides.removeClass("active");
    slides.eq(index).addClass("active");
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentIndex);
  }

  // Initial slide
  showSlide(currentIndex);

  // Auto slide
  let autoSlide = setInterval(nextSlide, intervalTime);

  // Navigation buttons
  $(".hero-nav.next").on("click", function () {
    clearInterval(autoSlide);
    nextSlide();
    autoSlide = setInterval(nextSlide, intervalTime);
  });

  $(".hero-nav.prev").on("click", function () {
    clearInterval(autoSlide);
    prevSlide();
    autoSlide = setInterval(prevSlide, intervalTime);
  });

  // Pause on hover
  $(".hero").hover(
    function () {
      clearInterval(autoSlide);
    },
    function () {
      autoSlide = setInterval(nextSlide, intervalTime);
    }
  );

  // Back to Top Button and Social Media Buttons
  const $backToTop = $('#backToTop');
  const $socialFloating = $('.social-floating');

  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 300) {
      $backToTop.addClass('show');
      $socialFloating.addClass('show');
    } else {
      $backToTop.removeClass('show');
      $socialFloating.removeClass('show');
    }
  });

  $backToTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 800);
  });

  // Console welcome message
  console.log(
    "%cSignare Academy",
    "font-size: 24px; font-weight: bold; color: #005F73;"
  );
  console.log(
    "%cWelcome to our website! 🎓",
    "font-size: 16px; color: #EE9B00;"
  );
});