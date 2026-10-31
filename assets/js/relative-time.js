// Formats dates in the reader's time zone: the footer's build time and the home
// table's last-build labels. The markup keeps an absolute value as the text, so
// a reader without this script, and github.com which never runs it, still sees a
// readable date.
(function () {
  "use strict";

  function parse(value) {
    if (!value) {
      return null;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      var parts = value.split("-").map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    var parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  function localDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function formatLocal(date) {
    return date.toLocaleString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short"
    });
  }

  function relativeLabel(then) {
    var today = localDay(new Date());
    var target = localDay(then);
    var days = Math.round((today - target) / 86400000);
    if (days <= 0) {
      return "today";
    }
    if (days === 1) {
      return "yesterday";
    }
    if (days < 30) {
      return days + " days ago";
    }
    var months = (today.getFullYear() - target.getFullYear()) * 12
      + (today.getMonth() - target.getMonth());
    if (today.getDate() < target.getDate()) {
      months -= 1;
    }
    if (months < 12) {
      return months <= 1 ? "1 month ago" : months + " months ago";
    }
    var years = Math.floor(months / 12);
    return years === 1 ? "1 year ago" : years + " years ago";
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("time[data-local-time]"),
    function (node) {
      var date = parse(node.getAttribute("datetime"));
      if (date) {
        node.textContent = formatLocal(date);
      }
    }
  );

  Array.prototype.forEach.call(
    document.querySelectorAll("time[data-relative]"),
    function (node) {
      var date = parse(node.getAttribute("datetime"));
      if (!date) {
        return;
      }
      node.setAttribute("title", formatLocal(date));
      node.textContent = relativeLabel(date);
    }
  );
})();
