# HITRAN Spectral Explorer

Interactive web-based tool for exploring molecular absorption spectra using data from the [HITRAN](https://hitran.org/) and HITEMP spectroscopic databases. Visualize, compare, and export infrared absorption line data for atmospheric and combustion-relevant molecules.

**Live demo:** [hitran-spectroscopy.onrender.com](https://hitran-spectroscopy.onrender.com)

![Spectral Explorer Screenshot](https://img.shields.io/badge/status-active-brightgreen)

## Features

### Multi-Layer Spectra
Overlay multiple molecular spectra on a single plot. Each layer has independent controls for:
- **Molecule** — CO₂, H₂O, CH₄, O₃, NO
- **Database** — HITRAN (296 K reference) or HITEMP (high-temperature line lists)
- **Temperature** — 150–5000 K with Boltzmann/stimulated emission intensity scaling
- **Pressure** — 0.001–100 atm with pressure-broadened Lorentz linewidths
- **Color** — fully customizable per layer via color picker

### Plot Modes
- **Cross Section** — Lorentz-broadened absorption profiles computed on a 2000-point grid
- **Stick Spectrum** — individual transition lines with logarithmic or linear intensity scale

### Spectral Units
Toggle between **wavenumber (cm⁻¹)** and **wavelength (μm)** for all inputs, axes, tooltips, and table data.

### Scene Presets (Additive Toggle)
Click to add layers, click again to remove. Stack multiple presets to build complex scenes:

| Preset | Layers | Use Case |
|--------|--------|----------|
| Combustion Effluent | NO + CO₂ + H₂O at 1500 K (HITEMP) | Exhaust gas monitoring, CEMS |
| Ambient Atmosphere | CO₂ + H₂O at 296 K | Atmospheric transmission baseline |
| NO: Ambient vs Hot | NO at 296 K vs 1500 K | Hot band emergence visualization |
| Greenhouse Gases | CO₂ + CH₄ + H₂O at 296 K | Radiative forcing, climate science |
| Atmospheric Window + O₃ | O₃ at 220 K / 0.01 atm + CO₂ | Satellite remote sensing (10 μm window) |
| CH₄ Leak Detection | CH₄ + H₂O at 296 K | TDLAS sensor design (3 μm ν₃ band) |

### Y-Axis Scale Control
- Log / linear toggle for both plot modes
- Lock the Y-axis range with manual min/max inputs
- Useful for comparing spectra across different conditions without auto-rescaling

### Export
- **PNG** — high-resolution (2x) chart image with embedded legend
- **XLSX** — full line data spreadsheet (molecule, database, T, P, line parameters) built client-side with zero dependencies

### Interactive
- Hover tooltips showing line parameters (position, intensity at T, broadened width, lower state energy)
- Per-layer color-coded data table sorted by intensity
- On-chart legend for multi-layer views

## Physics

Line intensities are scaled from the 296 K reference using:

```
S(T) = S(296) × [Q(296)/Q(T)] × exp(-c₂E″/T) / exp(-c₂E″/296) × [1-exp(-c₂ν/T)] / [1-exp(-c₂ν/296)]
```

Pressure-broadened half-widths use the temperature-dependent Lorentz model:

```
γ(T,P) = γ_air × P × (296/T)^n_air
```

Cross sections are computed as summed Lorentz profiles:

```
σ(ν) = Σ [S_i(T) / π] × γ_i / [(ν - ν_i)² + γ_i²]
```

Where `c₂ = 1.4388 cm·K` (second radiation constant).

## HITEMP Data

The HITEMP database extends HITRAN with hot band transitions that are negligible at room temperature but dominate at combustion temperatures. The NO HITEMP data includes:

- **v=1←0** fundamental band (~1850–1940 cm⁻¹)
- **v=2←1** hot band (~1817–1901 cm⁻¹, E″ ~1720–2106 cm⁻¹)
- **v=3←2** hot band (~1782–1844 cm⁻¹, E″ ~3728–4085 cm⁻¹)
- **v=4←3** hot band (~1752–1799 cm⁻¹, E″ ~5612–5929 cm⁻¹)

## Tech Stack

Vanilla HTML, CSS, and JavaScript — no build tools, no frameworks, no external dependencies. The XLSX export builds valid Open XML spreadsheets from scratch using a manual ZIP implementation with CRC-32.

## Running Locally

Open `index.html` in a browser, or serve with any static file server:

```bash
python3 -m http.server 8000
```

## License

MIT
