// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let metadatasample = metadata.find(d => d.id === +sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let samplemeta = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    samplemeta.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metadatasample).forEach(([key, value]) => {
      samplemeta.append("p").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let samplenum = samples.find(d => d.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = samplenum.otu_ids;
    let otu_labels = samplenum.otu_labels;
    let sample_values = samplenum.sample_values;

    // Build a Bubble Chart
    let bubbleotu = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'YlGnBu'
      },
      type: 'scatter'
    };

    let bubblelabels = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Amount of Bacteria' }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', [bubbleotu], bubblelabels);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let barValues = sample_values.slice(0, 10).reverse();
    let barLabels = otu_labels.slice(0, 10).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barotu = {
      x: barValues,
      y: yticks,
      text: barLabels,
      type: 'bar',
      orientation: 'h'
    };

    let barlabels = {
      title: 'Top 10 OTUs Found in Sample',
      xaxis: { title: 'Amount of Bacteria' },
      yaxis: { title: 'OTU IDs' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [barotu], barlabels);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(sample => {
      dropdown.append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get the first sample from the list
    let firstsample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstsample);
    buildMetadata(firstsample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
