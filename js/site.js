const themeStorageKey = 'tonyanziano-currentTheme';
const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');

// loads and returns the current theme
function loadTheme() {
  let currentTheme = localStorage.getItem(themeStorageKey);
  if (!currentTheme) {
    // theme needs to be initialized
    currentTheme = 'light';
    localStorage.setItem(themeStorageKey, currentTheme);
  }
  return currentTheme;
}

function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('dark');
    document.body.classList.add(theme);
    themeToggle.classList.remove('toggled');
    themeToggleIcon.setAttribute('src', 'media/light-theme-icon.svg');
  } else {
    document.body.classList.remove('light');
    document.body.classList.add(theme);
    themeToggle.classList.add('toggled');
    themeToggleIcon.setAttribute('src', 'media/dark-theme-icon.svg');
  }
  localStorage.setItem(themeStorageKey, theme);
}

function toggleTheme() {
  console.log('toggling theme');
  const currentTheme = loadTheme();
  if (currentTheme === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}

// theme initialization
setTheme(loadTheme());
themeToggle.onclick = toggleTheme;
