// BUC Product Data (you can expand this)
const bucProducts = {
  "Ku-band 8W BUC": [
    {
      category: "Mini",
      partNo: "MM-T1308G",
      inputFreq: "950 - 1700 MHz",
      loFreq: "12.80 GHz",
      outputFreq: "13.75 - 14.50 GHz",
      outputPower: "+39 dBm (Psat)",
      phaseNoise: "-75 dBc/Hz",
      gain: "65 dB typ",
      dcPower: "50W",
      dimension: "130 x 100 x 65 mm / 1.5 kg"
    },
    {
      category: "Mini",
      partNo: "MM-T1408G",
      inputFreq: "950 - 1700 MHz",
      loFreq: "13.05 GHz",
      outputFreq: "14.00 - 14.50 GHz",
      outputPower: "+39 dBm (Psat)",
      phaseNoise: "-75 dBc/Hz",
      gain: "65 dB typ",
      dcPower: "50W",
      dimension: "130 x 100 x 65 mm / 1.5 kg"
    },
    {
      category: "Mobility",
      partNo: "M-T1208",
      inputFreq: "950 - 1450 MHz",
      loFreq: "11.80 GHz",
      outputFreq: "12.75 - 13.25 GHz",
      outputPower: "+39 dBm (P1dB)",
      phaseNoise: "-73 dBc/Hz",
      gain: "62 dB",
      dcPower: "85W",
      dimension: "180 x 130 x 80 mm / 2.4 kg"
    },
    {
      category: "Mobility",
      partNo: "M-T1308",
      inputFreq: "950 - 1700 MHz",
      loFreq: "12.80 GHz",
      outputFreq: "13.75 - 14.50 GHz",
      outputPower: "+39 dBm (P1dB)",
      phaseNoise: "-73 dBc/Hz",
      gain: "62 dB",
      dcPower: "85W",
      dimension: "180 x 130 x 80 mm / 2.4 kg"
    }
  ]
};

// DOM references
const bandSelect = document.getElementById("customShape");
const partSelect = document.getElementById("customPartNo");
const addToCartBtn = document.querySelector(".add-to-cart-btn");

const powerField = document.getElementById("customPower");
const gainField = document.getElementById("customGain");
const freqField = document.getElementById("customFreq");
const inputFreqField = document.getElementById("customInputFreq");
const loFreqField = document.getElementById("customLOFreq");
const phaseNoiseField = document.getElementById("customPhaseNoise");
const dcPowerField = document.getElementById("customDCPower");
const dimensionField = document.getElementById("customDimension");

// Disable Add to Cart by default
if (addToCartBtn) addToCartBtn.disabled = true;

// When band is selected
bandSelect.addEventListener("change", () => {
  const selectedBand = bandSelect.value;
  const products = bucProducts[selectedBand] || [];

  // Reset part number dropdown
  partSelect.innerHTML = '<option value="">Select Part Number</option>';
  partSelect.selectedIndex = 0;

  // Group products by category
  const grouped = {};
  products.forEach((product, index) => {
    if (!grouped[product.category]) grouped[product.category] = [];
    grouped[product.category].push({ ...product, index });
  });

  // Populate part numbers grouped by category
  for (const category in grouped) {
    const group = document.createElement("optgroup");
    group.label = category;
    grouped[category].forEach(prod => {
      const option = document.createElement("option");
      option.value = prod.index;
      option.textContent = prod.partNo;
      group.appendChild(option);
    });
    partSelect.appendChild(group);
  }

  // Clear all detail fields
  [
    powerField, gainField, freqField,
    inputFreqField, loFreqField, phaseNoiseField,
    dcPowerField, dimensionField
  ].forEach(field => field.value = "");

  // Disable Add to Cart until valid part selected
  if (addToCartBtn) addToCartBtn.disabled = true;
});

// When part number is selected
partSelect.addEventListener("change", () => {
  const selectedBand = bandSelect.value;
  const index = parseInt(partSelect.value);
  const product = bucProducts[selectedBand]?.[index];

  if (product) {
    powerField.value = product.outputPower;
    gainField.value = product.gain;
    freqField.value = product.outputFreq;
    inputFreqField.value = product.inputFreq;
    loFreqField.value = product.loFreq;
    phaseNoiseField.value = product.phaseNoise;
    dcPowerField.value = product.dcPower;
    dimensionField.value = product.dimension;

    if (addToCartBtn) addToCartBtn.disabled = false;
  } else {
    if (addToCartBtn) addToCartBtn.disabled = true;
  }
});

// Reset modal when shown to prevent default selection
$('#customizeModal').on('show.bs.modal', function () {
  if (bandSelect) bandSelect.selectedIndex = 0;
  if (partSelect) {
    partSelect.innerHTML = '<option value="">Select Part Number</option>';
    partSelect.selectedIndex = 0;
  }

  // Clear all product fields
  [
    powerField, gainField, freqField,
    inputFreqField, loFreqField, phaseNoiseField,
    dcPowerField, dimensionField
  ].forEach(field => {
    if (field) field.value = "";
  });

  // Reset quantity and description
  document.getElementById("customQuantity").value = 1;
  document.getElementById("customDescription").value = "";

  // Disable Add to Cart button
  
  if (addToCartBtn) addToCartBtn.disabled = true;
});
