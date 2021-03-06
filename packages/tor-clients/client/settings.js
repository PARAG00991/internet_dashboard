Template.TorClientsSettings.onCreated(function() {
  this.subscribe('tor_countries');
});

Template.TorClientsSettings.helpers({
  countries: function() {
    return TorCountries.find({}, { sort: { name: 1 } });
  },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  isChecked: function(a, b) { return a === b ? 'checked' : ''; },
});

Template.TorClientsSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var nodeType = template.$('input[name="tor-node-type"]:checked').val();
    var newData = { countryCode: countryCode, nodeType: nodeType };
    this.set(newData);
    template.closeSettings();
  }
});
