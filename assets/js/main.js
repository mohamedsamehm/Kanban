(function () {
  ("use strict");
  const tasks = {
    notStarted: localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks")).notStarted
      : [],
    inProgress: localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks")).inProgress
      : [],
    completed: localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks")).completed
      : [],
  };
  if (localStorage.getItem("tasks")) {
    Object.keys(JSON.parse(localStorage.getItem("tasks"))).forEach(
      (element) => {
        JSON.parse(localStorage.getItem("tasks"))[element].forEach((task) => {
          let taskParent = document.createElement("div");
          let span = document.createElement("span");
          let div = document.createElement("div");
          let button1 = document.createElement("button");
          let button2 = document.createElement("button");
          let editIcon = document.createElement("i");
          let deleteIcon = document.createElement("i");
          taskParent.classList.add("task");
          taskParent.setAttribute("draggable", true);
          span.innerHTML = task;
          button1.classList.add("edit-task");
          editIcon.classList.add("fa-regular");
          editIcon.classList.add("fa-pen-to-square");
          button1.append(editIcon);
          button2.classList.add("delete-task");
          deleteIcon.classList.add("fa-solid");
          deleteIcon.classList.add("fa-trash-can");
          button2.append(deleteIcon);
          div.append(button1, button2);
          taskParent.append(span, div);
          document
            .querySelector(`[data-type=${element}] .tasks`)
            .append(taskParent);
        });
      }
    );
  }

  document.querySelectorAll(".add-task").forEach((el) => {
    el.addEventListener("click", function () {
      // Create task Element
      let taskParent = document.createElement("div");
      let input = document.createElement("input");
      let div = document.createElement("div");
      let button1 = document.createElement("button");
      let button2 = document.createElement("button");
      let editIcon = document.createElement("i");
      let deleteIcon = document.createElement("i");
      let title = this.parentElement.parentElement.getAttribute("data-type");
      taskParent.classList.add("task");
      taskParent.setAttribute("draggable", true);
      input.value = "New Task";
      button1.classList.add("edit-task");
      editIcon.classList.add("fa-regular");
      editIcon.classList.add("fa-pen-to-square");
      button1.append(editIcon);
      button2.classList.add("delete-task");
      deleteIcon.classList.add("fa-solid");
      deleteIcon.classList.add("fa-trash-can");
      button2.append(deleteIcon);
      div.append(button1, button2);
      taskParent.append(input, div);
      this.parentNode.querySelector(".tasks").append(taskParent);
      this.parentNode.querySelector(".tasks input").select();

      input.addEventListener("blur", function () {
        let span = document.createElement("span");
        span.innerHTML = input.value;
        tasks[title].push(input.value);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        input.parentNode.prepend(span);
        input.remove();
      });

      button1.addEventListener("click", function () {
        let input = document.createElement("input");
        input.value =
          this.parentNode.parentNode.querySelector("span").innerHTML;
        let oldVal = this.parentNode.parentNode.querySelector("span").innerHTML;
        this.parentNode.parentNode.querySelector("span").remove();
        this.parentNode.parentNode.prepend(input);
        this.parentNode.parentNode.querySelector("input").focus();
        input.addEventListener("blur", function () {
          let span = document.createElement("span");
          span.innerHTML = input.value;
          tasks[title][tasks[title].indexOf(oldVal)] = input.value;
          localStorage.setItem("tasks", JSON.stringify(tasks));
          input.parentNode.prepend(span);
          input.remove();
        });
      });

      button2.addEventListener("click", function () {
        tasks[title].splice(
          [
            tasks[title].indexOf(
              this.parentNode.parentNode.querySelector("span").innerHTML
            ),
          ],
          1
        );
        this.parentNode.parentNode.remove();
        localStorage.setItem("tasks", JSON.stringify(tasks));
      });
      taskParent.addEventListener("dragstart", dragStart);
      taskParent.addEventListener("dragend", dragEnd);
    });
  });

  document.querySelectorAll(".edit-task").forEach((el) => {
    el.addEventListener("click", function () {
      let input = document.createElement("input");
      input.value = this.parentNode.parentNode.querySelector("span").innerHTML;
      let oldVal = this.parentNode.parentNode.querySelector("span").innerHTML;
      this.parentNode.parentNode.querySelector("span").remove();
      this.parentNode.parentNode.prepend(input);
      this.parentNode.parentNode.querySelector("input").focus();
      input.addEventListener("blur", function () {
        let span = document.createElement("span");
        span.innerHTML = input.value;
        let title =
          this.parentNode.parentNode.parentNode.parentNode.getAttribute(
            "data-type"
          );
        tasks[title][tasks[title].indexOf(oldVal)] = input.value;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        input.parentNode.prepend(span);
        input.remove();
      });
    });
  });

  document.querySelectorAll(".delete-task").forEach((el) => {
    el.addEventListener("click", function () {
      let title =
        this.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute(
          "data-type"
        );
      tasks[title].splice(
        [
          tasks[title].indexOf(
            this.parentNode.parentNode.querySelector("span").innerHTML
          ),
        ],
        1
      );
      this.parentNode.parentNode.remove();
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });
  });

  /* draggable element */

  document.querySelectorAll(".task").forEach((task) => {
    task.addEventListener("dragstart", dragStart);
    // task.addEventListener("touchstart", dragStart);
    task.addEventListener("dragend", dragEnd);
    // task.addEventListener("touchend", dragEnd);
  });

  function dragStart(e) {
    this.classList.add("dragging");
    this.setAttribute(
      "data-prev-container",
      this.parentElement.parentElement.parentElement.getAttribute("data-type")
    );
    e.dataTransfer.setData("text/plain", this);
    e.dataTransfer.effectAllowed = "move";
  }

  function dragEnd(e) {
    let title =
      this.parentElement.parentElement.parentElement.getAttribute("data-type");
    let prevTitle = this.getAttribute("data-prev-container");
    tasks[prevTitle] = [];
    document
      .querySelectorAll(`[data-type='${prevTitle}'] .tasks .task`)
      .forEach((task) => {
        tasks[prevTitle].push(task.querySelector("span").innerHTML);
      });
    if (prevTitle !== title) {
      tasks[title] = [];
      document
        .querySelectorAll(`[data-type='${title}'] .tasks .task`)
        .forEach((task) => {
          tasks[title].push(task.querySelector("span").innerHTML);
        });
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    this.classList.remove("dragging");
  }

  /* drop targets */
  const tasksParent = document.querySelectorAll(".tasks-wrapper");

  tasksParent.forEach((tasks) => {
    // tasks.addEventListener("touchmove", dragOver);
    tasks.addEventListener("dragover", dragOver);
  });

  function dragOver(e) {
    e.preventDefault();
    const afterElement = dragAfterElement(
      this.querySelector(".tasks"),
      e.clientY
    );
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      this.querySelector(".tasks").appendChild(draggable);
    } else {
      this.querySelector(".tasks").insertBefore(draggable, afterElement);
    }
  }

  function dragAfterElement(container, y) {
    const draggbleElements = [
      ...container.querySelectorAll(".task:not(.dragging)"),
    ];

    return draggbleElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
})();
