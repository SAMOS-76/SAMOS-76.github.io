/* Discipline filter for the All Projects grid.
   Chips are hidden until this runs, so without JS every project is shown. */
(function () {
  var group = document.querySelector('[data-filters]');
  var grid = document.querySelector('[data-grid]');
  if (!group || !grid) return;

  var chips = Array.prototype.slice.call(group.querySelectorAll('[data-filter]'));
  var items = Array.prototype.slice.call(grid.children);
  var status = document.querySelector('[data-filter-status]');
  var empty = document.querySelector('[data-filter-empty]');

  function apply(filter) {
    var shown = 0;
    items.forEach(function (li) {
      var tags = (li.getAttribute('data-disciplines') || '').split(' ');
      var match = filter === 'all' || tags.indexOf(filter) !== -1;
      li.hidden = !match;
      if (match) shown++;
    });
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === filter));
    });
    if (empty) empty.hidden = shown > 0;
    if (status) status.textContent = 'Showing ' + shown + (shown === 1 ? ' project' : ' projects');
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () { apply(chip.getAttribute('data-filter')); });
  });

  group.hidden = false;
})();
