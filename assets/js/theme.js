/* DEV ONLY: palette/font picker. Removed at launch with `dev_switcher: false`. */
(function () {
  var form = document.querySelector('[data-dev-switcher]');
  if (!form) return;
  var root = document.documentElement;
  var defaults = { theme: 'oak', font: 'fraunces' };

  Object.keys(defaults).forEach(function (name) {
    var select = form.elements[name];
    select.value = root.getAttribute('data-' + name) || defaults[name];
    select.addEventListener('change', function () {
      root.setAttribute('data-' + name, select.value);
      try { localStorage.setItem('dev-' + name, select.value); } catch (e) {}
      var url = new URL(location.href);
      url.searchParams.set(name, select.value);
      history.replaceState(null, '', url);
    });
  });
})();
