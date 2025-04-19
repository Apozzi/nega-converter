# Negaconverter
**Advanced Numeric Base Converter with Complex & Negative Base Support**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/seuuser/seurepo/blob/main/LICENSE)
[![Marko](https://img.shields.io/badge/marko-1)](https://markojs.com/)
[![Live Demo](https://img.shields.io/badge/try_live-demo-brightgreen)](https://seusite.com?from=-2&to=2i&input=1010)


![Capturar](https://github.com/user-attachments/assets/e027768b-c322-4006-ae22-34a97bc6f53b)

A mathematical tool that converts numbers between unconventional numeral systems:

- **Negative bases** (e.g., -2/Negabinary)
- **Complex bases** (e.g., 2i/Quater-imaginary)
- **Direct URL sharing** with preconfigured conversions

## Features

### Base Support
| Type              | Examples         | Digits Range     |
|-------------------|------------------|------------------|
| Negative Integer  | -2, -10, -16     | 0 to (abs(base)-1) |
| Complex           | 1+i, -1+i, 2i    | Norm ≤ 36        |

### URL Parameters (Optional)
| Parameter         |	Example          |	Description     |
|-------------------|------------------|------------------|
| from              |	?from=-2         |	Source base     |
| to                |	&to=2i           |	Target base     |
| input             |	&input=42        |	Value to convert|


# Installing/Running

```
git clone https://github.com/Apozzi/nega-converter.git
cd negaconverter
npm install
npm run dev
```

- TODO: BETTER DESCRIPTION
- TODO: DEPLOYMENT
