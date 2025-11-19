let slideIndex = 1;
let slideInterval;

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeButton = document.querySelector('.modal-content .close-button');

  if (loginBtn && loginModal && closeButton) {
    loginBtn.addEventListener('click', () => {
      loginModal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
      loginModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    });
  }

  // Initialize slider
  showSlides(slideIndex);
  startSlideShow();
});

function plusSlides(n) {
  clearInterval(slideInterval); // Clear interval on manual navigation
  showSlides(slideIndex += n);
  startSlideShow(); // Restart interval
}

function currentSlide(n) {
  clearInterval(slideInterval); // Clear interval on manual navigation
  showSlides(slideIndex = n);
  startSlideShow(); // Restart interval
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slide");
  let indicators = document.getElementsByClassName("indicator");

  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < indicators.length; i++) {
    indicators[i].className = indicators[i].className.replace(" active", "");
  }

  if (slides.length > 0) {
    slides[slideIndex - 1].style.display = "block";
    indicators[slideIndex - 1].className += " active";
  }
}

function startSlideShow() {
  slideInterval = setInterval(() => {
    plusSlides(1);
  }, 5000); // Change image every 5 seconds
}