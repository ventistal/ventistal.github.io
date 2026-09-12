(function () {
  fetch('/shared/templates/footer.html')
    .then(function (res) { return res.text(); })
    .then(function (html) {
      var isEnglish = location.pathname.startsWith('/en/');
      document.querySelectorAll('[data-footer]').forEach(function (placeholder) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        var footerEl = wrapper.firstElementChild;

        var labelEl = footerEl.querySelector('.footer-label');
        if (labelEl) labelEl.textContent = placeholder.getAttribute('data-label') || '';

        var activeFlag = footerEl.querySelector('[data-lang="' + (isEnglish ? 'en' : 'no') + '"]');
        if (activeFlag) activeFlag.classList.add('is-active');

        placeholder.replaceWith(footerEl);
      });
    })
    .catch(function () {});
})();
