(function () {
  const state = {
    title: "Finish React Project",
    description:
      "Complete UI and submit before deadline. Make sure test ids are correct. This is long to test collapse behavior.",
    priority: "High",
    status: "Pending",
    dueDate: new Date("2026-03-01T18:00:00"),
    expanded: false,
  };

  let snapshot = null;
  let timer = null;

  const $ = (id) => document.getElementById(id);

  const card = $("todo-card");
  const viewMode = $("view-mode");
  const editMode = $("edit-mode");

  const displayTitle = $("display-title");
  const displayDesc = $("display-desc");
  const displayPriority = $("display-priority");
  const displayDue = $("display-due");

  const timeRemaining = $("time-remaining");
  const overdueIndicator = $("overdue-indicator");

  const statusDisplay = $("status-display");
  const statusControl = $("status-control");
  const completeToggle = $("complete-toggle");

  const progressFill = $("progress-fill");

  const expandBtn = $("expand-toggle-btn");
  const expandLabel = $("expand-label");
  const collapsible = $("collapsible-section");

  const editBtn = $("edit-btn");
  const deleteBtn = $("delete-btn");

  const editTitle = $("edit-title-input");
  const editDesc = $("edit-desc-input");
  const editPriority = $("edit-priority-select");
  const editDue = $("edit-due-date-input");

  editMode.classList.add("hidden");
viewMode.classList.remove("hidden");

  function priorityClass(p) {
    return "priority-" + p.toLowerCase();
  }

  function statusClass(s) {
    return "status-" + s.toLowerCase().replace(" ", "");
  }

  function render() {
    card.className =
      "card " + priorityClass(state.priority) + " " + statusClass(state.status);

    displayTitle.textContent = state.title;
    displayDesc.textContent = state.description;
    displayPriority.textContent = state.priority;

    displayDue.textContent = "Due " + state.dueDate.toLocaleDateString();

    statusDisplay.textContent = state.status;

    statusControl.value = state.status;
    completeToggle.checked = state.status === "Done";

    progressFill.style.width =
      state.status === "Done"
        ? "100%"
        : state.status === "In Progress"
        ? "50%"
        : "0%";

    const isLong = state.description.length > 80;
    expandBtn.style.display = isLong ? "inline-flex" : "none";

    renderTime();
  }

  function renderTime() {
    if (state.status === "Done") {
      timeRemaining.textContent = "Completed";
      overdueIndicator.classList.add("hidden");
      return;
    }

    const diff = state.dueDate - new Date();
    const abs = Math.abs(diff);

    const mins = Math.floor(abs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    let text = "";

    if (diff <= 0) {
      overdueIndicator.classList.remove("hidden");
      text =
        hours < 1
          ? `Overdue by ${mins} min`
          : hours < 24
          ? `Overdue by ${hours} hrs`
          : `Overdue by ${days} days`;
    } else {
      overdueIndicator.classList.add("hidden");
      text =
        mins < 60
          ? `Due in ${mins} min`
          : hours < 24
          ? `Due in ${hours} hrs`
          : `Due in ${days} days`;
    }

    timeRemaining.textContent = text;
  }

  function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(renderTime, 30000);
  }

  expandBtn.addEventListener("click", () => {
    state.expanded = !state.expanded;

    collapsible.className =
      "collapsible " + (state.expanded ? "expanded" : "collapsed");

    expandBtn.setAttribute("aria-expanded", String(state.expanded));
    expandLabel.textContent = state.expanded ? "Show less" : "Show more";
  });

  statusControl.addEventListener("change", (e) => {
    state.status = e.target.value;
    completeToggle.checked = state.status === "Done";
    render();
  });

  completeToggle.addEventListener("change", (e) => {
    state.status = e.target.checked ? "Done" : "Pending";
    statusControl.value = state.status;
    render();
  });

  editBtn.addEventListener("click", () => {
    snapshot = structuredClone(state);

    editTitle.value = state.title;
    editDesc.value = state.description;
    editPriority.value = state.priority;
    editDue.value = new Date(state.dueDate).toISOString().slice(0, 16);

    viewMode.classList.add("hidden");
    editMode.classList.remove("hidden");
  });

  editMode.addEventListener("submit", (e) => {
    e.preventDefault();

    state.title = editTitle.value;
    state.description = editDesc.value;
    state.priority = editPriority.value;
    state.dueDate = new Date(editDue.value);

    exitEdit();
  });

  function exitEdit() {
    editMode.classList.add("hidden");
    viewMode.classList.remove("hidden");
    render();
    editBtn.focus();
  }

  document.querySelector('[data-testid="test-todo-cancel-button"]')
    .addEventListener("click", () => {
      if (snapshot) Object.assign(state, snapshot);
      exitEdit();
    });

  deleteBtn.addEventListener("click", () => {
    alert("Delete clicked");
  });

  render();
  startTimer();
})();