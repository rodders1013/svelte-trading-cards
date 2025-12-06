# Font Files for Server-Side Rendering

This directory contains TTF font files used by resvg-js for server-side PNG rendering.

## Required Files

For each Google Font in `google-fonts.ts`, you need:
- `FontName-Regular.ttf` (weight 400)
- `FontName-Bold.ttf` (weight 700) - if the font supports bold

## How to Download

### Option 1: Google Fonts Website
1. Go to https://fonts.google.com
2. Search for the font (e.g., "Roboto")
3. Click "Download family"
4. Extract the TTF files to this directory

### Option 2: google-webfonts-helper (Recommended)
1. Go to https://gwfh.mranftl.com/fonts
2. Search for the font
3. Select weights 400 and 700
4. Download as TTF
5. Extract to this directory

### Option 3: Direct Download Script
```bash
# Example for Roboto
curl -o Roboto-Regular.ttf "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf"
curl -o Roboto-Bold.ttf "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf"
```

## File Naming Convention

Use the exact font name with weight suffix:
- `Roboto-Regular.ttf`
- `Roboto-Bold.ttf`
- `OpenSans-Regular.ttf`
- `OpenSans-Bold.ttf`
- `PlayfairDisplay-Regular.ttf`
- `PlayfairDisplay-Bold.ttf`

## Fonts to Download

Based on `google-fonts.ts`:

### Sans-Serif
- Roboto (Regular, Bold)
- Open Sans (Regular, Bold)
- Lato (Regular, Bold)
- Montserrat (Regular, Bold)
- Poppins (Regular, Bold)
- Nunito (Regular, Bold)
- Raleway (Regular, Bold)

### Serif
- Playfair Display (Regular, Bold)
- Merriweather (Regular, Bold)
- Lora (Regular, Bold)
- Crimson Text (Regular, Bold)

### Display
- Oswald (Regular, Bold)
- Bebas Neue (Regular only)
- Anton (Regular only)
- Righteous (Regular only)
- Bangers (Regular only)
- Permanent Marker (Regular only)
- Russo One (Regular only)
- Black Ops One (Regular only)
- Bungee (Regular only)
- Orbitron (Regular, Bold)
- Press Start 2P (Regular only)

### Monospace
- Source Code Pro (Regular, Bold)
- Fira Code (Regular, Bold)
- JetBrains Mono (Regular, Bold)

### Cursive
- Pacifico (Regular only)
- Dancing Script (Regular, Bold)
- Caveat (Regular, Bold)
- Satisfy (Regular only)
