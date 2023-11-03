// 1. Initialization and Data Population
console.log("Step 1");
const stateDistrictCount = new Map();
let stateDistrictData = {};
const outputArea = document.getElementById('output');

const populateData = defaultCSVData => {
    console.log("Step 1.1");
    const lines = defaultCSVData.split('\n');
    for (let i = 1; i < lines.length; i++) {
        const [category, district, state] = lines[i].split(',');
        if (!stateDistrictData[state]) {
            stateDistrictData[state] = [];
        }
        stateDistrictData[state].push(district);
    }
    populateStates(stateDistrictData);
};

// 2. Populating States
const populateStates = stateDistrictData => {
    console.log("Step 2");
    const stateContainer = document.getElementById('state-container');
    const fragment = document.createDocumentFragment();
    const sortedStates = Object.keys(stateDistrictData).sort();

    for (const state of sortedStates) {
        const stateDiv = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = state;
        checkbox.classList = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
        checkbox.value = state;
        checkbox.addEventListener('change', function (event) {
            handleStateChange(event, state, stateDistrictData[state], stateDistrictData);
        });

        const label = document.createElement('label');
        label.htmlFor = state;
        label.className = 'font-mono'; // Monospaced font
        label.appendChild(document.createTextNode(state));

        stateDiv.appendChild(checkbox);
        stateDiv.appendChild(label);
        fragment.appendChild(stateDiv);
    }

    stateContainer.appendChild(fragment);
}

// 3. Handling State Changes
const handleStateChange = (event, state, districts, stateDistrictData) => {
    console.log("Step 3");
    const isChecked = event.target.checked;
    if (isChecked) {
        event.target.parentElement.classList.add('state-active');
    } else {
        event.target.parentElement.classList.remove('state-active');
    }

    // Update the UI based on the state selection
    updateSummaryLabel(stateDistrictData);
}

// 4. Handling District Changes
const handleDistrictChange = (isChecked, district, state) => {
    console.log("Step 4");
    if (isChecked) {
        selectedDistricts.add(district);
        document.getElementById(state).parentElement.classList.add('state-active');
    } else {
        selectedDistricts.delete(district);
        if (!Array.from(selectedDistricts).some(d => d.endsWith(state))) {
            document.getElementById(state).parentElement.classList.remove('state-active');
        }
    }
    debouncedUpdateOutput();
}

// 5. Update Output Function
const updateOutput = () => {
    console.log("Step 5");
    const sortedDistricts = Array.from(selectedDistricts).sort();
    outputArea.value = sortedDistricts.join('~');
    outputArea.style.height = 'auto';
    outputArea.style.height = (outputArea.scrollHeight) + "px";
    const copyButton = document.querySelector("button[onclick='copyToClipboard()']");
    const districtCount = sortedDistricts.length;
    copyButton.textContent = `Copy ${districtCount} District${districtCount !== 1 ? 's' : ''} to Clipboard`;
    updateSummaryLabel(stateDistrictData);
}
const debouncedUpdateOutput = _.debounce(updateOutput, 300);

// 6. Update Summary Label
const updateSummaryLabel = stateDistrictData => {
    console.log("Step 6");
    let summaryText = "";
    const sortedStates = Array.from(stateDistrictCount.keys()).sort();
    sortedStates.forEach(state => {
        const count = stateDistrictCount.get(state);
        if (count > 0) {
            const totalCount = stateDistrictData[state].length;
            summaryText += `${count} of ${totalCount} ${state} Districts<br>`;
        }
    });
    summaryText = summaryText.slice(0, -4); // Remove trailing <br>
    document.getElementById('summaryLabel').innerHTML = summaryText;
}

// 7. Copy to Clipboard Function
const copyToClipboard = () => {
    console.log("Step 7");
    outputArea.select();
    document.execCommand('copy');
};

// 8. Document Load Event
document.addEventListener("DOMContentLoaded", () => {
    console.log("Step 8");
    populateData(defaultCSVData.trim());
});

// 9. Default CSV Data
console.log("Step 9");
const defaultCSVData = `
Category,District,State
House,AK0001,AK
House,AK0002,AK
House,AR0016,AR
House,AR0017,AR
Senate,AKS00A,AK
Senate,AKS00B,AK
Senate,AKS00K,AK
Senate,MDS022,MD
Senate,MDS023,MD`;