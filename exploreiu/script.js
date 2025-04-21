document.addEventListener("DOMContentLoaded", async function () {
  try {
    const Clerk = window.Clerk;
    await Clerk.load({
      publishableKey: "pk_test_Y3J1Y2lhbC1tb3JheS04OS5jbGVyay5hY2NvdW50cy5kZXYk",
    });

    // Clear session flag on initial load
    sessionStorage.removeItem('authRedirect');

    // Explore button logic
    document.getElementById("explore-btn")?.addEventListener("click", () => {
      sessionStorage.setItem('authRedirect', 'true');
      if (Clerk.user) {
        window.location.href = "phase.html";
      } else {
        Clerk.openSignIn({
          afterSignInUrl: "phase.html",
          afterSignUpUrl: "phase.html"
        });
      }
    });

    // Update UI based on auth state
    const updateAuthUI = () => {
      const authContainer = document.getElementById('auth-items');
      if (Clerk.user) {
        authContainer.innerHTML = `
          <div class="d-flex align-items-center">
            <div id="user-button"></div>
            <button class="btn btn-outline-danger ms-2" id="sign-out-btn">Sign Out</button>
          </div>
        `;
        
        Clerk.mountUserButton('#user-button');
        
        document.getElementById('sign-out-btn').addEventListener('click', () => {
          sessionStorage.removeItem('authRedirect');
          Clerk.signOut(() => {
            window.location.href = 'index.html';
          });
        });
      } else {
        authContainer.innerHTML = `
          <button class="btn btn-outline-light" id="sign-in-btn">Sign In</button>
          <button class="btn btn-outline-light ms-2" id="sign-up-btn">Sign Up</button>
        `;
        
        document.getElementById('sign-in-btn')?.addEventListener('click', () => {
          sessionStorage.setItem('authRedirect', 'true');
          Clerk.openSignIn();
        });
        document.getElementById('sign-up-btn')?.addEventListener('click', () => {
          sessionStorage.setItem('authRedirect', 'true');
          Clerk.openSignUp();
        });
      }
    };

    // Initial UI update
    updateAuthUI();

    // Modified auth listener
    Clerk.addListener(({ user }) => {
      updateAuthUI();
      if (user && sessionStorage.getItem('authRedirect') === 'true') {
        sessionStorage.removeItem('authRedirect');
        window.location.href = 'phase.html';
      }
    });


  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');

  // Check for saved theme in localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      themeIcon.classList.replace('fa-moon', 'fa-sun'); // Change icon to sun
    }
  }

  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcon.classList.replace('fa-sun', 'fa-moon'); // Change icon to moon
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.classList.replace('fa-moon', 'fa-sun'); // Change icon to sun
      localStorage.setItem('theme', 'dark');
    }
  });


    
} catch (error) {
  console.error("Clerk initialization failed:", error);
}
});
