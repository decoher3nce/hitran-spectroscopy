// HITRAN Spectral Explorer
// Sample line data: [nu (cm-1), S (cm/molecule) at 296K, gamma_air (cm-1/atm), E_lower (cm-1), n_air, delta_air]

const HITRAN_DATA = {
    CO2: {
        name: 'CO₂',
        molec_id: 2,
        default_range: [2300, 2400],
        lines: [
            [2302.963, 2.01e-23, 0.0685, 396.0, 0.72, -0.0020],
            [2305.256, 3.45e-23, 0.0710, 346.4, 0.73, -0.0018],
            [2307.412, 5.12e-23, 0.0720, 300.1, 0.72, -0.0019],
            [2309.432, 7.88e-23, 0.0715, 257.0, 0.71, -0.0021],
            [2311.105, 1.15e-22, 0.0730, 217.1, 0.73, -0.0017],
            [2313.773, 1.62e-22, 0.0725, 180.4, 0.72, -0.0019],
            [2315.981, 2.10e-22, 0.0718, 146.8, 0.71, -0.0020],
            [2317.555, 2.87e-22, 0.0735, 116.4, 0.74, -0.0016],
            [2319.234, 3.55e-22, 0.0728, 89.2, 0.72, -0.0018],
            [2321.662, 4.21e-22, 0.0740, 65.1, 0.73, -0.0015],
            [2323.889, 4.98e-22, 0.0732, 44.2, 0.71, -0.0019],
            [2326.102, 5.44e-22, 0.0745, 26.4, 0.74, -0.0014],
            [2328.311, 5.88e-22, 0.0738, 11.8, 0.72, -0.0017],
            [2330.515, 6.01e-22, 0.0742, 0.3, 0.73, -0.0016],
            [2332.204, 5.79e-22, 0.0748, 3.5, 0.74, -0.0013],
            [2334.412, 5.55e-22, 0.0735, 10.1, 0.72, -0.0018],
            [2336.631, 5.12e-22, 0.0741, 19.9, 0.73, -0.0015],
            [2338.845, 4.65e-22, 0.0729, 32.8, 0.71, -0.0019],
            [2341.062, 4.01e-22, 0.0738, 48.9, 0.72, -0.0017],
            [2343.283, 3.44e-22, 0.0745, 68.1, 0.74, -0.0014],
            [2345.500, 2.85e-22, 0.0731, 90.5, 0.72, -0.0018],
            [2347.720, 2.22e-22, 0.0742, 116.0, 0.73, -0.0016],
            [2349.143, 1.92e-22, 0.0726, 137.0, 0.71, -0.0020],
            [2349.916, 1.75e-22, 0.0738, 144.5, 0.73, -0.0015],
            [2351.612, 1.82e-22, 0.0745, 137.0, 0.74, -0.0014],
            [2353.524, 2.15e-22, 0.0731, 116.0, 0.72, -0.0018],
            [2355.450, 2.68e-22, 0.0742, 90.5, 0.73, -0.0016],
            [2357.380, 3.30e-22, 0.0728, 68.1, 0.71, -0.0019],
            [2359.315, 3.95e-22, 0.0740, 48.9, 0.72, -0.0017],
            [2361.250, 4.52e-22, 0.0735, 32.8, 0.73, -0.0015],
            [2363.190, 5.01e-22, 0.0748, 19.9, 0.74, -0.0013],
            [2365.132, 5.38e-22, 0.0731, 10.1, 0.72, -0.0018],
            [2367.078, 5.61e-22, 0.0742, 3.5, 0.73, -0.0015],
            [2369.025, 5.92e-22, 0.0736, 0.3, 0.71, -0.0019],
            [2370.975, 5.75e-22, 0.0745, 11.8, 0.74, -0.0014],
            [2372.928, 5.33e-22, 0.0728, 26.4, 0.72, -0.0017],
            [2374.882, 4.85e-22, 0.0740, 44.2, 0.73, -0.0016],
            [2376.840, 4.15e-22, 0.0733, 65.1, 0.71, -0.0019],
            [2378.800, 3.42e-22, 0.0745, 89.2, 0.74, -0.0014],
            [2380.762, 2.75e-22, 0.0729, 116.4, 0.72, -0.0018],
            [2382.728, 2.01e-22, 0.0741, 146.8, 0.73, -0.0015],
            [2384.695, 1.55e-22, 0.0736, 180.4, 0.71, -0.0019],
            [2386.666, 1.08e-22, 0.0748, 217.1, 0.74, -0.0013],
            [2388.639, 7.22e-23, 0.0730, 257.0, 0.72, -0.0018],
            [2390.614, 4.85e-23, 0.0742, 300.1, 0.73, -0.0016],
            [2392.592, 3.12e-23, 0.0727, 346.4, 0.71, -0.0020],
            [2394.572, 1.88e-23, 0.0739, 396.0, 0.72, -0.0017],
            [2396.555, 1.05e-23, 0.0745, 448.8, 0.74, -0.0014],
        ]
    },
    H2O: {
        name: 'H₂O',
        molec_id: 1,
        default_range: [1500, 1700],
        lines: [
            [1504.72, 5.21e-24, 0.0980, 744.1, 0.59, -0.0030],
            [1509.45, 8.44e-24, 0.0940, 610.3, 0.62, -0.0025],
            [1514.33, 1.35e-23, 0.0965, 503.8, 0.60, -0.0028],
            [1519.88, 2.11e-23, 0.0930, 416.2, 0.63, -0.0022],
            [1524.12, 3.67e-23, 0.0955, 340.5, 0.61, -0.0027],
            [1530.55, 5.82e-23, 0.0975, 275.3, 0.58, -0.0031],
            [1535.23, 8.15e-23, 0.0942, 222.1, 0.64, -0.0024],
            [1540.87, 1.12e-22, 0.0968, 176.5, 0.60, -0.0028],
            [1545.44, 1.55e-22, 0.0935, 138.4, 0.62, -0.0026],
            [1550.92, 2.08e-22, 0.0988, 106.8, 0.57, -0.0033],
            [1556.61, 2.65e-22, 0.0952, 81.4, 0.63, -0.0023],
            [1561.38, 3.21e-22, 0.0972, 61.2, 0.59, -0.0029],
            [1567.14, 3.88e-22, 0.0945, 45.3, 0.64, -0.0021],
            [1572.95, 4.42e-22, 0.0985, 33.5, 0.58, -0.0032],
            [1578.80, 4.91e-22, 0.0958, 25.1, 0.62, -0.0025],
            [1584.70, 5.22e-22, 0.0976, 19.8, 0.60, -0.0028],
            [1590.12, 5.48e-22, 0.0940, 16.5, 0.63, -0.0024],
            [1594.88, 5.55e-22, 0.0992, 14.9, 0.57, -0.0034],
            [1600.75, 5.61e-22, 0.0950, 14.2, 0.61, -0.0027],
            [1606.23, 5.58e-22, 0.0978, 15.0, 0.59, -0.0030],
            [1611.85, 5.42e-22, 0.0943, 17.1, 0.64, -0.0022],
            [1617.50, 5.18e-22, 0.0986, 20.8, 0.58, -0.0031],
            [1623.22, 4.82e-22, 0.0955, 26.3, 0.62, -0.0026],
            [1629.00, 4.35e-22, 0.0971, 34.1, 0.60, -0.0028],
            [1634.82, 3.78e-22, 0.0938, 44.5, 0.63, -0.0023],
            [1640.68, 3.15e-22, 0.0988, 57.8, 0.57, -0.0033],
            [1646.58, 2.52e-22, 0.0960, 74.2, 0.61, -0.0027],
            [1652.51, 1.95e-22, 0.0945, 94.0, 0.64, -0.0021],
            [1658.48, 1.42e-22, 0.0982, 117.5, 0.59, -0.0029],
            [1664.50, 9.55e-23, 0.0952, 145.1, 0.62, -0.0025],
            [1670.55, 6.12e-23, 0.0975, 177.0, 0.60, -0.0028],
            [1676.63, 3.78e-23, 0.0940, 213.4, 0.63, -0.0024],
            [1682.75, 2.15e-23, 0.0990, 254.8, 0.58, -0.0032],
            [1688.90, 1.12e-23, 0.0958, 301.2, 0.61, -0.0027],
            [1695.08, 5.55e-24, 0.0972, 352.8, 0.59, -0.0030],
        ]
    },
    CH4: {
        name: 'CH₄',
        molec_id: 6,
        default_range: [2900, 3100],
        lines: [
            [2903.12, 1.15e-23, 0.0580, 419.2, 0.75, -0.0085],
            [2909.55, 2.34e-23, 0.0562, 355.8, 0.76, -0.0078],
            [2915.78, 4.11e-23, 0.0575, 298.1, 0.74, -0.0082],
            [2921.33, 6.85e-23, 0.0568, 245.5, 0.77, -0.0075],
            [2927.90, 1.02e-22, 0.0582, 198.3, 0.75, -0.0080],
            [2933.44, 1.55e-22, 0.0570, 156.4, 0.76, -0.0077],
            [2939.12, 2.18e-22, 0.0585, 119.8, 0.74, -0.0083],
            [2944.88, 2.92e-22, 0.0565, 88.2, 0.77, -0.0074],
            [2950.65, 3.75e-22, 0.0578, 61.5, 0.75, -0.0081],
            [2956.44, 4.48e-22, 0.0572, 39.6, 0.76, -0.0076],
            [2962.25, 5.15e-22, 0.0588, 22.3, 0.74, -0.0084],
            [2968.08, 5.62e-22, 0.0564, 10.5, 0.77, -0.0073],
            [2973.92, 5.88e-22, 0.0580, 3.2, 0.75, -0.0080],
            [2979.80, 5.75e-22, 0.0573, 0.8, 0.76, -0.0077],
            [2985.70, 5.91e-22, 0.0586, 0.0, 0.74, -0.0082],
            [2991.62, 5.68e-22, 0.0566, 3.8, 0.77, -0.0074],
            [2997.55, 5.22e-22, 0.0579, 11.2, 0.75, -0.0081],
            [3003.52, 4.65e-22, 0.0571, 23.5, 0.76, -0.0076],
            [3009.50, 3.95e-22, 0.0585, 40.1, 0.74, -0.0083],
            [3015.50, 3.18e-22, 0.0567, 61.8, 0.77, -0.0075],
            [3021.52, 2.45e-22, 0.0581, 88.5, 0.75, -0.0080],
            [3027.58, 1.78e-22, 0.0574, 120.4, 0.76, -0.0077],
            [3033.65, 1.22e-22, 0.0587, 157.2, 0.74, -0.0084],
            [3039.75, 7.85e-23, 0.0563, 199.1, 0.77, -0.0073],
            [3045.88, 4.62e-23, 0.0577, 246.5, 0.75, -0.0080],
            [3052.02, 2.55e-23, 0.0570, 299.2, 0.76, -0.0076],
            [3058.20, 1.28e-23, 0.0583, 357.1, 0.74, -0.0082],
            [3064.40, 5.85e-24, 0.0568, 420.5, 0.77, -0.0075],
        ]
    },
    O3: {
        name: 'O₃',
        molec_id: 3,
        default_range: [1000, 1070],
        lines: [
            [1000.82, 3.55e-23, 0.0665, 488.2, 0.76, -0.0012],
            [1004.15, 5.88e-23, 0.0672, 412.5, 0.75, -0.0010],
            [1007.50, 9.12e-23, 0.0658, 342.1, 0.77, -0.0014],
            [1010.88, 1.35e-22, 0.0680, 278.4, 0.74, -0.0009],
            [1014.28, 1.92e-22, 0.0668, 221.0, 0.76, -0.0013],
            [1017.70, 2.65e-22, 0.0675, 170.2, 0.75, -0.0011],
            [1021.15, 3.48e-22, 0.0660, 125.8, 0.77, -0.0015],
            [1024.62, 4.32e-22, 0.0682, 87.5, 0.74, -0.0008],
            [1028.11, 5.15e-22, 0.0670, 55.1, 0.76, -0.0012],
            [1031.62, 5.88e-22, 0.0678, 28.8, 0.75, -0.0010],
            [1035.15, 6.42e-22, 0.0662, 8.4, 0.77, -0.0014],
            [1038.70, 6.78e-22, 0.0684, 0.0, 0.74, -0.0009],
            [1042.28, 6.55e-22, 0.0672, 5.2, 0.76, -0.0013],
            [1045.88, 6.12e-22, 0.0668, 22.5, 0.75, -0.0011],
            [1049.50, 5.55e-22, 0.0676, 48.3, 0.77, -0.0015],
            [1053.14, 4.82e-22, 0.0664, 82.0, 0.74, -0.0008],
            [1056.80, 3.98e-22, 0.0680, 122.5, 0.76, -0.0012],
            [1060.48, 3.05e-22, 0.0670, 169.8, 0.75, -0.0010],
            [1064.18, 2.15e-22, 0.0678, 224.0, 0.77, -0.0014],
        ]
    }
};

