// Renders the home table's "Last build" cells relative to the viewer's clock.
// The markup keeps the absolute date in the text and in datetime, so a reader
// without this script, and github.com which never runs it, still sees the date.
(function () {
  "use strict";

  var nodes = document.querySelectorAll("time[data-relative]");
  if (!nodes.length) {
    return;
  }

  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  function parse(value) {
    var parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function label(then) {
    var days = Math.round((today - then) / 86400000);
    if (days <= 0) {
      return "today";
    }
    if (days === 1) {
      return "yesterday";
    }
    if (days < 30) {
      return days + " days ago";
    }
    var months = (today.getFullYear() - then.getFullYear()) * 12
      + (today.getMonth() - then.getMonth());
    if (today.getDate() < then.getDate()) {
      months -= 1;
    }
    if (months < 12) {
      return months <= 1 ? "1 month ago" : months + " months ago";
    }
    var years = Math.floor(months / 12);
    return years === 1 ? "1 year ago" : years + " years ago";
  }

  Array.prototype.forEach.call(nodes, function (node) {
    var value = node.getAttribute("datetime");
    if (!value) {
      return;
    }
    var then = parse(value);
    node.setAttribute("title", value);
    node.textContent = label(then);
  });
})();
