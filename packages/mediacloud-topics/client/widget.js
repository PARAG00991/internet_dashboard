Template.MediaCloudTopicsWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('mc_wordlists', Template.currentData().country.code);
  });
});

Template.MediaCloudTopicsWidget.onRendered(function() {
  var template = this;
  var oldData = { country: {} };
  template.autorun(function() {
    var data = Template.currentData();
    if (_.isEqual(data.country, oldData.country)) {
      return;
    }
    template.$('.mc-tagcloud').empty();
    if (!template.subscriptionsReady()) {
      return;
    }

    oldData.country = data.country;
    var country = WordLists.findOne({ 'country.code': data.country.code });
    if (!country) { return; }
    var words = country.words.new;
    var dims = data.widget.package.metadata().widget.dimensions;
    var width = dims.width * Settings.cloud.widthMulti;
    var height = dims.height * Settings.cloud.heightMulti;
    var fill = d3.scale.category20();
    var maxCount = _.max(_.pluck(words, 'count'));
    var fontScale = d3.scale.linear().domain([1, maxCount])
      .range(Settings.cloud.fontScale);


    function draw(words) {
      d3.select(template.find('.mc-tagcloud')).append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return fontScale(d.count) + "px"; })
          .style("font-weight", "bold")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.term; });
    }

    d3.layout.cloud()
      .size([width, height])
      .words(words)
      .text(function(d) { return d.term; })
      .rotate(function() { return Math.random() * Settings.cloud.maxRotation *
        (Math.random() > 0.5 ? 1 : -1); })
      .font('Lato')
      .spiral('rectangular')
      .fontSize(function(d) { return fontScale(d.count); })
      .fontWeight('bold')
      .on("end", draw)
      .start();
  });
});

Template.MediaCloudTopicsWidget.helpers({
  words: function() {
    var words = WordLists.findOne({ 'country.code': this.country.code });
    /*
    if (Settings.countCutoff > 0) {
      newWords = _.filter(newWords, function(row) {
        return row.count >= Settings.countCutoff;
      });
    }
    */
    return words.words;
  },
  trimList: function(list) {
    return _.first(list, Settings.shownWords);
  }
});