class HitranExplorer {
    constructor() {
        this.canvas = document.getElementById('spectrum-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.tooltip = document.getElementById('tooltip');
        this.currentLines = [];
        this.plotState = null;

        this.moleculeSelect = document.getElementById('molecule-select');
        this.numinInput = document.getElementById('numin');
        this.numaxInput = document.getElementById('numax');
        this.plotTypeSelect = document.getElementById('plot-type');
        this.tempInput = document.getElementById('temperature');
        this.pressInput = document.getElementById('pressure');

        this.setupEvents();
        this.resizeCanvas();
        this.plot();
    }

    setupEvents() {
        document.getElementById('plot-btn').addEventListener('click', () => this.plot());

        this.moleculeSelect.addEventListener('change', () => {
            const mol = HITRAN_DATA[this.moleculeSelect.value];
            this.numinInput.value = mol.default_range[0];
            this.numaxInput.value = mol.default_range[1];
            this.plot();
        });

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            if (this.plotState) this.draw();
        });

        this.canvas.addEventListener('mousemove', (e) => this.handleHover(e));
        this.canvas.addEventListener('mouseleave', () => {
            this.tooltip.style.display = 'none';
        });
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.displayWidth = rect.width;
        this.displayHeight = rect.height;
    }

    plot() {
        const molKey = this.moleculeSelect.value;
        const mol = HITRAN_DATA[molKey];
        const numin = parseFloat(this.numinInput.value);
        const numax = parseFloat(this.numaxInput.value);
        const T = parseFloat(this.tempInput.value);
        const P = parseFloat(this.pressInput.value);
        const plotType = this.plotTypeSelect.value;

        // Filter lines in range
        this.currentLines = mol.lines
            .filter(l => l[0] >= numin && l[0] <= numax)
            .map(l => ({
                nu: l[0],
                S: l[1],
                gamma_air: l[2],
                E_lower: l[3],
                n_air: l[4],
                delta_air: l[5]
            }));

        // Adjust intensity for temperature
        const T_ref = 296.0;
        const c2 = 1.4387769; // second radiation constant (cm·K)
        for (const line of this.currentLines) {
            const ratio = T_ref / T;
            const boltzmann = Math.exp(-c2 * line.E_lower / T) / Math.exp(-c2 * line.E_lower / T_ref);
            const stimulated = (1 - Math.exp(-c2 * line.nu / T)) / (1 - Math.exp(-c2 * line.nu / T_ref));
            line.S_T = line.S * boltzmann * stimulated * ratio;
        }

        this.plotState = { mol, numin, numax, T, P, plotType };
        this.draw();
        this.updateStats(mol);
        this.updateTable();
    }

    draw() {
        const { numin, numax, plotType, P } = this.plotState;
        const ctx = this.ctx;
        const w = this.displayWidth;
        const h = this.displayHeight;

        // Margins
        const m = { top: 20, right: 30, bottom: 50, left: 70 };
        const pw = w - m.left - m.right;
        const ph = h - m.top - m.bottom;

        // Clear
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, w, h);

        if (this.currentLines.length === 0) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No lines in this range', w / 2, h / 2);
            return;
        }

        const intensities = this.currentLines.map(l => l.S_T);

        if (plotType === 'stick') {
            this.drawStick(ctx, m, pw, ph, numin, numax, intensities);
        } else {
            this.drawCrossSection(ctx, m, pw, ph, numin, numax, P);
        }

        this.drawAxes(ctx, m, pw, ph, numin, numax, plotType);
    }

    drawStick(ctx, m, pw, ph, numin, numax, intensities) {
        const maxS = Math.max(...intensities);
        const minS = Math.min(...intensities.filter(s => s > 0));
        const logMax = Math.log10(maxS);
        const logMin = Math.log10(minS) - 0.5;

        for (const line of this.currentLines) {
            const x = m.left + ((line.nu - numin) / (numax - numin)) * pw;
            const logS = Math.log10(line.S_T);
            const yFrac = (logS - logMin) / (logMax - logMin);
            const y = m.top + ph - yFrac * ph;

            const hue = 200 + (1 - yFrac) * 40;
            ctx.strokeStyle = `hsl(${hue}, 85%, ${55 + yFrac * 20}%)`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x, m.top + ph);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Small dot at top
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawCrossSection(ctx, m, pw, ph, numin, numax, P) {
        // Compute Lorentzian cross section on a grid
        const nPoints = Math.min(pw * 2, 2000);
        const dnu = (numax - numin) / nPoints;
        const sigma = new Float64Array(nPoints);

        for (const line of this.currentLines) {
            const gamma = line.gamma_air * P;
            for (let i = 0; i < nPoints; i++) {
                const nu = numin + i * dnu;
                const diff = nu - line.nu;
                sigma[i] += (line.S_T / Math.PI) * (gamma / (diff * diff + gamma * gamma));
            }
        }

        // Find max for scaling
        let maxSigma = 0;
        for (let i = 0; i < nPoints; i++) {
            if (sigma[i] > maxSigma) maxSigma = sigma[i];
        }

        if (maxSigma === 0) return;

        // Draw filled area
        const gradient = ctx.createLinearGradient(0, m.top, 0, m.top + ph);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.02)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(m.left, m.top + ph);

        for (let i = 0; i < nPoints; i++) {
            const x = m.left + (i / nPoints) * pw;
            const yFrac = sigma[i] / maxSigma;
            const y = m.top + ph - yFrac * ph;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(m.left + pw, m.top + ph);
        ctx.closePath();
        ctx.fill();

        // Draw line on top
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < nPoints; i++) {
            const x = m.left + (i / nPoints) * pw;
            const yFrac = sigma[i] / maxSigma;
            const y = m.top + ph - yFrac * ph;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    drawAxes(ctx, m, pw, ph, numin, numax, plotType) {
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;

        // X axis
        ctx.beginPath();
        ctx.moveTo(m.left, m.top + ph);
        ctx.lineTo(m.left + pw, m.top + ph);
        ctx.stroke();

        // Y axis
        ctx.beginPath();
        ctx.moveTo(m.left, m.top);
        ctx.lineTo(m.left, m.top + ph);
        ctx.stroke();

        // X ticks
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        const nTicks = 8;
        for (let i = 0; i <= nTicks; i++) {
            const nu = numin + (i / nTicks) * (numax - numin);
            const x = m.left + (i / nTicks) * pw;
            ctx.beginPath();
            ctx.moveTo(x, m.top + ph);
            ctx.lineTo(x, m.top + ph + 5);
            ctx.stroke();
            ctx.fillText(nu.toFixed(1), x, m.top + ph + 18);

            // Grid
            if (i > 0 && i < nTicks) {
                ctx.strokeStyle = '#1e293b';
                ctx.beginPath();
                ctx.moveTo(x, m.top);
                ctx.lineTo(x, m.top + ph);
                ctx.stroke();
                ctx.strokeStyle = '#334155';
            }
        }

        // X label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('Wavenumber (cm⁻¹)', m.left + pw / 2, m.top + ph + 40);

        // Y label
        ctx.save();
        ctx.translate(15, m.top + ph / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText(plotType === 'stick' ? 'log₁₀ Intensity' : 'Cross Section (arb.)', 0, 0);
        ctx.restore();
    }

    handleHover(e) {
        if (!this.plotState || this.currentLines.length === 0) return;

        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const m = { top: 20, right: 30, bottom: 50, left: 70 };
        const pw = this.displayWidth - m.left - m.right;
        const { numin, numax } = this.plotState;

        const nuHover = numin + ((mx - m.left) / pw) * (numax - numin);

        // Find closest line
        let closest = null;
        let minDist = Infinity;
        for (const line of this.currentLines) {
            const dist = Math.abs(line.nu - nuHover);
            if (dist < minDist) {
                minDist = dist;
                closest = line;
            }
        }

        const pixelDist = (minDist / (numax - numin)) * pw;
        if (closest && pixelDist < 20) {
            this.tooltip.innerHTML =
                `<strong>ν</strong> = ${closest.nu.toFixed(3)} cm⁻¹<br>` +
                `<strong>S</strong> = ${closest.S_T.toExponential(3)} cm/mol<br>` +
                `<strong>γ<sub>air</sub></strong> = ${closest.gamma_air.toFixed(4)} cm⁻¹/atm<br>` +
                `<strong>E″</strong> = ${closest.E_lower.toFixed(1)} cm⁻¹`;

            let tx = e.clientX - rect.left + 12;
            let ty = e.clientY - rect.top - 10;
            if (tx + 180 > this.displayWidth) tx = tx - 200;
            this.tooltip.style.left = tx + 'px';
            this.tooltip.style.top = ty + 'px';
            this.tooltip.style.display = 'block';
        } else {
            this.tooltip.style.display = 'none';
        }
    }

    updateStats(mol) {
        const count = this.currentLines.length;
        document.querySelector('#stat-lines .stat-value').textContent = count;

        if (count > 0) {
            const strongest = this.currentLines.reduce((a, b) => a.S_T > b.S_T ? a : b);
            document.querySelector('#stat-strongest .stat-value').textContent =
                `${strongest.nu.toFixed(2)} cm⁻¹ (${strongest.S_T.toExponential(2)})`;
        } else {
            document.querySelector('#stat-strongest .stat-value').textContent = '—';
        }

        document.querySelector('#stat-range .stat-value').textContent =
            `${this.plotState.numin}–${this.plotState.numax} cm⁻¹`;
    }

    updateTable() {
        const tbody = document.querySelector('#line-table tbody');
        tbody.innerHTML = '';

        const sorted = [...this.currentLines].sort((a, b) => b.S_T - a.S_T);
        for (const line of sorted) {
            const tr = document.createElement('tr');
            tr.innerHTML =
                `<td>${line.nu.toFixed(3)}</td>` +
                `<td>${line.S_T.toExponential(3)}</td>` +
                `<td>${line.gamma_air.toFixed(4)}</td>` +
                `<td>${line.E_lower.toFixed(1)}</td>`;
            tbody.appendChild(tr);
        }
    }
}

new HitranExplorer();
