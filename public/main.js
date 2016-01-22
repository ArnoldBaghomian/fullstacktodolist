'use strict';

$(document).ready(function() {
  bringupItems();
  $('.add').click(addtask);
  $('body').on('click','.deleteButton', itemdelete);
  $('body').on('click','.toggle', switchup);
});

function appendIt(data) {
  data.forEach(function(obj) {
    var $chall = $('#template').clone();
    $chall.removeAttr('id');
    $chall.children('.tTask').text(obj.item);
    $chall.children('.whatdue').text(obj.date);
    $('#topHeader').append($chall);
    appendfinish(obj.complete, $chall);
  });
}

function bringupItems() {
  $.get('./stuff', function(data) {
    appendIt(data);
  })
}

function appendfinish(data, $row) {
  if (data === true) {
    $row.css('text-decoration', 'line-through');
    $row.find('.toggle').prop('checked', true);
  } else {
    $row.css('text-decoration', 'none');
    $row.find('.toggle').prop('checked', false);
  }
}

function switchup() {
  var $tr = $(this).closest('tr');
  var index = $tr.index() - 1;
  $.post('./stuff/toggle', {"index": index})
  .success(function(data) {
    appendfinish(data, $tr);
  })
  .fail(function(err) {
   alert('task still not complete');
 });
}

function addtask() {
  var newItem = $('#myInput').val();
  var newDate = $('#date').val();
  $.post('./stuff/add', {
    item: newItem,
    date: newDate,
    checked: false
  })
  .success(function(data) {
    appendItem(data);
  })
  .fail(function(err) {
    alert('congrats new task');
  });
}

function itemdelete() {
  var $tr = $(this).closest('tr');
  var index  = $tr.index() - 1;
  $.post('./stuff/delete', {"index": index})
  .success(function(data) {
    $tr.remove();
  })
  .fail(function(err) {
    alert('Your item is deleted');
  });
}