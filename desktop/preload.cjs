function markDesktopShell() {
  document.documentElement.dataset.shell = "mac-app";
}

if (document.documentElement) markDesktopShell();
document.addEventListener("DOMContentLoaded", markDesktopShell);
