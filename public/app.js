function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const bib = urlParams.get('id') || urlParams.get('bib');
  const q = urlParams.get('q');
  
  const hash = window.location.hash.replace('#', '').replace('/', '');
  let bibFromHash = null;
  if (typeof participantsData !== 'undefined' && hash && participantsData[hash]) {
    bibFromHash = hash;
  }
  
  let bibFromPath = null;
  const pathParts = window.location.pathname.split('/');
  const lastPart = pathParts.filter(Boolean).pop();
  if (typeof participantsData !== 'undefined' && lastPart && !lastPart.endsWith('.html') && lastPart !== 'app' && participantsData[lastPart]) {
    bibFromPath = lastPart;
  }
  
  return {
    bib: bib || bibFromHash || bibFromPath,
    q: q || (hash && !bibFromHash ? hash : null)
  };
}

function showDetailView(runnerId) {
  if (typeof participantsData === 'undefined') return;
  const runner = participantsData[runnerId];
  if (!runner) {
    showSearchView("", "data tidak ditemukan");
    return;
  }
  
  window.location.hash = `#/${runnerId}`;

  // Populate Runner Info
  document.getElementById("runner-name").textContent = runner.name;
  document.getElementById("runner-bib").textContent = runner.bib;
  document.getElementById("runner-distance").textContent = runner.distance;
  document.getElementById("runner-date").textContent = runner.date;
  document.getElementById("runner-gender").textContent = runner.gender;
  document.getElementById("runner-category").textContent = runner.category;
  document.getElementById("runner-status").textContent = runner.status;

  // Populate Finish Time and Stats
  document.getElementById("stat-overall").textContent = runner.overallRank;
  document.getElementById("stat-category").textContent = runner.categoryRank;
  document.getElementById("stat-gender").textContent = runner.genderRank;
  document.getElementById("runner-finish-time").textContent = runner.finishTime;

  // Populate Print Link
  const printLink = document.getElementById("runner-cert-link");
  if (printLink) {
    printLink.href = runner.certificatePdf || "public/cert/cert.pdf";
  }

  // Populate Splits Table
  const tbody = document.getElementById("splits-tbody");
  if (tbody) {
    tbody.innerHTML = "";
    runner.splits.forEach(split => {
      const tr = document.createElement("tr");
      
      const tdName = document.createElement("td");
      tdName.className = "cp-name";
      tdName.style.paddingLeft = "2.5rem";
      tdName.textContent = split.name;
      
      const tdTime = document.createElement("td");
      tdTime.className = "text-end";
      tdTime.innerHTML = `
        <div class="time-elapsed">${split.time}</div>
        <div class="time-of-day">${split.timeOfDay}</div>
      `;
      
      const tdSplitTime = document.createElement("td");
      tdSplitTime.className = "text-end time-elapsed";
      tdSplitTime.textContent = split.splitTime || "";
      
      tr.appendChild(tdName);
      tr.appendChild(tdTime);
      tr.appendChild(tdSplitTime);
      tbody.appendChild(tr);
    });
  }

  const detailView = document.getElementById("detail-view");
  const searchView = document.getElementById("search-view");
  if (detailView) detailView.style.display = "block";
  if (searchView) searchView.style.display = "none";
}

