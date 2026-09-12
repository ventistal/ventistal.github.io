(function () {
  fetch('/shared/footer.html')
    .then(function (res) { return res.text(); })
    .then(function (html) {
      var isEnglish = location.pathname.startsWith('/en/');
      document.querySelectorAll('[data-lang-switcher]').forEach(function (el) {
        el.innerHTML = html;
        var active = el.querySelector('[data-lang="' + (isEnglish ? 'en' : 'no') + '"]');
        if (active) active.classList.add('is-active');
      });
    })
    .catch(function () {});
})();
