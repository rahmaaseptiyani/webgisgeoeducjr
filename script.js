// Data sekolah
const sekolahData = [
    { name: "SMA Negeri 1 Cugenang", lat: -6.843, lon: 107.053, kec: "Cugenang" },
    { name: "SMA Negeri 2 Karangtengah", lat: -6.829, lon: 107.121, kec: "Karangtengah" },
    { name: "SMA Negeri 1 Cianjur", lat: -6.820, lon: 107.142, kec: "Cianjur" },
    { name: "SMA Negeri 3 Cianjur", lat: -6.818, lon: 107.130, kec: "Cianjur" },
    { name: "SMA Negeri 2 Cianjur", lat: -6.824, lon: 107.122, kec: "Cianjur" },
    { name: "SMA Negeri 1 Sukaresmi", lat: -6.720, lon: 107.076, kec: "Sukaresmi" },
    { name: "SMA Negeri 1 Cilaku", lat: -6.848, lon: 107.136, kec: "Cilaku" },
    { name: "SMA Negeri 1 Pacet", lat: -6.701, lon: 107.053, kec: "Pacet" },
    { name: "SMA Negeri 1 Warungkondang", lat: -6.908, lon: 107.087, kec: "Gekbrong" },
    { name: "SMA Negeri 1 Cibeber", lat: -6.917, lon: 107.123, kec: "Cibeber" },
    { name: "SMA Negeri 1 Mande", lat: -6.763, lon: 107.238, kec: "Mande" },
    { name: "SMA Negeri 1 Sukanagara", lat: -7.449, lon: 107.136, kec: "Sukanagara" },
    { name: "SMA Negeri 1 Cibinong Cianjur", lat: -7.320, lon: 107.129, kec: "Cibinong" },
    { name: "MAN 2 Cianjur ", lat: -6.723, lon: 107.035, kec: "Pacet" },
    { name: "SMA PGRI Cianjur", lat: -6.837, lon: 107.127, kec: "Cianjur" },
    { name: "SMA Al Azhar Cianjur", lat: -6.828, lon: 107.125, kec: "Cianjur" },
    { name: "SMK Negeri 1 Pacet", lat: -6.724, lon: 107.065, kec: "Pacet" },
    { name: "SMK Negeri 1 Cilaku", lat: -6.882, lon: 107.125, kec: "Cilaku" },
    { name: "SMA Negeri 2 Cilaku ", lat: -6.839, lon: 107.137, kec: "Cilaku" },
    { name: "SMA Negeri 1 Kadupandak", lat: -7.254, lon: 107.047, kec: "Kadupandak" },
    { name: "SMA Negeri 1 Sindangbarang", lat: -7.452, lon: 107.138, kec: "Sindangbarang" },
    { name: "SMK Negeri 1 Cipanas", lat: -6.722, lon: 107.032, kec: "Cipanas" }
  ];
  
  // Inisialisasi peta
  const map = L.map('map').setView([-6.82, 107.1], 10);
  
  // Tambahkan basemap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  
  // === Tambahkan GeoJSON Batas Administrasi ===
  fetch('../asset/Adm_Cianjur.geojson')
    .then(response => response.json())
    .then(data => {
      const batasLayer = L.geoJSON(data, {
        style: {
          color: '#0088cc',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.1
        },
        onEachFeature: function (feature, layer) {
          const nama = feature.properties.WADMKC || feature.properties.kecamatan || "Wilayah";
          layer.bindPopup(`Kecamatan: ${nama}`);
        }
      }).addTo(map);
  
      // Auto zoom ke seluruh batas
      map.fitBounds(batasLayer.getBounds());
    })
    .catch(error => console.error('Gagal memuat GeoJSON:', error));
  
  // === Fungsi Marker Sekolah ===
  const markers = [];
  
  function renderMarkers(filtered) {
    markers.forEach(m => map.removeLayer(m));
    markers.length = 0;
  
    filtered.forEach(data => {
      const marker = L.marker([data.lat, data.lon])
        .addTo(map)
        .bindPopup(`<strong>${data.name}</strong><br>Kecamatan: ${data.kec}`);
      markers.push(marker);
    });
  }
  
  // Statistik
  function updateStats(filtered) {
    document.getElementById("total").textContent = `${filtered.length} sekolah`;
  
    const counts = {};
    filtered.forEach(s => counts[s.kec] = (counts[s.kec] || 0) + 1);
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById("topDistrict").textContent = top ? `${top[0]} (${top[1]} sekolah)` : "-";
  }
  
  // Event filter dropdown
  document.getElementById("filter").addEventListener("change", function () {
    const value = this.value;
    const filtered = value === "all" ? sekolahData : sekolahData.filter(s => s.kec === value);
    renderMarkers(filtered);
    updateStats(filtered);
  });
  
  // Load awal
  renderMarkers(sekolahData);
  updateStats(sekolahData);
  
  // Observer animasi saat scroll (judul peta)
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target); // animasi hanya sekali
      }
    });
  }, { threshold: 0.6 });
  
  document.querySelectorAll('.animate-fade-in').forEach(el => {
    observer.observe(el);
  });