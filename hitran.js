// HITRAN Spectral Explorer — Multi-layer engine

class HitranExplorer {
    constructor() {
        this.canvas = document.getElementById('spectrum-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.tooltip = document.getElementById('tooltip');
        this.layers = [];
        this.layerIdCounter = 0;
        this.plotState = null;

        this.numinInput = document.getElementById('numin');
        this.numaxInput = document.getElementById('numax');
        this.plotTypeSelect = document.getElementById('plot-type');
        this.unitSelect = document.getElementById('spectral-unit');
        this.yScaleSelect = document.getElementById('y-scale');
        this.lockYScale = document.getElementById('lock-y-scale');
        this.yMinInput = document.getElementById('y-min');
        this.yMaxInput = document.getElementById('y-max');
        this.activePresets = new Set();

        this.setupEvents();
        this.resizeCanvas();
        this.updateLabels();
        this.addLayer({ molecule: 'CO2', T: 296, P: 1.0 });
        this.plot();
    }

    // --- Spectral unit helpers ---

    isWavelength() {
        return this.unitSelect.value === 'wavelength';
    }

    updateLabels() {
        const wl = this.isWavelength();
        document.getElementById('numin-label').textContent = wl ? 'Min Wavelength (μm)' : 'Min Wavenumber (cm⁻¹)';
        document.getElementById('numax-label').textContent = wl ? 'Max Wavelength (μm)' : 'Max Wavenumber (cm⁻¹)';
        document.getElementById('th-spectral').textContent = wl ? 'λ (μm)' : 'ν (cm⁻¹)';
        this.numinInput.step = wl ? 0.1 : 10;
        this.numaxInput.step = wl ? 0.1 : 10;
    }

    getNuRange() {
        const inputMin = parseFloat(this.numinInput.value);
        const inputMax = parseFloat(this.numaxInput.value);
        if (this.isWavelength()) {
            return [10000 / inputMax, 10000 / inputMin];
        }
        return [inputMin, inputMax];
    }

    nuToX(nu, m, pw, numin, numax) {
        const frac = (nu - numin) / (numax - numin);
        return this.isWavelength() ? m.left + (1 - frac) * pw : m.left + frac * pw;
    }

    formatSpectral(nu) {
        return this.isWavelength() ? (10000 / nu).toFixed(4) : nu.toFixed(3);
    }

    formatSpectralShort(nu) {
        return this.isWavelength() ? (10000 / nu).toFixed(2) : nu.toFixed(1);
    }

    spectralUnit() {
        return this.isWavelength() ? 'μm' : 'cm⁻¹';
    }

    getYRange(autoMin, autoMax) {
        if (this.lockYScale.checked) {
            const userMin = this.yMinInput.value !== '' ? parseFloat(this.yMinInput.value) : autoMin;
            const userMax = this.yMaxInput.value !== '' ? parseFloat(this.yMaxInput.value) : autoMax;
            return [userMin, userMax];
        }
        return [autoMin, autoMax];
    }

    // --- Layer management ---

    addLayer(opts = {}) {
        const id = this.layerIdCounter++;
        const colorIdx = this.layers.length % LAYER_COLORS.length;
        const layer = {
            id,
            molecule: opts.molecule || 'CO2',
            T: opts.T || 296,
            P: opts.P || 1.0,
            enabled: true,
            colorIdx,
            db: opts.db || 'hitran',
            lines: [],
        };
        this.layers.push(layer);
        this.renderLayers();
        return layer;
    }

    removeLayer(id) {
        const removed = this.layers.find(l => l.id === id);
        this.layers = this.layers.filter(l => l.id !== id);
        // If a preset's layers are all gone, deactivate it
        if (removed && removed.presetTag) {
            const tag = removed.presetTag;
            if (!this.layers.some(l => l.presetTag === tag)) {
                this.activePresets.delete(tag);
                this.updatePresetButtons();
            }
        }
        this.renderLayers();
        this.plot();
    }

    renderLayers() {
        const container = document.getElementById('layers-container');
        container.innerHTML = '';

        for (const layer of this.layers) {
            const color = LAYER_COLORS[layer.colorIdx];
            const molecules = Object.keys(HITRAN_DATA);
            const div = document.createElement('div');
            div.className = 'layer-row';
            div.style.borderLeftColor = color.line;
            div.innerHTML = `
                <label class="layer-toggle">
                    <input type="checkbox" ${layer.enabled ? 'checked' : ''} data-layer-id="${layer.id}" data-field="enabled">
                </label>
                <select data-layer-id="${layer.id}" data-field="molecule">
                    ${molecules.map(m => `<option value="${m}" ${layer.molecule === m ? 'selected' : ''}>${HITRAN_DATA[m].name}</option>`).join('')}
                </select>
                <select data-layer-id="${layer.id}" data-field="db" class="db-select">
                    <option value="hitran" ${layer.db === 'hitran' ? 'selected' : ''}>HITRAN</option>
                    <option value="hitemp" ${layer.db === 'hitemp' ? 'selected' : ''}>HITEMP</option>
                </select>
                <label class="layer-param">T<input type="number" value="${layer.T}" min="150" max="5000" step="50" data-layer-id="${layer.id}" data-field="T">K</label>
                <label class="layer-param">P<input type="number" value="${layer.P}" min="0.001" max="100" step="0.1" data-layer-id="${layer.id}" data-field="P">atm</label>
                <input type="color" class="layer-color-picker" value="${color.line}" data-layer-id="${layer.id}" title="Change color">
                <button class="layer-remove" data-layer-id="${layer.id}">&times;</button>
            `;
            container.appendChild(div);
        }

        // Wire events
        container.querySelectorAll('[data-field]').forEach(el => {
            el.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.layerId);
                const field = e.target.dataset.field;
                const layer = this.layers.find(l => l.id === id);
                if (!layer) return;
                if (field === 'enabled') {
                    layer.enabled = e.target.checked;
                } else if (field === 'T' || field === 'P') {
                    layer[field] = parseFloat(e.target.value);
                } else {
                    layer[field] = e.target.value;
                }
                this.plot();
            });
        });

        container.querySelectorAll('.layer-color-picker').forEach(el => {
            el.addEventListener('input', (e) => {
                const id = parseInt(e.target.dataset.layerId);
                const layer = this.layers.find(l => l.id === id);
                if (!layer) return;
                const hex = e.target.value;
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                // Store custom color
                layer.customColor = {
                    line: hex,
                    fill: `rgba(${r}, ${g}, ${b}, 0.25)`,
                };
                // Update border
                e.target.closest('.layer-row').style.borderLeftColor = hex;
                this.plot();
            });
        });

        container.querySelectorAll('.layer-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.removeLayer(parseInt(e.target.dataset.layerId));
            });
        });
    }

    getLayerColor(layer) {
        if (layer.customColor) return layer.customColor;
        return LAYER_COLORS[layer.colorIdx];
    }

    // --- Presets (additive toggle) ---

    getPresetDef(name) {
        const presets = {
            combustion: {
                layers: [
                    { molecule: 'NO', T: 1500, P: 1.0, db: 'hitemp' },
                    { molecule: 'CO2', T: 1500, P: 1.0, db: 'hitemp' },
                    { molecule: 'H2O', T: 1500, P: 1.0, db: 'hitemp' },
                ],
                range: [1800, 2400],
            },
            ambient: {
                layers: [
                    { molecule: 'CO2', T: 296, P: 1.0 },
                    { molecule: 'H2O', T: 296, P: 1.0 },
                ],
                range: [1500, 2400],
            },
            'no-comparison': {
                layers: [
                    { molecule: 'NO', T: 296, P: 1.0 },
                    { molecule: 'NO', T: 1500, P: 1.0, db: 'hitemp' },
                ],
                range: [1750, 1960],
            },
            greenhouse: {
                layers: [
                    { molecule: 'CO2', T: 296, P: 1.0 },
                    { molecule: 'CH4', T: 296, P: 1.0 },
                    { molecule: 'H2O', T: 296, P: 1.0 },
                ],
                range: [1300, 3200],
            },
            'ozone-window': {
                layers: [
                    { molecule: 'O3', T: 220, P: 0.01 },
                    { molecule: 'CO2', T: 296, P: 1.0 },
                ],
                range: [950, 1100],
            },
            'methane-leak': {
                layers: [
                    { molecule: 'CH4', T: 296, P: 1.0 },
                    { molecule: 'H2O', T: 296, P: 1.0 },
                ],
                range: [2900, 3100],
            },
        };
        return presets[name];
    }

    togglePreset(name) {
        if (name === 'clear') {
            this.layers = [];
            this.layerIdCounter = 0;
            this.activePresets.clear();
            this.updatePresetButtons();
            this.renderLayers();
            this.plot();
            return;
        }

        const def = this.getPresetDef(name);
        if (!def) return;

        if (this.activePresets.has(name)) {
            // Remove layers that belong to this preset
            this.layers = this.layers.filter(l => l.presetTag !== name);
            this.activePresets.delete(name);
        } else {
            // Add layers
            for (const opts of def.layers) {
                const layer = this.addLayer(opts);
                layer.presetTag = name;
            }
            this.activePresets.add(name);
            this.expandRange(def.range[0], def.range[1]);
        }

        this.updatePresetButtons();
        this.renderLayers();
        this.plot();
    }

    expandRange(numin, numax) {
        // Expand current range to include the preset's range
        const [curMin, curMax] = this.getNuRange();
        const newMin = Math.min(curMin, numin);
        const newMax = Math.max(curMax, numax);
        this.setRange(newMin, newMax);
    }

    updatePresetButtons() {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            const preset = btn.dataset.preset;
            if (preset === 'clear') return;
            btn.classList.toggle('preset-active', this.activePresets.has(preset));
        });
    }

    setRange(numin, numax) {
        if (this.isWavelength()) {
            this.numinInput.value = (10000 / numax).toFixed(2);
            this.numaxInput.value = (10000 / numin).toFixed(2);
        } else {
            this.numinInput.value = numin;
            this.numaxInput.value = numax;
        }
    }

    // --- Events ---

    setupEvents() {
        document.getElementById('plot-btn').addEventListener('click', () => this.plot());
        document.getElementById('add-layer-btn').addEventListener('click', () => {
            this.addLayer();
            this.plot();
        });

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.togglePreset(btn.dataset.preset);
            });
        });

        this.plotTypeSelect.addEventListener('change', () => this.plot());
        this.yScaleSelect.addEventListener('change', () => this.plot());

        // Scale lock
        document.getElementById('reset-scale-btn').addEventListener('click', () => {
            this.lockYScale.checked = false;
            this.yMinInput.value = '';
            this.yMaxInput.value = '';
            this.plot();
        });

        this.unitSelect.addEventListener('change', () => {
            const minVal = parseFloat(this.numinInput.value);
            const maxVal = parseFloat(this.numaxInput.value);
            if (this.isWavelength()) {
                this.numinInput.value = (10000 / maxVal).toFixed(2);
                this.numaxInput.value = (10000 / minVal).toFixed(2);
            } else {
                this.numinInput.value = Math.round(10000 / maxVal);
                this.numaxInput.value = Math.round(10000 / minVal);
            }
            this.updateLabels();
            this.plot();
        });

        // Export
        document.getElementById('save-png-btn').addEventListener('click', () => this.savePNG());
        document.getElementById('save-xlsx-btn').addEventListener('click', () => this.saveXLSX());

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

    // --- Compute ---

    computeLayerLines(layer, numin, numax) {
        const db = layer.db === 'hitemp' && HITEMP_DATA[layer.molecule]
            ? HITEMP_DATA
            : HITRAN_DATA;
        const mol = db[layer.molecule];
        if (!mol) return [];

        const filtered = mol.lines
            .filter(l => l[0] >= numin && l[0] <= numax)
            .map(l => ({
                nu: l[0], S: l[1], gamma_air: l[2],
                E_lower: l[3], n_air: l[4], delta_air: l[5],
            }));

        const T_ref = 296.0;
        const c2 = 1.4387769;
        const T = layer.T;
        for (const line of filtered) {
            const boltzmann = Math.exp(-c2 * line.E_lower / T) / Math.exp(-c2 * line.E_lower / T_ref);
            const stimulated = (1 - Math.exp(-c2 * line.nu / T)) / (1 - Math.exp(-c2 * line.nu / T_ref));
            const ratio = T_ref / T;
            line.S_T = line.S * boltzmann * stimulated * ratio;
            line.gamma_T = line.gamma_air * layer.P * Math.pow(T_ref / T, line.n_air);
        }
        return filtered;
    }

    // --- Plot ---

    plot() {
        const [numin, numax] = this.getNuRange();
        const plotType = this.plotTypeSelect.value;

        for (const layer of this.layers) {
            if (layer.enabled) {
                layer.lines = this.computeLayerLines(layer, numin, numax);
            } else {
                layer.lines = [];
            }
        }

        this.plotState = { numin, numax, plotType };
        this.draw();
        this.updateStats();
        this.updateTable();
        this.updateLegend();
    }

    draw() {
        const { numin, numax, plotType } = this.plotState;
        const ctx = this.ctx;
        const w = this.displayWidth;
        const h = this.displayHeight;
        const m = { top: 20, right: 30, bottom: 50, left: 70 };
        const pw = w - m.left - m.right;
        const ph = h - m.top - m.bottom;

        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, w, h);

        const activeLayers = this.layers.filter(l => l.enabled && l.lines.length > 0);

        if (activeLayers.length === 0) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No lines in this range', w / 2, h / 2);
            this.drawAxes(ctx, m, pw, ph, numin, numax, plotType);
            return;
        }

        const logScale = this.yScaleSelect.value === 'log';

        if (plotType === 'stick') {
            let allS = [];
            for (const layer of activeLayers) {
                allS.push(...layer.lines.map(l => l.S_T).filter(s => s > 0));
            }

            let autoMin, autoMax;
            if (logScale) {
                autoMax = Math.log10(Math.max(...allS));
                autoMin = Math.log10(Math.min(...allS)) - 0.5;
            } else {
                autoMax = Math.max(...allS);
                autoMin = 0;
            }
            const [yMin, yMax] = this.getYRange(autoMin, autoMax);

            for (const layer of activeLayers) {
                this.drawStick(ctx, m, pw, ph, numin, numax, layer, yMin, yMax, logScale);
            }
        } else {
            const nPoints = Math.min(pw * 2, 2000);
            const dnu = (numax - numin) / nPoints;
            const sigmas = [];
            let autoMax = 0;

            for (const layer of activeLayers) {
                const sigma = new Float64Array(nPoints);
                for (const line of layer.lines) {
                    const gamma = line.gamma_T;
                    for (let i = 0; i < nPoints; i++) {
                        const nu = numin + i * dnu;
                        const diff = nu - line.nu;
                        sigma[i] += (line.S_T / Math.PI) * (gamma / (diff * diff + gamma * gamma));
                    }
                }
                let layerMax = 0;
                for (let i = 0; i < nPoints; i++) {
                    if (sigma[i] > layerMax) layerMax = sigma[i];
                }
                if (layerMax > autoMax) autoMax = layerMax;
                sigmas.push(sigma);
            }

            const [, yMax] = this.getYRange(0, autoMax);

            if (yMax > 0) {
                for (let li = 0; li < activeLayers.length; li++) {
                    this.drawCrossSection(ctx, m, pw, ph, nPoints, sigmas[li], yMax, activeLayers[li]);
                }
            }
        }

        this.drawAxes(ctx, m, pw, ph, numin, numax, plotType);
    }

    drawStick(ctx, m, pw, ph, numin, numax, layer, yMin, yMax, logScale) {
        const color = this.getLayerColor(layer);

        for (const line of layer.lines) {
            if (line.S_T <= 0) continue;
            const x = this.nuToX(line.nu, m, pw, numin, numax);
            let yFrac;
            if (logScale) {
                const logS = Math.log10(line.S_T);
                yFrac = Math.max(0, (logS - yMin) / (yMax - yMin));
            } else {
                yFrac = Math.max(0, (line.S_T - yMin) / (yMax - yMin));
            }
            const y = m.top + ph - yFrac * ph;

            ctx.strokeStyle = color.line;
            ctx.globalAlpha = 0.5 + yFrac * 0.5;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x, m.top + ph);
            ctx.lineTo(x, y);
            ctx.stroke();

            ctx.globalAlpha = 1;
            ctx.fillStyle = color.line;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    drawCrossSection(ctx, m, pw, ph, nPoints, sigma, globalMax, layer) {
        const color = this.getLayerColor(layer);
        const wl = this.isWavelength();

        // Filled area
        const r = parseInt(color.line.length === 7 ? color.line.slice(1, 3) : 'ff', 16);
        const g = parseInt(color.line.length === 7 ? color.line.slice(3, 5) : 'ff', 16);
        const b = parseInt(color.line.length === 7 ? color.line.slice(5, 7) : 'ff', 16);
        const gradient = ctx.createLinearGradient(0, m.top, 0, m.top + ph);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.02)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(m.left, m.top + ph);
        for (let px = 0; px < nPoints; px++) {
            const idx = wl ? nPoints - 1 - px : px;
            const x = m.left + (px / nPoints) * pw;
            const y = m.top + ph - (sigma[idx] / globalMax) * ph;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(m.left + pw, m.top + ph);
        ctx.closePath();
        ctx.fill();

        // Line
        ctx.strokeStyle = color.line;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let px = 0; px < nPoints; px++) {
            const idx = wl ? nPoints - 1 - px : px;
            const x = m.left + (px / nPoints) * pw;
            const y = m.top + ph - (sigma[idx] / globalMax) * ph;
            if (px === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    drawAxes(ctx, m, pw, ph, numin, numax, plotType) {
        const wl = this.isWavelength();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(m.left, m.top + ph);
        ctx.lineTo(m.left + pw, m.top + ph);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(m.left, m.top);
        ctx.lineTo(m.left, m.top + ph);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        const nTicks = 8;
        for (let i = 0; i <= nTicks; i++) {
            const x = m.left + (i / nTicks) * pw;
            const nu = wl
                ? numax - (i / nTicks) * (numax - numin)
                : numin + (i / nTicks) * (numax - numin);
            ctx.beginPath();
            ctx.moveTo(x, m.top + ph);
            ctx.lineTo(x, m.top + ph + 5);
            ctx.stroke();
            ctx.fillText(wl ? (10000 / nu).toFixed(2) : nu.toFixed(1), x, m.top + ph + 18);

            if (i > 0 && i < nTicks) {
                ctx.strokeStyle = '#1e293b';
                ctx.beginPath();
                ctx.moveTo(x, m.top);
                ctx.lineTo(x, m.top + ph);
                ctx.stroke();
                ctx.strokeStyle = '#334155';
            }
        }

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText(wl ? 'Wavelength (μm)' : 'Wavenumber (cm⁻¹)', m.left + pw / 2, m.top + ph + 40);

        ctx.save();
        ctx.translate(15, m.top + ph / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        let yLabel;
        if (plotType === 'stick') {
            yLabel = this.yScaleSelect.value === 'log' ? 'log₁₀ Intensity' : 'Intensity (cm/molecule)';
        } else {
            yLabel = 'Cross Section (arb.)';
        }
        ctx.fillText(yLabel, 0, 0);
        ctx.restore();
    }

    // --- Hover ---

    handleHover(e) {
        if (!this.plotState) return;

        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const m = { top: 20, right: 30, bottom: 50, left: 70 };
        const pw = this.displayWidth - m.left - m.right;
        const { numin, numax } = this.plotState;

        const frac = (mx - m.left) / pw;
        const nuHover = this.isWavelength()
            ? numax - frac * (numax - numin)
            : numin + frac * (numax - numin);

        let closest = null;
        let closestLayer = null;
        let minDist = Infinity;
        for (const layer of this.layers) {
            if (!layer.enabled) continue;
            for (const line of layer.lines) {
                const dist = Math.abs(line.nu - nuHover);
                if (dist < minDist) {
                    minDist = dist;
                    closest = line;
                    closestLayer = layer;
                }
            }
        }

        const pixelDist = (minDist / (numax - numin)) * pw;
        if (closest && closestLayer && pixelDist < 20) {
            const wl = this.isWavelength();
            const color = this.getLayerColor(closestLayer);
            const db = closestLayer.db === 'hitemp' ? HITEMP_DATA : HITRAN_DATA;
            const molName = db[closestLayer.molecule]?.name || closestLayer.molecule;
            const spectralLine = wl
                ? `<strong>λ</strong> = ${(10000 / closest.nu).toFixed(4)} μm`
                : `<strong>ν</strong> = ${closest.nu.toFixed(3)} cm⁻¹`;
            this.tooltip.innerHTML =
                `<span style="color:${color.line};font-weight:bold">${molName}</span> (${closestLayer.T} K)<br>` +
                `${spectralLine}<br>` +
                `<strong>S(T)</strong> = ${closest.S_T.toExponential(3)} cm/mol<br>` +
                `<strong>γ(T,P)</strong> = ${closest.gamma_T.toFixed(4)} cm⁻¹<br>` +
                `<strong>E″</strong> = ${closest.E_lower.toFixed(1)} cm⁻¹`;

            let tx = e.clientX - rect.left + 12;
            let ty = e.clientY - rect.top - 10;
            if (tx + 200 > this.displayWidth) tx -= 220;
            this.tooltip.style.left = tx + 'px';
            this.tooltip.style.top = ty + 'px';
            this.tooltip.style.display = 'block';
        } else {
            this.tooltip.style.display = 'none';
        }
    }

    // --- Legend ---

    updateLegend() {
        const legend = document.getElementById('legend');
        const active = this.layers.filter(l => l.enabled);
        if (active.length <= 1) {
            legend.style.display = 'none';
            return;
        }
        legend.style.display = 'flex';
        legend.innerHTML = active.map(layer => {
            const color = this.getLayerColor(layer);
            const db = layer.db === 'hitemp' ? HITEMP_DATA : HITRAN_DATA;
            const molName = db[layer.molecule]?.name || layer.molecule;
            const dbLabel = layer.db === 'hitemp' ? ' [HT]' : '';
            return `<span class="legend-item">
                <span class="legend-dot" style="background:${color.line}"></span>
                ${molName}${dbLabel} ${layer.T} K
            </span>`;
        }).join('');
    }

    // --- Stats & Table ---

    updateStats() {
        const active = this.layers.filter(l => l.enabled);
        const totalLines = active.reduce((sum, l) => sum + l.lines.length, 0);

        document.querySelector('#stat-layers .stat-value').textContent = active.length;
        document.querySelector('#stat-lines .stat-value').textContent = totalLines;

        if (this.plotState) {
            const { numin, numax } = this.plotState;
            if (this.isWavelength()) {
                document.querySelector('#stat-range .stat-value').textContent =
                    `${(10000 / numax).toFixed(2)}–${(10000 / numin).toFixed(2)} μm`;
            } else {
                document.querySelector('#stat-range .stat-value').textContent =
                    `${numin}–${numax} cm⁻¹`;
            }
        }
    }

    updateTable() {
        const tbody = document.querySelector('#line-table tbody');
        tbody.innerHTML = '';

        const allLines = [];
        for (const layer of this.layers) {
            if (!layer.enabled) continue;
            const color = this.getLayerColor(layer);
            const db = layer.db === 'hitemp' ? HITEMP_DATA : HITRAN_DATA;
            const molName = db[layer.molecule]?.name || layer.molecule;
            for (const line of layer.lines) {
                allLines.push({ ...line, layerName: molName, layerT: layer.T, color: color.line });
            }
        }

        allLines.sort((a, b) => b.S_T - a.S_T);

        for (const line of allLines.slice(0, 100)) {
            const tr = document.createElement('tr');
            tr.innerHTML =
                `<td><span style="color:${line.color}">●</span> ${line.layerName} ${line.layerT}K</td>` +
                `<td>${this.formatSpectral(line.nu)}</td>` +
                `<td>${line.S_T.toExponential(3)}</td>` +
                `<td>${line.gamma_T.toFixed(4)}</td>` +
                `<td>${line.E_lower.toFixed(1)}</td>`;
            tbody.appendChild(tr);
        }
    }

    // --- Export PNG ---

    savePNG() {
        // Render at high resolution
        const dpr = window.devicePixelRatio || 1;
        const exportCanvas = document.createElement('canvas');
        const w = this.displayWidth * 2;
        const h = this.displayHeight * 2;
        exportCanvas.width = w;
        exportCanvas.height = h;
        const ctx = exportCanvas.getContext('2d');
        ctx.scale(2, 2);

        // Re-draw onto export canvas
        const origCtx = this.ctx;
        this.ctx = ctx;
        this.draw();
        this.ctx = origCtx;

        // Add legend text at top
        const active = this.layers.filter(l => l.enabled);
        if (active.length > 0) {
            ctx.font = '11px sans-serif';
            let lx = 80;
            for (const layer of active) {
                const color = this.getLayerColor(layer);
                const db = layer.db === 'hitemp' ? HITEMP_DATA : HITRAN_DATA;
                const molName = db[layer.molecule]?.name || layer.molecule;
                const dbLabel = layer.db === 'hitemp' ? ' [HT]' : '';
                const label = `${molName}${dbLabel} ${layer.T}K`;
                ctx.fillStyle = color.line;
                ctx.fillRect(lx, 6, 10, 10);
                ctx.fillStyle = '#e2e8f0';
                ctx.fillText(label, lx + 14, 15);
                lx += ctx.measureText(label).width + 30;
            }
        }

        const link = document.createElement('a');
        link.download = 'hitran-spectrum.png';
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
    }

    // --- Export XLSX ---

    saveXLSX() {
        const wl = this.isWavelength();
        const rows = [];
        const spectralHeader = wl ? 'Wavelength (um)' : 'Wavenumber (cm-1)';

        // Header
        rows.push(['Layer', 'Molecule', 'Database', 'T (K)', 'P (atm)',
            spectralHeader, 'Wavenumber (cm-1)', 'S_T (cm/molecule)', 'gamma_T (cm-1)', 'E_lower (cm-1)']);

        for (const layer of this.layers) {
            if (!layer.enabled) continue;
            const db = layer.db === 'hitemp' ? HITEMP_DATA : HITRAN_DATA;
            const molName = db[layer.molecule]?.name || layer.molecule;
            for (const line of layer.lines) {
                const spectralVal = wl ? 10000 / line.nu : line.nu;
                rows.push([
                    `${molName} ${layer.T}K`,
                    layer.molecule,
                    layer.db.toUpperCase(),
                    layer.T,
                    layer.P,
                    spectralVal,
                    line.nu,
                    line.S_T,
                    line.gamma_T,
                    line.E_lower,
                ]);
            }
        }

        // Build XLSX manually (minimal Open XML spreadsheet)
        const xlsx = this.buildXLSX(rows);
        const blob = new Blob([xlsx], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.download = 'hitran-spectrum.xlsx';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    }

    buildXLSX(rows) {
        // Minimal XLSX using JSZip-like manual construction
        // XLSX is a ZIP of XML files. We'll build it with the ZIP format manually.

        const sheetData = rows.map((row, ri) => {
            const cells = row.map((val, ci) => {
                const col = String.fromCharCode(65 + ci);
                const ref = `${col}${ri + 1}`;
                if (typeof val === 'number') {
                    return `<c r="${ref}"><v>${val}</v></c>`;
                } else {
                    const escaped = String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    return `<c r="${ref}" t="inlineStr"><is><t>${escaped}</t></is></c>`;
                }
            }).join('');
            return `<row r="${ri + 1}">${cells}</row>`;
        }).join('');

        const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>${sheetData}</sheetData></worksheet>`;

        const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Spectrum" sheetId="1" r:id="rId1"/></sheets></workbook>`;

        const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

        const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

        const wbRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

        // Build ZIP
        const files = [
            { path: '[Content_Types].xml', data: contentTypes },
            { path: '_rels/.rels', data: rels },
            { path: 'xl/workbook.xml', data: workbook },
            { path: 'xl/_rels/workbook.xml.rels', data: wbRels },
            { path: 'xl/worksheets/sheet1.xml', data: sheet },
        ];

        return this.createZip(files);
    }

    createZip(files) {
        const enc = new TextEncoder();
        const parts = [];
        const centralDir = [];
        let offset = 0;

        for (const file of files) {
            const data = enc.encode(file.data);
            const name = enc.encode(file.path);
            const crc = this.crc32(data);

            // Local file header
            const local = new Uint8Array(30 + name.length + data.length);
            const lv = new DataView(local.buffer);
            lv.setUint32(0, 0x04034b50, true); // signature
            lv.setUint16(4, 20, true); // version needed
            lv.setUint16(6, 0, true); // flags
            lv.setUint16(8, 0, true); // compression (store)
            lv.setUint16(10, 0, true); // mod time
            lv.setUint16(12, 0, true); // mod date
            lv.setUint32(14, crc, true);
            lv.setUint32(18, data.length, true); // compressed
            lv.setUint32(22, data.length, true); // uncompressed
            lv.setUint16(26, name.length, true);
            lv.setUint16(28, 0, true); // extra length
            local.set(name, 30);
            local.set(data, 30 + name.length);
            parts.push(local);

            // Central directory entry
            const cd = new Uint8Array(46 + name.length);
            const cv = new DataView(cd.buffer);
            cv.setUint32(0, 0x02014b50, true);
            cv.setUint16(4, 20, true);
            cv.setUint16(6, 20, true);
            cv.setUint16(8, 0, true);
            cv.setUint16(10, 0, true);
            cv.setUint16(12, 0, true);
            cv.setUint16(14, 0, true);
            cv.setUint32(16, crc, true);
            cv.setUint32(20, data.length, true);
            cv.setUint32(24, data.length, true);
            cv.setUint16(28, name.length, true);
            cv.setUint16(30, 0, true);
            cv.setUint16(32, 0, true);
            cv.setUint16(34, 0, true);
            cv.setUint16(36, 0, true);
            cv.setUint32(38, 0, true);
            cv.setUint32(42, offset, true);
            cd.set(name, 46);
            centralDir.push(cd);

            offset += local.length;
        }

        const cdStart = offset;
        let cdSize = 0;
        for (const cd of centralDir) cdSize += cd.length;

        // End of central directory
        const end = new Uint8Array(22);
        const ev = new DataView(end.buffer);
        ev.setUint32(0, 0x06054b50, true);
        ev.setUint16(4, 0, true);
        ev.setUint16(6, 0, true);
        ev.setUint16(8, files.length, true);
        ev.setUint16(10, files.length, true);
        ev.setUint32(12, cdSize, true);
        ev.setUint32(16, cdStart, true);
        ev.setUint16(20, 0, true);

        const total = new Uint8Array(offset + cdSize + 22);
        let pos = 0;
        for (const p of parts) { total.set(p, pos); pos += p.length; }
        for (const cd of centralDir) { total.set(cd, pos); pos += cd.length; }
        total.set(end, pos);

        return total.buffer;
    }

    crc32(data) {
        let crc = 0xFFFFFFFF;
        for (let i = 0; i < data.length; i++) {
            crc ^= data[i];
            for (let j = 0; j < 8; j++) {
                crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
            }
        }
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }
}

new HitranExplorer();
