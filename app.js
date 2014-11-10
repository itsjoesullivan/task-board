function log(message) {
  console.log(message);
}
function error(message) {
  console.error(message);
}

log('initializing');
var dataStr = localStorage['data'];
var data;
if (dataStr) {
  var data = JSON.parse(dataStr);
} else {
  data = {
    tasks: []
  };
}

render(data);

function render(data) {
  if (!data.tasks) {
    error("No tasks array in data.");
  }
  $("body").empty();
  $("body").append("<div class='board'>" +
    "<div class='row'>" +
      "<div class='item header'>My court</div>" +
      "<div class='item header'>Their court</div>" +
    "</div>" +
  "</div>");
  data.tasks.forEach(renderTask);

  $("body").append("<div class='add'>+</div>");

  addListener();
}

function renderTaskTitle(task) {
  return " <input type=checkbox> " + task.name;
}

function renderTask(task) {
  if (!task.name) {
    error("No task name.");
  }
  if (!task.court) {
    error("No task court.");
  }
  $(".board").append("<div class='row'>" +
    (task.court === "mine" ? "<div class='item active'>" + renderTaskTitle(task) + "</div>" : "<div class='item'> </div>") +
    (task.court === "their" ? "<div class='item active'>" + renderTaskTitle(task) + "</div>" : "<div class='item'> </div>") +
  "</div>");
}

function addListener() {
  $("input").click(function(e) {
    // Keep from being interpreted as an item click
    e.stopPropagation();

    // Identify the task number
    $el = $(e.target);
    var $row = $el.parents('.row');
    var rowIndex = $row.parent().children().index($row);
    var taskIndex = rowIndex-1;

    // Pull out of data
    var task = data.tasks.splice(taskIndex, 1);

    // Place in history, creating if necessary
    data.history = data.history || [];
    data.history.push(task);


    // Store the data
    localStorage['data'] = JSON.stringify(data);
    // Re-render
    render(data);
  });

  $(".item").click(function(e) {
    var $el = $(e.target);
    var $activeEl = $el.parent().children('.active');

    // Determine which court
    var courtIndex = $el.parent().children().index($activeEl);
    var court = courtIndex === 0 ? 'mine' : 'their';
    var newCourt = court === 'mine' ? 'their' : 'mine';

    // Determine which row
    $row = $el.parent();
    rowIndex = $row.parent().children().index($row);
    var taskIndex = rowIndex - 1; // Because of the header

    // Set the court
    data.tasks[taskIndex].court = newCourt;

    // Store the data
    localStorage['data'] = JSON.stringify(data);
    // Re-render
    render(data);
  });


  $(".add").click(function(e) {
    var person = prompt("Name your task.");
    if (person) {
      data.tasks.push({
        court: "mine",
        name: person
      });
    }
    // Store the data
    localStorage['data'] = JSON.stringify(data);
    // Re-render
    render(data);
  });
}
