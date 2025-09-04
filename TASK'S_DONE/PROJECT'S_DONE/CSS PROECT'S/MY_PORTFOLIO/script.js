document.addEventListener('DOMContentLoaded', () => {

    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById("backToTopBtn");

    if (backToTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
        };

        backToTopBtn.addEventListener('click', () => {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        });
    }

    // --- Contact Form Submission using Web3Forms ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const formStatus = document.getElementById('form-status');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // !!! IMPORTANT: Replace with your own access key from web3forms.com !!!
            const accessKey = '0ed93d29-90fb-4dec-a538-0dc42878dc10'; 
            
            const formData = new FormData(contactForm);
            formData.append("access_key", accessKey);

            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            formStatus.innerHTML = "Please Wait, Sending Now...!";
            formStatus.style.color = "#00ff33ff";

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200) {
                    window.location.href = 'success.html';
                } else {
                    console.log(response);
                    formStatus.innerHTML = jsonResponse.message || "Something went wrong!";
                    formStatus.style.color = "#ff6b6b"; // A reddish color for errors
                }
            })
            .catch(error => {
                console.log(error);
                formStatus.innerHTML = "Something went wrong!";
                formStatus.style.color = "#ff6b6b";
            });
        });
    }
});