Template.IMonBarchartSettings.onCreated(function() {
  this.subscribe('imon_indicators');
  this.subscribe('imon_countries');
});


Template.IMonBarchartSettings.helpers({
  singleIndicator: function() { return Template.currentData().mode === 'single' ? true : false; },
  indicator: function() { return IMonIndicators.find({}, { sort: { shortName: 1 }}); },
  country: function() { return IMonCountries.find({ isRegion: false }, { sort: { name: 1 } } ); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  isChecked: function(a, b) { return a === b ? 'checked' : ''; },
  isInArray: function(val, arr) { return arr.indexOf(val) == -1 ? '' : 'selected'; },
  isSorted: function(){ return Template.currentData().sorted ? 'checked' : ''; }
});

Template.IMonBarchartSettings.events({
  'click .save-barchart-settings': function(ev, template) {
    // mode
    var mode = template.find('input[name="mode"]:checked').value;

    // x
    var xValueSingle = $(template.find('.countries-select')).val();
    var xValueMulti = $(template.find('.indicators-select')).val();
    var xIndicatorSingle = mode === 'single' ? xValueSingle : Template.currentData().x.single.indicator;
    var xIndicatorMulti = mode === 'multi' ? StringToInt(xValueMulti) : Template.currentData().x.multi.indicator;

    // y
    var yIndicatorValue = template.find('#y-select-' + mode).value;
    var yIndicatorSingle = mode === 'single' ? yIndicatorValue : Template.currentData().y.single.indicator;
    var yIndicatorMulti = mode === 'multi' ? yIndicatorValue : Template.currentData().y.multi.indicator;

    var newData = {
      title: template.find('.barchart-title').value,
      mode: mode,
      sorted: template.find('.sort-option').checked,
      x: {
        single:{
          indicator: xIndicatorSingle
        },
        multi: {
          indicator: xIndicatorMulti
        }        
      },
      y: {
        single:{
          indicator: parseInt(yIndicatorSingle)
        },
        multi: {
          indicator: yIndicatorMulti
        }
      }};
    template.closeSettings();
    this.set(newData);
  },
  'change input[name="mode"]': function(ev, template){
    // Show/Hide appropriate settings based on mode selection
    var mode = $(template.find('input[name="mode"]:checked')).val();
    var div = mode === 'single' ? { show: '.single-settings', hide: '.multi-settings' } : { hide: '.single-settings', show: '.multi-settings' };
    $(template.find(div.show)).show();
    $(template.find(div.hide)).hide();
  },
  'mousedown .multi-option': function(ev, template){ 
    // 1. Remove the need to hold down ctrl in order to select countries
    ev.preventDefault();
    var box = ev.target.parentElement;
    var scroll_offset = box.scrollTop; // How many px from the top
    ev.target.selected = !ev.target.selected;
    box.scrollTop = scroll_offset; // Prevent scrolling away when selection is toggled

    // 2. Display the number of selected items
    var mode = $(template.find('input[name="mode"]:checked')).val();
    var selectionBox = mode === 'single' ? '.countries-select' : '.indicators-select';
    var num_selected = $(template.find(selectionBox)).val() == null ? 0 : $(template.find(selectionBox)).val().length;
    $(template.find(selectionBox + '-number')).text(num_selected + ' SELECTED');
  }
});

function StringToInt(arr){
  // Convert an array of strings (of numbers) into an array of integers. Used for array of indicator IDs.
  var res = [];
  for(var i=0; i<arr.length; i++)
    res.push(parseInt(arr[i]));
  return res;
}