function showSearchView(queryText = "", forceMessage = null) {
  if (typeof participantsData === 'undefined') return;
  const detailView = document.getElementById("detail-view");
  const searchView = document.getElementById("search-view");
  
  if (detailView) detailView.style.display = "none";
  if (searchView) searchView.style.display = "block";
  
  const mainSearchInput = document.getElementById("main-search-input");
  if (mainSearchInput && queryText) {
    mainSearchInput.value = queryText;
  }
  
  const tbody = document.getElementById("search-results-tbody");
  const statusMsg = document.getElementById("search-status-msg");
  const wrapper = document.getElementById("search-results-wrapper");
  
  if (!queryText && !forceMessage) {
    if (statusMsg) statusMsg.textContent = "Masukkan nomor BIB atau nama untuk mencari peserta";
    if (wrapper) wrapper.style.display = "none";
    return;
  }
  
  const q = queryText.toLowerCase().trim();
  const matches = Object.values(participantsData).filter(p => {
    return p.bib.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
  });
  
  if (forceMessage === "data tidak ditemukan" || matches.length === 0) {
    if (statusMsg) {
      statusMsg.innerHTML = '<span style="color: #ec008c; font-weight: 700; font-size: 1.1rem;">data tidak ditemukan</span>';
    }
    if (wrapper) wrapper.style.display = "none";
    return;
  }
  
  if (statusMsg) {
    statusMsg.textContent = "Your search results are shown below. Click a competitor name to view their results in more detail";
  }
  if (wrapper) wrapper.style.display = "block";
  
  if (tbody) {
    tbody.innerHTML = "";
    matches.forEach(runner => {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid #eee";
      
      const tdEvent = document.createElement("td");
      tdEvent.style.padding = "12px 15px";
      tdEvent.textContent = runner.distance;
      
      const tdNo = document.createElement("td");
      tdNo.style.padding = "12px 15px";
      tdNo.textContent = runner.bib;
      
      const tdName = document.createElement("td");
      tdName.style.padding = "12px 15px";
      const a = document.createElement("a");
      a.href = `#/${runner.bib}`;
      a.style.color = "#0d6efd";
      a.style.textDecoration = "none";
      a.style.fontWeight = "600";
      a.textContent = runner.name;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        showDetailView(runner.bib);
      });
      tdName.appendChild(a);
      
      const tdGender = document.createElement("td");
      tdGender.style.padding = "12px 15px";
      tdGender.textContent = runner.gender;
      
      const tdCategory = document.createElement("td");
      tdCategory.style.padding = "12px 15px";
      tdCategory.textContent = runner.category;
      
      const tdStatus = document.createElement("td");
      tdStatus.style.padding = "12px 15px";
      tdStatus.textContent = runner.status;
      
      const tdTime = document.createElement("td");
      tdTime.style.padding = "12px 15px";
      tdTime.textContent = runner.status === "Finished" ? runner.finishTime : "00:00:00";
      
      const tdNetTime = document.createElement("td");
      tdNetTime.style.padding = "12px 15px";
      tdNetTime.textContent = runner.status === "Finished" ? runner.finishTime : "00:00:00";
      
      tr.appendChild(tdEvent);
      tr.appendChild(tdNo);
      tr.appendChild(tdName);
      tr.appendChild(tdGender);
      tr.appendChild(tdCategory);
      tr.appendChild(tdStatus);
      tr.appendChild(tdTime);
      tr.appendChild(tdNetTime);
      tbody.appendChild(tr);
    });
  }
}

function initApp() {
  // Logic for the Results page
  if (typeof participantsData !== 'undefined') {
    const params = getUrlParams();
    
    if (params.bib && participantsData[params.bib]) {
      showDetailView(params.bib);
    } else if (params.q) {
      showSearchView(params.q);
    } else {
      showSearchView("");
    }

    // Hash change event
    window.addEventListener("hashchange", () => {
      const hashParams = getUrlParams();
      if (hashParams.bib && participantsData[hashParams.bib]) {
        showDetailView(hashParams.bib);
      } else if (hashParams.q) {
        showSearchView(hashParams.q);
      } else {
        showSearchView("");
      }
    });
  }

  // Bind Top Search input
  const topSearchInput = document.getElementById("top-search-input");
  if (topSearchInput) {
    topSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const val = topSearchInput.value.trim();
        if (val) {
          if (window.location.pathname.includes('details')) {
            window.location.href = `index.html?q=${encodeURIComponent(val)}`;
          } else {
            window.location.hash = "";
            showSearchView(val);
          }
        }
      }
    });
  }
  
  // Bind Main Search input and button
  const mainSearchInput = document.getElementById("main-search-input");
  const mainSearchBtn = document.getElementById("main-search-btn");
  
  const triggerMainSearch = () => {
    if (!mainSearchInput) return;
    const val = mainSearchInput.value.trim();
    showSearchView(val);
  };
  
  if (mainSearchBtn) {
    mainSearchBtn.addEventListener("click", triggerMainSearch);
  }
  if (mainSearchInput) {
    mainSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        triggerMainSearch();
      }
    });
  }

  // Event tab switching logic (details page)
  const tabs = document.querySelectorAll('.event-tab');
  const panels = document.querySelectorAll('.event-panel');
  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.event;
        panels.forEach(panel => {
          panel.style.display = panel.id === `event-${target}` ? 'block' : 'none';
        });
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", initApp);
